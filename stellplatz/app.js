'use strict';

// Stellplätze: erfasst, auf welchem Stellplatz welcher Bus (Nummer) steht.
// Alle Daten liegen nur auf diesem Gerät (localStorage), Export/Import als JSON-Datei.

const SPEICHER_KEY = 'stellplatz-daten-v1';
const ANSAGE_KEY = 'stellplatz-ansage';
const MAX_VERLAUF = 300;
const MAX_ZIFFERN = 8;
const MAX_PLAETZE = 200;
const MAX_STARTNR = 9999;
// MAX_KM (höchste Reichweite) steht in sprache.js
// Busnummern mit diesen Anfängen sind E-Busse (einzeln per Schalter abwählbar).
const EBUS_PRAEFIXE = ['18', '19'];

// Bereiche des eigenen Betriebshofs (die Halle hat 8 Spuren mit je mehreren Bussen hintereinander), per Knopf anlegbar. Platzanzahl danach unter "Bereiche → Ändern" anpassen.
// laden: Ladeplätze – Busse, die dort abgestellt werden, gelten automatisch als E-Bus (mit Akkuanzeige).
const VORLAGE = [
    { name: 'Tanne 1', anzahl: 10, laden: true },
    { name: 'Tanne 2', anzahl: 10, laden: true },
    { name: 'Tanne 3', anzahl: 10, laden: true },
    { name: 'T14 / T15', kuerzel: 'T', start: 14, anzahl: 2, laden: true },
    { name: 'Halle Spur 1', anzahl: 10 },
    { name: 'Halle Spur 2', anzahl: 10 },
    { name: 'Halle Spur 3', anzahl: 10 },
    { name: 'Halle Spur 4', anzahl: 10 },
    { name: 'Halle Spur 5', anzahl: 10 },
    { name: 'Halle Spur 6', anzahl: 10 },
    { name: 'Halle Spur 7', anzahl: 10 },
    { name: 'Halle Spur 8', anzahl: 10 },
    { name: 'Platte', anzahl: 10 },
    { name: 'Rechter Umlauf', anzahl: 10 },
    { name: 'Werkstattbüro', anzahl: 10 },
    { name: 'Giebel', anzahl: 10 },
    { name: 'Kantine', anzahl: 10 }
];

let daten = laden();
let rueckgaengigStand = null;
let aktiveAnsicht = 'Plaetze';
let suchBegriff = '';
let zuweisenBus = null;        // Busnummer, die beim nächsten Tippen auf einen Platz abgestellt wird
let offen = null;              // { bereich, platz } im Eingabefenster
let eingabe = '';
let eingabeVorbelegt = false;  // erste Taste ersetzt die vorhandene Nummer
let feld = 'bus';              // aktives Feld im Eingabefenster: 'bus', 'akku' oder 'km'
let akkuEingabe = '';
let akkuVorbelegt = false;
let akkuBearbeitet = false;    // erst wenn getippt wurde, wird der Akkustand gespeichert
let kmEingabe = '';
let kmVorbelegt = false;
let kmBearbeitet = false;
let ebusGewaehlt = null;       // null = automatisch, sonst true/false vom E-Bus-Schalter
let rotGewaehlt = null;        // Rote Karte für einen neu eingegebenen Bus: null = unverändert, sonst true/false
let hinweisExtra = '';
let diktat = false;            // Durchsprechen: hört dauerhaft zu, speichert und springt selbst weiter
let sprechStart = false;       // Schnellstart "Durchsprechen": beim nächsten Tippen auf einen Platz geht es los
let fokusVorSheet = null;
let toastTimer = null;
let bearbeiteBereichId = null;
let schnellwahlOffen = false;

const $ = (sel) => document.querySelector(sel);

// ---------- Daten ----------

function neueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function leererStand() {
    // rot: Busnummer → Zeitpunkt der roten Karte (defekt, nicht fahrbereit); gehört zum Bus, nicht zum Platz
    return { version: 2, bereiche: [], verlauf: [], busse: {}, rot: {} };
}

// Prüft und bereinigt geladene/importierte Daten, damit kaputte Dateien die App nicht lahmlegen.
function bereinige(roh) {
    if (!roh || !Array.isArray(roh.bereiche)) return null;
    const d = leererStand();
    roh.bereiche.forEach((b) => {
        if (!b || !Array.isArray(b.plaetze)) return;
        d.bereiche.push({
            id: String(b.id || neueId()),
            name: String(b.name || 'Bereich').slice(0, 40),
            kuerzel: String(b.kuerzel || '').slice(0, 6),
            start: Number.isInteger(b.start) && b.start >= 0 && b.start <= MAX_STARTNR ? b.start : 1,
            // Ältere Daten (vor Version 2) kennen keine Ladeplätze: die Bereiche aus der Vorlage bekommen sie dazu.
            laden: roh.version >= 2 ? b.laden === true : VORLAGE.some((v) => v.laden && v.name === b.name),
            plaetze: b.plaetze.slice(0, MAX_PLAETZE).map((p) => ({
                id: String((p && p.id) || neueId()),
                bus: p && p.bus ? normalisiere(String(p.bus)) || null : null,
                zeit: p && Number.isFinite(p.zeit) ? p.zeit : null
            }))
        });
    });
    if (Array.isArray(roh.verlauf)) {
        d.verlauf = roh.verlauf
            .filter((v) => v && Number.isFinite(v.zeit) && typeof v.text === 'string')
            .slice(0, MAX_VERLAUF)
            .map((v) => ({ zeit: v.zeit, text: v.text.slice(0, 200) }));
    }
    if (roh.rot && typeof roh.rot === 'object') {
        Object.keys(roh.rot).forEach((schluessel) => {
            const nr = normalisiere(schluessel);
            if (nr && Number.isFinite(roh.rot[schluessel])) d.rot[nr] = roh.rot[schluessel];
        });
    }
    // Pro Busnummer: E-Bus ja/nein und letzter Akkustand (wandert mit, wenn der Bus umgesetzt wird)
    if (roh.busse && typeof roh.busse === 'object') {
        Object.keys(roh.busse).forEach((schluessel) => {
            const nr = normalisiere(schluessel);
            const info = roh.busse[schluessel];
            if (!nr || !info) return;
            if (info.ebus === false) {
                // "kein E-Bus" nur merken, wo es die Regel nach Nummer überstimmt
                if (ebusNachNummer(nr)) d.busse[nr] = { ebus: false, akku: null, km: null, akkuZeit: null };
                return;
            }
            if (info.ebus !== true) return;
            const akku = Number.isInteger(info.akku) && info.akku >= 0 && info.akku <= 100 ? info.akku : null;
            const km = Number.isInteger(info.km) && info.km >= 0 && info.km <= MAX_KM ? info.km : null;
            d.busse[nr] = { ebus: true, akku, km, akkuZeit: (akku !== null || km !== null) && Number.isFinite(info.akkuZeit) ? info.akkuZeit : null };
        });
    }
    return d;
}

function laden() {
    try {
        const roh = localStorage.getItem(SPEICHER_KEY);
        if (!roh) return leererStand();
        return bereinige(JSON.parse(roh)) || leererStand();
    } catch (e) {
        return leererStand();
    }
}

function speichern() {
    try {
        localStorage.setItem(SPEICHER_KEY, JSON.stringify(daten));
    } catch (e) {
        zeigeToast('Speichern fehlgeschlagen – Speicher voll oder gesperrt');
    }
}

function normalisiere(nr) {
    return String(nr || '').toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, MAX_ZIFFERN);
}

// Voller Name eines Platzes, eindeutig über alle Bereiche:
// mit Kürzel "A" → A3, mit Kürzel "T1" → T1-3 (sonst wäre T13 mehrdeutig), ohne Kürzel → "Halle Spur 3 · Platz 2".
function platzNr(bereich, platz) {
    return bereich.start + bereich.plaetze.indexOf(platz);
}

function platzLabel(bereich, platz) {
    const nr = platzNr(bereich, platz);
    if (!bereich.kuerzel) return bereich.name + ' · Platz ' + nr;
    return bereich.kuerzel + (/[0-9]$/.test(bereich.kuerzel) ? '-' : '') + nr;
}

// Kurzer Name, wenn der Bereich schon daneben steht (Kacheln, Liste).
function kurzLabel(bereich, platz) {
    return bereich.kuerzel ? platzLabel(bereich, platz) : 'Platz ' + platzNr(bereich, platz);
}

function allePlaetze() {
    const liste = [];
    daten.bereiche.forEach((bereich) => bereich.plaetze.forEach((platz) => liste.push({ bereich, platz })));
    return liste;
}

function findeBus(nr) {
    return allePlaetze().find((e) => e.platz.bus === nr) || null;
}

function ebusNachNummer(nr) {
    return EBUS_PRAEFIXE.some((praefix) => nr.startsWith(praefix));
}

// Ausdrücklich gesetzt (Schalter, Ladeplatz) gilt vor der Regel nach Nummer.
function istEbus(nr) {
    if (!nr) return false;
    const info = daten.busse[nr];
    return info ? info.ebus : ebusNachNummer(nr);
}

function istRot(nr) {
    return !!(nr && daten.rot[nr]);
}

function akkuVon(nr) {
    return istEbus(nr) && daten.busse[nr] ? daten.busse[nr].akku : null;
}

function kmVon(nr) {
    return istEbus(nr) && daten.busse[nr] && Number.isInteger(daten.busse[nr].km) ? daten.busse[nr].km : null;
}

function findePlatz(bereichId, platzId) {
    const bereich = daten.bereiche.find((b) => b.id === bereichId);
    const platz = bereich && bereich.plaetze.find((p) => p.id === platzId);
    return platz ? { bereich, platz } : null;
}

function naechsterPlatz(bereich, platz) {
    const i = bereich.plaetze.indexOf(platz);
    if (i + 1 < bereich.plaetze.length) return { bereich, platz: bereich.plaetze[i + 1] };
    for (let b = daten.bereiche.indexOf(bereich) + 1; b < daten.bereiche.length; b++) {
        if (daten.bereiche[b].plaetze.length) return { bereich: daten.bereiche[b], platz: daten.bereiche[b].plaetze[0] };
    }
    return null;
}

// ---------- Änderungen (jede mit Rückgängig + Verlauf) ----------

function merkeStand() {
    rueckgaengigStand = JSON.stringify(daten);
}

function protokoll(text) {
    daten.verlauf.unshift({ zeit: Date.now(), text });
    if (daten.verlauf.length > MAX_VERLAUF) daten.verlauf.length = MAX_VERLAUF;
}

function aenderungFertig(text) {
    protokoll(text);
    speichern();
    render();
    zeigeToast(text, true);
}

// Bus auf einen Platz stellen und/oder E-Bus-Kennzeichen und Akkustand ändern – als eine Änderung (ein Rückgängig).
// opt.ebus: true/false = ausdrücklich gewählt, undefined = bleibt bzw. automatisch auf Ladeplätzen.
// opt.akku: Zahl 0–100, null = löschen, undefined = unverändert. opt.km (Reichweite) genauso, 0–999.
// opt.rot: true = rote Karte, false = wieder fahrbereit, undefined = unverändert.
function speicherePlatz(bereich, platz, roh, opt = {}) {
    const nr = normalisiere(roh);
    if (!nr) { freigeben(bereich, platz); return; }
    const stand = JSON.stringify(daten);
    const jetzt = Date.now();
    const texte = [];
    if (platz.bus !== nr) {
        const vorher = findeBus(nr);
        let text = vorher
            ? 'Bus ' + nr + ': ' + platzLabel(vorher.bereich, vorher.platz) + ' → ' + platzLabel(bereich, platz)
            : 'Bus ' + nr + ' → ' + platzLabel(bereich, platz);
        if (vorher) {
            vorher.platz.bus = null;
            vorher.platz.zeit = jetzt;
        }
        if (platz.bus) text += ' (Bus ' + platz.bus + ' entfernt)';
        platz.bus = nr;
        platz.zeit = jetzt;
        texte.push(text);
    }
    const ebus = opt.ebus !== undefined ? opt.ebus : istEbus(nr) || bereich.laden;
    if (ebus !== istEbus(nr)) texte.push(ebus ? 'E-Bus' : 'kein E-Bus');
    if (ebus) {
        if (!daten.busse[nr] || !daten.busse[nr].ebus) daten.busse[nr] = { ebus: true, akku: null, km: null, akkuZeit: null };
    } else if (ebusNachNummer(nr)) {
        daten.busse[nr] = { ebus: false, akku: null, km: null, akkuZeit: null };
    } else {
        delete daten.busse[nr];
    }
    if (ebus && opt.akku !== undefined && opt.akku !== daten.busse[nr].akku) {
        daten.busse[nr].akku = opt.akku;
        daten.busse[nr].akkuZeit = opt.akku === null ? null : jetzt;
        texte.push(opt.akku === null ? 'Akku gelöscht' : 'Akku ' + opt.akku + ' %');
    }
    if (ebus && opt.km !== undefined && opt.km !== kmVon(nr)) {
        daten.busse[nr].km = opt.km;
        if (opt.km !== null) daten.busse[nr].akkuZeit = jetzt;
        texte.push(opt.km === null ? 'Reichweite gelöscht' : 'Reichweite ' + opt.km + ' km');
    }
    if (opt.rot !== undefined && opt.rot !== istRot(nr)) {
        if (opt.rot) daten.rot[nr] = jetzt;
        else delete daten.rot[nr];
        texte.push(opt.rot ? 'Rote Karte – nicht fahrbereit' : 'Rote Karte weg – fahrbereit');
    }
    if (!texte.length) return;
    rueckgaengigStand = stand;
    aenderungFertig(platz.bus === nr && texte[0].startsWith('Bus ') ? texte.join(', ') : 'Bus ' + nr + ' (' + platzLabel(bereich, platz) + '): ' + texte.join(', '));
}

function freigeben(bereich, platz) {
    if (!platz.bus) return;
    merkeStand();
    const text = platzLabel(bereich, platz) + ' frei (Bus ' + platz.bus + ' weg)';
    platz.bus = null;
    platz.zeit = Date.now();
    aenderungFertig(text);
}

function rueckgaengig() {
    if (!rueckgaengigStand) return;
    daten = bereinige(JSON.parse(rueckgaengigStand)) || daten;
    rueckgaengigStand = null;
    speichern();
    aktualisiereOffen();
    render();
    zeigeToast('Rückgängig gemacht');
}

// Nach dem Austausch von `daten` (Rückgängig, anderer Tab) zeigt das Eingabefenster auf die neuen Objekte.
function aktualisiereOffen() {
    if (!offen) return;
    const neu = findePlatz(offen.bereich.id, offen.platz.id);
    if (neu) { offen = neu; renderEingabe(); } else schliesseEingabe();
}

// ---------- Hilfen für die Anzeige ----------

function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function zeitText(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    const heute = new Date();
    const hhmm = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === heute.toDateString()) return hhmm;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + ' ' + hhmm;
}

function batterieSvg(prozent) {
    const breite = (17 * Math.max(0, Math.min(100, prozent)) / 100).toFixed(1);
    return '<svg class="batterie" viewBox="0 0 26 12" width="20" height="10" aria-hidden="true">' +
        '<rect x="0.75" y="0.75" width="21.5" height="10.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"></rect>' +
        '<rect x="23" y="3.5" width="2.5" height="5" rx="1" fill="currentColor"></rect>' +
        '<rect x="2.75" y="2.75" width="' + breite + '" height="6.5" rx="1" fill="currentColor"></rect></svg>';
}

// Akkuanzeige eines E-Busses (leer, wenn kein E-Bus): Batterie + Prozent, rot unter 20 %, gelb unter 50 %, sonst grün.
function akkuHtml(nr) {
    if (!istEbus(nr)) return '';
    const akku = akkuVon(nr);
    if (akku === null) return '<span class="akku unbekannt" title="Akkustand noch nicht erfasst">' + batterieSvg(0) + '? %</span>';
    const stufe = akku < 20 ? 'niedrig' : akku < 50 ? 'mittel' : 'gut';
    return '<span class="akku ' + stufe + '">' + batterieSvg(akku) + akku + ' %</span>';
}

const KARTEN_SVG = '<svg width="13" height="15" viewBox="0 0 13 15" aria-hidden="true"><rect x="2" y="1" width="9" height="13" rx="1.5" transform="rotate(-10 6.5 7.5)" fill="currentColor"></rect></svg>';

function rotText(nr) {
    return istRot(nr) ? 'Rote Karte (seit ' + zeitText(daten.rot[nr]) + ')' : '';
}

function reichweiteHtml(nr) {
    const km = kmVon(nr);
    return km === null ? '' : '<span class="reichweite">' + km + ' km</span>';
}

// "Akku 64 % · 150 km (21:14)" – Uhrzeit der letzten Akku-/Reichweiten-Eingabe
function akkuText(nr) {
    if (!istEbus(nr)) return '';
    const akku = akkuVon(nr);
    const km = kmVon(nr);
    const zeit = (akku !== null || km !== null) && daten.busse[nr].akkuZeit;
    return (akku === null ? 'Akku ? %' : 'Akku ' + akku + ' %') + (km !== null ? ' · ' + km + ' km' : '') + (zeit ? ' (' + zeitText(zeit) + ')' : '');
}

const LADEZEICHEN = '<svg class="ladezeichen" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-label="Ladeplätze"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"></path></svg>';

function vergleicheBus(a, b) {
    return a.localeCompare(b, 'de', { numeric: true });
}

function trefferListe() {
    if (!suchBegriff) return [];
    return allePlaetze()
        .filter((e) => e.platz.bus && e.platz.bus.includes(suchBegriff))
        .sort((a, b) => (a.platz.bus === suchBegriff ? -1 : b.platz.bus === suchBegriff ? 1 : vergleicheBus(a.platz.bus, b.platz.bus)));
}

// ---------- Rendern ----------

function render() {
    const alle = allePlaetze();
    const belegt = alle.filter((e) => e.platz.bus).length;
    const rote = alle.filter((e) => e.platz.bus && istRot(e.platz.bus)).length;
    $('#statusZeile').textContent = alle.length
        ? belegt + ' von ' + alle.length + ' Plätzen belegt' + (rote ? ' · ' + rote + ' rote Karte' + (rote > 1 ? 'n' : '') : '')
        : 'Noch keine Plätze angelegt';

    document.querySelectorAll('.tabbar button').forEach((btn) => {
        const aktiv = btn.dataset.ansicht === aktiveAnsicht;
        btn.classList.toggle('aktiv', aktiv);
        if (aktiv) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
    });
    ['Plaetze', 'Liste', 'Verlauf', 'Bereiche'].forEach((a) => { $('#ansicht' + a).hidden = a !== aktiveAnsicht; });
    $('.suche').hidden = aktiveAnsicht === 'Bereiche' || aktiveAnsicht === 'Verlauf';

    renderSuchErgebnis();
    renderZuweisen();
    $('#schnellwahl').hidden = true;
    if (aktiveAnsicht === 'Plaetze') renderPlaetze();
    if (aktiveAnsicht === 'Liste') renderListe();
    if (aktiveAnsicht === 'Verlauf') renderVerlauf();
    if (aktiveAnsicht === 'Bereiche') renderBereiche();
}

function renderSuchErgebnis() {
    const el = $('#suchErgebnis');
    if (!suchBegriff || zuweisenBus || aktiveAnsicht === 'Bereiche' || aktiveAnsicht === 'Verlauf') { el.hidden = true; return; }
    const treffer = trefferListe();
    const genau = treffer.find((e) => e.platz.bus === suchBegriff);
    let html;
    if (genau) {
        html = '<div class="ergebnis-text"><strong>Bus ' + esc(genau.platz.bus) + '</strong> steht auf <strong class="gross">' +
            esc(platzLabel(genau.bereich, genau.platz)) + '</strong><span class="leise">' +
            [genau.bereich.kuerzel ? genau.bereich.name : '', genau.platz.zeit ? 'seit ' + zeitText(genau.platz.zeit) : '', rotText(genau.platz.bus), akkuText(genau.platz.bus)].filter(Boolean).map(esc).join(' · ') +
            '</span></div>' +
            '<button type="button" class="btn klein" data-aktion="zuweisen">Umsetzen</button>';
    } else if (treffer.length) {
        html = '<div class="ergebnis-text">' + treffer.length + ' Treffer: ' +
            treffer.slice(0, 6).map((e) => '<strong>' + esc(e.platz.bus) + '</strong> (' + esc(platzLabel(e.bereich, e.platz)) + ')').join(', ') +
            (treffer.length > 6 ? ' …' : '') + '</div>' +
            '<button type="button" class="btn klein" data-aktion="zuweisen">Bus ' + esc(suchBegriff) + ' abstellen</button>';
    } else {
        html = '<div class="ergebnis-text">Bus <strong>' + esc(suchBegriff) + '</strong> ist nicht erfasst.</div>' +
            (daten.bereiche.length ? '<button type="button" class="btn klein primaer" data-aktion="zuweisen">Abstellen</button>' : '');
    }
    el.innerHTML = html;
    el.classList.toggle('gefunden', !!genau);
    el.hidden = false;
}

function renderZuweisen() {
    const banner = $('#zuweisenBanner');
    banner.hidden = !(zuweisenBus || sprechStart) || aktiveAnsicht !== 'Plaetze';
    if (zuweisenBus) $('#zuweisenText').textContent = 'Bus ' + zuweisenBus + ': tippe auf den Platz, wo er steht';
    else if (sprechStart) $('#zuweisenText').textContent = 'Durchsprechen: tippe auf den ersten Platz, dann einfach lossprechen';
    document.body.classList.toggle('zuweisen-modus', !!zuweisenBus && aktiveAnsicht === 'Plaetze');
}

function renderPlaetze() {
    const el = $('#ansichtPlaetze');
    if (!daten.bereiche.length) {
        el.innerHTML = '<div class="karte leer-zustand"><h2>Willkommen!</h2><p>Lege zuerst deine Stellplätze an. ' +
            'Die Vorlage enthält Tanne 1–3, T14/T15, die Halle mit Spur 1–8, Platte, Rechter Umlauf, Werkstattbüro, Giebel und Kantine. ' +
            'Danach tippst du einfach auf einen Platz und gibst die Busnummer ein.</p>' +
            '<div class="knopfreihe zentriert umbruch"><button type="button" class="btn primaer" data-aktion="vorlage">Vorlage anlegen</button>' +
            '<button type="button" class="btn" data-aktion="zu-bereichen">Selbst anlegen</button></div></div>';
        $('#schnellwahl').hidden = true;
        return;
    }
    const trefferIds = new Set(trefferListe().map((e) => e.platz.id));
    el.innerHTML = daten.bereiche.map((bereich) => {
        const belegt = bereich.plaetze.filter((p) => p.bus).length;
        const kacheln = bereich.plaetze.map((platz) => {
            const klassen = ['platz', platz.bus ? 'belegt' : 'frei'];
            if (trefferIds.has(platz.id)) klassen.push('treffer');
            if (platz.bus && istRot(platz.bus)) klassen.push('rot');
            const label = kurzLabel(bereich, platz);
            return '<button type="button" class="' + klassen.join(' ') + '" data-bereich="' + esc(bereich.id) + '" data-platz="' + esc(platz.id) + '"' +
                ' aria-label="' + esc(platzLabel(bereich, platz)) + ': ' + (platz.bus ? 'Bus ' + esc(platz.bus) + (istRot(platz.bus) ? ', Rote Karte' : '') + (istEbus(platz.bus) ? ', ' + esc(akkuText(platz.bus)) : '') : 'frei') + '">' +
                (platz.bus && istRot(platz.bus) ? '<span class="karten-zeichen">' + KARTEN_SVG + '</span>' : '') +
                '<span class="platz-label">' + esc(label) + '</span>' +
                '<span class="platz-bus">' + (platz.bus ? esc(platz.bus) : 'frei') + '</span>' +
                (platz.bus && istEbus(platz.bus)
                    ? akkuHtml(platz.bus) + reichweiteHtml(platz.bus)
                    : '<span class="platz-zeit">' + (platz.bus ? esc(zeitText(platz.zeit)) : '&nbsp;') + '</span>') +
                '</button>';
        }).join('');
        return '<section class="bereich" id="bereich-' + esc(bereich.id) + '"><div class="bereich-kopf"><h2>' + esc(bereich.name) + (bereich.laden ? ' ' + LADEZEICHEN : '') + '</h2>' +
            '<span class="leise">' + belegt + ' / ' + bereich.plaetze.length + ' belegt</span></div>' +
            (bereich.plaetze.length ? '<div class="raster">' + kacheln + '</div>' : '<p class="leise">Keine Plätze in diesem Bereich.</p>') +
            '</section>';
    }).join('');

    // Schnellwahl: zum Aufklappen, ein Tipp auf einen Bereich springt hin und klappt wieder zu
    $('#schnellwahl').hidden = daten.bereiche.length < 3 || !!zuweisenBus;
    $('#schnellwahlInfo').textContent = daten.bereiche.length + ' Bereiche';
    $('#schnellwahlBtn').setAttribute('aria-expanded', String(schnellwahlOffen));
    const leiste = $('#sprungLeiste');
    leiste.hidden = !schnellwahlOffen;
    leiste.innerHTML = daten.bereiche.map((b) => {
        const belegt = b.plaetze.filter((p) => p.bus).length;
        return '<button type="button" class="chip' + (b.plaetze.length && belegt === b.plaetze.length ? ' voll' : '') + '" data-sprung="' + esc(b.id) + '">' +
            '<span class="chip-name">' + esc(b.name) + (b.laden ? ' ' + LADEZEICHEN : '') + '</span>' +
            '<span class="leise">' + belegt + '/' + b.plaetze.length + '</span></button>';
    }).join('');
}

function schalteSchnellwahl(offen) {
    schnellwahlOffen = offen;
    $('#schnellwahlBtn').setAttribute('aria-expanded', String(offen));
    $('#sprungLeiste').hidden = !offen;
}

// ---------- Nachtmodus ----------

function nachtmodusAktiv() {
    const thema = document.documentElement.dataset.thema;
    if (thema) return thema === 'dunkel';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function zeigeThema() {
    const dunkel = nachtmodusAktiv();
    document.documentElement.classList.toggle('dunkel-aktiv', dunkel);
    $('#themaBtn').setAttribute('aria-label', dunkel ? 'Nachtmodus ausschalten' : 'Nachtmodus einschalten');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', dunkel ? '#0f172a' : '#2563eb');
}

function schalteThema() {
    const neu = nachtmodusAktiv() ? 'hell' : 'dunkel';
    document.documentElement.dataset.thema = neu;
    try { localStorage.setItem('stellplatz-thema', neu); } catch (e) { /* gilt dann nur bis zum Schließen */ }
    zeigeThema();
}

function springeZuBereich(id) {
    const abschnitt = document.getElementById('bereich-' + id);
    if (!abschnitt) return;
    const kopf = $('.suche').offsetHeight;
    window.scrollTo({ top: abschnitt.getBoundingClientRect().top + window.scrollY - kopf - 6, behavior: 'smooth' });
}

function renderListe() {
    const el = $('#ansichtListe');
    let eintraege = allePlaetze().filter((e) => e.platz.bus);
    if (suchBegriff) eintraege = eintraege.filter((e) => e.platz.bus.includes(suchBegriff));
    eintraege.sort((a, b) => vergleicheBus(a.platz.bus, b.platz.bus));
    const kopf = '<div class="liste-kopf"><span class="leise">' + eintraege.length + (suchBegriff ? ' Treffer' : ' Busse erfasst') + '</span>' +
        '<button type="button" class="btn klein" data-aktion="teilen"' + (allePlaetze().some((e) => e.platz.bus) ? '' : ' disabled') + '>Belegung teilen</button></div>';
    if (!eintraege.length) {
        el.innerHTML = kopf + '<div class="karte leer-zustand"><p>' + (suchBegriff ? 'Kein Bus passt zur Suche.' : 'Noch keine Busse erfasst.') + '</p></div>';
        return;
    }
    el.innerHTML = kopf + '<div class="karte liste">' + eintraege.map((e) =>
        '<button type="button" class="zeile" data-bereich="' + esc(e.bereich.id) + '" data-platz="' + esc(e.platz.id) + '">' +
        '<span class="zeile-bus">' + esc(e.platz.bus) + '</span>' +
        (istRot(e.platz.bus) ? '<span class="rot-marke">' + KARTEN_SVG + 'Rote Karte</span>' : '') +
        '<span class="zeile-platz">' + esc(kurzLabel(e.bereich, e.platz)) + '<span class="leise">' + esc(e.bereich.name) + '</span></span>' +
        akkuHtml(e.platz.bus) + reichweiteHtml(e.platz.bus) +
        '<span class="zeile-zeit leise">' + esc(zeitText(e.platz.zeit)) + '</span>' +
        '</button>'
    ).join('') + '</div>';
}

function renderVerlauf() {
    const el = $('#ansichtVerlauf');
    if (!daten.verlauf.length) {
        el.innerHTML = '<div class="karte leer-zustand"><p>Noch keine Änderungen.</p></div>';
        return;
    }
    el.innerHTML = '<div class="liste-kopf"><span class="leise">Letzte ' + daten.verlauf.length + ' Änderungen</span>' +
        '<button type="button" class="btn klein" data-aktion="verlauf-leeren">Verlauf löschen</button></div>' +
        '<div class="karte liste">' + daten.verlauf.map((v) =>
            '<div class="zeile verlauf"><span class="zeile-zeit leise">' + esc(zeitText(v.zeit)) + '</span><span>' + esc(v.text) + '</span></div>'
        ).join('') + '</div>';
}

function renderBereiche() {
    const el = $('#ansichtBereiche');
    const neu = '<form class="karte formular" id="formNeu">' +
        '<h2>Neuer Bereich</h2>' +
        '<div class="felder">' +
        '<label class="breit">Name<input name="name" required maxlength="40" placeholder="z. B. Tanne 1"></label>' +
        '<label>Kürzel<input name="kuerzel" maxlength="6" placeholder="optional" autocapitalize="characters"></label>' +
        '<label>Ab Nr.<input name="start" type="number" inputmode="numeric" min="0" max="' + MAX_STARTNR + '" required value="1"></label>' +
        '<label>Plätze<input name="anzahl" type="number" inputmode="numeric" min="1" max="' + MAX_PLAETZE + '" required value="10"></label>' +
        '<label class="breit haken"><input type="checkbox" name="laden"> Ladeplätze – Busse hier sind E-Busse (mit Akkuanzeige)</label>' +
        '</div>' +
        '<p class="leise klein-text">Der Name ist frei wählbar (Tanne 1, Halle Spur 3, Platte …). Ohne Kürzel heißen die Plätze „Tanne 1 · Platz 1“, „Platz 2“ …; ' +
        'mit Kürzel kürzer: „H1“ → H1-1, H1-2 …, „A“ → A1, A2 …. „Ab Nr.“ legt die erste Nummer fest: Kürzel „T“ ab 14 → T14, T15 …</p>' +
        '<button type="submit" class="btn primaer">Bereich anlegen</button>' +
        '</form>';

    const liste = daten.bereiche.map((b, i) => {
        if (b.id === bearbeiteBereichId) {
            return '<form class="karte formular" data-bearbeiten="' + esc(b.id) + '">' +
                '<div class="felder">' +
                '<label class="breit">Name<input name="name" required maxlength="40" value="' + esc(b.name) + '"></label>' +
                '<label>Kürzel<input name="kuerzel" maxlength="6" placeholder="optional" value="' + esc(b.kuerzel) + '" autocapitalize="characters"></label>' +
                '<label>Ab Nr.<input name="start" type="number" inputmode="numeric" min="0" max="' + MAX_STARTNR + '" required value="' + b.start + '"></label>' +
                '<label>Plätze<input name="anzahl" type="number" inputmode="numeric" min="0" max="' + MAX_PLAETZE + '" required value="' + b.plaetze.length + '"></label>' +
                '<label class="breit haken"><input type="checkbox" name="laden"' + (b.laden ? ' checked' : '') + '> Ladeplätze – Busse hier sind E-Busse (mit Akkuanzeige)</label>' +
                '</div>' +
                '<div class="knopfreihe"><button type="button" class="btn" data-aktion="bearbeiten-abbrechen">Abbrechen</button>' +
                '<button type="submit" class="btn primaer">Speichern</button></div>' +
                '</form>';
        }
        const belegt = b.plaetze.filter((p) => p.bus).length;
        const bereichsText = b.plaetze.length
            ? kurzLabel(b, b.plaetze[0]) + (b.plaetze.length > 1 ? ' – ' + (b.kuerzel ? kurzLabel(b, b.plaetze[b.plaetze.length - 1]) : platzNr(b, b.plaetze[b.plaetze.length - 1])) : '')
            : 'keine Plätze';
        return '<div class="karte bereich-zeile">' +
            '<div class="bereich-info"><strong>' + esc(b.name) + (b.laden ? ' ' + LADEZEICHEN : '') + '</strong>' +
            '<span class="leise">' + esc(bereichsText) + ' · ' + belegt + '/' + b.plaetze.length + ' belegt' + (b.laden ? ' · Ladeplätze' : '') + '</span></div>' +
            '<div class="knopfreihe">' +
            '<button type="button" class="icon-btn" data-aktion="hoch" data-id="' + esc(b.id) + '" aria-label="Nach oben"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="icon-btn" data-aktion="runter" data-id="' + esc(b.id) + '" aria-label="Nach unten"' + (i === daten.bereiche.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="btn klein" data-aktion="bearbeiten" data-id="' + esc(b.id) + '">Ändern</button>' +
            '<button type="button" class="btn klein gefahr" data-aktion="bereich-loeschen" data-id="' + esc(b.id) + '">Löschen</button>' +
            '</div></div>';
    }).join('');

    const werkzeuge = '<div class="karte werkzeuge"><h2>Daten</h2>' +
        '<p class="leise klein-text">Die Belegung wird nur auf diesem Gerät gespeichert. Mit Export/Import kannst du sie sichern oder auf ein anderes Handy übertragen.</p>' +
        '<div class="knopfreihe umbruch">' +
        '<button type="button" class="btn" data-aktion="export">Exportieren</button>' +
        '<button type="button" class="btn" data-aktion="import">Importieren</button>' +
        '<button type="button" class="btn gefahr" data-aktion="alle-leeren"' + (allePlaetze().some((e) => e.platz.bus) ? '' : ' disabled') + '>Alle Plätze leeren</button>' +
        '</div></div>';

    const fehlend = fehlendeVorlage();
    const vorlage = fehlend.length
        ? '<div class="karte vorlage"><div><strong>Vorlage Betriebshof</strong><span class="leise">' +
          (fehlend.length === VORLAGE.length ? VORLAGE.length + ' Bereiche: Tanne, Halle Spur 1–8, Platte …' : fehlend.length + ' fehlen noch: ' + esc(fehlend.map((v) => v.name).join(', '))) +
          '</span></div><button type="button" class="btn primaer klein" data-aktion="vorlage">Anlegen</button></div>'
        : '';

    const einstellungen = '<div class="karte formular"><h2>Einstellungen</h2>' +
        '<label class="haken"><input type="checkbox" name="ansage"' + (ansageAn() ? ' checked' : '') + '> ' +
        'Ansage beim Durchsprechen (z. B. „18 01 gespeichert“, „Akku?“) – vibrieren tut es immer</label></div>';

    el.innerHTML = vorlage + einstellungen + neu + liste + werkzeuge;
}

// ---------- Eingabefenster (Ziffernblock) ----------

function oeffneEingabe(bereich, platz) {
    const warSchonOffen = !!offen;
    offen = { bereich, platz };
    eingabe = platz.bus || '';
    eingabeVorbelegt = !!platz.bus;
    akkuEingabe = '';
    akkuVorbelegt = false;
    akkuBearbeitet = false;
    kmEingabe = '';
    kmVorbelegt = false;
    kmBearbeitet = false;
    ebusGewaehlt = null;
    rotGewaehlt = null;
    hinweisExtra = diktat ? DIKTAT_HINWEIS : '';
    feld = 'bus';
    // Steht hier schon ein E-Bus, geht es meist um den Akkustand: gleich das Akkufeld aktivieren.
    if (platz.bus && ebusAktiv()) aktiviereFeld('akku', false);
    if (!warSchonOffen) fokusVorSheet = document.activeElement;
    $('#sheetHintergrund').hidden = false;
    $('#eingabeSheet').hidden = false;
    document.body.classList.add('sheet-offen');
    renderEingabe();
    $('#eingabeSheet').focus();
    markiereKachel(platz.id);
}

function schliesseEingabe() {
    if (!offen) return;
    hoereAuf();
    offen = null;
    $('#sheetHintergrund').hidden = true;
    $('#eingabeSheet').hidden = true;
    document.body.classList.remove('sheet-offen');
    document.querySelectorAll('.platz.aktuell').forEach((k) => k.classList.remove('aktuell'));
    if (fokusVorSheet && document.contains(fokusVorSheet)) fokusVorSheet.focus();
    fokusVorSheet = null;
}

function renderEingabe() {
    if (!offen) return;
    const { bereich, platz } = offen;
    $('#sheetTitel').textContent = bereich.kuerzel ? 'Platz ' + platzLabel(bereich, platz) : platzLabel(bereich, platz);
    $('#sheetInfo').textContent = bereich.name + ' · ' + (platz.bus ? 'jetzt: Bus ' + platz.bus + (platz.zeit ? ' (seit ' + zeitText(platz.zeit) + ')' : '') : 'frei');
    const nr = normalisiere(eingabe);
    const mitAkku = ebusAktiv();
    if (!mitAkku && feld !== 'bus') feld = 'bus';

    const busFeld = $('#anzeigeBus');
    $('#anzeigeText').textContent = eingabe;
    busFeld.classList.toggle('vorbelegt', eingabeVorbelegt && feld === 'bus');
    busFeld.classList.toggle('leer', !eingabe);
    busFeld.classList.toggle('aktiv', feld === 'bus');

    const akkuFeld = $('#anzeigeAkku');
    const akkuWert = akkuBearbeitet || feld === 'akku' ? akkuEingabe : akkuVorschlag();
    akkuFeld.hidden = !mitAkku;
    $('#anzeigen').classList.toggle('mit-akku', mitAkku);
    $('#akkuText').textContent = akkuWert;
    akkuFeld.classList.toggle('vorbelegt', akkuVorbelegt && feld === 'akku');
    akkuFeld.classList.toggle('leer', !akkuWert);
    akkuFeld.classList.toggle('aktiv', feld === 'akku');

    const kmFeld = $('#anzeigeKm');
    const kmWert = kmBearbeitet || feld === 'km' ? kmEingabe : kmVorschlag();
    kmFeld.hidden = !mitAkku;
    $('#kmText').textContent = kmWert;
    kmFeld.classList.toggle('vorbelegt', kmVorbelegt && feld === 'km');
    kmFeld.classList.toggle('leer', !kmWert);
    kmFeld.classList.toggle('aktiv', feld === 'km');

    const rotKnopf = $('#rotSchalter');
    rotKnopf.hidden = !nr;
    rotKnopf.setAttribute('aria-pressed', String(rotAktiv()));

    const schalter = $('#ebusSchalter');
    schalter.hidden = !nr;
    schalter.setAttribute('aria-pressed', String(mitAkku));

    let hinweis = '';
    if (nr && nr !== platz.bus) {
        const woanders = findeBus(nr);
        if (woanders) hinweis = 'Bus ' + nr + ' steht auf ' + platzLabel(woanders.bereich, woanders.platz) + ' – wird hierher umgesetzt.';
        else if (platz.bus) hinweis = 'Bus ' + platz.bus + ' wird hier ersetzt.';
    } else if (!nr && platz.bus) {
        hinweis = 'Leer speichern gibt den Platz frei.';
    }
    if (hinweisExtra) hinweis = hinweisExtra;
    $('#sheetHinweis').textContent = hinweis;

    $('#btnFreigeben').disabled = !platz.bus;
    const weiter = naechsterPlatz(bereich, platz);
    $('#btnWeiter').textContent = feld === 'bus' && mitAkku
        ? 'Weiter › Akku'
        : feld === 'akku' && mitAkku
        ? 'Weiter › km'
        : weiter
        ? 'Weiter › ' + (weiter.bereich === bereich ? kurzLabel(weiter.bereich, weiter.platz) : weiter.bereich.kuerzel ? platzLabel(weiter.bereich, weiter.platz) : weiter.bereich.name)
        : 'Fertig';
}

function markiereKachel(platzId) {
    document.querySelectorAll('.platz.aktuell').forEach((k) => k.classList.remove('aktuell'));
    const kachel = document.querySelector('.platz[data-platz="' + CSS.escape(platzId) + '"]');
    if (kachel) {
        kachel.classList.add('aktuell');
        kachel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function rotAktiv() {
    const nr = normalisiere(eingabe);
    if (!nr) return false;
    return rotGewaehlt !== null ? rotGewaehlt : istRot(nr);
}

// Rote Karte umschalten: steht der Bus schon auf diesem Platz, sofort speichern (mit Rückgängig),
// bei einem neu eingegebenen Bus gilt sie beim Speichern.
function schalteRot(neu) {
    if (!offen) return;
    const nr = normalisiere(eingabe);
    if (!nr) return;
    if (nr === offen.platz.bus) {
        rotGewaehlt = null;
        speicherePlatz(offen.bereich, offen.platz, nr, { rot: neu });
        hinweisExtra = neu ? 'Rote Karte gesetzt – Bus ' + nr + ' nicht fahrbereit' : 'Rote Karte weg – Bus ' + nr + ' fahrbereit';
    } else {
        rotGewaehlt = neu;
        hinweisExtra = neu ? 'Rote Karte – wird mit dem Bus gespeichert' : '';
    }
    renderEingabe();
}

// E-Bus-Felder: Schalter ausdrücklich gewählt, sonst bekannter E-Bus oder Bus auf einem Ladeplatz.
function ebusAktiv() {
    const nr = normalisiere(eingabe);
    if (!nr) return false;
    return ebusGewaehlt !== null ? ebusGewaehlt : istEbus(nr) || offen.bereich.laden;
}

// Bekannter Akkustand der eingegebenen Busnummer (folgt der Nummer, solange nichts getippt wurde).
function akkuVorschlag() {
    const akku = akkuVon(normalisiere(eingabe));
    return akku === null ? '' : String(akku);
}

function kmVorschlag() {
    const km = kmVon(normalisiere(eingabe));
    return km === null ? '' : String(km);
}

function aktiviereFeld(neu, zeichnen = true) {
    if (neu === 'akku' && !akkuBearbeitet) {
        akkuEingabe = akkuVorschlag();
        akkuVorbelegt = akkuEingabe !== '';
    }
    if (neu === 'km' && !kmBearbeitet) {
        kmEingabe = kmVorschlag();
        kmVorbelegt = kmEingabe !== '';
    }
    feld = neu;
    hinweisExtra = '';
    if (zeichnen) renderEingabe();
}

function tasteAkku(t) {
    if (t === '⌫') akkuEingabe = akkuVorbelegt ? '' : akkuEingabe.slice(0, -1);
    else if (t === 'C') akkuEingabe = '';
    else if (/^[0-9]$/.test(t)) {
        const neu = (akkuVorbelegt ? '' : akkuEingabe) + t;
        if (Number(neu) > 100) {
            hinweisExtra = 'Höchstens 100 %';
            renderEingabe();
            return;
        }
        akkuEingabe = String(Number(neu));
    } else return;
    akkuVorbelegt = false;
    akkuBearbeitet = true;
    renderEingabe();
}

function tasteKm(t) {
    if (t === '⌫') kmEingabe = kmVorbelegt ? '' : kmEingabe.slice(0, -1);
    else if (t === 'C') kmEingabe = '';
    else if (/^[0-9]$/.test(t)) {
        const neu = (kmVorbelegt ? '' : kmEingabe) + t;
        if (Number(neu) > MAX_KM) {
            hinweisExtra = 'Höchstens ' + MAX_KM + ' km';
            renderEingabe();
            return;
        }
        kmEingabe = String(Number(neu));
    } else return;
    kmVorbelegt = false;
    kmBearbeitet = true;
    renderEingabe();
}

function taste(t) {
    if (!offen) return;
    hinweisExtra = '';
    if (feld === 'akku') { tasteAkku(t); return; }
    if (feld === 'km') { tasteKm(t); return; }
    if (t === '⌫') {
        eingabe = eingabeVorbelegt ? '' : eingabe.slice(0, -1);
    } else if (t === 'C') {
        eingabe = '';
    } else if (/^[0-9A-Z]$/.test(t)) {
        if (eingabeVorbelegt) eingabe = '';
        if (eingabe.length < MAX_ZIFFERN) eingabe += t;
    }
    eingabeVorbelegt = false;
    renderEingabe();
}

function uebernehmeEingabe() {
    const { bereich, platz } = offen;
    const nr = normalisiere(eingabe);
    if (!nr) { if (platz.bus) freigeben(bereich, platz); return; }
    const ebus = ebusAktiv();
    speicherePlatz(bereich, platz, nr, {
        ebus: ebusGewaehlt !== null ? ebus : undefined,
        akku: ebus && akkuBearbeitet ? (akkuEingabe === '' ? null : Number(akkuEingabe)) : undefined,
        km: ebus && kmBearbeitet ? (kmEingabe === '' ? null : Number(kmEingabe)) : undefined,
        rot: rotGewaehlt !== null ? rotGewaehlt : undefined
    });
}

function speichernUndSchliessen() {
    if (!offen) return;
    uebernehmeEingabe();
    schliesseEingabe();
}

function speichernUndWeiter() {
    if (!offen) return;
    // Bei E-Bussen erst noch Akkustand und Reichweite abfragen
    if (feld === 'bus' && ebusAktiv()) { aktiviereFeld('akku'); return; }
    if (feld === 'akku' && ebusAktiv()) { aktiviereFeld('km'); return; }
    speichereUndNaechster();
}

function speichereUndNaechster() {
    const { bereich, platz } = offen;
    uebernehmeEingabe();
    const weiter = naechsterPlatz(bereich, platz);
    if (weiter) oeffneEingabe(weiter.bereich, weiter.platz);
    else schliesseEingabe();
    return !!weiter;
}

// ---------- Toast ----------

// ---------- Spracheingabe ----------

const DIKTAT_HINWEIS = 'Ich höre zu … Nummer sagen, bei E-Bussen danach Akku und km';

// Durchsprechen: einmal antippen, dann Platz für Platz die Nummer (und bei E-Bussen den Akku) sagen.
// Ist ein Platz vollständig, wird gespeichert und der nächste geöffnet. "weiter" überspringt, "frei" gibt frei, "stopp" beendet.
function spracheImFenster() {
    if (diktat) { hoereAuf(); return; }
    diktat = true;
    zeigeDiktat();
    hinweisExtra = DIKTAT_HINWEIS;
    renderEingabe();
    hoereZu({
        beiZwischen: (text) => { hinweisExtra = '„' + text.trim() + '“ …'; renderEingabe(); },
        beiErgebnis: diktatErgebnis,
        beiFehler: (code) => { hinweisExtra = spracheFehlerText(code); renderEingabe(); },
        beiEnde: () => {
            diktat = false;
            zeigeDiktat();
            if (hinweisExtra === DIKTAT_HINWEIS) hinweisExtra = '';
            renderEingabe();
        }
    }, true);
}

// ---------- Rückmeldung beim Durchsprechen (Vibration + kurze Ansage) ----------

function ansageAn() {
    try { return localStorage.getItem(ANSAGE_KEY) !== 'aus'; } catch (e) { return true; }
}

function rueckmeldung(text, muster = 60) {
    try { if (navigator.vibrate) navigator.vibrate(muster); } catch (e) { /* ohne Vibration */ }
    if (text && ansageAn()) sprich(text);
}

// "1801" → "18 01" (wird als "achtzehn null eins" gesprochen), sonst Ziffer für Ziffer
function nummerZumSprechen(nr) {
    return /^\d{4}$/.test(nr) ? nr.slice(0, 2) + ' ' + nr.slice(2) : nr.split('').join(' ');
}

function gespeichertUndWeiter(ansage) {
    const weiter = speichereUndNaechster();
    rueckmeldung(ansage + (weiter ? '' : ', letzter Platz'), weiter ? 60 : [60, 80, 60]);
}

function zeigeDiktat() {
    $('#spracheBtn').setAttribute('aria-pressed', String(diktat));
    $('#spracheText').textContent = diktat ? 'Stopp' : 'Sprechen';
}

function diktatErgebnis(text) {
    if (!offen) return;
    const erkannt = versteheSprache(text);
    if (erkannt.befehl === 'stopp') { hoereAuf(); rueckmeldung('beendet', [40, 60, 40]); return; }
    const hatZahl = !!erkannt.bus || erkannt.akku !== null || erkannt.km !== null;
    if (!hatZahl && erkannt.frei) {
        eingabe = '';
        eingabeVorbelegt = false;
        gespeichertUndWeiter('frei');
        return;
    }
    if (!hatZahl && erkannt.rot !== null) {
        if (!normalisiere(eingabe)) { rueckmeldung(null, [60, 80, 60]); return; }
        schalteRot(erkannt.rot);
        rueckmeldung(erkannt.rot ? 'rote Karte' : 'fahrbereit');
        return;
    }
    if (!hatZahl && erkannt.befehl === 'weiter') {
        const nrJetzt = normalisiere(eingabe);
        gespeichertUndWeiter(nrJetzt ? nummerZumSprechen(nrJetzt) + ' gespeichert' : 'weiter');
        return;
    }
    // Nicht verstanden: nur vibrieren, nichts ansagen (eine Ansage könnte selbst wieder gehört werden)
    if (!wendeSpracheAn(text, erkannt)) { rueckmeldung(null, [60, 80, 60]); return; }
    const nr = normalisiere(eingabe);
    if (!nr) return;
    // Vollständig: normaler Bus, oder E-Bus mit Akku und Reichweite ("weiter" speichert, was da ist)
    if (erkannt.befehl === 'weiter' || !ebusAktiv() || (akkuBearbeitet && kmBearbeitet)) {
        gespeichertUndWeiter(nummerZumSprechen(nr) + ' gespeichert' + (rotAktiv() ? ', rote Karte' : ''));
    } else if (!akkuBearbeitet) {
        aktiviereFeld('akku', false);
        hinweisExtra = 'E-Bus ' + nr + ' – jetzt den Akku sagen (oder „weiter“)';
        renderEingabe();
        rueckmeldung('Akku', 30);
    } else {
        aktiviereFeld('km', false);
        hinweisExtra = 'E-Bus ' + nr + ' – jetzt die Reichweite in km sagen (oder „weiter“)';
        renderEingabe();
        rueckmeldung('Kilometer', 30);
    }
}

// Gesprochenes ins Eingabefenster übernehmen (gibt false zurück, wenn nichts verstanden wurde).
function wendeSpracheAn(text, erkannt) {
    if (!offen) return false;
    let akku = erkannt.akku;
    // "1801 64" ohne das Wort Akku: nur bei E-Bussen als Nummer + Akku lesen
    if (erkannt.teilung && (istEbus(erkannt.teilung.bus) || offen.bereich.laden)) {
        erkannt.bus = erkannt.teilung.bus;
        akku = erkannt.teilung.akku;
    }
    let km = erkannt.km;
    // Im Akku- bzw. km-Feld reicht eine Zahl ("64", "150")
    if (!erkannt.mitAkkuWort && feld === 'akku' && erkannt.bus && Number(erkannt.bus) <= 100) {
        akku = Number(erkannt.bus);
        erkannt.bus = null;
    } else if (!erkannt.mitAkkuWort && !erkannt.mitKmWort && feld === 'km' && erkannt.bus && Number(erkannt.bus) <= MAX_KM) {
        km = Number(erkannt.bus);
        erkannt.bus = null;
    }
    if (!erkannt.bus && akku === null && km === null) {
        if (erkannt.frei) {
            eingabe = '';
            eingabeVorbelegt = false;
            feld = 'bus';
            hinweisExtra = 'Verstanden: frei – mit „Speichern“ freigeben';
        } else {
            hinweisExtra = 'Nicht verstanden: „' + text.trim() + '“';
        }
        renderEingabe();
        return false;
    }
    if (erkannt.bus) {
        eingabe = erkannt.bus;
        eingabeVorbelegt = false;
        feld = 'bus';
    }
    if (erkannt.rot !== null && normalisiere(eingabe)) rotGewaehlt = erkannt.rot;
    if ((akku !== null || km !== null) && normalisiere(eingabe) && !ebusAktiv()) ebusGewaehlt = true;   // wer Akku/km nennt, meint einen E-Bus
    if (akku !== null && normalisiere(eingabe)) {
        akkuEingabe = String(akku);
        akkuVorbelegt = false;
        akkuBearbeitet = true;
        feld = 'akku';
    }
    if (km !== null && normalisiere(eingabe)) {
        kmEingabe = String(km);
        kmVorbelegt = false;
        kmBearbeitet = true;
        feld = 'km';
    }
    hinweisExtra = 'Verstanden: „' + text.trim() + '“';
    renderEingabe();
    return true;
}

function spracheInSuche() {
    const knopf = $('#sucheSpracheBtn');
    const feldEl = $('#suchFeld');
    if (hoertZu() && knopf.getAttribute('aria-pressed') === 'true') { hoereAuf(); return; }
    knopf.setAttribute('aria-pressed', 'true');
    feldEl.placeholder = 'Ich höre zu …';
    hoereZu({
        beiErgebnis: (text) => {
            const nr = versteheSprache(text).bus;
            if (!nr) { zeigeToast('Nicht verstanden: „' + text.trim() + '“'); return; }
            feldEl.value = nr;
            suchBegriff = normalisiere(nr);
            render();
            springeZuTreffer();
        },
        beiFehler: (code) => zeigeToast(spracheFehlerText(code)),
        beiEnde: () => {
            knopf.setAttribute('aria-pressed', 'false');
            feldEl.placeholder = 'Bus-Nr. suchen';
        }
    });
}

function zeigeToast(text, mitRueckgaengig) {
    $('#toastText').textContent = text;
    $('#toastRueckgaengig').hidden = !(mitRueckgaengig && rueckgaengigStand);
    $('#toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, mitRueckgaengig ? 6000 : 3000);
}

// ---------- Bereiche verwalten ----------

function leseFormular(form) {
    const name = form.elements.name.value.trim().slice(0, 40);
    const kuerzel = form.elements.kuerzel.value.trim().toUpperCase().slice(0, 6);
    const anzahl = Math.floor(Number(form.elements.anzahl.value));
    const start = Math.floor(Number(form.elements.start.value));
    const laden = form.elements.laden.checked;
    return { name, kuerzel, anzahl, start, laden };
}

function nameVergeben(name, ausserId) {
    return daten.bereiche.some((b) => b.id !== ausserId && b.name.toLowerCase() === name.toLowerCase());
}

function kuerzelVergeben(kuerzel, ausserId) {
    return kuerzel && daten.bereiche.some((b) => b.id !== ausserId && b.kuerzel === kuerzel);
}

function bereichAnlegen(form) {
    const { name, kuerzel, anzahl, start, laden } = leseFormular(form);
    if (!name || !(anzahl >= 1 && anzahl <= MAX_PLAETZE)) { zeigeToast('Bitte Name und 1–' + MAX_PLAETZE + ' Plätze angeben'); return; }
    if (!(start >= 0 && start <= MAX_STARTNR)) { zeigeToast('„Ab Nr.“ muss zwischen 0 und ' + MAX_STARTNR + ' liegen'); return; }
    if (nameVergeben(name)) { zeigeToast('Bereich „' + name + '“ gibt es schon'); return; }
    if (kuerzelVergeben(kuerzel)) { zeigeToast('Kürzel „' + kuerzel + '“ ist schon vergeben'); return; }
    merkeStand();
    const bereich = { id: neueId(), name, kuerzel, start, laden, plaetze: [] };
    for (let i = 0; i < anzahl; i++) bereich.plaetze.push({ id: neueId(), bus: null, zeit: null });
    daten.bereiche.push(bereich);
    aenderungFertig('Bereich „' + name + '“ mit ' + anzahl + ' Plätzen angelegt');
}

function bereichSpeichern(form) {
    const bereich = daten.bereiche.find((b) => b.id === form.dataset.bearbeiten);
    if (!bereich) return;
    const { name, kuerzel, anzahl, start, laden } = leseFormular(form);
    if (!name || !(anzahl >= 0 && anzahl <= MAX_PLAETZE)) { zeigeToast('Bitte Name und 0–' + MAX_PLAETZE + ' Plätze angeben'); return; }
    if (!(start >= 0 && start <= MAX_STARTNR)) { zeigeToast('„Ab Nr.“ muss zwischen 0 und ' + MAX_STARTNR + ' liegen'); return; }
    if (nameVergeben(name, bereich.id)) { zeigeToast('Bereich „' + name + '“ gibt es schon'); return; }
    if (kuerzelVergeben(kuerzel, bereich.id)) { zeigeToast('Kürzel „' + kuerzel + '“ ist schon vergeben'); return; }
    const wegfallend = bereich.plaetze.slice(anzahl).filter((p) => p.bus);
    if (wegfallend.length && !confirm('Auf den wegfallenden Plätzen stehen noch ' + wegfallend.length + ' Busse (' +
        wegfallend.map((p) => p.bus).join(', ') + '). Trotzdem verkleinern?')) return;
    merkeStand();
    const alterName = bereich.name;
    bereich.name = name;
    bereich.kuerzel = kuerzel;
    bereich.start = start;
    bereich.laden = laden;
    if (anzahl < bereich.plaetze.length) bereich.plaetze.length = anzahl;
    while (bereich.plaetze.length < anzahl) bereich.plaetze.push({ id: neueId(), bus: null, zeit: null });
    bearbeiteBereichId = null;
    aenderungFertig(alterName !== name
        ? 'Bereich „' + alterName + '“ umbenannt in „' + name + '“ (' + anzahl + ' Plätze)'
        : 'Bereich „' + name + '“ geändert (' + anzahl + ' Plätze)');
}

function fehlendeVorlage() {
    return VORLAGE.filter((v) => !nameVergeben(v.name));
}

function vorlageAnlegen() {
    const fehlend = fehlendeVorlage();
    if (!fehlend.length) { zeigeToast('Alle Bereiche der Vorlage sind schon angelegt'); return; }
    merkeStand();
    fehlend.forEach((v) => {
        const kuerzel = v.kuerzel && !kuerzelVergeben(v.kuerzel) ? v.kuerzel : '';
        const bereich = { id: neueId(), name: v.name, kuerzel, start: v.start || 1, laden: !!v.laden, plaetze: [] };
        for (let i = 0; i < v.anzahl; i++) bereich.plaetze.push({ id: neueId(), bus: null, zeit: null });
        daten.bereiche.push(bereich);
    });
    aenderungFertig('Vorlage: ' + fehlend.length + ' Bereiche angelegt');
}

function bereichLoeschen(id) {
    const bereich = daten.bereiche.find((b) => b.id === id);
    if (!bereich) return;
    const belegt = bereich.plaetze.filter((p) => p.bus).length;
    const frage = 'Bereich „' + bereich.name + '“ löschen?' + (belegt ? ' Dort stehen noch ' + belegt + ' Busse.' : '');
    if (!confirm(frage)) return;
    merkeStand();
    daten.bereiche = daten.bereiche.filter((b) => b.id !== id);
    aenderungFertig('Bereich „' + bereich.name + '“ gelöscht');
}

function bereichVerschieben(id, richtung) {
    const i = daten.bereiche.findIndex((b) => b.id === id);
    const j = i + richtung;
    if (i < 0 || j < 0 || j >= daten.bereiche.length) return;
    [daten.bereiche[i], daten.bereiche[j]] = [daten.bereiche[j], daten.bereiche[i]];
    speichern();
    render();
}

function alleLeeren() {
    const belegt = allePlaetze().filter((e) => e.platz.bus);
    if (!belegt.length || !confirm('Alle ' + belegt.length + ' erfassten Busse entfernen? Die Bereiche bleiben erhalten.')) return;
    merkeStand();
    belegt.forEach((e) => { e.platz.bus = null; e.platz.zeit = Date.now(); });
    aenderungFertig('Alle Plätze geleert (' + belegt.length + ' Busse)');
}

// ---------- Export / Import / Teilen ----------

function heuteDatei() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function exportieren() {
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stellplaetze-' + heuteDatei() + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function importieren(datei) {
    const leser = new FileReader();
    leser.onload = () => {
        let neu = null;
        try { neu = bereinige(JSON.parse(leser.result)); } catch (e) { neu = null; }
        if (!neu) { zeigeToast('Datei konnte nicht gelesen werden'); return; }
        const plaetze = neu.bereiche.reduce((s, b) => s + b.plaetze.length, 0);
        if (!confirm('Import ersetzt die aktuelle Belegung durch ' + neu.bereiche.length + ' Bereiche mit ' + plaetze + ' Plätzen. Fortfahren?')) return;
        merkeStand();
        daten = neu;
        bearbeiteBereichId = null;
        aenderungFertig('Daten importiert (' + neu.bereiche.length + ' Bereiche)');
    };
    leser.onerror = () => zeigeToast('Datei konnte nicht gelesen werden');
    leser.readAsText(datei);
}

function belegungAlsText() {
    const zeilen = ['Stellplätze – Stand ' + new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })];
    daten.bereiche.forEach((b) => {
        const belegt = b.plaetze.filter((p) => p.bus);
        if (!belegt.length) return;
        zeilen.push('', b.name + ':');
        belegt.forEach((p) => zeilen.push(kurzLabel(b, p) + ': ' + p.bus + (istRot(p.bus) ? ' · ROTE KARTE' : '') + (istEbus(p.bus) ? ' · ' + akkuText(p.bus) : '')));
    });
    return zeilen.join('\n');
}

async function teilen() {
    const text = belegungAlsText();
    try {
        if (navigator.share) { await navigator.share({ title: 'Stellplätze', text }); return; }
    } catch (e) {
        if (e && e.name === 'AbortError') return;
    }
    try {
        await navigator.clipboard.writeText(text);
        zeigeToast('Belegung in die Zwischenablage kopiert');
    } catch (e) {
        zeigeToast('Teilen nicht möglich');
    }
}

// ---------- Ereignisse ----------

function wechsleAnsicht(ansicht) {
    aktiveAnsicht = ansicht;
    if (ansicht !== 'Plaetze') zuweisenBus = null;
    bearbeiteBereichId = null;
    render();
    window.scrollTo(0, 0);
}

function springeZuTreffer() {
    const treffer = trefferListe();
    if (!treffer.length) return;
    if (aktiveAnsicht !== 'Plaetze') wechsleAnsicht('Plaetze');
    const kachel = document.querySelector('.platz[data-platz="' + CSS.escape(treffer[0].platz.id) + '"]');
    if (kachel) {
        kachel.scrollIntoView({ block: 'center', behavior: 'smooth' });
        kachel.classList.remove('blinken');
        void kachel.offsetWidth;
        kachel.classList.add('blinken');
    }
}

function starteZuweisen() {
    if (!suchBegriff) return;
    zuweisenBus = suchBegriff;
    if (aktiveAnsicht !== 'Plaetze') aktiveAnsicht = 'Plaetze';
    $('#suchFeld').blur();
    render();
}

function beendeZuweisen() {
    zuweisenBus = null;
    sprechStart = false;
    render();
}

function aufPlatzGetippt(bereichId, platzId) {
    const ziel = findePlatz(bereichId, platzId);
    if (!ziel) return;
    if (zuweisenBus) {
        const nr = zuweisenBus;
        zuweisenBus = null;
        suchBegriff = '';
        $('#suchFeld').value = '';
        if (ziel.platz.bus === nr) { render(); zeigeToast('Bus ' + nr + ' steht schon auf ' + platzLabel(ziel.bereich, ziel.platz)); return; }
        if (ziel.platz.bus && !confirm('Auf ' + platzLabel(ziel.bereich, ziel.platz) + ' steht Bus ' + ziel.platz.bus + '. Durch Bus ' + nr + ' ersetzen?')) { render(); return; }
        speicherePlatz(ziel.bereich, ziel.platz, nr);
        return;
    }
    oeffneEingabe(ziel.bereich, ziel.platz);
    if (sprechStart) {
        sprechStart = false;
        render();
        spracheImFenster();
    }
}

// Schnellstart vom App-Symbol (Manifest "shortcuts"): ?aktion=suchen oder ?aktion=sprechen
function schnellstart() {
    const aktion = new URLSearchParams(location.search).get('aktion');
    if (!aktion) return;
    history.replaceState(null, '', location.pathname);
    if (aktion === 'suchen') {
        const feldEl = $('#suchFeld');
        feldEl.focus();
        feldEl.select();
    } else if (aktion === 'sprechen' && spracheVerfuegbar() && daten.bereiche.length) {
        sprechStart = true;
        render();
    }
}

function init() {
    document.querySelector('.tabbar').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-ansicht]');
        if (btn) wechsleAnsicht(btn.dataset.ansicht);
    });

    const suchFeld = $('#suchFeld');
    suchFeld.addEventListener('input', () => {
        suchBegriff = normalisiere(suchFeld.value);
        if (!suchBegriff) zuweisenBus = null;
        render();
    });
    suchFeld.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); springeZuTreffer(); suchFeld.blur(); }
    });

    $('#suchErgebnis').addEventListener('click', (e) => {
        if (e.target.closest('[data-aktion="zuweisen"]')) starteZuweisen();
        else springeZuTreffer();
    });
    $('#zuweisenAbbrechen').addEventListener('click', beendeZuweisen);
    $('#schnellwahlBtn').addEventListener('click', () => schalteSchnellwahl(!schnellwahlOffen));
    $('#sprungLeiste').addEventListener('click', (e) => {
        const chip = e.target.closest('[data-sprung]');
        if (!chip) return;
        schalteSchnellwahl(false);
        springeZuBereich(chip.dataset.sprung);
    });

    zeigeThema();
    $('#themaBtn').addEventListener('click', schalteThema);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', zeigeThema);

    // Klicks in den Ansichten (Kacheln, Listenzeilen, Knöpfe)
    document.querySelector('main').addEventListener('click', (e) => {
        const platzEl = e.target.closest('[data-platz]');
        if (platzEl) { aufPlatzGetippt(platzEl.dataset.bereich, platzEl.dataset.platz); return; }
        const btn = e.target.closest('[data-aktion]');
        if (!btn || btn.disabled) return;
        const id = btn.dataset.id;
        switch (btn.dataset.aktion) {
            case 'zu-bereichen': wechsleAnsicht('Bereiche'); break;
            case 'vorlage': vorlageAnlegen(); break;
            case 'teilen': teilen(); break;
            case 'verlauf-leeren':
                if (confirm('Verlauf löschen? Die Belegung bleibt erhalten.')) { daten.verlauf = []; speichern(); render(); }
                break;
            case 'hoch': bereichVerschieben(id, -1); break;
            case 'runter': bereichVerschieben(id, 1); break;
            case 'bearbeiten': bearbeiteBereichId = id; render(); break;
            case 'bearbeiten-abbrechen': bearbeiteBereichId = null; render(); break;
            case 'bereich-loeschen': bereichLoeschen(id); break;
            case 'export': exportieren(); break;
            case 'import': $('#importDatei').click(); break;
            case 'alle-leeren': alleLeeren(); break;
        }
    });

    document.querySelector('main').addEventListener('change', (e) => {
        if (e.target.name !== 'ansage') return;
        try { localStorage.setItem(ANSAGE_KEY, e.target.checked ? 'an' : 'aus'); } catch (err) { /* nur bis zum Schließen */ }
    });

    document.querySelector('main').addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.id === 'formNeu') bereichAnlegen(e.target);
        else if (e.target.dataset.bearbeiten) bereichSpeichern(e.target);
    });

    $('#importDatei').addEventListener('change', (e) => {
        const datei = e.target.files && e.target.files[0];
        if (datei) importieren(datei);
        e.target.value = '';
    });

    // Eingabefenster
    $('#tastatur').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-taste]');
        if (btn) taste(btn.dataset.taste);
    });
    $('#anzeigen').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-feld]');
        if (btn && offen) aktiviereFeld(btn.dataset.feld);
    });
    $('#rotSchalter').addEventListener('click', () => { if (offen) schalteRot(!rotAktiv()); });
    $('#ebusSchalter').addEventListener('click', () => {
        if (!offen) return;
        ebusGewaehlt = !ebusAktiv();
        if (ebusGewaehlt) aktiviereFeld('akku');
        else { feld = 'bus'; renderEingabe(); }
    });
    if (spracheVerfuegbar()) {
        $('#spracheBtn').hidden = false;
        $('#sucheSpracheBtn').hidden = false;
        $('#spracheBtn').addEventListener('click', spracheImFenster);
        $('#sucheSpracheBtn').addEventListener('click', spracheInSuche);
    }
    $('#btnSpeichern').addEventListener('click', speichernUndSchliessen);
    $('#btnWeiter').addEventListener('click', speichernUndWeiter);
    $('#btnFreigeben').addEventListener('click', () => {
        if (!offen) return;
        freigeben(offen.bereich, offen.platz);
        schliesseEingabe();
    });
    $('#sheetSchliessen').addEventListener('click', schliesseEingabe);
    $('#sheetHintergrund').addEventListener('click', schliesseEingabe);

    // Hardware-Tastatur im Eingabefenster
    document.addEventListener('keydown', (e) => {
        if (!offen || e.ctrlKey || e.metaKey || e.altKey) return;
        const k = e.key;
        if (k === 'Escape') { e.preventDefault(); schliesseEingabe(); }
        else if (k === 'Enter') { e.preventDefault(); if (e.shiftKey) speichernUndSchliessen(); else speichernUndWeiter(); }
        else if (k === 'Backspace') { e.preventDefault(); taste('⌫'); }
        else if (k === 'Delete') { e.preventDefault(); taste('C'); }
        else if (k.length === 1 && /[0-9a-z]/i.test(k)) { e.preventDefault(); taste(k.toUpperCase()); }
        else if (k === 'Tab') {
            // Fokus im Fenster halten
            const fokusierbar = Array.from($('#eingabeSheet').querySelectorAll('button:not([disabled])'));
            const erstes = fokusierbar[0];
            const letztes = fokusierbar[fokusierbar.length - 1];
            if (e.shiftKey && (document.activeElement === erstes || document.activeElement === $('#eingabeSheet'))) { e.preventDefault(); letztes.focus(); }
            else if (!e.shiftKey && document.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
        }
    });

    $('#toastRueckgaengig').addEventListener('click', () => {
        $('#toast').hidden = true;
        rueckgaengig();
    });

    // Andere offene Tabs/Fenster: Änderungen übernehmen
    window.addEventListener('storage', (e) => {
        if (e.key !== SPEICHER_KEY) return;
        daten = laden();
        aktualisiereOffen();
        render();
    });

    // Uhrzeiten ("heute" vs. Datum) aktuell halten
    setInterval(() => { if (!offen && aktiveAnsicht !== 'Bereiche') render(); }, 60000);

    render();
    schnellstart();

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    }
}

init();
