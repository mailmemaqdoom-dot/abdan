/* ABDAN — §82 Static pass-through Worker
   Replaces corrupted Pages Functions phantom Worker.
   Routes every request directly to the static asset layer. */

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
