/* ═══════════════════════════════════════════════════════════════════════════
   ABDAN Service Worker — §73 PWA Shell
   Strategy: cache-first for static assets, network-first for HTML navigation.
   Version bump CACHE_VERSION to invalidate all cached assets on deploy.
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const CACHE_VERSION = 'abdan-shell-v6';

/* Core UI shell — cached on install for instant offline presence */
const SHELL_ASSETS = [
  '/',
  '/css/style.css',
  '/js/main.js',
  '/assets/abdan-icon.jpg',
  '/assets/logo/abdan-wordmark-full.jpeg',
  '/assets/embroidered-festive-dupatta.jpg',
  '/assets/favicon.svg',
  '/manifest.json',
];

/* ── Install: pre-cache the shell ──────────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        /* addAll fails atomically — any 404 aborts the install */
        return cache.addAll(SHELL_ASSETS);
      })
      .then(() => self.skipWaiting())  /* activate immediately */
      .catch(() => self.skipWaiting()) /* graceful: activate even if cache partial */
  );
});

/* ── Activate: evict stale caches from previous versions ──────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_VERSION)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim()) /* take control of open pages immediately */
  );
});

/* ── Fetch: stale-while-revalidate for assets, network-first for HTML ─── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Only handle same-origin requests — skip external CDN, analytics, etc. */
  if (url.origin !== self.location.origin) return;

  /* Skip non-GET requests and browser-extension requests */
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/chrome-extension')) return;

  /* HTML navigation: network-first, serve cached shell on failure */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/'))
        .then(response => response || caches.match('/'))
    );
    return;
  }

  /* Static assets: cache-first, background revalidation */
  event.respondWith(
    caches.match(request).then(cached => {
      /* Kick off background network fetch for freshness */
      const networkFetch = fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => null);

      /* Return cached immediately; update in background */
      return cached ?? networkFetch;
    })
  );
});
