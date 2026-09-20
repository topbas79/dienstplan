// Kopiert die statischen App-Dateien nach www/, damit Capacitor sie ins native Projekt uebernehmen kann.
const fs = require('fs');
const path = require('path');

const dateien = ['index.html', 'app.js', 'pdf-import.js', 'styles.css', 'manifest.json', 'icon-192.png', 'icon-512.png', 'service-worker.js'];
const root = path.join(__dirname, '..');
const ziel = path.join(root, 'www');

if (!fs.existsSync(ziel)) fs.mkdirSync(ziel);
dateien.forEach((datei) => {
    fs.copyFileSync(path.join(root, datei), path.join(ziel, datei));
    console.log('kopiert:', datei);
});

// pdf.js (PDF-Import, laeuft offline)
const pdfQuelle = path.join(root, 'vendor', 'pdfjs');
const pdfZiel = path.join(ziel, 'vendor', 'pdfjs');
if (fs.existsSync(pdfQuelle)) {
    fs.mkdirSync(pdfZiel, { recursive: true });
    fs.readdirSync(pdfQuelle).forEach((datei) => fs.copyFileSync(path.join(pdfQuelle, datei), path.join(pdfZiel, datei)));
    console.log('kopiert: vendor/pdfjs (' + fs.readdirSync(pdfQuelle).length + ' Dateien)');
}

// Einzelne Piktogramm-Icons je Busmodell (fuer die durchsuchbare Liste)
const iconsQuelle = path.join(root, 'busfehler-icons');
const iconsZiel = path.join(ziel, 'busfehler-icons');
if (fs.existsSync(iconsQuelle)) {
    fs.readdirSync(iconsQuelle).forEach((modell) => {
        const modellQuelle = path.join(iconsQuelle, modell);
        const modellZiel = path.join(iconsZiel, modell);
        if (!fs.statSync(modellQuelle).isDirectory()) return;
        fs.mkdirSync(modellZiel, { recursive: true });
        fs.readdirSync(modellQuelle).forEach((datei) => {
            fs.copyFileSync(path.join(modellQuelle, datei), path.join(modellZiel, datei));
        });
        console.log('kopiert: busfehler-icons/' + modell + ' (' + fs.readdirSync(modellQuelle).length + ' Dateien)');
    });
}
