const BRAND = {
  name: "ABDAN",
  tagline: "Your Devotion Meets Style",
  whatsappNumber: "918760595307",
  whatsappUrl: "https://wa.me/918760595307",
  telegramUrl: "https://t.me/+918760595307",
  instagramUrl: "https://www.instagram.com/mailme.nmcollections",
  facebookUrl: "https://www.facebook.com/share/173kbKas2c/",
  channelUrl: "https://whatsapp.com/channel/0029Vb6NK8AChq6PXxF7rB0F",
  callUrl: "tel:+918760595307",
  upiLink: "upi://pay?pa=mailme.maqdoom@okhdfcbank&pn=ABDAN&cu=INR",
  upiId: "mailme.maqdoom@okhdfcbank",
  razorpayKey: "rzp_live_SkPERat9HcpiCb",
};

const FILTERS = ["All", "Heritage Moments", "Everyday Grace", "Festive Glow"];
const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = ["Ivory", "Emerald", "Crimson"];

function buildProductNarrative(product) {
  const fabric = product.specs.find(([label]) => label.includes("Fabric"))?.[1] ?? "fine fabric";
  const color = product.color || "graceful hues";
  const style = product.secondaryTags.style || "elegant design";
  const hooks = [
    `For those moments when you reach for something that holds the weight of your family’s stories, this ${product.name} feels like a warm embrace.`,
    `When the day calls for a touch of quiet brilliance, this piece in ${fabric} moves with a softness that is entirely your own.`,
    `Crafted for the woman who finds beauty in the honest details, this ${style} ${product.name} is a tribute to the grace you carry.`,
  ];
  const connections = [
    "It is woven for the woman who moves with purpose, providing an effortless presence in the kaleidoscope of her daily life.",
    "Designed to be your quiet companion through busy mornings and celebratory evenings alike, fitting perfectly into the tapestry of your journey.",
    "This is for the woman who balances a thousand tasks with a smile, offering a comfort that breathes as easily as you do.",
  ];
  const feels = [
    `The ${fabric} feels like a second skin, draped in ${color} to reflect the gentle strength you bring to every room.`,
    "Experience a presence that is both grounded and celebrated, with a texture that respects the sensitivity of your skin and spirit.",
    "It drapes with a gentle weight, allowing you to move with a confidence that is felt rather than seen.",
  ];
  const stylingTips = {
    "Heritage Moments": `A simple high-necked blouse and a soft low bun with fresh jasmine would complement this ${fabric} beautifully. It’s a timeless choice for days when you want to feel deeply connected to your roots.`,
    "Everyday Grace": `This ${style} piece pairs effortlessly with comfortable footwear for errands, lunches, and quieter celebrations. A delicate gold chain adds presence without feeling overdone.`,
    "Festive Glow": `Let the ${style} details catch the light as you move. Statement earrings and a small bindi will deepen the festive grace of this ${color} look.`,
  };
  const hash = product.name.length % 3;

  return {
    description: `${hooks[hash]} ${connections[(hash + 1) % 3]} ${feels[(hash + 2) % 3]} Every fold is a reminder of the devotion you carry in your everyday life. 💛`,
    styling:
      stylingTips[product.primaryTag] ||
      `Pair this ${style} ${product.name} with pieces that make you feel most like yourself. A touch of your favourite fragrance and a comfortable pair of sandals complete it with ease.`,
  };
}

function buildEditorialExcerpt(product) {
  const mood = product.secondaryTags.emotion?.toLowerCase() || "quiet elegance";
  const style = product.secondaryTags.style?.toLowerCase() || "considered dressing";
  return `Selected for ${mood}, ${style}, and a calmer way of getting dressed.`;
}

const PRODUCTS = [
  {
    id: "kanjivaram-silk-saree",
    name: "Kanjivaram Silk Saree",
    priceLabel: "₹8,500 onwards",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Heritage Moments",
    secondaryTags: { occasion: "Festive", emotion: "Elegant", style: "Embroidered" },
    color: "deep gold and emerald",
    specs: [
      ["Fabric", "Pure Mulberry Silk — Grade A"],
      ["Length", "6.3 metres with matching blouse piece"],
      ["Border", "Real Zari (gold thread) border & pallu"],
      ["Occasion", "Weddings · Puja ceremonies · The days your family gathers"],
      ["Care", "Dry clean only · Store in muslin cloth"],
      ["Verified", "Sourced from certified Kanchipuram weavers"],
    ],
    history:
      "Kanchipuram silk weaving dates back over 400 years to the temple town of Kanchipuram in Tamil Nadu. Each saree takes several days to weave using pure mulberry silk and zari.",
    soul: "This is for the woman who carries tradition with devotion — let this silken prayer be just for you. 💛",
    whatsappQuery:
      "Hi 💛, I saw the Kanjivaram Silk Saree on ABDAN and it is beautiful. Could you tell me more about it?",
    sizes: ["Free Size"],
    colors: ["Deep Gold", "Emerald", "Temple Red"],
  },
  {
    id: "hand-block-print-kurti-set",
    name: "Hand Block Print Kurti Set",
    priceLabel: "₹1,200 onwards",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Everyday Grace",
    secondaryTags: { occasion: "Daily", emotion: "Comfortable", style: "Minimal" },
    color: "soft indigo and ivory",
    specs: [
      ["Fabric", "100% Soft Cotton — hand-block printed"],
      ["Sizes", "S, M, L, XL, 2XL, 3XL"],
      ["Set", "Kurti + matching palazzo pants"],
      ["Occasion", "Your everyday · Temple mornings · Quiet celebrations"],
      ["Care", "Machine washable · Gentle cycle cold water"],
      ["Verified", "Sourced from Jaipur block print artisans"],
    ],
    history:
      "Hand block printing is a 4,500-year-old Indian textile art. Each wooden block is hand-carved and pressed onto fabric with practiced precision.",
    soul: "This is for the woman who nurtures everyone through long days — let this softness hold you back, just for today. 💛",
    whatsappQuery:
      "Hi 💛, I'm interested in the Block Print Kurti Set from ABDAN. Could you help me find the right size?",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Indigo", "Ivory", "Sand"],
  },
  {
    id: "embroidered-festive-dupatta",
    name: "Embroidered Festive Dupatta",
    priceLabel: "₹2,800 onwards",
    image: "./assets/embroidered-festive-dupatta.jpg",
    primaryTag: "Festive Glow",
    secondaryTags: { occasion: "Festive", emotion: "Graceful", style: "Embroidered" },
    color: "shimmering crimson",
    specs: [
      ["Fabric", "Georgette chiffon base"],
      ["Embroidery", "Zardozi hand embroidery"],
      ["Length", "2.5 metres"],
      ["Occasion", "Festivals · Weddings · The evenings that deserve to sparkle"],
      ["Care", "Dry clean recommended · Handle borders gently"],
      ["Verified", "Handcrafted by Lucknow zardozi artisans"],
    ],
    history:
      "Zardozi embroidery originated in Persia and was brought to India by Mughal royalty in the 16th century, using metallic threads to create raised patterns.",
    soul: "This is for the woman who lights up every room she walks into — let this sparkle remind you of who you truly are. 💛",
    whatsappQuery:
      "Hi 💛, I saw the Embroidered Dupatta on ABDAN and I can already imagine wearing it. Could you tell me more?",
    sizes: ["Free Size"],
    colors: ["Crimson", "Gold", "Rosewood"],
  },
].map((product) => ({ ...product, ...buildProductNarrative(product) }));

const FAQS = [
  ["How do you ensure product quality?", "Every piece is handpicked and verified by our team before we list it for you."],
  ["Is the pricing transparent?", "Yes. We believe in honesty, confirm costs before payment, and avoid hidden charges."],
  ["Can I trust the artisans?", "We only work with partners who share our values of craftsmanship and integrity."],
  ["How long does delivery take?", "Usually 5–7 working days, depending on your location in Tamil Nadu or beyond."],
  ["How do I choose the right size?", "WhatsApp support is always here to guide you with measurements and fabric notes."],
  ["Is my payment secure?", "ABDAN uses trusted payment options and manually confirms transactions with care."],
];

const TERMS = [
  ["Orders & Payments", "Orders are confirmed only after payment. We verify availability before accepting any transaction."],
  ["Pricing", "All prices are inclusive of taxes unless stated otherwise. Shipping is clearly mentioned during checkout."],
  ["Shipping", "We partner with reliable couriers, though external delays may occasionally occur."],
  ["Returns", "Returns are accepted for damaged items or wrong dispatches. Please share an unboxing video when possible."],
  ["Expectations", "Handcrafted items may show slight irregularities — the mark of human hands, not a defect."],
  ["Liability", "ABDAN acts as a careful bridge between you and trusted vendor partners while staying with you until delivery."],
];

const TEASERS = {
  loyalty: {
    icon: "💎",
    title: "Coming Soon — ABDAN Loyalty Circle",
    message:
      "A special place where your loyalty, your style, and your opinions are remembered with early access, quiet first looks, and thoughtful curation just for you.",
  },
  community: {
    icon: "🌸",
    title: "Coming Soon — ABDAN Community",
    message:
      "Imagine a warm and private space where women share fashion stories, ask for opinions, celebrate style, and feel joyfully seen. That is the community we are building.",
  },
};

const state = {
  theme: localStorage.getItem("abdan-theme") || "light",
  filter: "All",
  cart: JSON.parse(localStorage.getItem("abdan-cart") || "[]"),
  activeProductId: null,
  selectedSize: null,
  selectedColor: null,
};

const dom = {
  html: document.documentElement,
  body: document.body,
  productsGrid: document.getElementById("productsGrid"),
  filterRow: document.getElementById("filterRow"),
  themeToggle: document.getElementById("themeToggle"),
  cartToggle: document.getElementById("cartToggle"),
  cartCount: document.getElementById("cartCount"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartClose: document.getElementById("cartClose"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  cartCheckoutButton: document.getElementById("cartCheckoutButton"),
  bagCheckoutPanel: document.getElementById("bagCheckoutPanel"),
  bagCheckoutForm: document.getElementById("bagCheckoutForm"),
  bagRazorpayButton: document.getElementById("bagRazorpayButton"),
  bagUpiButton: document.getElementById("bagUpiButton"),
  copyUpiButton: document.getElementById("copyUpiButton"),
  productSheet: document.getElementById("productSheet"),
  productImage: document.getElementById("productImage"),
  productTag: document.getElementById("productTag"),
  productName: document.getElementById("productName"),
  productPrice: document.getElementById("productPrice"),
  productDescription: document.getElementById("productDescription"),
  productFacts: document.getElementById("productFacts"),
  productSoul: document.getElementById("productSoul"),
  productStyling: document.getElementById("productStyling"),
  sizeChips: document.getElementById("sizeChips"),
  colorChips: document.getElementById("colorChips"),
  selectedSizeLabel: document.getElementById("selectedSizeLabel"),
  selectedColorLabel: document.getElementById("selectedColorLabel"),
  addToCartButton: document.getElementById("addToCartButton"),
  toggleProductCheckout: document.getElementById("toggleProductCheckout"),
  productCheckoutPanel: document.getElementById("productCheckoutPanel"),
  productCheckoutForm: document.getElementById("productCheckoutForm"),
  productRazorpayButton: document.getElementById("productRazorpayButton"),
  productUpiButton: document.getElementById("productUpiButton"),
  shareButtons: document.getElementById("shareButtons"),
  teaserModal: document.getElementById("teaserModal"),
  teaserIcon: document.getElementById("teaserIcon"),
  teaserTitle: document.getElementById("teaserTitle"),
  teaserMessage: document.getElementById("teaserMessage"),
  faqList: document.getElementById("faqList"),
  termsList: document.getElementById("termsList"),
  bottomDock: document.getElementById("bottomDock"),
  supportPill: document.querySelector(".support-pill"),
  siteHeader: document.getElementById("siteHeader"),
};

function getActiveProduct() {
  return PRODUCTS.find((product) => product.id === state.activeProductId) || null;
}

function getNumericPrice(priceLabel) {
  const match = priceLabel.match(/[\d,]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function saveCart() {
  localStorage.setItem("abdan-cart", JSON.stringify(state.cart));
}

function setTheme(theme) {
  state.theme = theme;
  dom.html.setAttribute("data-theme", theme);
  localStorage.setItem("abdan-theme", theme);
  const icon = dom.themeToggle.querySelector("i");
  if (icon) icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
  lucide.createIcons();
}

function renderFilters() {
  dom.filterRow.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

function renderProducts() {
  const filteredProducts = state.filter === "All" ? PRODUCTS : PRODUCTS.filter((product) => product.primaryTag === state.filter);
  dom.productsGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card reveal" data-product-card="${product.id}">
          <div class="product-card__media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <div class="product-card__overlay"></div>
          </div>
          <div class="product-card__content">
            <p class="section-kicker">${product.primaryTag}</p>
            <h3 class="product-card__title">${product.name}</h3>
            <p class="product-card__description">${buildEditorialExcerpt(product)}</p>
            <div class="product-card__footer">
              <span class="product-card__price">${product.priceLabel}</span>
              <button class="text-link" type="button" data-preview="${product.id}">View details</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
  revealElements();
}

function renderFooterContent() {
  dom.faqList.innerHTML = FAQS.map(
    ([title, body]) => `<article><strong>${title}</strong><span>${body}</span></article>`,
  ).join("");
  dom.termsList.innerHTML = TERMS.map(
    ([title, body]) => `<article><strong>${title}</strong><p>${body}</p></article>`,
  ).join("");
}

function renderShareButtons(product) {
  const shareUrl = window.location.href.split("#")[0];
  const text = `${product.name} — ${BRAND.tagline}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(shareUrl);

  const links = [
    { href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`, icon: "message-circle", label: "WhatsApp" },
    { href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, icon: "send", label: "Telegram" },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: "globe", label: "Facebook" },
    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: "linkedin", label: "LinkedIn" },
  ];

  if (navigator.share) {
    links.unshift({ href: "#native-share", icon: "share-2", label: "Share" });
  }

  dom.shareButtons.innerHTML = links
    .map(
      (link) => `
        <a href="${link.href}" ${link.href === "#native-share" ? 'data-native-share="true"' : 'target="_blank" rel="noreferrer"'} aria-label="${link.label}">
          <i data-lucide="${link.icon}"></i>
        </a>
      `,
    )
    .join("");

  dom.shareButtons.querySelector('[data-native-share="true"]')?.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await navigator.share({ title: text, text, url: shareUrl });
    } catch {
    }
  });
}

function renderOptionChips(container, values, selectedValue, onClick) {
  container.innerHTML = values
    .map(
      (value) => `
        <button type="button" class="option-chip ${selectedValue === value ? "is-selected" : ""}" data-option-value="${value}">
          ${value}
        </button>
      `,
    )
    .join("");
  container.querySelectorAll("[data-option-value]").forEach((button) => {
    button.addEventListener("click", () => onClick(button.dataset.optionValue || ""));
  });
}

function openProduct(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  state.activeProductId = productId;
  state.selectedSize = product.sizes?.[0] || DEFAULT_SIZES[0];
  state.selectedColor = product.colors?.[0] || DEFAULT_COLORS[0];

  dom.productImage.src = product.image;
  dom.productImage.alt = product.name;
  dom.productTag.textContent = product.primaryTag;
  dom.productName.textContent = product.name;
  dom.productPrice.textContent = product.priceLabel;
  dom.productDescription.textContent = product.description;
  dom.productSoul.textContent = product.soul;
  dom.productStyling.textContent = product.styling;
  dom.productFacts.innerHTML = product.specs
    .map(([label, value]) => `<div class="product-fact"><strong>${label}</strong><span>${value}</span></div>`)
    .join("");

  renderOptionChips(dom.sizeChips, product.sizes?.length ? product.sizes : DEFAULT_SIZES, state.selectedSize, (value) => {
    state.selectedSize = value;
    dom.selectedSizeLabel.textContent = value;
    renderOptionChips(dom.sizeChips, product.sizes?.length ? product.sizes : DEFAULT_SIZES, state.selectedSize, (next) => {
      state.selectedSize = next;
      dom.selectedSizeLabel.textContent = next;
      openProduct(product.id);
    });
  });
  renderOptionChips(dom.colorChips, product.colors?.length ? product.colors : DEFAULT_COLORS, state.selectedColor, (value) => {
    state.selectedColor = value;
    dom.selectedColorLabel.textContent = value;
    renderOptionChips(dom.colorChips, product.colors?.length ? product.colors : DEFAULT_COLORS, state.selectedColor, (next) => {
      state.selectedColor = next;
      dom.selectedColorLabel.textContent = next;
      openProduct(product.id);
    });
  });

  dom.selectedSizeLabel.textContent = state.selectedSize || "Select";
  dom.selectedColorLabel.textContent = state.selectedColor || "Select";
  dom.productCheckoutPanel.hidden = true;
  renderShareButtons(product);

  dom.productSheet.classList.add("is-open");
  dom.productSheet.setAttribute("aria-hidden", "false");
  dom.body.classList.add("is-locked");
  lucide.createIcons();
}

function closeProduct() {
  dom.productSheet.classList.remove("is-open");
  dom.productSheet.setAttribute("aria-hidden", "true");
  if (!dom.cartDrawer.classList.contains("is-open") && !dom.teaserModal.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
}

function renderCart() {
  if (!state.cart.length) {
    dom.cartItems.innerHTML = `<div class="cart-empty">Your bag is empty. When a piece feels like it belongs to you, it will wait here. 💛</div>`;
    dom.cartTotal.textContent = formatCurrency(0);
    dom.cartCount.textContent = "0";
    dom.cartCheckoutButton.disabled = true;
    dom.cartCheckoutButton.style.opacity = "0.55";
    dom.bagCheckoutPanel.hidden = true;
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0);
  dom.cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
          <div>
            <h3>${item.name}</h3>
            <div class="cart-meta">${item.size} · ${item.color}</div>
            <div class="cart-price">${item.priceLabel}</div>
            <div class="cart-controls">
              <button type="button" class="qty-button" data-qty="decrease" data-cart-key="${item.key}">−</button>
              <span>${item.quantity}</span>
              <button type="button" class="qty-button" data-qty="increase" data-cart-key="${item.key}">+</button>
            </div>
          </div>
          <button type="button" class="remove-button" data-remove="${item.key}" aria-label="Remove ${item.name}">
            <i data-lucide="trash-2"></i>
          </button>
        </article>
      `,
    )
    .join("");

  dom.cartTotal.textContent = formatCurrency(total);
  dom.cartCount.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));
  dom.cartCheckoutButton.disabled = false;
  dom.cartCheckoutButton.style.opacity = "1";
  lucide.createIcons();
}

function addToCart() {
  const product = getActiveProduct();
  if (!product) return;

  if (!state.selectedSize || !state.selectedColor) {
    window.alert("Please choose both size and colour before adding this piece to your bag.");
    return;
  }

  const key = `${product.id}::${state.selectedSize}::${state.selectedColor}`;
  const existing = state.cart.find((item) => item.key === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      key,
      id: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      image: product.image,
      size: state.selectedSize,
      color: state.selectedColor,
      quantity: 1,
    });
  }
  saveCart();
  renderCart();
  closeProduct();
  openCart();
}

function updateCartQuantity(key, delta) {
  const item = state.cart.find((entry) => entry.key === key);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.key !== key);
  }
  saveCart();
  renderCart();
}

function removeCartItem(key) {
  state.cart = state.cart.filter((item) => item.key !== key);
  saveCart();
  renderCart();
}

function openCart() {
  closeProduct();
  renderCart();
  dom.cartDrawer.classList.add("is-open");
  dom.cartDrawer.setAttribute("aria-hidden", "false");
  dom.body.classList.add("is-locked");
}

function closeCart() {
  dom.cartDrawer.classList.remove("is-open");
  dom.cartDrawer.setAttribute("aria-hidden", "true");
  if (!dom.productSheet.classList.contains("is-open") && !dom.teaserModal.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
}

function toggleBagCheckout() {
  if (!state.cart.length) return;
  dom.bagCheckoutPanel.hidden = !dom.bagCheckoutPanel.hidden;
  if (!dom.bagCheckoutPanel.hidden) {
    dom.bagCheckoutPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function toggleProductCheckout() {
  dom.productCheckoutPanel.hidden = !dom.productCheckoutPanel.hidden;
  if (!dom.productCheckoutPanel.hidden) {
    dom.productCheckoutPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function getFormPayload(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    notes: String(data.get("notes") || "").trim(),
  };
}

function validateCheckoutDetails(details) {
  if (!details.name || !details.phone) {
    window.alert("Please share your name and phone number so ABDAN can confirm your order with care.");
    return false;
  }
  return true;
}

function buildWhatsAppOrderMessage(details, items, paymentMethod, extra = {}) {
  const lines = [
    `Hello ABDAN 💛`,
    `I would like to confirm my order.`,
    ``,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    details.email ? `Email: ${details.email}` : null,
    `Payment Method: ${paymentMethod}`,
    extra.paymentId ? `Payment ID: ${extra.paymentId}` : null,
    ``,
    `Items:`,
    ...items.map((item, index) => `${index + 1}. ${item.name} — ${item.size} / ${item.color} × ${item.quantity}`),
    ``,
    `Total: ${formatCurrency(items.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0))}`,
    details.notes ? `Notes: ${details.notes}` : null,
    ``,
    `Please confirm availability before dispatch.`,
  ].filter(Boolean);

  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function launchRazorpay(details, items) {
  const total = items.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0);
  if (!window.Razorpay) {
    window.alert("Razorpay could not load right now. Please try UPI or WhatsApp support.");
    return;
  }

  const options = {
    key: BRAND.razorpayKey,
    amount: total * 100,
    currency: "INR",
    name: BRAND.name,
    description: `${BRAND.tagline} — secure checkout`,
    prefill: {
      name: details.name,
      email: details.email,
      contact: details.phone,
    },
    theme: { color: "#023D3A" },
    handler(response) {
      const url = buildWhatsAppOrderMessage(details, items, "Razorpay", { paymentId: response.razorpay_payment_id });
      state.cart = [];
      saveCart();
      renderCart();
      closeCart();
      closeProduct();
      window.open(url, "_blank", "noopener,noreferrer");
    },
  };

  const instance = new window.Razorpay(options);
  instance.open();
}

function launchUpi(details, items) {
  const url = buildWhatsAppOrderMessage(details, items, "UPI / Manual confirmation");
  window.open(BRAND.upiLink, "_blank", "noopener,noreferrer");
  window.open(url, "_blank", "noopener,noreferrer");
  state.cart = [];
  saveCart();
  renderCart();
  closeCart();
  closeProduct();
}

function handleBagRazorpay() {
  const details = getFormPayload(dom.bagCheckoutForm);
  if (!validateCheckoutDetails(details)) return;
  launchRazorpay(details, state.cart);
}

function handleBagUpi() {
  const details = getFormPayload(dom.bagCheckoutForm);
  if (!validateCheckoutDetails(details)) return;
  launchUpi(details, state.cart);
}

function handleProductRazorpay() {
  const product = getActiveProduct();
  if (!product) return;
  const details = getFormPayload(dom.productCheckoutForm);
  if (!validateCheckoutDetails(details)) return;
  const lineItems = [
    {
      key: `${product.id}::single`,
      id: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      image: product.image,
      size: state.selectedSize || product.sizes?.[0] || "Free Size",
      color: state.selectedColor || product.colors?.[0] || "Default",
      quantity: 1,
    },
  ];
  launchRazorpay(details, lineItems);
}

function handleProductUpi() {
  const product = getActiveProduct();
  if (!product) return;
  const details = getFormPayload(dom.productCheckoutForm);
  if (!validateCheckoutDetails(details)) return;
  const lineItems = [
    {
      key: `${product.id}::single`,
      id: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      image: product.image,
      size: state.selectedSize || product.sizes?.[0] || "Free Size",
      color: state.selectedColor || product.colors?.[0] || "Default",
      quantity: 1,
    },
  ];
  launchUpi(details, lineItems);
}

async function copyUpi() {
  try {
    await navigator.clipboard.writeText(BRAND.upiId);
    window.alert("UPI ID copied.");
  } catch {
    window.alert(`UPI ID: ${BRAND.upiId}`);
  }
}

function openTeaser(key) {
  const teaser = TEASERS[key];
  if (!teaser) return;
  dom.teaserIcon.textContent = teaser.icon;
  dom.teaserTitle.textContent = teaser.title;
  dom.teaserMessage.textContent = teaser.message;
  dom.teaserModal.classList.add("is-open");
  dom.teaserModal.setAttribute("aria-hidden", "false");
  dom.body.classList.add("is-locked");
}

function closeTeaser() {
  dom.teaserModal.classList.remove("is-open");
  dom.teaserModal.setAttribute("aria-hidden", "true");
  if (!dom.productSheet.classList.contains("is-open") && !dom.cartDrawer.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
}

function revealElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => observer.observe(element));
}

function updateDockActive(targetId) {
  dom.bottomDock.querySelectorAll(".dock-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === targetId);
  });
}

function scrollToSection(targetId) {
  const section = document.getElementById(targetId);
  if (!section) return;
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  updateDockActive(targetId);
}

function initDockObserver() {
  const sectionIds = ["products", "wsy", "testi", "teasers", "account"];
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) updateDockActive(visible.target.id);
    },
    { threshold: 0.3, rootMargin: "-20% 0px -40% 0px" },
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function initScrollChrome() {
  const updateChrome = () => {
    const isScrolled = window.scrollY > 18;
    dom.siteHeader.classList.toggle("is-scrolled", isScrolled);
    dom.bottomDock.classList.toggle("is-scrolled", isScrolled);
  };

  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });
}

function attachEvents() {
  dom.themeToggle.addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
  dom.filterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter || "All";
    renderFilters();
    renderProducts();
  });

  dom.productsGrid.addEventListener("click", (event) => {
    const previewButton = event.target.closest("[data-preview]");
    const card = event.target.closest("[data-product-card]");
    const productId = previewButton?.dataset.preview || card?.dataset.productCard;
    if (productId) openProduct(productId);
  });

  dom.cartToggle.addEventListener("click", openCart);
  dom.cartClose.addEventListener("click", closeCart);
  dom.cartDrawer.addEventListener("click", (event) => {
    if (event.target === dom.cartDrawer) closeCart();
  });

  dom.cartItems.addEventListener("click", (event) => {
    const qty = event.target.closest("[data-qty]");
    const remove = event.target.closest("[data-remove]");
    if (qty) {
      const key = qty.dataset.cartKey || "";
      updateCartQuantity(key, qty.dataset.qty === "increase" ? 1 : -1);
    }
    if (remove) {
      removeCartItem(remove.dataset.remove || "");
    }
  });

  document.querySelectorAll("[data-close-product]").forEach((button) => button.addEventListener("click", closeProduct));
  document.querySelectorAll("[data-close-teaser]").forEach((button) => button.addEventListener("click", closeTeaser));
  document.querySelectorAll("[data-copy-upi]").forEach((button) => button.addEventListener("click", copyUpi));
  document.querySelectorAll("[data-teaser]").forEach((button) =>
    button.addEventListener("click", () => openTeaser(button.dataset.teaser || "")),
  );

  dom.addToCartButton.addEventListener("click", addToCart);
  dom.toggleProductCheckout.addEventListener("click", toggleProductCheckout);
  dom.cartCheckoutButton.addEventListener("click", toggleBagCheckout);
  dom.bagRazorpayButton.addEventListener("click", handleBagRazorpay);
  dom.bagUpiButton.addEventListener("click", handleBagUpi);
  dom.copyUpiButton.addEventListener("click", copyUpi);
  dom.productRazorpayButton.addEventListener("click", handleProductRazorpay);
  dom.productUpiButton.addEventListener("click", handleProductUpi);

  dom.bottomDock.querySelectorAll(".dock-link").forEach((button) => {
    button.addEventListener("click", () => scrollToSection(button.dataset.target || "products"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeProduct();
      closeTeaser();
    }
  });
}

function init() {
  setTheme(state.theme);
  renderFilters();
  renderProducts();
  renderFooterContent();
  renderCart();
  attachEvents();
  revealElements();
  initDockObserver();
  initScrollChrome();
  lucide.createIcons();
}

window.addEventListener("DOMContentLoaded", init);
