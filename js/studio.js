/* ============================================================
   ABDAN Studio — Brand Operating System
   js/studio.js  |  Static · No framework · Cloudflare Pages
   ============================================================ */

"use strict";

/* ── Auth gate ─────────────────────────────────────────────── */
(function () {
  if (sessionStorage.getItem("abdan-admin-auth") !== "true") {
    window.location.replace("/");
  }
})();

/* ── Constants ─────────────────────────────────────────────── */
const STUDIO_VIEWS = [
  { id: "overview",    label: "Studio Overview",    icon: "layout-dashboard", group: "General"  },
  { id: "products",    label: "Curated Pieces",     icon: "shopping-bag",     group: "Content"  },
  { id: "collections", label: "Collections",        icon: "layers",           group: "Content"  },
  { id: "generator",   label: "Editorial Generator",icon: "pen-tool",         group: "Content"  },
  { id: "homepage",    label: "Homepage Mood",      icon: "layout",           group: "Presence" },
  { id: "notices",     label: "Gentle Notices",     icon: "bell",             group: "Presence" },
  { id: "customers",   label: "Her Circle 💛",       icon: "users",            group: "People"   },
  { id: "messaging",   label: "Her Circle Updates", icon: "send",             group: "People"   },
  { id: "orders",      label: "Orders",             icon: "receipt",          group: "Commerce" },
  { id: "voice",       label: "Brand Voice",        icon: "type",             group: "Brand"    },
  { id: "social",      label: "Social Sharing",     icon: "share-2",          group: "Brand"    },
  { id: "media",       label: "Media Library",      icon: "image",            group: "Brand"    },
  { id: "settings",    label: "Settings",           icon: "settings",         group: "System"   },
  { id: "policy",      label: "Trust & Policy",     icon: "shield",           group: "System"   },
];

const STORAGE = {
  products:    "abdan-studio-products",
  orders:      "abdan-studio-orders",
  settings:    "abdan-studio-settings",
  notices:     "abdan-studio-notices",
  voice:       "abdan-studio-voice",
  collections: "abdan-studio-collections",
  homepage:    "abdan-studio-homepage",
  social:      "abdan-studio-social",
  customers:   "abdan-space-profiles",
};

const CATEGORIES = ["Everyday Grace","Modest Essence","Festive Glow","Workflow Elegance","Soft Statement","Evening Calm"];
const SIZES      = ["XS","S","M","L","XL","XXL","Free Size"];
const STATUS_OPTIONS = ["active","draft","sold-out","archived"];

/* ── Default data ───────────────────────────────────────────── */
const DEFAULT_SETTINGS = {
  siteName:        "ABDAN",
  tagline:         "Your Devotion Meets Style",
  whatsappNumber:  "919876543210",
  upiId:           "abdan@upi",
  razorpayKey:     "",
  footerNote:      "Crafted with devotion. Worn with grace.",
  currency:        "INR",
  shippingNote:    "Free delivery on orders above ₹999",
};

const DEFAULT_VOICE = {
  openingLine:     "For the woman who moves through her days with devotion, grace, and quiet intention.",
  closingLine:     "Quietly chosen. Deeply felt.",
  brandPromise:    "Every piece carries the weight of thoughtfulness.",
  heroHeadline:    "Devotion Meets Style",
  heroSubline:     "Thoughtfully curated modest fashion",
};

const DEFAULT_HOMEPAGE = {
  heroImageUrl:    "",
  heroCaption:     "New arrivals — curated with care",
  featuredLabel:   "Handpicked for You",
  storyHeadline:   "Her Story",
  storyBody:       "ABDAN was born from a simple belief — that modesty and beauty are not opposites. They are partners in grace.",
};

const DEFAULT_SOCIAL = {
  instagramHandle: "@abdan.in",
  pinterestBoard:  "abdan-style",
  shareTagline:    "quietly chosen for you ✨",
};

/* ── Editorial generator templates ─────────────────────────── */
const GEN_TEMPLATES = {
  "Everyday Grace": {
    description: (n) => `${n} is the kind of piece you reach for without thinking — because it simply feels right. Modest, effortless, and made to carry you through your day with quiet confidence.`,
    soul:        "Rooted in the rhythm of daily devotion.",
    styling:     "Pair with your favourite flats and a soft tote. Let the fabric breathe.",
    caption:     (n) => `some days call for quiet grace. ${n} answers. ✨`,
    madeFor:     "For the woman whose everyday is sacred.",
  },
  "Modest Essence": {
    description: (n) => `${n} honours the beauty of covering with thoughtful drape and considered silhouette. A reminder that modesty is not a constraint — it is a choice made with intention.`,
    soul:        "Where faith and fashion meet without compromise.",
    styling:     "Layer gently. Let the silhouette speak.",
    caption:     (n) => `modest doesn't mean less. ${n} is proof. 🤍`,
    madeFor:     "For her whose values shape her wardrobe.",
  },
  "Festive Glow": {
    description: (n) => `${n} was made for moments worth remembering — family gatherings, Eid mornings, celebrations held close to the heart. Rich in feeling, light in wear.`,
    soul:        "Every celebration deserves something beautiful.",
    styling:     "Add a soft clutch and pearl ear drops. Let the joy show.",
    caption:     (n) => `dressed for the moments that matter. ${n} 💛`,
    madeFor:     "For celebrations held close to the heart.",
  },
  "Workflow Elegance": {
    description: (n) => `${n} moves from morning meetings to afternoon prayers without missing a beat. Polished where it needs to be, comfortable where it counts.`,
    soul:        "Grace has no office hours.",
    styling:     "Keep accessories minimal. Let your presence do the rest.",
    caption:     (n) => `she works with grace. ${n} works with her. ✨`,
    madeFor:     "For the woman who leads and prays in the same breath.",
  },
  "Soft Statement": {
    description: (n) => `${n} is a whisper, not a shout — but it will be noticed. The kind of piece that earns compliments from women who understand quiet beauty.`,
    soul:        "The softest statements land the deepest.",
    styling:     "Wear alone. The piece carries the moment.",
    caption:     (n) => `she never raises her voice. she doesn't need to. ${n} 🌿`,
    madeFor:     "For her who lets her style speak softly.",
  },
  "Evening Calm": {
    description: (n) => `${n} is for the golden hour — when the day quiets and you deserve something that matches the calm. Unhurried. Gentle. Entirely yours.`,
    soul:        "Evenings deserve the best of you.",
    styling:     "Slip on with your favourite sandals. Let the evening unfold.",
    caption:     (n) => `the day is winding down. you deserve this. ${n} 🌙`,
    madeFor:     "For evenings that belong to you.",
  },
};

/* ── Data helpers ───────────────────────────────────────────── */
function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* quota */ }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtCurrency(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* ── DOM refs ───────────────────────────────────────────────── */
const dom = {
  aside:        document.getElementById("sAside"),
  asideOverlay: document.getElementById("sAsideOverlay"),
  nav:          document.getElementById("sNav"),
  shell:        document.getElementById("sShell"),
  content:      document.getElementById("sContent"),
  pageTitle:    document.getElementById("sPageTitle"),
  topbarActions:document.getElementById("sTopbarActions"),
  loading:      document.getElementById("sLoading"),
  panel:        document.getElementById("sPanel"),
  panelOverlay: document.getElementById("sPanelOverlay"),
  panelTitle:   document.getElementById("sPanelTitle"),
  panelBody:    document.getElementById("sPanelBody"),
  panelFoot:    document.getElementById("sPanelFoot"),
  panelSave:    document.getElementById("sPanelSave"),
  panelCancel:  document.getElementById("sPanelCancel"),
  panelClose:   document.getElementById("sPanelClose"),
  toast:        document.getElementById("sToast"),
  themeBtn:     document.getElementById("sThemeBtn"),
  signoutBtn:   document.getElementById("sSignoutBtn"),
  menuBtn:      document.getElementById("sMenuBtn"),
};

/* ── State ──────────────────────────────────────────────────── */
let currentView   = "overview";
let panelSaveFn   = null;
let toastTimer    = null;
let sidebarOpen   = false;

/* ── Toast ──────────────────────────────────────────────────── */
function toast(msg, type = "ok") {
  clearTimeout(toastTimer);
  dom.toast.textContent = msg;
  dom.toast.dataset.type = type;
  dom.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => dom.toast.classList.remove("is-visible"), 3200);
}

/* ── Save glow micro-interaction ────────────────────────────── */
function lxSaveGlow(btnId, toastMsg) {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.classList.remove("lx-saved-soft");
    requestAnimationFrame(() => {
      btn.classList.add("lx-saved-soft");
      btn.addEventListener("animationend", () => btn.classList.remove("lx-saved-soft"), { once: true });
    });
    /* Button compress spring via WAAPI */
    if (typeof btn.animate === "function") {
      btn.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(0.93)", offset: 0.15 },
          { transform: "scale(1.02)", offset: 0.62 },
          { transform: "scale(1)" },
        ],
        { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    }
  }
  toast(toastMsg);
}

/* ── Panel ──────────────────────────────────────────────────── */
function openPanel(title, bodyHTML, saveFn = null) {
  dom.panelTitle.textContent = title;
  dom.panelBody.innerHTML    = bodyHTML;
  dom.panelFoot.hidden       = !saveFn;
  panelSaveFn                = saveFn;
  dom.panel.removeAttribute("hidden");
  dom.panelOverlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  initLucide();
}

function closePanel() {
  dom.panel.hidden        = true;
  dom.panelOverlay.hidden = true;
  document.body.style.overflow = "";
  panelSaveFn = null;
}

/* ── Sidebar ────────────────────────────────────────────────── */
function openSidebar() {
  sidebarOpen = true;
  dom.aside.classList.add("is-open");
  dom.asideOverlay.classList.add("is-open");
}

function closeSidebar() {
  sidebarOpen = false;
  dom.aside.classList.remove("is-open");
  dom.asideOverlay.classList.remove("is-open");
}

/* ── Nav builder ────────────────────────────────────────────── */
function buildNav() {
  const groups = {};
  STUDIO_VIEWS.forEach((v) => {
    if (!groups[v.group]) groups[v.group] = [];
    groups[v.group].push(v);
  });

  dom.nav.innerHTML = Object.entries(groups).map(([group, views]) => `
    <div class="s-nav-group">
      <p class="s-nav-group__label">${group}</p>
      ${views.map((v) => `
        <a class="s-nav-item ${v.id === currentView ? "s-nav-item--active" : ""}"
           href="#${v.id}" data-nav="${v.id}" role="menuitem">
          <i data-lucide="${v.icon}" class="s-icon"></i>
          <span>${v.label}</span>
        </a>
      `).join("")}
    </div>
  `).join("");
}

/* ── Tab bar sync ───────────────────────────────────────────── */
function syncTabBar() {
  document.querySelectorAll(".s-tab[data-nav]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.nav === currentView);
  });
}

/* ── Lucide init ────────────────────────────────────────────── */
function initLucide() {
  if (window.lucide) window.lucide.createIcons();
}

/* ── Page title ─────────────────────────────────────────────── */
function setTitle(title, actions = "") {
  dom.pageTitle.textContent    = title;
  dom.topbarActions.innerHTML  = actions;
}

/* ── Router ─────────────────────────────────────────────────── */
function navigate(id) {
  const view = STUDIO_VIEWS.find((v) => v.id === id);
  if (!view) return navigate("overview");
  currentView = id;
  buildNav();
  syncTabBar();
  closeSidebar();
  window.location.hash = id;
  renderView(id);
}

function renderView(id) {
  dom.content.innerHTML = "";
  const renders = {
    overview:    renderOverview,
    products:    renderProducts,
    collections: renderCollections,
    generator:   renderGenerator,
    homepage:    renderHomepage,
    notices:     renderNotices,
    customers:   renderCustomers,
    messaging:   renderMessaging,
    orders:      renderOrders,
    voice:       renderVoice,
    social:      renderSocial,
    media:       renderMedia,
    settings:    renderSettings,
    policy:      renderPolicy,
  };
  (renders[id] || renderOverview)();
  initLucide();
  dom.content.focus();
}

/* ════════════════════════════════════════════════════════════
   VIEW RENDERERS
   ════════════════════════════════════════════════════════════ */

/* ── Overview ───────────────────────────────────────────────── */
function renderOverview() {
  setTitle("Studio Overview");
  const products  = load(STORAGE.products, []);
  const orders    = load(STORAGE.orders, []);
  const customers = load(STORAGE.customers, []);
  const notices   = load(STORAGE.notices, []);

  const activeProducts  = products.filter((p) => p.status === "active").length;
  const totalOrders     = orders.length;
  const totalCustomers  = customers.length;
  const activeNotices   = notices.filter((n) => n.active).length;
  const revenue         = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);

  const recentOrders    = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentProducts  = [...products].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)).slice(0, 4);

  dom.content.innerHTML = `
    <div class="s-overview">
      <div class="s-stats-row">
        ${stat("shopping-bag", "Active Pieces", activeProducts, "s-stat--blue")}
        ${stat("receipt", "Total Orders", totalOrders, "s-stat--green")}
        ${stat("users", "Her Circle", totalCustomers, "s-stat--purple")}
        ${stat("trending-up", "Revenue", fmtCurrency(revenue), "s-stat--gold")}
      </div>

      <div class="s-quick-actions">
        <h3 class="s-section-label">Quick Actions</h3>
        <div class="s-qaction-row">
          ${qaction("plus", "Add Piece", "products")}
          ${qaction("bell", "Add Notice", "notices")}
          ${qaction("pen-tool", "Generate Copy", "generator")}
          ${qaction("receipt", "View Orders", "orders")}
        </div>
      </div>

      ${activeNotices ? `
      <div class="s-notice-preview">
        <i data-lucide="bell" class="s-icon"></i>
        <strong>${activeNotices} active notice${activeNotices > 1 ? "s" : ""}</strong> currently showing on your site.
      </div>` : ""}

      <div class="s-recent-section">
        <div class="s-recent-block">
          <h3 class="s-section-label">Recent Pieces</h3>
          ${recentProducts.length ? `
            <div class="s-product-grid s-product-grid--sm">
              ${recentProducts.map(productCard).join("")}
            </div>
          ` : empty("No pieces yet", "shopping-bag")}
        </div>

        <div class="s-recent-block">
          <h3 class="s-section-label">Recent Orders</h3>
          ${recentOrders.length ? `
            <div class="s-list">
              ${recentOrders.map(orderRow).join("")}
            </div>
          ` : empty("No orders yet", "receipt")}
        </div>
      </div>
    </div>
  `;
}

function stat(icon, label, value, cls = "") {
  return `
    <div class="s-stat ${cls}">
      <i data-lucide="${icon}" class="s-icon s-stat__icon"></i>
      <div class="s-stat__body">
        <span class="s-stat__label">${label}</span>
        <strong class="s-stat__value">${value}</strong>
      </div>
    </div>`;
}

function qaction(icon, label, nav) {
  return `
    <button class="s-qaction" type="button" data-nav="${nav}">
      <i data-lucide="${icon}" class="s-icon"></i>
      <span>${label}</span>
    </button>`;
}

/* ── Curated Pieces ─────────────────────────────────────────── */
function renderProducts() {
  setTitle("Curated Pieces", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddProduct">
      <i data-lucide="plus" class="s-icon"></i> Add Piece
    </button>
  `);
  const products = load(STORAGE.products, []);

  dom.content.innerHTML = `
    <div class="s-filter-bar">
      <div class="s-search">
        <i data-lucide="search" class="s-icon"></i>
        <input id="sProductSearch" type="search" placeholder="Search pieces…" class="s-field__input" />
      </div>
      <select id="sProductFilter" class="s-field__select">
        <option value="">All statuses</option>
        ${STATUS_OPTIONS.map((s) => `<option value="${s}">${capitalise(s)}</option>`).join("")}
      </select>
    </div>
    <div id="sProductGrid" class="s-product-grid">
      ${products.length ? products.map(productCard).join("") : empty("No pieces yet — add your first", "shopping-bag")}
    </div>
  `;

  function filterProducts() {
    const q      = document.getElementById("sProductSearch")?.value.toLowerCase() || "";
    const status = document.getElementById("sProductFilter")?.value || "";
    const grid   = document.getElementById("sProductGrid");
    const filtered = products.filter((p) =>
      (!q      || p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q)) &&
      (!status || p.status === status)
    );
    grid.innerHTML = filtered.length ? filtered.map(productCard).join("") : empty("No matches found", "search");
    initLucide();
    bindProductCards();
  }

  document.getElementById("sProductSearch")?.addEventListener("input", filterProducts);
  document.getElementById("sProductFilter")?.addEventListener("change", filterProducts);
  document.getElementById("sAddProduct")?.addEventListener("click", () => openProductForm());
  bindProductCards();
}

function productCard(p) {
  const badge = statusBadge(p.status);
  return `
    <div class="s-product-card" data-pid="${p.id}">
      <div class="s-product-card__img" style="${p.image ? `background-image:url('${esc(p.image)}')` : ""}">
        ${!p.image ? `<i data-lucide="image" class="s-icon"></i>` : ""}
        ${badge}
      </div>
      <div class="s-product-card__body">
        <p class="s-product-card__name">${esc(p.name)}</p>
        <p class="s-product-card__meta">${esc(p.category || "—")} · ${fmtCurrency(p.price)}</p>
      </div>
      <div class="s-product-card__actions">
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit="${p.id}" title="Edit">
          <i data-lucide="pencil" class="s-icon"></i>
        </button>
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-delete="${p.id}" title="Delete">
          <i data-lucide="trash-2" class="s-icon"></i>
        </button>
      </div>
    </div>`;
}

function bindProductCards() {
  dom.content.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const products = load(STORAGE.products, []);
      const p = products.find((x) => x.id === btn.dataset.edit);
      if (p) openProductForm(p);
    });
  });
  dom.content.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => confirmDelete(btn.dataset.delete));
  });
}

function openProductForm(product = null) {
  const isNew = !product;
  const p = product || {
    id: uid(), name: "", price: "", comparePrice: "", category: "", sizes: [],
    image: "", image2: "", image3: "", description: "", curationLine: "",
    inStock: true, status: "active", tags: "", featured: false, updatedAt: new Date().toISOString(),
  };

  openPanel(isNew ? "Add Piece" : "Edit Piece", `
    <div class="s-form-grid">
      ${field("Product Name", "text", "pfName", p.name, "e.g. Amal Abaya in Ivory")}
      ${field("Price (₹)", "number", "pfPrice", p.price, "0")}
      ${field("Compare Price (₹)", "number", "pfCompare", p.comparePrice, "optional")}
      <label class="s-field">
        <span class="s-field__label">Category</span>
        <select id="pfCategory" class="s-field__select">
          <option value="">Select category</option>
          ${CATEGORIES.map((c) => `<option value="${c}" ${p.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
      <label class="s-field">
        <span class="s-field__label">Status</span>
        <select id="pfStatus" class="s-field__select">
          ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${p.status === s ? "selected" : ""}>${capitalise(s)}</option>`).join("")}
        </select>
      </label>
      ${fieldFull("Primary Image URL", "url", "pfImage", p.image, "https://…")}
      ${fieldFull("Secondary Image URL", "url", "pfImage2", p.image2 || "", "https://… (optional)")}
      ${fieldFull("Third Image URL", "url", "pfImage3", p.image3 || "", "https://… (optional)")}
      ${textareaFull("Description", "pfDesc", p.description, 3)}
      ${fieldFull("Curation Line", "text", "pfCurationLine", p.curationLine || "", "A single poetic line for sharing")}
      ${fieldFull("Tags (comma-separated)", "text", "pfTags", p.tags || "", "ivory, festive, linen")}
      <div class="s-field s-field--full">
        <span class="s-field__label">Available Sizes</span>
        <div class="s-size-grid">
          ${SIZES.map((s) => `
            <label class="s-size-chip">
              <input type="checkbox" name="pfSizes" value="${s}" ${(p.sizes || []).includes(s) ? "checked" : ""} />
              <span>${s}</span>
            </label>`).join("")}
        </div>
      </div>
      <div class="s-field s-field--full s-toggle-row">
        <span class="s-field__label">In Stock</span>
        <label class="s-toggle">
          <input type="checkbox" id="pfInStock" ${p.inStock !== false ? "checked" : ""} />
          <span class="s-toggle__track"></span>
        </label>
      </div>
      <div class="s-field s-field--full s-toggle-row">
        <span class="s-field__label">Featured on Homepage</span>
        <label class="s-toggle">
          <input type="checkbox" id="pfFeatured" ${p.featured ? "checked" : ""} />
          <span class="s-toggle__track"></span>
        </label>
      </div>
    </div>
  `, () => {
    const name = val("pfName");
    if (!name) { toast("Product name is required", "error"); return; }
    const sizes = [...document.querySelectorAll("input[name='pfSizes']:checked")].map((el) => el.value);
    const updated = {
      ...p,
      name,
      price:         val("pfPrice"),
      comparePrice:  val("pfCompare"),
      category:      val("pfCategory"),
      status:        val("pfStatus"),
      image:         val("pfImage"),
      image2:        val("pfImage2"),
      image3:        val("pfImage3"),
      description:   val("pfDesc"),
      curationLine:  val("pfCurationLine"),
      tags:          val("pfTags"),
      sizes,
      inStock:       document.getElementById("pfInStock")?.checked !== false,
      featured:      !!document.getElementById("pfFeatured")?.checked,
      updatedAt:     new Date().toISOString(),
    };
    const products = load(STORAGE.products, []);
    const idx      = products.findIndex((x) => x.id === p.id);
    if (idx >= 0) products[idx] = updated; else products.unshift(updated);
    save(STORAGE.products, products);
    closePanel();
    toast(isNew ? "Piece added 💛" : "Piece updated ✨");
    renderProducts();
  });
}

function confirmDelete(pid) {
  if (!confirm("Remove this piece from the studio? This cannot be undone.")) return;
  const products = load(STORAGE.products, []);
  save(STORAGE.products, products.filter((p) => p.id !== pid));
  toast("Piece removed");
  renderProducts();
}

/* ── Collections ────────────────────────────────────────────── */
function renderCollections() {
  setTitle("Collections", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddCol">
      <i data-lucide="plus" class="s-icon"></i> New Collection
    </button>
  `);
  const cols = load(STORAGE.collections, []);
  dom.content.innerHTML = `
    <div class="s-list">
      ${cols.length ? cols.map(colRow).join("") : empty("No collections yet", "layers")}
    </div>
  `;
  document.getElementById("sAddCol")?.addEventListener("click", () => openCollectionForm());
  dom.content.querySelectorAll("[data-edit-col]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cols = load(STORAGE.collections, []);
      const c = cols.find((x) => x.id === btn.dataset.editCol);
      if (c) openCollectionForm(c);
    });
  });
  dom.content.querySelectorAll("[data-del-col]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this collection?")) return;
      const cols = load(STORAGE.collections, []);
      save(STORAGE.collections, cols.filter((c) => c.id !== btn.dataset.delCol));
      toast("Collection removed");
      renderCollections();
    });
  });
}

function colRow(c) {
  return `
    <div class="s-list-item">
      <div class="s-list-item__main">
        <strong>${esc(c.name)}</strong>
        <span class="s-list-item__sub">${c.productIds?.length || 0} pieces · ${esc(c.season || "All season")}</span>
      </div>
      <div class="s-list-item__actions">
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-col="${c.id}"><i data-lucide="pencil" class="s-icon"></i></button>
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-col="${c.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
      </div>
    </div>`;
}

function openCollectionForm(col = null) {
  const isNew = !col;
  const c = col || { id: uid(), name: "", season: "", description: "", coverImage: "", productIds: [] };
  const products = load(STORAGE.products, []);
  openPanel(isNew ? "New Collection" : "Edit Collection", `
    <div class="s-form-grid">
      ${field("Collection Name", "text", "cfName", c.name, "e.g. Ramadan Radiance")}
      ${field("Season / Label", "text", "cfSeason", c.season || "", "e.g. Eid 2025")}
      ${fieldFull("Cover Image URL", "url", "cfCover", c.coverImage || "", "https://…")}
      ${textareaFull("Description", "cfDesc", c.description || "", 2)}
      <div class="s-field s-field--full">
        <span class="s-field__label">Pieces in this collection</span>
        <div class="s-checkbox-list">
          ${products.map((p) => `
            <label class="s-checkbox-item">
              <input type="checkbox" name="cfProducts" value="${p.id}" ${(c.productIds || []).includes(p.id) ? "checked" : ""} />
              <span>${esc(p.name)}</span>
            </label>`).join("") || "<p class='s-muted'>Add pieces first</p>"}
        </div>
      </div>
    </div>
  `, () => {
    const name = val("cfName");
    if (!name) { toast("Collection name required", "error"); return; }
    const productIds = [...document.querySelectorAll("input[name='cfProducts']:checked")].map((el) => el.value);
    const updated = { ...c, name, season: val("cfSeason"), description: val("cfDesc"), coverImage: val("cfCover"), productIds };
    const cols = load(STORAGE.collections, []);
    const idx  = cols.findIndex((x) => x.id === c.id);
    if (idx >= 0) cols[idx] = updated; else cols.unshift(updated);
    save(STORAGE.collections, cols);
    closePanel();
    toast(isNew ? "Collection created" : "Collection updated");
    renderCollections();
  });
}

/* ── Editorial Generator ────────────────────────────────────── */
function renderGenerator() {
  setTitle("Editorial Generator");
  dom.content.innerHTML = `
    <div class="s-gen-wrap">
      <p class="s-gen-intro">Generate ABDAN-voice copy for any piece in seconds. Powered by your brand's editorial soul.</p>
      <div class="s-form-grid">
        ${field("Product Name", "text", "genName", "", "e.g. Noor Silk Abaya")}
        <label class="s-field">
          <span class="s-field__label">Category</span>
          <select id="genCategory" class="s-field__select">
            ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </label>
      </div>
      <button class="s-btn s-btn--primary" id="sGenerate" style="margin-top:1rem">
        <i data-lucide="sparkles" class="s-icon"></i> Generate Copy
      </button>
      <div id="sGenResult" class="s-gen-result" hidden></div>
    </div>
  `;

  document.getElementById("sGenerate")?.addEventListener("click", () => {
    const name = val("genName");
    const cat  = val("genCategory");
    if (!name) { toast("Enter a product name first", "error"); return; }
    const tpl  = GEN_TEMPLATES[cat] || GEN_TEMPLATES["Everyday Grace"];
    const voice = load(STORAGE.voice, DEFAULT_VOICE);

    const result = document.getElementById("sGenResult");
    result.hidden = false;
    result.innerHTML = `
      <h3 class="s-gen-result__title">✨ Generated for "${esc(name)}"</h3>
      <div class="s-gen-block">
        <label class="s-gen-label">Description</label>
        <div class="s-gen-output">${tpl.description(name)}</div>
      </div>
      <div class="s-gen-block">
        <label class="s-gen-label">Soul</label>
        <div class="s-gen-output">${tpl.soul}</div>
      </div>
      <div class="s-gen-block">
        <label class="s-gen-label">Styling Note</label>
        <div class="s-gen-output">${tpl.styling}</div>
      </div>
      <div class="s-gen-block">
        <label class="s-gen-label">Instagram Caption</label>
        <div class="s-gen-output">${tpl.caption(name)}</div>
      </div>
      <div class="s-gen-block">
        <label class="s-gen-label">Made For</label>
        <div class="s-gen-output">${tpl.madeFor}</div>
      </div>
      <div class="s-gen-block">
        <label class="s-gen-label">Brand Closing</label>
        <div class="s-gen-output">${voice.closingLine}</div>
      </div>
      <div class="s-gen-actions">
        <button class="s-btn s-btn--ghost s-btn--sm" id="sCopyAll">
          <i data-lucide="copy" class="s-icon"></i> Copy All
        </button>
      </div>
    `;
    initLucide();

    document.getElementById("sCopyAll")?.addEventListener("click", () => {
      const text = [
        `PRODUCT: ${name} | ${cat}`,
        `\nDESCRIPTION:\n${tpl.description(name)}`,
        `\nSOUL:\n${tpl.soul}`,
        `\nSTYLING:\n${tpl.styling}`,
        `\nCAPTION:\n${tpl.caption(name)}`,
        `\nMADE FOR:\n${tpl.madeFor}`,
      ].join("\n");
      navigator.clipboard?.writeText(text).then(() => toast("Copy text copied to clipboard 💛"));
    });
  });
}

/* ── Homepage Mood ──────────────────────────────────────────── */
function renderHomepage() {
  setTitle("Homepage Mood");
  const hp = load(STORAGE.homepage, DEFAULT_HOMEPAGE);
  dom.content.innerHTML = `
    <div class="s-card s-form-card">
      <h3 class="s-card__title">Hero Section</h3>
      <div class="s-form-grid">
        ${fieldFull("Hero Image URL", "url", "hpHeroImg", hp.heroImageUrl || "", "https://…")}
        ${field("Hero Caption", "text", "hpHeroCaption", hp.heroCaption, "")}
        ${field("Featured Section Label", "text", "hpFeaturedLabel", hp.featuredLabel, "Handpicked for You")}
      </div>
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Her Story Section</h3>
      <div class="s-form-grid">
        ${field("Story Headline", "text", "hpStoryHL", hp.storyHeadline, "")}
        ${textareaFull("Story Body", "hpStoryBody", hp.storyBody, 4)}
      </div>
    </div>
    <div class="s-panel-foot-inline">
      <button class="s-btn s-btn--primary" id="sHpSave">
        <i data-lucide="save" class="s-icon"></i> Save Homepage
      </button>
    </div>
  `;
  document.getElementById("sHpSave")?.addEventListener("click", () => {
    save(STORAGE.homepage, {
      heroImageUrl:  val("hpHeroImg"),
      heroCaption:   val("hpHeroCaption"),
      featuredLabel: val("hpFeaturedLabel"),
      storyHeadline: val("hpStoryHL"),
      storyBody:     val("hpStoryBody"),
    });
    lxSaveGlow("sHpSave", "Homepage mood saved 🌿");
  });
}

/* ── Gentle Notices ─────────────────────────────────────────── */
function renderNotices() {
  setTitle("Gentle Notices", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddNotice">
      <i data-lucide="plus" class="s-icon"></i> Add Notice
    </button>
  `);
  const notices = load(STORAGE.notices, []);
  dom.content.innerHTML = `
    <p class="s-muted" style="margin-bottom:1rem">Notices appear as a soft banner on your storefront.</p>
    <div class="s-list">
      ${notices.length ? notices.map(noticeRow).join("") : empty("No notices yet", "bell")}
    </div>
  `;
  document.getElementById("sAddNotice")?.addEventListener("click", () => openNoticeForm());
  dom.content.querySelectorAll("[data-edit-notice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = load(STORAGE.notices, []).find((x) => x.id === btn.dataset.editNotice);
      if (n) openNoticeForm(n);
    });
  });
  dom.content.querySelectorAll("[data-del-notice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this notice?")) return;
      const notices = load(STORAGE.notices, []);
      save(STORAGE.notices, notices.filter((n) => n.id !== btn.dataset.delNotice));
      toast("Notice removed");
      renderNotices();
    });
  });
  dom.content.querySelectorAll("[data-toggle-notice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const notices = load(STORAGE.notices, []);
      const n = notices.find((x) => x.id === btn.dataset.toggleNotice);
      if (n) { n.active = !n.active; save(STORAGE.notices, notices); renderNotices(); }
    });
  });
}

function noticeRow(n) {
  return `
    <div class="s-list-item">
      <div class="s-list-item__main">
        <strong>${esc(n.text)}</strong>
        <span class="s-list-item__sub">${n.active
          ? `<span class="s-badge s-badge--green">Active</span>`
          : `<span class="s-badge">Draft</span>`} · ${fmtDate(n.createdAt)}</span>
      </div>
      <div class="s-list-item__actions">
        <button class="s-btn s-btn--ghost s-btn--sm" data-toggle-notice="${n.id}">${n.active ? "Deactivate" : "Activate"}</button>
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-notice="${n.id}"><i data-lucide="pencil" class="s-icon"></i></button>
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-notice="${n.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
      </div>
    </div>`;
}

function openNoticeForm(notice = null) {
  const isNew = !notice;
  const n = notice || { id: uid(), text: "", active: true, createdAt: new Date().toISOString() };
  openPanel(isNew ? "Add Notice" : "Edit Notice", `
    <div class="s-form-grid">
      ${fieldFull("Notice Text", "text", "nfText", n.text, "e.g. Free shipping on orders above ₹999 💛")}
      <div class="s-field s-field--full s-toggle-row">
        <span class="s-field__label">Active on site</span>
        <label class="s-toggle">
          <input type="checkbox" id="nfActive" ${n.active ? "checked" : ""} />
          <span class="s-toggle__track"></span>
        </label>
      </div>
    </div>
  `, () => {
    const text = val("nfText");
    if (!text) { toast("Notice text is required", "error"); return; }
    const updated = { ...n, text, active: !!document.getElementById("nfActive")?.checked };
    const notices = load(STORAGE.notices, []);
    const idx = notices.findIndex((x) => x.id === n.id);
    if (idx >= 0) notices[idx] = updated; else notices.unshift(updated);
    save(STORAGE.notices, notices);
    closePanel();
    toast(isNew ? "Notice added" : "Notice updated");
    renderNotices();
  });
}

/* ── Her Circle (customers) ─────────────────────────────────── */
function renderCustomers() {
  setTitle("Her Circle 💛");
  const customers = load(STORAGE.customers, []);
  dom.content.innerHTML = `
    <div class="s-filter-bar">
      <div class="s-search">
        <i data-lucide="search" class="s-icon"></i>
        <input id="sCustSearch" type="search" placeholder="Search by name or email…" class="s-field__input" />
      </div>
    </div>
    <div id="sCustList" class="s-list">
      ${customers.length ? customers.map(customerRow).join("") : empty("No customers yet — they'll appear when members join Your Space", "users")}
    </div>
  `;
  document.getElementById("sCustSearch")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.getElementById("sCustList").innerHTML = customers
      .filter((c) => (c.name || "").toLowerCase().includes(q) || (c.email || "").toLowerCase().includes(q))
      .map(customerRow).join("") || empty("No matches", "search");
    initLucide();
  });
}

function customerRow(c) {
  return `
    <div class="s-list-item">
      <div class="s-list-item__avatar">${(c.name || "?")[0].toUpperCase()}</div>
      <div class="s-list-item__main">
        <strong>${esc(c.name || "Anonymous")}</strong>
        <span class="s-list-item__sub">${esc(c.email || "—")} · Joined ${fmtDate(c.joinedAt)}</span>
      </div>
      <div class="s-list-item__actions">
        <span class="s-badge">${c.wishlist?.length || 0} wishlist</span>
      </div>
    </div>`;
}

/* ── Her Circle Updates (messaging) ────────────────────────── */
function renderMessaging() {
  setTitle("Her Circle Updates");
  const customers = load(STORAGE.customers, []);
  dom.content.innerHTML = `
    <div class="s-alert s-alert--info">
      <i data-lucide="info" class="s-icon"></i>
      Messages are sent via WhatsApp to customers who have saved their number in Your Space.
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Compose Message</h3>
      <div class="s-form-grid">
        <label class="s-field s-field--full">
          <span class="s-field__label">Recipient</span>
          <select id="msgTo" class="s-field__select">
            <option value="all">All of Her Circle (${customers.length} members)</option>
            ${customers.map((c) => `<option value="${c.id}">${esc(c.name || c.email || c.id)}</option>`).join("")}
          </select>
        </label>
        ${textareaFull("Message", "msgBody", "", 4, "Write with warmth…")}
      </div>
      <div style="margin-top:1rem">
        <button class="s-btn s-btn--primary" id="sSendMsg">
          <i data-lucide="send" class="s-icon"></i> Open in WhatsApp
        </button>
      </div>
    </div>
  `;
  document.getElementById("sSendMsg")?.addEventListener("click", () => {
    const body = val("msgBody");
    if (!body) { toast("Write a message first", "error"); return; }
    const settings = load(STORAGE.settings, DEFAULT_SETTINGS);
    const number   = settings.whatsappNumber?.replace(/\D/g, "") || "";
    const url      = `https://wa.me/${number}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noreferrer");
  });
}

/* ── Orders ─────────────────────────────────────────────────── */
function renderOrders() {
  setTitle("Orders", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddOrder">
      <i data-lucide="plus" class="s-icon"></i> Log Order
    </button>
  `);
  const orders = [...load(STORAGE.orders, [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  dom.content.innerHTML = `
    <div class="s-filter-bar">
      <div class="s-search">
        <i data-lucide="search" class="s-icon"></i>
        <input id="sOrderSearch" type="search" placeholder="Search by customer or product…" class="s-field__input" />
      </div>
      <select id="sOrderFilter" class="s-field__select">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
    <div id="sOrderList" class="s-list">
      ${orders.length ? orders.map(orderRow).join("") : empty("No orders logged yet", "receipt")}
    </div>
  `;

  function filterOrders() {
    const q      = document.getElementById("sOrderSearch")?.value.toLowerCase() || "";
    const status = document.getElementById("sOrderFilter")?.value || "";
    document.getElementById("sOrderList").innerHTML = orders.filter((o) =>
      (!q      || (o.customer || "").toLowerCase().includes(q) || (o.product || "").toLowerCase().includes(q)) &&
      (!status || o.status === status)
    ).map(orderRow).join("") || empty("No matches", "search");
    initLucide();
    bindOrderActions();
  }

  document.getElementById("sOrderSearch")?.addEventListener("input", filterOrders);
  document.getElementById("sOrderFilter")?.addEventListener("change", filterOrders);
  document.getElementById("sAddOrder")?.addEventListener("click", () => openOrderForm());
  bindOrderActions();
}

function orderRow(o) {
  const cls = { pending: "s-badge--amber", confirmed: "s-badge--blue", shipped: "s-badge--emerald", delivered: "s-badge--green", cancelled: "s-badge--red" }[o.status] || "";
  return `
    <div class="s-list-item">
      <div class="s-list-item__main">
        <strong>${esc(o.customer || "—")}</strong>
        <span class="s-list-item__sub">${esc(o.product || "—")} · ${fmtCurrency(o.total)} · ${fmtDate(o.createdAt)}</span>
      </div>
      <div class="s-list-item__actions">
        <span class="s-badge ${cls}">${capitalise(o.status || "pending")}</span>
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-order="${o.id}"><i data-lucide="pencil" class="s-icon"></i></button>
        <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-order="${o.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
      </div>
    </div>`;
}

function bindOrderActions() {
  dom.content.querySelectorAll("[data-edit-order]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const o = load(STORAGE.orders, []).find((x) => x.id === btn.dataset.editOrder);
      if (o) openOrderForm(o);
    });
  });
  dom.content.querySelectorAll("[data-del-order]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this order record?")) return;
      save(STORAGE.orders, load(STORAGE.orders, []).filter((o) => o.id !== btn.dataset.delOrder));
      toast("Order removed");
      renderOrders();
    });
  });
}

function openOrderForm(order = null) {
  const isNew = !order;
  const o = order || { id: uid(), customer: "", phone: "", product: "", total: "", status: "pending", notes: "", createdAt: new Date().toISOString() };
  const products = load(STORAGE.products, []);
  openPanel(isNew ? "Log Order" : "Edit Order", `
    <div class="s-form-grid">
      ${field("Customer Name", "text", "ofCustomer", o.customer, "e.g. Fatima A.")}
      ${field("Phone / WhatsApp", "tel", "ofPhone", o.phone || "", "+91…")}
      <label class="s-field">
        <span class="s-field__label">Product</span>
        <select id="ofProduct" class="s-field__select">
          <option value="">— Select —</option>
          ${products.map((p) => `<option value="${p.name}" ${o.product === p.name ? "selected" : ""}>${esc(p.name)}</option>`).join("")}
          <option value="__custom" ${!products.find((p) => p.name === o.product) && o.product ? "selected" : ""}>Other…</option>
        </select>
      </label>
      ${field("Total (₹)", "number", "ofTotal", o.total, "0")}
      <label class="s-field">
        <span class="s-field__label">Status</span>
        <select id="ofStatus" class="s-field__select">
          ${["pending","confirmed","shipped","delivered","cancelled"].map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${capitalise(s)}</option>`).join("")}
        </select>
      </label>
      ${fieldFull("Notes", "text", "ofNotes", o.notes || "", "Any extra notes")}
    </div>
  `, () => {
    const customer = val("ofCustomer");
    if (!customer) { toast("Customer name required", "error"); return; }
    let product = val("ofProduct");
    if (product === "__custom") product = prompt("Enter product name:") || "";
    const updated = { ...o, customer, phone: val("ofPhone"), product, total: val("ofTotal"), status: val("ofStatus"), notes: val("ofNotes") };
    const orders = load(STORAGE.orders, []);
    const idx = orders.findIndex((x) => x.id === o.id);
    if (idx >= 0) orders[idx] = updated; else orders.unshift(updated);
    save(STORAGE.orders, orders);
    closePanel();
    toast(isNew ? "Order logged" : "Order updated");
    renderOrders();
  });
}

/* ── Brand Voice ────────────────────────────────────────────── */
function renderVoice() {
  setTitle("Brand Voice");
  const v = load(STORAGE.voice, DEFAULT_VOICE);
  dom.content.innerHTML = `
    <p class="s-muted" style="margin-bottom:1rem">These phrases define ABDAN's editorial tone across the site and sharing copy.</p>
    <div class="s-card s-form-card">
      <div class="s-form-grid">
        ${fieldFull("Opening Line", "text", "vfOpening", v.openingLine, "")}
        ${fieldFull("Closing Line", "text", "vfClosing", v.closingLine, "")}
        ${fieldFull("Brand Promise", "text", "vfPromise", v.brandPromise, "")}
        ${fieldFull("Hero Headline", "text", "vfHeroHL", v.heroHeadline, "")}
        ${fieldFull("Hero Subline", "text", "vfHeroSub", v.heroSubline, "")}
      </div>
      <div style="margin-top:1rem">
        <button class="s-btn s-btn--primary" id="sVoiceSave">
          <i data-lucide="save" class="s-icon"></i> Save Voice
        </button>
      </div>
    </div>
  `;
  document.getElementById("sVoiceSave")?.addEventListener("click", () => {
    save(STORAGE.voice, {
      openingLine:  val("vfOpening"),
      closingLine:  val("vfClosing"),
      brandPromise: val("vfPromise"),
      heroHeadline: val("vfHeroHL"),
      heroSubline:  val("vfHeroSub"),
    });
    lxSaveGlow("sVoiceSave", "Brand voice saved ✨");
  });
}

/* ── Social Sharing ─────────────────────────────────────────── */
function renderSocial() {
  setTitle("Social Sharing");
  const s = load(STORAGE.social, DEFAULT_SOCIAL);
  dom.content.innerHTML = `
    <div class="s-card s-form-card">
      <div class="s-form-grid">
        ${field("Instagram Handle", "text", "sfIG", s.instagramHandle, "@abdan.in")}
        ${field("Pinterest Board", "text", "sfPin", s.pinterestBoard, "abdan-style")}
        ${fieldFull("Default Share Tagline", "text", "sfTagline", s.shareTagline, "quietly chosen for you ✨")}
      </div>
      <div style="margin-top:1rem">
        <button class="s-btn s-btn--primary" id="sSocialSave">
          <i data-lucide="save" class="s-icon"></i> Save Social Settings
        </button>
      </div>
    </div>
    <div class="s-card" style="margin-top:1rem">
      <h3 class="s-card__title">Share Preview</h3>
      <p class="s-muted">When a customer shares a product, they'll see copy like this on WhatsApp:</p>
      <div class="s-notice-preview" style="margin-top:0.75rem">
        ✨ Noor Silk Abaya — ABDAN<br><br>
        quietly chosen for you ✨<br><br>
        → https://abdan.in?product=noor-silk-abaya
      </div>
    </div>
  `;
  document.getElementById("sSocialSave")?.addEventListener("click", () => {
    save(STORAGE.social, {
      instagramHandle: val("sfIG"),
      pinterestBoard:  val("sfPin"),
      shareTagline:    val("sfTagline"),
    });
    lxSaveGlow("sSocialSave", "Social settings saved");
  });
}

/* ── Media Library ──────────────────────────────────────────── */
function renderMedia() {
  setTitle("Media Library", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddMedia">
      <i data-lucide="plus" class="s-icon"></i> Add Image
    </button>
  `);
  const products = load(STORAGE.products, []);
  const images   = products.flatMap((p) => [p.image, p.image2, p.image3].filter(Boolean).map((url) => ({ url, name: p.name })));

  dom.content.innerHTML = `
    <p class="s-muted" style="margin-bottom:1rem">All images currently in use across your product catalog.</p>
    ${images.length ? `
    <div class="s-media-grid">
      ${images.map(({ url, name }) => `
        <div class="s-media-item">
          <div class="s-media-item__img" style="background-image:url('${esc(url)}')"></div>
          <p class="s-media-item__name">${esc(name)}</p>
        </div>
      `).join("")}
    </div>` : empty("No images yet — add products with image URLs to see them here", "image")}
    <div class="s-alert s-alert--info" style="margin-top:1.5rem">
      <i data-lucide="info" class="s-icon"></i>
      ABDAN uses URL-based images (Unsplash, Cloudinary, etc.). No file uploads needed.
    </div>
  `;
  document.getElementById("sAddMedia")?.addEventListener("click", () => {
    toast("Add image URLs directly in the product form 💛");
  });
}

/* ── Settings ───────────────────────────────────────────────── */
function renderSettings() {
  setTitle("Settings");
  const s = load(STORAGE.settings, DEFAULT_SETTINGS);
  dom.content.innerHTML = `
    <div class="s-card s-form-card">
      <h3 class="s-card__title">Site Identity</h3>
      <div class="s-form-grid">
        ${field("Site Name", "text", "stName", s.siteName, "ABDAN")}
        ${fieldFull("Tagline", "text", "stTagline", s.tagline, "")}
        ${fieldFull("Footer Note", "text", "stFooter", s.footerNote, "")}
        ${fieldFull("Shipping Note", "text", "stShipping", s.shippingNote, "")}
      </div>
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Commerce</h3>
      <div class="s-form-grid">
        ${field("WhatsApp Number", "tel", "stWA", s.whatsappNumber, "919876543210")}
        ${field("UPI ID", "text", "stUPI", s.upiId, "abdan@upi")}
        ${field("Razorpay Key (optional)", "text", "stRPay", s.razorpayKey || "", "rzp_live_…")}
        <label class="s-field">
          <span class="s-field__label">Currency</span>
          <select id="stCurrency" class="s-field__select">
            <option value="INR" ${s.currency === "INR" ? "selected" : ""}>₹ INR</option>
            <option value="USD" ${s.currency === "USD" ? "selected" : ""}>$ USD</option>
            <option value="AED" ${s.currency === "AED" ? "selected" : ""}>AED</option>
          </select>
        </label>
      </div>
    </div>
    <div style="margin-top:1rem">
      <button class="s-btn s-btn--primary" id="sSettingsSave">
        <i data-lucide="save" class="s-icon"></i> Save Settings
      </button>
    </div>
  `;
  document.getElementById("sSettingsSave")?.addEventListener("click", () => {
    save(STORAGE.settings, {
      siteName:       val("stName"),
      tagline:        val("stTagline"),
      footerNote:     val("stFooter"),
      shippingNote:   val("stShipping"),
      whatsappNumber: val("stWA"),
      upiId:          val("stUPI"),
      razorpayKey:    val("stRPay"),
      currency:       val("stCurrency"),
    });
    lxSaveGlow("sSettingsSave", "Settings saved ✨");
  });
}

/* ── Trust & Policy ─────────────────────────────────────────── */
function renderPolicy() {
  setTitle("Trust & Policy");
  dom.content.innerHTML = `
    <div class="s-alert s-alert--ok">
      <i data-lucide="shield-check" class="s-icon"></i>
      ABDAN Studio is for authorised team use only. All data is stored locally in your browser.
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Data & Privacy</h3>
      <div class="s-policy-list">
        <p>• All Studio data is stored in your browser's <strong>localStorage</strong>. No external servers or databases are used.</p>
        <p>• Customer profiles are created by customers themselves via <strong>Your Space 💛</strong> on the main site.</p>
        <p>• Your admin session is protected by <strong>SHA-256 hashed credentials</strong> — your password is never stored in plain text.</p>
        <p>• Sessions expire when you sign out or close the browser tab.</p>
        <p>• ABDAN does not use cookies or third-party tracking on the storefront.</p>
        <p>• Payment processing is handled directly by <strong>Razorpay</strong> or <strong>UPI</strong> — ABDAN does not store card or payment data.</p>
      </div>
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Danger Zone</h3>
      <p class="s-muted" style="margin-bottom:1rem">These actions are permanent and cannot be undone.</p>
      <div class="s-danger-row">
        <button class="s-btn s-btn--danger s-btn--sm" id="sClearProducts">Clear All Products</button>
        <button class="s-btn s-btn--danger s-btn--sm" id="sClearOrders">Clear All Orders</button>
        <button class="s-btn s-btn--danger s-btn--sm" id="sClearAll">Reset All Studio Data</button>
      </div>
    </div>
  `;
  document.getElementById("sClearProducts")?.addEventListener("click", () => {
    if (!confirm("Delete ALL products from the studio? This cannot be undone.")) return;
    save(STORAGE.products, []);
    toast("All products cleared");
  });
  document.getElementById("sClearOrders")?.addEventListener("click", () => {
    if (!confirm("Delete ALL order records? This cannot be undone.")) return;
    save(STORAGE.orders, []);
    toast("All orders cleared");
  });
  document.getElementById("sClearAll")?.addEventListener("click", () => {
    if (!confirm("Reset ALL ABDAN Studio data? This will wipe products, orders, settings, notices, and all content. Cannot be undone.")) return;
    Object.values(STORAGE).forEach((k) => localStorage.removeItem(k));
    toast("Studio data reset 🌿");
  });
}

/* ════════════════════════════════════════════════════════════
   SHARED HELPERS
   ════════════════════════════════════════════════════════════ */

function field(label, type, id, value = "", placeholder = "") {
  return `
    <label class="s-field">
      <span class="s-field__label">${label}</span>
      <input id="${id}" type="${type}" class="s-field__input" value="${esc(String(value))}" placeholder="${esc(placeholder)}" />
    </label>`;
}

function fieldFull(label, type, id, value = "", placeholder = "") {
  return `
    <label class="s-field s-field--full">
      <span class="s-field__label">${label}</span>
      <input id="${id}" type="${type}" class="s-field__input" value="${esc(String(value))}" placeholder="${esc(placeholder)}" />
    </label>`;
}

function textareaFull(label, id, value = "", rows = 3, placeholder = "") {
  return `
    <label class="s-field s-field--full">
      <span class="s-field__label">${label}</span>
      <textarea id="${id}" class="s-field__textarea" rows="${rows}" placeholder="${esc(placeholder)}">${esc(String(value))}</textarea>
    </label>`;
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function esc(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function capitalise(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : str;
}

function empty(message, icon = "inbox") {
  return `
    <div class="s-empty">
      <i data-lucide="${icon}" class="s-icon s-empty__icon"></i>
      <p>${message}</p>
    </div>`;
}

function statusBadge(status) {
  const map = { active: "s-badge--green", draft: "s-badge--amber", "sold-out": "s-badge--red", archived: "" };
  return `<span class="s-badge ${map[status] || ""} s-product-card__badge">${capitalise(status || "draft")}</span>`;
}

/* ── Theme ──────────────────────────────────────────────────── */
function loadTheme() {
  const saved = localStorage.getItem("abdan-studio-theme") || "light";
  document.documentElement.dataset.theme = saved;
  updateThemeBtn(saved);
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("abdan-studio-theme", next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  if (!dom.themeBtn) return;
  dom.themeBtn.querySelector("i")?.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
  dom.themeBtn.querySelector("span").textContent = theme === "dark" ? "Light mode" : "Dark mode";
  initLucide();
}

/* ── Sign out ───────────────────────────────────────────────── */
function signout() {
  sessionStorage.removeItem("abdan-admin-auth");
  window.location.replace("/");
}

/* ── Tab bar "More" ─────────────────────────────────────────── */
function openMoreMenu() {
  const moreViews = STUDIO_VIEWS.filter((v) => !["overview","products","orders","customers"].includes(v.id));
  openPanel("More sections", `
    <div class="s-list">
      ${moreViews.map((v) => `
        <button class="s-list-item s-list-item--btn" data-nav="${v.id}">
          <i data-lucide="${v.icon}" class="s-icon"></i>
          <span>${v.label}</span>
          <i data-lucide="chevron-right" class="s-icon s-list-item__chevron"></i>
        </button>
      `).join("")}
    </div>
  `);
  dom.panelBody.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closePanel();
      navigate(btn.dataset.nav);
    });
  });
}

/* ════════════════════════════════════════════════════════════
   EVENT WIRING
   ════════════════════════════════════════════════════════════ */

function wireEvents() {
  /* Sidebar nav clicks */
  dom.nav.addEventListener("click", (e) => {
    const link = e.target.closest("[data-nav]");
    if (link) { e.preventDefault(); navigate(link.dataset.nav); }
  });

  /* Sidebar overlay close */
  dom.asideOverlay.addEventListener("click", closeSidebar);

  /* Mobile menu button */
  dom.menuBtn?.addEventListener("click", () => sidebarOpen ? closeSidebar() : openSidebar());

  /* Panel close / cancel */
  dom.panelClose?.addEventListener("click", closePanel);
  dom.panelCancel?.addEventListener("click", closePanel);
  dom.panelOverlay?.addEventListener("click", closePanel);
  dom.panelSave?.addEventListener("click", () => panelSaveFn?.());

  /* Theme */
  dom.themeBtn?.addEventListener("click", toggleTheme);

  /* Sign out */
  dom.signoutBtn?.addEventListener("click", signout);

  /* Tab bar */
  document.querySelectorAll(".s-tab[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.nav));
  });
  document.getElementById("sTabMore")?.addEventListener("click", openMoreMenu);

  /* Quick actions + product card nav (delegated) */
  document.addEventListener("click", (e) => {
    const qa = e.target.closest(".s-qaction[data-nav]");
    if (qa) navigate(qa.dataset.nav);
  });

  /* Hash change (browser back/forward) */
  window.addEventListener("hashchange", () => {
    const id = window.location.hash.replace("#", "") || "overview";
    if (STUDIO_VIEWS.find((v) => v.id === id)) {
      currentView = id;
      buildNav();
      syncTabBar();
      renderView(id);
    }
  });

  /* Keyboard: Escape closes panel / sidebar */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!dom.panel.hidden) closePanel();
      else if (sidebarOpen)  closeSidebar();
    }
  });
}

/* ════════════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════════════ */

function init() {
  loadTheme();
  buildNav();
  wireEvents();

  /* Seed products from main site if none exist */
  if (!localStorage.getItem(STORAGE.products)) {
    save(STORAGE.products, []);
  }

  /* Initial view from URL hash */
  const hash = window.location.hash.replace("#", "") || "overview";
  const view = STUDIO_VIEWS.find((v) => v.id === hash) ? hash : "overview";
  currentView = view;
  buildNav();
  syncTabBar();

  /* Hide loading screen and render */
  dom.loading?.remove();
  renderView(view);
}

/* Defer until Lucide is ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
