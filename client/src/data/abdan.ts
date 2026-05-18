export type Product = {
  id: string;
  name: string;
  priceLabel: string;
  image: string;
  primaryTag: "Heritage Moments" | "Everyday Grace" | "Festive Glow";
  secondaryTags: {
    occasion: string;
    emotion: string;
    style: string;
  };
  color: string;
  specs: [string, string][];
  history: string;
  soul: string;
  whatsappQuery: string;
  description?: string;
  styling?: string;
};

export type StoryCard = {
  emoji: string;
  title: string;
  body: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  initial: string;
  featured?: boolean;
};

export type Teaser = {
  id: "loyalty" | "community";
  emoji: string;
  title: string;
  body: string;
  cta: string;
  popupTitle: string;
  popupMessage: string;
};

export const BRAND = {
  name: "ABDAN",
  tagline: "Your Devotion Meets Style",
  whatsappNumber: "918760595307",
  whatsappUrl: "https://wa.me/918760595307",
  telegramUrl: "https://t.me/+918760595307",
  instagramUrl: "https://www.instagram.com/mailme.nmcollections",
  facebookUrl: "https://www.facebook.com/share/173kbKas2c/",
  linkedinUrl: "https://www.linkedin.com/",
  channelUrl: "https://whatsapp.com/channel/0029Vb6NK8AChq6PXxF7rB0F",
  callUrl: "tel:+918760595307",
  upiLink: "upi://pay?pa=mailme.maqdoom@okhdfcbank&pn=ABDAN&cu=INR",
  upiId: "mailme.maqdoom@okhdfcbank",
  razorpayKey: "rzp_live_SkPERat9HcpiCb",
  logoPrimary:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663561972157/GvogLbUBgONDrsTX.png",
  logoSecondary:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663561972157/CLsmPdmHcNuRpeof.jpg",
  qrImage:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663561972157/S790fO18e9Vp8q7W.jpg",
  heroImage:
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
};

function generateAbdanContent(product: Product) {
  const fabric =
    product.specs.find(([label]) => label.includes("Fabric"))?.[1] ?? "fine fabric";
  const color = product.color || "graceful hues";
  const style = product.secondaryTags.style || "elegant design";
  const category = product.primaryTag;

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

  const closures = [
    "Every fold is a reminder of the devotion you carry in your everyday life. 💛",
    "A celebration of the simple, honest beauty you bring to the world. 💛",
    "Let this piece be a whispered story of your own grace. 💛",
  ];

  const stylingTips: Record<string, string> = {
    "Heritage Moments": `A simple high-necked blouse and a soft low bun with fresh jasmine would complement this ${fabric} beautifully. It’s a timeless choice for those days when you want to feel deeply connected to your roots.`,
    "Everyday Grace": `This ${style} piece pairs effortlessly with your favourite comfortable footwear for a day of errands or a quiet lunch. A simple gold chain adds just enough sparkle without feeling overdone.`,
    "Festive Glow": `Try draping this to let the ${style} details catch the light as you move. A pair of statement earrings and a small bindi will enhance the festive spirit of this ${color} ensemble.`,
  };

  const hash = product.name.length % 3;

  return {
    description: `${hooks[hash]} ${connections[(hash + 1) % 3]} ${feels[(hash + 2) % 3]} ${closures[hash]}`,
    styling:
      stylingTips[category] ||
      `Pair this ${style} ${product.name} with pieces that make you feel most like yourself. A touch of your favourite fragrance and a comfortable pair of sandals will complete this look with ease.`,
  };
}

const rawProducts: Product[] = [
  {
    id: "kanjivaram-silk-saree",
    name: "Kanjivaram Silk Saree",
    priceLabel: "₹8,500 onwards",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Heritage Moments",
    secondaryTags: { occasion: "Festive", emotion: "Elegant", style: "Embroidered" },
    color: "deep gold and emerald",
    specs: [
      ["Fabric", "Pure Mulberry Silk — Grade A"],
      ["Length", "6.3 metres with matching blouse piece"],
      ["Border", "Real Zari (gold thread) border & pallu"],
      ["Occasion", "Weddings · Puja ceremonies · The days your family gathers"],
      ["Care", "Dry clean only · Store in muslin cloth"],
      ["Verified", "✓ Sourced from certified Kanchipuram weavers"],
    ],
    history:
      "Kanchipuram silk weaving dates back over 400 years to the temple town of Kanchipuram in Tamil Nadu. Each saree takes 3–7 days to weave using pure mulberry silk and real gold zari. It is considered the Queen of Silks across India.",
    soul:
      "This is for the woman who carries tradition with devotion — let this silken prayer be just for you. 💛",
    whatsappQuery:
      "Hi 💛, I saw the Kanjivaram Silk Saree on ABDAN and it is beautiful. Could you tell me more about it?",
  },
  {
    id: "hand-block-print-kurti-set",
    name: "Hand Block Print Kurti Set",
    priceLabel: "₹1,200 onwards",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Everyday Grace",
    secondaryTags: { occasion: "Daily", emotion: "Comfortable", style: "Minimal" },
    color: "soft indigo and ivory",
    specs: [
      ["Fabric", "100% Soft Cotton — hand-block printed"],
      ["Sizes", "S, M, L, XL, 2XL, 3XL"],
      ["Set", "Kurti + matching palazzo pants"],
      ["Occasion", "Your everyday · Temple mornings · Quiet celebrations"],
      ["Care", "Machine washable · Gentle cycle cold water"],
      ["Verified", "✓ Sourced from Jaipur block print artisans"],
    ],
    history:
      "Hand block printing is a 4,500-year-old Indian textile art. Each wooden block is hand-carved by artisans and pressed onto fabric with practiced precision — meaning no two prints are exactly alike. Your kurti carries the mark of human hands.",
    soul:
      "This is for the woman who nurtures everyone through long days — let this softness hold you back, just for today. 💛",
    whatsappQuery:
      "Hi 💛, I'm interested in the Block Print Kurti Set from ABDAN! Could you help me find the right size?",
  },
  {
    id: "embroidered-festive-dupatta",
    name: "Embroidered Festive Dupatta",
    priceLabel: "₹2,800 onwards",
    image:
      "/manus-storage/embroidered-festive-dupatta_61d34c09.jpg",
    primaryTag: "Festive Glow",
    secondaryTags: { occasion: "Festive", emotion: "Graceful", style: "Embroidered" },
    color: "shimmering crimson",
    specs: [
      ["Fabric", "Georgette chiffon base"],
      ["Embroidery", "Zardozi (gold & silver thread) hand embroidery"],
      ["Length", "2.5 metres"],
      ["Occasion", "Festivals · Weddings · The evenings that deserve to sparkle"],
      ["Care", "Dry clean recommended · Handle borders gently"],
      ["Verified", "✓ Handcrafted by Lucknow zardozi artisans"],
    ],
    history:
      "Zardozi embroidery originated in Persia and was brought to India by Mughal royalty in the 16th century. It uses metallic threads — originally real gold and silver — to create elaborate raised patterns. Practiced by artisan families across centuries.",
    soul:
      "This is for the woman who lights up every room she walks into — let this sparkle remind you of who you truly are. 💛",
    whatsappQuery:
      "Hi 💛, I saw the Embroidered Dupatta on ABDAN and I can already imagine wearing it. Could you tell me more?",
  },
];

export const PRODUCTS = rawProducts.map((product) => ({
  ...product,
  ...generateAbdanContent(product),
}));

export const STORY_CARDS: StoryCard[] = [
  {
    emoji: "🌅",
    title: "The 5 AM Morning",
    body: "Before anyone else wakes, you are already caring — making tiffin, beginning the day for everyone. You deserve something beautiful to begin it for yourself too.",
  },
  {
    emoji: "🙏",
    title: "The Quiet Prayer",
    body: "Every morning, a moment of devotion for your family, your home, your hopes. Your clothing can honour that quiet grace you carry every single day.",
  },
  {
    emoji: "💐",
    title: "The Function You Dress For",
    body: "A wedding, a puja, a school function. You make everyone look their best. This time, let something make you feel like the celebration itself.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '"I was scared to buy online. My daughter-in-law showed me ABDAN. They were so patient, confirmed everything before I paid. The saree arrived like a gift. I cried a little. It fit perfectly."',
    name: "Kavitha R.",
    location: "Coimbatore, Tamil Nadu",
    initial: "K",
  },
  {
    quote:
      '"I wore my ABDAN kurti to my son\'s school function. Three mothers asked where I got it. I\'m just a mother from Salem. But that day I felt so beautiful. ABDAN makes you feel like you matter."',
    name: "Sumathi N.",
    location: "Salem, Tamil Nadu",
    initial: "S",
    featured: true,
  },
  {
    quote:
      '"I ordered a dupatta for Pongal. It arrived with a handwritten note — May your celebrations be as colourful as you are. I still have that note. No shop has ever made me feel so seen."',
    name: "Lakshmi V.",
    location: "Madurai, Tamil Nadu",
    initial: "L",
  },
];

export const TEASERS: Teaser[] = [
  {
    id: "loyalty",
    emoji: "💎",
    title: "ABDAN Loyalty Circle",
    body: "A special place where your opinions, your style, and your loyalty are celebrated with early access, exclusive pieces, and personal attention — because you deserve to be remembered.",
    cta: "Explore the Circle →",
    popupTitle: "Coming Soon — ABDAN Loyalty Circle",
    popupMessage:
      "💛 A special place where your opinions, your loyalty, and your style will be celebrated with early access to new collections, personal styling notes, and exclusive pieces curated just for you. You deserve to be remembered.",
  },
  {
    id: "community",
    emoji: "🌸",
    title: "ABDAN Community",
    body: "Share your fashion stories, ask opinions, celebrate each other's style, and connect with women who understand your world. A warm, safe, joyful space — just for you.",
    cta: "Join the Community →",
    popupTitle: "Coming Soon — ABDAN Community",
    popupMessage:
      "💛 Imagine a warm, safe space where women like you share fashion stories, ask for opinions, celebrate each other, and feel joyfully seen. A private circle where your voice matters.",
  },
];

export const ACCOUNT_FEATURES = [
  {
    icon: "heart",
    title: "Moments Loved",
    body: "Save the pieces that caught your eye. Your favourites wait here, always.",
  },
  {
    icon: "shopping-bag",
    title: "Your Keepsakes",
    body: "Every order — a memory of the day you chose something just for yourself.",
  },
  {
    icon: "sparkles",
    title: "Style Profile",
    body: "So we remember what you love and surprise you with pieces that speak to you.",
  },
  {
    icon: "mail",
    title: "Personal Notes",
    body: "Festival greetings, style updates — because you deserve to be remembered always.",
  },
] as const;

export const FAQS = [
  ["How do you ensure product quality?", "Every piece is handpicked and verified by our team before we even list it for you."],
  ["Is the pricing transparent?", "Yes, we believe in honesty. No hidden charges, ever. We confirm all costs before payment."],
  ["Can I trust the artisans?", "We only work with partners who share our values of craftsmanship and integrity."],
  ["How long does delivery take?", "Usually 5-7 working days, depending on your location in Tamil Nadu or beyond."],
  ["What is your return policy?", "We accept returns for damaged items. Just reach out within 24 hours of delivery."],
  ["How do I choose the right size?", "Our WhatsApp support is always here to guide you with detailed measurements."],
  ["Do you take custom requests?", "Yes! If you have a specific style in mind, let us know and we'll try to find it."],
  ["Is my payment secure?", "We use trusted payment gateways and confirm every transaction personally."],
  ["What if the color looks different?", "Minor variations occur due to lighting, but we try to show the most accurate shades."],
  ["How can I contact support?", "WhatsApp is the fastest way! We're available from 10 AM to 8 PM daily."],
] as const;

export const TERMS = [
  ["Orders & Payments", "Orders are confirmed only after payment. We verify availability with our partners before accepting any transaction."],
  ["Pricing", "All prices are inclusive of taxes unless stated otherwise. Shipping costs are clearly mentioned during checkout."],
  ["Shipping", "We partner with reliable couriers. While we aim for 5-7 days, external delays may occasionally occur."],
  ["Returns", "Returns are only for manufacturing defects or wrong items. Please provide an unboxing video for a smooth process."],
  ["Expectations", "Handcrafted items may have slight irregularities—this is the mark of human hands and not a defect."],
  ["Platform Usage", "By using ABDAN, you agree to our respectful community standards and privacy policies."],
  ["Liability", "While we stay with you until delivery, we act as a bridge between you and our trusted vendor partners."],
] as const;

export const TRUST_BAR_ITEMS = [
  "Verified Products",
  "Confirm Before You Pay",
  "With You Till Delivery",
  "No Account Needed",
] as const;

export const FILTERS = ["All", "Heritage Moments", "Everyday Grace", "Festive Glow"] as const;

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
