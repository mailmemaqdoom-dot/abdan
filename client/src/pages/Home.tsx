import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Copy,
  Facebook,
  Heart,
  Info,
  Instagram,
  Link2,
  MessageCircle,
  Minus,
  Moon,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sun,
  Trash2,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ACCOUNT_FEATURES,
  BRAND,
  FAQS,
  FILTERS,
  PRODUCTS,
  SIZES,
  STORY_CARDS,
  TEASERS,
  TERMS,
  TESTIMONIALS,
  TRUST_BAR_ITEMS,
} from "@/data/abdan";
import { useTheme } from "@/contexts/ThemeContext";
import { useAbdanStore } from "@/hooks/use-abdan-store";
import {
  buildWhatsAppUrl,
  confirmStorefrontPayment,
  createStorefrontCheckout,
  openRazorpayCheckout,
  type CheckoutCustomerInput,
  type CheckoutItemInput,
  type CheckoutSession,
} from "@/lib/payment";

/**
 * File design reminder:
 * ABDAN now follows editorial heirloom minimalism elevated into quiet luxury mobile commerce.
 * Preserve exact section names, calm trust, feminine restraint, app-like flow, and premium readability.
 * Every surface should feel more like a refined fashion app than a generic storefront.
 */

type NavItem = {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  external?: string;
};

const navItems: NavItem[] = [
  { id: "products", label: "Handpicked for You", shortLabel: "For You", icon: ShoppingBag },
  { id: "wsy", label: "Her Story", shortLabel: "Story", icon: Heart },
  { id: "testi", label: "Her Circle 💛", shortLabel: "Circle", icon: Users },
  { id: "teasers", label: "What You Might Love", shortLabel: "Love", icon: Sparkles },
  { id: "account", label: "Your Space 💛", shortLabel: "Space", icon: User },
];

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  mail: Send,
};

function formatShareText(name: string, primaryTag: string) {
  return `I found ${name} on ABDAN. ${primaryTag}. ${BRAND.tagline}`;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const {
    activeFilter,
    setActiveFilter,
    filteredProducts,
    cart,
    totals,
    isCartOpen,
    setCartOpen,
    selectedProduct,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    isProductOpen,
    openProduct,
    closeProduct,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isPaymentVisible,
    setPaymentVisible,
    activeTeaser,
    setActiveTeaser,
  } = useAbdanStore();

  const [activeSection, setActiveSection] = useState("products");
  const [isPaying, setPaying] = useState(false);
  const [isBagCheckoutVisible, setBagCheckoutVisible] = useState(false);
  const [checkoutCustomer, setCheckoutCustomer] = useState<CheckoutCustomerInput>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    if (!activeTeaser) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeTeaser]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.65],
        rootMargin: "-20% 0px -35% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const currentUrl = typeof window === "undefined" ? BRAND.whatsappUrl : window.location.href;

  const selectedColors = useMemo(() => {
    if (!selectedProduct) return [] as string[];
    return selectedProduct.color
      .split(/\band\b|,/i)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [selectedProduct]);

  const activeTeaserItem = useMemo(
    () => TEASERS.find((item) => item.id === activeTeaser) ?? null,
    [activeTeaser],
  );

  const productCheckoutMessage = selectedProduct
    ? `${selectedProduct.name}\nSize: ${selectedSize}\nColour: ${selectedColor}\nAmount: ${selectedProduct.priceLabel}`
    : "";

  const cartPreviewText = totals.itemCount
    ? `${totals.itemCount} piece${totals.itemCount > 1 ? "s" : ""} held with care.`
    : "Your first choice will appear here.";

  const bagCheckoutMessage = cart.length
    ? cart
        .map(
          (item) =>
            `${item.name}\nSize: ${item.size}\nColour: ${item.color}\nQuantity: ${item.quantity}\nAmount: ${item.priceLabel}`,
        )
        .join("\n\n")
    : "";

  const productCheckoutItems = useMemo<CheckoutItemInput[]>(() => {
    if (!selectedProduct) return [];
    return [
      {
        productId: selectedProduct.id,
        name: selectedProduct.name,
        priceLabel: selectedProduct.priceLabel,
        size: selectedSize,
        color: selectedColor,
        quantity: 1,
        image: selectedProduct.image,
      },
    ];
  }, [selectedColor, selectedProduct, selectedSize]);

  const bagCheckoutItems = useMemo<CheckoutItemInput[]>(() => {
    return cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      priceLabel: item.priceLabel,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image: item.image,
    }));
  }, [cart]);

  async function handleAddToCart() {
    const result = addToCart();
    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    setBagCheckoutVisible(false);
    toast.success(result.message);
    closeProduct();
    setCartOpen(true);
  }

  function updateCheckoutCustomer<Field extends keyof CheckoutCustomerInput>(
    field: Field,
    value: CheckoutCustomerInput[Field],
  ) {
    setCheckoutCustomer((current) => ({ ...current, [field]: value }));
  }

  function validateCheckoutCustomer() {
    if (!checkoutCustomer.name.trim()) {
      toast.error("Please add your name before checkout.");
      return false;
    }

    if (!checkoutCustomer.phone.trim()) {
      toast.error("Please add your phone number so ABDAN can confirm your order.");
      return false;
    }

    return true;
  }

  function getCheckoutDraft(source: "product" | "bag") {
    const items = source === "bag" ? bagCheckoutItems : productCheckoutItems;
    const total = source === "bag"
      ? totals.total
      : Number(selectedProduct?.priceLabel.replace(/[^\d]/g, "") || 0);

    return { items, total };
  }

  function buildCheckoutSupportMessage(
    session: CheckoutSession,
    source: "product" | "bag",
    paymentLine: string,
  ) {
    const itemSummary = source === "bag" ? bagCheckoutMessage : productCheckoutMessage;
    return `Hello, I would like to confirm my ABDAN order.\n\nOrder Number: ${session.orderNumber}\nCustomer: ${session.customer.name}\nPhone: ${session.customer.phone}\nAmount: ${session.formattedTotal}\nPayment: ${paymentLine}\n\n${itemSummary}`;
  }

  async function createCheckoutSession(source: "product" | "bag", paymentMode: "razorpay" | "upi") {
    if (!validateCheckoutCustomer()) return null;

    const { items, total } = getCheckoutDraft(source);
    if (!items.length || total <= 0) {
      toast.error("Please choose a valid piece before checkout.");
      return null;
    }

    return await createStorefrontCheckout({
      source,
      customer: checkoutCustomer,
      payment: {
        provider: paymentMode === "razorpay" ? "razorpay" : "upi",
        method: paymentMode,
      },
      items,
      totals: {
        subtotal: total,
        total,
        currency: "INR",
      },
    });
  }

  async function handleRazorpayPayment(source: "product" | "bag") {
    setPaying(true);

    try {
      const session = await createCheckoutSession(source, "razorpay");
      if (!session) return;

      const result = await openRazorpayCheckout(session.total);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      await confirmStorefrontPayment({
        orderId: session.orderId,
        provider: "razorpay",
        method: "razorpay",
        providerPaymentId: result.paymentId,
        metadata: {
          source,
          orderNumber: session.orderNumber,
        },
      });

      window.open(
        buildWhatsAppUrl(
          buildCheckoutSupportMessage(session, source, `Razorpay · ${result.paymentId}`),
        ),
        "_blank",
        "noopener,noreferrer",
      );

      if (source === "bag") {
        clearCart();
        setBagCheckoutVisible(false);
        setCartOpen(false);
      } else {
        setPaymentVisible(false);
        closeProduct();
      }

      toast.success(`Payment received for ${session.orderNumber}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Secure payment could not be completed right now.");
    } finally {
      setPaying(false);
    }
  }

  async function handleUpiConfirmation(source: "product" | "bag") {
    setPaying(true);

    try {
      const session = await createCheckoutSession(source, "upi");
      if (!session) return;

      window.open(
        buildWhatsAppUrl(
          buildCheckoutSupportMessage(session, source, "UPI manual review"),
        ),
        "_blank",
        "noopener,noreferrer",
      );

      if (source === "bag") {
        clearCart();
        setBagCheckoutVisible(false);
        setCartOpen(false);
      } else {
        setPaymentVisible(false);
        closeProduct();
      }

      toast.success(`Order ${session.orderNumber} is ready for payment verification.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "UPI confirmation could not be prepared right now.");
    } finally {
      setPaying(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied.");
    } catch {
      toast.error("We could not copy the link right now.");
    }
  }

  async function handleCopyUpi() {
    try {
      await navigator.clipboard.writeText(BRAND.upiId);
      toast.success("UPI ID copied.");
    } catch {
      toast.error("We could not copy the UPI ID right now.");
    }
  }

  function handleBagOpen() {
    closeProduct();
    setBagCheckoutVisible(false);
    setCartOpen(true);
  }

  function handleCartCheckout() {
    if (!cart.length) {
      toast.error("Your bag is empty. Choose a piece first.");
      return;
    }

    setBagCheckoutVisible((current) => !current);
    toast.success(isBagCheckoutVisible ? "Bag checkout hidden." : "Checkout ready in your bag.");
  }

  function goToSection(item: NavItem) {
    if (item.external) {
      window.open(item.external, "_blank", "noopener,noreferrer");
      return;
    }

    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="abdan-premium-shell">
      <div className="abdan-noise" aria-hidden="true" />
      <div className="abdan-vignette" aria-hidden="true" />

      <header className="app-header">
        <div className="header-chip brand-chip">
          <img src={BRAND.logoSecondary} alt="ABDAN mark" className="header-logo" />
          <div>
            <span className="micro-label">ABDAN</span>
            <p>{BRAND.tagline}</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-orb" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="icon-orb bag-orb" onClick={handleBagOpen} aria-label="Open bag">
            <ShoppingCart size={18} />
            <span className="bag-count">{totals.itemCount}</span>
          </button>
        </div>
      </header>

      <a className="support-pill" href={BRAND.whatsappUrl} target="_blank" rel="noreferrer">
        <span>Talk to us — we’re here for you</span>
        <div className="support-icon">
          <MessageCircle size={18} />
        </div>
      </a>

      <nav className="bottom-dock" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.external ? false : activeSection === item.id;

          return (
            <button
              key={item.label}
              type="button"
              className={`dock-link ${isActive ? "is-active" : ""}`}
              onClick={() => goToSection(item)}
              aria-label={item.label}
            >
              <Icon size={17} />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      <main className="luxury-main">
        <section id="hero" className="hero-lounge section-frame">
          <div className="container hero-layout">
            <div className="hero-copy-panel editorial-panel">
              <div className="eyebrow-row">
                <span className="eyebrow-mark">Curated modest fashion</span>
                <span className="eyebrow-mark">Tamil Nadu to your doorstep</span>
              </div>

              <p className="eyebrow-label">{BRAND.tagline}</p>
              <h1>
                A calmer way to feel
                <em>beautiful, seen,</em>
                and fully yourself.
              </h1>
              <p className="hero-body">
                ABDAN is an emotional modest-fashion experience for women who carry devotion with
                grace. Every piece is chosen with softness, clarity, and the confidence of guided
                care from discovery to delivery.
              </p>

              <div className="hero-actions">
                <button className="luxury-primary" onClick={() => goToSection(navItems[0])}>
                  Enter the collection <ArrowRight size={16} />
                </button>
                <a
                  href={`${BRAND.whatsappUrl}?text=Hi%20ABDAN,%20I%E2%80%99d%20love%20help%20finding%20something%20beautiful%20for%20me.`}
                  target="_blank"
                  rel="noreferrer"
                  className="luxury-secondary"
                >
                  Personal styling on WhatsApp
                </a>
              </div>

              <div className="hero-signals">
                <article>
                  <strong>Verified curation</strong>
                  <span>Every listed piece is reviewed before it reaches you.</span>
                </article>
                <article>
                  <strong>Pay with confidence</strong>
                  <span>Availability is confirmed before payment and support stays with you.</span>
                </article>
              </div>
            </div>

            <div className="hero-visual-stack">
              <figure className="hero-portrait-card">
                <img src={BRAND.heroImage} alt="ABDAN premium editorial styling" className="hero-portrait" />
                <figcaption>
                  <span className="micro-label">Editorial selection</span>
                  <p>For the woman whose devotion deserves elegance of its own.</p>
                </figcaption>
              </figure>

              <div className="hero-note-card editorial-panel soft-cream">
                <span className="micro-label">Why it feels different</span>
                <p>
                  Less marketplace noise. More intimate selection, visible trust, and a product
                  journey that feels held from the first scroll to the final confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="trust-marquee" aria-label="ABDAN trust signals">
          {TRUST_BAR_ITEMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <section id="belief" className="belief-band section-frame-tight">
          <div className="container belief-card">
            <p className="micro-label">The ABDAN promise</p>
            <blockquote>
              The most beautiful thing a woman can wear is the feeling that someone thought of her,
              curated for her, and celebrated her.
            </blockquote>
          </div>
        </section>

        <section id="products" className="section-frame">
          <div className="container section-shell">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow-label">Three moments, chosen for you</p>
                <h2>Handpicked for You</h2>
              </div>
              <p className="section-essay">
                Discover a slower, more luxurious browse designed for mobile — less clutter, richer
                context, and space to feel each piece before you choose it.
              </p>
            </div>

            <div className="trust-editorial-card">
              <Info size={18} />
              <p>
                ABDAN is a curated aggregator. We verify products, confirm availability before you
                pay, and remain available until delivery. Calm clarity comes first.
              </p>
            </div>

            <div className="filter-belt" role="tablist" aria-label="Collections">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`filter-pill ${activeFilter === filter ? "is-active" : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  <span>{filter === "All" ? "All Collections" : filter}</span>
                </button>
              ))}
            </div>

            <div className="product-lattice">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="product-editorial-card"
                  onClick={() => openProduct(product)}
                >
                  <div className="product-visual-shell">
                    <img src={product.image} alt={product.name} className="product-photo" loading="lazy" />
                    <div className="product-floating-meta">
                      <span>{product.secondaryTags.occasion}</span>
                      <span>{product.secondaryTags.emotion}</span>
                    </div>
                  </div>

                  <div className="product-copy-shell">
                    <div className="product-copy-topline">
                      <span className="product-tag">{product.primaryTag}</span>
                      <span className="product-style">{product.secondaryTags.style}</span>
                    </div>

                    <div>
                      <h3>{product.name}</h3>
                      <p className="product-blurb">{product.description}</p>
                    </div>

                    <div className="product-card-footer">
                      <div>
                        <strong>{product.priceLabel}</strong>
                        <span>{product.color}</span>
                      </div>
                      <button className="quick-view-button" type="button">
                        Quick preview <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="wsy" className="section-frame muted-section">
          <div className="container section-shell">
            <div className="section-heading-row compact">
              <div>
                <p className="eyebrow-label">An intimate editorial pause</p>
                <h2>Her Story</h2>
              </div>
            </div>

            <div className="story-ribbon">
              {STORY_CARDS.map((story, index) => (
                <article key={story.title} className={`story-editorial-card tone-${(index % 3) + 1}`}>
                  <span className="story-symbol">{story.emoji}</span>
                  <h3>{story.title}</h3>
                  <p>{story.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="testi" className="section-frame">
          <div className="container section-shell">
            <div className="section-heading-row compact">
              <div>
                <p className="eyebrow-label">Community voice</p>
                <h2>Her Circle 💛</h2>
              </div>
              <p className="section-essay short">
                Trust grows when women feel seen, helped, and emotionally safe through the entire
                journey.
              </p>
            </div>

            <div className="testimonial-rack">
              {TESTIMONIALS.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className={`testimonial-editorial-card ${testimonial.featured ? "is-featured" : ""}`}
                >
                  <p>{testimonial.quote}</p>
                  <footer>
                    <span className="avatar-disc">{testimonial.initial}</span>
                    <div>
                      <strong>{testimonial.name}</strong>
                      <span>{testimonial.location}</span>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="teasers" className="section-frame muted-section">
          <div className="container section-shell">
            <div className="section-heading-row compact">
              <div>
                <p className="eyebrow-label">A glimpse of what comes next</p>
                <h2>What You Might Love</h2>
              </div>
            </div>

            <div className="teaser-lux-grid">
              {TEASERS.map((teaser) => (
                <article key={teaser.id} className="teaser-lux-card" onClick={() => setActiveTeaser(teaser.id)}>
                  <span className="teaser-symbol">{teaser.emoji}</span>
                  <h3>{teaser.title}</h3>
                  <p>{teaser.body}</p>
                  <span className="teaser-link">
                    {teaser.cta} <ArrowRight size={14} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="account" className="section-frame">
          <div className="container section-shell account-shell">
            <div className="account-narrative editorial-panel">
              <p className="eyebrow-label">Your remembered world</p>
              <h2>Your Space 💛</h2>
              <p>
                Your favourites, your past choices, your saved preferences, and your moments of
                celebration — all kept in a more personal rhythm. Account creation remains optional,
                because elegance should never add pressure.
              </p>
              <a
                href={`${BRAND.whatsappUrl}?text=Hi%20ABDAN,%20I%E2%80%99d%20like%20to%20create%20my%20personal%20space.`}
                target="_blank"
                rel="noreferrer"
                className="luxury-primary"
              >
                Create My Space <ArrowRight size={16} />
              </a>
            </div>

            <div className="account-feature-matrix">
              {ACCOUNT_FEATURES.map((feature) => {
                const Icon = iconMap[feature.icon];
                return (
                  <article key={feature.title} className="account-feature-card">
                    <span className="feature-icon-shell">
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="luxury-footer">
        <div className="container footer-shell">
          <div className="footer-brand-panel">
            <img src={BRAND.logoPrimary} alt="ABDAN logo" className="footer-logo" />
            <p className="eyebrow-label">{BRAND.tagline}</p>
            <h2>Quiet luxury for women who give so much of themselves.</h2>
            <p>
              Curated with warmth, editorial restraint, and steady support for the woman who
              deserves to feel chosen with grace.
            </p>
            <div className="footer-social-row">
              <a href={BRAND.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href={BRAND.telegramUrl} target="_blank" rel="noreferrer" aria-label="Telegram">
                <Send size={18} />
              </a>
              <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={BRAND.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="footer-accordion-stack">
            <details className="footer-fold" open>
              <summary>
                Explore <ChevronDown size={16} />
              </summary>
              <div className="footer-fold-body footer-link-list">
                <button onClick={() => goToSection(navItems[0])}>Handpicked for You</button>
                <button onClick={() => goToSection(navItems[1])}>Her Story</button>
                <button onClick={() => goToSection(navItems[2])}>Her Circle 💛</button>
                <button onClick={() => goToSection(navItems[3])}>What You Might Love</button>
                <button onClick={() => goToSection(navItems[4])}>Your Space 💛</button>
              </div>
            </details>

            <details className="footer-fold">
              <summary>
                Common Questions <ChevronDown size={16} />
              </summary>
              <div className="footer-fold-body faq-stack">
                {FAQS.map(([question, answer]) => (
                  <article key={question}>
                    <strong>{question}</strong>
                    <p>{answer}</p>
                  </article>
                ))}
              </div>
            </details>

            <details className="footer-fold">
              <summary>
                Our Promises (T&C) <ChevronDown size={16} />
              </summary>
              <div className="footer-fold-body faq-stack terms-stack">
                {TERMS.map(([heading, body]) => (
                  <article key={heading}>
                    <strong>{heading}</strong>
                    <p>{body}</p>
                  </article>
                ))}
              </div>
            </details>
          </div>
        </div>

        <div className="container footer-legal-bar">
          <p>
            <strong>Aggregator Disclaimer:</strong> ABDAN curates and connects you with trusted
            artisan and vendor partners. We verify availability before payment and stay with you
            until delivery.
          </p>
          <p>© 2026 ABDAN. {BRAND.tagline}. Handcrafted with love in Tamil Nadu.</p>
        </div>
      </footer>

      <Drawer open={isCartOpen} onOpenChange={setCartOpen} shouldScaleBackground={false}>
        <DrawerContent className="bag-drawer-shell">
          <DrawerHeader className="bag-drawer-header">
            <div>
              <DrawerTitle className="bag-title">Your Bag</DrawerTitle>
              <DrawerDescription className="bag-description">{cartPreviewText}</DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="bag-body">
            {cart.length ? (
              cart.map((item, index) => (
                <article key={`${item.productId}-${item.size}-${item.color}`} className="bag-item">
                  <img src={item.image} alt={item.name} className="bag-item-image" />
                  <div className="bag-item-copy">
                    <div className="bag-item-headline">
                      <div>
                        <h3>{item.name}</h3>
                        <p>
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <strong>{item.priceLabel}</strong>
                    </div>

                    <div className="bag-item-actions">
                      <div className="quantity-cluster">
                        <button onClick={() => updateQuantity(index, -1)} aria-label="Reduce quantity">
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)} aria-label="Increase quantity">
                          <Plus size={14} />
                        </button>
                      </div>

                      <button className="remove-chip" onClick={() => removeFromCart(index)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-bag-state">
                <ShoppingBag size={20} />
                <p>Your first carefully chosen piece will appear here.</p>
              </div>
            )}
          </div>

          <DrawerFooter className="bag-drawer-footer">
            <div className="bag-summary-card">
              <div>
                <span>Estimated total</span>
                <strong>{totals.formattedTotal}</strong>
              </div>
              <p>Final amount is confirmed before payment. No hidden charges.</p>
            </div>
            <button className="luxury-primary full-width" onClick={handleCartCheckout}>
              {isBagCheckoutVisible ? "Hide checkout" : "Continue to checkout"} <ArrowRight size={16} />
            </button>

            {isBagCheckoutVisible ? (
              <div className="payment-suite bag-payment-suite">
                <div className="payment-block">
                  <div className="payment-block-header">
                    <div>
                      <p className="micro-label">Secure checkout</p>
                      <h3>Complete your devotion</h3>
                    </div>
                    <ShieldCheck size={18} />
                  </div>

                  <div className="checkout-contact-card">
                    <div className="checkout-contact-grid">
                      <label>
                        <span>Your name</span>
                        <input
                          value={checkoutCustomer.name ?? ""}
                          onChange={(event) => updateCheckoutCustomer("name", event.target.value)}
                          placeholder="Enter your name"
                        />
                      </label>
                      <label>
                        <span>Phone number</span>
                        <input
                          value={checkoutCustomer.phone ?? ""}
                          onChange={(event) => updateCheckoutCustomer("phone", event.target.value)}
                          placeholder="Enter your phone number"
                          inputMode="tel"
                        />
                      </label>
                      <label>
                        <span>Email address</span>
                        <input
                          value={checkoutCustomer.email ?? ""}
                          onChange={(event) => updateCheckoutCustomer("email", event.target.value)}
                          placeholder="Optional email"
                          inputMode="email"
                        />
                      </label>
                      <label>
                        <span>Order note</span>
                        <textarea
                          value={checkoutCustomer.notes ?? ""}
                          onChange={(event) => updateCheckoutCustomer("notes", event.target.value)}
                          placeholder="Optional delivery or confirmation note"
                          rows={3}
                        />
                      </label>
                    </div>
                  </div>

                  <button className="luxury-primary full-width" onClick={() => handleRazorpayPayment("bag")} disabled={isPaying}>
                    {isPaying ? "Opening secure payment..." : `Pay ${totals.formattedTotal} securely`}
                  </button>

                  <div className="payment-divider">or pay via UPI</div>

                  <div className="qr-card">
                    <img src={BRAND.qrImage} alt="UPI QR Code" className="qr-image" />
                    <p>Scan and pay securely through your preferred UPI app.</p>
                  </div>

                  <div className="upi-grid">
                    {["GPay", "PhonePe", "Paytm", "BHIM"].map((item) => (
                      <a key={item} href={BRAND.upiLink} className="upi-tile">
                        <Phone size={15} />
                        {item}
                      </a>
                    ))}
                  </div>

                  <div className="upi-id-panel">
                    <span>{BRAND.upiId}</span>
                    <button className="icon-orb small" onClick={handleCopyUpi} aria-label="Copy UPI ID">
                      <Copy size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="luxury-secondary full-width"
                    onClick={() => handleUpiConfirmation("bag")}
                    disabled={isPaying}
                  >
                    <CheckCircle2 size={16} /> {isPaying ? "Preparing order..." : "I have paid"}
                  </button>
                </div>

                <div className="trust-grid-mini">
                  <article>
                    <strong>Transparent checkout</strong>
                    <p>Final amount is shown before payment confirmation.</p>
                  </article>
                  <article>
                    <strong>Manual verification</strong>
                    <p>Orders are confirmed after product and payment verification.</p>
                  </article>
                </div>
              </div>
            ) : null}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Sheet open={isProductOpen} onOpenChange={(open) => !open && closeProduct()}>
        {selectedProduct ? (
          <SheetContent side="right" className="product-sheet-shell">
            <SheetHeader className="product-sheet-header">
              <div className="product-sheet-topline">
                <span className="product-tag">{selectedProduct.primaryTag}</span>
                <button className="inline-support-link" onClick={closeProduct} aria-label="Close preview">
                  <X size={16} />
                </button>
              </div>
              <SheetTitle className="product-sheet-title">{selectedProduct.name}</SheetTitle>
              <SheetDescription className="product-sheet-description">
                {selectedProduct.description}
              </SheetDescription>
            </SheetHeader>

            <div className="product-sheet-scroll">
              <div className="product-sheet-image-card">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="product-sheet-image" />
              </div>

              <div className="product-price-row">
                <strong>{selectedProduct.priceLabel}</strong>
                <span>{selectedProduct.color}</span>
              </div>

              <div className="spec-board">
                {selectedProduct.specs.map(([label, value]) => (
                  <div key={label} className="spec-line">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="editorial-story-card gold-tone">
                <p className="micro-label">Cultural touch</p>
                <p>{selectedProduct.history}</p>
              </div>

              <div className="editorial-story-card soft-tone">
                <p className="micro-label">Just for you</p>
                <p>{selectedProduct.styling}</p>
              </div>

              <p className="soul-note">{selectedProduct.soul}</p>

              <a
                href={buildWhatsAppUrl(selectedProduct.whatsappQuery)}
                className="luxury-secondary full-width"
                target="_blank"
                rel="noreferrer"
              >
                Ask us about this piece
              </a>

              <div className="chooser-grid">
                <div className="chooser-group">
                  <h3>Select Size</h3>
                  <div className="chooser-row">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`chooser-pill ${selectedSize === size ? "is-selected" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="chooser-group">
                  <h3>Select Colour</h3>
                  <div className="chooser-row">
                    {selectedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`chooser-pill ${selectedColor === color ? "is-selected" : ""}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="product-cta-stack">
                <button className="luxury-primary full-width" onClick={handleAddToCart}>
                  Add to Bag <ShoppingBag size={16} />
                </button>
                <button className="checkout-button" onClick={() => setPaymentVisible((current) => !current)}>
                  Proceed to Checkout
                </button>
                <p className="checkout-support-copy">Secure payment via Razorpay and UPI.</p>
              </div>

              {isPaymentVisible ? (
                <div className="payment-suite">
                  <div className="payment-block">
                    <div className="payment-block-header">
                      <div>
                        <p className="micro-label">Secure checkout</p>
                        <h3>Complete your devotion</h3>
                      </div>
                      <ShieldCheck size={18} />
                    </div>

                    <div className="checkout-contact-card">
                      <div className="checkout-contact-grid">
                        <label>
                          <span>Your name</span>
                          <input
                            value={checkoutCustomer.name ?? ""}
                            onChange={(event) => updateCheckoutCustomer("name", event.target.value)}
                            placeholder="Enter your name"
                          />
                        </label>
                        <label>
                          <span>Phone number</span>
                          <input
                            value={checkoutCustomer.phone ?? ""}
                            onChange={(event) => updateCheckoutCustomer("phone", event.target.value)}
                            placeholder="Enter your phone number"
                            inputMode="tel"
                          />
                        </label>
                        <label>
                          <span>Email address</span>
                          <input
                            value={checkoutCustomer.email ?? ""}
                            onChange={(event) => updateCheckoutCustomer("email", event.target.value)}
                            placeholder="Optional email"
                            inputMode="email"
                          />
                        </label>
                        <label>
                          <span>Order note</span>
                          <textarea
                            value={checkoutCustomer.notes ?? ""}
                            onChange={(event) => updateCheckoutCustomer("notes", event.target.value)}
                            placeholder="Optional delivery or confirmation note"
                            rows={3}
                          />
                        </label>
                      </div>
                    </div>

                    <button className="luxury-primary full-width" onClick={() => handleRazorpayPayment("product")} disabled={isPaying}>
                      {isPaying ? "Opening secure payment..." : "Pay securely"}
                    </button>

                    <div className="payment-divider">or pay via UPI</div>

                    <div className="qr-card">
                      <img src={BRAND.qrImage} alt="UPI QR Code" className="qr-image" />
                      <p>Scan and pay securely through your preferred UPI app.</p>
                    </div>

                    <div className="upi-grid">
                      {["GPay", "PhonePe", "Paytm", "BHIM"].map((item) => (
                        <a key={item} href={BRAND.upiLink} className="upi-tile">
                          <Phone size={15} />
                          {item}
                        </a>
                      ))}
                    </div>

                    <div className="upi-id-panel">
                      <span>{BRAND.upiId}</span>
                      <button className="icon-orb small" onClick={handleCopyUpi} aria-label="Copy UPI ID">
                        <Copy size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="luxury-secondary full-width"
                      onClick={() => handleUpiConfirmation("product")}
                      disabled={isPaying}
                    >
                      <CheckCircle2 size={16} /> {isPaying ? "Preparing order..." : "I have paid"}
                    </button>
                  </div>

                  <div className="trust-grid-mini">
                    <article>
                      <strong>Transparent checkout</strong>
                      <p>Final amount is shown before payment confirmation.</p>
                    </article>
                    <article>
                      <strong>Manual verification</strong>
                      <p>Orders are confirmed after product and payment verification.</p>
                    </article>
                  </div>
                </div>
              ) : null}

              <div className="share-lounge">
                <h3>Share this style</h3>
                <div className="share-row">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(formatShareText(selectedProduct.name, selectedProduct.primaryTag))}%20${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="share-orb"
                  >
                    <MessageCircle size={16} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="share-orb"
                  >
                    <Facebook size={16} />
                  </a>
                  <button className="share-orb" onClick={handleCopyLink}>
                    <Link2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>

      <Sheet open={Boolean(activeTeaser)} onOpenChange={(open) => !open && setActiveTeaser(null)}>
        {activeTeaserItem ? (
          <SheetContent side="bottom" className="teaser-sheet-shell">
            <SheetHeader className="teaser-sheet-header">
              <div className="teaser-sheet-symbol">{activeTeaserItem.emoji}</div>
              <SheetTitle className="teaser-sheet-title">{activeTeaserItem.popupTitle}</SheetTitle>
              <SheetDescription className="teaser-sheet-description">
                {activeTeaserItem.popupMessage}
              </SheetDescription>
            </SheetHeader>
            <div className="teaser-sheet-actions">
              <a
                href={`${BRAND.whatsappUrl}?text=Hi%20ABDAN,%20please%20tell%20me%20when%20${encodeURIComponent(activeTeaserItem.title)}%20is%20available.`}
                target="_blank"
                rel="noreferrer"
                className="luxury-primary full-width"
              >
                Notify me on WhatsApp
              </a>
            </div>
          </SheetContent>
        ) : null}
      </Sheet>
    </div>
  );
}
