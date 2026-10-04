const CACHE_NAME = 'stellplatz-cache-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(URLS_TO_CACHE.map((url) =>
        fetch(url, { cache: 'reload' }).then((antwort) => cache.put(url, antwort))
      ))
    )
  );
  self.skipWaiting();
});

// Nur eigene alte Caches löschen (die Dienstplan-App nebenan hat ihre eigenen).
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key.startsWith('stellplatz-cache-') && key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Erst das Netz (immer aktuell), ohne Netz oder nach 4 Sekunden die gespeicherte Kopie.
function ausNetzMitZeitlimit(anfrage) {
  return new Promise((erfuellt, abgelehnt) => {
    const timer = setTimeout(() => abgelehnt(new Error('timeout')), 4000);
    fetch(anfrage).then(
      (antwort) => { clearTimeout(timer); erfuellt(antwort); },
      (fehler) => { clearTimeout(timer); abgelehnt(fehler); }
    );
  });
}

self.addEventListener('fetch', (event) => {
  const anfrage = event.request;
  if (anfrage.method !== 'GET' || new URL(anfrage.url).origin !== self.location.origin) return;
  event.respondWith(
    ausNetzMitZeitlimit(anfrage)
      .then((antwort) => {
        if (antwort && antwort.ok) {
          const kopie = antwort.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(anfrage, kopie));
        }
        return antwort;
      })
      .catch(() => caches.match(anfrage, { ignoreSearch: true }).then((gespeichert) => gespeichert || fetch(anfrage)))
  );
});
