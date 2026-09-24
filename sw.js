/* Crudo Detective - Service Worker
 * Strategia: precache dell'app-shell all'install, cache-first a runtime.
 * Il gioco e' un singolo index.html autoconsistente: una volta in cache, gira offline.
 * Per pubblicare un aggiornamento, incrementa CACHE_VERSION: il vecchio cache viene ripulito.
 */
"use strict";

const CACHE_VERSION = "v1";
const CACHE_NAME = "crudo-detective-" + CACHE_VERSION;

// File che compongono l'app. I percorsi sono relativi allo scope del SW.
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

// INSTALL: precache dell'app-shell. Usa {cache:"reload"} per evitare risposte HTTP stantie.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // addAll fallisce tutto se un file manca: usiamo Promise.allSettled per tolleranza.
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch((err) => {
            console.warn("[SW] precache saltato:", url, err && err.message);
          })
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// ACTIVATE: elimina le cache di versioni precedenti e prende il controllo dei client.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("crudo-detective-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH: solo richieste GET same-origin. Cache-first con fallback di rete
// e aggiornamento in background (stale-while-revalidate leggero).
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // lascia passare risorse esterne

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          // Cache solo risposte valide di base (no opaque/error)
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached); // offline: se ho la cache la uso

      // Cache-first: risposta immediata dalla cache, aggiornamento in background.
      return cached || network;
    })
  );
});

// Permette alla pagina di forzare l'attivazione di un SW appena installato.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
