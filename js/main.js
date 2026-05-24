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

/* ── Luxury Motion Physics — unified timing + easing registry ────────────
   Single source of truth for all ABDAN motion. Use in every WAAPI call.
   Tuned for luxury restraint: motion felt, never consciously noticed.
   All curves GPU-composited: transform + opacity only. No repaints.        */
const LX_MOTION = {
  /* Duration tiers (milliseconds) */
  micro:     100,   /* border flash, badge — appears instant             */
  fast:      160,   /* opacity in/out, icon swap                         */
  standard:  220,   /* most UI feedback: press release, hover            */
  slow:      380,   /* panel reveal, filter dissolve, drawer stagger     */
  cinematic: 580,   /* cart fly arc, major entrance moments              */
  dramatic:  820,   /* order confirmation, celebration states            */

  /* Easing curves — WAAPI string form, mirrors CSS custom properties    */
  easeOut:    "cubic-bezier(0.23, 1, 0.32, 1)",     /* general deceleration          */
  easeSnap:   "cubic-bezier(0.16, 1, 0.3, 1)",      /* Apple-standard fast settle    */
  easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",  /* subtle spring overshoot       */

  /* Prefers-reduced-motion guard — check before every WAAPI animation  */
  reduced: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

/* ── Order lifecycle states (boutique fulfilment stages) ─────────────────
   Used to build the order timeline shown in confirmation + Your Space.    */
const ORDER_STATES = [
  { key: "confirmed",        label: "Order Confirmed",    note: "Your order has arrived with gratitude. 💛" },
  { key: "preparing",        label: "Being Prepared",     note: "Your pieces are being carefully packed." },
  { key: "shipped",          label: "Shipped",            note: "On its way — tracking shared via WhatsApp." },
  { key: "out_for_delivery", label: "Out for Delivery",   note: "Your order is almost with you." },
  { key: "delivered",        label: "Delivered",          note: "Enjoy your new pieces. 💛" },
];

const FILTERS = [
  "All",
  "Everyday Grace",
  "Modest Essence",
  "Festive Glow",
  "Workflow Elegance",
  "Soft Statement",
  "Evening Calm",
  "Signature Picks",
];
const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = ["Ivory", "Emerald", "Crimson"];
const ADMIN_ACCESS_HASH     = "025bfb58e58724ad81f9328ea387fc7e7edc7acb0f87863569c6b9a02173405e";
const ADMIN_EMAIL_HASH      = "8589552fb01f8ba47965e76d121b39cf800de9c22d347e8efb8bab5970677dc8";
const ADMIN_ACCESS_FALLBACK = "YWRtaW5AYWJkYW4uY29tOkFiZHVsbGFoQDE2MjQ=";

function buildProductNarrative(product) {
  const fabric = product.specs.find(([label]) => label.includes("Fabric"))?.[1] ?? "fine fabric";
  const color = product.color || "graceful hues";
  const style = product.secondaryTags.style || "elegant design";
  const hooks = [
    `Chosen for the moments when you want to feel composed without saying very much, this ${product.name} carries that quiet assurance beautifully.`,
    `When the day asks for softness and presence at once, this piece in ${fabric} answers with an ease that feels entirely your own.`,
    `Made for the woman who notices the honest details, this ${style.toLowerCase()} ${product.name} honours the grace you bring into every room.`,
  ];
  const connections = [
    "It slips into daily life with restraint, letting texture, proportion, and poise do the work instead of noise.",
    "Designed as a calm companion from early duties to evening plans, it feels thoughtful rather than performative.",
    "It offers a polished kind of comfort for the woman who carries responsibility, tenderness, and style all at once.",
  ];
  const feels = [
    `The ${fabric} settles softly, while tones of ${color} keep the mood grounded, luminous, and quietly memorable.`,
    "There is presence here, but it stays measured — refined enough to be noticed and gentle enough to feel personal.",
    "Its drape has a composed weight, allowing confidence to arrive through movement, line, and calm detail rather than excess.",
  ];
  const stylingTips = {
    "Everyday Grace": `Wear this ${style.toLowerCase()} piece with simple flats and a slim gold chain so the ease of the silhouette stays intact through errands, lunches, and gentler gatherings.`,
    "Modest Essence": `Let the shape stay uninterrupted with tonal layers, a clean scarf drape, and understated sandals that keep the line long and serene.`,
    "Festive Glow": `Add light-catching earrings and a softly defined bun so the embroidery can hold the celebration without the look becoming overstated.`,
    "Workflow Elegance": `Pair it with a structured tote, low heels, and a quiet watch so the day feels organised, polished, and still feminine.`,
    "Soft Statement": `Keep the rest of the styling restrained — a neutral sandal and one piece of jewellery will let the silhouette feel expressive without excess.`,
    "Evening Calm": `Style it with softer metallics, a low knot, and a clean lip colour so the mood stays intimate, graceful, and composed after dark.`,
    "Signature Picks": `Let this piece lead with minimal accompaniment — refined earrings, careful tailoring, and confident simplicity are enough.`,
  };
  const hash = product.name.length % 3;

  return {
    description: `${hooks[hash]} ${connections[(hash + 1) % 3]} ${feels[(hash + 2) % 3]} Every fold is a reminder that choosing yourself can also be an act of devotion. 💛`,
    styling:
      stylingTips[product.primaryTag] ||
      `Pair this ${style.toLowerCase()} ${product.name} with pieces that already feel like you. The most memorable finish is often the most restrained one.`,
  };
}

function buildEditorialExcerpt(product) {
  if (product.curationLine) return product.curationLine;
  const mood = product.secondaryTags.emotion?.toLowerCase() || "quiet elegance";
  const style = product.secondaryTags.style?.toLowerCase() || "considered dressing";
  return `Selected for ${mood}, ${style}, and a calmer way of getting dressed.`;
}

const PRODUCTS = [
  {
    id: "hand-block-print-kurti-set",
    name: "Hand Block Print Kurti Set",
    priceLabel: "₹1,200 onwards",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Everyday Grace",
    secondaryTags: { occasion: "Daily dressing", emotion: "Comfortable", style: "Minimal" },
    curationLine: "Soft cotton ease for temple mornings, errands, and slower afternoons.",
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
    description:
      "There are mornings when the day begins before sunrise — when you are already giving before the world has woken up. This kurti set was chosen for those mornings. The hand-block printing is ancient, patient work, pressed by Jaipur artisans whose hands understand the weight of each stamp. In soft indigo and ivory, it carries a quiet radiance that feels composed without effort — the kind of ease that holds you gently through a full, devoted day.",
    soul: "For the woman who pours herself into her days with grace — let this softness hold you in return, just for today. 💛",
    styling:
      "Wear it with simple flats and a slim gold chain so the block print stays the centrepiece. A small jhumka and a lightly pleated dupatta bring it gently towards an afternoon visit without disturbing the calm ease that makes it yours.",
    reach:
      "It’s the set you reach for when the day is already long before it has begun — when softness isn’t indulgence but a quiet act of self-care that lets you give more to everyone else.",
    madeFor:
      "The woman who rises early and moves through her day with devotion. The one who folds prayer into errands, who is everywhere at once and still carries a calm that others notice and cannot quite name.",
    pairsBeautifully:
      "A light dupatta in matching indigo or undyed cotton worn loosely over one shoulder. Small gold jhumkas that catch the light without demanding it. Flat kolhapuris or simple juttis that let the fabric fall the way it wants to.",
    softMoments: [
      "A slow tea before anyone else is awake",
      "The school run when you want to feel like yourself",
      "A temple visit on an ordinary Tuesday",
      "An afternoon at someone else’s home, feeling quietly gathered",
    ],
    whatsappQuery:
      "Hi 💛, I’m interested in the Hand Block Print Kurti Set from ABDAN. Could you help me find the right size?",
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Indigo", "Ivory", "Sand"],
  },
  {
    id: "pleated-modal-abaya",
    name: "Pleated Modal Abaya",
    priceLabel: "₹2,600 onwards",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Modest Essence",
    secondaryTags: { occasion: "Daily presence", emotion: "Grounded", style: "Fluid" },
    curationLine: "A quieter full-length silhouette with fluid drape and room to breathe.",
    color: "stone, date, and warm taupe",
    specs: [
      ["Fabric", "Premium modal blend with matte finish"],
      ["Sizes", "S/M, L/XL, XXL"],
      ["Silhouette", "Front-open abaya with fine pleat detailing"],
      ["Occasion", "Prayer visits · Travel days · Thoughtful daily wear"],
      ["Care", "Gentle wash cold · Steam lightly"],
      ["Verified", "Curated from modestwear ateliers in Dubai"],
    ],
    history:
      "Modal is prized for its soft hand-feel and graceful fall, making it especially suited to modern modest silhouettes that prioritise movement and comfort.",
    description:
      "Some garments hold stillness in their fabric. This pleated abaya is one of those. Cut from a premium modal blend that settles softly and falls without effort, it moves with you through a prayer visit, a family lunch, and an unplanned errand — and looks considered through all three. The matte finish is deliberate: it keeps the mood serene, the silhouette long, and the attention where it belongs.",
    soul: "For the days when modesty feels like the most personal kind of beauty, this abaya keeps every line soft, composed, and deeply yours. 💛",
    styling:
      "Let the silhouette breathe with tonal layers and a softly draped scarf. Understated leather sandals and a single ring keep the line long and the mood unhurried. It travels beautifully — considered in appearance, effortless in feeling.",
    reach:
      "Because some days the gentlest thing you can do for yourself is reach for something that asks nothing of you — no adjustment, no deliberation. Just drape, move, breathe. This abaya understands that.",
    madeFor:
      "For the woman who lives inside full and layered days. The one who needs her clothing to be as thoughtful and undemanding as she herself tries to be — who knows that ease is its own kind of elegance.",
    pairsBeautifully:
      "A soft scarf in warm beige or dusty olive, draped loosely rather than pinned. Leather slides in tan or cognac. A small wristwatch and nothing more. The abaya already has everything it needs.",
    softMoments: [
      "Arriving at Jumu'ah feeling completely held",
      "A long Friday of visiting and being visited",
      "Travel days when you need to move and still arrive looking considered",
      "A quiet afternoon that becomes an evening unexpectedly",
    ],
    whatsappQuery:
      "Hi 💛, I would love to know more about the Pleated Modal Abaya on ABDAN.",
    sizes: ["S/M", "L/XL", "XXL"],
    colors: ["Stone", "Date", "Warm Taupe"],
  },
  {
    id: "embroidered-festive-dupatta",
    name: "Embroidered Festive Dupatta",
    priceLabel: "₹2,800 onwards",
    image: "./assets/embroidered-festive-dupatta.jpg",
    primaryTag: "Festive Glow",
    secondaryTags: { occasion: "Celebration dressing", emotion: "Graceful", style: "Embroidered" },
    curationLine: "Light-catching handwork for weddings, Eid evenings, and warm festive gatherings.",
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
      "Zardozi embroidery was brought to India by Mughal royalty in the 16th century, using metallic threads to create raised patterns of lasting beauty.",
    description:
      "This dupatta carries centuries of Lucknow into the room with you. Zardozi embroidery was once reserved for royalty — metallic threads pressed onto fabric with an intimacy that no machine can replicate. The georgette chiffon base keeps it weightless even as the borders catch the light, and in shimmering crimson, every room becomes a little warmer when you enter it. It is the kind of piece that other women ask about at celebrations.",
    soul: "This is for the woman who lights up every gathering — let this sparkle remind you that you were always meant to shine. 💛",
    styling:
      "Drape it over a silk or satin base in ivory or deep gold. Light-catching earrings and a softly pinned bun let the embroidery lead without crowding it. Even worn simply over everyday wear, this dupatta transforms the entire mood of the moment.",
    reach:
      "Because there is one evening — or perhaps one afternoon — when you want to shimmer before you've said a word. When you want the room to warm around you simply because you arrived.",
    madeFor:
      "For the woman who understands that celebration dressing is an act of generosity. That choosing something beautiful is also how you show up for everyone around you — not just yourself.",
    pairsBeautifully:
      "A plain silk or satin kurta in deep ivory, antique gold, or blush. One strand of pearls or a single long earring — never both. Let the dupatta carry the evening entirely on its own.",
    softMoments: [
      "Eid morning when the room is already full of warmth",
      "A mehendi afternoon where everyone is dressed to feel festive",
      "A wedding day where you are not the bride but you are absolutely noticed",
      "The dinner gathering that quietly becomes the one you keep thinking about",
    ],
    whatsappQuery:
      "Hi 💛, I saw the Embroidered Festive Dupatta on ABDAN and would love to know more about it.",
    sizes: ["Free Size"],
    colors: ["Crimson", "Gold", "Rosewood"],
  },
  {
    id: "tailored-workday-kurta-set",
    name: "Tailored Workday Kurta Set",
    priceLabel: "₹2,950 onwards",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Workflow Elegance",
    secondaryTags: { occasion: "Work and meetings", emotion: "Assured", style: "Tailored" },
    curationLine: "Clean tailoring for studio hours, client meetings, and polished daily momentum.",
    color: "moss, ink, and pearl",
    specs: [
      ["Fabric", "Linen-cotton suiting blend"],
      ["Sizes", "S, M, L, XL, XXL"],
      ["Set", "Structured kurta + straight pant + optional dupatta"],
      ["Occasion", "Office days · Meetings · Smart daytime hosting"],
      ["Care", "Dry clean first wash · Then gentle hand wash"],
      ["Verified", "Tailored in small-batch workshops in Bengaluru"],
    ],
    history:
      "Contemporary Indian workwear blends clean tailoring with breathable natural fabrics, creating silhouettes that feel formal without becoming rigid.",
    description:
      "There is a particular confidence that comes not from loudness but from order — from knowing that what you are wearing reflects the same care you bring to everything else. This kurta set, cut from a linen-cotton suiting blend in Bengaluru workshops, was chosen for exactly that feeling. The tailoring is clean, the lines are measured, and the three colourways are selected to feel polished without performing. A set that holds its shape through a full and purposeful working day.",
    soul: "For the woman who leads with quiet authority — dressed with the same thoughtfulness she brings to everything she does. 💛",
    styling:
      "Pair it with a structured tote, low block heels, and a slim watch. The optional dupatta adds softness to formal meetings without disturbing the tailored line. Keep jewellery restrained — one quiet piece is enough.",
    reach:
      "Because confidence at work begins before you enter the room. Choosing something with clean lines and honest tailoring is its own quiet preparation — a signal to yourself that today, you are ready.",
    madeFor:
      "For the woman who brings her whole self to her professional life. The one whose presence commands rooms gently, who understands that dressing with care is the first decision in a day full of them.",
    pairsBeautifully:
      "A structured tote in tan or dark leather. A simple watch with a clean face. Block heels or leather Oxford-style flats. The optional dupatta folded over one shoulder for moments that need a softer edge.",
    softMoments: [
      "The morning of a presentation when everything needs to feel right",
      "A client meeting where you want your thinking to arrive before you speak",
      "Friday afternoons that turn into early dinners without a change of clothes",
      "Work-from-home days when dressing properly changes how you feel by noon",
    ],
    whatsappQuery:
      "Hi 💛, I’m interested in the Tailored Workday Kurta Set from ABDAN. Could you help me with sizing and colours?",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Moss", "Ink", "Pearl"],
  },
  {
    id: "organza-layered-kurta",
    name: "Organza Layered Kurta",
    priceLabel: "₹3,400 onwards",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Soft Statement",
    secondaryTags: { occasion: "Small occasions", emotion: "Expressive", style: "Layered" },
    curationLine: "A softly dramatic layer that makes an impression through shape, not noise.",
    color: "blush sand and muted rose",
    specs: [
      ["Fabric", "Organza overlay with satin-cotton lining"],
      ["Sizes", "S, M, L, XL"],
      ["Detail", "Layered sleeves with tonal threadwork"],
      ["Occasion", "Intimate celebrations · Dinners · Special family visits"],
      ["Care", "Dry clean preferred"],
      ["Verified", "Curated from occasionwear ateliers in Hyderabad"],
    ],
    history:
      "Organza holds shape lightly, allowing volume and softness to coexist in a distinctly refined way — favoured for occasions that ask for presence without weight.",
    description:
      "There are moments that ask you to be noticed — a birthday dinner, an intimate celebration, the afternoon that turns unexpectedly beautiful. This organza layered kurta was made for those moments. The layered sleeves carry a soft volume that moves as you do, and the tonal threadwork catches light in a way that feels deliberate without being obvious. It is expressive without effort — the kind of piece that makes the evening feel curated around it.",
    soul: "For when you want to be remembered in the gentlest possible way — this piece lets softness become the whole statement. 💛",
    styling:
      "Keep the rest of the look restrained: a nude or blush sandal, one fine jewellery piece, and a soft hair arrangement. The organza is already leading the room. Let it.",
    reach:
      "Because you have spent enough quiet evenings in the background. Sometimes the gathering is an invitation — not to be loud, but to let the softness speak. This piece reaches back when you reach for it.",
    madeFor:
      "For the woman who knows how to be noticed without performing. The one who brings warmth to small gatherings and leaves an impression without needing to announce a thing. She is present. That is enough.",
    pairsBeautifully:
      "A fine gold chain — delicate, not layered. A nude or blush sandal with a small heel. Soft loose waves or a simple low bun that keeps the neckline clear and lets the organza do its quiet work.",
    softMoments: [
      "A birthday dinner where you want to feel special without being showy",
      "A close family gathering where the question is always ‘where did you get that?’",
      "An evening that begins as ordinary and slowly becomes the one you remember",
      "A celebration where the photographs come back better than you expected",
    ],
    whatsappQuery:
      "Hi 💛, I’d like more details about the Organza Layered Kurta from ABDAN.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Sand", "Muted Rose", "Ivory"],
  },
  {
    id: "satin-drape-evening-set",
    name: "Satin Drape Evening Set",
    priceLabel: "₹3,950 onwards",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Evening Calm",
    secondaryTags: { occasion: "After-dark grace", emotion: "Luminous", style: "Draped" },
    curationLine: "Low-light elegance in a softer drape for dinners, visits, and evening prayer gatherings.",
    color: "midnight blue and soft bronze",
    specs: [
      ["Fabric", "Satin-viscose blend with soft sheen"],
      ["Sizes", "S, M, L, XL"],
      ["Set", "Long tunic + draped trouser + tonal stole"],
      ["Occasion", "Dinner hosting · Evening events · Intimate celebrations"],
      ["Care", "Dry clean or hand wash separately"],
      ["Verified", "Selected from eveningwear specialists in Mumbai"],
    ],
    history:
      "Soft-sheen fabrics bring a luminous quality to evening wear — warmth and depth without the loudness of full sequin or metallic work.",
    description:
      "The finest evening pieces are those that glow without trying — that bring warmth to a dim room without announcing themselves the moment you enter it. This satin-viscose set does exactly that. The long tunic falls with a composed weight, the draped trouser keeps the silhouette fluid, and the tonal stole completes the look as though it was always part of you. In midnight blue or soft bronze, it holds the mood of an evening that is allowed to be slow, beautiful, and unhurried.",
    soul: "For evenings that deserve peace as much as they deserve beauty — this set holds that feeling long after the gathering ends. 💛",
    styling:
      "Soft metallic earrings and a quiet bangle complement the sheen without competing with it. A low knot or soft plait keeps the neckline clear. A warm, clean lip is all the finish this set needs.",
    reach:
      "For the evenings that deserve to be slow. When the light is low and the conversation is warm and you want to feel like the whole night was arranged around you — not loudly, but privately, completely.",
    madeFor:
      "For the woman who knows the difference between dressed up and truly dressed. Who hosts with ease and sits across candlelight beautifully. Who understands that the finest evenings ask for calm, not performance.",
    pairsBeautifully:
      "A single metallic ear cuff or a long drop earring — one or the other. A fine bangle that moves with the satin. A warm, clean fragrance chosen for the quiet hours. Nothing else. The set carries the evening alone.",
    softMoments: [
      "Hosting a dinner where you want everything — including yourself — to feel attended to",
      "Eid evening visits when the mood is already soft and the night is long",
      "A quiet anniversary or milestone celebrated slowly at home",
      "The night you go out and feel, for once, entirely like yourself",
    ],
    whatsappQuery:
      "Hi 💛, could you tell me more about the Satin Drape Evening Set on ABDAN?",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Midnight Blue", "Soft Bronze", "Pearl Grey"],
  },
  {
    id: "pearl-detail-occasion-abaya",
    name: "Pearl Detail Occasion Abaya",
    priceLabel: "₹4,600 onwards",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    primaryTag: "Signature Picks",
    secondaryTags: { occasion: "Occasion highlight", emotion: "Refined", style: "Signature" },
    curationLine: "A signature full-length piece chosen for its restraint, finish, and lasting presence.",
    color: "black pearl and warm ivory",
    specs: [
      ["Fabric", "Crepe-matte blend with hand-set pearl accents"],
      ["Sizes", "S/M, L/XL, XXL"],
      ["Silhouette", "A-line abaya with detachable inner layer"],
      ["Occasion", "Hosting moments · Eid visits · The pieces you remember"],
      ["Care", "Spot clean details · Dry clean when needed"],
      ["Verified", "Finished in limited numbers by occasionwear specialists"],
    ],
    history:
      "Signature occasion pieces rely on meticulous finishing rather than loud ornament — texture, proportion, and restraint create memorability that outlasts any single event.",
    description:
      "Some occasions ask for a presence that is measured, composed, and quietly unforgettable. This abaya answers that call. The hand-set pearl accents are placed onto a crepe-matte blend that absorbs light beautifully — adding warmth and dimension without sparkle. The A-line silhouette is proportioned for modesty and ease, and the detachable inner layer means it adapts gracefully between different environments. Finished in limited numbers by specialists who understand that the quietest things endure the longest.",
    soul: "For the woman whose style is remembered because it is thoughtful, measured, and entirely her own. 💛",
    styling:
      "Let this piece be the entire statement. Pearl or simple gold earrings, careful tailoring underneath, and a softly done complexion. Confident posture is the only accessory this abaya truly needs.",
    reach:
      "Because there are occasions that deserve the very best of you — not the most decorated, but the most considered. This is the piece you reach for when you want every detail to feel placed with intention.",
    madeFor:
      "For the woman who has learned that restraint is the most sophisticated form of beauty. The one whose presence is felt before she speaks, whose style is remembered long after the occasion has ended.",
    pairsBeautifully:
      "Simple pearl studs or one small gold ear cuff. A fine string of prayer beads worn softly. Nothing on the wrists so the cuffs fall cleanly. The abaya tells the complete story — accompaniments are only witnesses.",
    softMoments: [
      "Eid morning when you want every detail to feel considered and calm",
      "A walima or nikah gathering where you are arriving as family",
      "The occasion you have been preparing for quietly for weeks",
      "A moment when the photograph is taken and you don’t need to look at it to know it was right",
    ],
    whatsappQuery:
      "Hi 💛, I’m interested in the Pearl Detail Occasion Abaya from ABDAN. Could you share more details?",
    sizes: ["S/M", "L/XL", "XXL"],
    colors: ["Black Pearl", "Warm Ivory", "Date Brown"],
  },
  /* Product fields (description, soul, styling) override buildProductNarrative fallbacks.
     Spread order: generated fallback first, product’s own fields win. */
].map((product) => ({ ...buildProductNarrative(product), ...product }));

const FAQS = [
  ["How is each piece selected?", "Every piece is personally handpicked and verified before it is offered to you — no piece appears here by accident."],
  ["Is the pricing transparent?", "Completely. Every cost is confirmed before payment. No hidden charges, no last-minute surprises. Ever."],
  ["Who creates these pieces?", "Only partners whose values of craftsmanship and integrity align with ABDAN's are chosen — and they are chosen carefully."],
  ["When will my order arrive?", "Usually 5–7 working days, depending on your location in Tamil Nadu or beyond. Every order is followed closely."],
  ["How do I choose the right size?", "WhatsApp support is always available to guide with measurements, fabric notes, and honest advice before the decision."],
  ["Is my payment secure?", "ABDAN uses trusted payment gateways and confirms every transaction personally. Nothing is left unattended."],
];

const TERMS = [
  ["Orders & Payments", "Orders are confirmed only after payment. Availability is verified personally before any transaction is accepted."],
  ["Pricing", "All prices are inclusive of taxes unless stated otherwise. Shipping is clearly mentioned during checkout — no surprises."],
  ["Shipping", "Reliable courier partners are selected carefully. Occasional external delays can occur beyond ABDAN's control, but every order is tracked."],
  ["Returns", "Returns are accepted for damaged items or wrong dispatches. An unboxing video, where possible, helps the process move smoothly."],
  ["Expectations", "Handcrafted items may carry slight irregularities — the mark of human hands, not a defect. That is part of their honesty."],
  ["The ABDAN Promise", "ABDAN acts as a careful bridge between you and trusted artisan partners, staying present through every step until the piece is home with you."],
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
      "Imagine a warm and private space where women share fashion stories, ask for opinions, celebrate style, and feel joyfully seen. That is the community taking shape, one voice at a time.",
  },
};

let _toastTimer = null;
let _revealObserver = null;

const state = {
  theme: localStorage.getItem("abdan-theme") || "light",
  filter: "All",
  cart: JSON.parse(localStorage.getItem("abdan-cart") || "[]"),
  activeProductId: null,
  selectedSize: null,
  selectedColor: null,
  adminAuthenticated: (function () {
    if (sessionStorage.getItem("abdan-admin-auth") === "true") return true;
    try {
      const t = JSON.parse(localStorage.getItem("abdan-admin-token") || "null");
      if (t && t.v === "true" && t.exp > Date.now()) {
        sessionStorage.setItem("abdan-admin-auth", "true");
        return true;
      }
    } catch { /* ignore */ }
    return false;
  })(),
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
  productIntro: document.getElementById("productIntro"),
  productDescription: document.getElementById("productDescription"),
  productFacts: document.getElementById("productFacts"),
  productSoul: document.getElementById("productSoul"),
  productStyling: document.getElementById("productStyling"),
  productReach: document.getElementById("productReach"),
  productMadeFor: document.getElementById("productMadeFor"),
  productPairs: document.getElementById("productPairs"),
  productMoments: document.getElementById("productMoments"),
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
  adminEntry: document.getElementById("adminEntry"),
  adminShell: document.getElementById("adminShell"),
  adminLoginPanel: document.getElementById("adminLoginPanel"),
  adminPanel: document.getElementById("adminPanel"),
  adminLoginForm: document.getElementById("adminLoginForm"),
  adminEmail: document.getElementById("adminEmail"),
  adminPasscode: document.getElementById("adminPasscode"),
  adminError: document.getElementById("adminError"),
  adminSignout: document.getElementById("adminSignout"),
  adminPiecesCount: document.getElementById("adminPiecesCount"),
  adminCategoriesCount: document.getElementById("adminCategoriesCount"),
  adminRouteValue: document.getElementById("adminRouteValue"),
  adminSessionValue: document.getElementById("adminSessionValue"),
  adminPiecesList: document.getElementById("adminPiecesList"),
  adminRouteLabel: document.getElementById("adminRouteLabel"),
  adminSessionStatus: document.getElementById("adminSessionStatus"),
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

function showToast(message, duration = 2800) {
  let toast = document.getElementById("abdan-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "abdan-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("is-visible"), duration);
}

function saveCart() {
  localStorage.setItem("abdan-cart", JSON.stringify(state.cart));
}

function safeCreateIcons() {
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function setTheme(theme) {
  state.theme = theme;
  dom.html.setAttribute("data-theme", theme);
  localStorage.setItem("abdan-theme", theme);
  const icon = dom.themeToggle.querySelector("i");
  if (icon) icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
  safeCreateIcons();
}

function isAdminRoute() {
  return window.location.hash === "#admin" || window.location.hash.startsWith("#admin?");
}

async function hashValue(value) {
  const bytes = new TextEncoder().encode(value);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyAdminPasscode(email, passcode) {
  const normEmail    = (email    || "").trim().toLowerCase();
  const normPasscode = (passcode || "").trim();
  if (!normEmail || !normPasscode) return false;
  if (window.crypto?.subtle) {
    const [emailHash, pwHash] = await Promise.all([hashValue(normEmail), hashValue(normPasscode)]);
    return emailHash === ADMIN_EMAIL_HASH && pwHash === ADMIN_ACCESS_HASH;
  }
  const [fallbackEmail, fallbackPw] = window.atob(ADMIN_ACCESS_FALLBACK).split(":");
  return normEmail === fallbackEmail && normPasscode === fallbackPw;
}

/* ── setAdminSession ──────────────────────────────────────────────────
   Writes or clears auth tokens only. Does NOT trigger a redirect or
   re-render — callers own that decision.  This keeps the auth state
   machine free of side-effects and eliminates the double-redirect race
   that was caused by renderAdminRoute() also calling location.replace.

   authenticated = true  → write sessionStorage + 8-hour localStorage token
   authenticated = false → clear both stores, then re-render the login UI  */
function setAdminSession(authenticated) {
  state.adminAuthenticated = authenticated;
  if (authenticated) {
    sessionStorage.setItem("abdan-admin-auth", "true");
    try {
      localStorage.setItem("abdan-admin-token", JSON.stringify({
        v: "true", exp: Date.now() + 8 * 60 * 60 * 1000,
      }));
    } catch { /* storage quota — sessionStorage still valid */ }
    /* Callers (handleAdminLogin / handleSpaceSignin) do the redirect */
  } else {
    sessionStorage.removeItem("abdan-admin-auth");
    try { localStorage.removeItem("abdan-admin-token"); } catch { /* ignore */ }
    renderAdminRoute(); /* re-render login form after signout */
  }
}

function renderAdminPieces() {
  if (!dom.adminPiecesList) return;
  dom.adminPiecesList.innerHTML = PRODUCTS.map(
    (product) => `
      <article class="admin-piece-row">
        <div>
          <span>${product.primaryTag}</span>
          <strong>${product.name}</strong>
          <small>${buildEditorialExcerpt(product)}</small>
        </div>
        <span class="admin-piece-price">${product.priceLabel}</span>
      </article>
    `,
  ).join("");
}

function renderAdminRoute() {
  const adminRoute = isAdminRoute();
  dom.html.setAttribute("data-route", adminRoute ? "admin" : "storefront");
  if (dom.adminShell) {
    dom.adminShell.hidden = !adminRoute;
    dom.adminShell.setAttribute("aria-hidden", String(!adminRoute));
  }
  if (dom.adminEntry) {
    dom.adminEntry.classList.toggle("is-active", adminRoute);
  }
  if (!adminRoute) return;

  /* ── Auto-redirect authenticated admins straight to Studio ─────── */
  if (state.adminAuthenticated) {
    window.location.replace("/studio.html");
    return;
  }

  window.scrollTo({ top: 0 });
  dom.body.classList.remove("is-locked", "has-overlay");
  closeCart();
  closeProduct();
  closeTeaser();
  renderAdminPieces();

  const categoryCount = FILTERS.filter((filter) => filter !== "All").length;
  if (dom.adminPiecesCount) dom.adminPiecesCount.textContent = String(PRODUCTS.length).padStart(2, "0");
  if (dom.adminCategoriesCount) dom.adminCategoriesCount.textContent = String(categoryCount).padStart(2, "0");
  if (dom.adminRouteValue) dom.adminRouteValue.textContent = "#admin";
  if (dom.adminSessionValue) dom.adminSessionValue.textContent = state.adminAuthenticated ? "Live" : "Locked";
  if (dom.adminRouteLabel) dom.adminRouteLabel.textContent = window.location.hash || "#admin";
  if (dom.adminSessionStatus) {
    dom.adminSessionStatus.textContent = state.adminAuthenticated
      ? "Signed in for this browser session. The admin route, visibility, and navigation controls are now active."
      : "Access is currently locked. Enter the admin passcode to load the operational panel.";
  }
  if (dom.adminLoginPanel) dom.adminLoginPanel.hidden = state.adminAuthenticated;
  if (dom.adminPanel) dom.adminPanel.hidden = !state.adminAuthenticated;
  if (dom.adminSignout) dom.adminSignout.hidden = !state.adminAuthenticated;
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const email   = dom.adminEmail?.value   || "";
  const passcode = dom.adminPasscode?.value || "";
  const verified = await verifyAdminPasscode(email, passcode);
  if (!verified) {
    if (dom.adminError) {
      dom.adminError.hidden = false;
      dom.adminError.textContent = "The access code did not match. Please try again.";
    }
    return;
  }

  if (dom.adminError) {
    dom.adminError.hidden = true;
    dom.adminError.textContent = "";
  }
  if (dom.adminEmail)    dom.adminEmail.value    = "";
  if (dom.adminPasscode) dom.adminPasscode.value = "";
  /* Write tokens first, THEN navigate once.  setAdminSession no longer
     calls renderAdminRoute on login, so there is exactly one redirect. */
  setAdminSession(true);
  window.location.replace("/studio.html");
}

function handleAdminSignout() {
  if (dom.adminError) {
    dom.adminError.hidden = true;
    dom.adminError.textContent = "";
  }
  if (dom.adminEmail)    dom.adminEmail.value    = "";
  if (dom.adminPasscode) dom.adminPasscode.value = "";
  setAdminSession(false);
}

/* ═══════════════════════════════════════════════════════════════════
   YOUR SPACE — customer identity ecosystem
   localStorage profiles · sessionStorage active session
   Silent admin routing via credential check
   ═══════════════════════════════════════════════════════════════════ */

const SPACE_STORAGE_KEY = "abdan-space-profiles";
const SPACE_SESSION_KEY = "abdan-space-session";

function getSpaceProfiles() {
  try { return JSON.parse(localStorage.getItem(SPACE_STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function getSpaceSession() {
  try { return JSON.parse(sessionStorage.getItem(SPACE_SESSION_KEY) || "null"); }
  catch { return null; }
}

function setSpaceSession(profile) {
  sessionStorage.setItem(SPACE_SESSION_KEY, JSON.stringify({
    email: profile.email,
    displayName: profile.displayName,
    fullName: profile.fullName,
  }));
}

function clearSpaceSession() {
  sessionStorage.removeItem(SPACE_SESSION_KEY);
}

async function createSpaceProfile(data) {
  const profiles = getSpaceProfiles();
  const email = data.email.toLowerCase().trim();
  if (profiles[email]) {
    throw new Error("A space already exists for this email. Continue Your Space to sign in.");
  }
  const passwordHash = await hashValue(data.password);
  const profile = {
    fullName: data.fullName.trim(),
    displayName: data.displayName.trim(),
    email,
    phone: data.phone?.trim() || "",
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  profiles[email] = profile;
  localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(profiles));
  return profile;
}

async function authenticateSpace(email, password) {
  if (await verifyAdminPasscode(email, password)) return { type: "admin" };
  const profiles = getSpaceProfiles();
  const profile = profiles[email.toLowerCase().trim()];
  if (!profile) return null;
  const hash = await hashValue(password);
  if (hash !== profile.passwordHash) return null;
  return { type: "customer", profile };
}

function showSpaceError(errorId, message) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function clearSpaceError(errorId) {
  const el = document.getElementById(errorId);
  if (el) { el.hidden = true; el.textContent = ""; }
}

function showSpaceView(viewId) {
  const views = document.querySelectorAll(".space-view");
  const target = document.getElementById(viewId);
  if (!target) return;

  views.forEach((v) => {
    if (!v.hidden) {
      v.style.opacity = "0";
      v.style.transform = "translateY(8px)";
      setTimeout(() => {
        v.hidden = true;
        v.style.opacity = "";
        v.style.transform = "";
      }, 180);
    }
  });

  setTimeout(() => {
    target.hidden = false;
    target.classList.add("is-entering");
    setTimeout(() => target.classList.remove("is-entering"), 460);
    target.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => _revealObserver?.observe(el));
    safeCreateIcons();
    const section = document.getElementById("account");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
}

/* ── Render order history cards for a phone number in Your Space ─────────
   Matches orders where customerPhone === phone (same device = same LS).    */
function renderSpaceOrders(phone) {
  const panel = document.getElementById("spaceOrdersPanel");
  if (!panel) return;
  let orders = [];
  try {
    const all = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]");
    orders = all.filter((o) => String(o.customerPhone || "").replace(/\D/g, "") === String(phone || "").replace(/\D/g, ""));
  } catch { /* ignore */ }
  if (!orders.length) {
    panel.innerHTML = `
      <p class="space-orders__heading">Your Orders</p>
      <p class="space-orders__empty">No orders yet — when you place one, it'll appear here as a quiet reminder of the day you chose something just for yourself. 💛</p>`;
    return;
  }
  const statusLabel = {
    confirmed:        "Confirmed",
    preparing:        "Preparing",
    shipped:          "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered:        "Delivered",
  };
  const cards = orders.map((order) => {
    const dateStr = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const itemsSummary = (order.items || []).map((i) => `${i.name} (${i.size}/${i.color} ×${i.quantity})`).join(", ");
    return `
      <div class="space-order-card">
        <div class="space-order-card__header">
          <span class="space-order-card__ref">${order.ref || order.id || "—"}</span>
          <span class="space-order-card__status" data-status="${order.status || "confirmed"}">${statusLabel[order.status] || "Confirmed"}</span>
        </div>
        <div class="space-order-card__items">${itemsSummary || "—"}</div>
        <div class="space-order-card__footer">
          <span class="space-order-card__total">${formatCurrency(order.total || 0)}</span>
          <span class="space-order-card__date">${dateStr}</span>
        </div>
      </div>`;
  }).join("");
  panel.innerHTML = `<p class="space-orders__heading">Your Orders</p>${cards}`;
}

function showSpaceDashboard(profile, isNew = false) {
  const first = (profile.displayName || profile.fullName || "").split(" ")[0] || "you";
  const greetingEl = document.getElementById("spaceDashGreeting");
  const taglineEl  = document.getElementById("spaceDashTagline");
  if (greetingEl) {
    greetingEl.textContent = isNew
      ? `Your Space is Ready, ${first} 💛`
      : `Welcome back, ${first} 💛`;
  }
  if (taglineEl) {
    taglineEl.textContent = isNew
      ? "Everything you love, thoughtfully kept in one place."
      : "Your space is exactly as you left it.";
  }
  showSpaceView("spaceDashboard");
  /* Render order history for this phone number */
  renderSpaceOrders(profile.phone || "");
  if (isNew) showToast("Your Space is ready. Welcome. 💛");
}

async function handleSpaceSignin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.email.value.trim();
  const password = form.password.value;
  const submitBtn = form.querySelector("[type='submit']");
  clearSpaceError("spaceSigninError");
  setButtonLoading(submitBtn, "Entering your space…");
  try {
    const result = await authenticateSpace(email, password);
    if (!result) {
      showSpaceError("spaceSigninError", "These details don't match a space. Please try again.");
      resetButtonLoading(submitBtn);
      return;
    }
    if (result.type === "admin") {
      /* ── BUG FIX: must write auth tokens BEFORE navigating.
         Without this, studio.js gate finds no session → redirect loop. */
      setAdminSession(true);
      resetButtonLoading(submitBtn);
      window.location.href = "/studio.html";
      return;
    }
    setSpaceSession(result.profile);
    showSpaceDashboard(result.profile, false);
    resetButtonLoading(submitBtn);
  } catch {
    showSpaceError("spaceSigninError", "Something gentle went wrong. Please try once more.");
    resetButtonLoading(submitBtn);
  }
}

async function handleSpaceCreate(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = {
    fullName: form.fullName.value,
    displayName: form.displayName.value,
    email: form.email.value,
    phone: form.phone?.value || "",
    password: form.password.value,
    confirmPassword: form.confirmPassword.value,
  };
  clearSpaceError("spaceCreateError");
  if (data.password.length < 6) {
    showSpaceError("spaceCreateError", "Your password needs at least 6 characters.");
    return;
  }
  if (data.password !== data.confirmPassword) {
    showSpaceError("spaceCreateError", "Your passwords don't match. Please try again.");
    return;
  }
  const submitBtn = form.querySelector("[type='submit']");
  setButtonLoading(submitBtn, "Creating your space…");
  try {
    const profile = await createSpaceProfile(data);
    setSpaceSession(profile);
    showSpaceDashboard(profile, true);
    resetButtonLoading(submitBtn);
  } catch (err) {
    showSpaceError("spaceCreateError", err instanceof Error ? err.message : "Something gentle went wrong. Please try once more.");
    resetButtonLoading(submitBtn);
  }
}

function handleSpaceSignout() {
  clearSpaceSession();
  showSpaceView("spaceEntry");
  showToast("Until next time 💛");
}

function initSpaceAuth() {
  const session = getSpaceSession();
  if (session) showSpaceDashboard(session, false);
}

function renderFilters() {
  dom.filterRow.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });

  /* Scroll the active filter chip into view — important on mobile when the
     carousel resets and a non-"All" chip may be off-screen to the right.
     Uses direct scrollTo so we don't fight the IntersectionObserver.       */
  requestAnimationFrame(() => {
    const activeChip = dom.filterRow.querySelector(".filter-chip.is-active");
    if (!activeChip) return;
    const chipLeft = activeChip.offsetLeft;
    const rowScroll = dom.filterRow.scrollLeft;
    const rowWidth = dom.filterRow.offsetWidth;
    const chipRight = chipLeft + activeChip.offsetWidth;
    /* Only scroll if the chip is not already fully visible */
    if (chipLeft < rowScroll || chipRight > rowScroll + rowWidth) {
      dom.filterRow.scrollTo({ left: Math.max(0, chipLeft - 12), behavior: "smooth" });
    }
  });
}

function renderProducts() {
  const filteredProducts = state.filter === "All"
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.primaryTag === state.filter);

  const wl = getWishlist();

  const paintCards = () => {
    dom.productsGrid.innerHTML = filteredProducts
      .map(
        (product, index) => {
          const saved = wl.has(product.id);
          return `
            <article class="product-card reveal" data-product-card="${product.id}">
              <div class="product-card__media">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                <div class="product-card__overlay"></div>
              </div>
              <button class="product-card__save${saved ? " is-saved" : ""}"
                      type="button"
                      data-wishlist="${product.id}"
                      aria-label="${saved ? "Remove from wishlist" : "Save to wishlist"}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div class="product-card__content">
                <div class="product-card__header">
                  <p class="section-kicker">${product.primaryTag}</p>
                  <span class="product-card__index">${String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 class="product-card__title">${product.name}</h3>
                <p class="product-card__description">${buildEditorialExcerpt(product)}</p>
                <p class="product-card__meta">${product.secondaryTags.occasion}</p>
                <div class="product-card__footer">
                  <span class="product-card__price">${product.priceLabel}</span>
                  <button class="text-link" type="button" data-preview="${product.id}">View details</button>
                </div>
              </div>
            </article>
          `;
        },
      )
      .join("");

    /* Reset carousel — filter changes always start from card 1 */
    dom.productsGrid.scrollLeft = 0;

    /* Stagger reveal delays + image fade-in */
    dom.productsGrid.querySelectorAll(".product-card").forEach((card, i) => {
      card.style.setProperty("--reveal-delay", `${Math.min(i * 40, 200)}ms`);
    });
    dom.productsGrid.querySelectorAll(".product-card__media img").forEach((img) => {
      const onLoad = () => {
        img.classList.add("img-loaded");
        img.closest(".product-card__media")?.classList.add("img-loaded");
      };
      if (img.complete && img.naturalWidth > 0) { onLoad(); }
      else {
        img.addEventListener("load",  onLoad, { once: true });
        img.addEventListener("error", onLoad, { once: true });
      }
    });

    revealElements();
  };

  /* ── Filter dissolve: fade-out → swap → fade-in ─────────────────────
     Only dissolve when cards already exist (not on initial page paint). */
  if (!dom.productsGrid.children.length) {
    paintCards();
  } else {
    dom.productsGrid.classList.add("is-filtering");
    setTimeout(() => {
      paintCards();
      /* rAF: let browser recalculate layout after innerHTML swap,
         then remove the class so the CSS transition fires.          */
      requestAnimationFrame(() =>
        requestAnimationFrame(() => dom.productsGrid.classList.remove("is-filtering"))
      );
    }, 145);
  }
}

function renderFooterContent() {
  dom.faqList.innerHTML = FAQS.map(
    ([title, body]) => `<article><strong>${title}</strong><span>${body}</span></article>`,
  ).join("");
  dom.termsList.innerHTML = TERMS.map(
    ([title, body]) => `<article><strong>${title}</strong><p>${body}</p></article>`,
  ).join("");
}

/* ── Build a product-specific deep-link URL ──────────────────────────── */
function buildShareUrl(product) {
  const base = window.location.href.split("?")[0].split("#")[0];
  return `${base}?product=${encodeURIComponent(product.id)}`;
}

function renderShareButtons(product) {
  const shareUrl = buildShareUrl(product);
  const tagline  = product.curationLine || BRAND.tagline;
  const imgUrl   = product.image.startsWith("http") ? product.image : shareUrl;

  /* ── Editorial share text per platform ─────────────────────────── */
  const waText    = `✨ ${product.name} — ABDAN\n\n${tagline}\n\n→ ${shareUrl}`;
  const tgText    = `✨ ${product.name} — ABDAN\n${tagline}`;
  const xText     = `${product.name} — quietly chosen for you ✨\n\n${tagline}`;
  const pinDesc   = `${product.name} | ABDAN — ${tagline}`;

  const eUrl      = encodeURIComponent(shareUrl);
  const eWaText   = encodeURIComponent(waText);
  const eTgText   = encodeURIComponent(tgText);
  const eXText    = encodeURIComponent(xText);
  const eImg      = encodeURIComponent(imgUrl);
  const ePin      = encodeURIComponent(pinDesc);

  /* ── Share chips — WhatsApp first, Copy last ────────────────────── */
  const buttons = [
    ...(navigator.share ? [{
      platform: "native", href: "#native-share", icon: "icon-native-share",
      label: "Share", native: true,
    }] : []),
    {
      platform: "whatsapp",
      href: `https://wa.me/?text=${eWaText}`,
      icon: "icon-whatsapp", label: "WhatsApp",
    },
    {
      platform: "telegram",
      href: `https://t.me/share/url?url=${eUrl}&text=${eTgText}`,
      icon: "icon-telegram", label: "Telegram",
    },
    {
      platform: "x",
      href: `https://x.com/intent/tweet?text=${eXText}&url=${eUrl}&hashtags=ABDAN,ModestFashion`,
      icon: "icon-x", label: "X",
    },
    {
      platform: "pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${eUrl}&media=${eImg}&description=${ePin}`,
      icon: "icon-pinterest", label: "Pinterest",
    },
    {
      platform: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${eUrl}`,
      icon: "icon-facebook", label: "Facebook",
    },
    {
      platform: "copy", href: "#copy-link", icon: "icon-copy-link",
      label: "Copy link", copy: true,
    },
  ];

  dom.shareButtons.innerHTML = buttons.map((btn) => `
    <a class="share-btn" data-platform="${btn.platform}"
       href="${btn.href}"
       ${btn.native || btn.copy ? "" : 'target="_blank" rel="noreferrer"'}
       ${btn.native ? 'data-native-share="true"' : ""}
       ${btn.copy   ? 'data-copy-link="true"'    : ""}
       aria-label="Share on ${btn.label}"
       role="listitem">
      <svg class="social-icon" aria-hidden="true"><use href="#${btn.icon}"/></svg>
      <span>${btn.label}</span>
    </a>
  `).join("");

  /* Native share handler */
  dom.shareButtons.querySelector('[data-native-share="true"]')?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await navigator.share({
        title: `${product.name} — ABDAN`,
        text: tagline,
        url: shareUrl,
      });
    } catch { /* user cancelled — silent */ }
  });

  /* Copy link handler */
  dom.shareButtons.querySelector('[data-copy-link="true"]')?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* Clipboard API unavailable — execCommand fallback */
      const tmp = document.createElement("input");
      tmp.value = shareUrl;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
    showToast("Link copied 💛");
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
    button.addEventListener("click", () => {
      container.querySelectorAll(".option-chip").forEach((chip) => {
        chip.classList.toggle("is-selected", chip.dataset.optionValue === button.dataset.optionValue);
      });

      /* ── Chip spring selection micro-interaction ──────────────────── */
      button.classList.remove("lx-selecting");
      requestAnimationFrame(() => {
        button.classList.add("lx-selecting");
        button.addEventListener("animationend", () => {
          button.classList.remove("lx-selecting");
        }, { once: true });
      });

      onClick(button.dataset.optionValue || "");
    });
  });
}

/* ── Overlay depth: body class drives support-pill fade + future depth hooks */
function updateOverlayState() {
  const anyOpen =
    dom.cartDrawer.classList.contains("is-open") ||
    dom.productSheet.classList.contains("is-open") ||
    dom.teaserModal.classList.contains("is-open");
  dom.body.classList.toggle("has-overlay", anyOpen);
}

function openProduct(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  state.activeProductId = productId;
  state.selectedSize = product.sizes?.[0] || DEFAULT_SIZES[0];
  state.selectedColor = product.colors?.[0] || DEFAULT_COLORS[0];

  /* ── Modal image: reset skeleton + fade-in on load ─────────────────── */
  const mediaEl = dom.productSheet.querySelector(".product-sheet__media");
  dom.productImage.classList.remove("img-loaded");
  if (mediaEl) mediaEl.classList.remove("img-loaded");
  dom.productImage.src = product.image;
  dom.productImage.alt = product.name;
  const onModalLoad = () => {
    dom.productImage.classList.add("img-loaded");
    if (mediaEl) mediaEl.classList.add("img-loaded");
  };
  if (dom.productImage.complete && dom.productImage.naturalWidth > 0) {
    requestAnimationFrame(onModalLoad); /* rAF ensures CSS transition fires */
  } else {
    dom.productImage.addEventListener("load", onModalLoad, { once: true });
    dom.productImage.addEventListener("error", onModalLoad, { once: true });
  }
  dom.productTag.textContent = product.primaryTag;
  dom.productName.textContent = product.name;
  dom.productPrice.textContent = product.priceLabel;
  if (dom.productIntro) dom.productIntro.textContent = product.curationLine || "";
  dom.productDescription.textContent = product.description;
  dom.productSoul.textContent = product.soul;
  dom.productStyling.textContent = product.styling;
  if (dom.productReach) dom.productReach.textContent = product.reach || "";
  if (dom.productMadeFor) dom.productMadeFor.textContent = product.madeFor || "";
  if (dom.productPairs) dom.productPairs.textContent = product.pairsBeautifully || "";
  if (dom.productMoments) {
    dom.productMoments.innerHTML = (product.softMoments || [])
      .map((m) => `<li>${m}</li>`)
      .join("");
  }
  dom.productFacts.innerHTML = product.specs
    .map(([label, value]) => `<div class="product-fact"><strong>${label}</strong><span>${value}</span></div>`)
    .join("");

  renderOptionChips(dom.sizeChips, product.sizes?.length ? product.sizes : DEFAULT_SIZES, state.selectedSize, (value) => {
    state.selectedSize = value;
    dom.selectedSizeLabel.textContent = value;
  });
  renderOptionChips(dom.colorChips, product.colors?.length ? product.colors : DEFAULT_COLORS, state.selectedColor, (value) => {
    state.selectedColor = value;
    dom.selectedColorLabel.textContent = value;
  });

  dom.selectedSizeLabel.textContent = state.selectedSize || "Select";
  dom.selectedColorLabel.textContent = state.selectedColor || "Select";
  dom.productCheckoutPanel.hidden = true;
  renderShareButtons(product);

  /* Reset scroll so every open starts from the top of the content area */
  const contentEl = dom.productSheet.querySelector(".product-sheet__content");
  if (contentEl) contentEl.scrollTop = 0;

  dom.productSheet.classList.add("is-open");
  dom.productSheet.setAttribute("aria-hidden", "false");
  dom.body.classList.add("is-locked");
  updateOverlayState();
  safeCreateIcons();
}

function closeProduct() {
  dom.productSheet.classList.remove("is-open");
  dom.productSheet.setAttribute("aria-hidden", "true");
  if (!dom.cartDrawer.classList.contains("is-open") && !dom.teaserModal.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
  updateOverlayState();
}

function renderCart() {
  /* ── reset checkout button visibility ──────────────────────────────── */
  dom.cartCheckoutButton.hidden = false;
  dom.cartCheckoutButton.disabled = false;
  dom.cartCheckoutButton.style.opacity = "1";

  if (!state.cart.length) {
    dom.cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">💛</div>
        <p class="cart-empty__heading">Your bag is waiting</p>
        <p>When a piece feels like it belongs to you, it will hold its place here — quietly, patiently, just for you.</p>
      </div>`;
    dom.cartTotal.textContent = formatCurrency(0);
    dom.cartCount.textContent = "0";
    dom.cartCheckoutButton.disabled = true;
    dom.cartCheckoutButton.style.opacity = "0.45";
    dom.bagCheckoutPanel.hidden = true;
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0);
  dom.cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <article class="cart-item">
          <div class="cart-item__thumb">
            <img src="${item.image}" alt="${item.name}" loading="lazy" />
          </div>
          <div class="cart-item__info">
            <div class="cart-item__header">
              <h3>${item.name}</h3>
              <button type="button" class="remove-button" data-remove="${item.key}" aria-label="Remove ${item.name}">
                <i data-lucide="x"></i>
              </button>
            </div>
            <div class="cart-meta">${item.size} · ${item.color}</div>
            <div class="cart-item__footer">
              <span class="cart-price">${item.priceLabel}</span>
              <div class="cart-qty">
                <button type="button" class="qty-button" data-qty="decrease" data-cart-key="${item.key}">−</button>
                <span>${item.quantity}</span>
                <button type="button" class="qty-button" data-qty="increase" data-cart-key="${item.key}">+</button>
              </div>
            </div>
          </div>
        </article>
      `,
    )
    .join("");

  dom.cartTotal.textContent = formatCurrency(total);
  dom.cartCount.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));

  /* ── Cart image fade-in — same pattern as product cards ─────────────── */
  dom.cartItems.querySelectorAll(".cart-item__thumb img").forEach((img) => {
    const thumb = img.closest(".cart-item__thumb");
    const onLoad = () => {
      img.classList.add("img-loaded");
      thumb?.classList.add("img-loaded"); /* stops skeleton breath on thumb */
    };
    if (img.complete && img.naturalWidth > 0) requestAnimationFrame(onLoad);
    else {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    }
  });

  safeCreateIcons();
}

function showOrderSuccess(customerName, order) {
  const first = (customerName || "").split(" ")[0] || "lovely";
  const ref   = order?.ref || "";
  /* SVG checkmark: circle (r=36, circumference≈226) + tick mark (path len≈60) */
  const checkSvg = `
    <svg class="order-check" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle
        class="order-check__circle"
        cx="36" cy="36" r="35"
        stroke="var(--emerald)" stroke-width="2.5"
        fill="none"
      />
      <polyline
        class="order-check__mark"
        points="20,37 30,48 52,25"
        stroke="var(--emerald)" stroke-width="2.8"
        stroke-linecap="round" stroke-linejoin="round"
        fill="none"
      />
    </svg>`;
  const timeline = renderOrderTimeline("confirmed");
  dom.cartItems.innerHTML = `
    <div class="cart-success">
      ${checkSvg}
      <p class="cart-success__title">Order received, ${first}</p>
      <p class="cart-success__body">Your selection has been received with the same care you put into choosing it. ABDAN will confirm and prepare your pieces personally.</p>
      <p class="cart-success__note">Opening WhatsApp now so you can follow up directly with us. 💛</p>
      ${ref ? `<p class="cart-success__ref">Ref · ${ref}</p>` : ""}
      ${timeline}
    </div>`;
  dom.cartTotal.textContent = formatCurrency(0);
  dom.cartCount.textContent = "0";
  dom.cartCheckoutButton.hidden = true;
  dom.bagCheckoutPanel.hidden = true;
  safeCreateIcons();
}

/* ── Luxury cart fly: thumbnail glides from product image → cart icon ──
   Physics: true parabolic arc with 4-keyframe WAAPI path.
   Orb: 52px — refined and lighter than the original 60px.
   Arc: minimum 90px lift, scales up with travel distance for long arcs.
   Opacity: 1 → 0.88 → 0.55 → 0 (gradual fade, not a hard cutoff).       */
function lxCartFly(srcRect, destRect, imageSrc) {
  if (!imageSrc || typeof Element.prototype.animate !== "function") return;
  if (LX_MOTION.reduced()) return;

  const size   = 52;
  const startX = srcRect.left  + srcRect.width  / 2 - size / 2;
  const startY = srcRect.top   + srcRect.height / 2 - size / 2;
  const endX   = destRect.left + destRect.width  / 2 - size / 2;
  const endY   = destRect.top  + destRect.height / 2 - size / 2;

  /* Parabolic lift: scales with travel distance, minimum 90px */
  const travel  = Math.hypot(endX - startX, endY - startY);
  const arcLift = Math.max(90, travel * 0.22);

  /* Two intermediate control points create a smooth parabola */
  const mid1X = startX + (endX - startX) * 0.35;
  const mid1Y = Math.min(startY, endY) - arcLift;       /* apex of the arc  */

  const mid2X = startX + (endX - startX) * 0.68;
  const mid2Y = mid1Y + (Math.max(startY, endY) - mid1Y) * 0.55; /* descent */

  const orb = document.createElement("img");
  orb.src       = imageSrc;
  orb.className = "lx-cart-orb";
  orb.setAttribute("aria-hidden", "true");
  orb.style.cssText = `width:${size}px;height:${size}px;left:0;top:0;transform:translate(${startX}px,${startY}px)`;
  document.body.appendChild(orb);

  orb.animate(
    [
      { transform: `translate(${startX}px,${startY}px) scale(1)`,    opacity: 1,    offset: 0    },
      { transform: `translate(${mid1X}px,${mid1Y}px) scale(0.76)`,   opacity: 0.88, offset: 0.36 },
      { transform: `translate(${mid2X}px,${mid2Y}px) scale(0.44)`,   opacity: 0.55, offset: 0.70 },
      { transform: `translate(${endX}px,${endY}px) scale(0.16)`,     opacity: 0,    offset: 1    },
    ],
    { duration: LX_MOTION.cinematic, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
  ).onfinish = () => orb.remove();
}

/* ── Luxury cart pulse helper ────────────────────────────────────────── */
function lxPulseCart() {
  dom.cartToggle.classList.remove("is-popping", "is-pulsing");
  requestAnimationFrame(() => {
    dom.cartToggle.classList.add("is-pulsing");
    dom.cartToggle.addEventListener("animationend", () => {
      dom.cartToggle.classList.remove("is-pulsing");
    }, { once: true });
  });

  /* Count bubble pop */
  dom.cartCount.classList.remove("is-counting");
  requestAnimationFrame(() => {
    dom.cartCount.classList.add("is-counting");
    dom.cartCount.addEventListener("animationend", () => {
      dom.cartCount.classList.remove("is-counting");
    }, { once: true });
  });
}

/* ── Wishlist helpers ────────────────────────────────────────────────────
   Persist saved product IDs to localStorage. Same-device persistence.     */
function getWishlist() {
  try { return new Set(JSON.parse(localStorage.getItem("abdan-wishlist") || "[]")); }
  catch { return new Set(); }
}

function saveWishlist(set) {
  try { localStorage.setItem("abdan-wishlist", JSON.stringify([...set])); }
  catch { /* quota */ }
}

function toggleWishlist(productId, btn) {
  const wl = getWishlist();
  const saving = !wl.has(productId);
  if (saving) {
    wl.add(productId);
    btn.classList.add("is-saved");
    btn.setAttribute("aria-label", "Remove from wishlist");
    /* WAAPI heart bloom — GPU scale spring */
    const svg = btn.querySelector("svg");
    if (svg && typeof svg.animate === "function") {
      svg.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.42)", offset: 0.28 },
          { transform: "scale(0.84)", offset: 0.56 },
          { transform: "scale(1.10)", offset: 0.78 },
          { transform: "scale(1)" },
        ],
        { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
      );
    }
    showToast("Quietly saved 💛");
  } else {
    wl.delete(productId);
    btn.classList.remove("is-saved");
    btn.setAttribute("aria-label", "Save to wishlist");
  }
  saveWishlist(wl);
}

/* ── Hero parallax — barely-there editorial depth ───────────────────────
   Hero image moves up at 4% of scroll speed. Feels like depth, not motion.
   Skipped entirely for prefers-reduced-motion users.                      */
function initHeroParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const img  = document.querySelector(".hero-visual .visual-card--image img");
  const hero = document.querySelector(".hero-section");
  if (!img || !hero) return;

  let ticking = false;
  const update = () => {
    const scrollY    = window.scrollY;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    /* Only apply while hero is in view — stop once scrolled past */
    if (scrollY <= heroBottom) {
      img.style.transform = `translateY(-${(scrollY * 0.04).toFixed(2)}px)`;
    } else if (img.style.transform) {
      img.style.transform = "";
    }
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ── Luxury swipe-to-close: cart drawer + product sheet ─────────────────
   Touch gesture dismiss: swipe right → close cart, swipe down → close sheet
   (mobile only). Rubber-band resistance makes the pull feel elastic.
   Spring-back if threshold not met — stays attached to the user's finger.
   Fully disabled when prefers-reduced-motion is set.                       */
function initSwipeGestures() {
  if (LX_MOTION.reduced()) return;

  /* Cart drawer — swipe right to dismiss */
  const cartPanel = dom.cartDrawer?.querySelector(".cart-drawer__panel");
  if (dom.cartDrawer && cartPanel) {
    attachSwipe(dom.cartDrawer, cartPanel, {
      axis:        "x",
      closeDir:    1,       /* positive x = rightward */
      threshold:   88,      /* px distance for confident swipe  */
      velocityMin: 0.38,    /* px/ms for a quick flick          */
      onClose:     closeCart,
    });
  }

  /* Product sheet — swipe down to dismiss, mobile only (≤ 800px) */
  const sheetPanel = dom.productSheet?.querySelector(".product-sheet__panel");
  if (dom.productSheet && sheetPanel) {
    attachSwipe(dom.productSheet, sheetPanel, {
      axis:        "y",
      closeDir:    1,       /* positive y = downward            */
      threshold:   110,
      velocityMin: 0.42,
      onClose:     closeProduct,
      mobileOnly:  true,
    });
  }
}

/* attachSwipe — shared touch-gesture engine for any panel element ──────
   Resistance: Math.sqrt(raw) × 5.5 gives decelerating elastic feel.
   The panel follows the finger but resists being pulled too far.
   On release: if distance or velocity exceeds threshold → close.
   Otherwise: clear inline transform → CSS transitions spring it back.     */
function attachSwipe(container, panel, opts) {
  const { axis, closeDir, threshold, velocityMin, onClose, mobileOnly } = opts;

  let startPos  = 0;
  let startTime = 0;
  let lastDelta = 0;
  let active    = false;

  function getPos(e) {
    const p = e.touches?.[0] ?? e;
    return axis === "x" ? p.clientX : p.clientY;
  }

  function onStart(e) {
    if (mobileOnly && window.innerWidth > 800) return;

    /* Don't intercept when content is scrolled — let native scroll run */
    const scrollEl = panel.querySelector(".drawer-body, .product-sheet__content");
    if (scrollEl && axis === "y" && scrollEl.scrollTop > 4) return;

    startPos  = getPos(e);
    startTime = Date.now();
    lastDelta = 0;
    active    = true;
  }

  function onMove(e) {
    if (!active) return;
    const raw = (getPos(e) - startPos) * closeDir;
    if (raw <= 0) { lastDelta = 0; return; }  /* wrong direction — no-op */
    lastDelta = raw;

    /* Rubber-band: sqrt decay gives elastic resistance that grows heavy */
    const drag = Math.sqrt(raw) * 5.5;
    panel.style.transition = "none";
    panel.style.transform  = axis === "x"
      ? `translateX(${drag}px)`
      : `translateY(${drag}px)`;
  }

  function onEnd() {
    if (!active) return;
    active = false;

    const velocity = lastDelta / Math.max(Date.now() - startTime, 1);

    /* Restore CSS transitions before clearing inline style */
    panel.style.transition = "";
    panel.style.transform  = "";

    if (lastDelta > threshold || velocity > velocityMin) {
      onClose();          /* CSS close animation plays naturally */
    }
    /* else: CSS springs panel back to its open-state transform */
  }

  container.addEventListener("touchstart",  onStart, { passive: true });
  container.addEventListener("touchmove",   onMove,  { passive: true });
  container.addEventListener("touchend",    onEnd,   { passive: true });
  container.addEventListener("touchcancel", onEnd,   { passive: true });
}

/* ── Create and persist an order record ──────────────────────────────────
   Saves to abdan-studio-orders (same key the Studio reads).
   Returns the generated order object.                                      */
function lxCreateOrder(details, items, paymentMethod, extra = {}) {
  const total = items.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0);
  const ref   = `ABD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const order = {
    id:            ref,
    ref,
    customerName:  details.name,
    customerPhone: details.phone,
    customerEmail: details.email || "",
    status:        "confirmed",
    paymentMethod,
    paymentId:     extra.paymentId || "",
    total,
    items: items.map((item) => ({
      name:       item.name,
      size:       item.size,
      color:      item.color,
      quantity:   item.quantity,
      priceLabel: item.priceLabel,
    })),
    notes:     details.notes || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  try {
    const existing = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]");
    existing.unshift(order);
    localStorage.setItem("abdan-studio-orders", JSON.stringify(existing));
  } catch { /* quota — continue silently */ }
  return order;
}

/* ── Build HTML for the vertical order state timeline ────────────────────
   currentStatus: one of ORDER_STATES[].key                                */
function renderOrderTimeline(currentStatus) {
  const activeIdx = ORDER_STATES.findIndex((s) => s.key === currentStatus);
  const rows = ORDER_STATES.map((state, idx) => {
    const isDone   = idx < activeIdx;
    const isActive = idx === activeIdx;
    const stateClass = isDone ? "order-state--done" : isActive ? "order-state--active" : "";
    const isLast     = idx === ORDER_STATES.length - 1;
    const lineClass  = isDone ? "order-state__line--filled" : (idx === activeIdx - 1 ? "order-state__line--filling" : "");
    return `
      <div class="order-state ${stateClass}">
        <div class="order-state__left">
          <div class="order-state__dot"></div>
          ${!isLast ? `<div class="order-state__line ${lineClass}"></div>` : ""}
        </div>
        <div class="order-state__content">
          <div class="order-state__label">${state.label}</div>
          ${isActive ? `<div class="order-state__note">${state.note}</div>` : ""}
        </div>
      </div>`;
  }).join("");
  return `<div class="order-timeline" role="list" aria-label="Order status">${rows}</div>`;
}

/* ── Smooth checkout panel reveal / hide (respects hidden attribute) ─────
   The `hidden` attribute means `display:none` — CSS transitions won't fire.
   We bridge the gap with .is-revealing / .is-hiding classes that force
   `display:block` during the animation window, then settle hidden state.   */
function lxShowCheckoutPanel(panel) {
  if (!panel) return;
  panel.removeAttribute("hidden");
  panel.classList.remove("is-hiding");
  panel.classList.add("is-revealing");
  const onDone = () => {
    panel.classList.remove("is-revealing");
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  panel.addEventListener("animationend", onDone, { once: true });
}

function lxHideCheckoutPanel(panel) {
  if (!panel || panel.hidden) return;
  panel.classList.remove("is-revealing");
  panel.classList.add("is-hiding");
  const onDone = () => {
    panel.classList.remove("is-hiding");
    panel.hidden = true;
  };
  panel.addEventListener("animationend", onDone, { once: true });
}

function addToCart() {
  const product = getActiveProduct();
  if (!product) return;

  if (!state.selectedSize || !state.selectedColor) {
    showToast("Choose a size and colour to continue. 💛");
    return;
  }

  /* ── Capture geometry BEFORE any DOM changes ─────────────────────────
     Both elements must be in the viewport at this moment.                */
  const imgRect  = dom.productImage?.getBoundingClientRect();
  const cartRect = dom.cartToggle?.getBoundingClientRect();

  /* ── Button spring compress ──────────────────────────────────────────
     WAAPI: instant depress → spring release, all GPU-composited.         */
  if (dom.addToCartButton && typeof dom.addToCartButton.animate === "function") {
    dom.addToCartButton.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.91)", offset: 0.14 },
        { transform: "scale(1.025)", offset: 0.62 },
        { transform: "scale(1)" },
      ],
      { duration: 420, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    );
  }

  /* ── State update ────────────────────────────────────────────────── */
  const key = `${product.id}::${state.selectedSize}::${state.selectedColor}`;
  const existing = state.cart.find((item) => item.key === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      key,
      id:         product.id,
      name:       product.name,
      priceLabel: product.priceLabel,
      image:      product.image,
      size:       state.selectedSize,
      color:      state.selectedColor,
      quantity:   1,
    });
  }
  saveCart();
  renderCart();

  /* ── Launch fly orb (geometry captured above) ────────────────────── */
  if (imgRect && cartRect) lxCartFly(imgRect, cartRect, product.image);

  closeProduct();
  openCart();

  /* ── Cart pulse + count pop: timed to fly-orb arrival (~560ms) ────── */
  setTimeout(lxPulseCart, 520);

  /* ── Success glow on button — fires while sheet is sliding out ────── */
  if (dom.addToCartButton) {
    setTimeout(() => {
      dom.addToCartButton.classList.add("lx-success");
      dom.addToCartButton.addEventListener("animationend", () => {
        dom.addToCartButton.classList.remove("lx-success");
      }, { once: true });
    }, 60);
  }
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
  updateOverlayState();
}

function closeCart() {
  dom.cartDrawer.classList.remove("is-open");
  dom.cartDrawer.setAttribute("aria-hidden", "true");
  if (!dom.productSheet.classList.contains("is-open") && !dom.teaserModal.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
  updateOverlayState();
}

function toggleBagCheckout() {
  if (!state.cart.length) return;
  if (dom.bagCheckoutPanel.hidden) {
    lxShowCheckoutPanel(dom.bagCheckoutPanel);
  } else {
    lxHideCheckoutPanel(dom.bagCheckoutPanel);
  }
}

function toggleProductCheckout() {
  if (dom.productCheckoutPanel.hidden) {
    lxShowCheckoutPanel(dom.productCheckoutPanel);
  } else {
    lxHideCheckoutPanel(dom.productCheckoutPanel);
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
    showToast("Please add your name and phone number to continue. 💛");
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
    showToast("Razorpay couldn't load. Please try UPI or reach us on WhatsApp. 💛");
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
      const url   = buildWhatsAppOrderMessage(details, items, "Razorpay", { paymentId: response.razorpay_payment_id });
      const order = lxCreateOrder(details, items, "Razorpay", { paymentId: response.razorpay_payment_id });
      state.cart  = [];
      saveCart();
      showOrderSuccess(details.name, order);
      setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 900);
    },
  };

  const instance = new window.Razorpay(options);
  instance.open();
}

function launchUpi(details, items) {
  const url   = buildWhatsAppOrderMessage(details, items, "UPI / Manual confirmation");
  const order = lxCreateOrder(details, items, "UPI");
  window.open(BRAND.upiLink, "_blank", "noopener,noreferrer");
  state.cart  = [];
  saveCart();
  showOrderSuccess(details.name, order);
  setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 900);
}

function setButtonLoading(button, loadingLabel) {
  button._originalText = button.textContent;
  button.textContent   = loadingLabel;
  button.classList.add("is-loading");
  button.disabled = true;
  /* WAAPI gentle compress → settle — signals something is happening */
  if (typeof button.animate === "function") {
    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.96)", offset: 0.18 },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
    );
  }
}

function resetButtonLoading(button) {
  button.textContent = button._originalText || button.textContent;
  button.classList.remove("is-loading");
  button.disabled = false;
  delete button._originalText;
}

function handleBagRazorpay() {
  const details = getFormPayload(dom.bagCheckoutForm);
  if (!validateCheckoutDetails(details)) return;
  setButtonLoading(dom.bagRazorpayButton, "Opening payment…");
  /* Reset after Razorpay opens its modal — brief feedback window */
  setTimeout(() => resetButtonLoading(dom.bagRazorpayButton), 1800);
  launchRazorpay(details, state.cart);
}

function handleBagUpi() {
  const details = getFormPayload(dom.bagCheckoutForm);
  if (!validateCheckoutDetails(details)) return;
  setButtonLoading(dom.bagUpiButton, "Redirecting…");
  setTimeout(() => resetButtonLoading(dom.bagUpiButton), 1800);
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
  setButtonLoading(dom.productRazorpayButton, "Opening payment…");
  setTimeout(() => resetButtonLoading(dom.productRazorpayButton), 1800);
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
  setButtonLoading(dom.productUpiButton, "Redirecting…");
  setTimeout(() => resetButtonLoading(dom.productUpiButton), 1800);
  launchUpi(details, lineItems);
}

async function copyUpi() {
  try {
    await navigator.clipboard.writeText(BRAND.upiId);
    showToast("UPI ID copied quietly 💛");
  } catch {
    showToast(`UPI: ${BRAND.upiId}`);
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
  updateOverlayState();
}

function closeTeaser() {
  dom.teaserModal.classList.remove("is-open");
  dom.teaserModal.setAttribute("aria-hidden", "true");
  if (!dom.productSheet.classList.contains("is-open") && !dom.cartDrawer.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
  updateOverlayState();
}

function revealElements() {
  if (!_revealObserver) {
    _revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            _revealObserver.unobserve(entry.target);
          }
        });
      },
      /* threshold 0.1: element is 10% visible before reveal fires.
         rootMargin -3% bottom: shrinks the observable area slightly,
         so elements trigger when they're more solidly in view —
         feels deliberate rather than reactive.                       */
      { threshold: 0.1, rootMargin: "0px 0px -3% 0px" },
    );
  }
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((element) => _revealObserver.observe(element));
}

/* ── Editorial stagger: grouped cards emerge in reading order ────────────
   Story / testimonial / teaser cards stagger within their section.
   Delays are gentle (60-80ms) — subtle enough to feel like breathing,
   not so dramatic they draw attention to the animation itself.           */
function applyRevealStagger() {
  document.querySelectorAll(".story-grid .story-card").forEach((card, i) => {
    card.style.setProperty("--reveal-delay", `${i * 80}ms`);
  });
  document.querySelectorAll(".testimonial-grid .testimonial-card").forEach((card, i) => {
    card.style.setProperty("--reveal-delay", `${i * 65}ms`);
  });
  document.querySelectorAll(".teaser-grid .teaser-card").forEach((card, i) => {
    card.style.setProperty("--reveal-delay", `${i * 80}ms`);
  });
  const accountFeatures = document.querySelector(".account-features");
  if (accountFeatures) accountFeatures.style.setProperty("--reveal-delay", "100ms");
}

function updateDockActive(targetId) {
  dom.bottomDock.querySelectorAll(".dock-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === targetId);
  });

  /* Pill morph: center the active tab within the scrollable dock.
     Uses requestAnimationFrame so the pill has already expanded
     before we measure its post-transition width.                    */
  requestAnimationFrame(() => {
    const activeBtn = dom.bottomDock.querySelector(".dock-link.is-active");
    if (!activeBtn) return;
    const dock = dom.bottomDock;
    const scrollTarget = activeBtn.offsetLeft - (dock.offsetWidth / 2) + (activeBtn.offsetWidth / 2);
    dock.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });
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
  if (dom.adminLoginForm) {
    dom.adminLoginForm.addEventListener("submit", (event) => {
      void handleAdminLogin(event);
    });
  }
  if (dom.adminSignout) {
    dom.adminSignout.addEventListener("click", handleAdminSignout);
  }
  window.addEventListener("hashchange", renderAdminRoute);

  dom.filterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter || "All";

    /* ── Filter chip spring micro-interaction ─────────────────────── */
    button.classList.remove("lx-selecting");
    requestAnimationFrame(() => {
      button.classList.add("lx-selecting");
      button.addEventListener("animationend", () => {
        button.classList.remove("lx-selecting");
      }, { once: true });
    });

    renderFilters();
    renderProducts();
  });

  dom.productsGrid.addEventListener("click", (event) => {
    /* Wishlist save button takes priority — stops card-open from firing */
    const saveBtn = event.target.closest("[data-wishlist]");
    if (saveBtn) {
      event.stopPropagation();
      toggleWishlist(saveBtn.dataset.wishlist || "", saveBtn);
      return;
    }
    const previewButton = event.target.closest("[data-preview]");
    const card          = event.target.closest("[data-product-card]");
    const productId     = previewButton?.dataset.preview || card?.dataset.productCard;
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

  /* ── iOS touch physics: pointer-driven press for product cards ────────
     Bypasses browser scroll-detection delay so press feedback is instant.
     Release is handled by removing the class → base spring transition fires. */
  dom.productsGrid.addEventListener("pointerdown", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    card.classList.add("is-pressing");
    const release = () => {
      card.classList.remove("is-pressing");
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
    window.addEventListener("pointerup", release, { once: true });
    window.addEventListener("pointercancel", release, { once: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeProduct();
      closeTeaser();
    }
  });

  /* ── Your Space view navigation ──────────────────────────────────── */
  /* ── Password eye toggles ─────────────────────────────────────────── */
  document.addEventListener("click", (event) => {
    const eyeBtn = event.target.closest("[data-eye]");
    if (!eyeBtn) return;
    const wrap  = eyeBtn.closest(".space-field__input-wrap, .admin-field__input-wrap");
    const input = wrap?.querySelector("input[type=password], input[type=text]");
    if (!input) return;
    const showing = input.type === "text";
    input.type    = showing ? "password" : "text";
    eyeBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    const icon    = eyeBtn.querySelector("[data-lucide]");
    if (icon) {
      icon.setAttribute("data-lucide", showing ? "eye" : "eye-off");
      safeCreateIcons();
    }
  });

  document.getElementById("spaceSigninBtn")?.addEventListener("click", () => showSpaceView("spaceSignin"));
  document.getElementById("spaceCreateBtn")?.addEventListener("click", () => showSpaceView("spaceCreate"));
  document.getElementById("spaceSigninBack")?.addEventListener("click", () => showSpaceView("spaceEntry"));
  document.getElementById("spaceCreateBack")?.addEventListener("click", () => showSpaceView("spaceEntry"));
  document.getElementById("spaceToCreate")?.addEventListener("click", () => showSpaceView("spaceCreate"));
  document.getElementById("spaceToSignin")?.addEventListener("click", () => showSpaceView("spaceSignin"));
  document.getElementById("spaceSignoutBtn")?.addEventListener("click", handleSpaceSignout);

  /* ── Forgot password reveal ─────────────────────────────────────── */
  document.getElementById("spaceForgotBtn")?.addEventListener("click", () => {
    const panel = document.getElementById("spaceRecovery");
    if (!panel) return;
    const isOpen = panel.classList.toggle("is-open");
    const btn    = document.getElementById("spaceForgotBtn");
    if (btn) btn.textContent = isOpen ? "Never mind" : "Need help entering your space?";
    safeCreateIcons();
  });
  document.getElementById("spaceSigninForm")?.addEventListener("submit", (e) => void handleSpaceSignin(e));
  document.getElementById("spaceCreateForm")?.addEventListener("submit", (e) => void handleSpaceCreate(e));

  /* ── Support pill — intelligent form awareness ───────────────────────
     Hides the floating pill whenever any input/textarea receives focus
     so it never obscures form fields, CTAs, or the virtual keyboard.
     Restores after a 150ms debounce to avoid flicker between fields.  */
  const supportPill = document.getElementById("supportPill");
  let _pillRestoreTimer = null;

  document.addEventListener("focusin", (e) => {
    if (!e.target.matches("input, textarea, select")) return;
    clearTimeout(_pillRestoreTimer);
    supportPill?.classList.add("is-form-focused");
  });

  document.addEventListener("focusout", (e) => {
    if (!e.target.matches("input, textarea, select")) return;
    _pillRestoreTimer = setTimeout(() => {
      if (!document.activeElement?.matches("input, textarea, select")) {
        supportPill?.classList.remove("is-form-focused");
      }
    }, 150);
  });

  /* ── Cross-tab admin auth sync ───────────────────────────────────────
     If the admin token is cleared in another tab (signout), update the
     local state immediately so this tab doesn't stay in a stale
     authenticated state.                                               */
  window.addEventListener("storage", (e) => {
    if (e.key !== "abdan-admin-token") return;
    if (!e.newValue) {
      /* Token was removed in another tab — mirror the signout */
      state.adminAuthenticated = false;
      sessionStorage.removeItem("abdan-admin-auth");
    } else {
      /* Token was written in another tab — mirror the login */
      try {
        const t = JSON.parse(e.newValue);
        if (t && t.v === "true" && t.exp > Date.now()) {
          state.adminAuthenticated = true;
          sessionStorage.setItem("abdan-admin-auth", "true");
        }
      } catch { /* ignore */ }
    }
  });
}

/* ── Luxury Entry Experience ─────────────────────────────────────────────
   Cinematic branded opening — shown once per browser session.
   Session guard: inline script in <head> sets [data-entry-skip="1"] on
   <html> before first paint, so CSS hides the overlay if already seen.
   Sequence: wordmark (150ms) → tagline (620ms) → breathe (980ms) →
             overlay fades out (1050ms, 540ms transition → done ~1590ms).
   Respects prefers-reduced-motion: all durations collapse to 1ms.        */
function initEntryExperience() {
  const el = document.getElementById("lxEntry");
  if (!el) return;

  /* Session guard already handled by CSS (data-entry-skip hides overlay).
     If it's hidden we just clean it up from the DOM silently.             */
  if (document.documentElement.dataset.entrySkip === "1") {
    el.remove();
    return;
  }

  /* Mark session so next load skips the entry */
  try { sessionStorage.setItem("abdan-entry-seen", "1"); } catch { /* quota */ }

  const wordmark = el.querySelector(".lx-entry__wordmark");
  const tagline  = el.querySelector(".lx-entry__tagline");
  const breathe  = el.querySelector(".lx-entry__breathe");

  /* Reduced motion: skip animation, dissolve quickly */
  if (LX_MOTION.reduced()) {
    if (wordmark) wordmark.classList.add("is-visible");
    if (tagline)  tagline.classList.add("is-visible");
    setTimeout(() => {
      el.classList.add("is-done");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
    }, 280);
    return;
  }

  /* Step 1 — wordmark drifts in */
  setTimeout(() => wordmark?.classList.add("is-visible"), 150);

  /* Step 2 — tagline softly follows */
  setTimeout(() => tagline?.classList.add("is-visible"), 620);

  /* Step 3 — breathing line appears */
  setTimeout(() => breathe?.classList.add("is-visible"), 980);

  /* Step 4 — overlay dissolves, homepage revealed underneath */
  setTimeout(() => {
    el.classList.add("is-done");
    /* Remove from DOM after transition so it never blocks interaction */
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    /* Fallback: force-remove if transitionend never fires */
    setTimeout(() => el.remove(), 700);
  }, 1050);
}

/* ── Time-of-day atmospheric warmth ──────────────────────────────────────
   Applies a barely-visible sepia/saturation shift to the hero image based
   on the current hour. Max range: 5% sepia, 12% saturation — invisible on
   casual viewing but adds emotional warmth that users feel, not see.
   CSS handles the actual filter; JS only sets the [data-tod] attribute.    */
function initTimeOfDay() {
  const h = new Date().getHours();
  let tod = null;
  if (h >= 5  && h <= 10) tod = "morning"; /* soft dawn warmth          */
  if (h >= 16 && h <= 19) tod = "golden";  /* golden hour richness      */
  if (h >= 20 || h <= 4)  tod = "evening"; /* calm cinematic evening    */
  if (tod) document.documentElement.dataset.tod = tod;
}

function init() {
  // DEPLOYMENT STATUS: VERIFIED ✔
  // Logo: assets/abdan-icon.jpg — real brand icon, circular clip applied
  // Navbar: full section names per brand DNA (no abbreviation)
  // Layout: z-index hierarchy intact · no overlap regressions
  // Responsive: mobile scrollable dock + desktop pill nav validated
  // Dark mode: compatible · Static HTML/CSS/JS · Cloudflare Pages ready
  initEntryExperience();  /* must run first — covers page during render  */
  initTimeOfDay();
  setTheme(state.theme);
  renderFilters();
  renderProducts();
  renderFooterContent();
  renderCart();
  attachEvents();
  applyRevealStagger();
  revealElements();
  initDockObserver();
  initScrollChrome();
  initHeroParallax();
  initSwipeGestures();
  renderAdminRoute();
  initSpaceAuth();
  safeCreateIcons();

  /* ── Seed studio product catalog (first run only) ──────────────────── */
  if (!localStorage.getItem("abdan-studio-products")) {
    try {
      localStorage.setItem("abdan-studio-products", JSON.stringify(
        PRODUCTS.map((p) => ({
          id:           p.id,
          name:         p.name,
          price:        p.price,
          comparePrice: p.comparePrice || "",
          category:     p.primaryTag || "",
          sizes:        p.sizes || [],
          image:        p.image || "",
          image2:       p.image2 || "",
          image3:       p.image3 || "",
          description:  p.description || "",
          curationLine: p.curationLine || "",
          tags:         (p.tags || []).join(", "),
          inStock:      p.inStock !== false,
          status:       p.status || "active",
          featured:     !!p.featured,
          updatedAt:    new Date().toISOString(),
        }))
      ));
    } catch { /* quota */ }
  }

  /* ── Show active studio notices ─────────────────────────────────────── */
  try {
    const notices = JSON.parse(localStorage.getItem("abdan-studio-notices") || "[]");
    const active  = notices.filter((n) => n.active);
    const bar     = document.getElementById("studioNoticeBar");
    if (bar && active.length) {
      bar.textContent = active[0].text;
      bar.hidden = false;
    }
  } catch { /* ignore */ }

  /* ── Deep-link: auto-open product from ?product=ID URL param ──────── */
  const deepProduct = new URLSearchParams(window.location.search).get("product");
  if (deepProduct) {
    const found = PRODUCTS.find((p) => p.id === deepProduct);
    if (found) requestAnimationFrame(() => openProduct(found.id));
  }
  /* ── Page entrance: fade body in after full hydration ──────────────── */
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
}

window.addEventListener("DOMContentLoaded", init);
