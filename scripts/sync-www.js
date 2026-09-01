// Kopiert die statischen App-Dateien nach www/, damit Capacitor sie ins native Projekt uebernehmen kann.
const fs = require('fs');
const path = require('path');

const dateien = ['index.html', 'app.js', 'styles.css', 'manifest.json', 'icon-192.png', 'icon-512.png', 'service-worker.js'];
const root = path.join(__dirname, '..');
const ziel = path.join(root, 'www');

if (!fs.existsSync(ziel)) fs.mkdirSync(ziel);
dateien.forEach((datei) => {
    fs.copyFileSync(path.join(root, datei), path.join(ziel, datei));
    console.log('kopiert:', datei);
});
