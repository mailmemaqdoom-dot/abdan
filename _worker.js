/* ABDAN — Cloudflare Pages Worker
   D-01: /share/[product-id] → static OG share pages (server-readable meta)
   All other requests → static assets via env.ASSETS */

const SHARE_PRODUCTS = {
  "hand-block-print-kurti-set": {
    name: "Hand Block Print Kurti Set",
    price: "₹1,200 onwards",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    desc: "A handcrafted kurti set carrying the quiet artistry of block printing. Personally curated by ABDAN."
  },
  "pleated-modal-abaya": {
    name: "Pleated Modal Abaya",
    price: "₹2,600 onwards",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    desc: "A softly pleated modal abaya — modest, breathable, and quietly beautiful. Personally curated by ABDAN."
  },
  "embroidered-festive-dupatta": {
    name: "Embroidered Festive Dupatta",
    price: "₹2,800 onwards",
    image: "https://abdan.pages.dev/assets/embroidered-festive-dupatta.jpg",
    desc: "A hand-embroidered festive dupatta for the woman who honours every occasion with grace. Personally curated by ABDAN."
  },
  "tailored-workday-kurta-set": {
    name: "Tailored Workday Kurta Set",
    price: "₹2,950 onwards",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    desc: "A tailored kurta set for the woman who moves through her workday with quiet confidence. Personally curated by ABDAN."
  },
  "organza-layered-kurta": {
    name: "Organza Layered Kurta",
    price: "₹3,400 onwards",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    desc: "A softly dramatic layer that makes an impression through shape, not noise. Personally curated by ABDAN."
  },
  "satin-drape-evening-set": {
    name: "Satin Drape Evening Set",
    price: "₹3,950 onwards",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    desc: "Low-light elegance in a softer drape for dinners, visits, and evening gatherings. Personally curated by ABDAN."
  },
  "pearl-detail-occasion-abaya": {
    name: "Pearl Detail Occasion Abaya",
    price: "₹4,600 onwards",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    desc: "A signature full-length piece chosen for its restraint, finish, and lasting presence. Personally curated by ABDAN."
  },
};

function shareHtml(p, productId, origin) {
  const mainUrl = `${origin}/?product=${productId}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${p.name} — ABDAN</title>
<meta name="description" content="${p.desc}" />
<meta property="og:type" content="product" />
<meta property="og:site_name" content="ABDAN" />
<meta property="og:title" content="${p.name} — ABDAN" />
<meta property="og:description" content="${p.desc} Starting at ${p.price}." />
<meta property="og:image" content="${p.image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${origin}/share/${productId}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${p.name} — ABDAN" />
<meta name="twitter:description" content="${p.desc} Starting at ${p.price}." />
<meta name="twitter:image" content="${p.image}" />
<meta http-equiv="refresh" content="0;url=${mainUrl}" />
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Open Sans",sans-serif;background:#023d3a;color:#f8f5ec;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}
img{width:min(340px,90vw);height:220px;object-fit:cover;border-radius:1rem;margin-bottom:1.5rem;box-shadow:0 16px 48px rgba(0,0,0,.35)}
.kicker{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(197,161,59,.8);margin-bottom:.75rem}
h1{font-size:1.5rem;font-weight:400;line-height:1.25;margin-bottom:.5rem}
.price{font-size:.9rem;color:rgba(197,161,59,1);margin-bottom:1.5rem}
a{display:inline-block;background:#c5a13b;color:#fff;text-decoration:none;padding:.75rem 2rem;border-radius:999px;font-size:.875rem;letter-spacing:.04em}
</style>
</head>
<body>
<p class="kicker">ABDAN · Personally Curated</p>
<img src="${p.image}" alt="${p.name}" />
<h1>${p.name}</h1>
<p class="price">Starting at ${p.price}</p>
<a href="${mainUrl}">Shop Now →</a>
<script>setTimeout(()=>{window.location.replace("${mainUrl}")},2000)</script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* D-01: Product share pages with server-readable OG tags */
    if (url.pathname.startsWith("/share/")) {
      const productId = url.pathname.replace(/^\/share\//, "").replace(/\/$/, "");
      const product   = SHARE_PRODUCTS[productId];
      if (product) {
        return new Response(shareHtml(product, productId, url.origin), {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
      /* Unknown product — redirect to main site */
      return Response.redirect(`${url.origin}/`, 302);
    }

    /* All other requests → static assets */
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: e.message, url: request.url }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
