import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CreditCard,
  ImagePlus,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  Palette,
  Save,
  Search,
  ShoppingBag,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { adminApi, type AdminProduct, type AdminSession, type DashboardPayload } from "@/lib/admin-api";

type SectionKey = "overview" | "products" | "orders" | "payments" | "customers" | "content" | "banners";

type ContentItem = {
  id: number;
  contentKey: string;
  section: string;
  title: string | null;
  content: string | null;
  contentJson: unknown;
  isPublished: boolean;
};

type BannerItem = {
  id: number;
  label: string | null;
  headline: string;
  body: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  isActive: boolean;
  sortOrder: number;
};

const navItems: Array<{ key: SectionKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "customers", label: "Customers", icon: Users },
  { key: "content", label: "Content", icon: Palette },
  { key: "banners", label: "Banners", icon: Sparkles },
];

const defaultProductForm = {
  id: undefined as number | undefined,
  title: "",
  slug: "",
  description: "",
  stylingTips: "",
  primaryTag: "",
  categoryId: null as number | null,
  price: 0,
  salePrice: null as number | null,
  stockQuantity: 0,
  status: "active",
  featured: false,
  coverImageUrl: "",
  coverImageKey: "",
  tags: "",
  sizes: "S, M, L, XL",
  colors: "",
  metadata: "{}",
  imageUrls: "",
};

const defaultBannerForm = {
  id: undefined as number | undefined,
  label: "",
  headline: "",
  body: "",
  imageUrl: "",
  imageKey: "",
  ctaLabel: "",
  ctaHref: "",
  isActive: true,
  sortOrder: 0,
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringifyJson(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2);
}

function badgeClass(active: boolean) {
  return active
    ? "border border-[#c5a13b]/30 bg-[#c5a13b]/15 text-[#8a6c17]"
    : "border border-black/10 bg-black/5 text-black/60 dark:border-white/10 dark:bg-white/5 dark:text-[#e6dfcb]/70";
}

export default function Admin() {
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [passcode, setPasscode] = useState("");
  const [bootstrap, setBootstrap] = useState<{ passcodeConfigured: boolean } | null>(null);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Array<Record<string, unknown>>>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [payments, setPayments] = useState<Array<Record<string, unknown>>>([]);
  const [customers, setCustomers] = useState<Array<Record<string, unknown>>>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [query, setQuery] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingContentKey, setSavingContentKey] = useState<string | null>(null);
  const [savingBanner, setSavingBanner] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [bannerForm, setBannerForm] = useState(defaultBannerForm);
  const [contentDrafts, setContentDrafts] = useState<Record<string, { content: string; contentJson: string }>>({});

  useEffect(() => {
    let alive = true;

    async function bootstrapAdmin() {
      try {
        const [boot, sessionPayload] = await Promise.all([adminApi.bootstrap(), adminApi.getSession()]);
        if (!alive) return;
        setBootstrap(boot);
        setSession(sessionPayload.session);
      } catch (error) {
        if (!alive) return;
        toast.error(error instanceof Error ? error.message : "Could not load ABDAN admin.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    bootstrapAdmin();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    let alive = true;
    async function loadWorkspace() {
      try {
        const [dashboardData, productData, categoryData, orderData, customerData, paymentData, contentData, bannerData] =
          await Promise.all([
            adminApi.getDashboard(),
            adminApi.getProducts(),
            adminApi.getCategories(),
            adminApi.getOrders(),
            adminApi.getCustomers(),
            adminApi.getPayments(),
            adminApi.getContent(),
            adminApi.getBanners(),
          ]);

        if (!alive) return;
        setDashboard(dashboardData);
        setProducts(productData);
        setCategories(categoryData);
        setOrders(orderData);
        setCustomers(customerData);
        setPayments(paymentData);
        setContentBlocks(contentData as ContentItem[]);
        setBanners((bannerData as BannerItem[]).map((item) => ({ ...item, isActive: Boolean(item.isActive) })));
      } catch (error) {
        if (!alive) return;
        toast.error(error instanceof Error ? error.message : "Could not load the ABDAN workspace.");
      }
    }

    loadWorkspace();
    return () => {
      alive = false;
    };
  }, [session]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const normalized = query.toLowerCase();
    return products.filter((product) => {
      return [product.title, product.primaryTag, product.categoryName, product.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized));
    });
  }, [products, query]);

  function hydrateProductForm(product: AdminProduct) {
    setProductForm({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description || "",
      stylingTips: product.stylingTips || "",
      primaryTag: product.primaryTag || "",
      categoryId: product.categoryId,
      price: product.price,
      salePrice: product.salePrice,
      stockQuantity: product.stockQuantity,
      status: product.status,
      featured: product.featured,
      coverImageUrl: product.coverImageUrl || "",
      coverImageKey: product.coverImageKey || "",
      tags: product.tags.join(", "),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      metadata: stringifyJson(product.metadata),
      imageUrls: product.images.map((image) => image.url).join(", "),
    });
    setActiveSection("products");
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    try {
      const result = await adminApi.login(passcode);
      setSession(result.session);
      setPasscode("");
      toast.success("Welcome to the ABDAN control room.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin sign-in failed.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await adminApi.logout();
      setSession(null);
      toast.success("Admin session closed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed.");
    }
  }

  async function refreshWorkspace() {
    if (!session) return;
    const [dashboardData, productData, categoryData, orderData, customerData, paymentData, contentData, bannerData] =
      await Promise.all([
        adminApi.getDashboard(),
        adminApi.getProducts(),
        adminApi.getCategories(),
        adminApi.getOrders(),
        adminApi.getCustomers(),
        adminApi.getPayments(),
        adminApi.getContent(),
        adminApi.getBanners(),
      ]);

    setDashboard(dashboardData);
    setProducts(productData);
    setCategories(categoryData);
    setOrders(orderData);
    setCustomers(customerData);
    setPayments(paymentData);
    setContentBlocks(contentData as ContentItem[]);
    setBanners((bannerData as BannerItem[]).map((item) => ({ ...item, isActive: Boolean(item.isActive) })));
  }

  async function handleProductSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        id: productForm.id,
        title: productForm.title,
        slug: productForm.slug,
        description: productForm.description,
        stylingTips: productForm.stylingTips,
        primaryTag: productForm.primaryTag,
        categoryId: productForm.categoryId,
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
        stockQuantity: Number(productForm.stockQuantity),
        status: productForm.status,
        featured: productForm.featured,
        coverImageUrl: productForm.coverImageUrl || null,
        coverImageKey: productForm.coverImageKey || null,
        tags: parseList(productForm.tags),
        sizes: parseList(productForm.sizes),
        colors: parseList(productForm.colors),
        metadata: productForm.metadata.trim() ? JSON.parse(productForm.metadata) : {},
        imageUrls: parseList(productForm.imageUrls),
      };

      await adminApi.saveProduct(payload);
      await refreshWorkspace();
      setProductForm(defaultProductForm);
      toast.success("Product saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the product.");
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleArchiveProduct(id: number) {
    try {
      await adminApi.archiveProduct(id);
      await refreshWorkspace();
      toast.success("Product archived.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not archive the product.");
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const result = await adminApi.uploadFiles(files);
      const urls = result.uploads.map((item) => item.url);
      setProductForm((current) => ({
        ...current,
        coverImageUrl: current.coverImageUrl || urls[0] || current.coverImageUrl,
        imageUrls: [current.imageUrls, ...urls].filter(Boolean).join(", "),
      }));
      toast.success("Images uploaded to ABDAN storage.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleOrderStatus(id: number, field: "status" | "paymentStatus", value: string) {
    try {
      await adminApi.updateOrder(id, { [field]: value });
      await refreshWorkspace();
      toast.success("Order updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the order.");
    }
  }

  async function handlePaymentStatus(id: number, value: string) {
    try {
      await adminApi.updatePayment(id, { status: value });
      await refreshWorkspace();
      toast.success("Payment updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the payment.");
    }
  }

  async function handleContentSave(item: ContentItem) {
    setSavingContentKey(item.contentKey);
    try {
      const draft = contentDrafts[item.contentKey];
      await adminApi.updateContent(item.contentKey, {
        section: item.section,
        title: item.title,
        content: draft ? draft.content : item.content,
        contentJson: draft?.contentJson?.trim() ? JSON.parse(draft.contentJson) : item.contentJson,
        isPublished: item.isPublished,
      });
      await refreshWorkspace();
      toast.success("Content updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update content.");
    } finally {
      setSavingContentKey(null);
    }
  }

  async function handleBannerSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingBanner(true);
    try {
      await adminApi.saveBanner({
        ...bannerForm,
        label: bannerForm.label || null,
        body: bannerForm.body || null,
        imageUrl: bannerForm.imageUrl || null,
        imageKey: bannerForm.imageKey || null,
        ctaLabel: bannerForm.ctaLabel || null,
        ctaHref: bannerForm.ctaHref || null,
      });
      await refreshWorkspace();
      setBannerForm(defaultBannerForm);
      toast.success("Banner saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the banner.");
    } finally {
      setSavingBanner(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ec] text-[#023d3a] dark:bg-[#072a28] dark:text-[#f8f5ec]">
        <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm shadow-[0_20px_60px_rgba(2,61,58,0.12)] backdrop-blur dark:border-white/10 dark:bg-white/10">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing the ABDAN control room...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f8f5ec] px-4 py-10 text-[#023d3a] dark:bg-[#072a28] dark:text-[#f8f5ec] sm:px-6">
        <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-[#c5a13b]/20 bg-white/70 p-8 shadow-[0_30px_80px_rgba(2,61,58,0.10)] backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-10">
            <p className="text-xs uppercase tracking-[0.36em] text-[#c5a13b]">ABDAN Admin</p>
            <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.94] tracking-[-0.04em] text-[#023d3a] dark:text-[#f8f5ec] sm:text-6xl">
              Luxury operations, held with the same calm as the brand.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#023d3a]/70 dark:text-[#e6dfcb]/78">
              Manage products, orders, payments, customers, brand messaging, hero banners, and merchandising from a secure editorial workspace designed for ABDAN's premium operating rhythm.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Commerce", "Products, stock, pricing, and storytelling aligned in one place."],
                ["Trust", "Payment review, customer oversight, and order confidence."],
                ["Editorial", "Homepage copy, FAQs, banners, and brand signals."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/90 p-5 dark:border-white/10 dark:bg-[#0f3431]">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#023d3a]/65 dark:text-[#e6dfcb]/72">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-[#023d3a] p-8 text-[#f8f5ec] shadow-[0_35px_90px_rgba(2,61,58,0.28)] sm:p-10">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-[#e6dfcb] transition hover:border-white/20 hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" /> Back to store
              </button>
              <div className={`rounded-full px-3 py-1 text-xs ${badgeClass(Boolean(bootstrap?.passcodeConfigured)).replace("text-black/60", "text-[#e6dfcb]")}`}>
                {bootstrap?.passcodeConfigured ? "Secure login ready" : "Secret required"}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-sm uppercase tracking-[0.32em] text-[#c5a13b]">Protected access</p>
              <h2 className="mt-4 text-3xl font-semibold">Enter the admin passcode</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-[#e6dfcb]/75">
                Use the project secret named <span className="font-semibold text-[#f8f5ec]">ADMIN_PANEL_PASSCODE</span>. This keeps the ABDAN control room private while using the platform's built-in backend stack.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <label className="block text-sm text-[#e6dfcb]">
                Admin passcode
                <input
                  type="password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  className="mt-2 w-full rounded-[1.25rem] border border-white/12 bg-white/7 px-4 py-4 text-base text-[#f8f5ec] outline-none transition placeholder:text-[#e6dfcb]/45 focus:border-[#c5a13b]/60 focus:bg-white/10"
                  placeholder="Enter your secure passcode"
                />
              </label>
              <button
                type="submit"
                disabled={authLoading || !bootstrap?.passcodeConfigured}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-[#c5a13b] px-5 py-4 text-sm font-semibold text-[#083532] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LayoutDashboard className="h-4 w-4" />}
                Enter control room
              </button>
            </form>

            {!bootstrap?.passcodeConfigured ? (
              <div className="mt-6 rounded-[1.5rem] border border-[#c5a13b]/30 bg-[#c5a13b]/10 p-4 text-sm leading-7 text-[#f8f5ec]">
                Add the secret <span className="font-semibold">ADMIN_PANEL_PASSCODE</span> in project settings to activate secure admin access.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ec] text-[#023d3a] dark:bg-[#072a28] dark:text-[#f8f5ec]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="rounded-[2rem] border border-black/8 bg-white/70 p-5 shadow-[0_25px_70px_rgba(2,61,58,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-[#c5a13b]">ABDAN Admin</p>
              <h1 className="mt-3 text-2xl font-semibold">Control room</h1>
              <p className="mt-2 text-sm text-[#023d3a]/65 dark:text-[#e6dfcb]/72">Premium operations for products, trust, and storytelling.</p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] bg-[#023d3a] p-4 text-[#f8f5ec] shadow-[0_18px_45px_rgba(2,61,58,0.26)]">
            <p className="text-sm text-[#c5a13b]">Signed in as</p>
            <p className="mt-2 text-lg font-semibold">{session.name}</p>
            <p className="text-sm text-[#e6dfcb]/72">{session.role}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-[#023d3a] text-[#f8f5ec] shadow-[0_18px_36px_rgba(2,61,58,0.18)]"
                      : "text-[#023d3a]/72 hover:bg-black/5 dark:text-[#e6dfcb]/78 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
              <ArrowLeft className="h-4 w-4" /> View storefront
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </aside>

        <main className="min-w-0 space-y-6">
          <header className="rounded-[2rem] border border-black/8 bg-white/70 p-5 shadow-[0_25px_70px_rgba(2,61,58,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-[#c5a13b]">{theme} mode</p>
                <h2 className="mt-3 text-3xl font-semibold">Manage a calm, premium operating rhythm.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[#023d3a]/68 dark:text-[#e6dfcb]/74">
                  The ABDAN admin keeps merchandising, trust, customer care, and brand storytelling aligned within one modular, mobile-ready workspace.
                </p>
              </div>
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#023d3a]/35 dark:text-[#e6dfcb]/40" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products, categories, or status"
                  className="w-full rounded-full border border-black/10 bg-[#f8f5ec] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                />
              </div>
            </div>
          </header>

          {activeSection === "overview" ? (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Products", value: dashboard?.counts.products ?? 0, icon: Package },
                  { label: "Orders", value: dashboard?.counts.orders ?? 0, icon: ShoppingBag },
                  { label: "Customers", value: dashboard?.counts.customers ?? 0, icon: Users },
                  { label: "Verified payments", value: dashboard?.counts.paidPayments ?? 0, icon: BadgeIndianRupee },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.label} className="rounded-[1.75rem] border border-black/8 bg-white/75 p-5 shadow-[0_18px_45px_rgba(2,61,58,0.07)] dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#023d3a]/62 dark:text-[#e6dfcb]/72">{item.label}</p>
                        <Icon className="h-5 w-5 text-[#c5a13b]" />
                      </div>
                      <p className="mt-6 text-4xl font-semibold tracking-[-0.04em]">{item.value}</p>
                    </article>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <article className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Revenue pulse</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-[#023d3a] p-5 text-[#f8f5ec]">
                      <p className="text-sm text-[#e6dfcb]/72">Total verified revenue</p>
                      <p className="mt-3 text-3xl font-semibold">{money(dashboard?.revenue.total ?? 0)}</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-[#c5a13b]/12 p-5">
                      <p className="text-sm text-[#023d3a]/65 dark:text-[#e6dfcb]/72">Last 30 days</p>
                      <p className="mt-3 text-3xl font-semibold">{money(dashboard?.revenue.last30Days ?? 0)}</p>
                    </div>
                  </div>
                </article>

                <article className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Operating note</p>
                  <p className="mt-4 text-sm leading-8 text-[#023d3a]/68 dark:text-[#e6dfcb]/74">
                    Use the product studio to refine storytelling, the payments desk to verify transactions, and the content studio to keep the luxury narrative aligned with every season, campaign, and devotional moment.
                  </p>
                </article>
              </div>
            </section>
          ) : null}

          {activeSection === "products" ? (
            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Product studio</p>
                    <h3 className="mt-3 text-2xl font-semibold">Merchandise with clarity</h3>
                  </div>
                  <span className="rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/10">{filteredProducts.length} visible</span>
                </div>
                <div className="mt-6 space-y-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => hydrateProductForm(product)}
                      className="flex w-full items-center gap-4 rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/85 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(2,61,58,0.08)] dark:border-white/10 dark:bg-[#0f3431]"
                    >
                      <img src={product.coverImageUrl || "https://placehold.co/120x140"} alt={product.title} className="h-20 w-16 rounded-[1rem] object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-base font-medium">{product.title}</p>
                          <span className={`rounded-full px-3 py-1 text-xs ${badgeClass(product.status === "active")}`}>{product.status}</span>
                        </div>
                        <p className="mt-1 text-sm text-[#023d3a]/62 dark:text-[#e6dfcb]/72">{product.primaryTag || product.categoryName || "Unsorted"}</p>
                        <div className="mt-3 flex items-center justify-between text-sm text-[#023d3a]/72 dark:text-[#e6dfcb]/78">
                          <span>{product.priceLabel}</span>
                          <span>{product.stockQuantity} in stock</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleProductSave} className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Editor</p>
                    <h3 className="mt-3 text-2xl font-semibold">{productForm.id ? "Update product" : "Create product"}</h3>
                  </div>
                  {productForm.id ? (
                    <button type="button" onClick={() => setProductForm(defaultProductForm)} className="text-sm text-[#023d3a]/65 dark:text-[#e6dfcb]/72">
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Title", "title"],
                    ["Slug", "slug"],
                    ["Primary tag", "primaryTag"],
                    ["Cover image URL", "coverImageUrl"],
                    ["Cover image key", "coverImageKey"],
                  ].map(([label, key]) => (
                    <label key={key} className="text-sm">
                      {label}
                      <input
                        value={String(productForm[key as keyof typeof productForm] ?? "")}
                        onChange={(event) => setProductForm((current) => ({ ...current, [key]: event.target.value }))}
                        className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                      />
                    </label>
                  ))}

                  <label className="text-sm">
                    Category
                    <select
                      value={productForm.categoryId ?? ""}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          categoryId: event.target.value ? Number(event.target.value) : null,
                        }))
                      }
                      className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                    >
                      <option value="">Choose category</option>
                      {categories.map((category) => (
                        <option key={String(category.id)} value={String(category.id)}>
                          {String(category.name)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm">
                    Status
                    <select
                      value={productForm.status}
                      onChange={(event) => setProductForm((current) => ({ ...current, status: event.target.value as typeof current.status }))}
                      className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </label>

                  <label className="text-sm">
                    Price
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(event) => setProductForm((current) => ({ ...current, price: Number(event.target.value) }))}
                      className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                    />
                  </label>

                  <label className="text-sm">
                    Sale price
                    <input
                      type="number"
                      value={productForm.salePrice ?? ""}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          salePrice: event.target.value ? Number(event.target.value) : null,
                        }))
                      }
                      className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                    />
                  </label>

                  <label className="text-sm">
                    Stock quantity
                    <input
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={(event) => setProductForm((current) => ({ ...current, stockQuantity: Number(event.target.value) }))}
                      className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="text-sm">
                    Sizes (comma separated)
                    <input value={productForm.sizes} onChange={(event) => setProductForm((current) => ({ ...current, sizes: event.target.value }))} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                  </label>
                  <label className="text-sm">
                    Colours (comma separated)
                    <input value={productForm.colors} onChange={(event) => setProductForm((current) => ({ ...current, colors: event.target.value }))} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                  </label>
                  <label className="text-sm">
                    Tags (comma separated)
                    <input value={productForm.tags} onChange={(event) => setProductForm((current) => ({ ...current, tags: event.target.value }))} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                  </label>
                  <label className="flex items-center gap-3 rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-4 text-sm dark:border-white/10 dark:bg-[#0f3431]">
                    <input type="checkbox" checked={productForm.featured} onChange={(event) => setProductForm((current) => ({ ...current, featured: event.target.checked }))} />
                    Feature on dashboard and merchandising lists
                  </label>
                </div>

                <label className="mt-4 block text-sm">
                  Description
                  <textarea value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                </label>
                <label className="mt-4 block text-sm">
                  Styling tips
                  <textarea value={productForm.stylingTips} onChange={(event) => setProductForm((current) => ({ ...current, stylingTips: event.target.value }))} rows={3} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                </label>
                <label className="mt-4 block text-sm">
                  Additional image URLs (comma separated)
                  <textarea value={productForm.imageUrls} onChange={(event) => setProductForm((current) => ({ ...current, imageUrls: event.target.value }))} rows={3} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                </label>
                <label className="mt-4 block text-sm">
                  Metadata JSON
                  <textarea value={productForm.metadata} onChange={(event) => setProductForm((current) => ({ ...current, metadata: event.target.value }))} rows={5} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 font-mono text-xs outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                </label>

                <div className="mt-4 rounded-[1.3rem] border border-dashed border-[#c5a13b]/45 bg-[#c5a13b]/8 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium">Image uploads</p>
                      <p className="mt-1 text-xs leading-6 text-[#023d3a]/62 dark:text-[#e6dfcb]/72">
                        Upload multiple product images to built-in storage and append them automatically to the form.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#023d3a] px-4 py-2 text-sm text-[#f8f5ec]">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload images
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="submit" disabled={savingProduct} className="inline-flex items-center gap-2 rounded-full bg-[#023d3a] px-5 py-3 text-sm font-medium text-[#f8f5ec] disabled:opacity-60">
                    {savingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save product
                  </button>
                  {productForm.id ? (
                    <button type="button" onClick={() => handleArchiveProduct(productForm.id!)} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm dark:border-white/10">
                      Archive product
                    </button>
                  ) : null}
                </div>
              </form>
            </section>
          ) : null}

          {activeSection === "orders" ? (
            <section className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Orders desk</p>
              <div className="mt-6 space-y-3">
                {orders.length ? orders.map((order) => (
                  <article key={String(order.id)} className="rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/85 p-4 dark:border-white/10 dark:bg-[#0f3431]">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-base font-medium">{String(order.orderNumber || `Order #${order.id}`)}</p>
                        <p className="mt-1 text-sm text-[#023d3a]/62 dark:text-[#e6dfcb]/72">{String(order.customerName || "Guest customer")}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <select value={String(order.status || "pending")} onChange={(event) => handleOrderStatus(Number(order.id), "status", event.target.value)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-[#072a28]">
                          {['pending','paid','confirmed','preparing','dispatched','delivered','cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <select value={String(order.paymentStatus || "pending")} onChange={(event) => handleOrderStatus(Number(order.id), "paymentStatus", event.target.value)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-[#072a28]">
                          {['pending','paid','verified','failed','refunded','manual_review'].map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-[#023d3a]/68 dark:text-[#e6dfcb]/74 md:grid-cols-4">
                      <span>Total: {money(Number(order.total || 0))}</span>
                      <span>Method: {String(order.paymentMethod || "Unspecified")}</span>
                      <span>Created: {String(order.createdAt || "—")}</span>
                      <span>Phone: {String(order.customerPhone || "—")}</span>
                    </div>
                  </article>
                )) : <div className="rounded-[1.5rem] border border-dashed border-black/10 p-6 text-sm dark:border-white/10">Orders will appear here once live checkout capture is connected.</div>}
              </div>
            </section>
          ) : null}

          {activeSection === "payments" ? (
            <section className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Payments desk</p>
              <div className="mt-6 space-y-3">
                {payments.length ? payments.map((payment) => (
                  <article key={String(payment.id)} className="rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/85 p-4 dark:border-white/10 dark:bg-[#0f3431]">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-base font-medium">{String(payment.orderNumber || `Payment #${payment.id}`)}</p>
                        <p className="mt-1 text-sm text-[#023d3a]/62 dark:text-[#e6dfcb]/72">{money(Number(payment.amount || 0))}</p>
                      </div>
                      <select value={String(payment.status || "pending")} onChange={(event) => handlePaymentStatus(Number(payment.id), event.target.value)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-[#072a28]">
                        {['pending','paid','verified','failed','refunded'].map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-[#023d3a]/68 dark:text-[#e6dfcb]/74 md:grid-cols-3">
                      <span>Provider: {String(payment.provider || 'Manual')}</span>
                      <span>Method: {String(payment.method || 'UPI')}</span>
                      <span>Created: {String(payment.createdAt || '—')}</span>
                    </div>
                  </article>
                )) : <div className="rounded-[1.5rem] border border-dashed border-black/10 p-6 text-sm dark:border-white/10">Payments will appear here once checkout verification is connected to persistent order records.</div>}
              </div>
            </section>
          ) : null}

          {activeSection === "customers" ? (
            <section className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Customers</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {customers.length ? customers.map((customer) => (
                  <article key={String(customer.id)} className="rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/85 p-5 dark:border-white/10 dark:bg-[#0f3431]">
                    <p className="text-lg font-medium">{String(customer.name || "Guest customer")}</p>
                    <div className="mt-4 space-y-2 text-sm text-[#023d3a]/68 dark:text-[#e6dfcb]/74">
                      <p>Email: {String(customer.email || "—")}</p>
                      <p>Phone: {String(customer.phone || "—")}</p>
                      <p>Last order: {String(customer.latestOrderAt || "No orders yet")}</p>
                    </div>
                  </article>
                )) : <div className="rounded-[1.5rem] border border-dashed border-black/10 p-6 text-sm dark:border-white/10">Customer profiles will populate here as transactions are recorded.</div>}
              </div>
            </section>
          ) : null}

          {activeSection === "content" ? (
            <section className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Content studio</p>
              <div className="mt-6 space-y-4">
                {contentBlocks.map((item) => {
                  const draft = contentDrafts[item.contentKey] || {
                    content: item.content || "",
                    contentJson: stringifyJson(item.contentJson),
                  };

                  return (
                    <article key={item.contentKey} className="rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/85 p-5 dark:border-white/10 dark:bg-[#0f3431]">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-[#c5a13b]">{item.section}</p>
                          <h3 className="mt-2 text-lg font-medium">{item.title || item.contentKey}</h3>
                        </div>
                        <button type="button" onClick={() => handleContentSave(item)} disabled={savingContentKey === item.contentKey} className="inline-flex items-center gap-2 rounded-full bg-[#023d3a] px-4 py-2 text-sm text-[#f8f5ec] disabled:opacity-60">
                          {savingContentKey === item.contentKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save block
                        </button>
                      </div>
                      <label className="mt-4 block text-sm">
                        Rich text content
                        <textarea value={draft.content} onChange={(event) => setContentDrafts((current) => ({ ...current, [item.contentKey]: { ...draft, content: event.target.value } }))} rows={4} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-white px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#072a28]" />
                      </label>
                      <label className="mt-4 block text-sm">
                        JSON payload
                        <textarea value={draft.contentJson} onChange={(event) => setContentDrafts((current) => ({ ...current, [item.contentKey]: { ...draft, contentJson: event.target.value } }))} rows={5} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-white px-4 py-3 font-mono text-xs outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#072a28]" />
                      </label>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {activeSection === "banners" ? (
            <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Hero banners</p>
                <div className="mt-6 space-y-3">
                  {banners.map((banner) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => setBannerForm({
                        id: banner.id,
                        label: banner.label || "",
                        headline: banner.headline,
                        body: banner.body || "",
                        imageUrl: banner.imageUrl || "",
                        imageKey: banner.imageKey || "",
                        ctaLabel: banner.ctaLabel || "",
                        ctaHref: banner.ctaHref || "",
                        isActive: banner.isActive,
                        sortOrder: banner.sortOrder,
                      })}
                      className="w-full rounded-[1.5rem] border border-black/8 bg-[#f8f5ec]/85 p-4 text-left dark:border-white/10 dark:bg-[#0f3431]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-[#c5a13b]">{banner.label || "Banner"}</p>
                          <h3 className="mt-2 text-lg font-medium">{banner.headline}</h3>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${badgeClass(banner.isActive)}`}>{banner.isActive ? "Active" : "Hidden"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleBannerSave} className="rounded-[1.9rem] border border-black/8 bg-white/75 p-6 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#c5a13b]">Banner editor</p>
                    <h3 className="mt-3 text-2xl font-semibold">Compose a hero moment</h3>
                  </div>
                  <ImagePlus className="h-5 w-5 text-[#c5a13b]" />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Label", "label"],
                    ["Headline", "headline"],
                    ["Image URL", "imageUrl"],
                    ["Image key", "imageKey"],
                    ["CTA label", "ctaLabel"],
                    ["CTA href", "ctaHref"],
                  ].map(([label, key]) => (
                    <label key={key} className="text-sm">
                      {label}
                      <input value={String(bannerForm[key as keyof typeof bannerForm] ?? "")} onChange={(event) => setBannerForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                    </label>
                  ))}
                  <label className="text-sm">
                    Sort order
                    <input type="number" value={bannerForm.sortOrder} onChange={(event) => setBannerForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                  </label>
                  <label className="flex items-center gap-3 rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-4 text-sm dark:border-white/10 dark:bg-[#0f3431]">
                    <input type="checkbox" checked={bannerForm.isActive} onChange={(event) => setBannerForm((current) => ({ ...current, isActive: event.target.checked }))} />
                    Active banner
                  </label>
                </div>
                <label className="mt-4 block text-sm">
                  Body copy
                  <textarea value={bannerForm.body} onChange={(event) => setBannerForm((current) => ({ ...current, body: event.target.value }))} rows={5} className="mt-2 w-full rounded-[1rem] border border-black/10 bg-[#f8f5ec] px-4 py-3 outline-none focus:border-[#c5a13b] dark:border-white/10 dark:bg-[#0f3431]" />
                </label>
                <div className="mt-6 flex gap-3">
                  <button type="submit" disabled={savingBanner} className="inline-flex items-center gap-2 rounded-full bg-[#023d3a] px-5 py-3 text-sm text-[#f8f5ec] disabled:opacity-60">
                    {savingBanner ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save banner
                  </button>
                  <button type="button" onClick={() => setBannerForm(defaultBannerForm)} className="rounded-full border border-black/10 px-5 py-3 text-sm dark:border-white/10">
                    Reset
                  </button>
                </div>
              </form>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
