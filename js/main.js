const BRAND = {
  name: "ABDAN",
  tagline: "Your devotion deserves to be seen.",
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
/* ── Order lifecycle — luxury journey storytelling ───────────────────────
   Every state is written as an emotional moment, not a logistics update.
   Language: restrained, warm, believable. Never forced or overwrought.     */
const ORDER_STATES = [
  { key: "confirmed",        label: "Carefully Reserved",               note: "Received with the same care you gave to choosing it. ABDAN will confirm personally. 💛" },
  { key: "preparing",        label: "Being Prepared Thoughtfully",      note: "Each piece is being packed with quiet attention — the way it deserves to travel." },
  { key: "shipped",          label: "Something Beautiful Is On Its Way", note: "On its journey to you — tracking details shared via WhatsApp." },
  { key: "out_for_delivery", label: "Arriving Quietly Soon",            note: "Almost with you now." },
  { key: "delivered",        label: "Resting Gently at Your Door",      note: "It has arrived. Wear it well, wear it yours. 💛" },
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
    description: `${hooks[hash]} ${connections[(hash + 1) % 3]} ${feels[(hash + 2) % 3]}`,
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
      "Because you have spent enough quiet evenings in the background. Sometimes the gathering is an invitation — not to be loud, but to let the softness speak.",
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
      "A warm and private space where women share style stories, ask for honest opinions, and celebrate each other's choices. That is the community taking shape, one voice at a time.",
  },
};

/* ── Editorial Campaign System ───────────────────────────────────────────
   Four daily-rotating editorial narratives. Each campaign is a luxury
   editorial direction — felt like an opening page, not a promotion.
   Rotation: Math.floor(Date.now() / 86400000) % 4 → stable all day.       */
const CAMPAIGNS = [
  {
    id:       "soft-light-slow-days",
    kicker:   "An editorial selection",
    headline: "Soft Light, Slow Days",
    body:     "Some pieces feel less like choices and more like recognitions — a silhouette that belongs to your mornings, a fabric that holds you through the day. These are those pieces.",
    mood:     "Everyday Grace",
  },
  {
    id:       "worn-between-sunlight",
    kicker:   "Quietly chosen for you",
    headline: "Worn Between Sunlight",
    body:     "The most honest dressing happens between appointments — the quiet hours when comfort and grace are chosen together, without compromise. These pieces understand that balance.",
    mood:     "Modest Essence",
  },
  {
    id:       "for-slower-evenings",
    kicker:   "Evening editorial",
    headline: "For Slower Evenings",
    body:     "There is a particular kind of beauty in the woman who arrives already composed — not from effort, but from having chosen something that simply holds her well through the hours that belong to her.",
    mood:     "Evening Calm",
  },
  {
    id:       "light-layers-warm-moments",
    kicker:   "The considered edit",
    headline: "Light Layers, Warmer Moments",
    body:     "Fabric that moves with the celebration rather than against it — chosen for the particular way festive dressing should feel: rich in feeling, light in spirit, deeply personal.",
    mood:     "Festive Glow",
  },
];

/* ── Seasonal Storytelling Engine ────────────────────────────────────────
   Atmospheric seasonal context — editorial and timeless, never promotional.
   Sets [data-season] on <html> for CSS tints; surface in moodEditorial
   header when state.filter === "All".                                       */
const SEASONAL_STORIES = {
  spring: {
    label:    "Early Spring",
    headline: "Softer Mornings Ahead",
    body:     "The light changes before anything else does. These pieces were chosen for the weeks when warmth returns slowly — and dressing begins to feel like a quiet celebration again.",
  },
  summer: {
    label:    "Summer",
    headline: "Worn in the Warmth",
    body:     "Long days that ask for fabrics that breathe, silhouettes that move, and pieces that carry you from morning prayer to evening gathering without a second thought.",
  },
  autumn: {
    label:    "Autumn",
    headline: "Layered, Unhurried",
    body:     "The season that asks for texture, depth, and warmth held close. These pieces were selected for the quieter mood that arrives with the cooler air and softer afternoon light.",
  },
  winter: {
    label:    "Winter",
    headline: "Warmth Kept Close",
    body:     "The coldest months carry their own kind of elegance — pieces chosen for the woman who wants to feel gathered, soft, and beautifully composed through every slow winter day.",
  },
};

/* ── Mood Discovery Map ───────────────────────────────────────────────────
   Transforms filter categories into emotion-driven editorial moments.
   Each entry narrates the feeling of the category — not its inventory.
   Keyed by FILTERS[] values; state.filter maps directly.                   */
const MOOD_MAP = {
  "All":               { headline: "Everything, Quietly Curated",           body: "Seven moods. One considered edit. Every piece is personally chosen — not as inventory, but as an invitation to something that could belong to you." },
  "Everyday Grace":    { headline: "For Slower Mornings",                   body: "The pieces you reach for without thinking — because they simply feel right. Soft, unhurried, and made to carry you through the full length of a day." },
  "Modest Essence":    { headline: "Quiet Confidence",                      body: "A quieter way of being seen. Silhouettes that honour the beautiful discipline of covering with considered drape and deeply personal intention." },
  "Festive Glow":      { headline: "When the Day Calls for Light",          body: "For celebrations that ask you to arrive already luminous — pieces chosen to hold the warmth of the room rather than demand it from the room itself." },
  "Workflow Elegance": { headline: "Composed and Present",                  body: "Clean tailoring for the woman whose morning begins before others wake. Polished where it needs to be, breathable where it counts, always quietly assured." },
  "Soft Statement":    { headline: "Softly, Unforgettably",                 body: "The pieces that earn the question 'where did you get that?' — expressive without effort, noticed without having announced a thing." },
  "Evening Calm":      { headline: "For the Hours That Belong to You",      body: "When the day quiets and the light shifts. Chosen for the particular beauty of the woman who arrives to an evening already composed, already at ease." },
  "Signature Picks":   { headline: "The Most Considered Edit",              body: "Pieces chosen for their restraint, careful finish, and the lasting presence they carry — long after the occasion has ended and the memory has settled." },
};

/* ── Emotional Intelligence Memory Key ────────────────────────────────────
   Single localStorage key for all soft-memory data. Schema (all optional):
     visitCount    — how many sessions have occurred on this device
     lastVisit     — unix timestamp of previous session
     lastFilter    — last mood filter the user engaged with
     lastViewedIds — recent product IDs (max 6, most-recent first)
     moodAffinity  — {[filter]: count} engagement per mood over time        */
const MEMORY_KEY = "abdan-memory";

let _toastTimer = null;
let _revealObserver = null;
let _seasonalContext = null;

/* ══════════════════════════════════════════════════════════════════════════
   EMOTIONAL INTELLIGENCE LAYER — Soft Memory & Personalization System
   Philosophy: like a thoughtful luxury stylist, not an ecommerce algorithm.
   Everything stored locally, privately, and with complete user respect.
   Personalization should feel invisible — observed, not announced.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── readMemory / saveMemory — lightweight localStorage helpers ──────────
   All reads are try/catch-guarded; quota failures silently no-op.          */
function readMemory() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}"); }
  catch { return {}; }
}

function saveMemory(updates) {
  const mem = readMemory();
  Object.assign(mem, updates);
  try { localStorage.setItem(MEMORY_KEY, JSON.stringify(mem)); }
  catch { /* storage quota — degrade silently */ }
  return mem;
}

/* ── initMemorySystem ────────────────────────────────────────────────────
   Called once at page load. Increments visit count, normalises schema,
   and returns the current memory object for use in init().                 */
function initMemorySystem() {
  const mem   = readMemory();
  const count = (mem.visitCount || 0) + 1;
  return saveMemory({
    visitCount:    count,
    lastVisit:     Date.now(),
    lastViewedIds: Array.isArray(mem.lastViewedIds)                              ? mem.lastViewedIds : [],
    moodAffinity:  (mem.moodAffinity && typeof mem.moodAffinity === "object")   ? mem.moodAffinity  : {},
    lastFilter:    mem.lastFilter || "All",
  });
}

/* ── recordProductView ───────────────────────────────────────────────────
   Called on every product sheet open. Keeps a deduped, recency-ordered
   list of the last 6 products the user explored on this device.            */
function recordProductView(productId) {
  const mem    = readMemory();
  const viewed = (Array.isArray(mem.lastViewedIds) ? mem.lastViewedIds : []).filter(id => id !== productId);
  viewed.unshift(productId);
  saveMemory({ lastViewedIds: viewed.slice(0, 6) });
}

/* ── recordFilterUsage ───────────────────────────────────────────────────
   Called on every non-"All" filter selection. Builds a mood affinity map
   used to bias the editorial campaign and personalise the Space dashboard.  */
function recordFilterUsage(filter) {
  if (!filter || filter === "All") return;
  const mem = readMemory();
  const af  = (mem.moodAffinity && typeof mem.moodAffinity === "object") ? mem.moodAffinity : {};
  af[filter] = (af[filter] || 0) + 1;
  saveMemory({ moodAffinity: af, lastFilter: filter });
}

/* ── getAffinityMood ─────────────────────────────────────────────────────
   Returns the filter the user has engaged with most — or null if no clear
   preference has emerged yet.                                               */
function getAffinityMood() {
  const mem = readMemory();
  const af  = (mem.moodAffinity && typeof mem.moodAffinity === "object") ? mem.moodAffinity : {};
  let best = null, bestCount = 0;
  Object.entries(af).forEach(([filter, count]) => {
    if (count > bestCount) { best = filter; bestCount = count; }
  });
  return best;
}

/* ── renderSoftlyReturning ───────────────────────────────────────────────
   Surfaces recently explored pieces from the second visit onward.
   Section remains hidden on first visits and when no history exists.
   Language: "Pieces That May Stay With You" — not "Recently Viewed".       */
function renderSoftlyReturning() {
  const section = document.getElementById("softlyReturning");
  if (!section) return;

  const mem      = readMemory();
  const ids      = Array.isArray(mem.lastViewedIds) ? mem.lastViewedIds : [];
  const isReturn = (mem.visitCount || 1) > 1;

  if (!ids.length || !isReturn) { section.hidden = true; return; }

  const products = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  if (!products.length) { section.hidden = true; return; }

  const grid = document.getElementById("srGrid");
  if (!grid) return;

  grid.innerHTML = products.map(p => `
    <article class="sr-card reveal" data-preview="${p.id}"
             role="button" tabindex="0" aria-label="View ${p.name}">
      <div class="sr-card__media">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="sr-card__info">
        <p class="sr-card__tag">${p.primaryTag}</p>
        <p class="sr-card__name">${p.name}</p>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-preview]").forEach(card => {
    const open = () => openProduct(card.dataset.preview || "");
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  /* Image fade-in — same pattern as product grid */
  grid.querySelectorAll("img").forEach(img => {
    const onLoad = () => img.classList.add("img-loaded");
    if (img.complete && img.naturalWidth > 0) requestAnimationFrame(onLoad);
    else {
      img.addEventListener("load",  onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    }
  });

  section.hidden = false;
  revealElements();
}

/* ── renderEmotionalRecommendations ──────────────────────────────────────
   Shows 2–3 emotionally adjacent pieces inside the open product sheet.
   Matches by primaryTag (same mood family), excludes the current piece.
   Label: "Quietly chosen around this" — never "You may also like".         */
function renderEmotionalRecommendations(product) {
  const container = document.getElementById("emotionalRecs");
  const listEl    = document.getElementById("emotionalRecsChips");
  if (!container || !listEl) return;

  const related = PRODUCTS
    .filter(p => p.primaryTag === product.primaryTag && p.id !== product.id)
    .slice(0, 3);

  if (!related.length) { container.hidden = true; return; }

  listEl.innerHTML = related.map(p => `
    <button type="button" class="er-chip" data-preview="${p.id}" aria-label="View ${p.name}">
      <span class="er-chip__name">${p.name}</span>
      <span class="er-chip__sub">${p.curationLine || p.secondaryTags.occasion}</span>
    </button>
  `).join("");

  listEl.querySelectorAll("[data-preview]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeProduct();
      /* Brief pause lets the sheet slide out before the next one opens */
      setTimeout(() => openProduct(btn.dataset.preview || ""), 320);
    });
  });

  container.hidden = false;
}

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

/* ── Premium Savings System ─────────────────────────────────────────────
   Shared, honest savings math. Returns null when there is no genuine saving.
   Reads numeric `price`/`comparePrice` first, falling back to the priceLabel
   string so both admin-set and built-in products are covered.            */
function abdanSavings(product) {
  if (!product) return null;
  const toNum = (v) => {
    if (v === null || v === undefined) return NaN;
    const m = String(v).replace(/[^\d.]/g, "");
    return m ? parseFloat(m) : NaN;
  };
  let cur = toNum(product.price);
  if (!isFinite(cur)) cur = getNumericPrice(product.priceLabel || "");
  const cmp = toNum(product.comparePrice);
  if (!isFinite(cur) || !isFinite(cmp) || cmp <= cur || cur <= 0) return null;
  const amount = Math.round(cmp - cur);
  const pct = Math.floor((amount / cmp) * 100);   /* conservative — never overstates */
  return { current: cur, compare: cmp, amount, pct };
}

/* Overlay admin (studio) pricing onto the catalogue so admin edits — current
   price, compare-at price and badge — drive the storefront. Runs once per load
   (PRODUCTS starts fresh each load, so this is idempotent). */
let _abdanStudioApplied = false;
function applyStudioOverrides() {
  if (_abdanStudioApplied) return;
  _abdanStudioApplied = true;
  let studio = [];
  try { studio = JSON.parse(localStorage.getItem("abdan-studio-products") || "[]"); }
  catch { return; }
  if (!Array.isArray(studio)) return;
  studio.forEach((sp) => {
    const p = PRODUCTS.find((x) => x.id === sp.id);
    if (!p) return;
    if (sp.badge) p.badge = sp.badge;
    const sv = abdanSavings({ price: sp.price, comparePrice: sp.comparePrice });
    if (sv) {
      p.price        = sv.current;
      p.comparePrice = sv.compare;
      p.priceLabel   = formatCurrency(sv.current);
    }
  });
}

/* Total savings across the current cart (sum of per-item compare-at savings). */
function abdanCartSavings() {
  if (typeof applyStudioOverrides === "function") applyStudioOverrides();
  return (state.cart || []).reduce((sum, item) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    const sv = abdanSavings(p);
    return sum + (sv ? sv.amount * (item.quantity || 1) : 0);
  }, 0);
}

/* ── Coupon & automated-rule engine (live cart application) ────────────── */
function getStudioCoupons() { try { return JSON.parse(localStorage.getItem("abdan-studio-coupons") || "[]"); } catch { return []; } }
function getStudioRules()   { try { return JSON.parse(localStorage.getItem("abdan-studio-rules")   || "[]"); } catch { return []; } }

function cartSubtotal()  { return state.cart.reduce((s, it) => s + getNumericPrice(it.priceLabel) * it.quantity, 0); }
function cartTotalQty()  { return state.cart.reduce((s, it) => s + it.quantity, 0); }

/* Subtotal of the cart items a coupon's collection/product restriction applies
   to. With no restriction, the whole cart qualifies. */
function couponQualifyingSubtotal(coupon) {
  if (typeof applyStudioOverrides === "function") applyStudioOverrides();
  const col = coupon.collection && coupon.collection !== "All" ? coupon.collection : null;
  const prod = (coupon.product || "").trim().toLowerCase();
  if (!col && !prod) return cartSubtotal();
  return state.cart.reduce((s, it) => {
    const p = PRODUCTS.find((x) => x.id === it.id) || {};
    const cat = p.category || p.primaryTag || "";
    const matchCol  = col  ? cat === col : true;
    const matchProd = prod ? (String(it.id).toLowerCase() === prod || String(it.name || "").toLowerCase().includes(prod)) : true;
    return (matchCol && matchProd) ? s + getNumericPrice(it.priceLabel) * it.quantity : s;
  }, 0);
}

/* Validate a coupon code against the cart. Returns {ok, coupon, discount, message}. */
function validateCoupon(code) {
  const norm = String(code || "").toUpperCase().replace(/\s+/g, "");
  if (!norm) return { ok: false, message: "Enter a code." };
  const coupon = getStudioCoupons().find((c) => String(c.code || "").toUpperCase() === norm);
  if (!coupon || !coupon.active) return { ok: false, message: "That code isn’t available." };
  const now = new Date();
  if (coupon.startDate && new Date(coupon.startDate) > now) return { ok: false, message: "This code isn’t active yet." };
  if (coupon.endDate) { const end = new Date(coupon.endDate); end.setHours(23, 59, 59, 999); if (end < now) return { ok: false, message: "This code has expired." }; }
  const session = (typeof getSpaceSession === "function" ? getSpaceSession() : null);
  if (coupon.tier && coupon.tier !== "All Members" && !session) {
    return { ok: false, message: `Sign in to Your Space to use ${coupon.tier} benefits.` };
  }
  if (coupon.usageLimit && Number(coupon.uses || 0) >= Number(coupon.usageLimit)) {
    return { ok: false, message: "This code has reached its limit." };
  }
  if (coupon.customerLimit && session && session.email) {
    const used = (coupon.usedBy || {})[String(session.email).toLowerCase()] || 0;
    if (used >= Number(coupon.customerLimit)) return { ok: false, message: "You’ve already used this code." };
  }
  const qualifying = couponQualifyingSubtotal(coupon);
  if (qualifying <= 0) return { ok: false, message: "This code doesn’t apply to your current pieces." };
  const value = parseFloat(coupon.discountValue);
  if (!isFinite(value) || value <= 0) return { ok: false, message: "This code has no benefit configured." };
  const discount = coupon.discountType === "flat"
    ? Math.min(Math.round(value), qualifying)
    : Math.round(qualifying * value / 100);
  if (discount <= 0) return { ok: false, message: "This code doesn’t apply to your current pieces." };
  return { ok: true, coupon, discount, message: `${coupon.name || coupon.code} applied` };
}

/* Best auto-applied rule benefit for the current cart (no stacking surprises). */
function evaluateRules() {
  const subtotal = cartSubtotal();
  const qty = cartTotalQty();
  let best = null;
  getStudioRules().forEach((r) => {
    if (!r.active) return;
    let triggered = false;
    switch (r.trigger) {
      case "Buy 2 Items":     triggered = qty >= 2; break;
      case "Buy 3 Items":     triggered = qty >= 3; break;
      case "Cart Over ₹5,000": triggered = subtotal >= 5000; break;
      default: triggered = false; /* tier/collection/first-order: not auto-valued */
    }
    if (!triggered) return;
    const m = String(r.benefit || "").match(/(\d+(?:\.\d+)?)\s*%/);
    if (!m) return;
    const pct = parseFloat(m[1]);
    const amount = Math.round(subtotal * pct / 100);
    if (amount > 0 && (!best || amount > best.amount)) best = { name: r.name || r.trigger, pct, amount };
  });
  return best;
}

/* Single source of truth for the cart's money, incl. coupon + rule benefits. */
function computeCartTotals() {
  const subtotal = cartSubtotal();
  const rule = evaluateRules();
  const ruleDiscount = rule ? rule.amount : 0;
  let couponDiscount = 0, couponCode = "";
  if (state.appliedCoupon) {
    const v = validateCoupon(state.appliedCoupon);
    if (v.ok) { couponDiscount = v.discount; couponCode = v.coupon.code; }
    else { state.appliedCoupon = null; }   /* drop if no longer valid */
  }
  const total = Math.max(0, subtotal - ruleDiscount - couponDiscount);
  return { subtotal, ruleDiscount, ruleName: rule ? rule.name : "", couponDiscount, couponCode, total };
}

/* Compact price markup for product cards — elegant strikethrough + saving. */
function abdanCardPriceHtml(product) {
  const s = abdanSavings(product);
  if (!s) return `<span class="product-card__price-soft">${product.priceLabel || formatCurrency(s ? s.current : 0)}</span>`;
  return `
    <span class="product-card__price-soft product-card__price-soft--saver">
      <span class="price-was">${formatCurrency(s.compare)}</span>
      <span class="price-now">${formatCurrency(s.current)}</span>
      <span class="price-save">Save ${formatCurrency(s.amount)} · ${s.pct}%</span>
    </span>`;
}

/* Elegant editorial badge chip (Premium Product Badges). */
function abdanBadgeHtml(product, variant) {
  const b = product && product.badge;
  if (!b) return "";
  return `<span class="abdan-badge abdan-badge--${variant || "card"}">${b}</span>`;
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

  /* ── §77 Directional cinematic transitions ──────────────────────────────
     "Midnight Silk" (→ dark): deep emerald-black diagonal veil drifts across
     the viewport, ~700 ms — like heavy silk drawn slowly over the light.
     "Ivory Shawl"   (→ light): warm ivory radial bloom from upper-centre,
     ~530 ms — like dawn through fine muslin. Both GPU-composited.
     Toggle glyph swap is handled entirely by CSS (§77c) — no Lucide update
     needed. safeCreateIcons() still runs for all other page icons.          */
  const isMidnightSilk = (theme === "dark");
  const drapeVariant   = isMidnightSilk ? "theme-drape--midnight-silk"
                                        : "theme-drape--ivory-shawl";
  const switchDelay    = isMidnightSilk ? 300 : 280;
  const fadeOutDur     = isMidnightSilk ? 400 : 360;

  const drape = document.createElement("div");
  drape.className = `theme-drape ${drapeVariant}`;
  document.body.appendChild(drape);

  requestAnimationFrame(() => {
    drape.classList.add("theme-drape--sweep");

    /* Switch theme tokens at the sweep's luminance peak */
    setTimeout(() => {
      dom.html.setAttribute("data-theme", theme);
      localStorage.setItem("abdan-theme", theme);
      safeCreateIcons(); /* refresh other Lucide icons on the page */

      /* Recede — override transition for the fade-out pace */
      drape.classList.remove("theme-drape--sweep");
      drape.style.transition = `opacity ${fadeOutDur}ms ease-in`;
      setTimeout(() => drape.remove(), fadeOutDur + 40);
    }, switchDelay);
  });
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

/* §78 — Phase 1 ecosystem storage keys */
const SP_PHOTO_KEY     = "abdan-sp-photo";
const SP_COVER_KEY     = "abdan-sp-cover";
const SP_BIO_KEY       = "abdan-sp-bio";
const SP_STYLE_KEY     = "abdan-sp-style";
const SP_TAGS_KEY      = "abdan-sp-tags";
const SP_LOYALTY_KEY   = "abdan-sp-loyalty";
const SP_CONCIERGE_KEY = "abdan-sp-concierge";
const SP_LOOKBOOK_KEY  = "abdan-sp-lookbook";
const SP_JOURNAL_KEY   = "abdan-sp-journal";   /* §80 */
const SP_THEME_KEY     = "abdan-sp-theme";     /* §80 */
/* My Wardrobe ecosystem (additive) */
const SP_WARD_FAVS     = "abdan-sp-ward-favs";     /* favourited purchased pieces */
const SP_WARD_LOOKS    = "abdan-sp-ward-looks";    /* styled looks (photo + occasion) */
const SP_WARD_PAIRINGS = "abdan-sp-ward-pairings"; /* outfit pairings */
const SP_WARD_NOTES    = "abdan-sp-ward-notes";    /* private wardrobe notes */
const SP_WARD_GALLERY  = "abdan-sp-ward-gallery";  /* private memory gallery */
const WARD_OCCASIONS   = ["Wedding", "Temple Visit", "Eid", "Family Function", "Festive", "Everyday"];
const WARD_GALLERY_TYPES = ["Unboxing", "Styling", "Occasion"];

const SP_STYLE_IDENTITIES = [
  "Quiet Gold", "Temple Elegance", "Soft Minimal", "Monsoon Silk",
  "Everyday Grace", "Festive Devotion", "Desert Silk", "Coastal Bloom",
];
const SP_MOOD_TAGS = [
  "Soft Drapes", "Handwoven", "Festive", "Minimalist",
  "Bold Colour", "Muted Tones", "Heritage", "Contemporary",
];
const SP_LOYALTY_TIERS = [
  { name: "Quiet Admirer",    min: 0   },
  { name: "Devoted Collector",min: 50  },
  { name: "Inner Circle",     min: 150 },
  { name: "House of ABDAN",   min: 300 },
];
const SP_BADGE_DEFS = [
  { id: "early-believer",  label: "Early Believer",  icon: "✦",
    desc: "Among the first to join ABDAN" },
  { id: "quiet-collector", label: "Quiet Collector",  icon: "♡",
    desc: "Saved 5 or more pieces" },
  { id: "style-keeper",    label: "Style Keeper",     icon: "◈",
    desc: "Defined a personal style identity" },
  { id: "devotion-edit",   label: "Devotion Edit",    icon: "◇",
    desc: "Full profile completed with care" },
];

/* §80 — Style Journal data */
const SP_JOURNAL_MOODS = [
  { sym: "◇", label: "Calm"        },
  { sym: "✦", label: "Inspired"    },
  { sym: "♡", label: "Loved"       },
  { sym: "◈", label: "Thoughtful"  },
  { sym: "✧", label: "Joyful"      },
];
const SP_JOURNAL_OCCASIONS = [
  "Festive", "Wedding", "Everyday", "Gifting", "Travel", "Just Because",
];

/* §80 — Profile themes (unlocked by loyalty pts) */
const SP_THEME_DEFS = [
  { id: "",              name: "Classic",       minPts: 0,   unlock: "",
    swatch: "linear-gradient(135deg,rgba(250,248,242,1),rgba(220,210,190,1))" },
  { id: "temple-gold",   name: "Temple Gold",   minPts: 50,  unlock: "Devoted Collector",
    swatch: "linear-gradient(135deg,rgba(210,178,110,1),rgba(183,150,72,1))" },
  { id: "ivory-calm",    name: "Ivory Calm",    minPts: 50,  unlock: "Devoted Collector",
    swatch: "linear-gradient(135deg,rgba(255,252,240,1),rgba(235,222,200,1))" },
  { id: "emerald-night", name: "Emerald Night", minPts: 150, unlock: "Inner Circle",
    swatch: "linear-gradient(135deg,rgba(2,61,58,1),rgba(0,78,65,1))" },
  { id: "quiet-rose",    name: "Quiet Rose",    minPts: 150, unlock: "Inner Circle",
    swatch: "linear-gradient(135deg,rgba(200,162,152,1),rgba(178,128,128,1))" },
  { id: "monsoon-silk",  name: "Monsoon Silk",  minPts: 300, unlock: "House of ABDAN",
    swatch: "linear-gradient(135deg,rgba(88,98,138,1),rgba(68,78,118,1))" },
];

/* §80 — Inner Circle editorial cards */
const SP_IC_CARDS = [
  { label: "Members Only",    title: "Early Preview — The Monsoon Edit",
    body:  "A quiet glimpse into the next collection, before it opens to the world.", minPts: 150, unlock: "Inner Circle" },
  { label: "Private Resource", title: "Draping Guide — Summer Silk",
    body:  "Six silhouettes, thoughtfully illustrated. Reserved for our devoted collectors.", minPts: 150, unlock: "Inner Circle" },
  { label: "From the Founder", title: "A Handwritten Note from ABDAN",
    body:  "Personal. Quiet. A message written only for those who truly belong to the house.", minPts: 300, unlock: "House of ABDAN" },
];

/* §78 — per-email localStorage helpers */
function spKey(email, key)     { return `${key}:${(email||"").toLowerCase()}`; }
function spGet(email, key)     { try { return JSON.parse(localStorage.getItem(spKey(email,key))); } catch { return null; } }
function spSet(email, key, v)  { try { localStorage.setItem(spKey(email,key), JSON.stringify(v)); } catch { /* quota */ } }

function spGetLoyalty(email)   { return spGet(email, SP_LOYALTY_KEY) || 0; }
function spAddLoyalty(email, pts) {
  const cur = spGetLoyalty(email);
  spSet(email, SP_LOYALTY_KEY, cur + pts);
}
function spGetTier(pts) {
  let tier = SP_LOYALTY_TIERS[0];
  for (const t of SP_LOYALTY_TIERS) { if (pts >= t.min) tier = t; }
  return tier;
}
function spGetBadges(email) {
  const badges = [];
  const pts    = spGetLoyalty(email);
  if (pts > 0 || spGet(email, SP_BIO_KEY) || spGet(email, SP_STYLE_KEY)) {
    badges.push("early-believer");
  }
  const wlSize = getWishlist().size;
  if (wlSize >= 5) badges.push("quiet-collector");
  if (spGet(email, SP_STYLE_KEY)) badges.push("style-keeper");
  if (spGet(email, SP_BIO_KEY) && spGet(email, SP_PHOTO_KEY) && spGet(email, SP_STYLE_KEY)) {
    badges.push("devotion-edit");
  }
  return SP_BADGE_DEFS.filter(b => badges.includes(b.id));
}

function spGetConcierge(email) { return spGet(email, SP_CONCIERGE_KEY) || []; }
function spAddMsg(email, msg)  {
  const msgs = spGetConcierge(email);
  msgs.push(msg);
  spSet(email, SP_CONCIERGE_KEY, msgs);
}
function spGetLookbook(email)  { return spGet(email, SP_LOOKBOOK_KEY) || []; }
function spSaveLookbook(email, items) { spSet(email, SP_LOOKBOOK_KEY, items); }

/* §80 — Journal + theme helpers */
function spGetJournal(email)           { return spGet(email, SP_JOURNAL_KEY) || []; }
function spSaveJournal(email, entries) { spSet(email, SP_JOURNAL_KEY, entries); }
function spGetTheme(email)             { return spGet(email, SP_THEME_KEY) || ""; }
function spSetTheme(email, theme)      { spSet(email, SP_THEME_KEY, theme); }

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
  /* S83 — remember last member for returning user portal experience */
  try { localStorage.setItem("abdan-sp-last", JSON.stringify({
    email: profile.email,
    name:  profile.displayName || profile.fullName || "",
  })); } catch {}
}

function clearSpaceSession() {
  sessionStorage.removeItem(SPACE_SESSION_KEY);
}

async function createSpaceProfile(data) {
  const profiles = getSpaceProfiles();
  const email = data.email.toLowerCase().trim();
  if (profiles[email]) {
    throw new Error("Your space already exists for this email. Come back in through Your Space — it is waiting for you. 💛");
  }
  /* Phone is required — it is how ABDAN confirms each order personally. */
  const phone = (data.phone || "").trim();
  if (phone.replace(/\D/g, "").length < 7) {
    throw new Error("A mobile number is needed to create your space — it’s how ABDAN reaches you to confirm each order personally. 💛");
  }
  const passwordHash = await hashValue(data.password);
  const profile = {
    fullName:    data.fullName.trim(),
    displayName: data.displayName.trim(),
    email,
    phone,
    passwordHash,
    createdAt:   new Date().toISOString(),
    /* §38 — Trust & consent record */
    consent: {
      agreement:    true,                          /* required — form validates */
      marketing:    !!data.marketingConsent,        /* optional */
      timestamp:    new Date().toISOString(),
      version:      "1.0",
    },
  };
  profiles[email] = profile;
  localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(profiles));
  /* Share & Earn — attribute a pending referral to this new member. */
  if (typeof attributeReferral === "function") { try { attributeReferral(email, profile.phone); } catch {} }
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

/* ── Render order journey cards — premium storytelling timeline ───────────
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
      <p class="space-section-heading">Your Journey</p>
      <div class="space-journey-empty">
        <i data-lucide="package" aria-hidden="true"></i>
        <p>When you choose something beautiful, its gentle journey to you will unfold here — every step followed with care.</p>
        <a class="secondary-button" href="#products">Discover something beautiful</a>
      </div>`;
    safeCreateIcons();
    return;
  }

  const statusSteps    = ["confirmed", "preparing", "shipped", "out_for_delivery", "delivered"];
  const statusLabel    = {
    confirmed:        "Carefully Reserved",
    preparing:        "Being Prepared",
    shipped:          "On Its Way",
    out_for_delivery: "Arriving Soon",
    delivered:        "Arrived 💛",
  };
  const stepLabel      = ["Reserved", "Prepared", "Dispatched", "Arriving", "Home 💛"];

  const cards = orders.map((order) => {
    const dateStr      = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "";
    const itemsSummary = (order.items || [])
      .map((i) => `${i.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`)
      .join(", ");
    const currentIdx   = statusSteps.indexOf(order.status || "confirmed");

    const stepsHtml = statusSteps.map((step, idx) => {
      const isDone    = idx <= currentIdx;
      const isCurrent = idx === currentIdx;
      const connector = idx < statusSteps.length - 1
        ? `<div class="space-journey-line${isDone && idx < currentIdx ? " is-done" : ""}" aria-hidden="true"></div>`
        : "";
      return `<div class="space-journey-step${isDone ? " is-done" : ""}${isCurrent ? " is-current" : ""}" aria-label="${stepLabel[idx]}">
        <span class="space-journey-step__dot"></span>
        <span class="space-journey-step__label">${stepLabel[idx]}</span>
      </div>${connector}`;
    }).join("");

    return `
      <div class="space-journey-card">
        <div class="space-journey-card__head">
          <span class="space-journey-card__ref">${order.ref || order.id || "—"}</span>
          <span class="space-journey-card__date">${dateStr}</span>
        </div>
        ${itemsSummary ? `<p class="space-journey-card__items">${itemsSummary}</p>` : ""}
        <div class="space-journey-track" role="list" aria-label="Order journey">${stepsHtml}</div>
        <div class="space-journey-card__foot">
          <span class="space-journey-card__status" data-status="${order.status || "confirmed"}">${statusLabel[order.status] || "Carefully Reserved"}</span>
          <span class="space-journey-card__total">${formatCurrency(order.total || 0)}</span>
        </div>
        ${(() => {
          /* §79 — Emotional anticipation note for active state */
          const stateObj = ORDER_STATES.find(s => s.key === (order.status || "confirmed"));
          return stateObj?.note
            ? `<p class="space-journey-card__note">${stateObj.note}</p>`
            : "";
        })()}
      </div>`;
  }).join("");

  panel.innerHTML = `<p class="space-section-heading">Your Journey</p>${cards}`;
  safeCreateIcons();
}

function showSpaceDashboard(profile, isNew = false) {
  const first        = (profile.displayName || profile.fullName || "").split(" ")[0] || "you";
  const affinityMood = getAffinityMood();

  /* ── Greeting copy ───────────────────────────────────────────────── */
  const kickerEl    = document.getElementById("spaceDashKicker");
  const greetingEl  = document.getElementById("spaceDashGreeting");
  const taglineEl   = document.getElementById("spaceDashTagline");

  if (kickerEl)   kickerEl.textContent   = isNew ? "A space made just for you" : "Continue Your Story";
  if (greetingEl) greetingEl.textContent = isNew
    ? `Welcome to Your Space, ${first} 💛`
    : `Welcome Back, ${first} 💛`;
  if (taglineEl)  taglineEl.textContent  = "Everything you love, thoughtfully kept in one place.";

  /* ── Mood profile strip — surfaces affinity if it exists ──────────── */
  const moodProfileEl = document.getElementById("spaceMoodProfile");
  const moodValEl     = document.getElementById("spaceMoodValue");
  const moodExploreEl = document.getElementById("spaceMoodExplore");
  if (moodProfileEl) {
    if (affinityMood && moodValEl) {
      moodValEl.textContent = affinityMood;
      moodProfileEl.hidden  = false;
      if (moodExploreEl) {
        moodExploreEl.onclick = () => {
          state.filter = affinityMood;
          renderFilters();
          renderProducts();
          const section = document.getElementById("products");
          if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        };
      }
    } else {
      moodProfileEl.hidden = true;
    }
  }

  showSpaceView("spaceDashboard");
  if (typeof enterYourSpaceRoute === "function") enterYourSpaceRoute(); /* S82 */

  /* §78 — Update header avatar */
  const avatarEl   = document.getElementById("spaceDashAvatar");
  const initialsEl = document.getElementById("spaceDashInitials");
  const email      = profile.email || "";
  const photo      = spGet(email, SP_PHOTO_KEY);
  if (avatarEl) {
    if (photo) {
      avatarEl.innerHTML = `<img src="${photo}" alt="" />`;
    } else if (initialsEl) {
      initialsEl.textContent = (profile.displayName || profile.fullName || "✦").charAt(0).toUpperCase();
    }
  }

  /* §78 — Award loyalty on first entry */
  if (isNew && spGetLoyalty(email) === 0) spAddLoyalty(email, 50);

  /* ── Populate all panels ─────────────────────────────────────────── */
  renderSpaceOrders(profile.phone || "");
  renderSpaceWishlist();
  renderSpaceProfile(profile.email || "");
  renderSpaceOverview(profile);
  renderSpaceLookbook(email);
  renderSpaceConcierge(email);
  renderSpaceJournal(email);
  renderSpaceSavedMoments(email);       /* S84 */
  renderSpaceRequests(email);           /* S84 */
  renderSpaceMessages(email);           /* S84 */
  renderSpaceMembership(profile);       /* S84 */
  renderSpaceSettings(profile, email);  /* S84 */
  renderSpaceDiscover(profile);          /* YS arch */
  updateSavedPiecesCount();

  /* §80 — Apply saved profile theme to dashboard shell */
  const savedTheme80 = spGetTheme(email);
  const dashEl80 = document.getElementById("spaceDashboard");
  if (dashEl80) dashEl80.dataset.spTheme = savedTheme80 || "";

  /* Reset to overview tab on entry */
  showSpaceTab("overview");

  if (isNew) showToast("Your space is ready — this one is just for you. 💛");
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
      showSpaceError("spaceSigninError", "These details don't match. Please try again.");
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
    showSpaceError("spaceSigninError", "Something went wrong. Please try once more.");
    resetButtonLoading(submitBtn);
  }
}

async function handleSpaceCreate(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = {
    fullName:         form.fullName.value,
    displayName:      form.displayName.value,
    email:            form.email.value,
    phone:            form.phone?.value || "",
    password:         form.password.value,
    confirmPassword:  form.confirmPassword.value,
    marketingConsent: form.marketingConsent?.checked || false,  /* §38 */
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
    showSpaceError("spaceCreateError", err instanceof Error ? err.message : "Something went wrong. Please try once more.");
    resetButtonLoading(submitBtn);
  }
}

function handleSpaceSignout() {
  /* §80 — Cinematic farewell veil before sign-out */
  const veil = document.createElement("div");
  veil.className = "sp-farewell-veil";
  veil.innerHTML = `
    <span class="sp-farewell-veil__icon">◇</span>
    <p class="sp-farewell-veil__title">Resting for now</p>
    <p class="sp-farewell-veil__body">Your space is safe, quietly waiting for your return. 💛</p>
  `;
  document.body.appendChild(veil);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    veil.classList.add("is-visible");
  }));
  setTimeout(() => {
    clearSpaceSession();
    const dashEl = document.getElementById("spaceDashboard");
    if (dashEl) dashEl.dataset.spTheme = "";
    if (typeof exitYourSpaceRoute === "function") exitYourSpaceRoute(); /* S82 */
    showSpaceView("spaceEntry");
    showToast("Your space will be here when you return. 💛");
    veil.classList.remove("is-visible");
    setTimeout(() => veil.remove(), 420);
  }, 1500);
}

/* ── Space tab navigation ────────────────────────────────────────────
   Four panels: overview · saved · journey · profile.
   Activated via data-space-tab delegation in main init section.       */
function showSpaceTab(tabId) {
  /* §78/S84 — full panelMap */
  const panelMap = {
    overview:     "spaceTabOverview",
    saved:        "spaceTabSaved",
    journey:      "spaceTabJourney",
    profile:      "spaceTabProfile",
    lookbook:     "spaceTabLookbook",
    concierge:    "spaceTabConcierge",
    journal:      "spaceTabJournal",
    discover:     "spaceTabDiscover",
    savedmoments: "spaceTabSavedMoments",
    requests:     "spaceTabRequests",
    messages:     "spaceTabMessages",
    membership:   "spaceTabMembership",
    settings:     "spaceTabSettings",
    shareearn:    "spaceTabShareEarn",
    myjourney:    "spaceTabMyJourney",
  };
  if (tabId === "shareearn" && typeof renderShareEarn === "function") renderShareEarn();
  if (tabId === "myjourney" && typeof renderMyJourney === "function") renderMyJourney();
  document.querySelectorAll("[data-space-tab]").forEach((t) => {
    t.classList.toggle("is-active", t.dataset.spaceTab === tabId);
    t.setAttribute("aria-selected", t.dataset.spaceTab === tabId ? "true" : "false");
  });
  Object.entries(panelMap).forEach(([key, panelId]) => {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const isActive = key === tabId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

/* ── Render wishlist as "Saved Pieces" in the space ──────────────────
   Uses the global PRODUCTS constant (source of truth for product data). */
function renderSpaceWishlist() {
  const panel = document.getElementById("spaceWishlistPanel");
  if (!panel) return;

  const wishlistIds = getWishlist();                       /* Set of id strings */
  const saved       = PRODUCTS.filter((p) => wishlistIds.has(String(p.id)));

  if (!saved.length) {
    panel.innerHTML = `
      <p class="space-section-heading">Saved Pieces</p>
      <div class="space-saved-empty">
        <i data-lucide="heart" aria-hidden="true"></i>
        <p>Nothing saved yet — when a piece catches your heart, it will wait quietly here, just for you.</p>
        <a class="secondary-button" href="#products">Begin saving pieces you love</a>
      </div>`;
    safeCreateIcons();
    return;
  }

  const cards = saved.map((p) => `
    <div class="space-saved-card">
      <div class="space-saved-card__img" aria-hidden="true">
        ${p.image
          ? `<img src="${p.image}" alt="" loading="lazy" />`
          : `<div class="space-saved-card__img-placeholder"></div>`}
      </div>
      <div class="space-saved-card__body">
        <p class="space-saved-card__name">${p.name}</p>
        <p class="space-saved-card__price">${p.priceLabel || ""}</p>
      </div>
      <button class="space-saved-card__remove" data-remove-saved="${p.id}"
              type="button" aria-label="Remove ${p.name} from saved pieces">
        <i data-lucide="x" aria-hidden="true"></i>
      </button>
    </div>`).join("");

  /* §78 — Wardrobe header + journey collapsible below the grid */
  const session = getSpaceSession();
  panel.innerHTML = `
    <div class="sp-wardrobe-head">
      <h3 class="sp-wardrobe-head__title">Your Wardrobe</h3>
    </div>
    <div class="space-saved-grid">${cards}</div>
    <hr class="sp-section-divider" />
    <button class="sp-journey-toggle" type="button" id="spJourneyToggle">
      Your Journey
      <span class="sp-journey-toggle__arrow">▾</span>
    </button>
    <div class="sp-journey-body" id="spJourneyBody">
      <div id="spaceOrdersInline"></div>
    </div>`;

  panel.querySelectorAll("[data-remove-saved]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wl = getWishlist();
      wl.delete(btn.dataset.removeSaved);
      saveWishlist(wl);
      renderSpaceWishlist();
      updateSavedPiecesCount();
      safeCreateIcons();
      showToast("Removed 💛");
    });
  });

  /* Journey toggle */
  let journeyLoaded = false;
  document.getElementById("spJourneyToggle")?.addEventListener("click", () => {
    const body   = document.getElementById("spJourneyBody");
    const toggle = document.getElementById("spJourneyToggle");
    if (!body || !toggle) return;
    const isOpen = body.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    /* Lazy-render orders on first open */
    if (isOpen && !journeyLoaded) {
      journeyLoaded = true;
      const inline = document.getElementById("spaceOrdersInline");
      if (inline) {
        const tmp = document.getElementById("spaceOrdersPanel");
        if (tmp) inline.innerHTML = tmp.innerHTML;
        else renderSpaceOrders(session?.phone || "");
      }
    }
  });

  safeCreateIcons();
}

/* ── Update the Saved Pieces tab badge count ─────────────────────── */
function updateSavedPiecesCount() {
  const countEl = document.getElementById("spaceTabSavedCount");
  if (!countEl) return;
  const n = getWishlist().size;
  if (n > 0) { countEl.textContent = n; countEl.hidden = false; }
  else        { countEl.hidden = true; }
}

/* ── Render profile view + inline edit form (§78 enhanced) ────────── */
function renderSpaceProfile(email) {
  const panel = document.getElementById("spaceProfilePanel");
  if (!panel) return;

  const profiles   = getSpaceProfiles();
  const profile    = profiles[email?.toLowerCase?.() || ""] || {};
  const initials   = ((profile.displayName || profile.fullName || "?").charAt(0)).toUpperCase();
  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "";
  const fullDiffers = profile.fullName && profile.fullName !== profile.displayName;

  /* §78 — Extra profile data */
  const photo    = spGet(email, SP_PHOTO_KEY);
  const cover    = spGet(email, SP_COVER_KEY);
  const bio      = spGet(email, SP_BIO_KEY) || "";
  const identity = spGet(email, SP_STYLE_KEY) || "";
  const tags     = spGet(email, SP_TAGS_KEY) || [];

  const avatarInner = photo
    ? `<img src="${photo}" alt="" />
       <input type="file" accept="image/*" id="spPhotoInput" aria-label="Change profile photo" />`
    : `<span>${initials}</span>
       <input type="file" accept="image/*" id="spPhotoInput" aria-label="Set profile photo" />`;

  const coverStyle = cover
    ? `background: url('${cover}') center/cover no-repeat;`
    : "";

  const styleCards = SP_STYLE_IDENTITIES.map(s =>
    `<button class="sp-style-card${identity === s ? " is-selected" : ""}" type="button" data-style="${s}">
       <p class="sp-style-card__name">${s}</p>
     </button>`
  ).join("");

  const tagChips = SP_MOOD_TAGS.map(t =>
    `<button class="sp-tag${tags.includes(t) ? " is-selected" : ""}" type="button" data-tag="${t}">${t}</button>`
  ).join("");

  /* §80 — Profile theme cards */
  const pts80        = spGetLoyalty(email);
  const currentTheme80 = spGetTheme(email) || "";
  const themeCards80 = SP_THEME_DEFS.map(th => {
    const locked   = pts80 < th.minPts;
    const selected = th.id === currentTheme80;
    return `
      <button class="sp-theme-card${locked ? " is-locked" : ""}${selected ? " is-selected" : ""}"
              type="button" data-theme-id="${th.id}"${locked ? " disabled" : ""}>
        <div class="sp-theme-swatch" style="background:${th.swatch}"></div>
        <p class="sp-theme-card__name">${th.name}</p>
        ${locked ? `<p class="sp-theme-card__unlock">${th.unlock}</p>` : ""}
      </button>`;
  }).join("");

  panel.innerHTML = `
    <!-- §78 Profile hero: cover + avatar -->
    <div class="sp-profile-hero">
      <div class="sp-profile-cover" style="${coverStyle}">
        ${!cover ? "" : `<img src="${cover}" alt="" />`}
        <label class="sp-profile-cover__edit">
          <input type="file" accept="image/*" id="spCoverInput" />
          <span>Change cover</span>
        </label>
      </div>
      <div class="sp-profile-avatar-wrap">
        <div class="sp-profile-avatar-lg">
          ${avatarInner}
        </div>
      </div>
      <div class="sp-profile-hero__info">
        <p class="sp-profile-hero__name">${profile.displayName || profile.fullName || ""}</p>
        <p class="sp-profile-hero__email">${profile.email || ""}
          ${joinedDate ? ` · With ABDAN since ${joinedDate}` : ""}
        </p>
      </div>
    </div>

    <!-- §78 Bio -->
    <div class="sp-bio-section">
      <p class="sp-bio-section__title">Your introduction</p>
      <textarea class="sp-bio-textarea" id="spBioTextarea"
                placeholder="A few words about your style, your world, what you love…"
                rows="3">${bio}</textarea>
      <button type="button" class="sp-bio-save" id="spBioSave">Save</button>
    </div>

    <!-- §78 Style identity -->
    <div class="sp-identity-section">
      <p class="sp-identity-section__title">Your style identity</p>
      <p class="sp-identity-section__sub">Choose the aesthetic that feels most like you.</p>
      <div class="sp-style-grid" id="spStyleGrid">${styleCards}</div>
    </div>

    <!-- §78 Mood tags -->
    <div class="sp-tags-section">
      <p class="sp-tags-section__title">Your aesthetic moods</p>
      <p class="sp-tags-section__sub">Select everything that resonates. There are no wrong choices.</p>
      <div class="sp-tag-row" id="spTagRow">${tagChips}</div>
    </div>

    <!-- §80 Profile themes -->
    <div class="sp-theme-section" id="spThemeSection">
      <p class="sp-theme-section__title">Your Space atmosphere</p>
      <p class="sp-theme-section__sub">Choose a tone that feels like yours. Themes unlock as your devotion deepens.</p>
      <div class="sp-theme-grid" id="spThemeGrid">${themeCards80}</div>
    </div>

    <!-- Edit details -->
    <div class="space-profile-edit-section" style="padding-top:1.5rem;border-top:1px solid var(--line);margin-top:1.5rem">
      <button type="button" class="space-edit-toggle" id="spaceEditToggle">Edit my details</button>

      <form class="space-form space-profile-form" id="spaceProfileForm" hidden novalidate>
        <label class="space-field">
          <span class="space-field__label">What should we call you?</span>
          <small class="space-field__hint">Display Name</small>
          <input type="text" name="displayName" value="${profile.displayName || ""}" autocomplete="nickname" required />
        </label>
        <label class="space-field">
          <span class="space-field__label">A number for gentle updates</span>
          <small class="space-field__hint">Mobile Number</small>
          <input type="tel" name="phone" value="${profile.phone || ""}" autocomplete="tel" placeholder="+91 00000 00000" required />
        </label>
        <p class="space-profile-form__note">Your email address cannot be changed. For help, reach out on WhatsApp 💛</p>
        <p class="space-form__error" id="spaceProfileError" role="alert" hidden></p>
        <div class="space-profile-form__actions">
          <button type="submit" class="primary-button">Save changes</button>
          <button type="button" class="ghost-button" id="spaceEditCancel">Cancel</button>
        </div>
      </form>
    </div>

    <div class="space-profile-privacy" style="margin-top:1.5rem">
      <p class="space-profile-privacy__text">Your space remains private and protected.</p>
      <ul class="space-trust-list">
        <li><i data-lucide="check-circle"></i> Private &amp; Secure</li>
        <li><i data-lucide="check-circle"></i> Carefully Protected</li>
        <li><i data-lucide="check-circle"></i> Always Under Your Control</li>
      </ul>
    </div>`;

  /* §78 — Profile photo upload */
  document.getElementById("spPhotoInput")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      spSet(email, SP_PHOTO_KEY, ev.target.result);
      spAddLoyalty(email, 15);
      renderSpaceProfile(email);
      /* Refresh header avatar */
      const avatarEl = document.getElementById("spaceDashAvatar");
      if (avatarEl) avatarEl.innerHTML = `<img src="${ev.target.result}" alt="" />`;
      showToast("Profile photo saved 💛");
    };
    reader.readAsDataURL(file);
  });

  /* §78 — Cover photo upload */
  document.getElementById("spCoverInput")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      spSet(email, SP_COVER_KEY, ev.target.result);
      renderSpaceProfile(email);
      showToast("Cover updated 💛");
    };
    reader.readAsDataURL(file);
  });

  /* §78 — Bio save */
  document.getElementById("spBioSave")?.addEventListener("click", () => {
    const bio = document.getElementById("spBioTextarea")?.value?.trim() || "";
    const hadBio = !!spGet(email, SP_BIO_KEY);
    spSet(email, SP_BIO_KEY, bio);
    if (!hadBio && bio) spAddLoyalty(email, 10);
    renderSpaceOverview(getSpaceSession() || {});
    showToast("Bio saved 💛");
  });

  /* §78 — Style identity */
  document.getElementById("spStyleGrid")?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-style]");
    if (!card) return;
    const hadIdentity = !!spGet(email, SP_STYLE_KEY);
    spSet(email, SP_STYLE_KEY, card.dataset.style);
    if (!hadIdentity) spAddLoyalty(email, 10);
    /* Update selection visually */
    document.querySelectorAll(".sp-style-card").forEach(c => {
      c.classList.toggle("is-selected", c.dataset.style === card.dataset.style);
    });
    showToast(`${card.dataset.style} — your style identity saved 💛`);
  });

  /* §78 — Mood tags */
  document.getElementById("spTagRow")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tag]");
    if (!btn) return;
    const cur = spGet(email, SP_TAGS_KEY) || [];
    const tag = btn.dataset.tag;
    const idx = cur.indexOf(tag);
    if (idx === -1) cur.push(tag); else cur.splice(idx, 1);
    spSet(email, SP_TAGS_KEY, cur);
    btn.classList.toggle("is-selected", cur.includes(tag));
  });

  /* §80 — Profile theme selection */
  document.getElementById("spThemeGrid")?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-theme-id]");
    if (!card || card.disabled) return;
    const themeId = card.dataset.themeId;
    spSetTheme(email, themeId);
    const dashEl = document.getElementById("spaceDashboard");
    if (dashEl) dashEl.dataset.spTheme = themeId;
    document.querySelectorAll(".sp-theme-card").forEach(c => {
      c.classList.toggle("is-selected", c.dataset.themeId === themeId);
    });
    const themeName = SP_THEME_DEFS.find(t => t.id === themeId)?.name || "Classic";
    showToast(`${themeName} — atmosphere applied 💛`);
  });

  /* Toggle edit form visibility */
  document.getElementById("spaceEditToggle")?.addEventListener("click", () => {
    const form   = document.getElementById("spaceProfileForm");
    const toggle = document.getElementById("spaceEditToggle");
    if (!form || !toggle) return;
    form.hidden  = !form.hidden;
    toggle.textContent = form.hidden ? "Edit my details" : "Cancel editing";
  });

  document.getElementById("spaceEditCancel")?.addEventListener("click", () => {
    const form   = document.getElementById("spaceProfileForm");
    const toggle = document.getElementById("spaceEditToggle");
    if (form)   form.hidden       = true;
    if (toggle) toggle.textContent = "Edit my details";
  });

  /* Save profile changes */
  document.getElementById("spaceProfileForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const form        = e.currentTarget;
    const displayName = form.displayName.value.trim();
    const phone       = form.phone?.value?.trim() || "";
    const errEl       = document.getElementById("spaceProfileError");

    if (!displayName) {
      if (errEl) { errEl.textContent = "Please tell us what to call you."; errEl.hidden = false; }
      return;
    }
    if (phone.replace(/\D/g, "").length < 7) {
      if (errEl) { errEl.textContent = "A mobile number is needed — it’s how ABDAN confirms your orders personally. 💛"; errEl.hidden = false; }
      return;
    }
    if (errEl) errEl.hidden = true;

    const allProfiles = getSpaceProfiles();
    const key         = email?.toLowerCase?.() || "";
    if (allProfiles[key]) {
      allProfiles[key].displayName = displayName;
      allProfiles[key].phone       = phone;
      localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(allProfiles));
    }

    /* Update session with new display name */
    try {
      const sess = JSON.parse(sessionStorage.getItem(SPACE_SESSION_KEY) || "null");
      if (sess) { sess.displayName = displayName; sessionStorage.setItem(SPACE_SESSION_KEY, JSON.stringify(sess)); }
    } catch { /* ignore */ }

    renderSpaceProfile(email);
    showToast("Saved 💛");
  });

  safeCreateIcons();
}

/* ════════════════════════════════════════════════════════════════════════════
   §78 — Your Space: Emotional Luxury Ecosystem — Phase 1 render functions
   ════════════════════════════════════════════════════════════════════════════ */

/* ── renderSpaceOverview ─────────────────────────────────────────────────── */
/* Aggregate a member's order savings by time period (Parts 4 & 5).
   Matches orders by phone or email. Circle Benefits = lifetime value received. */
function abdanMemberSavings(profile) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]"); } catch { orders = []; }
  const email  = String(profile.email || "").toLowerCase();
  const fullP  = (typeof getSpaceProfiles === "function" ? getSpaceProfiles() : {})[email] || {};
  const phones = [profile.phone, fullP.phone].map((p) => String(p || "").replace(/\D/g, "")).filter(Boolean);
  const mine = orders.filter((o) => {
    const op = String(o.customerPhone || "").replace(/\D/g, "");
    const oe = String(o.customerEmail || "").toLowerCase();
    return (op && phones.includes(op)) || (email && oe === email);
  });
  const nowD = new Date();
  const startToday = new Date(); startToday.setHours(0, 0, 0, 0);
  const weekAgo = nowD.getTime() - 7 * 864e5;
  const acc = { today: 0, week: 0, month: 0, year: 0, life: 0 };
  mine.forEach((o) => {
    const s = Number(o.savings) || 0;
    if (s <= 0) return;
    acc.life += s;
    const d = new Date(o.createdAt || o.updatedAt || nowD);
    if (d >= startToday) acc.today += s;
    if (d.getTime() >= weekAgo) acc.week += s;
    if (d.getMonth() === nowD.getMonth() && d.getFullYear() === nowD.getFullYear()) acc.month += s;
    if (d.getFullYear() === nowD.getFullYear()) acc.year += s;
  });
  acc.circle = acc.life;   /* Circle Benefits received (tangible value) */
  return acc;
}

function renderSpaceOverview(profile) {
  const panel = document.getElementById("spaceOverviewPanel");
  if (!panel) return;
  /* Share the Love — surface any "discovered ABDAN through you" awards. */
  if (typeof reconcileReferralRewards === "function") { try { reconcileReferralRewards(); } catch {} }
  if (typeof flushShareNotifications === "function") { try { flushShareNotifications(profile.email || ""); } catch {} }

  const email    = profile.email || "";
  const first    = (profile.displayName || profile.fullName || "").split(" ")[0] || "you";
  const pts      = spGetLoyalty(email);
  const tier     = spGetTier(pts);
  const badges   = spGetBadges(email);
  const photo    = spGet(email, SP_PHOTO_KEY);
  /* S83 — member since + recently viewed */
  const joinedYear83 = (() => {
    const p = getSpaceProfiles()[(email || "").toLowerCase()] || {};
    return p.createdAt ? new Date(p.createdAt).getFullYear() : null;
  })();
  const mem83 = readMemory();
  const recentIds83 = (Array.isArray(mem83.lastViewedIds) ? mem83.lastViewedIds : []).slice(0, 3);
  const recentProducts83 = recentIds83.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const identity = spGet(email, SP_STYLE_KEY) || "";
  const wlSize   = getWishlist().size;

  /* §79 — Delivered moment: warm celebration if any delivered orders */
  let deliveredCount79 = 0;
  try {
    const fullProfile79 = getSpaceProfiles()[(email || "").toLowerCase()] || {};
    const phone79       = (fullProfile79.phone || "").replace(/\D/g, "");
    const allOrders79   = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]");
    const myOrders79    = phone79
      ? allOrders79.filter(o => String(o.customerPhone||"").replace(/\D/g,"") === phone79)
      : [];
    deliveredCount79 = myOrders79.filter(o => o.status === "delivered").length;
  } catch { /* ignore */ }

  const avatarHtml = photo
    ? `<img src="${photo}" alt="" />`
    : `<span>${first.charAt(0).toUpperCase()}</span>`;

  const tierIcons = ["✦", "◈", "◇", "♛"];
  const tierIdx   = SP_LOYALTY_TIERS.indexOf(tier);
  const tierIcon  = tierIcons[tierIdx >= 0 ? tierIdx : 0];

  const badgeHtml = badges.length
    ? `<div class="sp-badges">${badges.map(b =>
        `<span class="sp-badge"><span class="sp-badge__icon">${b.icon}</span>${b.label}</span>`
      ).join("")}</div>`
    : "";

  const affinityMood = getAffinityMood();

  /* §80 — Inner Circle editorial cards */
  const icCardsHtml80 = SP_IC_CARDS.map(card => {
    const unlocked = pts >= card.minPts;
    return `
      <div class="sp-ic-card ${unlocked ? "sp-ic-card--unlocked" : "sp-ic-card--locked"}">
        <p class="sp-ic-card__label">${card.label}</p>
        <p class="sp-ic-card__title">${card.title}</p>
        <p class="sp-ic-card__body">${card.body}</p>
        ${!unlocked ? `<span class="sp-ic-card__lock">Unlock at ${card.unlock}</span>` : ""}
      </div>`;
  }).join("");

  /* S86 — large editorial action cards: exact spec order */
  const actionCards = [
    { tab:"saved",       sym:"♡", title:"My Wardrobe",   desc:`${wlSize} piece${wlSize!==1?"s":""} saved` },
    { tab:"lookbook",    sym:"◻", title:"Lookbooks",      desc:"Your styling boards" },
    { tab:"savedmoments",sym:"◈", title:"Saved Moments",  desc:"Your memory archive" },
    { tab:"concierge",   sym:"✉", title:"Ask ABDAN",      desc:"Private concierge" },
    { tab:"requests",    sym:"◇", title:"My Requests",    desc:"Source a piece" },
    { tab:"messages",    sym:"◇", title:"Messages",       desc:"Your conversations" },
    { tab:"journal",     sym:"✦", title:"Journal",        desc:"Your style diary" },
    { tab:"shareearn",   sym:"💛", title:"Share the Love",  desc:"Invite friends · earn Circle Points" },
    { tab:"myjourney",   sym:"✨", title:"My Journey",      desc:"Your milestones with ABDAN" },
  ];

  panel.innerHTML = `
    <div class="sp-home">

      <!-- S86 — Profile Header: exact spec order -->
      <div class="sp-profile-hero">
        <div class="sp-profile-hero__av">${photo
          ? `<img src="${photo}" alt="${profile.displayName||""}" />`
          : `<span>${first.charAt(0).toUpperCase()}</span>`
        }</div>
        <h2 class="sp-profile-hero__name">${profile.displayName || profile.fullName || ""}</h2>
        ${identity
          ? `<p class="sp-profile-hero__identity">${identity}</p>`
          : `<button type="button" class="sp-profile-hero__identity sp-profile-hero__identity--set" onclick="showSpaceTab('profile')">Set your style identity →</button>`
        }
        <div class="sp-profile-hero__tier-row">
          <span class="sp-profile-hero__tier">${tier.name}</span>
          <span class="sp-profile-hero__pts">${pts} Devotion Points</span>
        </div>
        ${joinedYear83 ? `<p class="sp-profile-hero__since">Member Since ${joinedYear83}</p>` : ""}
      </div>

      ${deliveredCount79 > 0 ? `
      <div class="sp-delivered-note">
        <span class="sp-delivered-note__icon">◇</span>
        <div>
          <p class="sp-delivered-note__title">Beautifully delivered</p>
          <p class="sp-delivered-note__body">${deliveredCount79 === 1 ? "A piece" : `${deliveredCount79} pieces`} reached you.</p>
        </div>
      </div>` : ""}

      ${(() => {
        /* Parts 4 & 5 — My Savings + Circle Benefits (editorial, not gamified) */
        const sv = abdanMemberSavings(profile);
        if (sv.life <= 0) return "";
        const fc = (n) => formatCurrency(n);
        const cards = [
          { label: "Today",      value: sv.today },
          { label: "This Week",  value: sv.week },
          { label: "This Month", value: sv.month },
          { label: "This Year",  value: sv.year },
          { label: "Lifetime",   value: sv.life },
        ];
        return `
        <section class="sp-savings" aria-label="My Savings">
          <p class="sp-savings__kicker">My Savings</p>
          <div class="sp-savings__grid">
            ${cards.map((c) => `
              <div class="sp-savings__card${c.label === "Lifetime" ? " sp-savings__card--lifetime" : ""}">
                <span class="sp-savings__value">${fc(c.value)}</span>
                <span class="sp-savings__label">${c.label}</span>
              </div>`).join("")}
          </div>
          <div class="sp-circle-benefit">
            <p class="sp-circle-benefit__label">Circle Benefits Received</p>
            <p class="sp-circle-benefit__value">${fc(sv.circle)}</p>
            <p class="sp-circle-benefit__note">Savings, member-only pricing, and quiet access — held for you, with care. 💛</p>
          </div>
        </section>`;
      })()}

      <!-- S86 — Large editorial luxury action cards -->
      <div class="sp-action-grid">
        ${actionCards.map(c => `
          <button class="sp-action-card" type="button" onclick="showSpaceTab('${c.tab}')">
            <span class="sp-action-card__sym">${c.sym}</span>
            <span class="sp-action-card__title">${c.title}</span>
            <span class="sp-action-card__desc">${c.desc}</span>
          </button>`).join("")}
      </div>

      ${affinityMood ? `
        <div class="space-mood-profile">
          <div class="space-mood-profile__inner">
            <span class="space-mood-profile__kicker">A mood remembered</span>
            <p class="space-mood-profile__value">${affinityMood}</p>
            <button type="button" class="text-link space-mood-profile__cta" id="spaceOverviewMoodBtn">
              Explore this mood →
            </button>
          </div>
        </div>` : ""}

      <!-- §80 Inner Circle -->
      <div class="sp-ic-section">
        <p class="sp-ic-section__kicker">The Inner Circle</p>
        <div class="sp-ic-cards">${icCardsHtml80}</div>
      </div>

      ${recentProducts83.length > 0 ? `
      <div class="sp-recently">
        <p class="sp-recently__kicker">Continue Your Journey</p>
        <div class="sp-recently__list">
          ${recentProducts83.map(p => `
            <button type="button" class="sp-recently__item" onclick="openProduct('${p.id}')">
              <div class="sp-recently__thumb">
                <img src="${p.image}" alt="${p.name}" loading="lazy" />
              </div>
              <p class="sp-recently__name">${p.name}</p>
              <p class="sp-recently__price">${p.priceLabel || ""}</p>
            </button>`).join("")}
        </div>
      </div>` : ""}

      ${(() => {
        /* S88 — Recently Saved: products in wishlist */
        const wl = getWishlist();
        const saved = PRODUCTS.filter(p => wl.has(String(p.id))).slice(0, 3);
        if (!saved.length) return "";
        return `<div class="sp-recently">
          <p class="sp-recently__kicker">Recently Saved</p>
          <div class="sp-recently__list">
            ${saved.map(p => `
              <button type="button" class="sp-recently__item" onclick="openProduct('${p.id}')">
                <div class="sp-recently__thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
                <p class="sp-recently__name">${p.name}</p>
                <p class="sp-recently__price">${p.priceLabel || ""}</p>
              </button>`).join("")}
          </div>
        </div>`;
      })()}

      ${(() => {
        /* S88 — Inspired By Your Style: affinity-filtered products */
        const mood = getAffinityMood() || "";
        const styleId = spGet(email, SP_STYLE_KEY) || "";
        const inspired = PRODUCTS
          .filter(p => {
            if (!mood && !styleId) return false;
            const haystack = [p.name, p.primaryTag, ...(p.moods || []), p.description].join(" ").toLowerCase();
            return (mood && haystack.includes(mood.toLowerCase())) ||
                   (styleId && haystack.includes(styleId.toLowerCase().split(" ")[0]));
          })
          .filter(p => !recentIds83.includes(p.id))
          .slice(0, 3);
        if (!inspired.length) return "";
        return `<div class="sp-recently">
          <p class="sp-recently__kicker">Inspired By Your Style</p>
          <div class="sp-recently__list">
            ${inspired.map(p => `
              <button type="button" class="sp-recently__item" onclick="openProduct('${p.id}')">
                <div class="sp-recently__thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
                <p class="sp-recently__name">${p.name}</p>
                <p class="sp-recently__price">${p.priceLabel || ""}</p>
              </button>`).join("")}
          </div>
        </div>`;
      })()}

      ${(() => {
        /* S88 — Reserved For You: curated picks not yet viewed */
        const seenIds = new Set([...recentIds83, ...getWishlist()]);
        const reserved = PRODUCTS.filter(p => !seenIds.has(String(p.id))).slice(0, 3);
        if (!reserved.length) return "";
        return `<div class="sp-recently">
          <p class="sp-recently__kicker">Reserved For You</p>
          <div class="sp-recently__list">
            ${reserved.map(p => `
              <button type="button" class="sp-recently__item" onclick="openProduct('${p.id}')">
                <div class="sp-recently__thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" /></div>
                <p class="sp-recently__name">${p.name}</p>
                <p class="sp-recently__price">${p.priceLabel || ""}</p>
              </button>`).join("")}
          </div>
        </div>`;
      })()}

      <div class="space-browse-cta">
        <p class="space-browse-cta__text">The collection is waiting, curated with care.</p>
        <a class="secondary-button" href="#products">Continue Browsing</a>
      </div>

    </div>`;

  /* Wire mood explore button */
  document.getElementById("spaceOverviewMoodBtn")?.addEventListener("click", () => {
    if (affinityMood) {
      state.filter = affinityMood;
      renderFilters();
      renderProducts();
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

/* ── renderSpaceLookbook ─────────────────────────────────────────────────── */
function renderSpaceLookbook(email) {
  const panel = document.getElementById("spaceLookbookPanel");
  if (!panel) return;

  const items = spGetLookbook(email);

  const gridHtml = items.length
    ? `<div class="sp-lb-grid" id="spLbGrid">
        ${items.map((item, i) => `
          <div class="sp-lb-item" data-lb-idx="${i}">
            <img src="${item.src}" alt="${item.caption || ""}" loading="lazy" />
            <p class="sp-lb-item__caption"
               contenteditable="true"
               data-lb-cap="${i}"
               title="Click to edit caption">${item.caption || ""}</p>
            <button class="sp-lb-item__del" type="button" data-lb-del="${i}" aria-label="Remove">✕</button>
          </div>`).join("")}
      </div>`
    : `<div class="sp-empty">
        <div class="sp-empty__icon">◻</div>
        <p class="sp-empty__title">Your lookbook is waiting</p>
        <p class="sp-empty__body">Upload outfit moments, draping inspirations, and styling memories.</p>
      </div>`;

  panel.innerHTML = `
    <div class="sp-lookbook">
      <div class="sp-lookbook-head">
        <div>
          <h3 class="sp-lookbook-head__title">Your Lookbook</h3>
          <p class="sp-lookbook-head__sub">A private collection of beauty, yours alone.</p>
        </div>
      </div>

      <label class="sp-upload-area" id="spLbUploadArea">
        <input type="file" accept="image/*" multiple id="spLbFileInput" />
        <div class="sp-upload-area__icon">◻</div>
        <p class="sp-upload-area__title">Add to your lookbook</p>
        <p class="sp-upload-area__sub">JPEG · PNG · WEBP — stored privately on this device</p>
      </label>

      ${gridHtml}
    </div>`;

  /* File upload */
  document.getElementById("spLbFileInput")?.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let processed = 0;
    const current = spGetLookbook(email);
    files.forEach(file => {
      if (!file.type.startsWith("image/")) { processed++; return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        current.push({ src: ev.target.result, caption: "", addedAt: Date.now() });
        processed++;
        if (processed === files.length) {
          spSaveLookbook(email, current);
          renderSpaceLookbook(email);
          showToast("Added to your lookbook 💛");
          /* Award loyalty only for first upload */
          if (current.length === files.length) spAddLoyalty(email, 10);
        }
      };
      reader.readAsDataURL(file);
    });
  });

  /* Drag-over styling */
  const uploadArea = document.getElementById("spLbUploadArea");
  uploadArea?.addEventListener("dragover",  (e) => { e.preventDefault(); uploadArea.classList.add("is-dragover"); });
  uploadArea?.addEventListener("dragleave", ()  => uploadArea.classList.remove("is-dragover"));
  uploadArea?.addEventListener("drop",      (e) => {
    e.preventDefault();
    uploadArea.classList.remove("is-dragover");
    document.getElementById("spLbFileInput").files = e.dataTransfer.files;
    document.getElementById("spLbFileInput").dispatchEvent(new Event("change"));
  });

  /* Delete items */
  panel.addEventListener("click", (e) => {
    const delBtn = e.target.closest("[data-lb-del]");
    if (!delBtn) return;
    const idx  = parseInt(delBtn.dataset.lbDel, 10);
    const cur  = spGetLookbook(email);
    cur.splice(idx, 1);
    spSaveLookbook(email, cur);
    renderSpaceLookbook(email);
  });

  /* Caption edits — save on blur */
  panel.addEventListener("blur", (e) => {
    const cap = e.target.closest("[data-lb-cap]");
    if (!cap) return;
    const idx = parseInt(cap.dataset.lbCap, 10);
    const cur = spGetLookbook(email);
    if (cur[idx]) {
      cur[idx].caption = cap.textContent.trim();
      spSaveLookbook(email, cur);
    }
  }, true);
}

/* ── renderSpaceConcierge ────────────────────────────────────────────────── */
function renderSpaceConcierge(email) {
  const panel = document.getElementById("spaceConciergePanel");
  if (!panel) return;

  const msgs = spGetConcierge(email);

  const threadHtml = msgs.length
    ? msgs.map(m => {
        const imgHtml = m.imgSrc
          ? `<img src="${m.imgSrc}" alt="" class="sp-msg__img" loading="lazy" />`
          : "";
        return `
          <div class="sp-msg sp-msg--sent">
            <div class="sp-msg__bubble">${m.text || ""}</div>
            ${imgHtml}
            <span class="sp-msg__meta">
              ${m.sentAt ? new Date(m.sentAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : ""}
              &nbsp;·&nbsp;
              <a class="sp-msg__wa-link"
                 href="https://wa.me/918760595307?text=${encodeURIComponent((m.text||"").substring(0,200))}"
                 target="_blank" rel="noreferrer"><svg class="social-icon wa-glyph" aria-hidden="true"><use href="#icon-whatsapp"/></svg>Continue ↗</a>
            </span>
          </div>`;
      }).join("")
    : `<div class="sp-empty" style="padding:1.5rem 0">
        <div class="sp-empty__icon">✉</div>
        <p class="sp-empty__title">A quiet line to ABDAN</p>
        <p class="sp-empty__body">Ask about a piece, request styling guidance, or share an inspiration.</p>
      </div>`;

  panel.innerHTML = `
    <div class="sp-concierge">

      <div class="sp-concierge-intro">
        <p class="sp-concierge-intro__kicker">Private Concierge</p>
        <h3 class="sp-concierge-intro__title">Ask ABDAN anything</h3>
        <p class="sp-concierge-intro__body">
          Styling questions, fabric guidance, sourcing a specific piece —
          your message goes directly to ABDAN via WhatsApp.
          Personal, warm, and always thoughtful.
        </p>
      </div>

      <div class="sp-msg-thread" id="spMsgThread">${threadHtml}</div>

      <div class="sp-occ-row" id="spConciergeOccRow">
        <span class="sp-occ-row__label">Quick starts</span>
        <button class="sp-occ-chip" type="button" data-cocc="Festive occasion — I'm looking for styling guidance for a festive occasion.">Festive occasion</button>
        <button class="sp-occ-chip" type="button" data-cocc="Wedding styling — I'm attending a wedding and would love your guidance on the perfect saree.">Wedding styling</button>
        <button class="sp-occ-chip" type="button" data-cocc="Everyday grace — I'm looking for something beautiful I can wear every day.">Everyday grace</button>
        <button class="sp-occ-chip" type="button" data-cocc="A gift for someone special — Could you help me choose a thoughtful piece?">A gift</button>
        <button class="sp-occ-chip" type="button" data-cocc="I'm interested in a custom piece. Could you tell me more about your bespoke process?">Custom piece</button>
        <button class="sp-occ-chip" type="button" data-cocc="I'd love guidance on fabric — what would you recommend for">Fabric guidance</button>
      </div>

      <div class="sp-compose" id="spCompose">
        <div class="sp-compose__img-preview" id="spComposeImgPrev"></div>
        <textarea class="sp-compose__textarea"
                  id="spComposeText"
                  placeholder="Ask about a piece, request styling advice, share an inspiration…"
                  rows="3"></textarea>
        <div class="sp-compose__actions">
          <label class="sp-compose__img-btn" title="Attach an image" aria-label="Attach image">
            📎
            <input type="file" accept="image/*" id="spComposeImg" style="display:none" />
          </label>
          <button type="button" class="sp-compose__send" id="spComposeSend">
            Send to ABDAN
          </button>
        </div>
      </div>
      <p class="sp-compose__note">Your message will open WhatsApp — responded to personally by ABDAN.</p>

    </div>`;

  /* Image preview */
  let pendingImgSrc = null;
  document.getElementById("spComposeImg")?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pendingImgSrc = ev.target.result;
      const prev = document.getElementById("spComposeImgPrev");
      if (prev) {
        prev.classList.add("has-img");
        prev.innerHTML = `<img src="${pendingImgSrc}" alt="" />
          <span class="sp-compose__img-clear" id="spComposeImgClear">✕ Remove</span>`;
        document.getElementById("spComposeImgClear")?.addEventListener("click", () => {
          pendingImgSrc = null;
          prev.classList.remove("has-img");
          prev.innerHTML = "";
        });
      }
    };
    reader.readAsDataURL(file);
  });

  /* Send */
  document.getElementById("spComposeSend")?.addEventListener("click", () => {
    const ta   = document.getElementById("spComposeText");
    const text = ta?.value?.trim() || "";
    if (!text && !pendingImgSrc) return;

    const msg = { text, imgSrc: pendingImgSrc, sentAt: Date.now() };
    spAddMsg(email, msg);

    /* Award loyalty for first message */
    const allMsgs = spGetConcierge(email);
    if (allMsgs.length === 1) spAddLoyalty(email, 20);

    /* Open WhatsApp with message text */
    const waText = text
      ? `[ABDAN Concierge] ${text}${pendingImgSrc ? "\n\n(Image attached — I'll share it in the chat)" : ""}`
      : "[ABDAN Concierge] I've attached an inspiration image for you.";
    window.open(`https://wa.me/918760595307?text=${encodeURIComponent(waText)}`, "_blank", "noreferrer");

    /* Reset compose */
    if (ta) ta.value = "";
    pendingImgSrc = null;
    const prev = document.getElementById("spComposeImgPrev");
    if (prev) { prev.classList.remove("has-img"); prev.innerHTML = ""; }

    /* Re-render thread */
    renderSpaceConcierge(email);
    showToast("Your message is ready — sent via WhatsApp 💛");
  });

  /* §80 — Occasion quick-start chips pre-fill the compose textarea */
  document.getElementById("spConciergeOccRow")?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cocc]");
    if (!chip) return;
    const ta = document.getElementById("spComposeText");
    if (ta) {
      ta.value = chip.dataset.cocc;
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
  });
}

/* ── §80 renderSpaceJournal ──────────────────────────────────────────────── */
function renderSpaceJournal(email) {
  const panel = document.getElementById("spaceJournalPanel");
  if (!panel) return;

  const entries = spGetJournal(email);

  const entryHtml = entries.length
    ? [...entries].reverse().map(e => {
        const dateStr = e.createdAt
          ? new Date(e.createdAt).toLocaleDateString("en-IN",
              { day: "numeric", month: "short", year: "numeric" })
          : "";
        const safeText = (e.text || "")
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `
          <div class="sp-j-entry" data-entry-id="${e.id}">
            <div class="sp-j-entry__head">
              <span class="sp-j-entry__mood">${e.mood || "◇"}</span>
              <span class="sp-j-entry__meta">${dateStr}</span>
              ${e.occasion ? `<span class="sp-j-entry__occ">${e.occasion}</span>` : ""}
            </div>
            <p class="sp-j-entry__body">${safeText}</p>
            <button class="sp-j-entry__del" type="button"
                    data-del-entry="${e.id}" aria-label="Delete journal entry">✕</button>
          </div>`;
      }).join("")
    : `<div class="sp-empty">
        <div class="sp-empty__icon">✦</div>
        <p class="sp-empty__title">A quiet place for your thoughts</p>
        <p class="sp-empty__body">Write about a moment, a feeling, or a look that stayed with you.</p>
      </div>`;

  const moodBtns = SP_JOURNAL_MOODS.map((m, i) =>
    `<button class="sp-j-mood-btn${i === 0 ? " is-selected" : ""}" type="button"
             data-jmood="${m.sym}" title="${m.label}" aria-label="${m.label}">${m.sym}</button>`
  ).join("");

  const occChips = SP_JOURNAL_OCCASIONS.map(o =>
    `<button class="sp-j-occ-chip" type="button" data-jocc="${o}">${o}</button>`
  ).join("");

  panel.innerHTML = `
    <div class="sp-journal">
      <div class="sp-journal-head">
        <p class="sp-journal-head__kicker">Style Journal</p>
        <h3 class="sp-journal-head__title">Your private fashion diary</h3>
        <p class="sp-journal-head__sub">A quiet place to capture styling thoughts, outfit ideas, and fashion moments that matter only to you.</p>
      </div>
      <div class="sp-journal-compose" id="spJournalCompose">
        <p class="sp-journal-compose__label">How are you feeling?</p>
        <div class="sp-j-mood-row" id="spJournalMoodRow">${moodBtns}</div>
        <p class="sp-journal-compose__label">Occasion</p>
        <div class="sp-j-occ-row" id="spJournalOccRow">${occChips}</div>
        <textarea class="sp-journal-textarea" id="spJournalText"
                  placeholder="Write about a look you loved, a styling idea, or a moment to remember…"
                  rows="3"></textarea>
        <button type="button" class="sp-journal-save" id="spJournalSave">Save to journal</button>
      </div>
      <div class="sp-j-list" id="spJournalList">${entryHtml}</div>
    </div>`;

  let selectedMood = SP_JOURNAL_MOODS[0].sym;
  document.getElementById("spJournalMoodRow")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-jmood]");
    if (!btn) return;
    selectedMood = btn.dataset.jmood;
    document.querySelectorAll(".sp-j-mood-btn").forEach(b => {
      b.classList.toggle("is-selected", b.dataset.jmood === selectedMood);
    });
  });

  let selectedOcc = "";
  document.getElementById("spJournalOccRow")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-jocc]");
    if (!btn) return;
    const occ = btn.dataset.jocc;
    selectedOcc = selectedOcc === occ ? "" : occ;
    document.querySelectorAll(".sp-j-occ-chip").forEach(b => {
      b.classList.toggle("is-selected", b.dataset.jocc === selectedOcc);
    });
  });

  document.getElementById("spJournalSave")?.addEventListener("click", () => {
    const ta   = document.getElementById("spJournalText");
    const text = ta?.value?.trim() || "";
    if (!text) { showToast("Write a little something first 💛"); return; }
    const entry = {
      id:        Date.now().toString(36),
      text,
      mood:      selectedMood,
      occasion:  selectedOcc,
      createdAt: Date.now(),
    };
    const allEntries = spGetJournal(email);
    allEntries.push(entry);
    spSaveJournal(email, allEntries);
    if (allEntries.length === 1) spAddLoyalty(email, 10);
    renderSpaceJournal(email);
    showToast("Saved to your journal 💛");
  });

  document.getElementById("spJournalList")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-del-entry]");
    if (!btn) return;
    const id       = btn.dataset.delEntry;
    const filtered = spGetJournal(email).filter(en => en.id !== id);
    spSaveJournal(email, filtered);
    renderSpaceJournal(email);
    showToast("Entry removed 💛");
  });
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

/* ── §72: Cinematic editorial CTA language ───────────────────────────── */
const CTA_LABELS = [
  "Explore the Piece",
  "Keep This Close",
  "Discover the Story",
  "Add to Your Space",
  "Wear It Gently",
];

/* ── §72: Editorial breathing pauses injected every 4 products ───────── */
const EDITORIAL_PAUSES = [
  {
    quote: "Each thread carries a quiet intention.",
    sub:   "Woven for the woman who moves through the world with grace.",
  },
  {
    quote: "Dressed in devotion.",
    sub:   "Every piece begins with emotion — chosen slowly, felt deeply.",
  },
  {
    quote: "The softest things endure.",
    sub:   "ABDAN's curation begins with feeling, not with inventory.",
  },
];

function renderProducts() {
  applyStudioOverrides();
  const filteredProducts = state.filter === "All"
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.primaryTag === state.filter);

  const wl = getWishlist();

  const paintCards = () => {
    /* ── Build cinematic scene cards with editorial pause injections ── */
    const cardHtmls = filteredProducts.map((product, index) => {
      const saved      = wl.has(product.id);
      const ctaLabel   = CTA_LABELS[index % CTA_LABELS.length];
      const verse      = buildEditorialExcerpt(product);
      const numeral    = String(index + 1).padStart(2, "0");
      const savedLabel = saved ? "Remove from wishlist" : "Save to wishlist";

      return `
        <article class="product-card reveal" data-product-card="${product.id}">
          <div class="product-card__media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <div class="product-card__atmos" aria-hidden="true"></div>

            <!-- Corner cluster: save heart + index numeral -->
            <div class="product-card__corner-cluster">
              <button class="product-card__save${saved ? " is-saved" : ""}"
                      type="button"
                      data-wishlist="${product.id}"
                      aria-label="${savedLabel}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <span class="product-card__index" aria-hidden="true">${numeral}</span>
            </div>

            <!-- Story layer: floats over cinematic gradient -->
            <div class="product-card__story">
              <span class="product-card__emotion-chip">${product.primaryTag}</span>
              ${abdanBadgeHtml(product, "card")}
              <h3 class="product-card__title">${product.name}</h3>
              <p class="product-card__verse">${verse}</p>
              <div class="product-card__quiet-row">
                ${abdanCardPriceHtml(product)}
                <button class="product-card__cta" type="button" data-preview="${product.id}">
                  ${ctaLabel}
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    });

    /* Inject editorial pause after every 4th card (not at end) */
    const gridParts = [];
    cardHtmls.forEach((html, i) => {
      gridParts.push(html);
      if ((i + 1) % 4 === 0 && i < cardHtmls.length - 1) {
        const pause = EDITORIAL_PAUSES[Math.floor(i / 4) % EDITORIAL_PAUSES.length];
        gridParts.push(`
          <div class="product-pause-card" aria-hidden="true">
            <p class="pause-quote">${pause.quote}</p>
            <p class="pause-sub">${pause.sub}</p>
          </div>
        `);
      }
    });
    dom.productsGrid.innerHTML = gridParts.join("");

    /* Reset carousel — filter changes always start from card 1 */
    dom.productsGrid.scrollLeft = 0;

    /* Stagger reveal delays + cinematic image load */
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
    renderMoodEditorial(); /* sync mood editorial with current filter state */
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
       aria-label="Share on ${btn.label}" title="${btn.label}"
       role="listitem">
      <svg class="social-icon" aria-hidden="true"><use href="#${btn.icon}"/></svg>
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

  /* ── Emotional memory: record this exploration ───────────────────────── */
  recordProductView(productId);

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

  /* ── Premium savings & transparency block on the product page ──────────
     Shows Original / Current / Savings amount / Savings %. Removed cleanly
     when the piece carries no compare-at price (keeps presentation honest). */
  {
    const sv = abdanSavings(product);
    let block = document.getElementById("productSavings");
    let badgeEl = document.getElementById("productBadgeChip");
    /* Editorial badge chip beside the tag */
    if (!badgeEl && dom.productTag && dom.productTag.parentNode) {
      badgeEl = document.createElement("span");
      badgeEl.id = "productBadgeChip";
      dom.productTag.parentNode.insertBefore(badgeEl, dom.productTag.nextSibling);
    }
    if (badgeEl) {
      badgeEl.innerHTML = product.badge
        ? `<span class="abdan-badge abdan-badge--sheet">${product.badge}</span>` : "";
    }
    if (sv) {
      if (!block && dom.productPrice && dom.productPrice.parentNode) {
        block = document.createElement("div");
        block.id = "productSavings";
        block.className = "product-savings";
        dom.productPrice.parentNode.insertBefore(block, dom.productPrice.nextSibling);
      }
      if (block) {
        dom.productPrice.classList.add("is-saver");
        block.innerHTML = `
          <div class="product-savings__rows">
            <span class="product-savings__row"><span>Original Price</span><span class="product-savings__was">${formatCurrency(sv.compare)}</span></span>
            <span class="product-savings__row"><span>Current Price</span><span class="product-savings__now">${formatCurrency(sv.current)}</span></span>
            <span class="product-savings__row product-savings__row--accent"><span>You Save</span><strong>${formatCurrency(sv.amount)}</strong></span>
            <span class="product-savings__row product-savings__row--accent"><span>Savings</span><strong>${sv.pct}%</strong></span>
          </div>`;
        block.hidden = false;
      }
    } else {
      dom.productPrice.classList.remove("is-saver");
      if (block) { block.innerHTML = ""; block.hidden = true; }
    }
  }
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
  renderShareCard(product);      /* S81 — branded share preview card */
  updateProductOG(product);      /* S81 — dynamic OG meta tags */
  renderEmotionalRecommendations(product); /* emotionally adjacent pieces */

  /* Reset scroll so every open starts from the top of the content area */
  const contentEl = dom.productSheet.querySelector(".product-sheet__content");
  if (contentEl) contentEl.scrollTop = 0;

  dom.productSheet.classList.add("is-open");
  dom.productSheet.setAttribute("aria-hidden", "false");
  dom.body.classList.add("is-locked");
  updateOverlayState();
  safeCreateIcons();

  /* §79 — Enrich inquiry link + support pill with this product's context */
  const askText79 = `I'm interested in the ${product.name}. Could you share more about availability, fabric, and sizing?`;
  const askEncoded79 = encodeURIComponent(askText79);
  const askLink79 = document.getElementById("productSheetAsk");
  if (askLink79) askLink79.href = `https://wa.me/918760595307?text=${askEncoded79}`;
  dom.supportPill?.setAttribute("href", `https://wa.me/918760595307?text=${askEncoded79}`);
}

function closeProduct() {
  dom.productSheet.classList.remove("is-open");
  dom.productSheet.setAttribute("aria-hidden", "true");
  if (!dom.cartDrawer.classList.contains("is-open") && !dom.teaserModal.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
  updateOverlayState();
  /* §79 — Restore support pill to default when product sheet closes */
  dom.supportPill?.setAttribute("href", "https://wa.me/918760595307");
  /* RC-03: reset OG meta to site defaults so sharing the main URL shows the site, not last product */
  const OG_DEFAULTS = [
    ["og:title",           "property", `${BRAND.name} | ${BRAND.tagline}`],
    ["og:description",     "property", "Thoughtfully curated modest fashion for the woman who moves through her days with devotion, grace, and quiet intention."],
    ["og:image",           "property", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"],
    ["og:url",             "property", "https://abdan.in"],
    ["twitter:title",      "name",     `${BRAND.name} | ${BRAND.tagline}`],
    ["twitter:description","name",     "Thoughtfully curated modest fashion for the woman who moves through her days with devotion, grace, and quiet intention."],
    ["twitter:image",      "name",     "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"],
  ];
  OG_DEFAULTS.forEach(([key, attr, val]) => {
    const el = document.querySelector(`meta[${attr}="${key}"]`);
    if (el) el.content = val;
  });
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
    const saveLineEmpty = document.getElementById("cartSavingsLine");
    if (saveLineEmpty) saveLineEmpty.hidden = true;
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

  /* ── Totals incl. coupon + automated-rule benefits ──────────────────── */
  const totals = computeCartTotals();
  dom.cartTotal.textContent = formatCurrency(totals.total);
  dom.cartCount.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));

  /* Compare-at savings line (Part 3) */
  const cartSave = abdanCartSavings();
  const saveLine = document.getElementById("cartSavingsLine");
  const saveVal  = document.getElementById("cartSavings");
  if (saveLine && saveVal) {
    if (cartSave > 0) { saveVal.textContent = formatCurrency(cartSave); saveLine.hidden = false; }
    else { saveLine.hidden = true; }
  }

  /* Automated rule benefit line */
  const ruleLine = document.getElementById("cartRuleLine");
  if (ruleLine) {
    if (totals.ruleDiscount > 0) {
      document.getElementById("cartRuleLabel").textContent = totals.ruleName;
      document.getElementById("cartRuleAmount").textContent = `−${formatCurrency(totals.ruleDiscount)}`;
      ruleLine.hidden = false;
    } else { ruleLine.hidden = true; }
  }

  /* Applied coupon line */
  const cpLine = document.getElementById("cartCouponLine");
  if (cpLine) {
    if (totals.couponDiscount > 0) {
      document.getElementById("cartCouponLabel").textContent = `Coupon · ${totals.couponCode}`;
      document.getElementById("cartCouponAmount").textContent = `−${formatCurrency(totals.couponDiscount)}`;
      cpLine.hidden = false;
    } else { cpLine.hidden = true; }
  }

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
      <p class="cart-success__title">Carefully reserved, ${first}</p>
      <p class="cart-success__body">Every piece you have chosen is now quietly held — awaiting personal confirmation and thoughtful preparation before it begins its journey to you.</p>
      ${order && order.savings > 0 ? `<p class="cart-success__savings">ABDAN helped you save ${formatCurrency(order.savings)} on this order 💛</p>` : ""}
      <p class="cart-success__note">Opening WhatsApp so you can stay in touch with ABDAN directly. 💛</p>
      ${ref ? `<p class="cart-success__ref">Ref · ${ref}</p>` : ""}
      ${timeline}
      <div class="cj-journey">
        <p class="cj-journey__heading">Your journey with ABDAN</p>
        <div class="cj-steps">
          <div class="cj-step">
            <span class="cj-step__icon">✦</span>
            <div>
              <p class="cj-step__title">Personal confirmation</p>
              <p class="cj-step__body">ABDAN will reach out via WhatsApp to confirm your reservation and answer anything you'd like to know.</p>
            </div>
          </div>
          <div class="cj-step">
            <span class="cj-step__icon">◈</span>
            <div>
              <p class="cj-step__title">Thoughtfully prepared</p>
              <p class="cj-step__body">Each piece is carefully verified and packed with quiet attention — the way it deserves to travel.</p>
            </div>
          </div>
          <div class="cj-step">
            <span class="cj-step__icon">◇</span>
            <div>
              <p class="cj-step__title">Delivered with care</p>
              <p class="cj-step__body">Follow its journey in Your Space. A beautiful piece is making its way, gently and surely, to you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  dom.cartTotal.textContent = formatCurrency(0);
  dom.cartCount.textContent = "0";
  dom.cartCheckoutButton.hidden = true;
  dom.bagCheckoutPanel.hidden = true;
  safeCreateIcons();
  lxOrderStory(); /* §56 — cinematic stagger: check → title → body → note → timeline */
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
    /* WAAPI heart bloom — restrained: a quiet bloom, not a performance */
    const svg = btn.querySelector("svg");
    if (svg && typeof svg.animate === "function") {
      svg.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.22)", offset: 0.28 },
          { transform: "scale(0.92)", offset: 0.56 },
          { transform: "scale(1.05)", offset: 0.78 },
          { transform: "scale(1)" },
        ],
        { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }   /* ease-snap — was spring 500ms */
      );
    }
    showToast("Quietly saved 💛");
    lxHeartBurst(btn); /* §56 — floating particles, distinct from WAAPI bloom above */
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

  /* Cart drawer — swipe to dismiss
     Desktop: slides from right  → swipe rightward (axis "x", closeDir 1)
     Mobile:  rises from bottom  → swipe downward  (axis "y", closeDir 1)
     The bottom sheet conversion (CSS §33a) changes the visual direction;
     the swipe axis must match so the gesture feels physically correct.   */
  const cartPanel = dom.cartDrawer?.querySelector(".cart-drawer__panel");
  if (dom.cartDrawer && cartPanel) {
    const isMobileCart = () => window.innerWidth <= 767;
    attachSwipe(dom.cartDrawer, cartPanel, {
      axis:        isMobileCart() ? "y" : "x",
      closeDir:    1,       /* downward on mobile, rightward on desktop */
      threshold:   isMobileCart() ? 110 : 88,
      velocityMin: 0.38,
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
  /* Savings captured on the order — powers confirmation, Your Space & analytics. */
  if (typeof applyStudioOverrides === "function") applyStudioOverrides();
  const compareSavings = items.reduce((sum, item) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    const sv = abdanSavings(p);
    return sum + (sv ? sv.amount * (item.quantity || 1) : 0);
  }, 0);
  /* Coupon + automated-rule benefits apply to the bag (cart) flow only. */
  let couponDiscount = 0, ruleDiscount = 0, couponCode = "", ruleName = "";
  if (items === state.cart) {
    const t = computeCartTotals();
    couponDiscount = t.couponDiscount; ruleDiscount = t.ruleDiscount;
    couponCode = t.couponCode; ruleName = t.ruleName;
  }
  const finalTotal = Math.max(0, total - couponDiscount - ruleDiscount);
  const savings = compareSavings + couponDiscount + ruleDiscount;
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
    total:         finalTotal,
    subtotal:      total,
    savings,
    compareSavings,
    couponCode,
    couponDiscount,
    ruleName,
    ruleDiscount,
    items: items.map((item) => ({
      id:         item.id || "",
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
  /* Record coupon redemption (powers usage limits + analytics "Most Used"). */
  if (couponCode) {
    try {
      const coupons = JSON.parse(localStorage.getItem("abdan-studio-coupons") || "[]");
      const c = coupons.find((x) => String(x.code).toUpperCase() === String(couponCode).toUpperCase());
      if (c) {
        c.uses = Number(c.uses || 0) + 1;
        const em = String(order.customerEmail || "").toLowerCase();
        if (em) { c.usedBy = c.usedBy || {}; c.usedBy[em] = (c.usedBy[em] || 0) + 1; }
        localStorage.setItem("abdan-studio-coupons", JSON.stringify(coupons));
      }
    } catch { /* ignore */ }
  }
  state.appliedCoupon = null;   /* reset for the next order */
  /* Share & Earn — attribute referral on order, then reconcile any rewards. */
  if (typeof attributeReferral === "function") { try { attributeReferral(order.customerEmail, order.customerPhone); } catch {} }
  if (typeof reconcileReferralRewards === "function") { try { reconcileReferralRewards(); } catch {} }
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
  let done = false;
  const cleanup = () => {
    if (done) return;
    done = true;
    panel.classList.remove("is-revealing");
  };
  panel.addEventListener("animationend", cleanup, { once: true });
  setTimeout(cleanup, 400); /* fallback — animationend not guaranteed */
  /* Scroll into view after the panel has had a frame to paint */
  requestAnimationFrame(() => panel.scrollIntoView({ behavior: "smooth", block: "nearest" }));
}

function lxHideCheckoutPanel(panel) {
  if (!panel || panel.hidden) return;
  panel.classList.remove("is-revealing");
  panel.classList.add("is-hiding");
  let done = false;
  const onDone = () => {
    if (done) return;
    done = true;
    panel.classList.remove("is-hiding");
    panel.hidden = true;
  };
  panel.addEventListener("animationend", onDone, { once: true });
  setTimeout(onDone, 280); /* fallback — prevents panel from staying visible if animationend misses */
}

function addToCart() {
  const product = getActiveProduct();
  if (!product) return;

  if (!state.selectedSize || !state.selectedColor) {
    showToast("Choose a size and colour to continue.");
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
      { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }   /* ease-snap — was spring 420ms */
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
  setTimeout(lxCartGlow,  540); /* §56 — glow ring, distinct from pulse scale */

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
  dom.cartToggle.setAttribute("aria-expanded", "true");
  dom.body.classList.add("is-locked");
  updateOverlayState();
}

function closeCart() {
  dom.cartDrawer.classList.remove("is-open");
  dom.cartDrawer.setAttribute("aria-hidden", "true");
  dom.cartToggle.setAttribute("aria-expanded", "false");
  if (!dom.productSheet.classList.contains("is-open") && !dom.teaserModal.classList.contains("is-open")) {
    dom.body.classList.remove("is-locked");
  }
  updateOverlayState();
}

function applyCartCoupon() {
  const input = document.getElementById("cartCouponInput");
  const msg   = document.getElementById("cartCouponMsg");
  const v = validateCoupon(input ? input.value : "");
  if (v.ok) {
    state.appliedCoupon = v.coupon.code;
    if (input) input.value = "";
    if (msg) { msg.textContent = `${v.message} · You save ${formatCurrency(v.discount)}`; msg.className = "drawer-coupon__msg drawer-coupon__msg--ok"; msg.hidden = false; }
  } else {
    state.appliedCoupon = null;
    if (msg) { msg.textContent = v.message; msg.className = "drawer-coupon__msg drawer-coupon__msg--err"; msg.hidden = false; }
  }
  renderCart();
}
function removeCartCoupon() {
  state.appliedCoupon = null;
  const msg = document.getElementById("cartCouponMsg");
  if (msg) msg.hidden = true;
  renderCart();
}

function toggleBagCheckout() {
  if (!state.cart.length) return;
  if (dom.bagCheckoutPanel.hidden) {
    /* You Saved ₹X On This Order (Part 3 — checkout) incl. coupon + rule */
    const t  = computeCartTotals();
    const cs = abdanCartSavings() + t.couponDiscount + t.ruleDiscount;
    const el = document.getElementById("bagCheckoutSavings");
    if (el) {
      if (cs > 0) { el.textContent = `You Saved ${formatCurrency(cs)} On This Order`; el.hidden = false; }
      else { el.hidden = true; }
    }
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
    showToast("Please add your name and number to continue.");
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
    ...(() => {
      const subtotal = items.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0);
      const t = (items === state.cart) ? computeCartTotals() : { ruleDiscount: 0, couponDiscount: 0, couponCode: "", ruleName: "", total: subtotal };
      const out = [];
      if (t.ruleDiscount > 0 || t.couponDiscount > 0) {
        out.push(`Subtotal: ${formatCurrency(subtotal)}`);
        if (t.ruleDiscount > 0)   out.push(`${t.ruleName}: −${formatCurrency(t.ruleDiscount)}`);
        if (t.couponDiscount > 0) out.push(`Coupon ${t.couponCode}: −${formatCurrency(t.couponDiscount)}`);
      }
      out.push(`Total: ${formatCurrency(t.total)}`);
      return out;
    })(),
    details.notes ? `Notes: ${details.notes}` : null,
    ``,
    `Please confirm availability before dispatch.`,
  ].filter(Boolean);

  return `${BRAND.whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function launchRazorpay(details, items) {
  const total = (items === state.cart)
    ? computeCartTotals().total
    : items.reduce((sum, item) => sum + getNumericPrice(item.priceLabel) * item.quantity, 0);
  if (!window.Razorpay) {
    showToast("Razorpay couldn't load. Try UPI or reach us on WhatsApp.");
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
      { duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }    /* ease-out — no spring needed here */
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
    showToast("UPI ID copied 💛");
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
  let lastY   = window.scrollY;
  let ticking = false;

  const updateChrome = () => {
    const y          = window.scrollY;
    const isScrolled = y > 18;
    const goingDown  = y > lastY;
    const scrolledFar = y > 100;   /* ignore micro-scrolls at page top */

    dom.siteHeader.classList.toggle("is-scrolled", isScrolled);
    dom.bottomDock.classList.toggle("is-scrolled", isScrolled);
    dom.body.classList.toggle("is-scrolled", isScrolled);

    /* ── Scroll-direction nav hide/show (desktop + mobile header) ───────
       Hide the site-header when scrolling down past the threshold;
       reveal instantly on any upward scroll. This is the Phillip Murphy /
       Apple pattern: the nav is invisible when the user is reading and
       present when they reach up to navigate.
       On desktop the bottom-dock is visually coupled to the header
       (both sit at the top) so it hides with it.                       */
    if (scrolledFar && goingDown) {
      dom.siteHeader.classList.add("is-nav-hidden");
      /* Desktop only: dock travels with header */
      if (window.innerWidth > 767) {
        dom.bottomDock.classList.add("is-nav-hidden");
      }
    } else if (!goingDown) {
      dom.siteHeader.classList.remove("is-nav-hidden");
      if (window.innerWidth > 767) {
        dom.bottomDock.classList.remove("is-nav-hidden");
      }
    }

    lastY   = y;
    ticking = false;
  };

  updateChrome();
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateChrome);
  }, { passive: true });
}

/* ── §33 Scroll-aware dock hiding (mobile only) ──────────────────────
   The bottom dock occupies ~56px of viewport. On a 390px phone that is
   ~14% of visible height — meaningful space when reading. This function
   hides the dock on downward scroll (user is consuming content) and
   restores it on upward intent (user is navigating). Three guards:
   1. Only active on mobile (≤ 767px) — desktop dock is a pill at top
   2. Ignores near-bottom position — dock reappears at page end so user
      can navigate after reading (nearBottom threshold: 200px from end)
   3. Ignores trivial scroll (y < 140) — prevent flicker on page load
   Uses rAF batching so the listener never blocks paint.               */
function initScrollAwareDock() {
  const dock = dom.bottomDock;
  if (!dock) return;

  let lastY   = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y          = window.scrollY;
      const onMobile   = window.innerWidth <= 767;
      const scrolledFar = y > 140;
      const goingDown  = y > lastY;
      const nearBottom = (window.innerHeight + y) >= document.documentElement.scrollHeight - 200;

      if (onMobile && scrolledFar && goingDown && !nearBottom) {
        dock.classList.add("is-dock-hidden");
      } else {
        dock.classList.remove("is-dock-hidden");
      }

      lastY   = y;
      ticking = false;
    });
  }, { passive: true });
}

function attachEvents() {
  /* RC-04: debounce 100ms prevents rapid-click race condition on theme toggle */
  let _themeDebounceTimer = null;
  dom.themeToggle.addEventListener("click", () => {
    if (_themeDebounceTimer) return;
    setTheme(state.theme === "dark" ? "light" : "dark");
    _themeDebounceTimer = setTimeout(() => { _themeDebounceTimer = null; }, 100);
  });
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

    /* ── Emotional memory: record mood engagement ─────────────────── */
    recordFilterUsage(state.filter);

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
  document.getElementById("cartCouponApply")?.addEventListener("click", applyCartCoupon);
  document.getElementById("cartCouponInput")?.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); applyCartCoupon(); } });
  document.getElementById("cartCouponRemove")?.addEventListener("click", removeCartCoupon);
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

  /* ── Space tab delegation — single listener on the nav container ─── */
  document.getElementById("spaceTabs")?.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-space-tab]");
    if (tab) showSpaceTab(tab.dataset.spaceTab);
  });

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
   <html> before first paint, so CSS hides overlay on returning visits.

   Timing (total ~2200ms — within the 1400–2200ms luxury ceiling):
     180ms  → logo image surfaces (500ms transition)
     560ms  → wordmark drifts in  (640ms transition)
     920ms  → tagline fades in    (560ms transition)
     1000ms → progress foot appears + bar advances (560ms transition)
     1550ms → overlay begins 650ms dissolve
     2200ms → overlay fully gone, hero children mid-reveal underneath

   As the overlay dissolves the progressive hero reveal is in flight —
   users feel the interface opening, not cutting.                          */
function initEntryExperience() {
  const el = document.getElementById("lxEntry");
  if (!el) return;

  /* Session already seen — CSS hides overlay, JS removes the node */
  if (document.documentElement.dataset.entrySkip === "1") {
    el.remove();
    return;
  }

  /* Mark session so the next load skips entry entirely */
  try { sessionStorage.setItem("abdan-entry-seen", "1"); } catch { /* quota */ }

  const wordmark = el.querySelector(".lx-entry__wordmark");
  const glint    = el.querySelector(".lx-entry__glint");
  const tagline  = el.querySelector(".lx-entry__tagline");

  /* ── Reduced motion: instant reveal, short hold, dissolve ─────────── */
  if (LX_MOTION.reduced()) {
    wordmark?.classList.add("is-visible");
    tagline?.classList.add("is-visible");
    setTimeout(() => lxEntryDissolve(el), 400);
    return;
  }

  /* ── Step 1 (150ms): Wordmark materialises from darkness ────────────
     scale(0.88 → 1) + opacity(0 → 1) with spring easing.
     The 720ms CSS transition finishes around t=870ms.               */
  setTimeout(() => wordmark?.classList.add("is-visible"), 150);

  /* ── Step 2 (920ms): Gold diagonal glint sweeps across ──────────────
     Fires once the wordmark is fully settled. The 680ms CSS keyframe
     animates a warm gold streak diagonally, left-to-right.           */
  setTimeout(() => glint?.classList.add("is-running"), 920);

  /* ── Step 3 (1380ms): Tagline whispers in below the wordmark ────────
     Ultra-small gold italic — barely-there brand signature.          */
  setTimeout(() => tagline?.classList.add("is-visible"), 1380);

  /* ── Step 4 (2300ms): Cinematic dissolve — site emerges beneath ─────
     700ms CSS opacity transition fades the dark overlay out,
     revealing the homepage in whatever theme the user has set.        */
  setTimeout(() => lxEntryDissolve(el), 2300);
}

/* lxEntryProgress — animates the editorial percentage counter 0→100
   using requestAnimationFrame over the given duration (ms).
   Ease-out cubic: fast start, gentle deceleration — reads as natural. */
function lxEntryProgress(pctEl, duration) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    /* ease-out cubic: 1 - (1-p)^3 */
    const eased = 1 - Math.pow(1 - p, 3);
    pctEl.textContent = Math.round(eased * 100).toString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* lxEntryDissolve — fades the overlay out, removes it from DOM.
   Guaranteed to remove within 800ms even if transitionend never fires. */
function lxEntryDissolve(el) {
  el.classList.add("is-done");
  const cleanup = () => { if (el.parentNode) el.remove(); };
  el.addEventListener("transitionend", cleanup, { once: true });
  setTimeout(cleanup, 800); /* fallback */
}

/* ── Seasonal context ────────────────────────────────────────────────────
   Returns season key from current month; sets [data-season] on <html> so
   CSS applies atmospheric tints. Stores result in _seasonalContext for
   use in renderMoodEditorial.
   Ranges (0-indexed months): spring 2–4, summer 5–7, autumn 8–10,
   winter 11/0/1 (Dec–Feb).                                               */
function getCurrentSeason() {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4)  return "spring";
  if (m >= 5 && m <= 7)  return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

function initSeasonalContext() {
  const season = getCurrentSeason();
  _seasonalContext = SEASONAL_STORIES[season];
  document.documentElement.dataset.season = season;
  return _seasonalContext;
}

/* ── Render editorial campaign ───────────────────────────────────────────
   Selects today's campaign via a date-stable index (same campaign all day,
   rotates at midnight). Renders editorial copy, product chips that open
   the product sheet, and sets the campaign image from the first product
   matching the campaign's mood.                                            */
function renderEditorialCampaign() {
  if (!document.getElementById("editorialCampaign")) return;

  /* Campaign selection: prefer the narrative that matches the user's affinity
     mood. Falls back to date-stable rotation if no clear preference exists.
     This makes the editorial section feel attuned — not algorithmic.         */
  const affinityMood  = getAffinityMood();
  const affinityMatch = affinityMood ? CAMPAIGNS.find(c => c.mood === affinityMood) : null;
  const dayIdx        = Math.floor(Date.now() / 86400000) % CAMPAIGNS.length;
  const campaign      = affinityMatch || CAMPAIGNS[dayIdx];

  const kickerEl = document.getElementById("campaignKicker");
  const headEl   = document.getElementById("campaignHeadline");
  const bodyEl   = document.getElementById("campaignBody");
  const chipsEl  = document.getElementById("campaignChips");
  const imgEl    = document.getElementById("campaignImg");

  if (kickerEl) kickerEl.textContent = campaign.kicker;
  if (headEl)   headEl.textContent   = campaign.headline;
  if (bodyEl)   bodyEl.textContent   = campaign.body;

  /* Up to 3 product chips from the campaign's mood */
  const moodProducts = PRODUCTS.filter((p) => p.primaryTag === campaign.mood).slice(0, 3);
  if (chipsEl) {
    chipsEl.innerHTML = moodProducts.map((p) => `
      <button type="button" class="campaign-chip" data-preview="${p.id}" aria-label="View ${p.name}">
        ${p.name}
      </button>
    `).join("");
    chipsEl.querySelectorAll("[data-preview]").forEach((btn) => {
      btn.addEventListener("click", () => openProduct(btn.dataset.preview || ""));
    });
  }

  /* Campaign image: first product in the mood — sets the editorial atmosphere */
  if (imgEl && moodProducts[0]) {
    imgEl.src = moodProducts[0].image;
    imgEl.alt = campaign.headline;
    const onLoad = () => imgEl.classList.add("img-loaded");
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      requestAnimationFrame(onLoad);
    } else {
      imgEl.addEventListener("load",  onLoad, { once: true });
      imgEl.addEventListener("error", onLoad, { once: true });
    }
  }

  /* Stagger visual reveal: appears half a beat after the copy */
  const visual = document.querySelector(".editorial-campaign__visual");
  if (visual) visual.style.setProperty("--reveal-delay", "140ms");
}

/* ── Render mood editorial header ────────────────────────────────────────
   Updates the emotional context block above the product grid.
   Initial render (element not yet in viewport): set content instantly.
   On filter change (element already visible): fade-out → swap → fade-in.
   Seasonal label only surfaces when "All" is selected — giving atmospheric
   context to the unfiltered state without cluttering category views.       */
function renderMoodEditorial() {
  const moodEl = document.getElementById("moodEditorial");
  if (!moodEl) return;

  const moodData  = MOOD_MAP[state.filter] || MOOD_MAP["All"];
  const isVisible = moodEl.classList.contains("is-visible");

  const setContent = () => {
    const seasonEl = document.getElementById("moodSeason");
    const headEl   = document.getElementById("moodHeadline");
    const bodyEl   = document.getElementById("moodBody");
    if (seasonEl) {
      /* Seasonal label: visible only on "All" — gives temporal, atmospheric context */
      seasonEl.textContent = (state.filter === "All" && _seasonalContext)
        ? _seasonalContext.label
        : "";
    }
    if (headEl) headEl.textContent = moodData.headline;
    if (bodyEl) bodyEl.textContent = moodData.body;
  };

  if (!isVisible) {
    /* Initial render — content is set before the IntersectionObserver reveal fires */
    setContent();
    return;
  }

  /* Filter change — brief 120ms fade for graceful content transition */
  moodEl.classList.add("is-updating");
  setTimeout(() => {
    setContent();
    moodEl.classList.remove("is-updating");
  }, 120);
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

/* ══════════════════════════════════════════════════════════════════════════
   §55 — ADMIN IMAGE MANAGEMENT SYSTEM
   Allows the admin to override key visual images via URL input fields.
   Overrides are stored in localStorage under "abdan-image-overrides" (JSON).
   On every page load, stored URLs are applied to matching image elements.
   Cloudflare Pages compatible — fully client-side, no backend required.
   ══════════════════════════════════════════════════════════════════════════ */

const IMAGE_SLOTS = [
  { key: "heroSlide0", label: "Hero Slide 1",         selector: "#heroSlideshow .hero-slide:nth-child(1) img" },
  { key: "heroSlide1", label: "Hero Slide 2",         selector: "#heroSlideshow .hero-slide:nth-child(2) img" },
  { key: "heroSlide2", label: "Hero Slide 3",         selector: "#heroSlideshow .hero-slide:nth-child(3) img" },
  { key: "heroSlide3", label: "Hero Slide 4",         selector: "#heroSlideshow .hero-slide:nth-child(4) img" },
  { key: "promiseBand", label: "Promise Band Image",  selector: ".promise-band__img" },
  { key: "footerBand",  label: "Footer Cinematic Band", selector: ".footer-cinematic-band__img" },
];

function loadImageOverrides() {
  try {
    const raw = localStorage.getItem("abdan-image-overrides");
    if (!raw) return;
    const overrides = JSON.parse(raw);
    IMAGE_SLOTS.forEach(({ key, selector }) => {
      if (!overrides[key]) return;
      const el = document.querySelector(selector);
      if (el) { el.src = overrides[key]; el.dataset.overridden = "1"; }
    });
  } catch { /* quota or parse error */ }
}

function saveImageOverride(key, url) {
  try {
    const raw = localStorage.getItem("abdan-image-overrides");
    const overrides = raw ? JSON.parse(raw) : {};
    if (url.trim()) {
      overrides[key] = url.trim();
    } else {
      delete overrides[key];
    }
    localStorage.setItem("abdan-image-overrides", JSON.stringify(overrides));
  } catch { /* quota */ }
}

function resetImageOverride(key) {
  saveImageOverride(key, "");
}

function renderAdminImageManager() {
  const container = document.getElementById("adminImageManager");
  if (!container) return;

  let overrides = {};
  try { overrides = JSON.parse(localStorage.getItem("abdan-image-overrides") || "{}"); } catch {}

  container.innerHTML = `
    <div class="aim-grid">
      ${IMAGE_SLOTS.map(({ key, label, selector }) => {
        const currentSrc = (() => {
          const el = document.querySelector(selector);
          return el ? el.getAttribute("src") : "";
        })();
        const override = overrides[key] || "";
        return `
          <article class="feature-card aim-card" data-aim-key="${key}">
            <div class="aim-preview" aria-hidden="true">
              <img class="aim-preview__img" src="${override || currentSrc || ""}"
                   alt="${label}" loading="lazy" onerror="this.style.opacity='0.2'" />
            </div>
            <div class="aim-body">
              <p class="micro-label">${label}</p>
              <div class="aim-input-row">
                <input type="url" class="aim-url-input"
                       placeholder="Paste image URL here…"
                       value="${override}"
                       aria-label="URL for ${label}" />
                <button class="aim-save-btn primary-button" type="button">Apply</button>
                ${override ? `<button class="aim-reset-btn ghost-button" type="button">Reset</button>` : ""}
              </div>
              ${override ? `<p class="aim-status aim-status--active">✦ Override active</p>` : ""}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;

  /* Event delegation — handles save + reset for all cards */
  container.addEventListener("click", (e) => {
    const card = e.target.closest("[data-aim-key]");
    if (!card) return;
    const key = card.dataset.aimKey;
    const input = card.querySelector(".aim-url-input");

    if (e.target.classList.contains("aim-save-btn")) {
      const url = input?.value.trim() || "";
      saveImageOverride(key, url);
      /* Live-apply to the page image */
      const slot = IMAGE_SLOTS.find((s) => s.key === key);
      if (slot && url) {
        const img = document.querySelector(slot.selector);
        if (img) { img.src = url; img.dataset.overridden = "1"; }
      }
      showToast(url ? "Image updated ✦" : "Override cleared");
      renderAdminImageManager();
    }
    if (e.target.classList.contains("aim-reset-btn")) {
      resetImageOverride(key);
      /* Reload the original src from the slot selector */
      showToast("Image reset to default");
      renderAdminImageManager();
    }
  });
}

function initAdminImageManager() {
  loadImageOverrides();   /* apply any saved overrides on page load */
  /* Render the manager UI whenever the admin panel becomes visible */
  const observer = new MutationObserver(() => {
    const panel = document.getElementById("adminPanel");
    if (panel && !panel.hidden) renderAdminImageManager();
  });
  const panel = document.getElementById("adminPanel");
  if (panel) observer.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
  /* Also render immediately if already visible */
  if (panel && !panel.hidden) renderAdminImageManager();
}

function init() {
  // DEPLOYMENT STATUS: VERIFIED ✔
  // Logo: assets/abdan-icon.jpg — real brand icon, circular clip applied
  // Navbar: full section names per brand DNA (no abbreviation)
  // Layout: z-index hierarchy intact · no overlap regressions
  // Responsive: mobile scrollable dock + desktop pill nav validated
  // Dark mode: compatible · Static HTML/CSS/JS · Cloudflare Pages ready
  initEntryExperience();     /* must run first — covers page during render  */
  initTimeOfDay();
  initSeasonalContext();     /* sets [data-season] + populates _seasonalContext */

  /* ── Emotional Intelligence: initialise memory + restore continuity ────
     Memory is read before setTheme/renderFilters so state is already
     personalised when the first render fires. Filter restoration happens
     silently — no announcement, no toast. The mood-editorial and collection
     simply open in the mood that already feels familiar.                    */
  const memory = initMemorySystem();
  if (memory.visitCount > 1 && memory.lastFilter && memory.lastFilter !== "All" && FILTERS.includes(memory.lastFilter)) {
    state.filter = memory.lastFilter; /* silent mood continuity */
  }

  setTheme(state.theme);
  renderFilters();
  renderEditorialCampaign(); /* editorial campaign section — affinity-biased  */
  renderProducts();          /* also calls renderMoodEditorial() internally   */
  renderFooterContent();
  renderCart();
  attachEvents();
  applyRevealStagger();
  revealElements();
  initDockObserver();
  initScrollChrome();
  initScrollAwareDock();  /* §33 — hides dock on downward scroll, mobile only */
  initHeroParallax();
  initHeroSlideshow();          /* §48 — cinematic 4-image crossfade */
  initFooterNewsletter();       /* §49 — soft relationship CTA */
  initHeroLiveClock();          /* §50 — IST live time in meta strip */
  initSwipeGestures();
  renderAdminRoute();
  initSpaceAuth();
  safeCreateIcons();

  /* ── Softly Returning — recently explored pieces (2nd+ visit) ─────── */
  renderSoftlyReturning();

  /* ── Returning user: a single soft whisper on the second visit only ──
     Third visit onward: continuity is the welcome — no announcement.     */
  if (memory.visitCount === 2) {
    setTimeout(() => showToast("Welcome back 💛"), 2800);
  }

  /* ── Share & Earn — capture inbound referral + reconcile rewards ────── */
  try { captureReferralFromUrl(); } catch {}
  try { reconcileReferralRewards(); } catch {}

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
  /* ── §38 Trust Architecture + Sensory System ──────────────────────── */
  initFloatingInputs();
  initNPSSystem();
  initAdminIntelligence();

  /* ── §39 CRED-Inspired Interaction & Motion Philosophy ─────────────────
     Tactile press depth on all interactive surfaces. Must run after the
     DOM is settled (after §38 systems) so dynamic elements are available.
     MutationObserver inside the function handles any later injections.   */
  initTactileSystem();
  initDevotionMoment(); /* §58 — The Devotion Light: once-per-session warmth */

  /* ── §35 Perception Architecture ──────────────────────────────────────
     Time-of-day atmosphere + session pacing activated before page-ready
     so CSS variables are resolved on the first rendered frame.            */
  initTimeAtmosphere();
  initSessionPacing();
  if (memory.visitCount >= 3) {
    document.body.setAttribute("data-returning", "true");
  }

  /* ── Admin image manager ────────────────────────────────────────────── */
  initAdminImageManager();

  /* ── Page entrance: fade body in after full hydration ──────────────── */
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
}

/* ══════════════════════════════════════════════════════════════════════════
   §38 — TRUST ARCHITECTURE + SENSORY LUXURY INTERACTION SYSTEM
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Floating input active-state system ─────────────────────────────────
   Adds .has-value to .space-field when its input contains content.
   CSS uses this class to render the soft label-float state.
   Validation also runs on blur — calm, supportive, never aggressive.    */
function initFloatingInputs() {
  document.querySelectorAll(".space-field input, .space-field textarea").forEach((input) => {
    const field = () => input.closest(".space-field");

    const syncValue = () => field()?.classList.toggle("has-value", input.value.trim().length > 0);
    input.addEventListener("input",  syncValue);
    input.addEventListener("change", syncValue);
    syncValue();

    /* Focus: reveal the field as active */
    input.addEventListener("focus", () => {
      field()?.classList.add("is-active");
      field()?.classList.remove("is-invalid");   /* clear error on re-engage */
    });
    input.addEventListener("blur", () => {
      field()?.classList.remove("is-active");
      if (input.required && !input.value.trim()) {
        field()?.classList.add("is-invalid");
      } else if (input.value.trim() && input.checkValidity()) {
        field()?.classList.add("is-valid");
        field()?.classList.remove("is-invalid");
      }
    });
  });
}

/* ── NPS — Restrained Emotional Feedback System ──────────────────────────
   Luxury brand rules applied strictly:
   ✗ Never on login or logout.  ✗ Never more than once per 14 days.
   ✗ Never during entry sequence.
   ✓ Only after 5 min engagement + 3+ product interactions.
   ✓ Soft prompt, fully optional, auto-dismisses in 10 s.               */
function initNPSSystem() {
  const KEY_LAST = "abdan-nps-last";
  const KEY_DATA = "abdan-nps-data";

  /* 14-day cooldown */
  const last      = parseInt(localStorage.getItem(KEY_LAST) || "0", 10);
  const daysSince = (Date.now() - last) / 86_400_000;
  if (daysSince < 14) return;

  let interactions = 0;
  document.addEventListener("abdan:productOpened", () => interactions++);

  const ENGAGE_MS = 5 * 60 * 1000;   /* 5 minutes */
  const MIN_VIEWS = 3;

  setTimeout(() => {
    if (interactions < MIN_VIEWS) return;
    const panel = document.getElementById("npsPanel");
    if (!panel) return;
    panel.removeAttribute("hidden");
    requestAnimationFrame(() => panel.classList.add("nps-panel--visible"));

    const autoDismissId = setTimeout(() => dismissNPS(null), 10_000);

    function dismissNPS(response) {
      clearTimeout(autoDismissId);
      panel.classList.remove("nps-panel--visible");
      setTimeout(() => panel.setAttribute("hidden", ""), 420);
      localStorage.setItem(KEY_LAST, String(Date.now()));
      if (response) {
        const data = JSON.parse(localStorage.getItem(KEY_DATA) || "[]");
        data.push({
          response,
          timestamp:   new Date().toISOString(),
          sessionTime: Math.floor(performance.now() / 1000),
        });
        try { localStorage.setItem(KEY_DATA, JSON.stringify(data)); } catch { /* quota */ }
        showToast("Thank you. Your experience matters. 💛");
      }
    }

    panel.querySelectorAll("[data-nps]").forEach((btn) =>
      btn.addEventListener("click", () => dismissNPS(btn.dataset.nps), { once: true })
    );
    document.getElementById("npsDismiss")?.addEventListener("click",
      () => dismissNPS(null), { once: true }
    );
  }, ENGAGE_MS);
}

/* ── Admin Experience Intelligence ──────────────────────────────────────
   Populates the admin intelligence panel with feedback and consent data
   drawn from localStorage. Shown only when admin is authenticated.      */
function initAdminIntelligence() {
  const panel = document.getElementById("adminIntelligencePanel");
  if (!panel) return;

  const npsData      = JSON.parse(localStorage.getItem("abdan-nps-data")  || "[]");
  const profiles     = getSpaceProfiles();
  const profileList  = Object.values(profiles);
  const consented    = profileList.filter((p) => p.consent?.agreement).length;
  const marketing    = profileList.filter((p) => p.consent?.marketing).length;

  const counts = { lovely: 0, needed: 0, off: 0 };
  npsData.forEach((d) => { if (d.response in counts) counts[d.response]++; });
  const total  = npsData.length;
  const recent = npsData.slice(-3).reverse();

  const sentimentLabel = (r) =>
    r === "lovely"  ? "Quietly lovely" :
    r === "needed"  ? "Exactly what I needed" :
                      "Something felt off";

  panel.innerHTML = `
    <p class="section-kicker">Experience Intelligence</p>
    <h3>Emotional Signals</h3>
    <div class="admin-intel-grid">
      <div class="admin-intel-card">
        <p class="micro-label">Spaces</p>
        <strong>${profileList.length}</strong>
        <p>${consented} consented · ${marketing} welcome updates</p>
      </div>
      <div class="admin-intel-card">
        <p class="micro-label">Feedback</p>
        <strong>${total}</strong>
        <p>${counts.lovely} lovely · ${counts.needed} needed · ${counts.off} friction</p>
      </div>
      ${recent.map((d) => `
      <div class="admin-intel-card admin-intel-card--response">
        <p class="micro-label">${new Date(d.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
        <strong>${sentimentLabel(d.response)}</strong>
        <p>After ${d.sessionTime}s on platform</p>
      </div>`).join("")}
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════════════════
   §35 — PERCEPTION ARCHITECTURE
   Invisible intelligence layer. Shapes emotional pacing, sensory atmosphere,
   and cognitive rhythm. Nothing here should ever be consciously felt.
   Rules: no visible AI experience, no futuristic signals, no manipulation.
   Only warmth, calm, and the quiet sense that the space knows the hour.
   ══════════════════════════════════════════════════════════════════════════ */

function initTimeAtmosphere() {
  /* Sets html[data-time] once per session based on current hour.
     CSS reads this attribute to shift colour tokens and promise-band warmth:
       morning  05–10 → crisp, clean
       day      11–16 → ABDAN defaults
       evening  17–20 → warm, amber-kissed
       night    21–04 → deepest, most intimate                               */
  try {
    const h = new Date().getHours();
    const period =
      h >=  5 && h < 11 ? "morning"  :
      h >= 11 && h < 17 ? "day"      :
      h >= 17 && h < 21 ? "evening"  :
                          "night";
    document.documentElement.setAttribute("data-time", period);
  } catch { /* non-critical — fail silently */ }
}

function initSessionPacing() {
  /* Session pacing: reveal transitions deepen as the visitor settles in.
       90 s  → "present" (engaged browsing pace)
       4 min → "settled" (relaxed, unhurried, luxurious pace)
     The change in transition timing is ~130–140 ms — below the threshold
     of conscious perception but measurably calmer to the nervous system.   */
  try {
    const body = document.body;
    setTimeout(() => body.setAttribute("data-session", "present"), 90_000);
    setTimeout(() => body.setAttribute("data-session", "settled"), 240_000);
  } catch { /* non-critical — fail silently */ }
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION 39/40 — Editorial Tactile Responsiveness
   Refined from the original CRED-inspired spring mechanics.

   Philosophy (§40 revision): interactions should feel like fabric —
   a barely-perceptible yield (0.992 scale / 140ms ease-out) when pressed,
   a calm return (300ms ease-out, no spring overshoot) on release.
   The user should FEEL quality without consciously noticing mechanics.
   Motion supports emotion. It does not announce itself.
   ══════════════════════════════════════════════════════════════════════════ */

function initTactileSystem() {
  /* Interactive surfaces that receive the subtle press-yield feedback.
     All visible mechanics are handled by CSS §40 (scale 0.992, ease-out).
     This JS only manages the class state machine — attach once, observe
     for dynamically injected elements, clean up after each transition.   */
  const TACTILE_SELECTOR = [
    ".product-card",
    ".orb-button",
    ".primary-button",
    ".secondary-button",
    ".space-form__submit",
    ".nps-panel__choice",
    "[data-tactile]",
  ].join(",");

  function attachTactile(el) {
    /* Guard: never double-attach */
    if (el._abdan_tactile) return;
    el._abdan_tactile = true;

    let pressing = false;

    el.addEventListener("pointerdown", (e) => {
      /* Primary pointer only: left click or first finger */
      if (e.button !== undefined && e.button !== 0) return;
      pressing = true;
      el.classList.remove("is-releasing");
      el.classList.add("is-pressing");
    }, { passive: true });

    function release() {
      if (!pressing) return;
      pressing = false;
      el.classList.remove("is-pressing");
      el.classList.add("is-releasing");
    }

    el.addEventListener("pointerup",     release, { passive: true });
    el.addEventListener("pointercancel", release, { passive: true });
    el.addEventListener("pointerleave",  release, { passive: true });

    /* Remove .is-releasing cleanly after the CSS transition ends */
    el.addEventListener("transitionend", (e) => {
      if (e.propertyName === "transform" && e.target === el) {
        el.classList.remove("is-releasing");
      }
    }, { passive: true });
  }

  /* Attach to all elements present at init time */
  document.querySelectorAll(TACTILE_SELECTOR).forEach(attachTactile);

  /* MutationObserver: extend to dynamically injected elements
     (filtered product cards, async-rendered NPS panel, etc.)            */
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.(TACTILE_SELECTOR)) attachTactile(node);
        node.querySelectorAll?.(TACTILE_SELECTOR).forEach(attachTactile);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ─────────────────────────────────────────────────────────────────────────
   §50  HERO LIVE CLOCK — IST (Asia/Kolkata) time in the meta strip.
   Mirrors the live-clock treatment in the Denta reference design.
   Updates every second; uses Intl.DateTimeFormat for accuracy.
   ─────────────────────────────────────────────────────────────────────────*/
function initHeroLiveClock() {
  const el = document.getElementById("heroLiveTime");
  if (!el) return;

  const fmt = new Intl.DateTimeFormat("en-IN", {
    timeZone:  "Asia/Kolkata",
    hour:      "2-digit",
    minute:    "2-digit",
    second:    "2-digit",
    hour12:    false,
  });

  function tick() {
    el.textContent = fmt.format(new Date()) + " IST";
  }
  tick();
  setInterval(tick, 1000);
}

/* ─────────────────────────────────────────────────────────────────────────
   §49  FOOTER NEWSLETTER — soft relationship CTA
   Saves email to localStorage; shows a warm contextual toast.
   No backend needed — static Cloudflare Pages compatible.
   ─────────────────────────────────────────────────────────────────────────*/
function initFooterNewsletter() {
  const form    = document.getElementById("footerNewsletterForm");
  const input   = document.getElementById("footerEmailInput");
  const msg     = document.getElementById("footerNewsletterMsg");
  if (!form || !input || !msg) return;

  const STORAGE_KEY = "abdan-newsletter-subs";

  /* ── If already subscribed, show a quiet acknowledgement ─────────────── */
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (existing.length > 0) {
    msg.textContent = "You're already part of our quiet circle — thank you.";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = (input.value || "").trim().toLowerCase();

    /* Basic email validation */
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Please share a valid email address.";
      input.focus();
      return;
    }

    /* Save (de-duplicate) */
    const subs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    }

    /* Warm success feedback */
    input.value     = "";
    msg.textContent = "Beautifully received. We'll reach you gently, only when it matters.";

    showToast("Welcome to our quiet circle 💛");
    lxFormRipple(form.querySelector("[type='submit']")); /* §56 — gold ripple from submit btn */

    /* Soft reset after 6 s */
    setTimeout(() => {
      if (msg) msg.textContent = "You're part of our quiet circle — thank you.";
    }, 6000);
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   §48  CINEMATIC HERO SLIDESHOW
   Four slides crossfade every 7 s with a subtle scale-breathe on the
   active image. Dot navigation allows manual jump. Hovering pauses the
   auto-advance. Respects prefers-reduced-motion by cutting the 9 s scale
   animation (CSS handles it) — the JS interval still runs but transitions
   are instant per the @media rule in §48i of style.css.
   ─────────────────────────────────────────────────────────────────────────*/
function initHeroSlideshow() {
  const container = document.getElementById("heroSlideshow");
  if (!container) return;

  const slides      = Array.from(container.querySelectorAll(".hero-slide"));
  const dots        = Array.from(container.querySelectorAll(".slide-dot"));
  const captionEl   = container.querySelector("#heroSlideCaption");
  const labelEl     = container.querySelector("#heroSlideLabel");
  if (!slides.length) return;

  /* ── Per-slide editorial captions ──────────────────────────────────── */
  const CAPTIONS = [
    {
      label:   "An editorial invitation",
      caption: "For the woman whose presence is soft, assured, and deserving of beauty of her own."
    },
    {
      label:   "Devotion & light",
      caption: "Beauty that honours the rituals woven into everyday grace."
    },
    {
      label:   "Composed in silk",
      caption: "A woman who dresses not to be seen, but to feel wholly herself."
    },
    {
      label:   "A quiet luxury",
      caption: "The morning cup. The moment before the day begins. Yours."
    }
  ];

  let current  = 0;
  let paused   = false;
  let interval = null;

  /* ── Activate a given slide index ──────────────────────────────────── */
  function goTo(idx) {
    const prev = current;
    current    = (idx + slides.length) % slides.length;

    /* Update slides */
    slides[prev].classList.remove("hero-slide--active");
    slides[current].classList.add("hero-slide--active");

    /* Update dots */
    dots[prev].classList.remove("slide-dot--active");
    dots[prev].setAttribute("aria-selected", "false");
    dots[current].classList.add("slide-dot--active");
    dots[current].setAttribute("aria-selected", "true");

    /* Update caption */
    const c = CAPTIONS[current] || CAPTIONS[0];
    if (labelEl)   labelEl.textContent   = c.label;
    if (captionEl) captionEl.textContent = c.caption;

    /* Announce to screen readers via aria-live on the container */
    container.setAttribute("aria-label", `Slide ${current + 1} of ${slides.length}: ${c.label}`);
  }

  /* ── Auto-advance ───────────────────────────────────────────────────── */
  function startInterval() {
    interval = setInterval(() => {
      if (!paused) goTo(current + 1);
    }, 7000);
  }

  function stopInterval() {
    clearInterval(interval);
    interval = null;
  }

  /* ── Dot click handlers ─────────────────────────────────────────────── */
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopInterval();
      goTo(i);
      startInterval();          /* restart timer from this point            */
    });
  });

  /* ── Hover pause / resume ────────────────────────────────────────────── */
  container.addEventListener("mouseenter", () => { paused = true;  });
  container.addEventListener("mouseleave", () => { paused = false; });

  /* ── Touch swipe (mobile) ────────────────────────────────────────────── */
  let touchStartX = 0;
  container.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  container.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;     /* ignore taps                        */
    stopInterval();
    goTo(dx < 0 ? current + 1 : current - 1);
    startInterval();
  }, { passive: true });

  /* ── Keyboard (when container or dot has focus) ──────────────────────── */
  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { stopInterval(); goTo(current + 1); startInterval(); }
    if (e.key === "ArrowLeft")  { stopInterval(); goTo(current - 1); startInterval(); }
  });

  /* ── Visibility API — pause when tab is hidden ───────────────────────── */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopInterval();
    else if (!interval)  startInterval();
  });

  /* ── Boot ────────────────────────────────────────────────────────────── */
  goTo(0);          /* ensure first slide + caption are wired correctly     */
  startInterval();
}

/* ═══════════════════════════════════════════════════════════════════════════
   §56 — EMOTIONAL MICRO-INTERACTIONS
   lxHeartBurst · lxCartGlow · lxOrderStory · lxFormRipple
   Zero duplication: these are new effects distinct from existing systems.
   ─────────────────────────────────────────────────────────────────────── */

/* ── Floating heart particles ─────────────────────────────────────────────
   Spawns 4 translucent gold hearts that drift upward from the wishlist
   button and fade out. Distinct from existing WAAPI bloom (scale on SVG
   icon) — that animation still runs; this one adds floating particles.    */
function lxHeartBurst(triggerEl) {
  if (LX_MOTION.reduced() || !triggerEl) return;
  const rect   = triggerEl.getBoundingClientRect();
  const cx     = rect.left + rect.width  / 2;
  const cy     = rect.top  + rect.height / 2;
  const glyphs = ["💛", "💛", "✦", "💛"];

  for (let i = 0; i < glyphs.length; i++) {
    const particle = document.createElement("span");
    particle.className = "lx-heart-particle";
    particle.setAttribute("aria-hidden", "true");
    particle.textContent = glyphs[i];

    /* Scatter ±22px horizontally around the button centre */
    const spread = (Math.random() - 0.5) * 44;
    particle.style.left             = `${cx + spread - 10}px`;
    particle.style.top              = `${cy - 6}px`;
    particle.style.animationDelay    = `${i * 85}ms`;
    particle.style.animationDuration = `${720 + Math.random() * 220}ms`;
    particle.style.fontSize          = `${10 + Math.random() * 5}px`;

    document.body.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

/* ── Cart glow ring ───────────────────────────────────────────────────────
   A warm gold ring radiates outward from the cart button on item add.
   Distinct from lxPulseCart() which CSS-animates scale on the icon itself.*/
function lxCartGlow() {
  if (LX_MOTION.reduced() || !dom.cartToggle) return;
  const rect = dom.cartToggle.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  const ring = document.createElement("span");
  ring.className = "lx-cart-glow-ring";
  ring.setAttribute("aria-hidden", "true");
  ring.style.width  = `${size}px`;
  ring.style.height = `${size}px`;
  ring.style.left   = `${rect.left + rect.width  / 2 - size / 2}px`;
  ring.style.top    = `${rect.top  + rect.height / 2 - size / 2}px`;

  document.body.appendChild(ring);
  ring.addEventListener("animationend", () => ring.remove(), { once: true });
}

/* ── Order storytelling stagger ───────────────────────────────────────────
   Adds .lx-story on .cart-success so §56d CSS sequential delays create a
   cinematic narrative: checkmark → title → body → note → timeline.
   The SVG circle+tick draw animations already exist and are preserved.    */
function lxOrderStory() {
  requestAnimationFrame(() => {
    const el = document.querySelector(".cart-success");
    if (el) el.classList.add("lx-story");
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   §58 — SIGNATURE ABDAN MOMENT: The Devotion Light
   Once per session, when "Her Story" enters the viewport at 35% threshold,
   a warm amber radial glow breathes into the section and fades (2 400ms).
   It is subconscious — more felt than seen. A lamp lit only for her.
   ─────────────────────────────────────────────────────────────────────── */
function initDevotionMoment() {
  const section = document.getElementById("wsy");
  if (!section || LX_MOTION.reduced()) return;

  /* Fire only once per session */
  try { if (sessionStorage.getItem("abdan-devotion")) return; } catch {}

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();

      try { sessionStorage.setItem("abdan-devotion", "1"); } catch {}

      /* 700ms settle — let the section's reveal animations complete first */
      setTimeout(() => {
        const glow = document.createElement("div");
        glow.className  = "lx-devotion-glow";
        glow.setAttribute("aria-hidden", "true");
        section.appendChild(glow);
        glow.addEventListener("animationend", () => glow.remove(), { once: true });
      }, 700);
    },
    { threshold: 0.35 }
  );

  observer.observe(section);
}

/* ── Form success ripple ──────────────────────────────────────────────────
   A warm gold radial burst expands from the submit button's centre on
   success. The button needs position:relative + overflow:hidden — §56e CSS
   ensures this for .footer-relation__btn and space form submit buttons.   */
function lxFormRipple(btn) {
  if (LX_MOTION.reduced() || !btn) return;
  const size = Math.max(btn.offsetWidth, btn.offsetHeight) * 0.88;

  const ripple = document.createElement("span");
  ripple.className = "lx-form-ripple";
  ripple.setAttribute("aria-hidden", "true");
  ripple.style.width  = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left   = `${btn.offsetWidth  / 2 - size / 2}px`;
  ripple.style.top    = `${btn.offsetHeight / 2 - size / 2}px`;

  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

window.addEventListener("DOMContentLoaded", init);

/* ═══════════════════════════════════════════════════════════════════════════
   §61-63 — ADAPTIVE EXPERIENCE SYSTEMS
   Fullscreen image viewer · Mobile product scroll patch
   ─────────────────────────────────────────────────────────────────────── */

/* ── §63 — Fullscreen Image Viewer ──────────────────────────────────────────
   Tap the product image to enter a cinematic fullscreen view.
   Swipe down (touch) or press Escape (keyboard) to exit.
   Pinch-to-zoom uses native touch-action: pinch-zoom on the image itself.   */
function initProductImageViewer() {
  /* Build the viewer element once and append to body */
  const viewer = document.createElement("div");
  viewer.className = "lx-imgview";
  viewer.setAttribute("aria-hidden", "true");
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-label", "Full image — swipe down or tap to close");
  viewer.innerHTML = [
    '<button type="button" class="lx-imgview__close-btn" aria-label="Close image">',
    '  <i data-lucide="x"></i>',
    '</button>',
    '<img class="lx-imgview__img" src="" alt="" draggable="false" loading="eager" />',
    '<p class="lx-imgview__dismiss-hint" aria-hidden="true">Tap image · Swipe down · Esc</p>',
  ].join("");
  document.body.appendChild(viewer);

  const viewerImg = viewer.querySelector(".lx-imgview__img");
  const closeBtn  = viewer.querySelector(".lx-imgview__close-btn");

  /* ── Open/close helpers ──────────────────────────────────────────────── */
  function openViewer(src, alt) {
    viewerImg.src = src;
    viewerImg.alt = alt || "Product image";
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    closeBtn.focus(); /* move focus into viewer for keyboard users */
    safeCreateIcons();
  }

  function closeViewer() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    /* Return focus to the expand button if it exists */
    const expandBtn = document.querySelector(".lx-imgview__expand-btn");
    if (expandBtn) requestAnimationFrame(() => expandBtn.focus());
  }

  /* ── Trigger: click on the product sheet media area ─────────────────── */
  document.addEventListener("click", (e) => {
    /* Allow click on media area (but not the expand btn — that handles itself) */
    const media = e.target.closest(".product-sheet__media");
    if (!media || e.target.closest(".lx-imgview__expand-btn")) return;
    const img = document.getElementById("productImage");
    if (img && img.classList.contains("img-loaded")) {
      openViewer(img.src, img.alt);
    }
  });

  /* ── Dismiss: backdrop click, image click, close button ─────────────── */
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer || e.target === viewerImg) closeViewer();
  });
  closeBtn.addEventListener("click", closeViewer);

  /* ── Dismiss: Escape key ─────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && viewer.classList.contains("is-open")) {
      e.preventDefault();
      closeViewer();
    }
  });

  /* ── Dismiss: swipe down gesture (touch) ────────────────────────────── */
  let lxTouchStartY = 0;
  viewer.addEventListener("touchstart", (e) => {
    lxTouchStartY = e.touches[0].clientY;
  }, { passive: true });
  viewer.addEventListener("touchend", (e) => {
    const dy = e.changedTouches[0].clientY - lxTouchStartY;
    if (dy > 80 && viewer.classList.contains("is-open")) closeViewer();
  }, { passive: true });

  /* ── Add expand button to product sheet media area ───────────────────── */
  const mediaEl = document.querySelector(".product-sheet__media");
  if (mediaEl) {
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.className = "lx-imgview__expand-btn";
    expandBtn.setAttribute("aria-label", "View full image");
    expandBtn.setAttribute("tabindex", "0"); /* keyboard reachable — only visible interactive control on the image */
    expandBtn.innerHTML = '<i data-lucide="maximize-2"></i>';
    expandBtn.addEventListener("click", (e) => {
      e.stopPropagation(); /* prevent media click handler from double-firing */
      const img = document.getElementById("productImage");
      if (img && img.classList.contains("img-loaded")) {
        openViewer(img.src, img.alt);
      }
    });
    mediaEl.appendChild(expandBtn);
    safeCreateIcons();
  }
}

/* ── §62 — Mobile product scroll reset patch ─────────────────────────────────
   When the §62 CSS changes .product-sheet__panel to a flex scroll container
   (on mobile), the existing JS resets .product-sheet__content scroll — which
   no longer has overflow-y: auto. This observer resets the PANEL scroll
   on every product open, ensuring the new native-scroll experience starts
   at the top (image visible) every time.                                     */
function initMobileProductScroll() {
  const sheet = dom.productSheet;
  if (!sheet) return;

  const observer = new MutationObserver(() => {
    if (sheet.classList.contains("is-open")) {
      const panel = sheet.querySelector(".product-sheet__panel");
      /* rAF: wait one paint cycle so the panel is fully visible first */
      if (panel) requestAnimationFrame(() => {
        panel.scrollTop = 0;
      });
    }
  });

  observer.observe(sheet, { attributes: true, attributeFilter: ["class"] });
}

/* ── Boot adaptive systems after init() has set up dom.* references ─────── */
window.addEventListener("DOMContentLoaded", () => {
  initProductImageViewer();
  initMobileProductScroll();
  initPWA();
  initEditorialCards(); /* §75 — editorial card images + app CTA */
});

/* ═══════════════════════════════════════════════════════════════════════════
   §73 — PWA NATIVE APP ARCHITECTURE
   Service worker registration, install sheet, View Transitions.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Capture Android install prompt before DOMContentLoaded ─────────────
   Must be assigned at script parse time — beforeinstallprompt fires early. */
let _pwaInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  _pwaInstallPrompt = e;
});

function initPWA() {
  /* ── 1. Service worker registration ─────────────────────────────────── */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .catch(() => { /* silent — SW is enhancement, not requirement */ });
  }

  /* ── 2. Install sheet ───────────────────────────────────────────────── */
  const sheet      = document.getElementById("pwaSheet");
  const backdrop   = document.getElementById("pwaBackdrop");
  const closeBtn   = document.getElementById("pwaClose");
  const iosGuide   = document.getElementById("pwaIosGuide");
  const installBtn = document.getElementById("pwaInstallBtn");
  if (!sheet) return;

  /* Skip if already running as installed PWA */
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
  if (isStandalone) return;

  /* Skip if user previously dismissed */
  if (localStorage.getItem("abdan-pwa-dismissed")) return;

  /* Detect platform */
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid  = /Android/.test(navigator.userAgent);
  const isMobile   = isIOS || isAndroid;
  if (!isMobile) return; /* install sheet is mobile-only */

  /* Show iOS guide or Android button */
  if (isIOS && iosGuide) {
    iosGuide.hidden = false;
  } else if (_pwaInstallPrompt && installBtn) {
    installBtn.hidden = false;
  } else {
    return; /* nothing to show */
  }

  /* Reveal after user scrolls ≈ 40% — they're engaged */
  let sheetShown = false;
  const maybeShow = () => {
    if (sheetShown) return;
    const ratio = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    if (ratio < 0.4) return;
    sheetShown = true;
    window.removeEventListener("scroll", maybeShow);
    sheet.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => sheet.classList.add("is-visible"));
    });
  };
  window.addEventListener("scroll", maybeShow, { passive: true });

  /* Dismiss helpers */
  const dismissSheet = () => {
    sheet.classList.remove("is-visible");
    sheet.addEventListener("transitionend", () => { sheet.hidden = true; }, { once: true });
    localStorage.setItem("abdan-pwa-dismissed", "1");
  };

  closeBtn?.addEventListener("click", dismissSheet);
  backdrop?.addEventListener("click", dismissSheet);

  /* Android: trigger native install prompt */
  installBtn?.addEventListener("click", async () => {
    if (!_pwaInstallPrompt) return;
    _pwaInstallPrompt.prompt();
    const { outcome } = await _pwaInstallPrompt.userChoice;
    _pwaInstallPrompt = null;
    dismissSheet();
    if (outcome === "accepted") {
      localStorage.setItem("abdan-pwa-dismissed", "1");
    }
  });
}

/* ── §73 View Transitions: smooth product-sheet open ────────────────────
   Patches the products grid click handler with startViewTransition so
   opening a product detail sheet feels native rather than a hard DOM cut.
   Wraps openProduct() only — closeProduct() already has its own animation. */
(function patchProductTransitions() {
  if (!document.startViewTransition) return; /* progressive enhancement */

  /* Re-wire the grid click to use View Transitions */
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  /* Add a capturing listener that intercepts data-preview clicks first */
  grid.addEventListener("click", (event) => {
    const saveBtn = event.target.closest("[data-wishlist]");
    if (saveBtn) return; /* wishlist handled by original listener */

    const previewButton = event.target.closest("[data-preview]");
    const card          = event.target.closest("[data-product-card]");
    const productId     = previewButton?.dataset.preview || card?.dataset.productCard;
    if (!productId) return;

    /* Prevent the original (non-VT) handler from firing */
    event.stopImmediatePropagation();

    /* Soft cross-dissolve — background dims, sheet rises naturally */
    document.startViewTransition(() => openProduct(productId));
  }, true /* capture — fires before bubble-phase listeners */);
})();

/* ── §75 Editorial Card System — image load + app CTA wiring ────────────
   1. Applies img-loaded to .ec-card__visual img elements (opacity reveal)
   2. Wires the "Add to Home Screen" CTA inside the App teaser card
      to the same PWA install prompt captured in §73.
   Called once after DOMContentLoaded — static HTML, no re-render needed. */
function initEditorialCards() {
  /* ── Image load reveal (opacity-based, same as product cards) ─────── */
  document.querySelectorAll(".ec-card__visual img").forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("img-loaded");
    } else {
      img.addEventListener("load",  () => img.classList.add("img-loaded"), { once: true });
      img.addEventListener("error", () => img.classList.add("img-loaded"), { once: true }); /* graceful */
    }
  });

  /* ── App CTA: wire to PWA install prompt (§73) ─────────────────────── */
  const appCta = document.getElementById("ecAppInstallCta");
  if (!appCta) return;

  /* Update label based on whether prompt is available vs iOS */
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || navigator.standalone === true;

  if (isStandalone) {
    /* Already installed — show a quiet confirmation */
    appCta.textContent   = "Installed ✦";
    appCta.style.opacity = "0.55";
    appCta.style.cursor  = "default";
    return;
  }

  if (isIOS) {
    appCta.textContent = "Open in Safari to Install";
    appCta.addEventListener("click", () => {
      /* Scroll to and open the PWA install sheet for iOS guidance */
      const sheet = document.getElementById("pwaSheet");
      if (sheet) {
        sheet.hidden = false;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => sheet.classList.add("is-visible"))
        );
      }
    });
    return;
  }

  /* Android/Chrome: trigger native install prompt */
  appCta.addEventListener("click", async () => {
    if (_pwaInstallPrompt) {
      _pwaInstallPrompt.prompt();
      const { outcome } = await _pwaInstallPrompt.userChoice;
      _pwaInstallPrompt = null;
      if (outcome === "accepted") {
        appCta.textContent   = "Installed ✦";
        appCta.style.opacity = "0.55";
        appCta.style.cursor  = "default";
        localStorage.setItem("abdan-pwa-dismissed", "1");
      }
    } else {
      /* No prompt available — open PWA sheet for guidance */
      const sheet = document.getElementById("pwaSheet");
      if (sheet) {
        sheet.hidden = false;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => sheet.classList.add("is-visible"))
        );
      }
    }
  });
}

/* ── §75 Fabric-breathe stagger: prevent synchronised GPU spike ──────────
   When all product cards share animation-delay: 0s, their scale keyframes
   peak and valley in unison every 4.5 s — creating a periodic compositor
   spike visible as a brief scroll stutter.
   Assign each card a unique --fabric-delay so their cycles are spread
   across the 9-second period. Called after renderProducts() paints cards. */
function staggerFabricBreathe() {
  /* Only applies on hover-capable (desktop) devices — mobile has anim: none */
  if (window.matchMedia("(hover: none)").matches) return;

  const cards = document.querySelectorAll(".product-card");
  const period = 9; /* seconds — must match @keyframes fabric-breathe */

  cards.forEach((card, i) => {
    /* Distribute evenly: 0s, 9/n, 18/n … up to (n-1)*9/n */
    const delay = ((i * period) / Math.max(cards.length, 1)).toFixed(2);
    card.style.setProperty("--fabric-delay", `${delay}s`);
  });
}

/* Hook into renderProducts so stagger runs every time the grid re-paints */
(function patchRenderProductsForStagger() {
  const _orig = window.renderProducts;
  if (typeof _orig !== "function") {
    /* renderProducts not yet on window — wait for DOMContentLoaded */
    document.addEventListener("DOMContentLoaded", () => {
      const orig = window.renderProducts;
      if (typeof orig === "function") {
        window.renderProducts = function (...args) {
          const result = orig.apply(this, args);
          requestAnimationFrame(staggerFabricBreathe);
          return result;
        };
      }
      /* Also stagger on first paint */
      requestAnimationFrame(staggerFabricBreathe);
    }, { once: true });
    return;
  }
  window.renderProducts = function (...args) {
    const result = _orig.apply(this, args);
    requestAnimationFrame(staggerFabricBreathe);
    return result;
  };
})();

/* §90 probe */

/* S85 — Your Space Auth Portal: unified multi-view container
   Flow: Welcome → Sign-in or Create → Dashboard (no page navigation) */

let _portalCurrentView = "welcome";

function showPortalView(viewName) {
  const views = ["welcome", "signin", "create"];
  const ids   = { welcome: "spPortalWelcome", signin: "spPortalSigninView", create: "spPortalCreateView" };
  const backLabel = document.getElementById("spPortalBackLabel");
  views.forEach(v => {
    const el = document.getElementById(ids[v]);
    if (!el) return;
    el.hidden = (v !== viewName);
  });
  _portalCurrentView = viewName;
  if (backLabel) backLabel.textContent = viewName === "welcome" ? "ABDAN" : "Back";
  /* Clear form errors when switching */
  document.getElementById("spPortalSigninErr") && (document.getElementById("spPortalSigninErr").hidden = true);
  document.getElementById("spPortalCreateErr") && (document.getElementById("spPortalCreateErr").hidden = true);
}

function showSpacePortal() {
  const portal = document.getElementById("spaceAuthPortal");
  if (!portal) return;

  const profiles    = getSpaceProfiles();
  const hasProfiles = Object.keys(profiles).length > 0;
  const h1          = document.getElementById("spPortalH1");
  const sub         = document.getElementById("spPortalSub");
  const continueBtn = document.getElementById("spPortalContinue");
  const createBtn   = document.getElementById("spPortalCreate");
  const memberBlock = document.getElementById("spPortalMember");
  const memberAv    = document.getElementById("spPortalAvatar");
  const memberNm    = document.getElementById("spPortalMemberName");

  let lastMember = null;
  try { lastMember = JSON.parse(localStorage.getItem("abdan-sp-last") || "null"); } catch {}
  const isKnownReturn = hasProfiles && lastMember && profiles[(lastMember.email || "").toLowerCase()];

  if (isKnownReturn) {
    if (h1)          h1.textContent          = "Welcome Back";
    if (sub)         sub.textContent         = "Continue Your Story";
    if (continueBtn) continueBtn.textContent = "Continue to Your Space";
    if (createBtn)   createBtn.textContent   = "Switch Account";
    if (memberBlock) { memberBlock.hidden = false; memberBlock.removeAttribute("aria-hidden"); }
    if (memberNm)    memberNm.textContent = lastMember.name || "";
    if (memberAv) {
      const photo = lastMember.email ? spGet(lastMember.email, SP_PHOTO_KEY) : null;
      memberAv.innerHTML = photo
        ? `<img src="${photo}" alt="" />`
        : `<span>${(lastMember.name || "?").charAt(0).toUpperCase()}</span>`;
    }
  } else if (hasProfiles) {
    if (h1)          h1.textContent          = "Welcome Back";
    if (sub)         sub.textContent         = "Your stories, inspirations, purchases and cherished moments await.";
    if (continueBtn) continueBtn.textContent = "Continue to Your Space";
    if (createBtn)   createBtn.textContent   = "Switch Account";
    if (memberBlock) { memberBlock.hidden = true; memberBlock.setAttribute("aria-hidden", "true"); }
  } else {
    if (h1)          h1.textContent          = "Welcome to Your Space";
    if (sub)         sub.textContent         = "A private place for the pieces, memories and inspirations that stay with you.";
    if (continueBtn) continueBtn.textContent = "Create Your Space";
    if (createBtn)   createBtn.textContent   = "Sign In";
    if (memberBlock) { memberBlock.hidden = true; memberBlock.setAttribute("aria-hidden", "true"); }
  }

  showPortalView("welcome");
  portal.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => portal.classList.add("is-open")));
  document.body.classList.add("is-locked");
  if (window.history && window.location.hash !== "#your-space") {
    history.pushState({ spPortal: true }, "", "#your-space");
  }
}

function hideSpacePortal(then) {
  const portal = document.getElementById("spaceAuthPortal");
  if (!portal) { then?.(); return; }
  portal.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  if (history.state?.spPortal) history.back();
  setTimeout(() => { portal.hidden = true; then?.(); }, 440);
}

/* Welcome CTAs — now route to in-portal views, no page navigation */
document.getElementById("spPortalContinue")?.addEventListener("click", () => {
  const hasProfiles = Object.keys(getSpaceProfiles()).length > 0;
  if (hasProfiles) {
    showPortalView("signin");
  } else {
    showPortalView("create");
  }
});
document.getElementById("spPortalCreate")?.addEventListener("click", () => {
  const hasProfiles = Object.keys(getSpaceProfiles()).length > 0;
  if (hasProfiles) {
    showPortalView("signin"); /* Switch Account → sign in with different email */
  } else {
    showPortalView("signin"); /* Sign In */
  }
});

/* View switch links inside forms */
document.getElementById("spPortalToCreate")?.addEventListener("click", () => showPortalView("create"));
document.getElementById("spPortalToSignin")?.addEventListener("click", () => showPortalView("signin"));

/* Context-aware back button */
document.getElementById("spPortalBack")?.addEventListener("click", () => {
  if (_portalCurrentView === "welcome") {
    hideSpacePortal();
  } else {
    showPortalView("welcome");
  }
});

/* Portal sign-in form handler */
document.getElementById("spPortalSigninForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form      = e.currentTarget;
  const email     = form.email.value.trim();
  const password  = form.password.value;
  const errEl     = document.getElementById("spPortalSigninErr");
  const submitBtn = form.querySelector("[type='submit']");
  if (errEl) errEl.hidden = true;
  setButtonLoading(submitBtn, "Entering your space…");
  try {
    const result = await authenticateSpace(email, password);
    if (!result) {
      if (errEl) { errEl.textContent = "These details don’t match. Please try again."; errEl.hidden = false; }
      resetButtonLoading(submitBtn);
      return;
    }
    if (result.type === "admin") {
      setAdminSession(true);
      resetButtonLoading(submitBtn);
      window.location.href = "/studio.html";
      return;
    }
    setSpaceSession(result.profile);
    resetButtonLoading(submitBtn);
    /* RC-02: set auth-transition flag before history.back() fires in hideSpacePortal */
    window._abdanAuthTransition = true;
    setTimeout(() => { window._abdanAuthTransition = false; }, 700);
    /* RC-02: show dashboard in callback AFTER portal animation/history.back completes */
    hideSpacePortal(() => showSpaceDashboard(result.profile, false));
  } catch {
    if (errEl) { errEl.textContent = "Something went wrong. Please try once more."; errEl.hidden = false; }
    resetButtonLoading(submitBtn);
  }
});

/* Portal create-account form handler */
document.getElementById("spPortalCreateForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form    = e.currentTarget;
  const errEl   = document.getElementById("spPortalCreateErr");
  const data    = {
    fullName:         form.fullName.value,
    displayName:      form.displayName.value,
    email:            form.email.value,
    phone:            form.phone?.value || "",
    password:         form.password.value,
    confirmPassword:  form.confirmPassword.value,
    marketingConsent: false,
  };
  if (errEl) errEl.hidden = true;
  if (data.password.length < 6) {
    if (errEl) { errEl.textContent = "Your password needs at least 6 characters."; errEl.hidden = false; }
    return;
  }
  if (data.password !== data.confirmPassword) {
    if (errEl) { errEl.textContent = "Your passwords don’t match. Please try again."; errEl.hidden = false; }
    return;
  }
  if (!form.agreement?.checked) {
    if (errEl) { errEl.textContent = "Please agree to continue."; errEl.hidden = false; }
    return;
  }
  const submitBtn = form.querySelector("[type='submit']");
  setButtonLoading(submitBtn, "Creating your space…");
  try {
    const profile = await createSpaceProfile(data);
    setSpaceSession(profile);
    resetButtonLoading(submitBtn);
    /* RC-02: protect against popstate route reset during auth transition */
    window._abdanAuthTransition = true;
    setTimeout(() => { window._abdanAuthTransition = false; }, 700);
    hideSpacePortal(() => showSpaceDashboard(profile, true));
  } catch (err) {
    if (errEl) { errEl.textContent = err instanceof Error ? err.message : "Something went wrong."; errEl.hidden = false; }
    resetButtonLoading(submitBtn);
  }
});

/* Password eye toggles inside portal */
document.getElementById("spaceAuthPortal")?.addEventListener("click", (e) => {
  const eye = e.target.closest("[data-eye]");
  if (!eye) return;
  const input = eye.closest(".sp-portal__pw-wrap")?.querySelector("input");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
});

/* Intercept dock nav — Your Space click */
document.getElementById("bottomDock")?.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-target="account"]');
  if (!btn) return;
  const sess = getSpaceSession();
  if (!sess) {
    e.stopPropagation();
    showSpacePortal();
  } else {
    e.stopPropagation();
    if (typeof enterYourSpaceRoute === "function") enterYourSpaceRoute();
  }
}, { capture: true });

/* Browser back closes portal or goes back to welcome */
window.addEventListener("popstate", () => {
  const portal = document.getElementById("spaceAuthPortal");
  if (portal && portal.classList.contains("is-open")) {
    if (_portalCurrentView !== "welcome") {
      showPortalView("welcome");
      /* Re-push history state so back still works to exit */
      history.pushState({ spPortal: true }, "", "#your-space");
    } else {
      portal.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      setTimeout(() => { portal.hidden = true; }, 440);
    }
  }
});

/* S81 — Premium Share Card + OG (Task 3) */

function updateProductOG(product) {
  const shareUrl = buildShareUrl(product);
  const title    = `${product.name} — ABDAN`;
  const desc     = product.curationLine || product.description || "Thoughtfully curated modest fashion.";
  const imgUrl   = product.image?.startsWith("http") ? product.image : "";
  [
    ["og:title",           title,   "property"],
    ["og:description",     desc,    "property"],
    ["og:url",             shareUrl,"property"],
    ["twitter:title",      title,   "name"],
    ["twitter:description",desc,    "name"],
  ].forEach(([key, val, attr]) => {
    const el = document.querySelector(`meta[${attr}="${key}"]`);
    if (el) el.content = val;
  });
  if (imgUrl) {
    const ogImg = document.querySelector('meta[property="og:image"]');
    const twImg = document.querySelector('meta[name="twitter:image"]');
    if (ogImg) ogImg.content = imgUrl;
    if (twImg) twImg.content = imgUrl;
  }
}

function renderShareCard(product) {
  const card = document.getElementById("sharePreviewCard");
  if (!card) return;
  const imgSrc = product.image || "";
  card.innerHTML = `
    <img class="share-preview__img" src="${imgSrc}" alt="${product.name}" loading="lazy" />
    <div class="share-preview__body">
      <p class="share-preview__brand">Personally Curated by ABDAN</p>
      <p class="share-preview__name">${product.name}</p>
      <p class="share-preview__price">${product.priceLabel || ""}</p>
      <p class="share-preview__descriptor">${product.curationLine || "Your devotion deserves to be seen."}</p>
    </div>`;
  card.hidden = false;
  card.removeAttribute("aria-hidden");
}

/* S82 — Your Space dedicated route (Issue 3) */

function enterYourSpaceRoute() {
  dom.html.setAttribute("data-route", "your-space");
  const topbar = document.getElementById("ysTopbar");
  if (topbar) { topbar.hidden = false; topbar.removeAttribute("aria-hidden"); }
  window.scrollTo({ top: 0, behavior: "instant" });
  if (window.history && window.location.hash !== "#your-space") {
    history.pushState({ ysRoute: true }, "", "#your-space");
  }
}

function exitYourSpaceRoute() {
  dom.html.setAttribute("data-route", "storefront");
  const topbar = document.getElementById("ysTopbar");
  if (topbar) { topbar.hidden = true; topbar.setAttribute("aria-hidden", "true"); }
  if (history.state?.ysRoute) history.back();
}

/* ys back button */
document.getElementById("ysBackBtn")?.addEventListener("click", () => {
  exitYourSpaceRoute();
  setTimeout(() => scrollToSection("products"), 80);
});

/* browser back closes Your Space route */
window.addEventListener("popstate", (e) => {
  /* RC-02: skip route reset during auth-to-dashboard transition */
  if (window._abdanAuthTransition) return;
  if (dom.html.dataset.route === "your-space" && !e.state?.ysRoute) {
    dom.html.setAttribute("data-route", "storefront");
    const topbar = document.getElementById("ysTopbar");
    if (topbar) { topbar.hidden = true; topbar.setAttribute("aria-hidden", "true"); }
  }
});

/* S82 — lx-entry emblem animation (Issue 2): wire emblem to show with wordmark */
(function wireEntryEmblem() {
  const emblem = document.querySelector(".lx-entry__emblem");
  if (!emblem) return;
  const wordmark = document.querySelector(".lx-entry__wordmark");
  if (wordmark) {
    const observer = new MutationObserver(() => {
      if (wordmark.classList.contains("is-visible")) {
        emblem.classList.add("is-visible");
      } else {
        emblem.classList.remove("is-visible");
      }
    });
    observer.observe(wordmark, { attributes: true, attributeFilter: ["class"] });
  }
})();

/* S82 — trigger emblem before wordmark for proper splash sequence */
document.addEventListener("DOMContentLoaded", () => {
  if (document.documentElement.dataset.entrySkip) return;
  const emblem = document.querySelector(".lx-entry__emblem");
  if (emblem) setTimeout(() => emblem.classList.add("is-visible"), 60);
}, { once: true });

/* S84 localStorage keys */
const SP_MOMENTS_KEY       = "abdan-sp-moments";
const SP_REQUESTS_KEY      = "abdan-sp-requests";
const SP_GLOBAL_REQS_KEY   = "abdan-global-requests"; /* shared with admin */
const SP_REQUEST_STATUSES  = ["Submitted","Reviewing","Sourcing","Options Found","Completed"];
const SP_REQUEST_OCCASIONS = ["Festive","Wedding","Everyday","Gift","Travel","Just Because","Other"];
const SP_REQUEST_BUDGETS   = ["Under 3k","3k to 8k","8k to 20k","20k to 50k","Above 50k"];

function renderSpaceSavedMoments(email) {
  const panel = document.getElementById("spaceSavedMomentsPanel");
  if (!panel) return;
  const moments = spGet(email, SP_MOMENTS_KEY) || [];
  const cats = ["Wedding Saree","Festival Look","Gift Memory","Favourite Outfit","Special Occasion"];
  const catOpts = cats.map(c=>`<option value="${c}">${c}</option>`).join("");
  const listHtml = moments.length === 0
    ? `<p class="sp-empty-note">Your moments will be kept here, quietly and beautifully.</p>`
    : moments.map((m,i)=>`<div class="sp-moment-item"><div class="sp-moment-item__head"><span class="sp-moment-item__cat">${m.cat}</span><span class="sp-moment-item__date">${new Date(m.ts).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span><button type="button" class="sp-moment-item__del" data-midx="${i}" aria-label="Remove">&#x2715;</button></div><p class="sp-moment-item__title">${m.title}</p>${m.note?`<p class="sp-moment-item__note">${m.note}</p>`:""}</div>`).join("");
  panel.innerHTML = `<div class="sp-section-wrap"><p class="sp-section-kicker">Saved Moments</p><p class="sp-section-sub">Your emotional memory archive — pieces, occasions and feelings worth keeping.</p><div class="sp-moments-form"><select class="sp-moments-cat" id="spMomentCat">${catOpts}</select><input type="text" class="sp-moments-title" id="spMomentTitle" placeholder="A name for this moment" maxlength="80" /><textarea class="sp-moments-note" id="spMomentNote" placeholder="What made this moment special" rows="2" maxlength="300"></textarea><button type="button" class="primary-button sp-moments-add" id="spMomentAdd">Save Moment</button></div><div class="sp-moments-list" id="spMomentsList">${listHtml}</div></div>`;
  panel.querySelector("#spMomentAdd")?.addEventListener("click", () => {
    const title = panel.querySelector("#spMomentTitle")?.value.trim();
    if (!title) return;
    const updated = [{title, cat: panel.querySelector("#spMomentCat")?.value||"", note: panel.querySelector("#spMomentNote")?.value.trim()||"", ts:Date.now()}, ...(spGet(email,SP_MOMENTS_KEY)||[])];
    spSet(email, SP_MOMENTS_KEY, updated);
    renderSpaceSavedMoments(email);
  });
  panel.querySelector("#spMomentsList")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-midx]");
    if (!btn) return;
    spSet(email, SP_MOMENTS_KEY, (spGet(email,SP_MOMENTS_KEY)||[]).filter((_,i)=>i!==+btn.dataset.midx));
    renderSpaceSavedMoments(email);
  });
}

function renderSpaceRequests(email) {
  const panel = document.getElementById("spaceRequestsPanel");
  if (!panel) return;
  const reqs = spGet(email, SP_REQUESTS_KEY) || [];
  const occOpts = SP_REQUEST_OCCASIONS.map(o=>`<option>${o}</option>`).join("");
  const bdgOpts = SP_REQUEST_BUDGETS.map(b=>`<option>${b}</option>`).join("");

  const reqCards = reqs.length === 0
    ? `<div class="sp-req-empty">
         <p class="sp-req-empty__icon">◇</p>
         <p class="sp-req-empty__title">No requests yet</p>
         <p class="sp-req-empty__sub">Share an inspiration and ABDAN will personally source something for you.</p>
       </div>`
    : reqs.map(r => {
        const doneIdx = SP_REQUEST_STATUSES.indexOf(r.status);
        const timelineHtml = SP_REQUEST_STATUSES.map((s,i) => `
          <div class="sp-req-tl-step${i<=doneIdx?" is-done":""}${i===doneIdx?" is-current":""}">
            <div class="sp-req-tl-dot"></div>
            ${i < SP_REQUEST_STATUSES.length-1 ? '<div class="sp-req-tl-line"></div>' : ''}
            <span class="sp-req-tl-label">${s}</span>
          </div>`).join("");
        return `
          <div class="sp-req-item">
            <div class="sp-req-item__head">
              <span class="sp-req-status">${r.status}</span>
              <span class="sp-req-date">${new Date(r.ts).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
            </div>
            ${r.img ? `<img class="sp-req-img" src="${r.img}" alt="Reference" loading="lazy" />` : ""}
            <p class="sp-req-desc-text">${r.desc}</p>
            <p class="sp-req-meta">${r.occasion} · ${r.budget}</p>
            <div class="sp-req-tl">${timelineHtml}</div>
          </div>`;
      }).join("");

  panel.innerHTML = `
    <div class="sp-section-wrap">
      <p class="sp-section-kicker">My Requests</p>
      <p class="sp-section-sub">Can ABDAN source something similar? Share your inspiration — we will find it for you.</p>

      <div class="sp-req-form">
        <div class="sp-req-upload-row">
          <label class="sp-req-upload-btn" for="spReqImg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span id="spReqImgLabel">Upload Image</span>
            <input type="file" id="spReqImg" accept="image/*" style="display:none" />
          </label>
          <label class="sp-req-upload-btn" for="spReqShot">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="3 9 9 9 9 3"/><polyline points="21 15 15 15 15 21"/></svg>
            <span id="spReqShotLabel">Upload Screenshot</span>
            <input type="file" id="spReqShot" accept="image/*" style="display:none" />
          </label>
        </div>
        <div class="sp-req-img-prev" id="spReqImgPrev" hidden></div>

        <label class="sp-portal__field">
          <span>Product Description</span>
          <textarea class="sp-req-desc" id="spReqDesc" placeholder="Describe what you are looking for — fabric, colour, occasion, style…" rows="3" maxlength="500"></textarea>
        </label>

        <label class="sp-portal__field">
          <span>Occasion</span>
          <select class="sp-moments-cat" id="spReqOcc">${occOpts}</select>
        </label>

        <label class="sp-portal__field">
          <span>Budget Range</span>
          <select class="sp-moments-cat" id="spReqBudget">${bdgOpts}</select>
        </label>

        <button type="button" class="primary-button" id="spReqSubmit">Submit Request</button>
      </div>

      <div class="sp-req-list">${reqCards}</div>
    </div>`;

  /* Image upload handlers */
  let pendingReqImg = "";
  const attachUpload = (inputId, labelId) => {
    const inp = panel.querySelector(`#${inputId}`);
    inp?.addEventListener("change", () => {
      const file = inp.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        pendingReqImg = ev.target.result;
        panel.querySelector(`#${labelId}`).textContent = file.name;
        const prev = panel.querySelector("#spReqImgPrev");
        if (prev) {
          prev.hidden = false;
          prev.innerHTML = `<img src="${pendingReqImg}" alt="Preview" /><button type="button" id="spReqImgClear">Remove</button>`;
          prev.querySelector("#spReqImgClear")?.addEventListener("click", () => {
            pendingReqImg = ""; prev.hidden = true; prev.innerHTML = "";
            panel.querySelector(`#${labelId}`).textContent = inputId === "spReqImg" ? "Upload Image" : "Upload Screenshot";
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
  attachUpload("spReqImg",  "spReqImgLabel");
  attachUpload("spReqShot", "spReqShotLabel");

  panel.querySelector("#spReqSubmit")?.addEventListener("click", () => {
    const desc = panel.querySelector("#spReqDesc")?.value.trim();
    if (!desc) return showToast("Please describe what you are looking for.");
    const req = {
      desc,
      img:      pendingReqImg,
      occasion: panel.querySelector("#spReqOcc")?.value || "",
      budget:   panel.querySelector("#spReqBudget")?.value || "",
      status:   "Submitted",
      ts:       Date.now(),
    };
    spSet(email, SP_REQUESTS_KEY, [req, ...(spGet(email, SP_REQUESTS_KEY) || [])]);
    showToast("Request submitted. ABDAN will review it personally. 💛");
    renderSpaceRequests(email);
  });
}

function renderSpaceMessages(email) {
  const panel = document.getElementById("spaceMessagesPanel");
  if (!panel) return;
  const threads = spGetConcierge(email);

  if (!threads.length) {
    panel.innerHTML = `
      <div class="sp-section-wrap">
        <p class="sp-section-kicker">My Conversations</p>
        <div class="sp-req-empty">
          <p class="sp-req-empty__icon">✉</p>
          <p class="sp-req-empty__title">No conversations yet</p>
          <p class="sp-req-empty__sub">Your styling guidance, sourcing discussions and personal conversations with ABDAN will appear here.</p>
        </div>
        <button type="button" class="secondary-button" onclick="showSpaceTab('concierge')" style="margin-top:1.25rem">Start a Conversation</button>
      </div>`;
    return;
  }

  /* Group by category; messages without category go under their own date */
  const groups = {};
  threads.forEach(m => {
    const key = m.category || "Conversation";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });

  const groupHtml = Object.entries(groups).map(([cat, msgs]) => `
    <div class="sp-conv-group">
      <p class="sp-conv-group__label">${cat}</p>
      <div class="sp-conv-group__msgs">
        ${msgs.slice(-3).map(m => `
          <div class="sp-conv-bubble">
            <p class="sp-conv-bubble__text">${m.text || ""}</p>
            ${m.imgSrc ? `<img src="${m.imgSrc}" alt="" class="sp-conv-bubble__img" loading="lazy" />` : ""}
            ${m.voiceSrc ? `<audio controls src="${m.voiceSrc}" class="sp-conv-bubble__audio"></audio>` : ""}
            <span class="sp-conv-bubble__time">${new Date(m.sentAt||m.ts||Date.now()).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
          </div>`).join("")}
      </div>
      <a class="sp-conv-group__wa"
         href="https://wa.me/918760595307?text=${encodeURIComponent(`[ABDAN ${cat}] ${msgs[msgs.length-1]?.text||""}`.substring(0,200))}"
         target="_blank" rel="noreferrer"><svg class="social-icon wa-glyph" aria-hidden="true"><use href="#icon-whatsapp"/></svg>Continue ↗</a>
    </div>`).join("");

  panel.innerHTML = `
    <div class="sp-section-wrap">
      <p class="sp-section-kicker">My Conversations</p>
      <p class="sp-section-sub">Your styling guidance, sourcing discussions and personal concierge conversations.</p>
      <div class="sp-conv-list">${groupHtml}</div>
      <button type="button" class="secondary-button" onclick="showSpaceTab('concierge')" style="margin-top:1rem">Ask ABDAN Something New</button>
    </div>`;
}

function renderSpaceMembership(profile) {
  const panel = document.getElementById("spaceMembershipPanel");
  if (!panel) return;
  const email   = profile.email || "";
  const pts     = spGetLoyalty(email);
  const tier    = spGetTier(pts);
  const tierIdx = SP_LOYALTY_TIERS.indexOf(tier);
  const next    = SP_LOYALTY_TIERS[tierIdx + 1];
  const ptsToNext = next ? next.min - pts : 0;
  const pct = next ? Math.min(100,Math.round(((pts-tier.min)/(next.min-tier.min))*100)) : 100;
  const icHtml = SP_IC_CARDS.map(card=>{const u=pts>=card.minPts;return `<div class="sp-ic-card ${u?"sp-ic-card--unlocked":"sp-ic-card--locked"}"><p class="sp-ic-card__label">${card.label}</p><p class="sp-ic-card__title">${card.title}</p><p class="sp-ic-card__body">${card.body}</p>${!u?`<span class="sp-ic-card__lock">Unlock at ${card.unlock}</span>`:""}</div>`;}).join("");
  panel.innerHTML = `<div class="sp-section-wrap"><div class="sp-membership-hero"><p class="sp-section-kicker">Membership</p><p class="sp-membership-hero__tier">${tier.name}</p><p class="sp-membership-hero__pts">${pts} Devotion Points</p>${next?`<p class="sp-membership-hero__next">${ptsToNext} points until ${next.name}</p><div class="sp-membership-bar"><div class="sp-membership-bar__fill" style="width:${pct}%"></div></div>`:`<p class="sp-membership-hero__next">You have reached the highest tier.</p>`}</div><div class="sp-ic-section" style="margin-top:2rem"><p class="sp-ic-section__kicker">The Inner Circle</p><p class="sp-section-sub" style="margin-bottom:1rem">Private launches - Early access - Priority concierge - Founder notes - Limited collections - Reserved pieces</p><div class="sp-ic-cards">${icHtml}</div></div></div>`;
}

const SP_SETTINGS_SECTIONS = ["Personal Details","Address Book","Communication Preferences","Privacy","Theme Selection","Notifications","Membership","Inner Circle","Messages","Concierge"];

function renderSpaceSettings(profile, email) {
  const panel = document.getElementById("spaceSettingsPanel");
  if (!panel) return;
  const actions = {"Personal Details":"showSpaceTab('profile')","Theme Selection":"showSpaceTab('profile')","Membership":"showSpaceTab('membership')","Inner Circle":"showSpaceTab('membership')","Messages":"showSpaceTab('messages')","Concierge":"showSpaceTab('concierge')"};
  const items = SP_SETTINGS_SECTIONS.map(s=>{const act=actions[s]?`onclick="${actions[s]}"` : "";return `<button type="button" class="sp-settings-item" ${act}><span class="sp-settings-item__label">${s}</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></button>`;}).join("");
  panel.innerHTML = `<div class="sp-section-wrap"><p class="sp-section-kicker">Settings</p><div class="sp-settings-list">${items}</div><div class="sp-settings-signout"><button type="button" class="secondary-button" id="spSettingsPause">Pause My Space</button><button type="button" class="sp-signout-text" id="spSettingsOut">Sign Out</button></div></div>`;
  panel.querySelector("#spSettingsPause")?.addEventListener("click",()=>{ if(typeof handleSpaceSignout==="function")handleSpaceSignout(); });
  panel.querySelector("#spSettingsOut")?.addEventListener("click",()=>{ if(typeof handleHardSignout==="function")handleHardSignout(); });
}

function handleHardSignout() {
  clearSpaceSession();
  try{localStorage.removeItem("abdan-sp-last");}catch{}
  const dashEl=document.getElementById("spaceDashboard");
  if(dashEl) dashEl.dataset.spTheme="";
  if(typeof exitYourSpaceRoute==="function") exitYourSpaceRoute();
  showSpaceView("spaceEntry");
  showToast("You have signed out of Your Space.");
}

document.getElementById("spaceSignoutHard")?.addEventListener("click", handleHardSignout);

/* S87 — Upgraded Ask ABDAN concierge with categories + voice notes */
const SP_CONCIERGE_CATEGORIES = [
  { label: "Styling Advice",         text: "I would love some styling advice — " },
  { label: "Fabric Question",        text: "I have a question about fabric — " },
  { label: "Gift Recommendation",    text: "I am looking for a gift recommendation — " },
  { label: "Occasion Help",          text: "I need help choosing something for an occasion — " },
  { label: "Sizing Help",            text: "I need help with sizing — " },
  { label: "Product Sourcing",       text: "Can ABDAN source something similar? I am looking for — " },
];

let _spVoiceRecorder  = null;
let _spVoiceChunks    = [];
let _spVoiceRecording = false;
let _spVoiceSrc       = null;

function renderSpaceConcierge(email) {
  const panel = document.getElementById("spaceConciergePanel");
  if (!panel) return;

  const msgs = spGetConcierge(email);

  const threadHtml = msgs.length
    ? msgs.map(m => {
        const imgHtml   = m.imgSrc   ? `<img src="${m.imgSrc}"   alt="" class="sp-msg__img" loading="lazy" />` : "";
        const voiceHtml = m.voiceSrc ? `<audio controls src="${m.voiceSrc}" class="sp-msg__audio"></audio>` : "";
        const catBadge  = m.category ? `<span class="sp-msg__cat">${m.category}</span>` : "";
        return `
          <div class="sp-msg sp-msg--sent">
            ${catBadge}
            <div class="sp-msg__bubble">${m.text || ""}</div>
            ${imgHtml}${voiceHtml}
            <span class="sp-msg__meta">
              ${m.sentAt ? new Date(m.sentAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : ""}
              &nbsp;·&nbsp;
              <a class="sp-msg__wa-link"
                 href="https://wa.me/918760595307?text=${encodeURIComponent((m.text||"").substring(0,200))}"
                 target="_blank" rel="noreferrer"><svg class="social-icon wa-glyph" aria-hidden="true"><use href="#icon-whatsapp"/></svg>Continue ↗</a>
            </span>
          </div>`;
      }).join("")
    : `<div class="sp-empty" style="padding:1.5rem 0">
        <div class="sp-empty__icon">✉</div>
        <p class="sp-empty__title">A quiet line to ABDAN</p>
        <p class="sp-empty__body">Ask about a piece, request styling guidance, or share an inspiration.</p>
      </div>`;

  const catChips = SP_CONCIERGE_CATEGORIES.map(c =>
    `<button class="sp-occ-chip" type="button" data-cattext="${c.text}">${c.label}</button>`
  ).join("");

  panel.innerHTML = `
    <div class="sp-concierge">
      <div class="sp-concierge-intro">
        <p class="sp-concierge-intro__kicker">Private Concierge</p>
        <h3 class="sp-concierge-intro__title">Ask ABDAN anything</h3>
        <p class="sp-concierge-intro__body">Styling questions, fabric guidance, sourcing a specific piece — your message goes directly to ABDAN. Personal, warm, and always thoughtful.</p>
      </div>

      <div class="sp-msg-thread" id="spMsgThread">${threadHtml}</div>

      <div class="sp-occ-row" id="spCatRow">
        <span class="sp-occ-row__label">Categories</span>
        ${catChips}
      </div>

      <div class="sp-compose" id="spCompose">
        <div class="sp-compose__img-preview" id="spComposeImgPrev"></div>
        <div class="sp-compose__voice-prev" id="spComposeVoicePrev" hidden></div>
        <textarea class="sp-compose__textarea" id="spComposeText"
                  placeholder="Ask about a piece, request styling advice, share an inspiration…" rows="3"></textarea>
        <div class="sp-compose__actions">
          <label class="sp-compose__img-btn" title="Attach image" aria-label="Attach image">
            📎
            <input type="file" accept="image/*" id="spComposeImg" style="display:none" />
          </label>
          <button type="button" class="sp-voice-btn" id="spVoiceBtn" title="Voice note" aria-label="Record voice note">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
          <button type="button" class="sp-compose__send" id="spComposeSend">Send to ABDAN</button>
        </div>
      </div>
      <p class="sp-compose__note">Your message will open WhatsApp — responded to personally by ABDAN.</p>
    </div>`;

  /* Reset voice state */
  _spVoiceRecording = false;
  _spVoiceSrc       = null;
  _spVoiceChunks    = [];

  let pendingImgSrc = null;
  let selectedCategory = "";

  /* Category chips pre-fill textarea */
  panel.querySelector("#spCatRow")?.addEventListener("click", e => {
    const chip = e.target.closest("[data-cattext]");
    if (!chip) return;
    selectedCategory = chip.textContent;
    panel.querySelectorAll("[data-cattext]").forEach(c => c.classList.remove("is-selected"));
    chip.classList.add("is-selected");
    const ta = panel.querySelector("#spComposeText");
    if (ta) { ta.value = chip.dataset.cattext; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
  });

  /* Image attach */
  panel.querySelector("#spComposeImg")?.addEventListener("change", e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      pendingImgSrc = ev.target.result;
      const prev = panel.querySelector("#spComposeImgPrev");
      if (prev) {
        prev.classList.add("has-img");
        prev.innerHTML = `<img src="${pendingImgSrc}" alt="" /><span class="sp-compose__img-clear" id="spComposeImgClear">✕ Remove</span>`;
        prev.querySelector("#spComposeImgClear")?.addEventListener("click", () => {
          pendingImgSrc = null; prev.classList.remove("has-img"); prev.innerHTML = "";
        });
      }
    };
    reader.readAsDataURL(file);
  });

  /* Voice note */
  const voiceBtn = panel.querySelector("#spVoiceBtn");
  let voiceTimer = null;
  let voiceSeconds = 0;

  voiceBtn?.addEventListener("click", () => {
    if (!_spVoiceRecording) {
      navigator.mediaDevices?.getUserMedia?.({ audio: true })
        .then(stream => {
          _spVoiceChunks = [];
          _spVoiceRecorder = new MediaRecorder(stream);
          _spVoiceRecorder.ondataavailable = e => _spVoiceChunks.push(e.data);
          _spVoiceRecorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            clearInterval(voiceTimer);
            voiceBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
            voiceBtn.classList.remove("is-recording");
            const blob = new Blob(_spVoiceChunks, { type: "audio/webm" });
            const reader = new FileReader();
            reader.onload = ev => {
              _spVoiceSrc = ev.target.result;
              const vprev = panel.querySelector("#spComposeVoicePrev");
              if (vprev) {
                vprev.hidden = false;
                vprev.innerHTML = `<audio controls src="${_spVoiceSrc}" style="width:100%;height:36px"></audio><button type="button" id="spVoiceClear" style="font-size:.7rem;color:var(--muted);background:transparent;border:none;cursor:pointer;margin-top:.2rem">Remove voice note</button>`;
                vprev.querySelector("#spVoiceClear")?.addEventListener("click", () => {
                  _spVoiceSrc = null; vprev.hidden = true; vprev.innerHTML = "";
                });
              }
            };
            reader.readAsDataURL(blob);
          };
          _spVoiceRecorder.start();
          _spVoiceRecording = true;
          voiceSeconds = 0;
          voiceBtn.classList.add("is-recording");
          voiceBtn.textContent = "⏹ 0s";
          voiceTimer = setInterval(() => {
            voiceSeconds++;
            voiceBtn.textContent = `⏹ ${voiceSeconds}s`;
            if (voiceSeconds >= 60) voiceBtn.click(); /* auto-stop at 60s */
          }, 1000);
        })
        .catch(() => showToast("Microphone access needed for voice notes."));
    } else {
      _spVoiceRecorder?.stop();
      _spVoiceRecording = false;
    }
  });

  /* Send */
  panel.querySelector("#spComposeSend")?.addEventListener("click", () => {
    const ta   = panel.querySelector("#spComposeText");
    const text = ta?.value?.trim() || "";
    if (!text && !pendingImgSrc && !_spVoiceSrc) return;
    const msg  = { text, imgSrc: pendingImgSrc, voiceSrc: _spVoiceSrc, sentAt: Date.now(), category: selectedCategory };
    spAddMsg(email, msg);
    const allMsgs = spGetConcierge(email);
    if (allMsgs.length === 1) spAddLoyalty(email, 20);
    const voiceNote = _spVoiceSrc ? "\n\n(Voice note attached — I'll share it in the chat)" : "";
    const imgNote   = pendingImgSrc ? "\n\n(Image attached — I'll share it in the chat)" : "";
    const waPrefix  = selectedCategory ? `[ABDAN ${selectedCategory}] ` : "[ABDAN Concierge] ";
    const waText    = text ? `${waPrefix}${text}${imgNote}${voiceNote}` : `${waPrefix}I've attached a reference.${imgNote}${voiceNote}`;
    window.open(`https://wa.me/918760595307?text=${encodeURIComponent(waText)}`, "_blank", "noreferrer");
    if (ta) ta.value = "";
    pendingImgSrc = null; _spVoiceSrc = null; selectedCategory = "";
    const prev  = panel.querySelector("#spComposeImgPrev");
    const vprev = panel.querySelector("#spComposeVoicePrev");
    if (prev)  { prev.classList.remove("has-img"); prev.innerHTML = ""; }
    if (vprev) { vprev.hidden = true; vprev.innerHTML = ""; }
    panel.querySelectorAll("[data-cattext]").forEach(c => c.classList.remove("is-selected"));
    renderSpaceConcierge(email);
    showToast("Your message is ready — sent via WhatsApp 💛");
  });
}

/* S88 — Upgraded membership: emotional, prominent, exact IC benefits */
const SP_IC_BENEFITS = [
  { icon: "◇", label: "Private Launches",     desc: "First look at new collections before they open to the world." },
  { icon: "✦", label: "Early Access",          desc: "Reserve pieces before they are announced publicly." },
  { icon: "✉", label: "Priority Concierge",    desc: "Your requests are answered first, always." },
  { icon: "♡", label: "Founder Notes",         desc: "Personal letters from ABDAN, written only for you." },
  { icon: "◈", label: "Limited Collections",   desc: "Access to pieces made in small quantities, only for members." },
  { icon: "✧", label: "Reserved Pieces",       desc: "Select pieces held quietly until you are ready." },
];

function renderSpaceMembership(profile) {
  const panel = document.getElementById("spaceMembershipPanel");
  if (!panel) return;

  const email     = profile.email || "";
  const pts       = spGetLoyalty(email);
  const tier      = spGetTier(pts);
  const tierIdx   = SP_LOYALTY_TIERS.indexOf(tier);
  const next      = SP_LOYALTY_TIERS[tierIdx + 1];
  const ptsToNext = next ? next.min - pts : 0;
  const pct       = next ? Math.min(100, Math.round(((pts - tier.min) / (next.min - tier.min)) * 100)) : 100;
  const tierIcons = ["✦","◈","◇","♛"];
  const tierIcon  = tierIcons[Math.max(0, tierIdx)];

  /* IC cards (existing §80 content — locked/unlocked by points) */
  const icCardsHtml = SP_IC_CARDS.map(card => {
    const u = pts >= card.minPts;
    return `<div class="sp-ic-card ${u?"sp-ic-card--unlocked":"sp-ic-card--locked"}">
      <p class="sp-ic-card__label">${card.label}</p>
      <p class="sp-ic-card__title">${card.title}</p>
      <p class="sp-ic-card__body">${card.body}</p>
      ${!u ? `<span class="sp-ic-card__lock">Unlock at ${card.unlock}</span>` : ""}
    </div>`;
  }).join("");

  /* IC benefits preview */
  const benefitsHtml = SP_IC_BENEFITS.map(b => `
    <div class="sp-ic-benefit">
      <span class="sp-ic-benefit__icon">${b.icon}</span>
      <div class="sp-ic-benefit__body">
        <p class="sp-ic-benefit__label">${b.label}</p>
        <p class="sp-ic-benefit__desc">${b.desc}</p>
      </div>
    </div>`).join("");

  panel.innerHTML = `
    <div class="sp-section-wrap">

      <!-- Tier display: prominent, emotional -->
      <div class="sp-tier-display">
        <span class="sp-tier-display__icon">${tierIcon}</span>
        <p class="sp-tier-display__kicker">Your membership</p>
        <h2 class="sp-tier-display__name">${tier.name}</h2>
        <p class="sp-tier-display__pts">${pts} Devotion Points</p>
        ${next ? `
          <p class="sp-tier-display__next">${ptsToNext} points until <strong>${next.name}</strong></p>
          <div class="sp-membership-bar" style="margin-top:.75rem">
            <div class="sp-membership-bar__fill" style="width:${pct}%"></div>
          </div>` : `
          <p class="sp-tier-display__next" style="color:var(--gold)">You have reached the highest tier. Thank you. 💛</p>`}
      </div>

      <!-- Inner Circle preview -->
      <div class="sp-ic-preview">
        <p class="sp-ic-preview__kicker">The Inner Circle</p>
        <p class="sp-ic-preview__tagline">A private world within ABDAN — reserved for those who stay.</p>
        <div class="sp-ic-benefits">${benefitsHtml}</div>
        ${pts < 150 ? `
          <div class="sp-ic-preview__lock">
            <p class="sp-ic-preview__lock-note">The Inner Circle unlocks at 150 Devotion Points. You are ${150-pts} points away.</p>
          </div>` : ""}
      </div>

      <!-- Existing §80 IC content cards -->
      <div class="sp-ic-section" style="margin-top:1.5rem">
        <p class="sp-ic-section__kicker">Your Exclusive Access</p>
        <div class="sp-ic-cards">${icCardsHtml}</div>
      </div>

    </div>`;
}

/* S89 — Workflow: override renderSpaceRequests with global-store integration */
function renderSpaceRequests(email) {
  const panel = document.getElementById("spaceRequestsPanel");
  if (!panel) return;

  /* Merge: prefer global-store (admin may have updated status/replies) */
  const localReqs  = spGet(email, SP_REQUESTS_KEY) || [];
  const globalReqs = (() => {
    try { return JSON.parse(localStorage.getItem(SP_GLOBAL_REQS_KEY)||"[]"); } catch { return []; }
  })().filter(r => (r.email||"").toLowerCase() === email.toLowerCase());

  /* Build merged list: global wins for status/updatedAt */
  const reqs = localReqs.map(lr => {
    const gr = globalReqs.find(r => r.ts === lr.ts);
    return gr ? { ...lr, status: gr.status, updatedAt: gr.updatedAt, statusHistory: gr.statusHistory||[] } : lr;
  });
  /* Append any global requests not in local (edge case) */
  globalReqs.forEach(gr => { if (!reqs.find(r=>r.ts===gr.ts)) reqs.unshift(gr); });
  reqs.sort((a,b)=>(b.ts||0)-(a.ts||0));

  const occOpts = SP_REQUEST_OCCASIONS.map(o=>`<option>${o}</option>`).join("");
  const bdgOpts = SP_REQUEST_BUDGETS.map(b=>`<option>${b}</option>`).join("");

  const reqCards = reqs.length === 0
    ? `<div class="sp-req-empty">
         <p class="sp-req-empty__icon">◇</p>
         <p class="sp-req-empty__title">No requests yet</p>
         <p class="sp-req-empty__sub">Share an inspiration and ABDAN will personally source something for you.</p>
       </div>`
    : reqs.map(r => {
        const doneIdx = SP_REQUEST_STATUSES.indexOf(r.status);
        const isComplete = r.status === "Completed";
        const updatedStr = r.updatedAt
          ? `Last updated ${new Date(r.updatedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}`
          : "";
        const tl = SP_REQUEST_STATUSES.map((s,i) => `
          <div class="sp-req-tl-step${i<=doneIdx?" is-done":""}${i===doneIdx?" is-current":""}">
            <div class="sp-req-tl-dot"></div>
            ${i<SP_REQUEST_STATUSES.length-1?'<div class="sp-req-tl-line"></div>':''}
            <span class="sp-req-tl-label">${s}</span>
          </div>`).join("");
        const completeBanner = isComplete ? `
          <div class="sp-req-complete">
            <p class="sp-req-complete__title">ABDAN Found Options For You 💛</p>
            <p class="sp-req-complete__sub">Check your conversations — ABDAN has sent recommendations.</p>
            <button type="button" class="sp-req-complete__cta" onclick="showSpaceTab('messages')">View Recommendations →</button>
          </div>` : "";
        return `
          <div class="sp-req-item">
            <div class="sp-req-item__head">
              <span class="sp-req-status${isComplete?' sp-req-status--done':''}">${r.status}</span>
              <span class="sp-req-date">${new Date(r.ts).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
            </div>
            ${updatedStr ? `<p style="font-size:.65rem;color:var(--gold,#c5a13b);margin-bottom:.4rem">${updatedStr}</p>` : ""}
            ${r.img ? `<img class="sp-req-img" src="${r.img}" alt="" loading="lazy" />` : ""}
            <p class="sp-req-desc-text">${r.desc}</p>
            <p class="sp-req-meta">${r.occasion} · ${r.budget}</p>
            <div class="sp-req-tl">${tl}</div>
            ${completeBanner}
          </div>`;
      }).join("");

  panel.innerHTML = `
    <div class="sp-section-wrap">
      <p class="sp-section-kicker">My Requests</p>
      <p class="sp-section-sub">Can ABDAN source something similar? Share your inspiration — we will find it for you.</p>
      <div class="sp-req-form">
        <div class="sp-req-upload-row">
          <label class="sp-req-upload-btn" for="spReqImg">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span id="spReqImgLabel">Upload Image</span>
            <input type="file" id="spReqImg" accept="image/*" style="display:none" />
          </label>
          <label class="sp-req-upload-btn" for="spReqShot">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="3 9 9 9 9 3"/><polyline points="21 15 15 15 15 21"/></svg>
            <span id="spReqShotLabel">Upload Screenshot</span>
            <input type="file" id="spReqShot" accept="image/*" style="display:none" />
          </label>
        </div>
        <div class="sp-req-img-prev" id="spReqImgPrev" hidden></div>
        <label class="sp-portal__field"><span>Product Description</span>
          <textarea style="width:100%;padding:.7rem .9rem;background:rgba(2,61,58,.03);border:1px solid var(--line);border-radius:.5rem;font-family:inherit;font-size:.875rem;box-sizing:border-box;resize:vertical;min-height:4rem" id="spReqDesc" placeholder="Describe what you are looking for — fabric, colour, occasion, style…" rows="3" maxlength="500"></textarea>
        </label>
        <label class="sp-portal__field"><span>Occasion</span>
          <select class="sp-moments-cat" id="spReqOcc">${occOpts}</select>
        </label>
        <label class="sp-portal__field"><span>Budget Range</span>
          <select class="sp-moments-cat" id="spReqBudget">${bdgOpts}</select>
        </label>
        <button type="button" class="primary-button" id="spReqSubmit">Submit Request</button>
      </div>
      <div class="sp-req-list">${reqCards}</div>
    </div>`;

  let pendingReqImg = "";
  const attachUpload = (inputId, labelId) => {
    const inp = panel.querySelector(`#${inputId}`);
    inp?.addEventListener("change", () => {
      const file = inp.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        pendingReqImg = ev.target.result;
        panel.querySelector(`#${labelId}`).textContent = file.name;
        const prev = panel.querySelector("#spReqImgPrev");
        if (prev) {
          prev.hidden = false;
          prev.innerHTML = `<img src="${pendingReqImg}" alt="Preview" /><button type="button" id="spReqImgClear">Remove</button>`;
          prev.querySelector("#spReqImgClear")?.addEventListener("click",()=>{
            pendingReqImg=""; prev.hidden=true; prev.innerHTML="";
            panel.querySelector(`#${labelId}`).textContent = inputId==="spReqImg"?"Upload Image":"Upload Screenshot";
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
  attachUpload("spReqImg","spReqImgLabel");
  attachUpload("spReqShot","spReqShotLabel");

  panel.querySelector("#spReqSubmit")?.addEventListener("click", () => {
    const desc = panel.querySelector("#spReqDesc")?.value.trim();
    if (!desc) return showToast("Please describe what you are looking for.");
    const sess = getSpaceSession();
    const req  = {
      desc,
      img:       pendingReqImg,
      occasion:  panel.querySelector("#spReqOcc")?.value||"",
      budget:    panel.querySelector("#spReqBudget")?.value||"",
      status:    "Submitted",
      ts:        Date.now(),
      updatedAt: Date.now(),
      statusHistory: [{ status:"Submitted", ts: Date.now() }],
    };
    /* Write to customer-local store */
    spSet(email, SP_REQUESTS_KEY, [req, ...(spGet(email,SP_REQUESTS_KEY)||[])]);
    /* Write to global store for admin visibility */
    try {
      const global = JSON.parse(localStorage.getItem(SP_GLOBAL_REQS_KEY)||"[]");
      global.unshift({ ...req, email, name: sess?.displayName||sess?.fullName||email });
      localStorage.setItem(SP_GLOBAL_REQS_KEY, JSON.stringify(global));
    } catch { /* quota */ }
    /* System message to concierge thread */
    try {
      const key = `abdan-sp-concierge:${email.toLowerCase()}`;
      const msgs = JSON.parse(localStorage.getItem(key)||"[]");
      msgs.push({ from:"system", text:`Sourcing request submitted: "${desc.substring(0,60)}${desc.length>60?"…":""}". ABDAN will be in touch shortly.`, sentAt:Date.now(), ts:Date.now(), category:"Sourcing Request" });
      localStorage.setItem(key, JSON.stringify(msgs));
    } catch { /* quota */ }
    showToast("Request submitted. ABDAN will review it personally. 💛");
    renderSpaceRequests(email);
  });
}

/* S89 — Override renderSpaceMessages with two-way conversation display */
function renderSpaceMessages(email) {
  const panel = document.getElementById("spaceMessagesPanel");
  if (!panel) return;
  const threads = spGetConcierge(email);

  if (!threads.length) {
    panel.innerHTML = `
      <div class="sp-section-wrap">
        <p class="sp-section-kicker">My Conversations</p>
        <div class="sp-req-empty">
          <p class="sp-req-empty__icon">✉</p>
          <p class="sp-req-empty__title">No conversations yet</p>
          <p class="sp-req-empty__sub">Your styling guidance, sourcing discussions and personal conversations with ABDAN will appear here.</p>
        </div>
        <button type="button" class="secondary-button" onclick="showSpaceTab('concierge')" style="margin-top:1.25rem">Start a Conversation</button>
      </div>`;
    return;
  }

  /* Group by category */
  const groups = {};
  threads.forEach(m => {
    const key = m.category || "Conversation";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });

  const groupHtml = Object.entries(groups).map(([cat, msgs]) => `
    <div class="sp-conv-group">
      <p class="sp-conv-group__label">${cat}</p>
      <div class="sp-conv-group__msgs">
        ${msgs.slice(-5).map(m => {
          const isAbdan  = m.from === "abdan";
          const isSystem = m.from === "system";
          const cls = isAbdan ? "sp-msg-hist-item--abdan" : isSystem ? "sp-msg-hist-item--system" : "sp-msg-hist-item--customer";
          return `
            <div class="sp-msg-hist-item ${cls}">
              ${isAbdan ? '<span class="sp-msg-hist-sender">ABDAN</span>' : isSystem ? '' : ''}
              <p class="sp-msg-hist-text">${m.text||""}</p>
              ${m.imgSrc ? `<img src="${m.imgSrc}" alt="" class="sp-conv-bubble__img" loading="lazy" />` : ""}
              ${m.voiceSrc ? `<audio controls src="${m.voiceSrc}" class="sp-conv-bubble__audio"></audio>` : ""}
              <span class="sp-msg-hist-time">${new Date(m.sentAt||m.ts||Date.now()).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
            </div>`;
        }).join("")}
      </div>
      <a class="sp-conv-group__wa"
         href="https://wa.me/918760595307?text=${encodeURIComponent(`[ABDAN ${cat}] ${msgs[msgs.length-1]?.text||""}`.substring(0,200))}"
         target="_blank" rel="noreferrer"><svg class="social-icon wa-glyph" aria-hidden="true"><use href="#icon-whatsapp"/></svg>Continue ↗</a>
    </div>`).join("");

  panel.innerHTML = `
    <div class="sp-section-wrap">
      <p class="sp-section-kicker">My Conversations</p>
      <p class="sp-section-sub">Your styling guidance, sourcing discussions and personal concierge conversations.</p>
      <div class="sp-conv-list">${groupHtml}</div>
      <button type="button" class="secondary-button" onclick="showSpaceTab('concierge')" style="margin-top:1rem">Ask ABDAN Something New</button>
    </div>`;
}

/* S89 — URL-based request status update (cross-device admin sync) */
(function checkReqUpdateUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("req_update");
    if (!raw) return;
    const data = JSON.parse(atob(raw));
    if (!data.email || !data.ts || !data.status) return;
    const email = data.email.toLowerCase();
    /* Update global store */
    const global = JSON.parse(localStorage.getItem(SP_GLOBAL_REQS_KEY)||"[]");
    const idx = global.findIndex(r=>r.email===email&&r.ts===+data.ts);
    if (idx>=0) {
      global[idx].status    = data.status;
      global[idx].updatedAt = Date.now();
      if (!global[idx].statusHistory) global[idx].statusHistory=[];
      global[idx].statusHistory.push({status:data.status, ts:Date.now()});
      localStorage.setItem(SP_GLOBAL_REQS_KEY, JSON.stringify(global));
    }
    /* Update local customer store */
    const localKey = `abdan-sp-requests:${email}`;
    const local = JSON.parse(localStorage.getItem(localKey)||"[]");
    const lidx  = local.findIndex(r=>r.ts===+data.ts);
    if (lidx>=0) { local[lidx].status=data.status; local[lidx].updatedAt=Date.now(); localStorage.setItem(localKey, JSON.stringify(local)); }
    /* Add system message to concierge */
    const ckey  = `abdan-sp-concierge:${email}`;
    const cmsgs = JSON.parse(localStorage.getItem(ckey)||"[]");
    cmsgs.push({from:"system",text:`Your request status has been updated to: <strong>${data.status}</strong>.${data.note?` ${data.note}`:""}`,sentAt:Date.now(),ts:Date.now(),category:"Sourcing Request"});
    localStorage.setItem(ckey, JSON.stringify(cmsgs));
    /* Clean URL */
    history.replaceState({}, "", window.location.pathname);
  } catch { /* invalid param — ignore */ }
})();

/* Sprint D — Audit Closure */

/* D-03 — Personal Quote key */
const SP_QUOTE_KEY = "abdan-sp-quote";

/* D-05 — Tab badge updater */
function updateSpaceTabBadges(email) {
  /* Requests: count non-completed requests */
  try {
    const global = JSON.parse(localStorage.getItem(SP_GLOBAL_REQS_KEY)||"[]");
    const mine   = global.filter(r=>(r.email||"").toLowerCase()===email.toLowerCase());
    const pending = mine.filter(r=>r.status!=="Completed").length;
    const reqBadge = document.getElementById("spaceTabRequestsCount");
    if (reqBadge) { reqBadge.textContent=pending; reqBadge.hidden=pending===0; }
  } catch {}
  /* Messages: count ABDAN messages not yet acknowledged */
  try {
    const seenKey = `abdan-sp-msgs-seen:${email.toLowerCase()}`;
    const seenTs  = parseInt(localStorage.getItem(seenKey)||"0",10);
    const msgs    = JSON.parse(localStorage.getItem(`abdan-sp-concierge:${email.toLowerCase()}`)||"[]");
    const unread  = msgs.filter(m=>m.from==="abdan"&&(m.sentAt||m.ts||0)>seenTs).length;
    const msgBadge = document.getElementById("spaceTabMessagesCount");
    if (msgBadge) { msgBadge.textContent=unread; msgBadge.hidden=unread===0; }
  } catch {}
}

/* RC-01 fix + D-05: Re-render Messages on every tab open (ensures fresh data) */
(function() {
  const orig = window.showSpaceTab;
  if (typeof orig === "function") {
    window.showSpaceTab = function(tabId) {
      orig(tabId);
      if (tabId === "messages") {
        const sess = typeof getSpaceSession === "function" ? getSpaceSession() : null;
        if (sess?.email) {
          /* RC-01: always re-render with current email so new messages are visible */
          if (typeof renderSpaceMessages === "function") renderSpaceMessages(sess.email);
          /* D-05: clear unread badge + record seen timestamp */
          try { localStorage.setItem(`abdan-sp-msgs-seen:${sess.email.toLowerCase()}`, String(Date.now())); } catch {}
          const msgBadge = document.getElementById("spaceTabMessagesCount");
          if (msgBadge) { msgBadge.textContent="0"; msgBadge.hidden=true; }
        }
      }
    };
  }
})();

/* D-02 — My Wardrobe correction: differentiate purchases vs saved pieces */
/* ════════════════════════════════════════════════════════════════════
   MY WARDROBE — a personal fashion archive (additive ecosystem).
   Lives inside the existing "saved" tab panel. Six sections behind a quiet
   in-panel sub-navigation. No change to Your Space navigation.
   ════════════════════════════════════════════════════════════════════ */
let _wardTab = "pieces";
function wardEsc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function wardUid()  { return "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function wardGarmentType(name) {
  const n = (name || "").toLowerCase();
  if (/saree|sari/.test(n))                                              return "Sarees";
  if (/abaya|burqa|jilbab/.test(n))                                      return "Abayas";
  if (/kurti|kurta|tunic|suit/.test(n))                                  return "Kurtis";
  if (/dupatta|jewel|bag|handbag|clutch|accessor|scarf|stole|hijab|earring|neck|bangle/.test(n)) return "Accessories";
  return "Collections";
}
function wardCompressImage(file, cb) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const max = 760; let w = img.width, h = img.height;
      if (w > max || h > max) { const r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      try { cb(c.toDataURL("image/jpeg", 0.72)); } catch { cb(e.target.result); }
    };
    img.onerror = () => cb(null);
    img.src = e.target.result;
  };
  reader.onerror = () => cb(null);
  reader.readAsDataURL(file);
}
function wardPurchasedPieces(sess) {
  if (typeof applyStudioOverrides === "function") applyStudioOverrides();
  let orders = []; try { orders = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]"); } catch { orders = []; }
  const email = String(sess && sess.email || "").toLowerCase();
  const prof  = (typeof getSpaceProfiles === "function" ? getSpaceProfiles() : {})[email] || {};
  const phones = [sess && sess.phone, prof.phone].map((p) => String(p || "").replace(/\D/g, "")).filter(Boolean);
  const mine = orders.filter((o) => {
    const op = String(o.customerPhone || "").replace(/\D/g, "");
    const oe = String(o.customerEmail || "").toLowerCase();
    return (op && phones.includes(op)) || (email && oe === email);
  });
  const map = {};
  mine.forEach((o) => (o.items || []).forEach((it) => {
    const key = it.id || it.name; if (!key) return;
    if (!map[key]) {
      const p = it.id ? PRODUCTS.find((x) => x.id === it.id) : null;
      const nm = it.name || (p && p.name) || "ABDAN Piece";
      map[key] = { id: it.id || key, name: nm, image: (p && p.image) || "", priceLabel: (p && p.priceLabel) || it.priceLabel || "", type: wardGarmentType(nm), qty: 0 };
    }
    map[key].qty += it.quantity || 1;
  }));
  return Object.values(map);
}

function renderSpaceWishlist() {
  const panel = document.getElementById("spaceWishlistPanel");
  if (!panel) return;
  const sess  = getSpaceSession() || {};
  const email = sess.email || "";

  const wishlistIds = getWishlist();
  const saved       = PRODUCTS.filter((p) => wishlistIds.has(String(p.id)));
  const purchased   = wardPurchasedPieces(sess);
  const favs        = spGet(email, SP_WARD_FAVS) || [];
  const looks       = spGet(email, SP_WARD_LOOKS) || [];
  const pairings    = spGet(email, SP_WARD_PAIRINGS) || [];
  const notes       = spGet(email, SP_WARD_NOTES) || [];
  const gallery     = spGet(email, SP_WARD_GALLERY) || [];

  const TABS = [
    { id: "pieces",   label: "Pieces" },
    { id: "looks",    label: "Styled Looks" },
    { id: "pairings", label: "Pairings" },
    { id: "notes",    label: "Notes" },
    { id: "gallery",  label: "Gallery" },
  ];
  const subnav = `<div class="ward-subnav" role="tablist">
    ${TABS.map((t) => `<button type="button" class="ward-subnav__btn${_wardTab === t.id ? " is-active" : ""}" data-ward-tab="${t.id}" role="tab" aria-selected="${_wardTab === t.id}">${t.label}</button>`).join("")}
  </div>`;

  const pieceCard = (p, isFav) => `
    <article class="ward-piece">
      <div class="ward-piece__img">${p.image ? `<img src="${p.image}" alt="" loading="lazy" />` : `<div class="ward-piece__ph"></div>`}
        <button type="button" class="ward-fav${isFav ? " is-fav" : ""}" data-ward-fav="${wardEsc(p.id)}" aria-label="${isFav ? "Remove favourite" : "Mark as favourite"}">♡</button>
      </div>
      <div class="ward-piece__body">
        <p class="ward-piece__name">${wardEsc(p.name)}</p>
        ${p.priceLabel ? `<p class="ward-piece__price">${wardEsc(p.priceLabel)}</p>` : ""}
      </div>
    </article>`;

  /* ── PIECES: favourites + purchased (grouped) + saved ─────────────── */
  function piecesView() {
    const favList = purchased.filter((p) => favs.includes(String(p.id)));
    const groupsOrder = ["Sarees", "Abayas", "Kurtis", "Accessories", "Collections"];
    const grouped = {};
    purchased.forEach((p) => { (grouped[p.type] = grouped[p.type] || []).push(p); });
    const favHtml = favList.length ? `
      <section class="ward-section">
        <p class="ward-section__label">Favourites</p>
        <p class="ward-section__sub">The pieces closest to your heart.</p>
        <div class="ward-grid">${favList.map((p) => pieceCard(p, true)).join("")}</div>
      </section>` : "";
    const purchasedHtml = purchased.length
      ? groupsOrder.filter((g) => grouped[g] && grouped[g].length).map((g) => `
        <section class="ward-section">
          <p class="ward-section__label">${g}</p>
          <div class="ward-grid">${grouped[g].map((p) => pieceCard(p, favs.includes(String(p.id)))).join("")}</div>
        </section>`).join("")
      : `<div class="ward-empty"><p>Your purchased pieces gather here — each one, a chapter of how you dress.</p><a class="secondary-button" href="#products">Explore the collection</a></div>`;
    const savedHtml = saved.length ? `
      <section class="ward-section">
        <p class="ward-section__label">Saved for Later</p>
        <p class="ward-section__sub">Pieces you love — held for when the moment is right.</p>
        <div class="ward-grid">${saved.map((p) => `
          <article class="ward-piece">
            <div class="ward-piece__img">${p.image ? `<img src="${p.image}" alt="" loading="lazy" />` : `<div class="ward-piece__ph"></div>`}
              <button type="button" class="ward-fav is-remove" data-remove-saved="${p.id}" aria-label="Remove ${wardEsc(p.name)}">×</button>
            </div>
            <div class="ward-piece__body"><p class="ward-piece__name">${wardEsc(p.name)}</p>${p.priceLabel ? `<p class="ward-piece__price">${wardEsc(p.priceLabel)}</p>` : ""}</div>
          </article>`).join("")}</div>
      </section>` : "";
    return favHtml + purchasedHtml + savedHtml;
  }

  /* ── STYLED LOOKS ─────────────────────────────────────────────────── */
  function looksView() {
    const grid = looks.length ? `<div class="ward-looks">${looks.map((l) => `
      <article class="ward-look">
        <div class="ward-look__img">${l.photo ? `<img src="${l.photo}" alt="" loading="lazy" />` : `<div class="ward-piece__ph"></div>`}
          <button type="button" class="ward-del" data-ward-del="looks:${l.id}" aria-label="Remove look">×</button>
          <span class="ward-look__tag">${wardEsc(l.occasion || "Moment")}</span>
        </div>
        ${l.note ? `<p class="ward-look__note">${wardEsc(l.note)}</p>` : ""}
      </article>`).join("")}</div>`
      : `<div class="ward-empty"><p>Capture how you wore it — the occasion, the feeling, the memory.</p></div>`;
    return `<section class="ward-section">
      <div class="ward-section__head"><div><p class="ward-section__label">Styled Looks</p><p class="ward-section__sub">Your outfit moments — weddings, temple visits, Eid, family.</p></div>
        <button type="button" class="ward-add-btn" data-ward-add="looks">＋ Add a look</button></div>
      <form class="ward-form" id="wardFormLooks" hidden>
        <select id="wardLookOccasion" class="ward-input">${WARD_OCCASIONS.map((o) => `<option value="${o}">${o}</option>`).join("")}</select>
        <input type="text" id="wardLookNote" class="ward-input" placeholder="A word about this look (optional)" maxlength="120" />
        <label class="ward-upload" for="wardLookPhoto">Add photo</label>
        <input type="file" id="wardLookPhoto" accept="image/*" hidden />
        <span class="ward-form__hint" id="wardLookHint">Choose a photo, then Save.</span>
        <button type="button" class="ward-save-btn" id="wardLookSave" disabled>Save look</button>
      </form>
      ${grid}</section>`;
  }

  /* ── OUTFIT PAIRINGS ──────────────────────────────────────────────── */
  function pairingsView() {
    const list = pairings.length ? `<div class="ward-pairings">${pairings.map((pr) => `
      <article class="ward-pairing">
        <button type="button" class="ward-del ward-del--inline" data-ward-del="pairings:${pr.id}" aria-label="Remove pairing">×</button>
        <p class="ward-pairing__combo">${wardEsc(pr.combo)}</p>
        ${pr.title ? `<p class="ward-pairing__title">${wardEsc(pr.title)}</p>` : ""}
        ${pr.note ? `<p class="ward-pairing__note">${wardEsc(pr.note)}</p>` : ""}
      </article>`).join("")}</div>`
      : `<div class="ward-empty"><p>Remember the combinations that felt just right — saree &amp; jewellery, abaya &amp; handbag.</p></div>`;
    return `<section class="ward-section">
      <div class="ward-section__head"><div><p class="ward-section__label">Outfit Pairings</p><p class="ward-section__sub">Combinations you’ll want to wear again.</p></div>
        <button type="button" class="ward-add-btn" data-ward-add="pairings">＋ Save a pairing</button></div>
      <form class="ward-form" id="wardFormPairings" hidden>
        <input type="text" id="wardPairCombo" class="ward-input" placeholder="e.g. Saree + Jewellery" maxlength="80" />
        <input type="text" id="wardPairTitle" class="ward-input" placeholder="Name it (optional)" maxlength="60" />
        <input type="text" id="wardPairNote" class="ward-input" placeholder="A note (optional)" maxlength="120" />
        <button type="button" class="ward-save-btn" id="wardPairSave">Save pairing</button>
      </form>
      ${list}</section>`;
  }

  /* ── WARDROBE NOTES ───────────────────────────────────────────────── */
  function notesView() {
    const list = notes.length ? `<div class="ward-notes">${notes.map((n) => `
      <article class="ward-note">
        <button type="button" class="ward-del ward-del--inline" data-ward-del="notes:${n.id}" aria-label="Remove note">×</button>
        <p class="ward-note__text">${wardEsc(n.text)}</p>
      </article>`).join("")}</div>`
      : `<div class="ward-empty"><p>Private little reminders — “bought for the wedding”, “needs matching jewellery”.</p></div>`;
    return `<section class="ward-section">
      <div class="ward-section__head"><div><p class="ward-section__label">Wardrobe Notes</p><p class="ward-section__sub">Quiet, private — only ever for you.</p></div>
        <button type="button" class="ward-add-btn" data-ward-add="notes">＋ Add a note</button></div>
      <form class="ward-form" id="wardFormNotes" hidden>
        <input type="text" id="wardNoteText" class="ward-input" placeholder="e.g. Favourite festive outfit" maxlength="160" />
        <button type="button" class="ward-save-btn" id="wardNoteSave">Save note</button>
      </form>
      ${list}</section>`;
  }

  /* ── MEMORY GALLERY (private) ─────────────────────────────────────── */
  function galleryView() {
    const grid = gallery.length ? `<div class="ward-gallery">${gallery.map((g) => `
      <figure class="ward-mem">
        ${g.photo ? `<img src="${g.photo}" alt="" loading="lazy" />` : `<div class="ward-piece__ph"></div>`}
        <button type="button" class="ward-del" data-ward-del="gallery:${g.id}" aria-label="Remove photo">×</button>
        <figcaption class="ward-mem__cap"><span class="ward-mem__type">${wardEsc(g.type || "Memory")}</span>${g.caption ? ` · ${wardEsc(g.caption)}` : ""}</figcaption>
      </figure>`).join("")}</div>`
      : `<div class="ward-empty"><p>Unboxings, styling, occasions — your private gallery of moments.</p></div>`;
    return `<section class="ward-section">
      <div class="ward-section__head"><div><p class="ward-section__label">Memory Gallery <span class="ward-private">🔒 Private</span></p><p class="ward-section__sub">Kept private by default — yours alone.</p></div>
        <button type="button" class="ward-add-btn" data-ward-add="gallery">＋ Add to gallery</button></div>
      <form class="ward-form" id="wardFormGallery" hidden>
        <select id="wardMemType" class="ward-input">${WARD_GALLERY_TYPES.map((t) => `<option value="${t}">${t}</option>`).join("")}</select>
        <input type="text" id="wardMemCaption" class="ward-input" placeholder="A caption (optional)" maxlength="120" />
        <label class="ward-upload" for="wardMemPhoto">Add photo</label>
        <input type="file" id="wardMemPhoto" accept="image/*" hidden />
        <span class="ward-form__hint" id="wardMemHint">Choose a photo, then Save.</span>
        <button type="button" class="ward-save-btn" id="wardMemSave" disabled>Save to gallery</button>
      </form>
      ${grid}</section>`;
  }

  const views = { pieces: piecesView, looks: looksView, pairings: pairingsView, notes: notesView, gallery: galleryView };
  panel.innerHTML = `
    <div class="ward-head">
      <p class="ward-head__kicker">A personal archive</p>
      <h3 class="ward-head__title">My Wardrobe</h3>
      <p class="ward-head__intro">Not a list of orders — a quiet record of how you dress, and the moments you dressed for.</p>
    </div>
    ${subnav}
    <div class="ward-body">${(views[_wardTab] || piecesView)()}</div>`;

  /* ── Wiring ──────────────────────────────────────────────────────── */
  panel.querySelectorAll("[data-ward-tab]").forEach((b) => b.addEventListener("click", () => { _wardTab = b.dataset.wardTab; renderSpaceWishlist(); }));
  panel.querySelectorAll("[data-remove-saved]").forEach((b) => b.addEventListener("click", () => {
    const wl = getWishlist(); wl.delete(b.dataset.removeSaved); saveWishlist(wl);
    renderSpaceWishlist(); updateSavedPiecesCount();
  }));
  panel.querySelectorAll("[data-ward-fav]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.wardFav; const cur = spGet(email, SP_WARD_FAVS) || [];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    spSet(email, SP_WARD_FAVS, next); renderSpaceWishlist();
    showToast(cur.includes(id) ? "Removed from favourites" : "Added to favourites 💛");
  }));
  panel.querySelectorAll("[data-ward-add]").forEach((b) => b.addEventListener("click", () => {
    const f = document.getElementById("wardForm" + b.dataset.wardAdd.charAt(0).toUpperCase() + b.dataset.wardAdd.slice(1));
    if (f) f.hidden = !f.hidden;
  }));
  panel.querySelectorAll("[data-ward-del]").forEach((b) => b.addEventListener("click", () => {
    const [kind, id] = b.dataset.wardDel.split(":");
    const map = { looks: SP_WARD_LOOKS, pairings: SP_WARD_PAIRINGS, notes: SP_WARD_NOTES, gallery: SP_WARD_GALLERY };
    const key = map[kind]; if (!key) return;
    spSet(email, key, (spGet(email, key) || []).filter((x) => x.id !== id));
    renderSpaceWishlist(); showToast("Removed");
  }));

  /* Styled look — photo + save */
  let _lookPhoto = null;
  const lookFile = document.getElementById("wardLookPhoto");
  lookFile && lookFile.addEventListener("change", (e) => {
    const file = e.target.files[0]; if (!file) return;
    document.getElementById("wardLookHint").textContent = "Preparing…";
    wardCompressImage(file, (data) => { _lookPhoto = data; const h = document.getElementById("wardLookHint"); const s = document.getElementById("wardLookSave"); if (h) h.textContent = data ? "Photo ready 💛" : "Couldn’t read that image."; if (s) s.disabled = !data; });
  });
  document.getElementById("wardLookSave")?.addEventListener("click", () => {
    if (!_lookPhoto) return;
    const list = (spGet(email, SP_WARD_LOOKS) || []);
    list.unshift({ id: wardUid(), photo: _lookPhoto, occasion: document.getElementById("wardLookOccasion").value, note: document.getElementById("wardLookNote").value.trim(), createdAt: new Date().toISOString() });
    spSet(email, SP_WARD_LOOKS, list.slice(0, 30)); renderSpaceWishlist(); showToast("Look saved 💛");
  });

  /* Pairing — save */
  document.getElementById("wardPairSave")?.addEventListener("click", () => {
    const combo = document.getElementById("wardPairCombo").value.trim();
    if (!combo) { showToast("Add a combination first"); return; }
    const list = (spGet(email, SP_WARD_PAIRINGS) || []);
    list.unshift({ id: wardUid(), combo, title: document.getElementById("wardPairTitle").value.trim(), note: document.getElementById("wardPairNote").value.trim(), createdAt: new Date().toISOString() });
    spSet(email, SP_WARD_PAIRINGS, list.slice(0, 50)); renderSpaceWishlist(); showToast("Pairing saved 💛");
  });

  /* Note — save */
  document.getElementById("wardNoteSave")?.addEventListener("click", () => {
    const text = document.getElementById("wardNoteText").value.trim();
    if (!text) { showToast("Write a note first"); return; }
    const list = (spGet(email, SP_WARD_NOTES) || []);
    list.unshift({ id: wardUid(), text, createdAt: new Date().toISOString() });
    spSet(email, SP_WARD_NOTES, list.slice(0, 60)); renderSpaceWishlist(); showToast("Note saved 💛");
  });

  /* Gallery — photo + save */
  let _memPhoto = null;
  const memFile = document.getElementById("wardMemPhoto");
  memFile && memFile.addEventListener("change", (e) => {
    const file = e.target.files[0]; if (!file) return;
    document.getElementById("wardMemHint").textContent = "Preparing…";
    wardCompressImage(file, (data) => { _memPhoto = data; const h = document.getElementById("wardMemHint"); const s = document.getElementById("wardMemSave"); if (h) h.textContent = data ? "Photo ready 💛" : "Couldn’t read that image."; if (s) s.disabled = !data; });
  });
  document.getElementById("wardMemSave")?.addEventListener("click", () => {
    if (!_memPhoto) return;
    const list = (spGet(email, SP_WARD_GALLERY) || []);
    list.unshift({ id: wardUid(), photo: _memPhoto, type: document.getElementById("wardMemType").value, caption: document.getElementById("wardMemCaption").value.trim(), createdAt: new Date().toISOString() });
    spSet(email, SP_WARD_GALLERY, list.slice(0, 24)); renderSpaceWishlist(); showToast("Saved to your gallery 💛");
  });

  safeCreateIcons();
}

/* ════════════════════════════════════════════════════════════════════
   SHARE & EARN — Circle Points referral & advocacy (additive).
   Rewards advocacy with Circle Points only (never money/commission). Awards
   land ONLY after a referred order is delivered. Anti-abuse: no self / same
   device / same email / same phone.
   ════════════════════════════════════════════════════════════════════ */
const SHARE_EARN_KEY  = "abdan-studio-shareearn";  /* admin-configurable rules */
const REFERRALS_KEY   = "abdan-referrals";         /* referral records (global) */
const PENDING_REF_KEY = "abdan-pending-ref";       /* captured inbound ref (device) */
const DEVICE_ID_KEY   = "abdan-device-id";
const SP_SHARE_COUNTS = "abdan-sp-shares";

function getDeviceId() {
  let id = null; try { id = localStorage.getItem(DEVICE_ID_KEY); } catch {}
  if (!id) { id = "dev" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); try { localStorage.setItem(DEVICE_ID_KEY, id); } catch {} }
  return id;
}
function getShareEarnSettings() {
  let s = {}; try { s = JSON.parse(localStorage.getItem(SHARE_EARN_KEY) || "{}") || {}; } catch {}
  return Object.assign({ enabled: true, linksActive: true, base: 100, tier5000: 250, tier10000: 500, bonusMultiplier: 1, seasonalMultiplier: 1, validityDays: 60, maxPerMember: 50, campaignName: "" }, s);
}
function genReferralCode(email) {
  const e = String(email || "").toLowerCase();
  let h = 0; for (let i = 0; i < e.length; i++) h = (h * 31 + e.charCodeAt(i)) >>> 0;
  const base = (e.split("@")[0].replace(/[^a-z0-9]/g, "").slice(0, 6).toUpperCase()) || "ABDAN";
  return base + (h % 1000).toString().padStart(3, "0");
}
function getReferrals()      { try { return JSON.parse(localStorage.getItem(REFERRALS_KEY) || "[]"); } catch { return []; } }
function saveReferrals(list) { try { localStorage.setItem(REFERRALS_KEY, JSON.stringify(list)); } catch {} }
function referrerEmailForCode(code) {
  const profiles = getSpaceProfiles(); const target = String(code || "").toUpperCase();
  for (const email of Object.keys(profiles)) if (genReferralCode(email) === target) return email;
  return "";
}
function buildReferralLink(code, type, id) {
  let q = "?ref=" + encodeURIComponent(code);
  if (type) q += "&t=" + encodeURIComponent(type);
  if (id)   q += "&i=" + encodeURIComponent(id);
  return "https://abdan.pages.dev/" + q;
}
function captureReferralFromUrl() {
  let code = null; try { code = new URLSearchParams(location.search).get("ref"); } catch {}
  if (!code) return;
  code = code.toUpperCase();
  const seSettings = getShareEarnSettings();
  if (!seSettings.enabled || seSettings.linksActive === false) return;  /* paused / links deactivated */
  const referrerEmail = referrerEmailForCode(code);
  if (!referrerEmail) return;
  const sess = getSpaceSession();
  if (sess && sess.email && genReferralCode(sess.email) === code) return; /* self */
  const deviceId = getDeviceId();
  try { localStorage.setItem(PENDING_REF_KEY, JSON.stringify({ code, referrerEmail, deviceId, at: Date.now() })); } catch {}
  const list = getReferrals();
  if (!list.find((r) => r.code === code && r.referredDeviceId === deviceId)) {
    list.unshift({ id: "ref" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), code, referrerEmail, referredDeviceId: deviceId, referredEmail: "", referredPhone: "", status: "invited", ordered: false, createdAt: new Date().toISOString(), points: 0, rewardedOrderRef: "" });
    saveReferrals(list);
  }
}
function attributeReferral(email, phone) {
  let pending = null; try { pending = JSON.parse(localStorage.getItem(PENDING_REF_KEY) || "null"); } catch {}
  if (!pending) return;
  const settings = getShareEarnSettings();
  if (settings.validityDays && pending.at && (Date.now() - pending.at) > settings.validityDays * 864e5) return;
  const em = String(email || "").toLowerCase(); const ph = String(phone || "").replace(/\D/g, "");
  if (em && em === pending.referrerEmail) return;                          /* self email */
  const profiles = getSpaceProfiles();
  const referrerPhone = String((profiles[pending.referrerEmail] || {}).phone || "").replace(/\D/g, "");
  if (ph && referrerPhone && ph === referrerPhone) return;                  /* self phone */
  const list = getReferrals();
  if (em && list.some((r) => String(r.referredEmail || "").toLowerCase() === em && r.code !== pending.code)) return; /* email already referred */
  if (settings.maxPerMember && list.filter((r) => r.code === pending.code && r.referredEmail).length >= settings.maxPerMember) return;
  const rec = list.find((r) => r.code === pending.code && r.referredDeviceId === pending.deviceId);
  if (rec) {
    if (!rec.referredEmail) rec.referredEmail = em;
    if (!rec.referredPhone) rec.referredPhone = ph;
    if (rec.status === "invited") rec.status = "joined";
    saveReferrals(list);
  }
}
function reconcileReferralRewards() {
  let orders = []; try { orders = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]"); } catch {}
  if (!orders.length) return;
  const settings = getShareEarnSettings();
  const list = getReferrals(); let changed = false;
  list.forEach((r) => {
    if (r.status === "rewarded") return;
    const em = String(r.referredEmail || "").toLowerCase(); const ph = String(r.referredPhone || "").replace(/\D/g, "");
    if (!em && !ph) return;
    const ord = orders.find((o) => o.status === "delivered" && (
      (em && String(o.customerEmail || "").toLowerCase() === em) ||
      (ph && String(o.customerPhone || "").replace(/\D/g, "") === ph)
    ));
    if (!ord) { if (r.status === "invited" && (em || ph)) { r.status = "joined"; changed = true; } return; }
    const total = Number(ord.total) || 0;
    let pts = total >= 10000 ? settings.tier10000 : total >= 5000 ? settings.tier5000 : settings.base;
    pts = Math.round(pts * (settings.bonusMultiplier || 1) * (settings.seasonalMultiplier || 1));
    if (typeof spAddLoyalty === "function") spAddLoyalty(r.referrerEmail, pts);
    pushShareNotify(r.referrerEmail, pts);
    r.status = "rewarded"; r.ordered = true; r.points = pts; r.rewardedOrderRef = ord.ref || ord.id || "";
    changed = true;
  });
  if (changed) saveReferrals(list);
}
/* Emotional award notification — "Someone discovered ABDAN through you." */
function pushShareNotify(email, points) {
  try {
    const n = JSON.parse(localStorage.getItem("abdan-se-notify") || "[]");
    n.push({ email: String(email || "").toLowerCase(), points, at: Date.now() });
    localStorage.setItem("abdan-se-notify", JSON.stringify(n));
  } catch {}
}
function flushShareNotifications(email) {
  const em = String(email || "").toLowerCase(); if (!em) return;
  let n = []; try { n = JSON.parse(localStorage.getItem("abdan-se-notify") || "[]"); } catch { return; }
  const mine = n.filter((x) => x.email === em);
  if (!mine.length) return;
  const total = mine.reduce((s, x) => s + (x.points || 0), 0);
  try { localStorage.setItem("abdan-se-notify", JSON.stringify(n.filter((x) => x.email !== em))); } catch {}
  setTimeout(() => showToast(`Someone discovered ABDAN through you. ${total} Circle Points added 💛`, 4200), 600);
}
function getMyReferrals(email) {
  const code = genReferralCode(email);
  const list = getReferrals().filter((r) => r.code === code);
  return {
    code, list,
    invited:    list.length,
    successful: list.filter((r) => r.status === "rewarded" || r.ordered).length,
    points:     list.filter((r) => r.status === "rewarded").reduce((s, r) => s + (r.points || 0), 0),
  };
}
function wardShareCount(email, label) {
  const m = spGet(email, SP_SHARE_COUNTS) || {};
  m[label] = (m[label] || 0) + 1; spSet(email, SP_SHARE_COUNTS, m);
}

let _shareTarget = { type: "Products", label: "ABDAN" };
const SHARE_TARGETS = ["Products", "Collections", "Curated Collections", "Lookbooks", "Stories From Her World", "Occasion Boards", "Community Content"];
/* Channel brand glyphs (simple-icons single paths) — logos, not labels. */
const SE_CHANNELS = [
  { id: "whatsapp", label: "WhatsApp", color: "#25D366", svg: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24.044 12.045.044 5.463.044.104 5.403.101 11.986c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.943 11.943 0 005.71 1.448h.005c6.585 0 11.946-5.36 11.949-11.945a11.89 11.89 0 00-3.479-8.402z"/>' },
  { id: "facebook", label: "Facebook", color: "#1877F2", svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' },
  { id: "instagram", label: "Instagram", color: "#E4405F", svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324M12 16a4 4 0 110-8 4 4 0 010 8m6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881"/>' },
  { id: "telegram", label: "Telegram", color: "#26A5E4", svg: '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0m4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635"/>' },
  { id: "x", label: "X", color: "#0f0f0f", svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
  { id: "email", label: "Email", color: "var(--emerald,#023d3a)", svg: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/>' },
  { id: "copy", label: "Copy link", color: "var(--emerald,#023d3a)", svg: '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>' },
];
const SE_NATIVE_SVG = '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>';
function renderShareEarn() {
  const panel = document.getElementById("spaceShareEarnPanel");
  if (!panel) return;
  reconcileReferralRewards();
  const sess  = getSpaceSession() || {};
  const email = sess.email || "";
  const first = (sess.displayName || sess.fullName || "").split(" ")[0] || "you";
  flushShareNotifications(email);
  const code  = genReferralCode(email);
  const settings = getShareEarnSettings();
  const my   = getMyReferrals(email);
  const link = buildReferralLink(code, _shareTarget.type, "");
  const shares = spGet(email, SP_SHARE_COUNTS) || {};
  const totalShares = Object.values(shares).reduce((s, n) => s + n, 0);
  const topShared = Object.entries(shares).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const mostLoved = topShared.length ? topShared[0][0] : "—";

  const history = my.list.length ? my.list.slice(0, 12).map((r) => {
    const line = r.status === "rewarded" ? "discovered ABDAN through you" : r.ordered ? "is exploring ABDAN" : r.status === "joined" ? "joined the Circle through you" : "was invited by you";
    return `<div class="se-hist">
      <div><p class="se-hist__who">${wardEsc(r.referredEmail || "A friend")}</p>
      <p class="se-hist__when">${line} · ${new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
      ${r.points ? `<span class="se-hist__pts">+${r.points} 💛</span>` : `<span class="se-hist__status se-hist__status--${r.status}">${r.status === "rewarded" ? "Inspired" : r.ordered ? "Exploring" : "Invited"}</span>`}
    </div>`; }).join("") : `<p class="se-empty">No one yet — your first share begins a quiet, lovely ripple.</p>`;

  panel.innerHTML = `
    <div class="se-head">
      <p class="se-head__kicker">An invitation, not an advertisement</p>
      <h3 class="se-head__title">Share the Love 💛</h3>
      <p class="se-head__intro">Some pieces are too beautiful to keep to yourself. Share ABDAN with the women you love — and when their first order arrives, Circle Points quietly find their way to you. Never cash, only belonging.</p>
    </div>

    <section class="se-card se-card--invite">
      <p class="se-card__label">Your personal invitation</p>
      <div class="se-link"><span class="se-link__url" id="seLink">${link}</span></div>
      <p class="se-card__hint">Choose what you’re sharing</p>
      <div class="se-targets" role="tablist">
        ${SHARE_TARGETS.map((t) => `<button type="button" class="se-target${_shareTarget.type === t ? " is-active" : ""}" data-se-target="${t}">${t}</button>`).join("")}
      </div>
      <div class="se-channels">
        ${SE_CHANNELS.map((c) => `<button type="button" class="se-chan" data-se-chan="${c.id}" title="${c.label}" aria-label="Share via ${c.label}"><svg viewBox="0 0 24 24" fill="${c.color}" aria-hidden="true">${c.svg}</svg></button>`).join("")}
        ${navigator.share ? `<button type="button" class="se-chan" data-se-chan="native" title="Share" aria-label="Share"><svg viewBox="0 0 24 24" fill="var(--emerald,#023d3a)" aria-hidden="true">${SE_NATIVE_SVG}</svg></button>` : ""}
      </div>
      <p class="se-code">Your code · <strong>${code}</strong></p>
    </section>

    <p class="se-section-label">My Impact</p>
    <div class="se-impact">
      <div class="se-stat"><span class="se-stat__v">${my.invited}</span><span class="se-stat__l">Friends Invited</span></div>
      <div class="se-stat"><span class="se-stat__v">${my.successful}</span><span class="se-stat__l">People Inspired</span></div>
      <div class="se-stat se-stat--gold"><span class="se-stat__v">${my.points}</span><span class="se-stat__l">Circle Points Earned</span></div>
      <div class="se-stat"><span class="se-stat__v">${totalShares}</span><span class="se-stat__l">Collections Shared</span></div>
    </div>

    ${settings.campaignName ? `<p class="se-campaign">✦ ${wardEsc(settings.campaignName)}</p>` : ""}

    <div class="se-reward-note">
      <p>A purchase completed — <strong>${settings.base} Circle Points</strong> · ₹5,000+ — <strong>${settings.tier5000}</strong> · ₹10,000+ — <strong>${settings.tier10000}</strong></p>
      <p class="se-reward-note__fine">Circle Points arrive only after your friend’s order is delivered — never before.</p>
    </div>

    ${topShared.length ? `<p class="se-section-label">Most Loved Shares</p>
    <div class="se-top">${topShared.map(([l, n]) => `<div class="se-top__row"><span>${wardEsc(l)}</span><span>${n} share${n !== 1 ? "s" : ""}</span></div>`).join("")}</div>` : ""}

    <p class="se-section-label">Your ABDAN Discoveries</p>
    <div class="se-history">${history}</div>`;

  /* Wiring */
  panel.querySelectorAll("[data-se-target]").forEach((b) => b.addEventListener("click", () => {
    _shareTarget = { type: b.dataset.seTarget, label: b.dataset.seTarget };
    renderShareEarn();
  }));
  const descriptor = "Personally curated by ABDAN — thoughtfully made modest fashion.";
  const shareText = `${first === "you" ? "I" : first} thought of you 💛 ${descriptor} Begin here: ${link}`;
  const eLink = encodeURIComponent(link), eText = encodeURIComponent(shareText), eDesc = encodeURIComponent(descriptor);
  const channels = {
    whatsapp: () => window.open(`https://wa.me/?text=${eText}`, "_blank", "noopener,noreferrer"),
    facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${eLink}&quote=${eDesc}`, "_blank", "noopener,noreferrer"),
    telegram: () => window.open(`https://t.me/share/url?url=${eLink}&text=${eDesc}`, "_blank", "noopener,noreferrer"),
    x:        () => window.open(`https://twitter.com/intent/tweet?text=${eDesc}&url=${eLink}`, "_blank", "noopener,noreferrer"),
    email:    () => window.open(`mailto:?subject=${encodeURIComponent("I thought you'd love ABDAN 💛")}&body=${eText}`, "_blank", "noopener,noreferrer"),
    instagram:() => { try { navigator.clipboard.writeText(link); } catch {} showToast("Link copied — paste it into your Instagram story or DM 💛"); },
    copy:     () => { try { navigator.clipboard.writeText(link); } catch {} showToast("Invitation link copied 💛"); },
    native:   () => { try { navigator.share({ title: "ABDAN", text: shareText, url: link }); } catch {} },
  };
  panel.querySelectorAll("[data-se-chan]").forEach((b) => b.addEventListener("click", () => {
    const ch = b.dataset.seChan;
    wardShareCount(email, _shareTarget.type);
    (channels[ch] || channels.copy)();
    renderShareEarn();
  }));
}

/* ════════════════════════════════════════════════════════════════════
   MY JOURNEY ✨ — a personal milestone timeline (additive).
   Milestones are derived from existing data (orders, loyalty, wardrobe,
   referrals, concierge) — no gamification, no XP, no streaks, no ranking.
   ════════════════════════════════════════════════════════════════════ */
const DEFAULT_MILESTONES = [
  { id: "welcome",        category: "First Steps",            title: "Welcome to ABDAN",            description: "Your story with ABDAN begins.",                       metric: "profile",          threshold: 1,  points: 10,  active: true },
  { id: "created-space",  category: "First Steps",            title: "Created Your Space",          description: "A private home for all that you love.",               metric: "profile",          threshold: 1,  points: 10,  active: true },
  { id: "first-save",     category: "Shopping Journey",       title: "First Collection Saved",      description: "The first piece that caught your heart.",             metric: "wishlist",         threshold: 1,  points: 15,  active: true },
  { id: "first-purchase", category: "Shopping Journey",       title: "First Purchase",              description: "Your first ABDAN piece, chosen with care.",           metric: "orders",           threshold: 1,  points: 50,  active: true },
  { id: "festival",       category: "Shopping Journey",       title: "Festival Collection",         description: "A piece for the season of light.",                    metric: "festival",         threshold: 1,  points: 30,  active: true },
  { id: "five-orders",    category: "Shopping Journey",       title: "5 Orders Completed",          description: "A wardrobe quietly growing.",                         metric: "orders",           threshold: 5,  points: 100, active: true },
  { id: "trusted-patron", category: "Shopping Journey",       title: "Trusted Patron",              description: "A cherished member of the ABDAN family.",             metric: "orders",           threshold: 10, points: 200, active: true },
  { id: "first-look",     category: "Style Journey",          title: "First Styled Look",           description: "You shared how you wear it.",                         metric: "looks",            threshold: 1,  points: 20,  active: true },
  { id: "wardrobe-builder",category: "Style Journey",         title: "Wardrobe Builder",            description: "Your archive is quietly taking shape.",               metric: "purchased",        threshold: 3,  points: 40,  active: true },
  { id: "style-curator",  category: "Style Journey",          title: "Style Curator",               description: "Pairings made with an eye for grace.",                metric: "pairings",         threshold: 1,  points: 25,  active: true },
  { id: "collection-creator",category: "Style Journey",       title: "Collection Creator",          description: "Lookbooks composed with love.",                       metric: "lookbooks",        threshold: 1,  points: 25,  active: true },
  { id: "memory-keeper",  category: "Style Journey",          title: "Memory Keeper",               description: "Moments kept, privately treasured.",                  metric: "gallery",          threshold: 1,  points: 25,  active: true },
  { id: "first-concierge",category: "Community Journey",      title: "First Concierge Conversation",description: "You reached out, and ABDAN listened.",                metric: "concierge",        threshold: 1,  points: 20,  active: true },
  { id: "first-friend",   category: "Share the Love Journey", title: "First Friend Invited",        description: "You opened the door for someone you love.",           metric: "referralsInvited", threshold: 1,  points: 20,  active: true },
  { id: "people-inspired",category: "Share the Love Journey", title: "People Inspired",             description: "Someone discovered ABDAN through you.",               metric: "peopleInspired",   threshold: 1,  points: 50,  active: true },
  { id: "circle-ambassador",category: "Share the Love Journey",title: "Circle Ambassador",          description: "Your warmth brings the Circle together.",             metric: "peopleInspired",   threshold: 3,  points: 150, active: true },
  { id: "circle-member",  category: "Inner Circle Journey",   title: "Circle Member",               description: "Welcome to the Circle.",                              metric: "loyaltyPts",       threshold: 1,  points: 0,   active: true },
  { id: "inner-circle",   category: "Inner Circle Journey",   title: "Inner Circle",                description: "Among ABDAN's most devoted.",                         metric: "loyaltyPts",       threshold: 150,points: 0,   active: true },
  { id: "patron",         category: "Inner Circle Journey",   title: "Patron",                      description: "A patron of the house.",                              metric: "loyaltyPts",       threshold: 300,points: 0,   active: true },
  { id: "founders-circle",category: "Inner Circle Journey",   title: "Founder's Circle",            description: "Forever part of ABDAN's beginning.",                  metric: "loyaltyPts",       threshold: 500,points: 0,   active: true },
];
const JOURNEY_METRIC_UNITS = {
  wishlist: "saved piece", orders: "purchase", looks: "styled look", pairings: "pairing",
  gallery: "memory", lookbooks: "lookbook", purchased: "piece", concierge: "conversation",
  referralsInvited: "invitation", peopleInspired: "friend inspired", loyaltyPts: "Circle Point",
};
const JOURNEY_COUNTABLE = Object.keys(JOURNEY_METRIC_UNITS);
function getEffectiveMilestones() {
  try { const s = JSON.parse(localStorage.getItem("abdan-studio-journey") || "null"); if (Array.isArray(s) && s.length) return s; } catch {}
  return DEFAULT_MILESTONES;
}
function journeyStats(profile) {
  const email = String(profile && profile.email || "").toLowerCase();
  let orders = []; try { orders = JSON.parse(localStorage.getItem("abdan-studio-orders") || "[]"); } catch {}
  const prof = ((typeof getSpaceProfiles === "function" ? getSpaceProfiles() : {})[email]) || {};
  const phones = [profile && profile.phone, prof.phone].map((p) => String(p || "").replace(/\D/g, "")).filter(Boolean);
  const mine = orders.filter((o) => {
    const op = String(o.customerPhone || "").replace(/\D/g, ""); const oe = String(o.customerEmail || "").toLowerCase();
    return (op && phones.includes(op)) || (email && oe === email);
  });
  const ref = (typeof getMyReferrals === "function") ? getMyReferrals(email) : { invited: 0, successful: 0 };
  return {
    profile:          email ? 1 : 0,
    wishlist:         (typeof getWishlist === "function") ? getWishlist().size : 0,
    orders:           mine.length,
    festival:         mine.some((o) => (o.items || []).some((it) => /festiv/i.test(it.name || ""))) ? 1 : 0,
    looks:            (spGet(email, SP_WARD_LOOKS) || []).length,
    pairings:         (spGet(email, SP_WARD_PAIRINGS) || []).length,
    gallery:          (spGet(email, SP_WARD_GALLERY) || []).length,
    lookbooks:        (typeof spGetLookbook === "function" ? spGetLookbook(email) : []).length,
    purchased:        (typeof wardPurchasedPieces === "function") ? wardPurchasedPieces(profile).length : 0,
    concierge:        (typeof spGetConcierge === "function" ? spGetConcierge(email) : []).length,
    referralsInvited: ref.invited || 0,
    peopleInspired:   ref.successful || 0,
    loyaltyPts:       (typeof spGetLoyalty === "function") ? spGetLoyalty(email) : 0,
  };
}
function evaluateJourney(profile) {
  const email = String(profile && profile.email || "").toLowerCase();
  const stats = journeyStats(profile);
  const ms = getEffectiveMilestones().filter((m) => m.active !== false);
  const dates = spGet(email, "abdan-sp-journey") || {};
  let dirty = false; const unlocked = [], locked = [];
  ms.forEach((m) => {
    const val = Number(stats[m.metric] || 0);
    if (val >= Number(m.threshold || 1)) {
      if (!dates[m.id]) { dates[m.id] = new Date().toISOString(); dirty = true; }
      unlocked.push({ ...m, date: dates[m.id] });
    } else {
      locked.push({ ...m, current: val, remaining: Math.max(0, Number(m.threshold || 1) - val) });
    }
  });
  if (dirty) spSet(email, "abdan-sp-journey", dates);
  unlocked.sort((a, b) => new Date(a.date) - new Date(b.date));
  const next = locked
    .filter((m) => m.remaining > 0 && JOURNEY_COUNTABLE.includes(m.metric))
    .sort((a, b) => a.remaining - b.remaining)[0] || null;
  return { stats, unlocked, locked, next, total: ms.length };
}
function renderMyJourney() {
  const panel = document.getElementById("spaceMyJourneyPanel");
  if (!panel) return;
  const sess = getSpaceSession() || {};
  const j = evaluateJourney(sess);
  const fmtD = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const nextCard = j.next ? (() => {
    const unit = JOURNEY_METRIC_UNITS[j.next.metric] || "step";
    const n = j.next.remaining;
    const plural = n === 1 ? unit : (unit.endsWith("inspired") ? "friends inspired" : unit + "s");
    return `<section class="jr-next">
      <p class="jr-next__label">Your next milestone</p>
      <p class="jr-next__title">${j.next.title}</p>
      <p class="jr-next__desc">${j.next.description}</p>
      <p class="jr-next__progress">${n} more ${plural} to unlock — gently, in your own time 💛</p>
    </section>`;
  })() : "";

  const timeline = j.unlocked.length ? `<div class="jr-timeline">${j.unlocked.map((m) => `
    <article class="jr-node">
      <span class="jr-node__dot" aria-hidden="true"></span>
      <div class="jr-node__card">
        <p class="jr-node__cat">${m.category}</p>
        <h4 class="jr-node__title">${m.title}</h4>
        <p class="jr-node__desc">${m.description}</p>
        <p class="jr-node__date">${fmtD(m.date)}</p>
      </div>
    </article>`).join("")}</div>`
    : `<div class="jr-empty"><p>Your journey is just beginning. Each quiet step with ABDAN will gather here.</p></div>`;

  const lockedLater = j.locked.filter((m) => !j.next || m.id !== j.next.id);
  const future = lockedLater.length ? `<p class="jr-section-label">Still to come</p>
    <div class="jr-future">${lockedLater.map((m) => `
      <div class="jr-future__item"><span class="jr-future__title">${m.title}</span><span class="jr-future__cat">${m.category}</span></div>`).join("")}</div>` : "";

  panel.innerHTML = `
    <div class="jr-head">
      <p class="jr-head__kicker">Your story with ABDAN</p>
      <h3 class="jr-head__title">My Journey ✨</h3>
      <p class="jr-head__intro">Not a game, not a score — simply the quiet milestones of your time with ABDAN, gathered with care.</p>
      <p class="jr-head__count">${j.unlocked.length} of ${j.total} milestones reached</p>
    </div>
    ${nextCard}
    <p class="jr-section-label">Your milestones</p>
    ${timeline}
    ${future}`;
}

/* D-03 — Profile quote: add to renderSpaceProfile override */
(function patchProfileQuote() {
  const origRenderProfile = window.renderSpaceProfile || function(){};
  /* We patch renderSpaceProfile in showSpaceDashboard context — use the
     existing function and append the quote field after it renders. */
  const _orig = window.renderSpaceProfile;
  if (typeof _orig !== "function") return;
  window.renderSpaceProfile = function(email) {
    _orig(email);
    /* Inject quote field after bio section if not already present */
    const panel = document.getElementById("spaceProfilePanel");
    if (!panel || panel.querySelector("#spQuoteField")) return;
    const quote = spGet(email, SP_QUOTE_KEY) || "";
    /* Find the save button area and insert before it */
    const editToggle = panel.querySelector("#spaceEditToggle");
    if (!editToggle) return;
    const quoteDiv = document.createElement("div");
    quoteDiv.className = "sp-quote-field";
    quoteDiv.id = "spQuoteField";
    quoteDiv.innerHTML = `
      <p class="sp-section-kicker" style="margin-bottom:.4rem">Personal Quote</p>
      <p style="font-size:.72rem;color:var(--muted);margin-bottom:.6rem">A phrase that feels like you.</p>
      <input type="text" id="spQuoteInput" value="${(quote).replace(/"/g,"&quot;")}"
             placeholder="Grace lives in the details."
             maxlength="80"
             style="width:100%;padding:.65rem .9rem;background:rgba(2,61,58,.03);border:1px solid var(--line);border-radius:.5rem;font-family:var(--font-display,'Libre Baskerville',serif);font-size:.92rem;font-style:italic;color:var(--text);box-sizing:border-box" />
      <button type="button" id="spQuoteSave" class="secondary-button" style="margin-top:.5rem;font-size:.78rem;padding:.4rem 1rem">Save Quote</button>`;
    editToggle.parentNode?.insertBefore(quoteDiv, editToggle);
    panel.querySelector("#spQuoteSave")?.addEventListener("click",()=>{
      const val = panel.querySelector("#spQuoteInput")?.value.trim()||"";
      spSet(email, SP_QUOTE_KEY, val);
      showToast("Quote saved. 💛");
    });

    /* RC-4: Secondary navigation hub — destinations not in the primary
       floating nav are reached here (the 12-tab strip is hidden on mobile). */
    if (!panel.querySelector("#spSecondaryNav")) {
      const secItems = [
        { tab:"saved",        icon:"♡", label:"My Wardrobe" },
        { tab:"journey",      icon:"✦", label:"Orders" },
        { tab:"lookbook",     icon:"◻", label:"Lookbooks" },
        { tab:"savedmoments", icon:"◈", label:"Saved Moments" },
        { tab:"concierge",    icon:"✉", label:"Ask ABDAN" },
        { tab:"journal",      icon:"◇", label:"Journal" },
        { tab:"membership",   icon:"♛", label:"Membership" },
        { tab:"settings",     icon:"⚙", label:"Settings" },
      ];
      const nav = document.createElement("div");
      nav.id = "spSecondaryNav";
      nav.className = "sp-secondary-nav";
      nav.innerHTML = `
        <p class="sp-section-kicker" style="margin-bottom:.6rem">More in Your Space</p>
        <div class="sp-secondary-grid">
          ${secItems.map(i=>`
            <button type="button" class="sp-secondary-item" onclick="showSpaceTab('${i.tab}')">
              <span class="sp-secondary-item__icon">${i.icon}</span>
              <span class="sp-secondary-item__label">${i.label}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
            </button>`).join("")}
        </div>`;
      panel.firstElementChild
        ? panel.insertBefore(nav, panel.firstElementChild)
        : panel.appendChild(nav);
    }

    /* Move Pause My Space / Sign Out into Profile (relocated from the header) */
    if (!panel.querySelector("#spProfileSignout")) {
      const so = document.createElement("div");
      so.id = "spProfileSignout";
      so.className = "sp-profile-signout";
      so.innerHTML = `
        <button type="button" class="secondary-button" id="spProfilePause">Pause My Space</button>
        <button type="button" class="sp-signout-text" id="spProfileOut">Sign Out</button>`;
      panel.appendChild(so);
      so.querySelector("#spProfilePause")?.addEventListener("click", () => {
        if (typeof handleSpaceSignout === "function") handleSpaceSignout();
      });
      so.querySelector("#spProfileOut")?.addEventListener("click", () => {
        if (typeof handleHardSignout === "function") handleHardSignout();
      });
    }
  };
})();

/* D-04 — Recommended Collections in overview */
(function patchOverviewCollections() {
  const COLLECTIONS = [
    { label:"Festive Glow",   filter:"Festive",       desc:"Pieces for the days that glow.",      icon:"✦" },
    { label:"Everyday Grace", filter:"Everyday Grace",desc:"Worn with intention, every day.",      icon:"◇" },
    { label:"Soft Minimal",   filter:"Soft Statement",desc:"Quiet pieces that speak volumes.",     icon:"◈" },
    { label:"Wedding Season", filter:"Festive",       desc:"For your most cherished moments.",     icon:"♡" },
  ];

  const _orig = window.renderSpaceOverview;
  if (typeof _orig !== "function") return;
  window.renderSpaceOverview = function(profile) {
    _orig(profile);
    /* Inject Recommended Collections after the Reserved For You section */
    const panel = document.getElementById("spaceOverviewPanel");
    if (!panel) return;
    const browseCta = panel.querySelector(".space-browse-cta");
    if (!browseCta || panel.querySelector("#spRecCollections")) return;
    const identity = spGet(profile.email||"", SP_STYLE_KEY)||"";
    const mood     = getAffinityMood()||"";
    /* Filter collections relevant to this customer */
    const relevant = COLLECTIONS.filter(c=>
      !identity || c.label.toLowerCase().includes(identity.toLowerCase().split(" ")[0]) ||
      c.filter.toLowerCase().includes(mood.toLowerCase()) || true
    ).slice(0,3);
    const colHtml = relevant.map(c=>`
      <button type="button" class="sp-rec-col" onclick="state.filter='${c.filter}';renderFilters?.();renderProducts?.();exitYourSpaceRoute?.();scrollToSection?.('products')">
        <span class="sp-rec-col__icon">${c.icon}</span>
        <span class="sp-rec-col__title">${c.label}</span>
        <span class="sp-rec-col__desc">${c.desc}</span>
      </button>`).join("");
    const div = document.createElement("div");
    div.id = "spRecCollections";
    div.className = "sp-recently";
    div.innerHTML = `<p class="sp-recently__kicker">Recommended Collections</p><div class="sp-rec-cols">${colHtml}</div>`;
    browseCta.parentNode?.insertBefore(div, browseCta);
    /* Also update badges */
    if (profile.email) updateSpaceTabBadges(profile.email);
  };
})();

/* YS Architecture — Discover tab + bottom nav + overlay fixes */

/* renderSpaceDiscover: product grid inside Your Space */
function renderSpaceDiscover(profile) {
  const panel = document.getElementById("spaceDiscoverPanel");
  if (!panel) return;
  const email = profile?.email || "";
  const wl    = getWishlist ? getWishlist() : new Set();
  const cards = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).map(p => `
    <div class="ys-discover-card" onclick="openProduct('${p.id}')">
      <div class="ys-discover-card__img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="ys-discover-card__body">
        <p class="ys-discover-card__name">${p.name}</p>
        <p class="ys-discover-card__price">${p.priceLabel || ""}</p>
      </div>
    </div>`).join("");
  panel.innerHTML = `
    <div class="sp-section-wrap">
      <p class="sp-section-kicker">The Collection</p>
      <p class="sp-section-sub">Thoughtfully curated pieces, personally chosen for you.</p>
      <div class="ys-discover-grid">${cards || '<p class="sp-empty-note">The collection is being curated.</p>'}</div>
    </div>`;
}

/* Bottom nav: wire buttons to showSpaceTab + sync active state */
(function wireYsBottomNav() {
  const nav = document.getElementById("ysBottomNav");
  if (!nav) return;
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ys-bnav]");
    if (!btn) return;
    const tab = btn.dataset.ysBnav;
    if (typeof showSpaceTab === "function") showSpaceTab(tab);
    nav.querySelectorAll(".ys-bnav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.ysBnav === tab));
  });

  /* Keep bottom nav in sync when tabs change via any mechanism.
     Secondary tabs (reached via Profile hub) keep Profile highlighted. */
  const PRIMARY = ["overview","discover","requests","messages","profile"];
  const _origShowTab = window.showSpaceTab;
  if (typeof _origShowTab === "function") {
    window.showSpaceTab = function(tabId) {
      _origShowTab(tabId);
      const activeKey = PRIMARY.includes(tabId) ? tabId : "profile";
      nav.querySelectorAll(".ys-bnav-btn").forEach(b => {
        b.classList.toggle("is-active", b.dataset.ysBnav === activeKey);
      });
      /* Reveal nav whenever a destination changes */
      nav.classList.remove("is-hidden");
    };
  }
})();

/* RC-4: Auto-hide floating nav on scroll (down=hide, up=reveal, stop=reveal 200ms) */
(function ysNavAutoHide() {
  const nav = document.getElementById("ysBottomNav");
  const acc = document.getElementById("account");
  if (!nav || !acc) return;
  let lastY = 0, stopTimer = null, ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = acc.scrollTop;
      const dy = y - lastY;
      if (y < 40) {
        nav.classList.remove("is-hidden");        /* always show near top */
      } else if (dy > 6) {
        nav.classList.add("is-hidden");            /* scrolling down → hide */
      } else if (dy < -6) {
        nav.classList.remove("is-hidden");         /* scrolling up → reveal */
      }
      lastY = y;
      ticking = false;
      /* Scroll stop → reveal after 200ms */
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => nav.classList.remove("is-hidden"), 200);
    });
  };
  acc.addEventListener("scroll", onScroll, { passive: true });
})();

/* Ensure product sheet is opened above Your Space overlay */
(function patchOpenProduct() {
  const _orig = window.openProduct;
  if (typeof _orig !== "function") return;
  window.openProduct = function(productId) {
    /* If in your-space route, temporarily ensure product sheet z-index is above overlay */
    const sheet = document.getElementById("productSheet");
    if (sheet && document.documentElement.dataset.route === "your-space") {
      sheet.style.zIndex = "3500";
    }
    _orig(productId);
  };
  /* Also patch close to restore */
  const _origClose = window.closeProduct;
  if (typeof _origClose === "function") {
    window.closeProduct = function() {
      _origClose();
      const sheet = document.getElementById("productSheet");
      if (sheet) sheet.style.zIndex = "";
    };
  }
})();
