/* ABDAN — Cloudflare Pages pass-through Worker
   Overrides phantom Worker state. Routes all requests to static assets. */
export default {
  async fetch(request, env) {
    try {
      const response = await env.ASSETS.fetch(request);
      return response;
    } catch (e) {
      return new Response(
        JSON.stringify({ error: e.message, url: request.url }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
