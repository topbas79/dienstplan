const CACHE_NAME = 'dienstplan-cache-v55';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Bei Installation: eigene Dateien in den Cache legen (funktionieren dann offline).
// "reload" erzwingt einen echten Netzwerk-Abruf statt einer evtl. noch
// gültigen (aber veralteten) Antwort aus dem normalen HTTP-Cache des Browsers -
// sonst könnte eine neue Service-Worker-Version trotzdem alte Dateien cachen.
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

// Alte Caches beim Aktivieren aufräumen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Anfragen: erst aus dem Cache bedienen, sonst aus dem Netz laden
// (externe CDN-Skripte wie Tesseract/Cropper werden vom Browser-eigenen HTTP-Cache übernommen)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
