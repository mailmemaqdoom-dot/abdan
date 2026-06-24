/* ============================================================
   ABDAN Studio — Brand Operating System
   js/studio.js  |  Static · No framework · Cloudflare Pages
   ============================================================ */

"use strict";

/* ── Auth gate ─────────────────────────────────────────────── */
/* Runs synchronously before any Studio code executes.
   Priority: sessionStorage (fast, same-tab) → localStorage token (cross-tab, 8h).
   On any valid path: token expiry is refreshed so active sessions never
   expire mid-use.  On failure: hard redirect to storefront.           */
(function () {
  const LS_KEY  = "abdan-admin-token";
  const SS_KEY  = "abdan-admin-auth";
  const EIGHT_H = 8 * 60 * 60 * 1000;

  function refreshToken() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        v: "true", exp: Date.now() + EIGHT_H,
      }));
    } catch { /* storage quota — session still valid */ }
  }

  /* Fast path: sessionStorage already set in this tab */
  if (sessionStorage.getItem(SS_KEY) === "true") {
    refreshToken(); /* extend the 8-hour window on every Studio load */
    return;
  }

  /* Fallback: validate localStorage token (handles new tabs, refreshes) */
  try {
    const t = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    if (t && t.v === "true" && t.exp > Date.now()) {
      sessionStorage.setItem(SS_KEY, "true"); /* hydrate fast path */
      refreshToken();
      return;
    }
  } catch { /* corrupt token — fall through to redirect */ }

  /* No valid session found — return to storefront */
  window.location.replace("/");
})();

/* ── Constants ─────────────────────────────────────────────── */
const STUDIO_VIEWS = [
  /* ── General ─────────────────────────────────────────────── */
  { id: "command-center", label: "Command Center",  icon: "gauge",            group: "General"      },
  { id: "overview",    label: "Studio Overview",    icon: "layout-dashboard", group: "General"      },

  /* ── BRAND ───────────────────────────────────────────────── */
  { id: "voice",       label: "Brand Voice",        icon: "type",             group: "Brand"        },
  { id: "logo",        label: "Logo Management",    icon: "gem",              group: "Brand"        },
  { id: "typography",  label: "Typography",         icon: "baseline",         group: "Brand"        },
  { id: "colors",      label: "Color System",       icon: "droplet",          group: "Brand"        },
  { id: "atmosphere",  label: "Atmosphere",         icon: "sparkles",         group: "Brand"        },
  { id: "social",      label: "Social Sharing",     icon: "share-2",          group: "Brand"        },

  /* ── EXPERIENCE ──────────────────────────────────────────── */
  { id: "policy",      label: "Trust Center",       icon: "shield",           group: "Experience"   },
  { id: "terms",       label: "T&C Manager",        icon: "file-text",        group: "Experience"   },
  { id: "legal",       label: "Legal Acceptance",   icon: "check-circle",     group: "Experience"   },

  /* ── COMMERCE ────────────────────────────────────────────── */
  { id: "products",    label: "Curated Pieces",     icon: "shopping-bag",     group: "Commerce"     },
  { id: "collections", label: "Collections",        icon: "layers",           group: "Commerce"     },
  { id: "orders",      label: "Orders",             icon: "receipt",          group: "Commerce"     },
  { id: "offers",      label: "Offer Studio",       icon: "tag",              group: "Commerce"     },
  { id: "coupons",     label: "Discount Management", icon: "ticket",          group: "Commerce"     },
  { id: "rules",       label: "Automated Rules",    icon: "git-branch",       group: "Commerce"     },
  { id: "vendors",     label: "Vendor Management",  icon: "truck",            group: "Commerce"     },
  { id: "media",       label: "Media Library",      icon: "image",            group: "Commerce"     },

  /* ── STORYTELLING ────────────────────────────────────────── */
  { id: "generator",   label: "Editorial Studio",   icon: "pen-tool",         group: "Storytelling" },
  { id: "campaigns",   label: "Campaign Engine",    icon: "megaphone",        group: "Storytelling" },
  { id: "founder",     label: "Founder Notes",      icon: "feather",          group: "Storytelling" },
  { id: "homepage",    label: "Homepage Mood",      icon: "layout",           group: "Storytelling" },
  { id: "notices",     label: "Gentle Notices",     icon: "bell",             group: "Storytelling" },

  /* ── HER CIRCLE ──────────────────────────────────────────── */
  { id: "customers",   label: "Her Circle 💛",       icon: "users",            group: "Her Circle"   },
  { id: "messaging",   label: "Circle Updates",     icon: "send",             group: "Her Circle"   },
  { id: "shareearn",   label: "Share & Earn",       icon: "gift",             group: "Her Circle"   },
  { id: "journey",     label: "Journey Management", icon: "map",              group: "Her Circle"   },
  { id: "moments",     label: "Moments Insights",   icon: "calendar-heart",   group: "Her Circle"   },
  { id: "edits",       label: "Edit Management",    icon: "scissors",         group: "Her Circle"   },
  { id: "reviews",     label: "Reviews",            icon: "star",             group: "Her Circle"   },
  { id: "requests",    label: "Sourcing Requests",  icon: "search",           group: "Her Circle"   },
  { id: "concierge",   label: "Concierge Queue",    icon: "message-circle",   group: "Her Circle"   },

  /* ── INTELLIGENCE ────────────────────────────────────────── */
  { id: "operations",  label: "Operations",          icon: "activity",         group: "Intelligence" },
  { id: "analytics",   label: "Analytics",          icon: "bar-chart-2",      group: "Intelligence" },
  { id: "experience",  label: "Experience Intel",   icon: "trending-up",      group: "Intelligence" },
  { id: "permissions", label: "Permissions",        icon: "lock",             group: "Intelligence" },

  /* ── SYSTEM ──────────────────────────────────────────────── */
  { id: "settings",    label: "Settings",           icon: "settings",         group: "System"       },
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
  customers:        "abdan-space-profiles",
  globalRequests:   "abdan-global-requests",
  offers:      "abdan-studio-offers",
  coupons:     "abdan-studio-coupons",
  rules:       "abdan-studio-rules",
  shareEarn:   "abdan-studio-shareearn",
  referrals:   "abdan-referrals",
  journey:     "abdan-studio-journey",
  reviews:     "abdan-studio-reviews",
  campaigns:   "abdan-studio-campaigns",
  founder:     "abdan-studio-founder",
  terms:       "abdan-studio-terms",
};

const CATEGORIES = ["Everyday Grace","Modest Essence","Festive Glow","Workflow Elegance","Soft Statement","Evening Calm"];
const SIZES      = ["XS","S","M","L","XL","XXL","Free Size"];
const STATUS_OPTIONS = ["active","draft","sold-out","archived"];
/* Premium product badges — editorial language only (no sale/discount wording). */
const ABDAN_BADGES = [
  "Limited Collection","Curated Selection","Circle Benefit","Member Advantage",
  "Seasonal Edit","Early Access","New Arrival","Handpicked",
  "Festival Selection","Exclusive Release",
];
/* Shared savings math — single source of truth for current/compare pricing.
   Returns null when there is no genuine saving (keeps display honest). */
function abdanSavings(price, comparePrice) {
  const toNum = (v) => {
    if (v === null || v === undefined) return NaN;
    const m = String(v).replace(/[^\d.]/g, "");
    return m ? parseFloat(m) : NaN;
  };
  const cur = toNum(price), cmp = toNum(comparePrice);
  if (!isFinite(cur) || !isFinite(cmp) || cmp <= cur) return null;
  const amount = Math.round(cmp - cur);
  const pct = Math.floor((amount / cmp) * 100);   /* conservative — never overstates */
  return { current: cur, compare: cmp, amount, pct };
}

/* ── Default data ───────────────────────────────────────────── */
const DEFAULT_SETTINGS = {
  siteName:        "ABDAN",
  tagline:         "Your devotion deserves to be seen.",
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
  heroHeadline:    "Your Devotion Deserves To Be Seen",
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

/* RC5-04 — Single source of truth for the customer collection.
   STORAGE.customers ("abdan-space-profiles") is an OBJECT keyed by email.
   Every admin view must use this helper (never load(STORAGE.customers, []))
   to get a normalized ARRAY with the field names the views expect. */
function getCustomers() {
  const obj = load(STORAGE.customers, {}) || {};
  if (Array.isArray(obj)) return obj; /* defensive: legacy array shape */
  return Object.values(obj).map((p) => ({
    ...p,
    id:            p.email || p.id || "",
    name:          p.displayName || p.fullName || p.email || "Anonymous",
    joinedAt:      p.createdAt || p.joinedAt || null,
    acceptedTerms: (p.consent && p.consent.agreement) || p.acceptedTerms || false,
    wishlist:      p.wishlist || [],
  }));
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
let currentView    = "overview";
let panelSaveFn    = null;
let toastTimer     = null;
let sidebarOpen    = false;
let cmdPaletteOpen = false;

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

/* RC5-07: attention counts for sidebar badges (requests needing action, pending replies) */
function navAttentionCounts() {
  let openRequests = 0, pendingReplies = 0;
  try {
    const reqs = load(STORAGE.globalRequests, []) || [];
    openRequests = reqs.filter((r) => r.status && r.status !== "Completed").length;
  } catch {}
  try {
    getCustomers().forEach((c) => {
      const msgs = JSON.parse(localStorage.getItem(`abdan-sp-concierge:${(c.email||"").toLowerCase()}`) || "[]");
      if (msgs.length && msgs[msgs.length - 1].from === "customer") pendingReplies++;
    });
  } catch {}
  return { requests: openRequests, concierge: pendingReplies };
}

/* ── Nav builder ────────────────────────────────────────────── */
function buildNav() {
  const groups = {};
  STUDIO_VIEWS.forEach((v) => {
    if (!groups[v.group]) groups[v.group] = [];
    groups[v.group].push(v);
  });

  const counts = navAttentionCounts();

  dom.nav.innerHTML = Object.entries(groups).map(([group, views]) => `
    <div class="s-nav-group">
      <p class="s-nav-group__label">${group}</p>
      ${views.map((v) => {
        const n = counts[v.id] || 0;
        const badge = n > 0 ? `<span class="s-nav-badge">${n}</span>` : "";
        return `
        <a class="s-nav-item ${v.id === currentView ? "s-nav-item--active" : ""}"
           href="#${v.id}" data-nav="${v.id}" role="menuitem">
          <i data-lucide="${v.icon}" class="s-icon"></i>
          <span>${v.label}</span>${badge}
        </a>`;
      }).join("")}
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
    "command-center": renderCommandCenter,
    vendors:     renderVendorsStub,
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
    /* §44 — Luxury Brand Operating Ecosystem */
    logo:        renderLogo,
    typography:  renderTypography,
    colors:      renderColors,
    atmosphere:  renderAtmosphere,
    terms:       renderTerms,
    legal:       renderLegal,
    offers:      renderOffers,
    coupons:     renderCoupons,
    rules:       renderRules,
    shareearn:   renderShareEarnAdmin,
    journey:     renderJourneyAdmin,
    moments:     renderMomentsAdmin,
    edits:       renderEditsAdmin,
    reviews:     renderReviews,
    requests:    renderRequests,
    concierge:   renderConciergeQueue,
    operations:  renderOperations,
    campaigns:   renderCampaigns,
    founder:     renderFounder,
    analytics:   renderAnalytics,
    experience:  renderExperience,
    permissions: renderPermissions,
  };
  (renders[id] || renderOverview)();
  initLucide();
  dom.content.focus();
}

/* ════════════════════════════════════════════════════════════
   VIEW RENDERERS
   ════════════════════════════════════════════════════════════ */

/* ── RC-18: ABDAN Command Center — Phase 1 executive snapshot ──
   Additive admin homepage. Uses existing data only (orders, customer
   profiles, loyalty points, concierge threads) — no AI, no predictions,
   no new tracking systems. Replaces "operations" as the post-login
   landing view; every prior view remains reachable from the sidebar. */
function ccOrderKey(o) {
  return String(o.customerEmail || o.customerPhone || o.phone || o.customer || "").toLowerCase().trim();
}
function ccOrderTotal(o) { return Number(o.total) || 0; }
function ccDayStart(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function ccIsSameDay(a, b) { return ccDayStart(a).getTime() === ccDayStart(b).getTime(); }
function ccWeekStart(d) { const x = ccDayStart(d); const day = x.getDay(); x.setDate(x.getDate() - day); return x; }
function ccMonthStart(d) { const x = ccDayStart(d); x.setDate(1); return x; }
function ccYearStart(d) { const x = ccDayStart(d); x.setMonth(0, 1); return x; }

/* ── RC-20: Executive intelligence helpers (additive) ──────────────────
   Pure read-only aggregation over existing localStorage data. No new
   customer-facing behaviour; no invented numbers — fields with no real
   underlying data render an honest "not yet tracked" note instead. */
function ccPct(curr, prev) { return prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null; }
function ccTopEntries(map, n = 5) { return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n); }
function ccDeslug(id) { return String(id || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
function ccRankList(rows, fmt) {
  return rows.length
    ? `<div class="s-rank-list">${rows.map(([label, val]) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(ccDeslug(label))}</span><span class="s-rank-row__val">${fmt ? fmt(val) : val}</span></div>`).join("")}</div>`
    : `<p class="cc-note">Not enough activity recorded yet.</p>`;
}
function ccScanPrefixed(prefix) {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf(prefix) !== 0) continue;
      let data = null; try { data = JSON.parse(localStorage.getItem(k)); } catch { data = null; }
      out.push({ ownerEmail: k.slice(prefix.length), data });
    }
  } catch {}
  return out;
}
function ccCounter(key) { try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; } catch { return {}; } }

function renderCommandCenter() {
  setTitle("ABDAN Command Center", `<span class="s-muted" style="font-size:0.78rem">${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>`);

  const now     = new Date();
  const orders  = load(STORAGE.orders, []);
  const profiles = load(STORAGE.customers, {});
  const profileList = Object.entries(profiles);

  const todayOrders     = orders.filter((o) => o.createdAt && ccIsSameDay(o.createdAt, now));
  const yesterday       = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayOrders = orders.filter((o) => o.createdAt && ccIsSameDay(o.createdAt, yesterday));
  const weekOrders      = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= ccWeekStart(now));
  const monthOrders     = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= ccMonthStart(now));
  const yearOrders      = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= ccYearStart(now));

  const revToday     = todayOrders.reduce((s, o) => s + ccOrderTotal(o), 0);
  const revYesterday = yesterdayOrders.reduce((s, o) => s + ccOrderTotal(o), 0);
  const revWeek       = weekOrders.reduce((s, o) => s + ccOrderTotal(o), 0);
  const revMonth      = monthOrders.reduce((s, o) => s + ccOrderTotal(o), 0);
  const revYear       = yearOrders.reduce((s, o) => s + ccOrderTotal(o), 0);
  const revLifetime   = orders.reduce((s, o) => s + ccOrderTotal(o), 0);

  const todayCustomerKeys = new Set(todayOrders.map(ccOrderKey).filter(Boolean));
  const pendingCount    = orders.filter((o) => o.status === "pending").length;
  const confirmedCount  = orders.filter((o) => o.status === "confirmed").length;
  const shippedCount    = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount  = orders.filter((o) => o.status === "delivered").length;
  const cancelledCount  = orders.filter((o) => o.status === "cancelled").length;
  const issueCases      = orders.filter((o) => o.status === "cancelled" && (o.notes || "").trim()).length;

  /* Concierge — scan per-member threads (same technique as Concierge Queue) */
  let conciergeOpen = 0, conciergeResolved = 0, conciergeToday = 0;
  const responseGaps = [];
  const conciergeEmails = [];
  const categoryCounts = {};
  profileList.forEach(([email]) => {
    let msgs = []; try { msgs = JSON.parse(localStorage.getItem(`abdan-sp-concierge:${email}`) || "[]") || []; } catch { msgs = []; }
    if (!msgs.length) return;
    conciergeEmails.push(email);
    const last = msgs[msgs.length - 1];
    if (last.from === "customer") conciergeOpen++; else conciergeResolved++;
    msgs.forEach((m) => {
      const ts = m.sentAt || m.ts || 0;
      if (m.from === "customer" && ts && ccIsSameDay(ts, now)) conciergeToday++;
      if (m.category) categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
    });
    for (let i = 0; i < msgs.length - 1; i++) {
      if (msgs[i].from === "customer" && msgs[i + 1].from === "abdan") {
        const gap = (msgs[i + 1].sentAt || msgs[i + 1].ts || 0) - (msgs[i].sentAt || msgs[i].ts || 0);
        if (gap > 0) responseGaps.push(gap);
      }
    }
  });
  const avgResponseMs = responseGaps.length ? responseGaps.reduce((s, g) => s + g, 0) / responseGaps.length : 0;
  const avgResponseLabel = !responseGaps.length ? "—"
    : avgResponseMs < 3600000 ? `${Math.round(avgResponseMs / 60000)} min`
    : avgResponseMs < 86400000 ? `${(avgResponseMs / 3600000).toFixed(1)} hrs`
    : `${(avgResponseMs / 86400000).toFixed(1)} days`;
  const conciergeEmailSet = new Set(conciergeEmails);
  const ordersFromConcierge = orders.filter((o) => conciergeEmailSet.has(String(o.customerEmail || "").toLowerCase())).length;

  /* Customers */
  const newCustomersMonth = profileList.filter(([, p]) => p.createdAt && new Date(p.createdAt) >= ccMonthStart(now)).length;
  const newCustomersWeek  = profileList.filter(([, p]) => p.createdAt && new Date(p.createdAt) >= ccWeekStart(now)).length;
  const orderCountByKey = {};
  orders.forEach((o) => { const k = ccOrderKey(o); if (k) orderCountByKey[k] = (orderCountByKey[k] || 0) + 1; });
  const returningCustomers = Object.values(orderCountByKey).filter((n) => n > 1).length;
  let activeCircle = 0, innerCircle = 0, vipCircle = 0;
  const ptsByEmail = {};
  profileList.forEach(([email]) => {
    let pts = 0; try { pts = JSON.parse(localStorage.getItem(`abdan-sp-loyalty:${email}`) || "0") || 0; } catch { pts = 0; }
    ptsByEmail[email] = pts;
    if (pts > 0) activeCircle++;
    if (pts >= 150) innerCircle++;
    if (pts >= 300) vipCircle++;
  });
  const purchasersThisMonthKeys = new Set(monthOrders.map(ccOrderKey).filter(Boolean));

  /* RC-20 — Customer Intelligence: dormant, most-active, CLV, repeat rate.
     "Dormant" = a paying customer with no order in the last 60 days. */
  const lastOrderByKey = {};
  orders.forEach((o) => {
    const k = ccOrderKey(o); if (!k || !o.createdAt) return;
    const t = new Date(o.createdAt).getTime();
    if (!lastOrderByKey[k] || t > lastOrderByKey[k]) lastOrderByKey[k] = t;
  });
  const dormantCutoff = now.getTime() - 60 * 864e5;
  const dormantCustomers = Object.keys(lastOrderByKey).filter((k) => lastOrderByKey[k] < dormantCutoff).length;
  const purchasingCustomerCount = Object.keys(orderCountByKey).length;
  const clv = purchasingCustomerCount ? revLifetime / purchasingCustomerCount : 0;
  const repeatRate = purchasingCustomerCount ? Math.round((returningCustomers / purchasingCustomerCount) * 100) : 0;
  const mostActiveRows = ccTopEntries(orderCountByKey, 5);

  /* ABDAN Pulse — real, computed-only facts (no predictions, no AI) */
  const pulse = [];
  if (revYesterday > 0) {
    const pct = Math.round(((revToday - revYesterday) / revYesterday) * 100);
    if (pct !== 0) pulse.push(`Revenue ${pct > 0 ? "increased" : "decreased"} ${Math.abs(pct)}% compared to yesterday.`);
  } else if (revToday > 0) {
    pulse.push(`${fmtCurrency(revToday)} in revenue today — yesterday had none recorded.`);
  }
  if (todayOrders.length) {
    const byName = {};
    todayOrders.forEach((o) => (o.items || [{ name: o.product }]).forEach((it) => {
      const nm = it && it.name; if (!nm) return;
      byName[nm] = (byName[nm] || 0) + (ccOrderTotal(o) / ((o.items || [1]).length || 1));
    }));
    const top = Object.entries(byName).sort((a, b) => b[1] - a[1])[0];
    if (top) pulse.push(`"${top[0]}" generated the highest revenue today.`);
  }
  if (newCustomersWeek > 0) pulse.push(`${newCustomersWeek} new customer${newCustomersWeek !== 1 ? "s" : ""} joined this week.`);
  if (pendingCount > 0) pulse.push(`${pendingCount} order${pendingCount !== 1 ? "s are" : " is"} awaiting confirmation.`);
  if (conciergeOpen > 0) pulse.push(`${conciergeOpen} concierge conversation${conciergeOpen !== 1 ? "s" : ""} awaiting your reply.`);
  const revWeekPrior = orders.filter((o) => {
    if (!o.createdAt) return false; const t = new Date(o.createdAt);
    const wkStart = ccWeekStart(now); const priorStart = new Date(wkStart.getTime() - 7 * 864e5);
    return t >= priorStart && t < wkStart;
  }).reduce((s, o) => s + ccOrderTotal(o), 0);
  const weekPct = ccPct(revWeek, revWeekPrior);
  if (weekPct !== null && weekPct !== 0) pulse.push(`Revenue ${weekPct > 0 ? "increased" : "decreased"} ${Math.abs(weekPct)}% this week compared to last week.`);
  if (!pulse.length) pulse.push("All quiet — no notable changes since last check.");

  /* ── RC-20 Section 7 — Product Intelligence (additive view/share counters
     + real order-item tallies; no invented popularity numbers). ────────── */
  const viewsMap  = ccCounter("abdan-product-views");
  const sharesMap = ccCounter("abdan-product-shares");
  const purchaseTally = {}, revenueTally = {};
  orders.forEach((o) => (o.items || []).forEach((it) => {
    const key = it.id || it.name; if (!key) return;
    const qty = it.quantity || 1;
    purchaseTally[key] = (purchaseTally[key] || 0) + qty;
    const unitPrice = Number(it.price) || (ccOrderTotal(o) / ((o.items || [1]).length || 1));
    revenueTally[key] = (revenueTally[key] || 0) + unitPrice * qty;
  }));
  const conversionRows = Object.entries(viewsMap)
    .map(([id, views]) => [id, views > 0 ? Math.round(((purchaseTally[id] || 0) / views) * 1000) / 10 : 0])
    .filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const wardrobeTally = {};
  ccScanPrefixed("abdan-sp-ward-favs:").forEach((r) => (Array.isArray(r.data) ? r.data : []).forEach((id) => { wardrobeTally[id] = (wardrobeTally[id] || 0) + 1; }));
  const momentsProductTally = {};
  ccScanPrefixed("abdan-sp-my-moments:").forEach((r) => (Array.isArray(r.data) ? r.data : []).forEach((m) => (m.board?.products || []).forEach((p) => { momentsProductTally[p.name || p.id] = (momentsProductTally[p.name || p.id] || 0) + 1; })));
  const editsProductTally = {};
  ccScanPrefixed("abdan-sp-edits:").forEach((r) => (Array.isArray(r.data) ? r.data : []).forEach((e) => (e.items || []).forEach((it) => { if (it.kind === "product") editsProductTally[it.name] = (editsProductTally[it.name] || 0) + 1; })));

  /* ── Section 8 — Share the Love Intelligence (reuses existing referral
     ledger + per-member share counters — no separate referral system). ── */
  const referrals = load(STORAGE.referrals, []);
  const linksShared = ccScanPrefixed("abdan-sp-shares:").reduce((s, r) => s + Object.values(r.data || {}).reduce((a, b) => a + b, 0), 0);
  const peopleInspiredTotal = referrals.filter((r) => r.status === "rewarded").length;
  const ordersGeneratedSTL = referrals.filter((r) => r.status === "rewarded" || r.ordered).length;
  const pointsIssuedSTL = referrals.filter((r) => r.status === "rewarded").reduce((s, r) => s + (r.points || 0), 0);
  const sharedLabelTally = {};
  ccScanPrefixed("abdan-sp-shares:").forEach((r) => Object.entries(r.data || {}).forEach(([label, n]) => { sharedLabelTally[label] = (sharedLabelTally[label] || 0) + n; }));

  /* ── Section 9 — Savings & Benefits Intelligence ──────────────────────── */
  let savingsToday = 0, savingsMonth = 0, savingsLifetime = 0;
  const couponTally = {}, ruleTally = {};
  orders.forEach((o) => {
    const s = Number(o.savings) || 0;
    if (s > 0) {
      savingsLifetime += s;
      if (o.createdAt && ccIsSameDay(o.createdAt, now)) savingsToday += s;
      if (o.createdAt && new Date(o.createdAt) >= ccMonthStart(now)) savingsMonth += s;
    }
    if (o.couponCode) couponTally[o.couponCode] = (couponTally[o.couponCode] || 0) + 1;
    if (o.ruleName)   ruleTally[o.ruleName]     = (ruleTally[o.ruleName]     || 0) + 1;
  });

  /* ── Section 10 — Vendor Operations Center (honest real proxies only;
     no vendor identity/response-time/satisfaction data exists yet). ───── */
  const delayedOrders = orders.filter((o) => (o.status === "pending" || o.status === "confirmed") && o.createdAt && (now.getTime() - new Date(o.createdAt).getTime()) > 3 * 864e5).length;
  const nonCancelled = orders.length - cancelledCount;
  const fulfilmentRate = nonCancelled ? Math.round((deliveredCount / nonCancelled) * 100) : 0;
  const issueRatePct = orders.length ? Math.round((issueCases / orders.length) * 100) : 0;

  /* ── Section 12 — Executive Insights (thresholds only, no AI/predictions) */
  const nearInnerCircle = Object.entries(ptsByEmail).filter(([, p]) => p >= 100 && p < 150).length;
  const nearVip = Object.entries(ptsByEmail).filter(([, p]) => p >= 250 && p < 300).length;
  const couponsNearLimit = load(STORAGE.coupons, []).filter((c) => c.usageLimit && c.uses >= c.usageLimit * 0.8 && c.uses < c.usageLimit).length;
  const viewedNeverPurchased = Object.keys(viewsMap).filter((id) => !purchaseTally[id]).length;
  const opportunities = [];
  if (nearInnerCircle) opportunities.push(`${nearInnerCircle} customer${nearInnerCircle !== 1 ? "s are" : " is"} within reach of Inner Circle status.`);
  if (nearVip) opportunities.push(`${nearVip} customer${nearVip !== 1 ? "s are" : " is"} close to House of ABDAN tier.`);
  if (!opportunities.length) opportunities.push("No notable opportunities surfaced today.");
  const risks = [];
  if (dormantCustomers) risks.push(`${dormantCustomers} previously active customer${dormantCustomers !== 1 ? "s" : ""} ha${dormantCustomers !== 1 ? "ve" : "s"} not ordered in 60+ days.`);
  if (delayedOrders) risks.push(`${delayedOrders} order${delayedOrders !== 1 ? "s have" : " has"} been pending or confirmed for over 3 days.`);
  if (couponsNearLimit) risks.push(`${couponsNearLimit} coupon${couponsNearLimit !== 1 ? "s are" : " is"} nearing their usage limit.`);
  if (!risks.length) risks.push("No notable risks surfaced today.");

  const cc = (icon, label, value, cls = "") => `
    <div class="s-stat-card cc-stat ${cls}">
      <i data-lucide="${icon}" class="s-icon"></i>
      <p class="s-stat-card__val">${value}</p>
      <p class="s-stat-card__label">${label}</p>
    </div>`;

  const trendChip = (pct) => pct === null ? "" : `<span class="cc-trend ${pct >= 0 ? "cc-trend--up" : "cc-trend--down"}">${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}%</span>`;

  dom.content.innerHTML = `
    <div class="cc-wrap">
      <div class="cc-section cc-section--hero">
        <p class="cc-section__label">Executive Command Center</p>
        <div class="cc-grid">
          ${cc("indian-rupee", "Today's Revenue", fmtCurrency(revToday), "s-stat--gold")}
          ${cc("receipt", "Today's Orders", todayOrders.length, "s-stat--blue")}
          ${cc("users", "Today's Customers", todayCustomerKeys.size, "s-stat--purple")}
          ${cc("message-circle", "Today's Concierge Requests", conciergeToday, "s-stat--green")}
          ${cc("sparkle", "Today's Savings Given", fmtCurrency(savingsToday), "s-stat--gold")}
          ${cc("heart", "Active Circle Members", activeCircle, "s-stat--purple")}
          ${cc("clock", "Orders Awaiting Action", pendingCount + confirmedCount, "s-stat--amber")}
        </div>
      </div>

      <div class="cc-section">
        <p class="cc-section__label">ABDAN Pulse</p>
        <div class="cc-pulse-card">
          ${pulse.map((line) => `<p class="cc-pulse-line"><i data-lucide="sparkle" class="s-icon"></i>${esc(line)}</p>`).join("")}
        </div>
      </div>

      <div class="cc-section">
        <p class="cc-section__label">Revenue Intelligence</p>
        <div class="cc-grid cc-grid--6">
          <div class="s-stat-card cc-stat">${trendChip(ccPct(revToday, revYesterday))}<i data-lucide="indian-rupee" class="s-icon"></i><p class="s-stat-card__val">${fmtCurrency(revToday)}</p><p class="s-stat-card__label">Today</p></div>
          ${cc("indian-rupee", "Yesterday", fmtCurrency(revYesterday))}
          <div class="s-stat-card cc-stat">${trendChip(weekPct)}<i data-lucide="indian-rupee" class="s-icon"></i><p class="s-stat-card__val">${fmtCurrency(revWeek)}</p><p class="s-stat-card__label">This Week</p></div>
          ${cc("indian-rupee", "This Month", fmtCurrency(revMonth))}
          ${cc("indian-rupee", "This Year", fmtCurrency(revYear))}
          ${cc("gem", "Lifetime Revenue", fmtCurrency(revLifetime), "s-stat--gold")}
        </div>
      </div>

      <div class="cc-section">
        <div class="cc-section__head"><p class="cc-section__label">Order Operations Center</p>${qaction("receipt", "Manage Orders", "orders")}</div>
        <div class="cc-grid">
          ${cc("clock", "Pending Orders", pendingCount, "s-stat--amber")}
          ${cc("check", "Confirmed Orders", confirmedCount, "s-stat--blue")}
          ${cc("truck", "Dispatched Orders", shippedCount)}
          ${cc("check-circle", "Delivered Orders", deliveredCount, "s-stat--green")}
          ${cc("x-circle", "Cancelled Orders", cancelledCount, "s-stat--red")}
          ${cc("flag", "Issue Resolution Cases", issueCases)}
        </div>
      </div>

      <div class="cc-section">
        <div class="cc-section__head"><p class="cc-section__label">Customer Intelligence</p>${qaction("users", "Customer Management", "customers")}</div>
        <div class="cc-grid">
          ${cc("user-plus", "New Customers", newCustomersMonth)}
          ${cc("repeat", "Returning Customers", returningCustomers)}
          ${cc("crown", "VIP Customers", vipCircle, "s-stat--gold")}
          ${cc("gem", "Inner Circle Members", innerCircle, "s-stat--gold")}
          ${cc("moon", "Dormant Customers", dormantCustomers, "s-stat--amber")}
          ${cc("indian-rupee", "Customer Lifetime Value", fmtCurrency(Math.round(clv)))}
          ${cc("repeat", "Repeat Purchase Rate", `${repeatRate}%`)}
          ${cc("shopping-bag", "Purchased This Month", purchasersThisMonthKeys.size)}
        </div>
        <p class="cc-section__sub">Most Active Members</p>
        ${ccRankList(mostActiveRows, (n) => `${n} order${n !== 1 ? "s" : ""}`)}
      </div>

      <div class="cc-section">
        <div class="cc-section__head"><p class="cc-section__label">Concierge Intelligence</p>${qaction("message-circle", "Concierge Center", "concierge")}</div>
        <div class="cc-grid">
          ${cc("message-circle", "Open Requests", conciergeOpen, "s-stat--amber")}
          ${cc("check-circle", "Resolved Requests", conciergeResolved, "s-stat--green")}
          ${cc("timer", "Average Response Time", avgResponseLabel)}
          ${cc("percent", "Conversion Rate", conciergeEmails.length ? `${Math.round((ordersFromConcierge / conciergeEmails.length) * 100)}%` : "—")}
        </div>
        <p class="cc-section__sub">Most Requested Categories</p>
        ${ccRankList(ccTopEntries(categoryCounts, 6))}
      </div>

      <div class="cc-section">
        <p class="cc-section__label">Product Intelligence</p>
        <div class="s-analytics-grid">
          <div class="s-card"><h3 class="s-card__title">Most Viewed</h3>${ccRankList(ccTopEntries(viewsMap, 6))}</div>
          <div class="s-card"><h3 class="s-card__title">Most Shared</h3>${ccRankList(ccTopEntries(sharesMap, 6))}</div>
          <div class="s-card"><h3 class="s-card__title">Most Purchased</h3>${ccRankList(ccTopEntries(purchaseTally, 6))}</div>
          <div class="s-card"><h3 class="s-card__title">Highest Revenue</h3>${ccRankList(ccTopEntries(revenueTally, 6), fmtCurrency)}</div>
          <div class="s-card"><h3 class="s-card__title">Highest Conversion</h3>${conversionRows.length ? ccRankList(conversionRows, (v) => `${v}%`) : empty("Needs both view and purchase data.", "trending-up")}</div>
          <div class="s-card"><h3 class="s-card__title">Most Favourited (Owned)</h3>${ccRankList(ccTopEntries(wardrobeTally, 6))}</div>
          <div class="s-card"><h3 class="s-card__title">Most Added To Moments</h3>${ccRankList(ccTopEntries(momentsProductTally, 6))}</div>
          <div class="s-card"><h3 class="s-card__title">Most Added To Edits</h3>${ccRankList(ccTopEntries(editsProductTally, 6))}</div>
        </div>
      </div>

      <div class="cc-section">
        <div class="cc-section__head"><p class="cc-section__label">Share the Love Intelligence</p>${qaction("gift", "Share &amp; Earn", "shareearn")}</div>
        <div class="cc-grid">
          ${cc("share-2", "Links Shared", linksShared, "s-stat--blue")}
          ${cc("heart", "People Inspired", peopleInspiredTotal, "s-stat--purple")}
          ${cc("shopping-bag", "Orders Generated", ordersGeneratedSTL, "s-stat--green")}
          ${cc("award", "Circle Points Issued", pointsIssuedSTL, "s-stat--gold")}
        </div>
        <p class="cc-section__sub">Highest Performing Shared Collections</p>
        ${ccRankList(ccTopEntries(sharedLabelTally, 6))}
      </div>

      <div class="cc-section">
        <div class="cc-section__head"><p class="cc-section__label">Savings &amp; Benefits Intelligence</p>${qaction("ticket", "Coupons & Benefits", "coupons")}</div>
        <div class="cc-grid">
          ${cc("sparkle", "Today's Savings Given", fmtCurrency(savingsToday), "s-stat--gold")}
          ${cc("sparkle", "Monthly Savings Given", fmtCurrency(savingsMonth))}
          ${cc("gem", "Lifetime Savings Given", fmtCurrency(savingsLifetime), "s-stat--gold")}
        </div>
        <p class="cc-section__sub">Most Used Coupons</p>
        ${ccRankList(ccTopEntries(couponTally, 5))}
        <p class="cc-section__sub">Most Effective Promotions (Automated Rules)</p>
        ${ccRankList(ccTopEntries(ruleTally, 5))}
      </div>

      <div class="cc-section">
        <div class="cc-section__head"><p class="cc-section__label">Vendor Operations Center</p>${qaction("truck", "Vendor Management", "vendors")}</div>
        <div class="cc-grid">
          ${cc("clock", "Orders Awaiting Confirmation", pendingCount, "s-stat--amber")}
          ${cc("truck", "Orders Awaiting Dispatch", confirmedCount, "s-stat--blue")}
          ${cc("alert-triangle", "Delayed Orders (3+ days)", delayedOrders, "s-stat--red")}
          ${cc("check-circle", "Fulfilment Rate", `${fulfilmentRate}%`, "s-stat--green")}
          ${cc("flag", "Issue Rate", `${issueRatePct}%`)}
        </div>
        <p class="cc-note">Vendor identity, response time, and satisfaction scoring aren't tracked yet — these figures reflect order-fulfilment status only.</p>
      </div>

      <div class="cc-section">
        <p class="cc-section__label">Executive Insights</p>
        <div class="s-analytics-grid">
          <div class="s-card"><h3 class="s-card__title">Today's Opportunities</h3>${opportunities.map((l) => `<p class="cc-pulse-line"><i data-lucide="trending-up" class="s-icon"></i>${esc(l)}</p>`).join("")}</div>
          <div class="s-card"><h3 class="s-card__title">Today's Risks</h3>${risks.map((l) => `<p class="cc-pulse-line"><i data-lucide="alert-triangle" class="s-icon"></i>${esc(l)}</p>`).join("")}</div>
          <div class="s-card"><h3 class="s-card__title">Customers Requiring Attention</h3>${dormantCustomers ? `<p class="cc-pulse-line"><i data-lucide="moon" class="s-icon"></i>${dormantCustomers} dormant customer${dormantCustomers !== 1 ? "s" : ""} (60+ days quiet)</p>` : empty("No customers need attention today.", "smile")}</div>
          <div class="s-card"><h3 class="s-card__title">Products Requiring Attention</h3>${viewedNeverPurchased ? `<p class="cc-pulse-line"><i data-lucide="eye" class="s-icon"></i>${viewedNeverPurchased} viewed product${viewedNeverPurchased !== 1 ? "s" : ""} with no purchases yet</p>` : empty("No products need attention today.", "shopping-bag")}</div>
          <div class="s-card"><h3 class="s-card__title">Orders Requiring Attention</h3>${(issueCases + delayedOrders) ? `<p class="cc-pulse-line"><i data-lucide="flag" class="s-icon"></i>${issueCases} issue case${issueCases !== 1 ? "s" : ""} · ${delayedOrders} delayed order${delayedOrders !== 1 ? "s" : ""}</p>` : empty("No orders need attention today.", "check-circle")}</div>
          <div class="s-card"><h3 class="s-card__title">Vendor Issues</h3>${delayedOrders ? `<p class="cc-pulse-line"><i data-lucide="truck" class="s-icon"></i>${delayedOrders} order${delayedOrders !== 1 ? "s" : ""} awaiting fulfilment beyond 3 days</p>` : empty("No fulfilment issues today.", "truck")}</div>
        </div>
      </div>

      <div class="cc-section">
        <p class="cc-section__label">Quick Action Center</p>
        <div class="s-qaction-row">
          ${qaction("plus", "Add Product", "products")}
          ${qaction("receipt", "Manage Orders", "orders")}
          ${qaction("users", "Customer Management", "customers")}
          ${qaction("truck", "Vendor Management", "vendors")}
          ${qaction("message-circle", "Concierge Center", "concierge")}
          ${qaction("ticket", "Coupons & Benefits", "coupons")}
          ${qaction("bar-chart-2", "Reports", "analytics")}
          ${qaction("pen-tool", "Stories From Her World", "generator")}
          ${qaction("star", "Community Management", "reviews")}
        </div>
      </div>
    </div>`;
}

/* ── RC-20: Vendor Operations Center — real proxies only. No vendor
   identity, response-time, or satisfaction data exists in this system;
   inventing it would violate "no fake insights" — so this view surfaces
   the honest fulfilment-status proxies and says so plainly. */
function renderVendorsStub() {
  setTitle("Vendor Management");
  const orders = load(STORAGE.orders, []);
  const now = new Date();
  const pendingCount   = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;
  const issueCases     = orders.filter((o) => o.status === "cancelled" && (o.notes || "").trim()).length;
  const delayedOrders  = orders.filter((o) => (o.status === "pending" || o.status === "confirmed") && o.createdAt && (now.getTime() - new Date(o.createdAt).getTime()) > 3 * 864e5).length;
  const nonCancelled   = orders.length - cancelledCount;
  const fulfilmentRate = nonCancelled ? Math.round((deliveredCount / nonCancelled) * 100) : 0;
  const issueRatePct   = orders.length ? Math.round((issueCases / orders.length) * 100) : 0;
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--circle">
      <i data-lucide="truck" class="s-icon"></i><span>Vendor Operations Center</span>
    </div>
    <p class="s-muted" style="margin:-0.4rem 0 1rem;font-size:0.8rem">ABDAN currently fulfils as a single house, not a multi-vendor marketplace — these figures reflect fulfilment status, not vendor scoring.</p>
    <div class="s-stats-row">
      ${stat("clock", "Awaiting Confirmation", pendingCount, "s-stat--amber")}
      ${stat("truck", "Awaiting Dispatch", confirmedCount, "s-stat--blue")}
      ${stat("alert-triangle", "Delayed 3+ Days", delayedOrders, "s-stat--red")}
      ${stat("check-circle", "Fulfilment Rate", `${fulfilmentRate}%`, "s-stat--green")}
      ${stat("flag", "Issue Rate", `${issueRatePct}%`)}
    </div>
    <p class="s-muted" style="margin-top:1rem;font-size:0.78rem">Vendor identity, response-time, and satisfaction tracking will arrive once multi-vendor fulfilment is part of the business — reserved for that phase.</p>`;
}

/* ── Overview ───────────────────────────────────────────────── */
function renderOverview() {
  setTitle("Studio Overview");
  const products  = load(STORAGE.products, []);
  const orders    = load(STORAGE.orders, []);
  const customers = getCustomers();
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
    id: uid(), name: "", price: "", comparePrice: "", badge: "", category: "", sizes: [],
    image: "", image2: "", image3: "", description: "", curationLine: "",
    inStock: true, status: "active", tags: "", featured: false, updatedAt: new Date().toISOString(),
  };

  openPanel(isNew ? "Add Piece" : "Edit Piece", `
    <div class="s-form-grid">
      ${field("Product Name", "text", "pfName", p.name, "e.g. Amal Abaya in Ivory")}
      ${field("Current Price (₹)", "number", "pfPrice", p.price, "0")}
      ${field("Compare At Price (₹)", "number", "pfCompare", p.comparePrice, "optional")}
      <div class="s-field s-field--full s-savings-preview" id="pfSavingsPreview" aria-live="polite"></div>
      <label class="s-field">
        <span class="s-field__label">Badge</span>
        <select id="pfBadge" class="s-field__select">
          <option value="">No badge</option>
          ${ABDAN_BADGES.map((b) => `<option value="${b}" ${p.badge === b ? "selected" : ""}>${b}</option>`).join("")}
        </select>
      </label>
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
      badge:         val("pfBadge"),
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

  /* Live savings auto-calculation in the form (Premium Pricing System). */
  const previewEl = document.getElementById("pfSavingsPreview");
  const priceEl   = document.getElementById("pfPrice");
  const cmpEl     = document.getElementById("pfCompare");
  const renderSavingsPreview = () => {
    if (!previewEl) return;
    const s = abdanSavings(priceEl?.value, cmpEl?.value);
    if (!s) { previewEl.innerHTML = ""; previewEl.classList.remove("is-active"); return; }
    previewEl.classList.add("is-active");
    previewEl.innerHTML = `
      <span class="s-savings-preview__row"><span>Savings Amount</span><strong>${fmtCurrency(s.amount)}</strong></span>
      <span class="s-savings-preview__row"><span>Savings</span><strong>${s.pct}%</strong></span>
      <span class="s-savings-preview__note">${fmtCurrency(s.compare)} → ${fmtCurrency(s.current)} · You Save ${fmtCurrency(s.amount)}</span>`;
  };
  priceEl?.addEventListener("input", renderSavingsPreview);
  cmpEl?.addEventListener("input", renderSavingsPreview);
  renderSavingsPreview();
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
  const customers = getCustomers();
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
  const customers = getCustomers();
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

/* Luxury empty states — emotionally warm, never clinical */
const STUDIO_EMPTY = {
  "shopping-bag":     "A few pieces may quietly belong here.",
  "receipt":          "No orders have arrived yet — they will, quietly.",
  "layers":           "Collections take shape slowly. Begin whenever it feels right.",
  "search":           "Nothing matched — the right piece may be found with different words.",
  "inbox":            "Something thoughtful will arrive here in time.",
  "users":            "Her Circle grows one honest connection at a time.",
  "bell":             "Notices reach their moment. Nothing here yet.",
  "send":             "Messages will find their way here soon.",
  "type":             "Brand voice is shaped gradually. Begin with one word.",
  "share-2":          "Social sharing will be ready when the story is.",
  "image":            "The library is waiting for its first piece.",
  "settings":         "Settings are ready to be shaped to your preferences.",
  "shield":           "Trust and policy content will appear here.",
  "layout-dashboard": "The studio begins to breathe as the collection grows.",
  "tag":              "Offers unfold when the right moment arrives.",
  "star":             "Testimonials gather gently, one honest word at a time.",
  "megaphone":        "Every great launch begins with a quiet moment of intention.",
  "feather":          "Your first note begins the brand's private story.",
  "bar-chart-2":      "Intelligence deepens as the circle grows and orders accumulate.",
  "activity":         "Customer insights emerge with time and attention.",
  "lock":             "The permission system is ready and secure.",
  "gem":              "Brand identity is the heart of everything ABDAN.",
  "check-circle":     "Acceptance records appear when members join Her Circle.",
  "file-text":        "Legal documents will be published and managed here.",
};

function empty(message, icon = "inbox") {
  const luxuryMessage = STUDIO_EMPTY[icon] || message;
  return `
    <div class="s-empty">
      <i data-lucide="${icon}" class="s-icon s-empty__icon"></i>
      <p>${luxuryMessage}</p>
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

/* ── Sign out ─────────────────────────────────────────────────────────
   Clears session tokens immediately (so heartbeat can't refresh them),
   then fades the Studio out cinematically before navigating away.
   The 380ms opacity fade matches the --ivory background so the user
   returns to the storefront entry in a calm, unabrupt way.            */
function signout() {
  /* Clear tokens first — heartbeat interval can no longer validate */
  sessionStorage.removeItem("abdan-admin-auth");
  try { localStorage.removeItem("abdan-admin-token"); } catch { /* quota */ }

  /* Cinematic exit: fade Studio → navigate */
  document.body.style.cssText +=
    ";transition:opacity 380ms cubic-bezier(0.23,1,0.32,1);opacity:0;pointer-events:none";
  setTimeout(() => window.location.replace("/"), 420);
}

/* ── Auth heartbeat ─────────────────────────────────────────────────
   Runs every 30 minutes while Studio is open.
   Re-validates the localStorage token and refreshes its expiry so the
   admin never gets kicked out mid-session.  If the token is gone or
   expired (e.g. another tab signed out), signout() fires cleanly.   */
(function startAuthHeartbeat() {
  const LS_KEY  = "abdan-admin-token";
  const EIGHT_H = 8 * 60 * 60 * 1000;

  setInterval(() => {
    try {
      const t = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (!t || t.v !== "true" || t.exp <= Date.now()) {
        signout(); /* session expired or removed — leave gracefully */
        return;
      }
      /* Still valid — extend the window so active sessions stay alive */
      localStorage.setItem(LS_KEY, JSON.stringify({ v: "true", exp: Date.now() + EIGHT_H }));
      sessionStorage.setItem("abdan-admin-auth", "true");
    } catch {
      signout();
    }
  }, 30 * 60 * 1000); /* 30 minutes */
})();

/* ── Tab bar "More" ─────────────────────────────────────────── */
function openMoreMenu() {
  const pinned = ["overview", "products", "orders", "customers"];
  const groups = {};
  STUDIO_VIEWS.filter((v) => !pinned.includes(v.id)).forEach((v) => {
    if (!groups[v.group]) groups[v.group] = [];
    groups[v.group].push(v);
  });
  openPanel("All Sections", `
    ${Object.entries(groups).map(([group, views]) => `
      <div style="margin-bottom:0.5rem">
        <p class="s-nav-group__label" style="padding:0 0.25rem 0.35rem;display:block">${group}</p>
        <div class="s-list">
          ${views.map((v) => `
            <button class="s-list-item s-list-item--btn" data-nav="${v.id}">
              <i data-lucide="${v.icon}" class="s-icon"></i>
              <span>${v.label}</span>
              <i data-lucide="chevron-right" class="s-icon s-list-item__chevron"></i>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("")}
  `);
  dom.panelBody.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closePanel();
      navigate(btn.dataset.nav);
    });
  });
}

/* ════════════════════════════════════════════════════════════
   §44 — LUXURY BRAND OPERATING ECOSYSTEM
   New view renderers for 5 Master Zones
   ════════════════════════════════════════════════════════════ */

/* ── BRAND: Logo Management ─────────────────────────────────── */
function renderLogo() {
  setTitle("Logo Management");
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--brand">
      <i data-lucide="gem" class="s-icon"></i>
      <span>Brand Identity Assets</span>
    </div>
    <div class="s-logo-grid">
      <div class="s-logo-asset">
        <div class="s-logo-asset__preview s-logo-asset__preview--warm">
          <img src="./assets/abdan-icon.jpg" alt="ABDAN Icon" class="s-logo-asset__img s-logo-asset__img--round" />
        </div>
        <div class="s-logo-asset__info">
          <strong>Brand Icon</strong>
          <span>assets/abdan-icon.jpg</span>
          <p class="s-logo-asset__note">Used in navigation, favicon fallback, Studio sidebar. 36×36px circular display with border-radius: 50%.</p>
        </div>
      </div>
      <div class="s-logo-asset">
        <div class="s-logo-asset__preview s-logo-asset__preview--warm">
          <img src="./assets/logo/abdan-wordmark-full.jpeg" alt="ABDAN Wordmark" class="s-logo-asset__img s-logo-asset__img--wordmark" />
        </div>
        <div class="s-logo-asset__info">
          <strong>Official Wordmark (Full)</strong>
          <span>assets/logo/abdan-wordmark-full.jpeg</span>
          <p class="s-logo-asset__note">Primary brand identity. Used in navigation dock and Studio sidebar with mix-blend-mode: multiply on warm surfaces.</p>
        </div>
      </div>
      <div class="s-logo-asset">
        <div class="s-logo-asset__preview s-logo-asset__preview--warm">
          <img src="./assets/logo/abdan-icon-mark.jpeg" alt="ABDAN Icon Mark" class="s-logo-asset__img s-logo-asset__img--round" />
        </div>
        <div class="s-logo-asset__info">
          <strong>Icon Mark</strong>
          <span>assets/logo/abdan-icon-mark.jpeg</span>
          <p class="s-logo-asset__note">Compact emblem for small contexts — favicons, app icons, watermarks.</p>
        </div>
      </div>
      <div class="s-logo-asset">
        <div class="s-logo-asset__preview s-logo-asset__preview--dark">
          <img src="./assets/logo/abdan-seal-dark.jpeg" alt="ABDAN Seal Dark" class="s-logo-asset__img" style="max-height:70px;max-width:100%;object-fit:contain;" />
        </div>
        <div class="s-logo-asset__info">
          <strong>Seal (Dark variant)</strong>
          <span>assets/logo/abdan-seal-dark.jpeg</span>
          <p class="s-logo-asset__note">Full circular seal for dark surfaces, certificates, and special editorial use.</p>
        </div>
      </div>
      <div class="s-logo-asset">
        <div class="s-logo-asset__preview s-logo-asset__preview--warm">
          <img src="./assets/logo/abdan-seal-light.jpg" alt="ABDAN Seal Light" class="s-logo-asset__img" style="max-height:70px;max-width:100%;object-fit:contain;" />
        </div>
        <div class="s-logo-asset__info">
          <strong>Seal (Light variant)</strong>
          <span>assets/logo/abdan-seal-light.jpg</span>
          <p class="s-logo-asset__note">Full circular seal for light surfaces, print, and packaging.</p>
        </div>
      </div>
    </div>
    <div class="s-alert s-alert--info" style="margin-top:1.5rem">
      <i data-lucide="info" class="s-icon"></i>
      To update brand assets, replace the JPEG files in <code style="font-family:monospace;font-size:0.8em">assets/logo/</code> and redeploy to Cloudflare Pages. Maintain exact original filenames.
    </div>
    <div class="s-card" style="margin-top:1rem">
      <h3 class="s-card__title">Logo Usage Rules</h3>
      <div class="s-policy-list">
        <p>• Never recreate, redraw, vectorize, or simplify the ornament ring.</p>
        <p>• Do not replace the typography in the wordmark. The calligraphic letterforms are official brand property.</p>
        <p>• Always use <code style="font-family:monospace;font-size:0.85em">mix-blend-mode: multiply</code> on warm (light) backgrounds for the JPEG wordmark.</p>
        <p>• On dark backgrounds, use the gold text fallback or the seal-dark variant.</p>
        <p>• Minimum clear space: equal to the height of the 'A' letterform on all sides.</p>
        <p>• Do not crop, filter, rotate, or apply effects to any brand asset.</p>
      </div>
    </div>
  `;
}

/* ── BRAND: Typography Manager ───────────────────────────────── */
function renderTypography() {
  setTitle("Typography");
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--brand">
      <i data-lucide="type" class="s-icon"></i>
      <span>Brand Typography System</span>
    </div>
    <div class="s-type-row">
      <div class="s-type-sample">
        <span class="s-type-name">Display / Headings</span>
        <p class="s-type-demo s-type-demo--display">Your Devotion Deserves To Be Seen</p>
        <span class="s-type-meta">Cormorant Garamond · Weight 600 · Letter-spacing −0.03em · Line-height 1.04</span>
      </div>
      <div class="s-type-sample">
        <span class="s-type-name">Body / UI</span>
        <p class="s-type-demo s-type-demo--body">For the woman who moves through her days with devotion, grace, and quiet intention. Every piece carries the weight of thoughtfulness.</p>
        <span class="s-type-meta">Open Sans · Weight 400 · 1rem · Line-height 1.9</span>
      </div>
      <div class="s-type-sample">
        <span class="s-type-name">Micro / Labels</span>
        <p class="s-type-demo s-type-demo--micro">EVERYDAY GRACE · CURATED PIECES · HER CIRCLE</p>
        <span class="s-type-meta">Open Sans · Weight 700 · 0.7rem · Letter-spacing 0.1em · Uppercase</span>
      </div>
      <div class="s-type-sample">
        <span class="s-type-name">Editorial / Quotes</span>
        <p class="s-type-demo s-type-demo--editorial">"Quietly chosen. Deeply felt."</p>
        <span class="s-type-meta">Cormorant Garamond Italic · Weight 400 · Line-height 1.16</span>
      </div>
    </div>
    <div class="s-card" style="margin-top:1.25rem">
      <h3 class="s-card__title">Type Scale</h3>
      <div class="s-type-scale-grid">
        <div class="s-type-scale-item"><span class="s-type-scale-label">Hero Display</span><span class="s-type-scale-value">clamp(2.4rem, 7.5vw, 6rem)</span></div>
        <div class="s-type-scale-item"><span class="s-type-scale-label">Section Title</span><span class="s-type-scale-value">clamp(1.6rem, 3vw, 2.4rem)</span></div>
        <div class="s-type-scale-item"><span class="s-type-scale-label">Card Title</span><span class="s-type-scale-value">1.25rem</span></div>
        <div class="s-type-scale-item"><span class="s-type-scale-label">Body Text</span><span class="s-type-scale-value">1rem · 1.9 leading</span></div>
        <div class="s-type-scale-item"><span class="s-type-scale-label">Small / UI</span><span class="s-type-scale-value">0.875rem</span></div>
        <div class="s-type-scale-item"><span class="s-type-scale-label">Micro / Label</span><span class="s-type-scale-value">0.7rem · caps · 0.1em tracking</span></div>
      </div>
    </div>
    <div class="s-alert s-alert--info" style="margin-top:1rem">
      <i data-lucide="info" class="s-icon"></i>
      Typography tokens live in <code style="font-family:monospace;font-size:0.8em">css/style.css §43</code>. Adjust <code style="font-family:monospace;font-size:0.8em">--type-display</code> and <code style="font-family:monospace;font-size:0.8em">--type-body</code> in the <code>:root</code> block.
    </div>
  `;
}

/* ── BRAND: Color System ─────────────────────────────────────── */
function renderColors() {
  setTitle("Color System");
  const palette = [
    { name: "Ivory",         value: "#FFFCF6", role: "Brand background · site canvas",                 text: "#1a1a1a" },
    { name: "Deep Emerald",  value: "#023d3a", role: "Primary brand · CTAs · nav accents",             text: "#ffffff" },
    { name: "Warm Gold",     value: "#c5a13b", role: "Accent · highlights · active states",            text: "#ffffff" },
    { name: "Charcoal",      value: "#1C1F1C", role: "Primary text · dark surfaces",                   text: "#ffffff" },
    { name: "Warm Stone",    value: "#596058", role: "Secondary text · subdued UI",                    text: "#ffffff" },
    { name: "Mist",          value: "#98a098", role: "Tertiary · disabled · placeholders",             text: "#1a1a1a" },
    { name: "Evening Dark",  value: "#09100f", role: "Dark mode background",                            text: "#F0E9D6" },
    { name: "Surface Dark",  value: "#0c1511", role: "Dark mode mid-surface",                          text: "#F0E9D6" },
    { name: "Text Warm",     value: "#F0E9D6", role: "Dark mode primary text",                         text: "#1a1a1a" },
    { name: "Success",       value: "#3d8c6e", role: "Confirmations · positive states",                text: "#ffffff" },
    { name: "Error",         value: "#b85a55", role: "Errors · destructive actions",                   text: "#ffffff" },
    { name: "Amber",         value: "#b87d30", role: "Caution · pending states",                       text: "#ffffff" },
  ];
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--brand">
      <i data-lucide="droplet" class="s-icon"></i>
      <span>Brand Color Palette</span>
    </div>
    <div class="s-color-grid">
      ${palette.map((c) => `
        <div class="s-color-swatch">
          <div class="s-color-swatch__block" style="background:${c.value};color:${c.text}">
            <span class="s-color-swatch__hex">${c.value}</span>
          </div>
          <div class="s-color-swatch__info">
            <strong>${c.name}</strong>
            <span>${c.role}</span>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="s-alert s-alert--info" style="margin-top:1.5rem">
      <i data-lucide="info" class="s-icon"></i>
      Colors are defined as CSS custom properties. Edit the <code style="font-family:monospace;font-size:0.8em">:root</code> block in <code style="font-family:monospace;font-size:0.8em">css/style.css</code> to adjust any color token globally.
    </div>
  `;
}

/* ── BRAND: Atmosphere Presets ───────────────────────────────── */
function renderAtmosphere() {
  setTitle("Atmosphere");
  const saved = localStorage.getItem("abdan-studio-theme") || "light";
  const presets = [
    {
      id: "light", name: "Ivory Morning",
      desc: "The default ABDAN canvas. Warm ivory background with deep emerald and gold accents. A boutique in daylight.",
      bg: "#FFFCF6",
      dots: ["#023d3a", "#c5a13b", "#1C1F1C"],
    },
    {
      id: "dark", name: "Evening Calm",
      desc: "Dark mode's signature palette. Deep emerald-tinted darkness, gold accents, warm linen text. A boutique at dusk.",
      bg: "#09100f",
      dots: ["#c5a13b", "#F0E9D6", "#4da89e"],
    },
  ];
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--brand">
      <i data-lucide="sparkles" class="s-icon"></i>
      <span>Visual Atmosphere</span>
    </div>
    <p class="s-muted" style="margin-bottom:1.5rem">Choose the ambient tone for the ABDAN experience. Affects both the Studio and the storefront's dark mode.</p>
    <div class="s-atmosphere-grid">
      ${presets.map((p) => `
        <div class="s-atmosphere-card ${saved === p.id ? "s-atmosphere-card--active" : ""}">
          <div class="s-atmosphere-card__swatch" style="background:${p.bg}">
            <div class="s-atmosphere-card__dots">
              ${p.dots.map((d) => `<span style="background:${d}"></span>`).join("")}
            </div>
          </div>
          <div class="s-atmosphere-card__body">
            <strong>${p.name}</strong>
            <p>${p.desc}</p>
            ${saved === p.id
              ? `<span class="s-badge s-badge--gold">✦ Active</span>`
              : `<button class="s-btn s-btn--secondary s-btn--sm" data-apply-atm="${p.id}">Apply</button>`
            }
          </div>
        </div>
      `).join("")}
    </div>
  `;
  dom.content.querySelectorAll("[data-apply-atm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.applyAtm;
      document.documentElement.dataset.theme = mode;
      localStorage.setItem("abdan-studio-theme", mode);
      updateThemeBtn(mode);
      toast(mode === "dark" ? "Evening Calm applied 🌙" : "Ivory Morning applied ✨");
      renderAtmosphere();
    });
  });
}

/* ── EXPERIENCE: T&C Manager ─────────────────────────────────── */
function renderTerms() {
  setTitle("T&C Manager");
  const saved = load(STORAGE.terms, {
    termsOfService: "Welcome to ABDAN.\n\nBy placing an order with us, you agree to the following terms:\n\n1. All purchases are subject to availability.\n2. Prices are listed in Indian Rupees (INR) inclusive of applicable taxes.\n3. ABDAN reserves the right to cancel orders in cases of pricing errors or out-of-stock items.\n4. Custom or made-to-order pieces are non-refundable.\n5. Please allow 7–14 business days for delivery unless otherwise stated.",
    privacyPolicy:  "Your privacy matters to us.\n\nABDAN collects only the information you choose to share:\n\n1. Name and contact details for order fulfilment.\n2. Purchase history to personalise your experience.\n3. We do not sell, rent, or share your personal information with third parties.\n4. Your data is stored securely and you may request deletion at any time by contacting us on WhatsApp.\n5. ABDAN does not use cookies or third-party tracking technologies.",
    returnPolicy:   "Returns & Exchanges\n\nWe want you to love every piece.\n\n1. Returns accepted within 7 days of delivery for unworn, tagged items.\n2. Exchange requests are processed within 5 business days.\n3. Sale items are final sale.\n4. To initiate a return, please WhatsApp us with your order reference and reason.\n5. Shipping costs for returns are the customer's responsibility unless the item is defective.",
    lastUpdated: "",
  });
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--experience">
      <i data-lucide="file-text" class="s-icon"></i>
      <span>Legal Documents</span>
    </div>
    <div class="s-card s-form-card">
      <h3 class="s-card__title">Terms of Service</h3>
      ${textareaFull("", "tcTerms", saved.termsOfService, 10)}
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Privacy Policy</h3>
      ${textareaFull("", "tcPrivacy", saved.privacyPolicy, 10)}
    </div>
    <div class="s-card s-form-card" style="margin-top:1rem">
      <h3 class="s-card__title">Returns & Exchanges</h3>
      ${textareaFull("", "tcReturns", saved.returnPolicy, 8)}
    </div>
    <div class="s-panel-foot-inline" style="gap:1rem;display:flex;align-items:center;margin-top:1rem">
      <span class="s-muted" style="margin-right:auto;font-size:0.775rem">${saved.lastUpdated ? `Last published ${fmtDate(saved.lastUpdated)}` : "Not yet published"}</span>
      <button class="s-btn s-btn--primary" id="sTCSave">
        <i data-lucide="save" class="s-icon"></i> Publish Policies
      </button>
    </div>
  `;
  document.getElementById("sTCSave")?.addEventListener("click", () => {
    save(STORAGE.terms, {
      termsOfService: document.getElementById("tcTerms")?.value || "",
      privacyPolicy:  document.getElementById("tcPrivacy")?.value || "",
      returnPolicy:   document.getElementById("tcReturns")?.value || "",
      lastUpdated:    new Date().toISOString(),
    });
    lxSaveGlow("sTCSave", "Policies published ✨");
  });
}

/* ── EXPERIENCE: Legal Acceptance Dashboard ──────────────────── */
function renderLegal() {
  setTitle("Legal Acceptance");
  const customers = getCustomers();
  const accepted  = customers.filter((c) => c.acceptedTerms);
  const pending   = customers.filter((c) => !c.acceptedTerms);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--experience">
      <i data-lucide="check-circle" class="s-icon"></i>
      <span>Trust & Acceptance Dashboard</span>
    </div>
    <div class="s-stats-row" style="margin-bottom:1.5rem">
      ${stat("users",         "Total Members",  customers.length)}
      ${stat("check-circle",  "Accepted T&C",   accepted.length,  "s-stat--green")}
      ${stat("clock",         "Pending",         pending.length,   "s-stat--gold")}
    </div>
    <div class="s-card">
      <h3 class="s-card__title">Acceptance Log</h3>
      ${customers.length ? `
        <div class="s-list" style="margin-top:0.75rem">
          ${customers.map((c) => `
            <div class="s-list-item">
              <div class="s-list-item__avatar">${(c.name || "?")[0].toUpperCase()}</div>
              <div class="s-list-item__main">
                <strong>${esc(c.name || "Anonymous")}</strong>
                <span class="s-list-item__sub">${esc(c.email || "—")}</span>
              </div>
              <div class="s-list-item__actions">
                ${c.acceptedTerms
                  ? `<span class="s-badge s-badge--green">Accepted</span>`
                  : `<span class="s-badge s-badge--amber">Pending</span>`}
              </div>
            </div>
          `).join("")}
        </div>
      ` : empty("No members yet. Acceptance records appear when customers join Her Circle.", "check-circle")}
    </div>
    <div class="s-alert s-alert--info" style="margin-top:1rem">
      <i data-lucide="info" class="s-icon"></i>
      T&C acceptance is recorded when customers create a profile in Your Space. Manage document content under T&C Manager.
    </div>
  `;
}

/* ── COMMERCE: Offer Studio ──────────────────────────────────── */
function renderOffers() {
  setTitle("Offer Studio", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddOffer">
      <i data-lucide="plus" class="s-icon"></i> New Offer
    </button>
  `);
  const offers = load(STORAGE.offers, []);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--commerce">
      <i data-lucide="tag" class="s-icon"></i>
      <span>Promotional Offers &amp; Discounts</span>
    </div>
    <div class="s-list" id="sOfferList">
      ${offers.length ? offers.map(offerRow).join("") : empty("No active offers. Create your first promotional offer.", "tag")}
    </div>
  `;

  function offerRow(o) {
    const typeLabel = { percent: `${o.value}% off`, flat: `₹${o.value} off`, freeship: "Free Shipping", bogo: "Buy 1 Get 1" }[o.type] || o.type;
    return `
      <div class="s-list-item">
        <div class="s-offer-badge"><span>${esc(o.code)}</span></div>
        <div class="s-list-item__main">
          <strong>${esc(o.label || o.code)}</strong>
          <span class="s-list-item__sub">${typeLabel} · Expires ${o.expiry ? fmtDate(o.expiry) : "Never"}</span>
        </div>
        <div class="s-list-item__actions">
          <span class="s-badge ${o.active ? "s-badge--green" : ""}">${o.active ? "Active" : "Inactive"}</span>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-offer="${o.id}"><i data-lucide="pencil" class="s-icon"></i></button>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-offer="${o.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
        </div>
      </div>`;
  }

  document.getElementById("sAddOffer")?.addEventListener("click", () => openOfferPanel());
  dom.content.querySelectorAll("[data-edit-offer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const o = load(STORAGE.offers, []).find((x) => x.id === btn.dataset.editOffer);
      if (o) openOfferPanel(o);
    });
  });
  dom.content.querySelectorAll("[data-del-offer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this offer?")) return;
      save(STORAGE.offers, load(STORAGE.offers, []).filter((o) => o.id !== btn.dataset.delOffer));
      toast("Offer removed");
      renderOffers();
    });
  });

  function openOfferPanel(offer = null) {
    const isNew = !offer;
    const o = offer || { id: uid(), code: "", label: "", type: "percent", value: "", minOrder: "", expiry: "", active: true };
    openPanel(isNew ? "New Offer" : "Edit Offer", `
      <div class="s-form-grid">
        ${field("Offer Code", "text", "ofCode", o.code, "e.g. EID25")}
        ${field("Label", "text", "ofLabel", o.label || "", "e.g. Eid Special")}
        <label class="s-field">
          <span class="s-field__label">Discount Type</span>
          <select id="ofType" class="s-field__select">
            <option value="percent"  ${o.type==="percent" ?"selected":""}>Percentage Off</option>
            <option value="flat"     ${o.type==="flat"    ?"selected":""}>Flat Amount Off</option>
            <option value="freeship" ${o.type==="freeship"?"selected":""}>Free Shipping</option>
            <option value="bogo"     ${o.type==="bogo"    ?"selected":""}>Buy 1 Get 1</option>
          </select>
        </label>
        ${field("Value (% or ₹)", "number", "ofValue", o.value || "", "e.g. 15")}
        ${field("Min Order (₹)",  "number", "ofMin",   o.minOrder || "", "e.g. 999")}
        ${field("Expiry Date",    "date",   "ofExpiry", o.expiry || "", "")}
        <div class="s-field s-field--full s-toggle-row">
          <span class="s-field__label">Active</span>
          <label class="s-toggle">
            <input type="checkbox" id="ofActive" ${o.active ? "checked" : ""} />
            <span class="s-toggle__track"></span>
          </label>
        </div>
      </div>
    `, () => {
      const code = val("ofCode").toUpperCase();
      if (!code) { toast("Offer code is required", "error"); return; }
      const updated = { ...o, code, label: val("ofLabel"), type: val("ofType"), value: val("ofValue"), minOrder: val("ofMin"), expiry: val("ofExpiry"), active: !!document.getElementById("ofActive")?.checked };
      const list = load(STORAGE.offers, []);
      const idx  = list.findIndex((x) => x.id === o.id);
      if (idx >= 0) list[idx] = updated; else list.unshift(updated);
      save(STORAGE.offers, list);
      closePanel();
      toast(isNew ? "Offer created 💛" : "Offer updated");
      renderOffers();
    });
  }
}

/* ── COMMERCE: Discount Management (Coupon Engine) — Part 6 ────── */
const COUPON_TIERS = ["All Members", "Inner Circle", "Patron", "Founding Circle"];
function renderCoupons() {
  setTitle("Discount Management", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddCoupon">
      <i data-lucide="plus" class="s-icon"></i> New Coupon
    </button>
  `);
  const coupons = load(STORAGE.coupons, []);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--commerce">
      <i data-lucide="ticket" class="s-icon"></i>
      <span>Coupon Engine</span>
    </div>
    <div class="s-list" id="sCouponList">
      ${coupons.length ? coupons.map(couponRow).join("") : empty("No coupons yet. Create member codes like INNERCIRCLE or FESTIVE2026.", "ticket")}
    </div>
  `;

  function couponRow(c) {
    const window = [c.startDate ? fmtDate(c.startDate) : "—", c.endDate ? fmtDate(c.endDate) : "No end"].join(" → ");
    const restr = [
      c.collection && c.collection !== "All" ? c.collection : null,
      c.product ? `Product: ${c.product}` : null,
      c.tier && c.tier !== "All Members" ? c.tier : null,
    ].filter(Boolean).join(" · ") || "No restrictions";
    return `
      <div class="s-list-item">
        <div class="s-offer-badge"><span>${esc(c.code || "—")}</span></div>
        <div class="s-list-item__main">
          <strong>${esc(c.name || c.code)}</strong>
          <span class="s-list-item__sub">${c.discountValue ? (c.discountType === "flat" ? `₹${c.discountValue} off` : `${c.discountValue}% off`) : "No benefit set"} · ${window} · ${restr}</span>
          <span class="s-list-item__sub">Usage limit: ${c.usageLimit || "∞"} · Per customer: ${c.customerLimit || "∞"} · Used: ${c.uses || 0}</span>
        </div>
        <div class="s-list-item__actions">
          <span class="s-badge ${c.active ? "s-badge--green" : ""}">${c.active ? "Active" : "Inactive"}</span>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-coupon="${c.id}"><i data-lucide="pencil" class="s-icon"></i></button>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-coupon="${c.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
        </div>
      </div>`;
  }

  document.getElementById("sAddCoupon")?.addEventListener("click", () => openCouponPanel());
  dom.content.querySelectorAll("[data-edit-coupon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = load(STORAGE.coupons, []).find((x) => x.id === btn.dataset.editCoupon);
      if (c) openCouponPanel(c);
    });
  });
  dom.content.querySelectorAll("[data-del-coupon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this coupon?")) return;
      save(STORAGE.coupons, load(STORAGE.coupons, []).filter((c) => c.id !== btn.dataset.delCoupon));
      toast("Coupon removed");
      renderCoupons();
    });
  });

  function openCouponPanel(coupon = null) {
    const isNew = !coupon;
    const c = coupon || { id: uid(), name: "", code: "", discountType: "percent", discountValue: "", startDate: "", endDate: "", usageLimit: "", customerLimit: "", collection: "All", product: "", tier: "All Members", active: true };
    openPanel(isNew ? "New Coupon" : "Edit Coupon", `
      <div class="s-form-grid">
        ${field("Coupon Name", "text", "cpName", c.name, "e.g. Inner Circle Access")}
        ${field("Coupon Code", "text", "cpCode", c.code, "e.g. INNERCIRCLE")}
        <label class="s-field">
          <span class="s-field__label">Benefit Type</span>
          <select id="cpType" class="s-field__select">
            <option value="percent" ${c.discountType === "percent" ? "selected" : ""}>Percentage</option>
            <option value="flat" ${c.discountType === "flat" ? "selected" : ""}>Flat Amount (₹)</option>
          </select>
        </label>
        ${field("Benefit Value (% or ₹)", "number", "cpValue", c.discountValue || "", "e.g. 10")}
        ${field("Start Date", "date", "cpStart", c.startDate || "", "")}
        ${field("End Date", "date", "cpEnd", c.endDate || "", "")}
        ${field("Usage Limit (total)", "number", "cpUsage", c.usageLimit || "", "optional")}
        ${field("Customer Limit (per member)", "number", "cpCustomer", c.customerLimit || "", "optional")}
        <label class="s-field">
          <span class="s-field__label">Collection Restriction</span>
          <select id="cpCollection" class="s-field__select">
            <option value="All" ${c.collection === "All" ? "selected" : ""}>All collections</option>
            ${CATEGORIES.map((cat) => `<option value="${cat}" ${c.collection === cat ? "selected" : ""}>${cat}</option>`).join("")}
          </select>
        </label>
        ${field("Product Restriction", "text", "cpProduct", c.product || "", "optional — product id or name")}
        <label class="s-field">
          <span class="s-field__label">Member Tier Restriction</span>
          <select id="cpTier" class="s-field__select">
            ${COUPON_TIERS.map((t) => `<option value="${t}" ${c.tier === t ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </label>
        <div class="s-field s-field--full s-toggle-row">
          <span class="s-field__label">Active</span>
          <label class="s-toggle">
            <input type="checkbox" id="cpActive" ${c.active ? "checked" : ""} />
            <span class="s-toggle__track"></span>
          </label>
        </div>
      </div>
    `, () => {
      const code = val("cpCode").toUpperCase().replace(/\s+/g, "");
      if (!code) { toast("Coupon code is required", "error"); return; }
      const start = val("cpStart"), end = val("cpEnd");
      if (start && end && new Date(end) < new Date(start)) { toast("End date must be after start date", "error"); return; }
      const updated = {
        ...c, name: val("cpName") || code, code,
        discountType: val("cpType"), discountValue: val("cpValue"),
        startDate: start, endDate: end,
        usageLimit: val("cpUsage"), customerLimit: val("cpCustomer"),
        collection: val("cpCollection"), product: val("cpProduct").trim(),
        tier: val("cpTier"), active: !!document.getElementById("cpActive")?.checked,
        updatedAt: new Date().toISOString(),
      };
      const list = load(STORAGE.coupons, []);
      if (list.some((x) => x.code === code && x.id !== c.id)) { toast("That code already exists", "error"); return; }
      const idx = list.findIndex((x) => x.id === c.id);
      if (idx >= 0) list[idx] = updated; else list.unshift(updated);
      save(STORAGE.coupons, list);
      closePanel();
      toast(isNew ? "Coupon created 💛" : "Coupon updated");
      renderCoupons();
    });
  }
}

/* ── COMMERCE: Automated Discount Rules — Part 7 ──────────────── */
const RULE_TRIGGERS = ["Buy 2 Items", "Buy 3 Items", "Festival Collection", "Inner Circle Access", "First Order", "Cart Over ₹5,000"];
function renderRules() {
  setTitle("Automated Rules", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddRule">
      <i data-lucide="plus" class="s-icon"></i> New Rule
    </button>
  `);
  const rules = load(STORAGE.rules, []);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--commerce">
      <i data-lucide="git-branch" class="s-icon"></i>
      <span>Automated Discount Rules</span>
    </div>
    <div class="s-list" id="sRuleList">
      ${rules.length ? rules.map(ruleRow).join("") : empty("No rules yet. e.g. Buy 2 Items → 5% Benefit, Inner Circle Access → Member Pricing.", "git-branch")}
    </div>
  `;

  function ruleRow(r) {
    return `
      <div class="s-list-item">
        <div class="s-list-item__main">
          <strong>${esc(r.name || "Rule")}</strong>
          <span class="s-list-item__sub"><b>${esc(r.trigger || "—")}</b> → ${esc(r.benefit || "—")}</span>
        </div>
        <div class="s-list-item__actions">
          <span class="s-badge ${r.active ? "s-badge--green" : ""}">${r.active ? "Active" : "Inactive"}</span>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-rule="${r.id}"><i data-lucide="pencil" class="s-icon"></i></button>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-rule="${r.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
        </div>
      </div>`;
  }

  document.getElementById("sAddRule")?.addEventListener("click", () => openRulePanel());
  dom.content.querySelectorAll("[data-edit-rule]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = load(STORAGE.rules, []).find((x) => x.id === btn.dataset.editRule);
      if (r) openRulePanel(r);
    });
  });
  dom.content.querySelectorAll("[data-del-rule]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this rule?")) return;
      save(STORAGE.rules, load(STORAGE.rules, []).filter((r) => r.id !== btn.dataset.delRule));
      toast("Rule removed");
      renderRules();
    });
  });

  function openRulePanel(rule = null) {
    const isNew = !rule;
    const r = rule || { id: uid(), name: "", trigger: "Buy 2 Items", benefit: "", active: true };
    openPanel(isNew ? "New Rule" : "Edit Rule", `
      <div class="s-form-grid">
        ${field("Rule Name", "text", "rlName", r.name, "e.g. Two-Piece Benefit")}
        <label class="s-field">
          <span class="s-field__label">Trigger</span>
          <select id="rlTrigger" class="s-field__select">
            ${RULE_TRIGGERS.map((t) => `<option value="${t}" ${r.trigger === t ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </label>
        ${field("Benefit", "text", "rlBenefit", r.benefit || "", "e.g. 5% Benefit or Member Pricing")}
        <div class="s-field s-field--full s-toggle-row">
          <span class="s-field__label">Active</span>
          <label class="s-toggle">
            <input type="checkbox" id="rlActive" ${r.active ? "checked" : ""} />
            <span class="s-toggle__track"></span>
          </label>
        </div>
      </div>
    `, () => {
      const name = val("rlName");
      if (!name) { toast("Rule name is required", "error"); return; }
      const updated = { ...r, name, trigger: val("rlTrigger"), benefit: val("rlBenefit"), active: !!document.getElementById("rlActive")?.checked, updatedAt: new Date().toISOString() };
      const list = load(STORAGE.rules, []);
      const idx = list.findIndex((x) => x.id === r.id);
      if (idx >= 0) list[idx] = updated; else list.unshift(updated);
      save(STORAGE.rules, list);
      closePanel();
      toast(isNew ? "Rule created 💛" : "Rule updated");
      renderRules();
    });
  }
}

/* ── HER CIRCLE: Share & Earn Management (referrals → Circle Points) ── */
function getShareEarnSettingsAdmin() {
  const s = load(STORAGE.shareEarn, {}) || {};
  return Object.assign({ enabled: true, linksActive: true, base: 100, tier5000: 250, tier10000: 500, bonusMultiplier: 1, seasonalMultiplier: 1, validityDays: 60, maxPerMember: 50, campaignName: "" }, s);
}
function renderShareEarnAdmin() {
  setTitle("Share & Earn");
  const s = getShareEarnSettingsAdmin();
  const referrals = load(STORAGE.referrals, []) || [];
  const invited      = referrals.length;
  const peopleInspired = referrals.filter((r) => r.status === "rewarded" || r.ordered).length;
  const ordersGenerated = referrals.filter((r) => r.rewardedOrderRef || r.ordered).length;
  const pointsGiven  = referrals.filter((r) => r.status === "rewarded").reduce((a, r) => a + (Number(r.points) || 0), 0);
  const conversion   = invited ? Math.round((peopleInspired / invited) * 100) : 0;

  /* Aggregate shares across all members (Top Shared / Shares Generated). */
  let sharesGenerated = 0; const shareAgg = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf("abdan-sp-shares:") === 0) {
        const m = JSON.parse(localStorage.getItem(k) || "{}") || {};
        Object.entries(m).forEach(([cat, n]) => { sharesGenerated += Number(n) || 0; shareAgg[cat] = (shareAgg[cat] || 0) + (Number(n) || 0); });
      }
    }
  } catch {}
  const topShared = Object.entries(shareAgg).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const rows = referrals.length ? referrals.slice(0, 50).map((r) => {
    const cls = { invited: "s-badge--amber", joined: "s-badge--blue", ordered: "s-badge--emerald", rewarded: "s-badge--green" }[r.status] || "";
    return `<div class="s-list-item">
      <div class="s-list-item__main">
        <strong>${esc(r.referredEmail || "Invited friend")}</strong>
        <span class="s-list-item__sub">via ${esc(r.code || "—")} · ${r.createdAt ? fmtDate(r.createdAt) : ""}${r.points ? ` · +${r.points} pts` : ""}</span>
      </div>
      <span class="s-badge ${cls}">${capitalise(r.status || "invited")}</span>
    </div>`;
  }).join("") : empty("No referrals yet. Members invite friends from Your Space → Share the Love.", "gift");

  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--circle">
      <i data-lucide="gift" class="s-icon"></i>
      <span>Share &amp; Earn — Circle Points advocacy ${s.enabled ? "" : "· <em style='color:#c5742f'>PAUSED</em>"}</span>
    </div>
    <div class="s-stats-row">
      ${stat("share-2",     "Shares Generated",     sharesGenerated, "s-stat--blue")}
      ${stat("users",       "People Inspired",      peopleInspired,  "s-stat--purple")}
      ${stat("receipt",     "Orders Generated",     ordersGenerated, "s-stat--green")}
      ${stat("award",       "Circle Points Awarded",pointsGiven,     "s-stat--gold")}
    </div>
    <div class="s-stats-row">
      ${stat("users",       "Friends Invited",      invited,          "s-stat--blue")}
      ${stat("trending-up", "Conversion Rate",      conversion + "%", "s-stat--green")}
      ${stat("zap",         "Seasonal Multiplier",  (s.seasonalMultiplier || 1) + "×", "s-stat--gold")}
    </div>
    <div class="s-card s-form-card">
      <h3 class="s-card__title">Points Rules</h3>
      <div class="s-form-grid">
        ${field("Successful Purchase (pts)", "number", "seBase", s.base, "100")}
        ${field("Order Above ₹5,000 (pts)", "number", "seT5", s.tier5000, "250")}
        ${field("Order Above ₹10,000 (pts)", "number", "seT10", s.tier10000, "500")}
        ${field("Bonus Campaign Multiplier", "number", "seBonus", s.bonusMultiplier, "1")}
        ${field("Seasonal Multiplier", "number", "seSeason", s.seasonalMultiplier, "1")}
        ${field("Referral Validity (days)", "number", "seValid", s.validityDays, "60")}
        ${field("Referral Limit (per member)", "number", "seMax", s.maxPerMember, "50")}
        ${field("Bonus Campaign Name", "text", "seCampaign", s.campaignName, "e.g. Festive Circle")}
      </div>
      <div class="s-field s-field--full s-toggle-row" style="margin-top:0.75rem">
        <span class="s-field__label">Campaign active <small class="s-card__hint">(uncheck to pause)</small></span>
        <label class="s-toggle"><input type="checkbox" id="seEnabled" ${s.enabled ? "checked" : ""} /><span class="s-toggle__track"></span></label>
      </div>
      <div class="s-field s-field--full s-toggle-row">
        <span class="s-field__label">Share links active <small class="s-card__hint">(uncheck to deactivate all links)</small></span>
        <label class="s-toggle"><input type="checkbox" id="seLinks" ${s.linksActive ? "checked" : ""} /><span class="s-toggle__track"></span></label>
      </div>
      <div style="margin-top:1rem">
        <button class="s-btn s-btn--primary" id="seSave"><i data-lucide="save" class="s-icon"></i> Save Rules</button>
      </div>
    </div>
    <div class="s-zone-header s-zone-header--intel" style="margin-top:1.5rem">
      <i data-lucide="bar-chart-2" class="s-icon"></i><span>Performance Analytics</span>
    </div>
    <div class="s-analytics-grid">
      <div class="s-card">
        <h3 class="s-card__title">Top Shared Products &amp; Collections</h3>
        ${topShared.length ? `<div class="s-rank-list">${topShared.map(([l, n]) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(l)}</span><span class="s-rank-row__val">${n}</span></div>`).join("")}</div>` : empty("No shares yet.", "share-2")}
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Top Performing Campaign</h3>
        ${s.campaignName ? `<div class="s-rank-list"><div class="s-rank-row"><span class="s-rank-row__name">${esc(s.campaignName)}</span><span class="s-rank-row__val">${s.bonusMultiplier || 1}×</span></div></div>`
          : empty("No bonus campaign configured.", "megaphone")}
        <p class="s-muted" style="margin-top:0.6rem;font-size:0.78rem">Seasonal performance: ${(s.seasonalMultiplier || 1)}× on ${pointsGiven} pts awarded.</p>
      </div>
    </div>
    <div class="s-zone-header s-zone-header--circle" style="margin-top:1.5rem">
      <i data-lucide="share-2" class="s-icon"></i><span>Circle Connections</span>
    </div>
    <div class="s-list">${rows}</div>`;

  document.getElementById("seSave")?.addEventListener("click", () => {
    save(STORAGE.shareEarn, {
      enabled: !!document.getElementById("seEnabled")?.checked,
      linksActive: !!document.getElementById("seLinks")?.checked,
      base: Number(val("seBase")) || 0, tier5000: Number(val("seT5")) || 0, tier10000: Number(val("seT10")) || 0,
      bonusMultiplier: Number(val("seBonus")) || 1, seasonalMultiplier: Number(val("seSeason")) || 1,
      validityDays: Number(val("seValid")) || 0, maxPerMember: Number(val("seMax")) || 0,
      campaignName: val("seCampaign"),
    });
    lxSaveGlow("seSave", "Share the Love rules saved 💛");
  });
}

/* ── HER CIRCLE: Journey Management (My Journey milestones) ───── */
const JOURNEY_DEFAULT_MILESTONES = [
  { id: "welcome",        category: "First Steps",            title: "Welcome to ABDAN",            description: "Your story with ABDAN begins.",            metric: "profile",          threshold: 1,  points: 10,  active: true },
  { id: "created-space",  category: "First Steps",            title: "Created Your Space",          description: "A private home for all that you love.",    metric: "profile",          threshold: 1,  points: 10,  active: true },
  { id: "first-save",     category: "Shopping Journey",       title: "First Collection Saved",      description: "The first piece that caught your heart.",  metric: "wishlist",         threshold: 1,  points: 15,  active: true },
  { id: "first-purchase", category: "Shopping Journey",       title: "First Purchase",              description: "Your first ABDAN piece, chosen with care.",metric: "orders",           threshold: 1,  points: 50,  active: true },
  { id: "festival",       category: "Shopping Journey",       title: "Festival Collection",         description: "A piece for the season of light.",         metric: "festival",         threshold: 1,  points: 30,  active: true },
  { id: "five-orders",    category: "Shopping Journey",       title: "5 Orders Completed",          description: "A wardrobe quietly growing.",              metric: "orders",           threshold: 5,  points: 100, active: true },
  { id: "trusted-patron", category: "Shopping Journey",       title: "Trusted Patron",              description: "A cherished member of the ABDAN family.",  metric: "orders",           threshold: 10, points: 200, active: true },
  { id: "first-look",     category: "Style Journey",          title: "First Styled Look",           description: "You shared how you wear it.",              metric: "looks",            threshold: 1,  points: 20,  active: true },
  { id: "wardrobe-builder",category: "Style Journey",         title: "Wardrobe Builder",            description: "Your archive is quietly taking shape.",    metric: "purchased",        threshold: 3,  points: 40,  active: true },
  { id: "style-curator",  category: "Style Journey",          title: "Style Curator",               description: "Pairings made with an eye for grace.",     metric: "pairings",         threshold: 1,  points: 25,  active: true },
  { id: "collection-creator",category: "Style Journey",       title: "Collection Creator",          description: "Lookbooks composed with love.",            metric: "lookbooks",        threshold: 1,  points: 25,  active: true },
  { id: "memory-keeper",  category: "Style Journey",          title: "Memory Keeper",               description: "Moments kept, privately treasured.",       metric: "gallery",          threshold: 1,  points: 25,  active: true },
  { id: "first-concierge",category: "Community Journey",      title: "First Concierge Conversation",description: "You reached out, and ABDAN listened.",     metric: "concierge",        threshold: 1,  points: 20,  active: true },
  { id: "first-friend",   category: "Share the Love Journey", title: "First Friend Invited",        description: "You opened the door for someone you love.",metric: "referralsInvited", threshold: 1,  points: 20,  active: true },
  { id: "people-inspired",category: "Share the Love Journey", title: "People Inspired",             description: "Someone discovered ABDAN through you.",     metric: "peopleInspired",   threshold: 1,  points: 50,  active: true },
  { id: "circle-ambassador",category: "Share the Love Journey",title: "Circle Ambassador",          description: "Your warmth brings the Circle together.",  metric: "peopleInspired",   threshold: 3,  points: 150, active: true },
  { id: "circle-member",  category: "Inner Circle Journey",   title: "Circle Member",               description: "Welcome to the Circle.",                   metric: "loyaltyPts",       threshold: 1,  points: 0,   active: true },
  { id: "inner-circle",   category: "Inner Circle Journey",   title: "Inner Circle",                description: "Among ABDAN's most devoted.",              metric: "loyaltyPts",       threshold: 150,points: 0,   active: true },
  { id: "patron",         category: "Inner Circle Journey",   title: "Patron",                      description: "A patron of the house.",                   metric: "loyaltyPts",       threshold: 300,points: 0,   active: true },
  { id: "founders-circle",category: "Inner Circle Journey",   title: "Founder's Circle",            description: "Forever part of ABDAN's beginning.",       metric: "loyaltyPts",       threshold: 500,points: 0,   active: true },
];
const JOURNEY_METRICS = ["profile","wishlist","orders","festival","looks","pairings","gallery","lookbooks","purchased","concierge","referralsInvited","peopleInspired","loyaltyPts"];
function getJourneyMilestones() {
  const s = load(STORAGE.journey, null);
  return (Array.isArray(s) && s.length) ? s : JOURNEY_DEFAULT_MILESTONES.slice();
}
function renderJourneyAdmin() {
  setTitle("Journey Management", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddMilestone">
      <i data-lucide="plus" class="s-icon"></i> New Milestone
    </button>`);
  const milestones = getJourneyMilestones();

  /* Completion analytics — tally member journey data across all members. */
  const earned = {}; let members = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf("abdan-sp-journey:") === 0) {
        members++;
        const m = JSON.parse(localStorage.getItem(k) || "{}") || {};
        Object.keys(m).forEach((id) => { earned[id] = (earned[id] || 0) + 1; });
      }
    }
  } catch {}
  const titleOf = (id) => (milestones.find((x) => x.id === id) || {}).title || id;
  const ranked = milestones.map((m) => ({ id: m.id, title: m.title, count: earned[m.id] || 0 }));
  const mostEarned = [...ranked].sort((a, b) => b.count - a.count).slice(0, 5);
  const rarest     = [...ranked].sort((a, b) => a.count - b.count).slice(0, 5);

  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--circle">
      <i data-lucide="map" class="s-icon"></i><span>My Journey — milestones &amp; completion</span>
    </div>
    <div class="s-stats-row">
      ${stat("flag", "Active Milestones", milestones.filter((m) => m.active !== false).length, "s-stat--blue")}
      ${stat("users", "Members on a Journey", members, "s-stat--purple")}
      ${stat("award", "Milestones Earned", Object.values(earned).reduce((a, b) => a + b, 0), "s-stat--gold")}
    </div>
    <div class="s-analytics-grid">
      <div class="s-card"><h3 class="s-card__title">Most Earned Milestones</h3>
        ${mostEarned.some((m) => m.count) ? `<div class="s-rank-list">${mostEarned.map((m) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(m.title)}</span><span class="s-rank-row__val">${m.count}${members ? ` · ${Math.round((m.count / members) * 100)}%` : ""}</span></div>`).join("")}</div>` : empty("No milestones earned yet.", "award")}
      </div>
      <div class="s-card"><h3 class="s-card__title">Rarest Milestones</h3>
        <div class="s-rank-list">${rarest.map((m) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(m.title)}</span><span class="s-rank-row__val">${m.count}${members ? ` · ${Math.round((m.count / members) * 100)}%` : ""}</span></div>`).join("")}</div>
      </div>
    </div>
    <div class="s-zone-header s-zone-header--circle" style="margin-top:1.5rem">
      <i data-lucide="flag" class="s-icon"></i><span>Milestones</span>
    </div>
    <div class="s-list" id="sMilestoneList">
      ${milestones.map((m) => `
        <div class="s-list-item">
          <div class="s-list-item__main">
            <strong>${esc(m.title)}</strong>
            <span class="s-list-item__sub">${esc(m.category)} · ${esc(m.metric)} ≥ ${m.threshold} · ${m.points || 0} pts</span>
          </div>
          <div class="s-list-item__actions">
            <span class="s-badge ${m.active !== false ? "s-badge--green" : ""}">${m.active !== false ? "Active" : "Off"}</span>
            <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-ms="${m.id}"><i data-lucide="pencil" class="s-icon"></i></button>
          </div>
        </div>`).join("")}
    </div>
    <p class="s-muted" style="margin-top:0.75rem;font-size:0.78rem">Reset to defaults clears all customisations.</p>
    <button class="s-btn s-btn--ghost s-btn--sm" id="sJourneyReset" style="margin-top:0.5rem">Reset to defaults</button>`;

  document.getElementById("sJourneyReset")?.addEventListener("click", () => {
    if (!confirm("Reset all milestones to defaults?")) return;
    save(STORAGE.journey, JOURNEY_DEFAULT_MILESTONES.slice());
    toast("Milestones reset"); renderJourneyAdmin();
  });
  document.getElementById("sAddMilestone")?.addEventListener("click", () => openMilestonePanel());
  dom.content.querySelectorAll("[data-edit-ms]").forEach((b) => b.addEventListener("click", () => {
    openMilestonePanel(getJourneyMilestones().find((x) => x.id === b.dataset.editMs));
  }));

  function openMilestonePanel(ms = null) {
    const isNew = !ms;
    const m = ms || { id: "ms" + Date.now().toString(36), category: "Shopping Journey", title: "", description: "", metric: "orders", threshold: 1, points: 0, active: true };
    openPanel(isNew ? "New Milestone" : "Edit Milestone", `
      <div class="s-form-grid">
        ${field("Title", "text", "msTitle", m.title, "e.g. Trusted Patron")}
        ${fieldFull("Description", "text", "msDesc", m.description, "A short, warm line")}
        ${field("Category", "text", "msCat", m.category, "e.g. Shopping Journey")}
        <label class="s-field"><span class="s-field__label">Unlock metric</span>
          <select id="msMetric" class="s-field__select">${JOURNEY_METRICS.map((x) => `<option value="${x}" ${m.metric === x ? "selected" : ""}>${x}</option>`).join("")}</select>
        </label>
        ${field("Unlock threshold (≥)", "number", "msThr", m.threshold, "1")}
        ${field("Circle Points", "number", "msPts", m.points || 0, "0")}
        <div class="s-field s-field--full s-toggle-row"><span class="s-field__label">Active</span>
          <label class="s-toggle"><input type="checkbox" id="msActive" ${m.active !== false ? "checked" : ""} /><span class="s-toggle__track"></span></label>
        </div>
      </div>`, () => {
      const title = val("msTitle"); if (!title) { toast("Title is required", "error"); return; }
      const updated = { ...m, title, description: val("msDesc"), category: val("msCat"), metric: val("msMetric"), threshold: Number(val("msThr")) || 1, points: Number(val("msPts")) || 0, active: !!document.getElementById("msActive")?.checked };
      const list = getJourneyMilestones();
      const idx = list.findIndex((x) => x.id === m.id);
      if (idx >= 0) list[idx] = updated; else list.push(updated);
      save(STORAGE.journey, list);
      closePanel(); toast(isNew ? "Milestone created 💛" : "Milestone updated"); renderJourneyAdmin();
    });
  }
}

/* ── HER CIRCLE: My Moments — analytics only (no private content exposed) ── */
const MOMENTS_TYPE_LABELS = {
  wedding: "Wedding", engagement: "Engagement", eid: "Eid", ramadan: "Ramadan", diwali: "Diwali",
  temple: "Temple Visit", family: "Family Function", birthday: "Birthday", anniversary: "Anniversary",
  office: "Office Event", travel: "Travel", custom: "Custom Occasion",
};
function renderMomentsAdmin() {
  setTitle("Moments Insights", "");

  const typeCounts = {}, moodCounts = {}, inspCounts = {};
  let totalMoments = 0, totalPieces = 0, membersWithMoments = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf("abdan-sp-my-moments:") !== 0) continue;
      let list = []; try { list = JSON.parse(localStorage.getItem(k) || "[]") || []; } catch { list = []; }
      if (!Array.isArray(list) || !list.length) continue;
      membersWithMoments++;
      list.forEach((m) => {
        totalMoments++;
        const tLabel = MOMENTS_TYPE_LABELS[m.type] || m.type || "Custom Occasion";
        typeCounts[tLabel] = (typeCounts[tLabel] || 0) + 1;
        if (m.mood) moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
        const owned = (m.board && m.board.owned) ? m.board.owned.length : 0;
        const needed = (m.board && m.board.products) ? m.board.products.length : 0;
        totalPieces += owned + needed;
        (m.board && m.board.inspirations || []).forEach((insp) => {
          const key = String(insp.text || "").trim().toLowerCase();
          if (!key) return;
          inspCounts[key] = (inspCounts[key] || 0) + 1;
        });
      });
    }
  } catch {}

  const helpCounts = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf("abdan-sp-momhelp:") !== 0) continue;
      let m = {}; try { m = JSON.parse(localStorage.getItem(k) || "{}") || {}; } catch { m = {}; }
      Object.entries(m).forEach(([label, count]) => { helpCounts[label] = (helpCounts[label] || 0) + (count || 0); });
    }
  } catch {}

  const totalMembers = Object.keys(load(STORAGE.customers, {})).length;
  const avgPieces = totalMoments ? Math.round((totalPieces / totalMoments) * 10) / 10 : 0;
  const rankRows = (obj, n) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n)
    .map(([label, count]) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(label)}</span><span class="s-rank-row__val">${count}</span></div>`).join("");

  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--circle">
      <i data-lucide="calendar-heart" class="s-icon"></i><span>My Moments — occasion &amp; celebration planning</span>
    </div>
    <p class="s-muted" style="margin:-0.4rem 0 1rem;font-size:0.8rem">Analytics only — individual moment boards remain private to each member.</p>
    <div class="s-stats-row">
      ${stat("calendar-heart", "Moments Created", totalMoments, "s-stat--blue")}
      ${stat("users", "Members Planning", membersWithMoments, "s-stat--purple")}
      ${stat("layers", "Avg Pieces / Moment", avgPieces, "s-stat--gold")}
      ${stat("percent", "Of Her Circle Planning", totalMembers ? `${Math.round((membersWithMoments / totalMembers) * 100)}%` : "0%", "s-stat--green")}
    </div>
    <div class="s-analytics-grid">
      <div class="s-card"><h3 class="s-card__title">Most Popular Occasion Types</h3>
        ${Object.keys(typeCounts).length ? `<div class="s-rank-list">${rankRows(typeCounts, 8)}</div>` : empty("No Moments created yet.", "calendar-heart")}
      </div>
      <div class="s-card"><h3 class="s-card__title">Most Used Mood Categories</h3>
        ${Object.keys(moodCounts).length ? `<div class="s-rank-list">${rankRows(moodCounts, 8)}</div>` : empty("No moods chosen yet.", "sparkles")}
      </div>
      <div class="s-card"><h3 class="s-card__title">Most Saved Collections &amp; Inspirations</h3>
        ${Object.keys(inspCounts).length ? `<div class="s-rank-list">${rankRows(inspCounts, 8)}</div>` : empty("No inspirations saved yet.", "bookmark")}
      </div>
      <div class="s-card"><h3 class="s-card__title">Most Requested Styling Assistance</h3>
        ${Object.keys(helpCounts).length ? `<div class="s-rank-list">${rankRows(helpCounts, 8)}</div>` : empty("No help requests yet.", "message-circle")}
      </div>
    </div>`;
}

/* ── HER CIRCLE: My Edits — editorial curation & sharing (moderation + analytics) ── */
const EDIT_FLAGS_STORAGE_KEY = "abdan-studio-edit-flags";
const EDIT_SAVES_STORAGE_KEY = "abdan-edit-saves";
function getAllEdits() {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf("abdan-sp-edits:") !== 0) continue;
      const ownerEmail = k.slice("abdan-sp-edits:".length);
      let list = []; try { list = JSON.parse(localStorage.getItem(k) || "[]") || []; } catch { list = []; }
      list.forEach((e) => out.push(Object.assign({}, e, { ownerEmail })));
    }
  } catch {}
  return out;
}
function getEditFlagsAdmin() { try { return JSON.parse(localStorage.getItem(EDIT_FLAGS_STORAGE_KEY) || "{}") || {}; } catch { return {}; } }
function saveEditFlagsAdmin(f) { try { localStorage.setItem(EDIT_FLAGS_STORAGE_KEY, JSON.stringify(f)); } catch {} }
function toggleEditFlag(ownerEmail, editId, key) {
  const flags = getEditFlagsAdmin();
  const k = `${ownerEmail}::${editId}`;
  flags[k] = Object.assign({ featured: false, hidden: false }, flags[k]);
  flags[k][key] = !flags[k][key];
  saveEditFlagsAdmin(flags);
}

function renderEditsAdmin() {
  setTitle("Edit Management", "");
  const all = getAllEdits();
  const published = all.filter((e) => e.status === "published");
  const flags = getEditFlagsAdmin();
  const saveCounts = (() => { try { return JSON.parse(localStorage.getItem(EDIT_SAVES_STORAGE_KEY) || "{}") || {}; } catch { return {}; } })();

  /* Conversions & Circle Points awarded specifically through shared Edits —
     reuses the exact Share the Love referral records (type === "edit"). */
  const referrals = load(STORAGE.referrals, []);
  const editReferrals = referrals.filter((r) => r.type === "edit");
  const conversions = editReferrals.filter((r) => r.status === "rewarded" || r.ordered).length;
  const pointsAwarded = editReferrals.filter((r) => r.status === "rewarded").reduce((s, r) => s + (r.points || 0), 0);

  const typeCounts = {}, productsAdded = { count: 0 };
  all.forEach((e) => {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    (e.items || []).forEach((it) => { if (it.kind === "product") productsAdded.count++; });
  });
  const mostShared = [...all].sort((a, b) => (b.shareCount || 0) - (a.shareCount || 0)).slice(0, 6).filter((e) => e.shareCount);
  const mostSaved  = Object.entries(saveCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([k, n]) => { const [ownerEmail, editId] = k.split("::"); const e = all.find((x) => x.ownerEmail === ownerEmail && x.id === editId); return e ? { e, n } : null; }).filter(Boolean);
  const rankRows = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([label, count]) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(label)}</span><span class="s-rank-row__val">${count}</span></div>`).join("");

  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--circle">
      <i data-lucide="scissors" class="s-icon"></i><span>My Edits — editorial curation &amp; sharing</span>
    </div>
    <p class="s-muted" style="margin:-0.4rem 0 1rem;font-size:0.8rem">Curated, not crowdsourced — featuring is admin-controlled. No follower counts or public rankings exist anywhere in this system.</p>
    <div class="s-stats-row">
      ${stat("scissors", "Edits Created", all.length, "s-stat--blue")}
      ${stat("send", "Published", published.length, "s-stat--purple")}
      ${stat("shopping-bag", "Products Added", productsAdded.count, "s-stat--gold")}
      ${stat("trending-up", "Conversions From Edits", conversions, "s-stat--green")}
      ${stat("award", "Circle Points Awarded", pointsAwarded, "s-stat--gold")}
    </div>
    <div class="s-analytics-grid">
      <div class="s-card"><h3 class="s-card__title">Most Popular Themes</h3>
        ${Object.keys(typeCounts).length ? `<div class="s-rank-list">${rankRows(typeCounts)}</div>` : empty("No Edits created yet.", "scissors")}
      </div>
      <div class="s-card"><h3 class="s-card__title">Most Shared Edits</h3>
        ${mostShared.length ? `<div class="s-rank-list">${mostShared.map((e) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(e.name)}</span><span class="s-rank-row__val">${e.shareCount} share${e.shareCount !== 1 ? "s" : ""}</span></div>`).join("")}</div>` : empty("No Edits shared yet.", "send")}
      </div>
      <div class="s-card"><h3 class="s-card__title">Most Saved Edits</h3>
        ${mostSaved.length ? `<div class="s-rank-list">${mostSaved.map((x) => `<div class="s-rank-row"><span class="s-rank-row__name">${esc(x.e.name)}</span><span class="s-rank-row__val">${x.n} save${x.n !== 1 ? "s" : ""}</span></div>`).join("")}</div>` : empty("No Edits saved by other members yet.", "bookmark")}
      </div>
    </div>
    <div class="s-zone-header s-zone-header--circle" style="margin-top:1.5rem">
      <i data-lucide="eye" class="s-icon"></i><span>Review Shared Edits</span>
    </div>
    <div class="s-list" id="sEditList">
      ${published.length ? published.map((e) => {
        const f = flags[`${e.ownerEmail}::${e.id}`] || {};
        return `
        <div class="s-list-item">
          <div class="s-list-item__main">
            <strong>${esc(e.name)}</strong>
            <span class="s-list-item__sub">${esc(e.type)} · ${esc(e.ownerEmail)} · ${(e.items || []).length} pieces · ${e.shareCount || 0} shares</span>
          </div>
          <div class="s-list-item__actions">
            <span class="s-badge ${f.featured ? "s-badge--gold" : ""}">${f.featured ? "Featured" : "Not Featured"}</span>
            ${f.hidden ? `<span class="s-badge">Hidden</span>` : ""}
            <button class="s-btn s-btn--ghost s-btn--sm" data-edit-feature="${e.ownerEmail}|${e.id}">${f.featured ? "Unfeature" : "Feature"}</button>
            <button class="s-btn s-btn--ghost s-btn--sm" data-edit-hide="${e.ownerEmail}|${e.id}">${f.hidden ? "Unhide" : "Hide"}</button>
          </div>
        </div>`;
      }).join("") : empty("No published Edits yet — members curate privately until they choose to publish.", "scissors")}
    </div>`;

  dom.content.querySelectorAll("[data-edit-feature]").forEach((b) => b.addEventListener("click", () => {
    const [ownerEmail, editId] = b.dataset.editFeature.split("|");
    toggleEditFlag(ownerEmail, editId, "featured"); toast("Updated"); renderEditsAdmin();
  }));
  dom.content.querySelectorAll("[data-edit-hide]").forEach((b) => b.addEventListener("click", () => {
    const [ownerEmail, editId] = b.dataset.editHide.split("|");
    toggleEditFlag(ownerEmail, editId, "hidden"); toast("Updated"); renderEditsAdmin();
  }));
}

/* ── HER CIRCLE: Reviews ─────────────────────────────────────── */
function renderReviews() {
  setTitle("Reviews", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddReview">
      <i data-lucide="plus" class="s-icon"></i> Add Testimonial
    </button>
  `);
  const reviews = load(STORAGE.reviews, []);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--circle">
      <i data-lucide="star" class="s-icon"></i>
      <span>Customer Testimonials</span>
    </div>
    <div id="sReviewList" class="s-reviews-grid">
      ${reviews.length ? reviews.map(reviewCard).join("") : empty("Add your first customer testimonial — these build trust on the storefront.", "star")}
    </div>
  `;

  function reviewCard(r) {
    const stars = "★".repeat(r.rating || 5) + "☆".repeat(5 - (r.rating || 5));
    return `
      <div class="s-review-card ${r.featured ? "s-review-card--featured" : ""}">
        <div class="s-review-card__stars">${stars}</div>
        <p class="s-review-card__text">"${esc(r.text)}"</p>
        <div class="s-review-card__foot">
          <strong>${esc(r.name)}</strong>
          ${r.product ? `<span>on ${esc(r.product)}</span>` : ""}
          ${r.featured ? `<span class="s-badge s-badge--gold">Featured</span>` : ""}
        </div>
        <div class="s-review-card__actions">
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-review="${r.id}"><i data-lucide="pencil" class="s-icon"></i></button>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-review="${r.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
        </div>
      </div>`;
  }

  document.getElementById("sAddReview")?.addEventListener("click", () => openReviewPanel());
  dom.content.querySelectorAll("[data-edit-review]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = load(STORAGE.reviews, []).find((x) => x.id === btn.dataset.editReview);
      if (r) openReviewPanel(r);
    });
  });
  dom.content.querySelectorAll("[data-del-review]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this review?")) return;
      save(STORAGE.reviews, load(STORAGE.reviews, []).filter((r) => r.id !== btn.dataset.delReview));
      toast("Review removed");
      renderReviews();
    });
  });

  function openReviewPanel(review = null) {
    const isNew = !review;
    const r = review || { id: uid(), name: "", text: "", rating: 5, product: "", featured: false };
    const products = load(STORAGE.products, []);
    openPanel(isNew ? "Add Testimonial" : "Edit Testimonial", `
      <div class="s-form-grid">
        ${field("Customer Name", "text", "rvName", r.name, "e.g. Fatima A.")}
        <label class="s-field">
          <span class="s-field__label">Rating</span>
          <select id="rvRating" class="s-field__select">
            ${[5,4,3,2,1].map((n) => `<option value="${n}" ${r.rating===n?"selected":""}>${"★".repeat(n)} (${n} stars)</option>`).join("")}
          </select>
        </label>
        ${textareaFull("Review Text", "rvText", r.text, 4, "In her own words…")}
        <label class="s-field">
          <span class="s-field__label">Product (optional)</span>
          <select id="rvProduct" class="s-field__select">
            <option value="">— General —</option>
            ${products.map((p) => `<option value="${p.name}" ${r.product===p.name?"selected":""}>${esc(p.name)}</option>`).join("")}
          </select>
        </label>
        <div class="s-field s-field--full s-toggle-row">
          <span class="s-field__label">Feature on storefront</span>
          <label class="s-toggle">
            <input type="checkbox" id="rvFeatured" ${r.featured ? "checked" : ""} />
            <span class="s-toggle__track"></span>
          </label>
        </div>
      </div>
    `, () => {
      const name = val("rvName"), text = document.getElementById("rvText")?.value.trim() || "";
      if (!name || !text) { toast("Name and review text are required", "error"); return; }
      const updated = { ...r, name, text, rating: Number(val("rvRating")) || 5, product: val("rvProduct"), featured: !!document.getElementById("rvFeatured")?.checked };
      const list = load(STORAGE.reviews, []);
      const idx  = list.findIndex((x) => x.id === r.id);
      if (idx >= 0) list[idx] = updated; else list.unshift(updated);
      save(STORAGE.reviews, list);
      closePanel();
      toast(isNew ? "Testimonial added 💛" : "Testimonial updated");
      renderReviews();
    });
  }
}

/* ── STORYTELLING: Campaign Engine ──────────────────────────── */
function renderCampaigns() {
  setTitle("Campaign Engine", `
    <button class="s-btn s-btn--primary s-btn--sm" id="sAddCampaign">
      <i data-lucide="plus" class="s-icon"></i> New Campaign
    </button>
  `);
  const campaigns = load(STORAGE.campaigns, []);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--story">
      <i data-lucide="megaphone" class="s-icon"></i>
      <span>Campaigns &amp; Moments</span>
    </div>
    <p class="s-muted" style="margin-bottom:1rem">Plan and draft brand campaigns for Eid, seasonal drops, and special moments.</p>
    <div class="s-list" id="sCampaignList">
      ${campaigns.length ? campaigns.map(campaignRow).join("") : empty("No campaigns yet. Every great launch begins with a moment of intention.", "megaphone")}
    </div>
  `;

  function campaignRow(c) {
    const cls = { draft: "s-badge--amber", active: "s-badge--green", completed: "" }[c.status] || "";
    return `
      <div class="s-list-item">
        <div class="s-list-item__main">
          <strong>${esc(c.name)}</strong>
          <span class="s-list-item__sub">${esc(c.type || "Campaign")} · ${c.launchDate ? fmtDate(c.launchDate) : "No date set"}</span>
        </div>
        <div class="s-list-item__actions">
          <span class="s-badge ${cls}">${capitalise(c.status || "draft")}</span>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-edit-camp="${c.id}"><i data-lucide="pencil" class="s-icon"></i></button>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-camp="${c.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
        </div>
      </div>`;
  }

  document.getElementById("sAddCampaign")?.addEventListener("click", () => openCampaignPanel());
  dom.content.querySelectorAll("[data-edit-camp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = load(STORAGE.campaigns, []).find((x) => x.id === btn.dataset.editCamp);
      if (c) openCampaignPanel(c);
    });
  });
  dom.content.querySelectorAll("[data-del-camp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this campaign?")) return;
      save(STORAGE.campaigns, load(STORAGE.campaigns, []).filter((c) => c.id !== btn.dataset.delCamp));
      toast("Campaign removed");
      renderCampaigns();
    });
  });

  function openCampaignPanel(campaign = null) {
    const isNew = !campaign;
    const c = campaign || { id: uid(), name: "", type: "Seasonal Drop", status: "draft", launchDate: "", endDate: "", theme: "", whatsappMessage: "", instagramCaption: "", notes: "" };
    openPanel(isNew ? "New Campaign" : "Edit Campaign", `
      <div class="s-form-grid">
        ${field("Campaign Name", "text", "cpName", c.name, "e.g. Eid Al-Adha Drop 2026")}
        <label class="s-field">
          <span class="s-field__label">Type</span>
          <select id="cpType" class="s-field__select">
            ${["Seasonal Drop","Eid Collection","Sale","New Arrival","Collaboration","Brand Story"].map((t) => `<option ${c.type===t?"selected":""}>${t}</option>`).join("")}
          </select>
        </label>
        <label class="s-field">
          <span class="s-field__label">Status</span>
          <select id="cpStatus" class="s-field__select">
            <option value="draft"     ${c.status==="draft"     ?"selected":""}>Draft</option>
            <option value="active"    ${c.status==="active"    ?"selected":""}>Active</option>
            <option value="completed" ${c.status==="completed" ?"selected":""}>Completed</option>
          </select>
        </label>
        ${field("Launch Date", "date", "cpLaunch", c.launchDate || "", "")}
        ${field("End Date",    "date", "cpEnd",    c.endDate    || "", "Optional")}
        ${fieldFull("Creative Direction", "text", "cpTheme", c.theme || "", "e.g. Desert bloom. Soft textures. Gold hours.")}
        ${textareaFull("WhatsApp Broadcast Draft", "cpWA", c.whatsappMessage   || "", 4, "Compose the message you'll send to Her Circle…")}
        ${textareaFull("Instagram Caption Draft",  "cpIG", c.instagramCaption  || "", 4, "Write the moment into words…")}
        ${textareaFull("Internal Notes",            "cpNotes", c.notes         || "", 3, "Anything the team should know")}
      </div>
    `, () => {
      const name = val("cpName");
      if (!name) { toast("Campaign name required", "error"); return; }
      const updated = { ...c, name, type: val("cpType"), status: val("cpStatus"), launchDate: val("cpLaunch"), endDate: val("cpEnd"), theme: val("cpTheme"), whatsappMessage: document.getElementById("cpWA")?.value.trim() || "", instagramCaption: document.getElementById("cpIG")?.value.trim() || "", notes: document.getElementById("cpNotes")?.value.trim() || "" };
      const list = load(STORAGE.campaigns, []);
      const idx  = list.findIndex((x) => x.id === c.id);
      if (idx >= 0) list[idx] = updated; else list.unshift(updated);
      save(STORAGE.campaigns, list);
      closePanel();
      toast(isNew ? "Campaign created 💛" : "Campaign updated");
      renderCampaigns();
    });
  }
}

/* ── STORYTELLING: Founder Notes ────────────────────────────── */
function renderFounder() {
  setTitle("Founder Notes");
  const notes = load(STORAGE.founder, []);
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--story">
      <i data-lucide="feather" class="s-icon"></i>
      <span>Brand Journal — Private</span>
    </div>
    <p class="s-muted" style="margin-bottom:1rem">A private space for brand decisions, creative directions, and founder thoughts. Never visible to customers.</p>
    <div class="s-founder-composer">
      <textarea id="sFounderInput" class="s-field__textarea s-founder-input" placeholder="Write a note for the brand's memory…" rows="3"></textarea>
      <button class="s-btn s-btn--primary s-btn--sm" id="sFounderSave" style="align-self:flex-end;margin-top:0.6rem">
        <i data-lucide="feather" class="s-icon"></i> Save Note
      </button>
    </div>
    <div id="sFounderList" class="s-founder-list">
      ${notes.length ? notes.map(founderNote).join("") : `<p class="s-muted" style="text-align:center;padding:2rem 0">Your first note begins the brand's private story.</p>`}
    </div>
  `;

  function founderNote(n) {
    return `
      <div class="s-founder-note">
        <p class="s-founder-note__text">${esc(n.text).replace(/\n/g, "<br>")}</p>
        <div class="s-founder-note__meta">
          <span>${fmtDate(n.createdAt)}</span>
          <button class="s-btn s-btn--ghost s-btn--sm s-btn--icon" data-del-note="${n.id}"><i data-lucide="trash-2" class="s-icon"></i></button>
        </div>
      </div>`;
  }

  function bindDeletes() {
    dom.content.querySelectorAll("[data-del-note]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const list = load(STORAGE.founder, []);
        save(STORAGE.founder, list.filter((n) => n.id !== btn.dataset.delNote));
        btn.closest(".s-founder-note")?.remove();
        toast("Note removed");
      });
    });
  }

  document.getElementById("sFounderSave")?.addEventListener("click", () => {
    const text = document.getElementById("sFounderInput")?.value.trim();
    if (!text) return;
    const list = load(STORAGE.founder, []);
    list.unshift({ id: uid(), text, createdAt: new Date().toISOString() });
    save(STORAGE.founder, list);
    document.getElementById("sFounderInput").value = "";
    const listEl = document.getElementById("sFounderList");
    listEl.innerHTML = list.map(founderNote).join("");
    initLucide();
    bindDeletes();
    toast("Note saved 🌿");
  });

  bindDeletes();
}

/* ── INTELLIGENCE: Analytics Dashboard ──────────────────────── */
function renderAnalytics() {
  setTitle("Analytics");
  const products  = load(STORAGE.products,  []);
  const orders    = load(STORAGE.orders,    []);
  const customers = getCustomers();
  const revenue   = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const avgOrder  = orders.length ? revenue / orders.length : 0;

  const statusCounts = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
  orders.forEach((o) => { if (statusCounts[o.status] !== undefined) statusCounts[o.status]++; });

  const catCounts = {};
  products.forEach((p) => { catCounts[p.category || "Uncategorised"] = (catCounts[p.category || "Uncategorised"] || 0) + 1; });

  /* Monthly revenue — last 6 months */
  const monthlyData = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    monthlyData[key] = 0;
  }
  orders.forEach((o) => {
    const d   = new Date(o.createdAt);
    const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    if (key in monthlyData) monthlyData[key] += Number(o.total) || 0;
  });
  const maxMonthly = Math.max(...Object.values(monthlyData), 1);

  /* ── Savings analytics (Part 9) ──────────────────────────────────────── */
  const nowS = new Date();
  const startTodayS = new Date(); startTodayS.setHours(0, 0, 0, 0);
  const weekAgoS = nowS.getTime() - 7 * 864e5;
  const sv = { today: 0, week: 0, month: 0, year: 0, life: 0 };
  orders.forEach((o) => {
    const s = Number(o.savings) || 0; if (s <= 0) return;
    sv.life += s;
    const d = new Date(o.createdAt || o.updatedAt || nowS);
    if (d >= startTodayS) sv.today += s;
    if (d.getTime() >= weekAgoS) sv.week += s;
    if (d.getMonth() === nowS.getMonth() && d.getFullYear() === nowS.getFullYear()) sv.month += s;
    if (d.getFullYear() === nowS.getFullYear()) sv.year += s;
  });
  const coupons      = load(STORAGE.coupons, []);
  const topCoupons   = [...coupons].sort((a, b) => (b.uses || 0) - (a.uses || 0)).filter((c) => c.code).slice(0, 5);
  const campaignsA   = load(STORAGE.campaigns, []);
  const topCampaigns = [...campaignsA].slice(0, 5);
  const prodById     = {}; products.forEach((p) => { prodById[p.id] = p; });
  const catSavings   = {};
  orders.forEach((o) => {
    const s = Number(o.savings) || 0;
    if (s <= 0 || !Array.isArray(o.items) || !o.items.length) return;
    const units = o.items.reduce((a, it) => a + (it.quantity || 1), 0) || 1;
    const per = s / units;
    o.items.forEach((it) => {
      const cat = (prodById[it.id] || {}).category || "Other";
      catSavings[cat] = (catSavings[cat] || 0) + per * (it.quantity || 1);
    });
  });
  const topCats = Object.entries(catSavings).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const custSavings = {};
  orders.forEach((o) => {
    const s = Number(o.savings) || 0; if (s <= 0) return;
    const key = o.customerName || o.customerEmail || o.customerPhone || "Guest";
    custSavings[key] = (custSavings[key] || 0) + s;
  });
  const topCust = Object.entries(custSavings).sort((a, b) => b[1] - a[1]).slice(0, 8);

  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--intel">
      <i data-lucide="bar-chart-2" class="s-icon"></i>
      <span>Brand Intelligence</span>
    </div>
    <div class="s-stats-row">
      ${stat("trending-up",  "Total Revenue",    fmtCurrency(revenue),           "s-stat--gold")}
      ${stat("receipt",      "Total Orders",     orders.length,                  "s-stat--green")}
      ${stat("shopping-bag", "Avg Order Value",  fmtCurrency(Math.round(avgOrder)), "s-stat--blue")}
      ${stat("users",        "Her Circle",       customers.length,               "s-stat--purple")}
    </div>
    <div class="s-zone-header s-zone-header--commerce" style="margin-top:1.5rem">
      <i data-lucide="gift" class="s-icon"></i>
      <span>Savings Provided</span>
    </div>
    <div class="s-stats-row">
      ${stat("gift",       "Today",      fmtCurrency(sv.today), "s-stat--gold")}
      ${stat("calendar",   "This Week",  fmtCurrency(sv.week),  "s-stat--blue")}
      ${stat("calendar",   "This Month", fmtCurrency(sv.month), "s-stat--green")}
      ${stat("calendar",   "This Year",  fmtCurrency(sv.year),  "s-stat--purple")}
    </div>
    <div class="s-stats-row">
      ${stat("trending-up", "Lifetime Savings Provided", fmtCurrency(sv.life), "s-stat--gold")}
    </div>
    <div class="s-analytics-grid">
      <div class="s-card">
        <h3 class="s-card__title">Most Used Coupons</h3>
        ${topCoupons.length ? `<div class="s-rank-list">${topCoupons.map((c) => `
          <div class="s-rank-row"><span class="s-rank-row__name">${esc(c.code)}</span><span class="s-rank-row__val">${c.uses || 0} uses</span></div>`).join("")}</div>`
          : empty("No coupons created yet.", "ticket")}
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Top Performing Campaigns</h3>
        ${topCampaigns.length ? `<div class="s-rank-list">${topCampaigns.map((c) => `
          <div class="s-rank-row"><span class="s-rank-row__name">${esc(c.title || c.name || "Campaign")}</span><span class="s-rank-row__val">${c.active ? "Active" : "—"}</span></div>`).join("")}</div>`
          : empty("No campaigns yet.", "megaphone")}
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Top Benefit Collections</h3>
        ${topCats.length ? `<div class="s-rank-list">${topCats.map(([cat, amt]) => `
          <div class="s-rank-row"><span class="s-rank-row__name">${esc(cat)}</span><span class="s-rank-row__val">${fmtCurrency(Math.round(amt))}</span></div>`).join("")}</div>`
          : empty("Savings by collection appears as orders arrive.", "layers")}
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Customer Savings Leaderboard <span class="s-card__hint">(admin only)</span></h3>
        ${topCust.length ? `<div class="s-rank-list">${topCust.map(([name, amt], i) => `
          <div class="s-rank-row"><span class="s-rank-row__name">${i + 1}. ${esc(name)}</span><span class="s-rank-row__val">${fmtCurrency(Math.round(amt))}</span></div>`).join("")}</div>`
          : empty("No member savings recorded yet.", "users")}
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Revenue — Last 6 Months</h3>
        <div class="s-bar-chart">
          ${Object.entries(monthlyData).map(([label, v]) => `
            <div class="s-bar-chart__col">
              <div class="s-bar-chart__bar-wrap">
                <div class="s-bar-chart__bar" style="height:${Math.max(3, Math.round((v / maxMonthly) * 100))}%"></div>
              </div>
              <span class="s-bar-chart__label">${label}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Order Status</h3>
        <div class="s-donut-list">
          ${Object.entries(statusCounts).map(([status, count]) => {
            const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
            const cls = { pending: "s-badge--amber", confirmed: "s-badge--blue", shipped: "s-badge--emerald", delivered: "s-badge--green", cancelled: "s-badge--red" }[status] || "";
            return `
              <div class="s-donut-row">
                <span class="s-badge ${cls}" style="min-width:78px;justify-content:center">${capitalise(status)}</span>
                <div class="s-donut-bar"><div class="s-donut-bar__fill s-donut-bar__fill--${status}" style="width:${pct}%"></div></div>
                <span class="s-donut-count">${count}</span>
              </div>`;
          }).join("")}
        </div>
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Catalog by Category</h3>
        <div class="s-donut-list">
          ${Object.keys(catCounts).length ? Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).map(([cat, count]) => `
            <div class="s-donut-row">
              <span class="s-muted" style="min-width:120px;font-size:0.775rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(cat)}</span>
              <div class="s-donut-bar"><div class="s-donut-bar__fill" style="width:${Math.round((count/products.length)*100)}%"></div></div>
              <span class="s-donut-count">${count}</span>
            </div>
          `).join("") : `<p class="s-muted">Add products to see category breakdown.</p>`}
        </div>
      </div>
      <div class="s-card">
        <h3 class="s-card__title">Quick Insights</h3>
        <div class="s-insight-list">
          <div class="s-insight-item">
            <i data-lucide="trending-up" class="s-icon"></i>
            <div><strong>${orders.filter((o) => o.status === "delivered").length}</strong><span>orders delivered successfully</span></div>
          </div>
          <div class="s-insight-item">
            <i data-lucide="star" class="s-icon"></i>
            <div><strong>${products.filter((p) => p.featured).length}</strong><span>pieces featured on homepage</span></div>
          </div>
          <div class="s-insight-item">
            <i data-lucide="shopping-bag" class="s-icon"></i>
            <div><strong>${products.filter((p) => p.status === "active").length} / ${products.length}</strong><span>pieces currently active</span></div>
          </div>
          <div class="s-insight-item">
            <i data-lucide="heart" class="s-icon"></i>
            <div><strong>${customers.reduce((s,c) => s + (c.wishlist?.length || 0), 0)}</strong><span>items saved to wishlists</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── INTELLIGENCE: Experience Intelligence ───────────────────── */
function renderExperience() {
  setTitle("Experience Intel");
  const orders    = load(STORAGE.orders,    []);
  const customers = getCustomers();
  const reviews   = load(STORAGE.reviews,   []);

  const productFreq = {};
  orders.forEach((o) => { if (o.product) productFreq[o.product] = (productFreq[o.product] || 0) + 1; });
  const topProducts = Object.entries(productFreq).sort((a,b) => b[1]-a[1]).slice(0, 5);

  const avgRating = reviews.length ? (reviews.reduce((s,r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1) : "—";

  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--intel">
      <i data-lucide="activity" class="s-icon"></i>
      <span>Customer Experience Intelligence</span>
    </div>
    <div class="s-stats-row" style="margin-bottom:1rem">
      ${stat("star",         "Avg Rating",    avgRating,              "s-stat--gold")}
      ${stat("message-circle","Reviews",      reviews.length,         "s-stat--green")}
      ${stat("users",        "Her Circle",    customers.length,       "s-stat--purple")}
      ${stat("heart",        "Wishlist Saves",customers.reduce((s,c) => s + (c.wishlist?.length||0), 0), "s-stat--gold")}
    </div>
    <div class="s-card" style="margin-bottom:1rem">
      <h3 class="s-card__title">Most Ordered Pieces</h3>
      ${topProducts.length ? `
        <div class="s-donut-list" style="margin-top:0.75rem">
          ${topProducts.map(([name, count]) => `
            <div class="s-donut-row">
              <span class="s-muted" style="min-width:180px;font-size:0.833rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(name)}</span>
              <div class="s-donut-bar"><div class="s-donut-bar__fill" style="width:${Math.round((count/topProducts[0][1])*100)}%"></div></div>
              <span class="s-donut-count">${count}</span>
            </div>
          `).join("")}
        </div>
      ` : `<p class="s-muted" style="margin-top:0.75rem">Order data will reveal the most-loved pieces over time.</p>`}
    </div>
    <div class="s-card" style="margin-bottom:1rem">
      <h3 class="s-card__title">Her Circle Insights</h3>
      <div class="s-insight-list" style="margin-top:0.75rem">
        <div class="s-insight-item">
          <i data-lucide="users" class="s-icon"></i>
          <div><strong>${customers.length}</strong><span>members in Her Circle</span></div>
        </div>
        <div class="s-insight-item">
          <i data-lucide="message-circle" class="s-icon"></i>
          <div><strong>${customers.filter((c) => c.phone).length}</strong><span>members reachable via WhatsApp</span></div>
        </div>
        <div class="s-insight-item">
          <i data-lucide="star" class="s-icon"></i>
          <div><strong>${reviews.filter((r) => r.featured).length}</strong><span>testimonials featured on storefront</span></div>
        </div>
      </div>
    </div>
    <div class="s-alert s-alert--info">
      <i data-lucide="info" class="s-icon"></i>
      Intelligence deepens as your circle grows and orders accumulate. Every interaction adds clarity to the brand's direction.
    </div>
  `;
}

/* ── INTELLIGENCE: Permission System ────────────────────────── */
function renderPermissions() {
  setTitle("Permissions");
  dom.content.innerHTML = `
    <div class="s-zone-header s-zone-header--intel">
      <i data-lucide="lock" class="s-icon"></i>
      <span>Access &amp; Security</span>
    </div>
    <div class="s-card" style="margin-bottom:1rem">
      <h3 class="s-card__title">Current Session</h3>
      <div class="s-insight-list" style="margin-top:0.75rem">
        <div class="s-insight-item">
          <i data-lucide="shield-check" class="s-icon"></i>
          <div><strong>Admin</strong><span>Full access — Brand Operating System</span></div>
        </div>
        <div class="s-insight-item">
          <i data-lucide="clock" class="s-icon"></i>
          <div><strong>8 hours</strong><span>Session duration — auto-renewed on activity</span></div>
        </div>
        <div class="s-insight-item">
          <i data-lucide="key" class="s-icon"></i>
          <div><strong>SHA-256</strong><span>Credentials hashed — password never stored in plain text</span></div>
        </div>
      </div>
    </div>
    <div class="s-card" style="margin-bottom:1rem">
      <h3 class="s-card__title">Access by Zone</h3>
      <div class="s-permissions-table">
        ${[
          { zone: "Brand",        desc: "Logo, Typography, Colors, Atmosphere, Voice" },
          { zone: "Experience",   desc: "Trust Center, T&C Manager, Legal Acceptance" },
          { zone: "Commerce",     desc: "Pieces, Collections, Orders, Offers, Media"  },
          { zone: "Storytelling", desc: "Editorial Studio, Campaigns, Founder Notes"  },
          { zone: "Her Circle",   desc: "Customer profiles, messaging, reviews"       },
          { zone: "Intelligence", desc: "Analytics, Experience Intel, Permissions"    },
          { zone: "System",       desc: "Settings, sign-out"                          },
        ].map((row) => `
          <div class="s-permissions-row">
            <div class="s-permissions-zone">
              <strong>${row.zone}</strong>
              <span>${row.desc}</span>
            </div>
            <span class="s-badge s-badge--gold">Admin</span>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="s-card">
      <h3 class="s-card__title">Security Actions</h3>
      <div class="s-danger-row" style="margin-top:0.75rem">
        <button class="s-btn s-btn--secondary s-btn--sm" id="sSessionRefresh">
          <i data-lucide="refresh-cw" class="s-icon"></i> Refresh Session
        </button>
        <button class="s-btn s-btn--danger s-btn--sm" id="sForceSignout">
          <i data-lucide="log-out" class="s-icon"></i> Sign Out Now
        </button>
      </div>
    </div>
  `;
  document.getElementById("sSessionRefresh")?.addEventListener("click", () => {
    try {
      const exp = Date.now() + 8 * 60 * 60 * 1000;
      localStorage.setItem("abdan-admin-token", JSON.stringify({ v: "true", exp }));
      sessionStorage.setItem("abdan-admin-auth", "true");
      toast("Session refreshed — 8 hours extended ✨");
    } catch { toast("Could not refresh session", "error"); }
  });
  document.getElementById("sForceSignout")?.addEventListener("click", signout);
}

/* ════════════════════════════════════════════════════════════
   COMMAND PALETTE  (⌘K / Ctrl+K)
   ════════════════════════════════════════════════════════════ */

function openCommandPalette() {
  if (cmdPaletteOpen) return;
  cmdPaletteOpen = true;

  const overlay = document.createElement("div");
  overlay.id = "sCmdOverlay";
  overlay.className = "s-cmd-overlay";
  overlay.innerHTML = `
    <div class="s-cmd-palette" role="dialog" aria-label="Command palette">
      <div class="s-cmd-search">
        <i data-lucide="search" class="s-icon s-cmd-search__icon"></i>
        <input type="text" class="s-cmd-input" id="sCmdInput"
               placeholder="Search views, actions…"
               autocomplete="off" spellcheck="false" />
        <kbd class="s-cmd-kbd">ESC</kbd>
      </div>
      <div class="s-cmd-results" id="sCmdResults"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  initLucide();

  const input = document.getElementById("sCmdInput");
  input?.focus();
  renderCmdResults("");

  input?.addEventListener("input", (e) => renderCmdResults(e.target.value));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeCommandPalette();
  });

  input?.addEventListener("keydown", (e) => {
    const items  = [...document.querySelectorAll(".s-cmd-item")];
    const active = document.querySelector(".s-cmd-item--focused");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = active ? (items[items.indexOf(active) + 1] || items[0]) : items[0];
      active?.classList.remove("s-cmd-item--focused");
      next?.classList.add("s-cmd-item--focused");
      next?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = active ? (items[items.indexOf(active) - 1] || items[items.length - 1]) : items[items.length - 1];
      active?.classList.remove("s-cmd-item--focused");
      prev?.classList.add("s-cmd-item--focused");
      prev?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      document.querySelector(".s-cmd-item--focused")?.click();
    }
  });
}

function closeCommandPalette() {
  cmdPaletteOpen = false;
  document.getElementById("sCmdOverlay")?.remove();
}

function renderCmdResults(query) {
  const q         = query.toLowerCase().trim();
  const container = document.getElementById("sCmdResults");
  if (!container) return;

  const matches = q
    ? STUDIO_VIEWS.filter((v) =>
        v.label.toLowerCase().includes(q) ||
        v.group.toLowerCase().includes(q)  ||
        v.id.includes(q))
    : STUDIO_VIEWS;

  if (!matches.length) {
    container.innerHTML = `<p class="s-cmd-empty">No results for "${esc(query)}"</p>`;
    return;
  }

  container.innerHTML = matches.slice(0, 12).map((v, i) => `
    <button class="s-cmd-item ${i === 0 ? "s-cmd-item--focused" : ""}" data-cmd-nav="${v.id}" type="button">
      <div class="s-cmd-item__icon">
        <i data-lucide="${v.icon}" class="s-icon"></i>
      </div>
      <div class="s-cmd-item__label">
        <span>${v.label}</span>
        <span class="s-cmd-item__group">${v.group}</span>
      </div>
      <i data-lucide="corner-down-left" class="s-icon s-cmd-item__enter"></i>
    </button>
  `).join("");

  initLucide();

  container.querySelectorAll("[data-cmd-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeCommandPalette();
      navigate(btn.dataset.cmdNav);
    });
    btn.addEventListener("mouseenter", () => {
      document.querySelector(".s-cmd-item--focused")?.classList.remove("s-cmd-item--focused");
      btn.classList.add("s-cmd-item--focused");
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

  /* Keyboard: Escape + ⌘K command palette */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (cmdPaletteOpen)        closeCommandPalette();
      else if (!dom.panel.hidden) closePanel();
      else if (sidebarOpen)       closeSidebar();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      cmdPaletteOpen ? closeCommandPalette() : openCommandPalette();
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

  /* Inject ⌘K command palette search button into sidebar footer */
  const cmdHint = document.createElement("button");
  cmdHint.type = "button";
  cmdHint.className = "s-cmd-hint";
  cmdHint.innerHTML = `
    <span class="s-cmd-hint__left">
      <i data-lucide="search" class="s-icon"></i>
      <span>Search & Navigate</span>
    </span>
    <span class="s-cmd-hint__kbd">
      <kbd>⌘</kbd><kbd>K</kbd>
    </span>`;
  cmdHint.addEventListener("click", openCommandPalette);
  dom.aside.querySelector(".s-aside-foot")?.prepend(cmdHint);

  /* Seed products from main site if none exist */
  if (!localStorage.getItem(STORAGE.products)) {
    save(STORAGE.products, []);
  }

  /* RC-18: Command Center is the default landing (no hash) — Operations,
     Analytics, and Overview all remain reachable from the sidebar. */
  const hash = window.location.hash.replace("#", "") || "command-center";
  const view = STUDIO_VIEWS.find((v) => v.id === hash) ? hash : "command-center";
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

/* ── Sourcing Requests ──────────────────────────────────────── */
const REQ_STATUSES = ["Submitted","Reviewing","Sourcing","Options Found","Completed"];

function renderRequests() {
  setTitle("Sourcing Requests");
  const all    = load(STORAGE.globalRequests, []);
  const sorted = [...all].sort((a, b) => (b.ts||0) - (a.ts||0));

  dom.content.innerHTML = `
    <div class="s-filter-bar">
      <div class="s-search">
        <i data-lucide="search" class="s-icon"></i>
        <input id="sReqSearch" type="search" placeholder="Search by name or description…" class="s-field__input" />
      </div>
      <select id="sReqFilter" class="s-field__select">
        <option value="">All statuses</option>
        ${REQ_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join("")}
      </select>
    </div>
    <div id="sReqList" class="s-list">
      ${sorted.length ? sorted.map(reqRow).join("") : empty("No sourcing requests yet","search")}
    </div>`;

  function filterReqs() {
    const q   = document.getElementById("sReqSearch")?.value.toLowerCase()||"";
    const st  = document.getElementById("sReqFilter")?.value||"";
    const filtered = sorted.filter(r=>
      (!q  || (r.name||"").toLowerCase().includes(q)||(r.desc||"").toLowerCase().includes(q)||(r.email||"").toLowerCase().includes(q)) &&
      (!st || r.status===st)
    );
    document.getElementById("sReqList").innerHTML = filtered.length
      ? filtered.map(reqRow).join("")
      : empty("No matching requests","search");
    initLucide();
    bindReqActions();
  }

  document.getElementById("sReqSearch")?.addEventListener("input", filterReqs);
  document.getElementById("sReqFilter")?.addEventListener("change", filterReqs);
  bindReqActions();
}

function reqRow(r) {
  const stColors = {
    "Submitted":"s-badge--amber","Reviewing":"s-badge--blue",
    "Sourcing":"s-badge--gold","Options Found":"s-badge--emerald","Completed":"s-badge--green"
  };
  const cls = stColors[r.status]||"s-badge--amber";
  const date = r.ts ? new Date(r.ts).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";
  return `
    <div class="s-list-item s-req-row" data-req-ts="${r.ts}">
      <div class="s-list-item__main">
        <strong>${esc(r.name||"Anonymous")}</strong>
        <span class="s-list-item__sub">${esc(r.email||"")} · ${date}</span>
        <span class="s-list-item__sub">${esc(r.desc||"").substring(0,80)}${(r.desc||"").length>80?"…":""}</span>
        <span class="s-list-item__sub">${esc(r.occasion||"")} · ${esc(r.budget||"")}</span>
      </div>
      <div class="s-list-item__actions" style="flex-direction:column;align-items:flex-end;gap:.4rem">
        <span class="s-badge ${cls}">${esc(r.status)}</span>
        <button class="s-btn s-btn--primary s-btn--sm" data-req-manage="${r.ts}">Manage</button>
      </div>
    </div>`;
}

function bindReqActions() {
  dom.content.querySelectorAll("[data-req-manage]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const ts = +btn.dataset.reqManage;
      const all = load(STORAGE.globalRequests,[]);
      const req = all.find(r=>r.ts===ts);
      if (!req) return;
      openReqPanel(req);
    });
  });
}

function openReqPanel(req) {
  const statusOpts = REQ_STATUSES.map(s=>`<option value="${s}"${req.status===s?" selected":""}>${s}</option>`).join("");
  const imgHtml = req.img ? `<img src="${req.img}" alt="Reference" style="width:100%;max-height:180px;object-fit:cover;border-radius:.5rem;margin-bottom:1rem" />` : "";
  const histHtml = (req.statusHistory||[]).map(h=>`
    <div style="font-size:.75rem;color:var(--s-text-dim);padding:.3rem 0;border-bottom:1px solid var(--s-border)">
      <strong>${esc(h.status)}</strong> — ${new Date(h.ts).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
    </div>`).join("");

  openPanel(`Request: ${esc(req.name||"Customer")}`, `
    <div class="s-field-group">
      <div style="background:var(--s-surface);border-radius:.75rem;padding:1rem;margin-bottom:1rem">
        ${imgHtml}
        <p style="font-size:.85rem;margin-bottom:.4rem"><strong>Description:</strong> ${esc(req.desc||"—")}</p>
        <p style="font-size:.85rem;margin-bottom:.4rem"><strong>Occasion:</strong> ${esc(req.occasion||"—")}</p>
        <p style="font-size:.85rem;margin-bottom:.4rem"><strong>Budget:</strong> ${esc(req.budget||"—")}</p>
        <p style="font-size:.85rem"><strong>Customer:</strong> ${esc(req.email||"—")}</p>
      </div>
      <div class="s-field">
        <label class="s-field__label">Update Status</label>
        <select class="s-field__select" id="sPanelReqStatus">${statusOpts}</select>
      </div>
      <div class="s-field">
        <label class="s-field__label">Reply to Customer (appears in their My Conversations)</label>
        <textarea class="s-field__textarea" id="sPanelReqReply" placeholder="Send a message to this customer about their request…" rows="4"></textarea>
      </div>
      <div class="s-field">
        <label class="s-field__label">Generate Status Update Link (for customers on different devices)</label>
        <p style="font-size:.75rem;color:var(--s-text-dim);margin-bottom:.5rem">Copy and send this link via WhatsApp. When customer opens it, their status updates automatically.</p>
        <button class="s-btn s-btn--secondary s-btn--sm" id="sPanelGenLink">Generate Link</button>
        <p class="s-field__hint" id="sPanelLinkOut" style="word-break:break-all;margin-top:.5rem"></p>
      </div>
      ${histHtml ? `<div class="s-field"><label class="s-field__label">Status History</label><div style="border-radius:.5rem;overflow:hidden;border:1px solid var(--s-border)">${histHtml}</div></div>` : ""}
    </div>`, () => {
    /* Save callback */
    const newStatus = document.getElementById("sPanelReqStatus")?.value;
    const reply     = document.getElementById("sPanelReqReply")?.value.trim();
    if (!newStatus) return;

    /* Update global request store */
    const all = load(STORAGE.globalRequests,[]);
    const idx = all.findIndex(r=>r.ts===req.ts);
    if (idx>=0) {
      const now = Date.now();
      all[idx].status    = newStatus;
      all[idx].updatedAt = now;
      if (!all[idx].statusHistory) all[idx].statusHistory = [];
      if (!all[idx].statusHistory.find(h=>h.status===newStatus)) {
        all[idx].statusHistory.push({status:newStatus, ts:now});
      }
      save(STORAGE.globalRequests, all);
    }

    /* Write admin reply + system status update to customer's concierge thread */
    if (req.email) {
      const key  = `abdan-sp-concierge:${req.email.toLowerCase()}`;
      const msgs = JSON.parse(localStorage.getItem(key)||"[]");
      /* System status message */
      msgs.push({
        from: "system",
        text: `Your sourcing request has been updated to: <strong>${newStatus}</strong>.`,
        sentAt: Date.now(), ts: Date.now(),
        category: "Sourcing Request"
      });
      /* Admin reply if provided */
      if (reply) {
        msgs.push({
          from: "abdan",
          text: reply,
          sentAt: Date.now(), ts: Date.now(),
          category: "Sourcing Request"
        });
      }
      localStorage.setItem(key, JSON.stringify(msgs));
    }

    toast(`Status updated to "${newStatus}"`);
    closePanel();
    renderRequests();
  });

  /* Generate link button */
  setTimeout(()=>{
    document.getElementById("sPanelGenLink")?.addEventListener("click",()=>{
      const newStatus = document.getElementById("sPanelReqStatus")?.value||req.status;
      const data = btoa(JSON.stringify({email:req.email,ts:req.ts,status:newStatus,note:document.getElementById("sPanelReqReply")?.value.trim()||""}));
      const link = `${window.location.origin}/?req_update=${data}`;
      document.getElementById("sPanelLinkOut").textContent = link;
      navigator.clipboard?.writeText(link).then(()=>toast("Link copied to clipboard"));
    });
  },100);
}

/* ── Concierge Queue ────────────────────────────────────────── */
function renderConciergeQueue() {
  setTitle("Concierge Queue");
  const profiles = load(STORAGE.customers, {});
  const convs = [];

  /* Gather all customer concierge threads */
  Object.entries(profiles).forEach(([email, profile]) => {
    const key  = `abdan-sp-concierge:${email}`;
    const msgs = JSON.parse(localStorage.getItem(key)||"[]");
    if (!msgs.length) return;
    const customerMsgs = msgs.filter(m=>m.from==="customer");
    const lastMsg      = msgs[msgs.length-1];
    convs.push({
      email,
      name:      profile.displayName || profile.fullName || email,
      phone:     profile.phone || "",
      msgs,
      lastTs:    lastMsg.sentAt || lastMsg.ts || 0,
      total:     msgs.length,
      unread:    customerMsgs.length,
      lastText:  (lastMsg.text||"").substring(0,60),
    });
  });

  /* Also pull from global requests for sourcing context */
  const reqCounts = {};
  load(STORAGE.globalRequests,[]).forEach(r=>{ reqCounts[r.email] = (reqCounts[r.email]||0)+1; });

  convs.sort((a,b)=>b.lastTs-a.lastTs);

  const newConvs  = convs.filter(c=>c.msgs[c.msgs.length-1]?.from==="customer");
  const openConvs = convs.filter(c=>c.msgs[c.msgs.length-1]?.from!=="customer");

  function queueSection(label, items) {
    if (!items.length) return `<p style="font-size:.82rem;color:var(--s-text-dim);padding:.5rem 0">${label}: none</p>`;
    return `
      <p class="s-nav-group__label" style="padding:.5rem 0 .25rem;font-size:.65rem">${label}</p>
      ${items.map(c=>`
        <div class="s-list-item">
          <div class="s-list-item__main">
            <strong>${esc(c.name)}</strong>
            <span class="s-list-item__sub">${esc(c.email)} ${c.phone?`· ${esc(c.phone)}`:""}</span>
            <span class="s-list-item__sub" style="font-style:italic">"${esc(c.lastText)}${c.lastText.length>=60?"…":""}"</span>
          </div>
          <div class="s-list-item__actions" style="flex-direction:column;align-items:flex-end;gap:.4rem">
            <span class="s-badge s-badge--blue">${c.total} msg${c.total!==1?"s":""}</span>
            ${reqCounts[c.email]?`<span class="s-badge s-badge--amber">${reqCounts[c.email]} req</span>`:""}
            <button class="s-btn s-btn--primary s-btn--sm" data-reply-to="${encodeURIComponent(c.email)}">Reply</button>
          </div>
        </div>`).join("")}`;
  }

  dom.content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1rem">
      <div class="s-stat-card">
        <p class="s-stat-card__val">${convs.length}</p>
        <p class="s-stat-card__label">Total Conversations</p>
      </div>
      <div class="s-stat-card">
        <p class="s-stat-card__val">${newConvs.length}</p>
        <p class="s-stat-card__label">Awaiting Reply</p>
      </div>
    </div>
    <div class="s-list">
      ${queueSection("Awaiting Your Reply", newConvs)}
      ${queueSection("Open Conversations", openConvs)}
      ${!convs.length ? empty("No concierge conversations yet","message-circle") : ""}
    </div>`;

  dom.content.querySelectorAll("[data-reply-to]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const email = decodeURIComponent(btn.dataset.replyTo);
      const profile = profiles[email]||{};
      const key  = `abdan-sp-concierge:${email}`;
      const msgs = JSON.parse(localStorage.getItem(key)||"[]");
      openConvPanel(email, profile.displayName||profile.fullName||email, msgs);
    });
  });
}

function openConvPanel(email, name, msgs) {
  const thread = msgs.map(m=>{
    const side = m.from==="abdan"?"right":m.from==="system"?"center":"left";
    const bg   = m.from==="abdan"?"var(--s-surface)":m.from==="system"?"rgba(197,161,59,.08)":"var(--s-bg)";
    const date = new Date(m.sentAt||m.ts||Date.now()).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
    return `<div style="display:flex;justify-content:${side};margin-bottom:.6rem">
      <div style="background:${bg};border-radius:.6rem;padding:.5rem .75rem;max-width:80%;font-size:.8rem">
        <p style="margin:0">${m.text||""}</p>
        <p style="margin:0;font-size:.65rem;color:var(--s-text-dim);margin-top:.2rem">${m.from==="abdan"?"ABDAN":m.from==="system"?"System":"Customer"} · ${date}</p>
      </div>
    </div>`;
  }).join("");

  openPanel(`${esc(name)}`, `
    <div style="max-height:300px;overflow-y:auto;padding:.5rem;background:var(--s-bg);border-radius:.5rem;margin-bottom:1rem;border:1px solid var(--s-border)">${thread||"<p style='font-size:.82rem;color:var(--s-text-dim)'>No messages yet</p>"}</div>
    <div class="s-field"><label class="s-field__label">Reply</label>
      <textarea class="s-field__textarea" id="sPanelConvReply" placeholder="Your response to ${esc(name)}…" rows="4"></textarea>
    </div>
    <div class="s-field"><label class="s-field__label">Category</label>
      <select class="s-field__select" id="sPanelConvCat">
        <option>Styling Advice</option><option>Product Sourcing</option><option>Gift Recommendation</option>
        <option>Fabric Question</option><option>Occasion Help</option><option>Sizing Help</option><option>General</option>
      </select>
    </div>`, ()=>{
    const text = document.getElementById("sPanelConvReply")?.value.trim();
    const cat  = document.getElementById("sPanelConvCat")?.value||"";
    if (!text) return;
    const key  = `abdan-sp-concierge:${email.toLowerCase()}`;
    const curr = JSON.parse(localStorage.getItem(key)||"[]");
    curr.push({from:"abdan", text, sentAt:Date.now(), ts:Date.now(), category:cat});
    localStorage.setItem(key, JSON.stringify(curr));
    toast(`Reply sent to ${name}`);
    closePanel();
    renderConciergeQueue();
  });
}

/* S90 — Operations Dashboard: 7-section admin intelligence */

function renderOperations() {
  setTitle("Operations Dashboard");

  /* ── Collect all data ───────────────────────────────────────── */
  const profiles    = load(STORAGE.customers, {});
  const profileArr  = Object.values(profiles);
  const requests    = load(STORAGE.globalRequests, []);
  const orders      = load(STORAGE.orders, []);
  const now         = Date.now();
  const today       = new Date(); today.setHours(0,0,0,0);
  const todayTs     = today.getTime();
  const monthStart  = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;

  /* Per-customer stats */
  const customerStats = profileArr.map(p => {
    const email    = (p.email||"").toLowerCase();
    const pts      = (() => { try { return JSON.parse(localStorage.getItem(`abdan-sp-loyalty:${email}`))||0; } catch { return 0; } })();
    const msgs     = (() => { try { return JSON.parse(localStorage.getItem(`abdan-sp-concierge:${email}`))||[]; } catch { return []; } })();
    const custMsgs = msgs.filter(m=>m.from==="customer");
    const lastMsg  = msgs[msgs.length-1]||null;
    const hasBio   = !!localStorage.getItem(`abdan-sp-bio:${email}`);
    const hasStyle = !!localStorage.getItem(`abdan-sp-style:${email}`);
    const hasPhoto = !!localStorage.getItem(`abdan-sp-photo:${email}`);
    const custReqs = requests.filter(r=>(r.email||"").toLowerCase()===email);
    return {
      name:       p.displayName||p.fullName||email,
      email,
      pts,
      msgs,
      custMsgs,
      lastMsg,
      hasBio, hasStyle, hasPhoto,
      reqs:       custReqs.length,
      profileComplete: hasBio && hasStyle && hasPhoto,
      awaitingReply:  lastMsg && lastMsg.from==="customer",
      lastTs:     lastMsg ? (lastMsg.sentAt||lastMsg.ts||0) : 0,
    };
  });

  /* Section 1 stats */
  const totalCustomers      = profileArr.length;
  const activeCustomers     = customerStats.filter(c => c.msgs.length>0||c.reqs>0).length;
  const devotedCollectors   = customerStats.filter(c => c.pts>=50).length;
  const innerCircleEligible = customerStats.filter(c => c.pts>=150).length;
  const openRequests        = requests.filter(r=>r.status!=="Completed").length;
  const completedRequests   = requests.filter(r=>r.status==="Completed").length;
  const openConversations   = customerStats.filter(c=>c.msgs.length>0).length;
  const pendingReplies      = customerStats.filter(c=>c.awaitingReply).length;

  /* Section 2 — Request pipeline */
  const pipeline = {};
  ["Submitted","Reviewing","Sourcing","Options Found","Completed"].forEach(s=>{
    pipeline[s] = requests.filter(r=>r.status===s).length;
  });

  /* Section 3 — Concierge */
  let convsToday=0, newConvs=0, totalResTime=0, resCnt=0;
  customerStats.forEach(c => {
    if (c.msgs.some(m=>(m.sentAt||m.ts||0)>=todayTs)) convsToday++;
    const hasAbdanReply = c.msgs.some(m=>m.from==="abdan");
    if (c.custMsgs.length>0 && !hasAbdanReply) newConvs++;
    for (let i=0;i<c.msgs.length-1;i++) {
      if (c.msgs[i].from==="customer"&&c.msgs[i+1].from==="abdan") {
        totalResTime += (c.msgs[i+1].sentAt||0)-(c.msgs[i].sentAt||0);
        resCnt++;
      }
    }
  });
  const avgResHrs = resCnt>0 ? (totalResTime/resCnt/3600000).toFixed(1) : null;

  /* Section 5 — Category insights */
  const catMap = {};
  const catKeywords = [
    ["Saree",    ["saree","sari","banarasi","kanjivaram","silk saree"]],
    ["Salwar",   ["salwar","kurta","kurti","palazzo"]],
    ["Abaya",    ["abaya"]],
    ["Dupatta",  ["dupatta","stole","scarf"]],
    ["Wedding",  ["wedding","bridal","nikah","marriage"]],
    ["Festival", ["festival","festive","eid","diwali","puja","navratri"]],
    ["Custom",   ["custom","bespoke","similar","source","find","looking for"]],
  ];
  requests.forEach(r=>{
    const occ = r.occasion||"";
    catMap[occ] = (catMap[occ]||0)+1;
    const desc = (r.desc||"").toLowerCase();
    catKeywords.forEach(([label,terms])=>{
      if (terms.some(t=>desc.includes(t))) catMap[label]=(catMap[label]||0)+1;
    });
  });
  const sortedCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,8);

  /* Section 6 — Loyalty */
  const totalPts = customerStats.reduce((s,c)=>s+c.pts,0);
  const topCollectors = [...customerStats].sort((a,b)=>b.pts-a.pts).filter(c=>c.pts>0).slice(0,5);
  const closestToIC   = [...customerStats].filter(c=>c.pts>=50&&c.pts<150).sort((a,b)=>b.pts-a.pts).slice(0,5);
  const newThisMonth  = profileArr.filter(p=>p.createdAt&&new Date(p.createdAt)>=monthStart).length;

  /* Section 7 — Alerts */
  const staleRequests = requests.filter(r=>r.status!=="Completed"&&(r.updatedAt||r.ts)<threeDaysAgo);
  const unanswered    = customerStats.filter(c=>c.awaitingReply).sort((a,b)=>a.lastTs-b.lastTs);
  const incomplete    = customerStats.filter(c=>!c.profileComplete&&c.msgs.length>0);

  /* ── Render ─────────────────────────────────────────────────── */
  function stat(label, value, sub="", mod="") {
    return `<div class="s-stat ${mod}"><p class="s-stat__label">${label}</p><p class="s-stat__value">${value}</p>${sub?`<p class="s-stat__sub">${sub}</p>`:""}</div>`;
  }
  function pipeBar(label, count, total) {
    const pct = total>0?Math.round((count/total)*100):0;
    const cls  = {Submitted:"s-badge--amber",Reviewing:"s-badge--blue",Sourcing:"s-badge--gold","Options Found":"s-badge--emerald",Completed:"s-badge--green"}[label]||"";
    return `<div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.6rem">
      <span style="width:110px;font-size:.78rem;color:var(--s-text)">${label}</span>
      <div style="flex:1;height:8px;background:var(--s-border);border-radius:99px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:var(--s-emerald);border-radius:99px;transition:width .4s"></div>
      </div>
      <span class="s-badge ${cls}" style="min-width:28px;text-align:center">${count}</span>
    </div>`;
  }
  function topList(items, valueFn, labelFn) {
    if (!items.length) return `<p style="font-size:.8rem;color:var(--s-text-dim);padding:.5rem 0">No data yet.</p>`;
    return items.map((c,i)=>`
      <div style="display:flex;align-items:center;gap:.6rem;padding:.45rem 0;border-bottom:1px solid var(--s-border)">
        <span style="font-size:.7rem;color:var(--s-text-dim);min-width:16px">${i+1}</span>
        <span style="flex:1;font-size:.82rem;color:var(--s-text)">${esc(labelFn(c))}</span>
        <span style="font-size:.82rem;font-weight:600;color:var(--s-gold)">${valueFn(c)}</span>
      </div>`).join("");
  }
  function alertRow(icon, text, count, cls="s-alert--info") {
    return count>0?`<div class="s-alert ${cls}" style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
      <i data-lucide="${icon}" class="s-icon"></i>
      <span style="flex:1;font-size:.82rem">${text}</span>
      <span class="s-badge s-badge--red">${count}</span>
    </div>`:"";
  }
  function section(title, content) {
    return `<div class="s-card" style="background:var(--s-raised);border:1px solid var(--s-border);border-radius:var(--s-r-lg);padding:1.25rem 1.5rem;margin-bottom:1.25rem">
      <h3 style="font-size:.68rem;text-transform:uppercase;letter-spacing:.12em;color:var(--s-text-dim);font-weight:700;margin:0 0 1rem">${title}</h3>
      ${content}
    </div>`;
  }

  const totalReqs = requests.length;
  dom.content.innerHTML = `
    <div style="max-width:860px">

      ${section("Executive Overview", `
        <div class="s-stats-row">
          ${stat("Total Customers", totalCustomers, `${activeCustomers} active`)}
          ${stat("Devoted Collectors", devotedCollectors, "50+ points", "s-stat--gold")}
          ${stat("Inner Circle Eligible", innerCircleEligible, "150+ points", "s-stat--emerald")}
          ${stat("Open Requests", openRequests, `${completedRequests} completed`)}
          ${stat("Open Conversations", openConversations, "")}
          ${stat("Pending Replies", pendingReplies, "awaiting ABDAN", pendingReplies>0?"s-stat--gold":"")}
        </div>
      `)}

      ${section("Request Pipeline", `
        <div style="margin-bottom:.5rem">
          ${Object.entries(pipeline).map(([s,c])=>pipeBar(s,c,totalReqs||1)).join("")}
        </div>
        <p style="font-size:.72rem;color:var(--s-text-dim)">${totalReqs} total request${totalReqs!==1?"s":""}</p>
      `)}

      ${section("Concierge", `
        <div class="s-stats-row">
          ${stat("New Conversations", newConvs, "no ABDAN reply yet", newConvs>0?"s-stat--gold":"")}
          ${stat("Pending Replies", pendingReplies, "customer waiting")}
          ${stat("Conversations Today", convsToday, "")}
          ${stat("Avg Response Time", avgResHrs?`${avgResHrs}h`:"—", resCnt>0?`from ${resCnt} exchanges`:"no exchanges yet")}
        </div>
      `)}

      ${section("Customer Intelligence", `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.5rem">Highest Devotion Points</p>
            ${topList(topCollectors, c=>`${c.pts} pts`, c=>c.name)}
          </div>
          <div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.5rem">Most Requests Submitted</p>
            ${topList(customerStats.filter(c=>c.reqs>0).sort((a,b)=>b.reqs-a.reqs).slice(0,5), c=>`${c.reqs} req${c.reqs!==1?"s":""}`, c=>c.name)}
          </div>
          <div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.5rem">Most Conversations Started</p>
            ${topList(customerStats.filter(c=>c.custMsgs.length>0).sort((a,b)=>b.custMsgs.length-a.custMsgs.length).slice(0,5), c=>`${c.custMsgs.length} msg${c.custMsgs.length!==1?"s":""}`, c=>c.name)}
          </div>
          <div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.5rem">Top Active Customers</p>
            ${topList(customerStats.filter(c=>c.msgs.length>0||c.reqs>0).sort((a,b)=>(b.msgs.length+b.reqs*3)-(a.msgs.length+a.reqs*3)).slice(0,5), c=>`${c.msgs.length+c.reqs} act`, c=>c.name)}
          </div>
        </div>
      `)}

      ${section("Request Categories", sortedCats.length?`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.65rem">
          ${sortedCats.map(([cat,cnt])=>`
            <div style="background:var(--s-surface);border:1px solid var(--s-border);border-radius:var(--s-r-sm);padding:.7rem .9rem">
              <p style="font-size:.72rem;color:var(--s-text-dim);margin-bottom:.2rem">${esc(cat)}</p>
              <p style="font-size:1.4rem;font-weight:700;color:var(--s-text);line-height:1">${cnt}</p>
            </div>`).join("")}
        </div>`:`<p style="font-size:.8rem;color:var(--s-text-dim)">No requests submitted yet.</p>`)}

      ${section("Loyalty Dashboard", `
        <div class="s-stats-row" style="margin-bottom:1rem">
          ${stat("Total Points Issued", totalPts.toLocaleString(), "across all members", "s-stat--gold")}
          ${stat("New Members This Month", newThisMonth, "")}
          ${stat("Closest To Inner Circle", closestToIC.length, `${closestToIC[0]?`${closestToIC[0].name} (${closestToIC[0].pts} pts)`:"—"}`)}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.5rem">Top Collectors</p>
            ${topList(topCollectors, c=>`${c.pts} pts`, c=>c.name)}
          </div>
          <div>
            <p style="font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.5rem">Closest To Inner Circle</p>
            ${topList(closestToIC, c=>`${150-c.pts} to go`, c=>c.name)}
          </div>
        </div>
      `)}

      ${section("Operational Alerts", `
        ${alertRow("clock",    `${staleRequests.length} request${staleRequests.length!==1?"s":""} waiting more than 3 days without update`,   staleRequests.length, "s-alert--error")}
        ${alertRow("message-circle", `${unanswered.length} unanswered conversation${unanswered.length!==1?"s":""}`, unanswered.length, "s-alert--info")}
        ${alertRow("user-x",  `${incomplete.length} active customer${incomplete.length!==1?"s":""} with incomplete profiles`, incomplete.length, "s-alert--info")}
        ${!staleRequests.length && !unanswered.length && !incomplete.length
          ? `<div class="s-alert s-alert--ok" style="display:flex;align-items:center;gap:.6rem"><i data-lucide="check-circle" class="s-icon"></i><span style="font-size:.82rem">All clear — no operational issues detected.</span></div>`
          : ""}
        ${unanswered.length?`
          <div style="margin-top:.75rem">
            <p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--s-text-dim);margin-bottom:.4rem">Unanswered — oldest first</p>
            ${unanswered.slice(0,5).map(c=>`
              <div style="display:flex;align-items:center;gap:.6rem;padding:.4rem 0;border-bottom:1px solid var(--s-border)">
                <span style="flex:1;font-size:.82rem">${esc(c.name)}</span>
                <span style="font-size:.72rem;color:var(--s-text-dim)">${c.lastTs?new Date(c.lastTs).toLocaleDateString("en-IN",{day:"numeric",month:"short"}):"—"}</span>
                <button class="s-btn s-btn--primary s-btn--sm" data-nav="concierge">Reply</button>
              </div>`).join("")}
          </div>`:""
        }
      `)}

    </div>`;

  initLucide();
  /* Wire alert reply buttons */
  dom.content.querySelectorAll("[data-nav='concierge']").forEach(btn=>{
    btn.addEventListener("click",()=>{ currentView="concierge"; renderConciergeQueue(); });
  });
}
