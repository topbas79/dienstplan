const CACHE_NAME = 'dienstplan-cache-v94';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './pdf-import.js',
  './vendor/pdfjs/pdf.min.js',
  './vendor/pdfjs/pdf.worker.min.js',
  './vendor/libs/jspdf.umd.min.js',
  './vendor/libs/jspdf.plugin.autotable.min.js',
  './vendor/libs/supabase.min.js',
  './vendor/libs/cropper.min.js',
  './vendor/libs/cropper.min.css',
  './vendor/libs/tesseract.min.js',
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

// Eigene Dateien: erst das Netz (dann ist die App immer aktuell, ohne dass jemand etwas tun muss),
// bei keinem/langsamem Netz (mehr als 4 Sekunden) die zuletzt gespeicherte Kopie.
// Fremde Anfragen (Datenbank, Login, ...) laufen unverändert am Service-Worker vorbei.
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
