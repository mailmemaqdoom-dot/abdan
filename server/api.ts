import express from "express";
import multer from "multer";
import { z } from "zod";
import { BRAND, FAQS, PRODUCTS, TERMS, TRUST_BAR_ITEMS } from "../client/src/data/abdan";
import {
  appendSessionCookie,
  clearSessionCookie,
  createAdminSessionToken,
  isAdminPasscodeConfigured,
  readAdminSession,
  requireAdmin,
  verifyAdminPasscode,
  type AdminRequest,
} from "./auth";
import { execute, parseJsonColumn, queryOne, queryRows, stringifyJson, type DbRow, withTransaction } from "./db";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024, files: 8 },
});

const router = express.Router();
const ownerName = process.env.OWNER_NAME || "ABDAN Owner";
const ownerOpenId = process.env.OWNER_OPEN_ID || null;

let seedPromise: Promise<void> | null = null;

const productSchema = z.object({
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(180).optional(),
  description: z.string().max(10000).optional().nullable(),
  stylingTips: z.string().max(10000).optional().nullable(),
  primaryTag: z.string().max(120).optional().nullable(),
  categoryId: z.coerce.number().nullable().optional(),
  price: z.coerce.number().nonnegative(),
  salePrice: z.coerce.number().nonnegative().nullable().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  featured: z.boolean().default(false),
  coverImageUrl: z.string().max(2048).optional().nullable(),
  coverImageKey: z.string().max(255).optional().nullable(),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.any()).default({}),
  imageUrls: z.array(z.string().max(2048)).default([]),
});

const contentSchema = z.object({
  section: z.string().min(2).max(120),
  title: z.string().max(255).nullable().optional(),
  content: z.string().max(25000).nullable().optional(),
  contentJson: z.any().optional(),
  isPublished: z.boolean().default(true),
});

const bannerSchema = z.object({
  label: z.string().max(120).nullable().optional(),
  headline: z.string().min(2).max(255),
  body: z.string().max(5000).nullable().optional(),
  imageUrl: z.string().max(2048).nullable().optional(),
  imageKey: z.string().max(255).nullable().optional(),
  ctaLabel: z.string().max(120).nullable().optional(),
  ctaHref: z.string().max(255).nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

const orderStatusSchema = z.object({
  status: z
    .enum(["pending", "paid", "confirmed", "preparing", "dispatched", "delivered", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "verified", "failed", "refunded", "manual_review"]).optional(),
  notes: z.string().max(8000).optional().nullable(),
});

const paymentSchema = z.object({
  status: z.enum(["pending", "paid", "verified", "failed", "refunded"]),
  notes: z.string().max(8000).optional().nullable(),
});

const checkoutItemSchema = z.object({
  productId: z.string().min(1).max(180),
  name: z.string().min(2).max(255),
  priceLabel: z.string().min(1).max(80),
  size: z.string().min(1).max(80),
  color: z.string().min(1).max(120),
  quantity: z.coerce.number().int().positive().max(10),
  image: z.string().max(2048),
});

const storefrontCheckoutSchema = z.object({
  source: z.enum(["product", "bag"]).default("product"),
  customer: z.object({
    name: z.string().min(2).max(120),
    phone: z.string().min(8).max(24),
    email: z.string().email().max(320).optional().or(z.literal("")).transform((value) => value || ""),
    notes: z.string().max(2000).optional().or(z.literal("")).transform((value) => value || ""),
  }),
  payment: z.object({
    provider: z.enum(["razorpay", "upi", "manual"]).default("upi"),
    method: z.enum(["razorpay", "upi"]).default("upi"),
    reference: z.string().max(255).optional().nullable(),
  }),
  items: z.array(checkoutItemSchema).min(1),
  totals: z.object({
    subtotal: z.coerce.number().nonnegative(),
    total: z.coerce.number().nonnegative(),
    currency: z.string().min(3).max(8).default("INR"),
  }),
});

const storefrontPaymentConfirmationSchema = z.object({
  orderId: z.coerce.number().int().positive(),
  provider: z.enum(["razorpay", "upi", "manual"]).default("razorpay"),
  method: z.enum(["razorpay", "upi"]).default("razorpay"),
  providerPaymentId: z.string().min(4).max(255),
  reference: z.string().max(255).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function parsePriceLabel(priceLabel: string) {
  const digits = priceLabel.replace(/[^\d.]/g, "");
  return Number(digits || 0);
}

function splitColors(colorValue: string) {
  return colorValue
    .split(/\band\b|,/i)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function publicStorageUrl(key?: string | null, fallback?: string | null) {
  if (key) return `/manus-storage/${key}`;
  return fallback || "";
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").slice(0, 24);
}

function createOrderNumber() {
  return `ABD-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
}

async function createStorefrontCheckout(payload: z.infer<typeof storefrontCheckoutSchema>) {
  return await withTransaction(async (connection) => {
    const normalizedPhone = normalizePhone(payload.customer.phone);
    const normalizedEmail = payload.customer.email.trim().toLowerCase() || null;
    const customerName = payload.customer.name.trim();
    const customerNotes = payload.customer.notes.trim() || null;
    const computedSubtotal = payload.items.reduce(
      (sum, item) => sum + parsePriceLabel(item.priceLabel) * item.quantity,
      0,
    );
    const subtotal = computedSubtotal || payload.totals.subtotal;
    const total = payload.totals.total || subtotal;
    const currency = (payload.totals.currency || "INR").toUpperCase();
    const orderNumber = createOrderNumber();

    const itemSlugs = payload.items.map((item) => slugify(item.productId));
    const placeholders = itemSlugs.map(() => "?").join(",");
    const [matchedProducts] = await connection.query<DbRow[]>(
      `SELECT id, slug, title, coverImageUrl, coverImageKey FROM products WHERE slug IN (${placeholders})`,
      itemSlugs,
    );
    const productMap = new Map(matchedProducts.map((product) => [String(product.slug), product]));

    let existingCustomer = await connection.query<DbRow[]>(
      `SELECT * FROM customers WHERE phone = ? LIMIT 1`,
      [normalizedPhone],
    );
    let customerRow = existingCustomer[0]?.[0] ?? null;

    if (!customerRow && normalizedEmail) {
      const [emailMatch] = await connection.query<DbRow[]>(
        `SELECT * FROM customers WHERE email = ? LIMIT 1`,
        [normalizedEmail],
      );
      customerRow = emailMatch[0] ?? null;
    }

    let customerId = Number(customerRow?.id || 0);

    if (customerId) {
      await connection.execute(
        `UPDATE customers SET name = ?, phone = ?, email = ?, notes = COALESCE(?, notes), updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [customerName, normalizedPhone, normalizedEmail, customerNotes, customerId],
      );
    } else {
      const [insertedCustomer] = await connection.execute(
        `INSERT INTO customers (name, phone, email, ordersCount, totalSpend, notes) VALUES (?, ?, ?, 0, 0, ?)`,
        [customerName, normalizedPhone, normalizedEmail, customerNotes],
      );
      customerId = Number((insertedCustomer as { insertId?: number }).insertId || 0);
    }

    const orderSummary = payload.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      priceLabel: item.priceLabel,
    }));

    const initialOrderPaymentStatus = payload.payment.method === "upi" ? "manual_review" : "pending";
    const initialPaymentRecordStatus = "pending";
    const paymentProvider = payload.payment.method === "upi" ? "upi_manual" : "razorpay";

    const [insertedOrder] = await connection.execute(
      `INSERT INTO orders (
         orderNumber, customerId, status, paymentStatus, subtotal, total, currency, shippingAddress, itemsSummary, notes
       ) VALUES (?, ?, 'pending', ?, ?, ?, ?, NULL, ?, ?)`,
      [
        orderNumber,
        customerId,
        initialOrderPaymentStatus,
        subtotal,
        total,
        currency,
        stringifyJson(orderSummary),
        stringifyJson({
          customerNote: customerNotes,
          checkoutSource: payload.source,
        }),
      ],
    );
    const orderId = Number((insertedOrder as { insertId?: number }).insertId || 0);

    for (const item of payload.items) {
      const product = productMap.get(slugify(item.productId));
      const unitPrice = parsePriceLabel(item.priceLabel);
      const lineTotal = unitPrice * item.quantity;
      await connection.execute(
        `INSERT INTO order_items (
           orderId, productId, productTitle, imageUrl, size, color, unitPrice, quantity, lineTotal, snapshot
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          product?.id ? Number(product.id) : null,
          item.name,
          publicStorageUrl((product?.coverImageKey as string | null) ?? null, (product?.coverImageUrl as string | null) ?? item.image),
          item.size,
          item.color,
          unitPrice,
          item.quantity,
          lineTotal,
          stringifyJson({
            source: payload.source,
            storefrontProductId: item.productId,
            customer: { name: customerName, phone: normalizedPhone, email: normalizedEmail },
            item,
          }),
        ],
      );
    }

    const [insertedPayment] = await connection.execute(
      `INSERT INTO payments (
         orderId, provider, method, status, amount, currency, providerPaymentId, providerOrderId, reference, notes, metadata, verifiedByAdminId
       ) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, NULL)`,
      [
        orderId,
        paymentProvider,
        payload.payment.method,
        initialPaymentRecordStatus,
        total,
        currency,
        payload.payment.reference ?? null,
        customerNotes,
        stringifyJson({
          source: payload.source,
          customer: { name: customerName, phone: normalizedPhone, email: normalizedEmail },
          items: payload.items,
        }),
      ],
    );

    await connection.execute(
      `UPDATE customers
       SET ordersCount = (SELECT COUNT(*) FROM orders WHERE customerId = ?),
           totalSpend = (SELECT COALESCE(SUM(total), 0) FROM orders WHERE customerId = ?),
           updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [customerId, customerId, customerId],
    );

    return {
      ok: true as const,
      orderId,
      orderNumber,
      paymentId: Number((insertedPayment as { insertId?: number }).insertId || 0),
      paymentStatus: initialOrderPaymentStatus,
      total,
      formattedTotal: formatMoney(total),
      customer: {
        id: customerId,
        name: customerName,
        phone: normalizedPhone,
        email: normalizedEmail,
      },
    };
  });
}

async function confirmStorefrontPayment(payload: z.infer<typeof storefrontPaymentConfirmationSchema>) {
  return await withTransaction(async (connection) => {
    await connection.execute(
      `UPDATE payments
       SET provider = ?, method = ?, status = 'paid', providerPaymentId = ?, reference = COALESCE(?, reference), notes = COALESCE(?, notes), metadata = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE orderId = ?
       ORDER BY id DESC
       LIMIT 1`,
      [
        payload.provider === "upi" ? "upi_manual" : payload.provider,
        payload.method,
        payload.providerPaymentId,
        payload.reference ?? null,
        payload.notes ?? null,
        stringifyJson(payload.metadata ?? {}),
        payload.orderId,
      ],
    );

    await connection.execute(
      `UPDATE orders SET paymentStatus = 'paid', status = CASE WHEN status = 'pending' THEN 'paid' ELSE status END, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [payload.orderId],
    );

    const [orderRows] = await connection.query<DbRow[]>(
      `SELECT id, orderNumber FROM orders WHERE id = ? LIMIT 1`,
      [payload.orderId],
    );
    const order = orderRows[0] ?? null;

    return {
      ok: true as const,
      orderId: payload.orderId,
      orderNumber: order?.orderNumber ? String(order.orderNumber) : null,
      paymentId: payload.providerPaymentId,
    };
  });
}

async function ensureOwnerAdmin() {
  if (ownerOpenId) {
    await execute(
      `INSERT INTO admin_users (openId, name, role, isActive)
       VALUES (?, ?, 'owner', 1)
       ON DUPLICATE KEY UPDATE name = VALUES(name), role = 'owner', isActive = 1`,
      [ownerOpenId, ownerName],
    );

    return await queryOne<DbRow>("SELECT * FROM admin_users WHERE openId = ? LIMIT 1", [ownerOpenId]);
  }

  await execute(
    `INSERT INTO admin_users (name, role, isActive)
     SELECT ?, 'owner', 1 FROM DUAL
     WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE role = 'owner' LIMIT 1)`,
    [ownerName],
  );

  return await queryOne<DbRow>("SELECT * FROM admin_users WHERE role = 'owner' ORDER BY id ASC LIMIT 1");
}

async function upsertContentBlock(contentKey: string, payload: { section: string; title?: string | null; content?: string | null; contentJson?: unknown }) {
  await execute(
    `INSERT INTO content_blocks (contentKey, section, title, content, contentJson, isPublished)
     VALUES (?, ?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE
       section = VALUES(section),
       title = VALUES(title),
       content = VALUES(content),
       contentJson = VALUES(contentJson),
       isPublished = 1`,
    [contentKey, payload.section, payload.title ?? null, payload.content ?? null, stringifyJson(payload.contentJson ?? null)],
  );
}

async function ensureSeedData() {
  if (!seedPromise) {
    seedPromise = (async () => {
      await ensureOwnerAdmin();

      const existingProducts = await queryOne<DbRow>("SELECT COUNT(*) AS count FROM products LIMIT 1");
      const productCount = Number(existingProducts?.count || 0);

      const categoryIds = new Map<string, number>();
      for (const categoryName of Array.from(new Set(PRODUCTS.map((product) => product.primaryTag)))) {
        const slug = slugify(categoryName);
        await execute(
          `INSERT INTO categories (name, slug, description, displayOrder, isActive)
           VALUES (?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
          [categoryName, slug, `${categoryName} selections curated for the ABDAN woman.`, PRODUCTS.findIndex((product) => product.primaryTag === categoryName)],
        );
        const category = await queryOne<DbRow>("SELECT id FROM categories WHERE slug = ? LIMIT 1", [slug]);
        if (category?.id) {
          categoryIds.set(categoryName, Number(category.id));
        }
      }

      if (productCount === 0) {
        for (const product of PRODUCTS) {
          const categoryId = categoryIds.get(product.primaryTag) ?? null;
          const result = await execute(
            `INSERT INTO products (
               slug, title, description, stylingTips, primaryTag, tags, sizes, colors,
               price, salePrice, stockQuantity, coverImageUrl, coverImageKey, categoryId,
               status, featured, metadata
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
             ON DUPLICATE KEY UPDATE
               title = VALUES(title),
               description = VALUES(description),
               stylingTips = VALUES(stylingTips),
               primaryTag = VALUES(primaryTag),
               tags = VALUES(tags),
               sizes = VALUES(sizes),
               colors = VALUES(colors),
               price = VALUES(price),
               salePrice = VALUES(salePrice),
               stockQuantity = VALUES(stockQuantity),
               coverImageUrl = VALUES(coverImageUrl),
               coverImageKey = VALUES(coverImageKey),
               categoryId = VALUES(categoryId),
               status = VALUES(status),
               featured = VALUES(featured),
               metadata = VALUES(metadata)`,
            [
              slugify(product.id),
              product.name,
              product.description || product.soul,
              product.styling || "",
              product.primaryTag,
              stringifyJson([product.primaryTag, product.secondaryTags.occasion, product.secondaryTags.emotion]),
              stringifyJson((product.specs.find(([label]) => /sizes?/i.test(label))?.[1]?.split(/,\s*/) || ["S", "M", "L", "XL"]).filter(Boolean)),
              stringifyJson(splitColors(product.color)),
              parsePriceLabel(product.priceLabel),
              null,
              12,
              product.image,
              product.image.startsWith("/manus-storage/") ? product.image.replace("/manus-storage/", "") : null,
              categoryId,
              product.primaryTag === "Heritage Moments",
              stringifyJson({
                history: product.history,
                soul: product.soul,
                specs: product.specs,
                primaryTag: product.primaryTag,
                secondaryTags: product.secondaryTags,
                priceLabel: product.priceLabel,
                whatsappQuery: product.whatsappQuery,
              }),
            ],
          );

          const productId = Number(result.insertId || (await queryOne<DbRow>("SELECT id FROM products WHERE slug = ? LIMIT 1", [slugify(product.id)]))?.id || 0);
          if (productId) {
            await execute(
              `INSERT INTO product_images (productId, storageKey, url, altText, sortOrder)
               VALUES (?, ?, ?, ?, 0)
               ON DUPLICATE KEY UPDATE url = VALUES(url), altText = VALUES(altText)`,
              [productId, product.image.startsWith("/manus-storage/") ? product.image.replace("/manus-storage/", "") : null, product.image, product.name],
            );
          }
        }
      }

      await upsertContentBlock("brand.tagline", {
        section: "brand",
        title: "Brand tagline",
        content: BRAND.tagline,
      });
      await upsertContentBlock("homepage.hero", {
        section: "homepage",
        title: "Hero copy",
        content:
          "A calmer way to feel beautiful, seen, and fully yourself. ABDAN is an emotional modest-fashion experience for women who carry devotion with grace.",
      });
      await upsertContentBlock("homepage.faqs", {
        section: "homepage",
        title: "Frequently asked questions",
        contentJson: FAQS,
      });
      await upsertContentBlock("footer.terms", {
        section: "footer",
        title: "Terms and expectations",
        contentJson: TERMS,
      });
      await upsertContentBlock("brand.trust", {
        section: "brand",
        title: "Trust bar",
        contentJson: TRUST_BAR_ITEMS,
      });

      const bannerCount = await queryOne<DbRow>("SELECT COUNT(*) AS count FROM hero_banners LIMIT 1");
      if (Number(bannerCount?.count || 0) === 0) {
        await execute(
          `INSERT INTO hero_banners (label, headline, body, imageUrl, imageKey, ctaLabel, ctaHref, isActive, sortOrder)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)`,
          [
            "Your Devotion Meets Style",
            "A calmer way to feel beautiful, seen, and fully yourself.",
            "ABDAN curates modest fashion with softness, trust, and the elegance of thoughtful guidance from first glance to final delivery.",
            BRAND.heroImage,
            null,
            "Enter the collection",
            "#products",
          ],
        );
      }
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }

  await seedPromise;
}

type ProductRow = DbRow & {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  stylingTips: string | null;
  primaryTag: string | null;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  categoryId: number | null;
  categoryName?: string | null;
  status: string;
  featured: number;
  tags: string | null;
  sizes: string | null;
  colors: string | null;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProductImageRow = DbRow & {
  id: number;
  productId: number;
  storageKey: string | null;
  url: string;
  altText: string | null;
  sortOrder: number;
};

async function listProducts() {
  const rows = await queryRows<ProductRow>(
    `SELECT p.*, c.name AS categoryName
     FROM products p
     LEFT JOIN categories c ON c.id = p.categoryId
     ORDER BY p.featured DESC, p.updatedAt DESC`,
  );

  if (!rows.length) return [];

  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(",");
  const imageRows = await queryRows<ProductImageRow>(
    `SELECT * FROM product_images WHERE productId IN (${placeholders}) ORDER BY sortOrder ASC, id ASC`,
    ids,
  );

  const imageMap = new Map<number, ProductImageRow[]>();
  for (const image of imageRows) {
    const list = imageMap.get(image.productId) || [];
    list.push(image);
    imageMap.set(image.productId, list);
  }

  return rows.map((row) => {
    const metadata = parseJsonColumn<Record<string, unknown>>(row.metadata, {});
    const images = (imageMap.get(row.id) || []).map((image) => ({
      id: image.id,
      url: publicStorageUrl(image.storageKey, image.url),
      storageKey: image.storageKey,
      altText: image.altText,
      sortOrder: image.sortOrder,
    }));

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      stylingTips: row.stylingTips,
      primaryTag: row.primaryTag,
      categoryId: row.categoryId,
      categoryName: row.categoryName ?? null,
      price: row.price,
      salePrice: row.salePrice,
      priceLabel: formatMoney(row.salePrice || row.price),
      stockQuantity: row.stockQuantity,
      coverImageUrl: publicStorageUrl(row.coverImageKey, row.coverImageUrl),
      coverImageKey: row.coverImageKey,
      status: row.status,
      featured: Boolean(row.featured),
      tags: parseJsonColumn<string[]>(row.tags, []),
      sizes: parseJsonColumn<string[]>(row.sizes, []),
      colors: parseJsonColumn<string[]>(row.colors, []),
      metadata,
      images,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });
}

async function listCategories() {
  return await queryRows<DbRow>(
    `SELECT id, name, slug, description, displayOrder, isActive, createdAt, updatedAt
     FROM categories
     ORDER BY displayOrder ASC, name ASC`,
  );
}

async function listOrders() {
  return await queryRows<DbRow>(
    `SELECT o.*, c.name AS customerName, c.phone AS customerPhone, c.email AS customerEmail
     FROM orders o
     LEFT JOIN customers c ON c.id = o.customerId
     ORDER BY o.createdAt DESC`,
  );
}

async function listCustomers() {
  return await queryRows<DbRow>(
    `SELECT c.*, MAX(o.createdAt) AS latestOrderAt
     FROM customers c
     LEFT JOIN orders o ON o.customerId = c.id
     GROUP BY c.id
     ORDER BY c.updatedAt DESC`,
  );
}

async function listPayments() {
  return await queryRows<DbRow>(
    `SELECT p.*, o.orderNumber
     FROM payments p
     LEFT JOIN orders o ON o.id = p.orderId
     ORDER BY p.createdAt DESC`,
  );
}

async function listContentBlocks() {
  const rows = await queryRows<DbRow>(
    `SELECT id, contentKey, section, title, content, contentJson, isPublished, createdAt, updatedAt
     FROM content_blocks
     ORDER BY section ASC, contentKey ASC`,
  );

  return rows.map((row) => ({
    ...row,
    isPublished: Boolean(row.isPublished),
    contentJson: parseJsonColumn(row.contentJson, null),
  }));
}

async function listBanners() {
  return await queryRows<DbRow>(
    `SELECT id, label, headline, body, imageUrl, imageKey, ctaLabel, ctaHref, isActive, sortOrder, createdAt, updatedAt
     FROM hero_banners
     ORDER BY sortOrder ASC, id ASC`,
  );
}

async function getDashboardData() {
  const [counts, revenue, recentOrders, recentPayments] = await Promise.all([
    queryOne<DbRow>(
      `SELECT
         (SELECT COUNT(*) FROM products) AS productCount,
         (SELECT COUNT(*) FROM orders) AS orderCount,
         (SELECT COUNT(*) FROM customers) AS customerCount,
         (SELECT COUNT(*) FROM payments WHERE status IN ('paid','verified')) AS paidPayments`,
    ),
    queryOne<DbRow>(
      `SELECT
         COALESCE(SUM(total), 0) AS totalRevenue,
         COALESCE(SUM(CASE WHEN DATE(createdAt) >= CURRENT_DATE - INTERVAL 30 DAY THEN total ELSE 0 END), 0) AS thirtyDayRevenue
       FROM orders
       WHERE paymentStatus IN ('paid','verified')`,
    ),
    queryRows<DbRow>(
      `SELECT o.id, o.orderNumber, o.status, o.paymentStatus, o.total, o.createdAt, c.name AS customerName
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customerId
       ORDER BY o.createdAt DESC
       LIMIT 6`,
    ),
    queryRows<DbRow>(
      `SELECT p.id, p.provider, p.method, p.status, p.amount, p.createdAt, o.orderNumber
       FROM payments p
       LEFT JOIN orders o ON o.id = p.orderId
       ORDER BY p.createdAt DESC
       LIMIT 6`,
    ),
  ]);

  return {
    counts: {
      products: Number(counts?.productCount || 0),
      orders: Number(counts?.orderCount || 0),
      customers: Number(counts?.customerCount || 0),
      paidPayments: Number(counts?.paidPayments || 0),
    },
    revenue: {
      total: Number(revenue?.totalRevenue || 0),
      last30Days: Number(revenue?.thirtyDayRevenue || 0),
    },
    recentOrders,
    recentPayments,
  };
}

async function uploadBufferToStorage(file: Express.Multer.File, folder = "products") {
  const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!forgeBaseUrl || !forgeKey) {
    throw new Error("Built-in storage is not configured for uploads.");
  }

  const key = `${folder}/${Date.now()}-${slugify(file.originalname || "upload")}`;
  const presignUrl = new URL("v1/storage/presign/put", `${forgeBaseUrl}/`);
  presignUrl.searchParams.set("path", key);

  const presignResponse = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` },
  });

  if (!presignResponse.ok) {
    throw new Error("Could not prepare storage upload.");
  }

  const uploadTarget = (await presignResponse.json()) as { url?: string; headers?: Record<string, string> };
  if (!uploadTarget.url) {
    throw new Error("Storage upload target was empty.");
  }

  const uploadResponse = await fetch(uploadTarget.url, {
    method: "PUT",
    headers: {
      "Content-Type": file.mimetype || "application/octet-stream",
      ...(uploadTarget.headers || {}),
    },
    body: file.buffer,
  });

  if (!uploadResponse.ok) {
    throw new Error("File upload failed.");
  }

  return {
    key,
    url: `/manus-storage/${key}`,
  };
}

router.use(async (_req, _res, next) => {
  try {
    await ensureSeedData();
    next();
  } catch (error) {
    next(error);
  }
});

router.get("/health", (_req, res) => {
  res.json({ ok: true, area: "abdan-admin" });
});

router.get("/storefront", async (_req, res, next) => {
  try {
    const [products, contentBlocks, banners] = await Promise.all([listProducts(), listContentBlocks(), listBanners()]);
    res.json({
      brand: {
        name: BRAND.name,
        tagline: BRAND.tagline,
        whatsappUrl: BRAND.whatsappUrl,
        instagramUrl: BRAND.instagramUrl,
        facebookUrl: BRAND.facebookUrl,
        channelUrl: BRAND.channelUrl,
        callUrl: BRAND.callUrl,
        upiLink: BRAND.upiLink,
        upiId: BRAND.upiId,
        logoPrimary: BRAND.logoPrimary,
        logoSecondary: BRAND.logoSecondary,
        qrImage: BRAND.qrImage,
      },
      products,
      contentBlocks,
      banners,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/storefront/checkout", express.json({ limit: "2mb" }), async (req, res, next) => {
  try {
    const payload = storefrontCheckoutSchema.parse(req.body);
    res.status(201).json(await createStorefrontCheckout(payload));
  } catch (error) {
    next(error);
  }
});

router.post("/storefront/payments/confirm", express.json({ limit: "1mb" }), async (req, res, next) => {
  try {
    const payload = storefrontPaymentConfirmationSchema.parse(req.body);
    res.json(await confirmStorefrontPayment(payload));
  } catch (error) {
    next(error);
  }
});

router.get("/admin/bootstrap", async (_req, res) => {
  res.json({
    passcodeConfigured: isAdminPasscodeConfigured(),
  });
});

router.get("/admin/session", async (req, res) => {
  const session = await readAdminSession(req);
  res.json({ session });
});

router.post("/admin/auth/login", express.json(), async (req, res, next) => {
  try {
    const body = z.object({ passcode: z.string().min(4) }).parse(req.body);

    if (!isAdminPasscodeConfigured()) {
      res.status(503).json({
        message: "Admin access is not configured yet. Add ADMIN_PANEL_PASSCODE in project secrets first.",
      });
      return;
    }

    if (!verifyAdminPasscode(body.passcode)) {
      res.status(401).json({ message: "The admin passcode is incorrect." });
      return;
    }

    const admin = await ensureOwnerAdmin();
    if (!admin) {
      res.status(500).json({ message: "ABDAN admin bootstrap failed." });
      return;
    }

    await execute("UPDATE admin_users SET lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?", [admin.id]);

    const sessionToken = await createAdminSessionToken({
      adminId: Number(admin.id),
      name: String(admin.name || ownerName),
      role: (admin.role as "owner" | "admin" | "editor" | "support") || "owner",
      email: (admin.email as string | null) || null,
    });

    appendSessionCookie(res, sessionToken);
    res.json({
      session: {
        adminId: Number(admin.id),
        name: String(admin.name || ownerName),
        role: (admin.role as string) || "owner",
        email: (admin.email as string | null) || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/admin/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await getDashboardData());
  } catch (error) {
    next(error);
  }
});

router.get("/admin/categories", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listCategories());
  } catch (error) {
    next(error);
  }
});

router.get("/admin/products", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listProducts());
  } catch (error) {
    next(error);
  }
});

router.get("/admin/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const products = await listProducts();
    const product = products.find((item) => item.id === Number(req.params.id));
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/admin/products", requireAdmin, express.json({ limit: "2mb" }), async (req, res, next) => {
  try {
    const payload = productSchema.parse(req.body);
    const slug = payload.slug?.trim() || slugify(payload.title);

    const result = await execute(
      `INSERT INTO products (
         slug, title, description, stylingTips, primaryTag, tags, sizes, colors, price, salePrice,
         stockQuantity, coverImageUrl, coverImageKey, categoryId, status, featured, metadata
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        slug,
        payload.title,
        payload.description ?? null,
        payload.stylingTips ?? null,
        payload.primaryTag ?? null,
        stringifyJson(payload.tags),
        stringifyJson(payload.sizes),
        stringifyJson(payload.colors),
        payload.price,
        payload.salePrice ?? null,
        payload.stockQuantity,
        payload.coverImageUrl ?? null,
        payload.coverImageKey ?? null,
        payload.categoryId ?? null,
        payload.status,
        payload.featured ? 1 : 0,
        stringifyJson(payload.metadata),
      ],
    );

    const productId = Number(result.insertId);
    if (payload.imageUrls.length) {
      for (let index = 0; index < payload.imageUrls.length; index += 1) {
        const url = payload.imageUrls[index]!;
        await execute(
          `INSERT INTO product_images (productId, storageKey, url, altText, sortOrder)
           VALUES (?, NULL, ?, ?, ?)`,
          [productId, url, payload.title, index],
        );
      }
    }

    res.status(201).json({ ok: true, productId });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/products/:id", requireAdmin, express.json({ limit: "2mb" }), async (req, res, next) => {
  try {
    const payload = productSchema.parse(req.body);
    const productId = Number(req.params.id);

    await execute(
      `UPDATE products SET
         slug = ?,
         title = ?,
         description = ?,
         stylingTips = ?,
         primaryTag = ?,
         tags = ?,
         sizes = ?,
         colors = ?,
         price = ?,
         salePrice = ?,
         stockQuantity = ?,
         coverImageUrl = ?,
         coverImageKey = ?,
         categoryId = ?,
         status = ?,
         featured = ?,
         metadata = ?
       WHERE id = ?`,
      [
        payload.slug?.trim() || slugify(payload.title),
        payload.title,
        payload.description ?? null,
        payload.stylingTips ?? null,
        payload.primaryTag ?? null,
        stringifyJson(payload.tags),
        stringifyJson(payload.sizes),
        stringifyJson(payload.colors),
        payload.price,
        payload.salePrice ?? null,
        payload.stockQuantity,
        payload.coverImageUrl ?? null,
        payload.coverImageKey ?? null,
        payload.categoryId ?? null,
        payload.status,
        payload.featured ? 1 : 0,
        stringifyJson(payload.metadata),
        productId,
      ],
    );

    if (payload.imageUrls.length) {
      await execute("DELETE FROM product_images WHERE productId = ?", [productId]);
      for (let index = 0; index < payload.imageUrls.length; index += 1) {
        const url = payload.imageUrls[index]!;
        await execute(
          `INSERT INTO product_images (productId, storageKey, url, altText, sortOrder)
           VALUES (?, NULL, ?, ?, ?)`,
          [productId, url, payload.title, index],
        );
      }
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/admin/products/:id", requireAdmin, async (req, res, next) => {
  try {
    await execute(`UPDATE products SET status = 'archived' WHERE id = ?`, [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/admin/uploads", requireAdmin, upload.array("files", 8), async (req, res, next) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    if (!files.length) {
      res.status(400).json({ message: "Please choose at least one image to upload." });
      return;
    }

    const uploads = [] as Array<{ key: string; url: string; name: string }>;
    for (const file of files) {
      const stored = await uploadBufferToStorage(file, "abdan-products");
      uploads.push({ key: stored.key, url: stored.url, name: file.originalname });
    }

    res.status(201).json({ uploads });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/orders", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listOrders());
  } catch (error) {
    next(error);
  }
});

router.patch("/admin/orders/:id", requireAdmin, express.json({ limit: "1mb" }), async (req: AdminRequest, res, next) => {
  try {
    const payload = orderStatusSchema.parse(req.body);
    await execute(
      `UPDATE orders SET
         status = COALESCE(?, status),
         paymentStatus = COALESCE(?, paymentStatus),
         notes = COALESCE(?, notes)
       WHERE id = ?`,
      [payload.status ?? null, payload.paymentStatus ?? null, payload.notes ?? null, Number(req.params.id)],
    );
    res.json({ ok: true, updatedBy: req.adminSession?.name || ownerName });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/customers", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listCustomers());
  } catch (error) {
    next(error);
  }
});

router.get("/admin/payments", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listPayments());
  } catch (error) {
    next(error);
  }
});

router.patch("/admin/payments/:id", requireAdmin, express.json({ limit: "1mb" }), async (req: AdminRequest, res, next) => {
  try {
    const payload = paymentSchema.parse(req.body);
    await execute(
      `UPDATE payments SET status = ?, notes = COALESCE(?, notes), verifiedAt = CASE WHEN ? IN ('paid','verified') THEN CURRENT_TIMESTAMP ELSE verifiedAt END, verifiedByAdminId = ? WHERE id = ?`,
      [payload.status, payload.notes ?? null, payload.status, req.adminSession?.adminId ?? null, Number(req.params.id)],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/content", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listContentBlocks());
  } catch (error) {
    next(error);
  }
});

router.put("/admin/content/:contentKey", requireAdmin, express.json({ limit: "2mb" }), async (req: AdminRequest, res, next) => {
  try {
    const payload = contentSchema.parse(req.body);
    await execute(
      `UPDATE content_blocks SET section = ?, title = ?, content = ?, contentJson = ?, isPublished = ?, updatedByAdminId = ? WHERE contentKey = ?`,
      [
        payload.section,
        payload.title ?? null,
        payload.content ?? null,
        stringifyJson(payload.contentJson ?? null),
        payload.isPublished ? 1 : 0,
        req.adminSession?.adminId ?? null,
        req.params.contentKey,
      ],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/banners", requireAdmin, async (_req, res, next) => {
  try {
    res.json(await listBanners());
  } catch (error) {
    next(error);
  }
});

router.post("/admin/banners", requireAdmin, express.json({ limit: "2mb" }), async (req, res, next) => {
  try {
    const payload = bannerSchema.parse(req.body);
    const result = await execute(
      `INSERT INTO hero_banners (label, headline, body, imageUrl, imageKey, ctaLabel, ctaHref, isActive, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.label ?? null,
        payload.headline,
        payload.body ?? null,
        payload.imageUrl ?? null,
        payload.imageKey ?? null,
        payload.ctaLabel ?? null,
        payload.ctaHref ?? null,
        payload.isActive ? 1 : 0,
        payload.sortOrder,
      ],
    );
    res.status(201).json({ ok: true, bannerId: Number(result.insertId) });
  } catch (error) {
    next(error);
  }
});

router.put("/admin/banners/:id", requireAdmin, express.json({ limit: "2mb" }), async (req, res, next) => {
  try {
    const payload = bannerSchema.parse(req.body);
    await execute(
      `UPDATE hero_banners SET label = ?, headline = ?, body = ?, imageUrl = ?, imageKey = ?, ctaLabel = ?, ctaHref = ?, isActive = ?, sortOrder = ? WHERE id = ?`,
      [
        payload.label ?? null,
        payload.headline,
        payload.body ?? null,
        payload.imageUrl ?? null,
        payload.imageKey ?? null,
        payload.ctaLabel ?? null,
        payload.ctaHref ?? null,
        payload.isActive ? 1 : 0,
        payload.sortOrder,
        Number(req.params.id),
      ],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  const message = error instanceof Error ? error.message : "Unexpected ABDAN admin server error.";
  res.status(500).json({ message });
});

export { ensureSeedData };
export default router;
