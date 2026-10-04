'use strict';

// Stellplätze: erfasst, auf welchem Stellplatz welcher Bus (Nummer) steht.
// Alle Daten liegen nur auf diesem Gerät (localStorage), Export/Import als JSON-Datei.

const SPEICHER_KEY = 'stellplatz-daten-v1';
const MAX_VERLAUF = 300;
const MAX_ZIFFERN = 8;
const MAX_PLAETZE = 200;

let daten = laden();
let rueckgaengigStand = null;
let aktiveAnsicht = 'Plaetze';
let suchBegriff = '';
let zuweisenBus = null;        // Busnummer, die beim nächsten Tippen auf einen Platz abgestellt wird
let offen = null;              // { bereich, platz } im Eingabefenster
let eingabe = '';
let eingabeVorbelegt = false;  // erste Taste ersetzt die vorhandene Nummer
let fokusVorSheet = null;
let toastTimer = null;
let bearbeiteBereichId = null;

const $ = (sel) => document.querySelector(sel);

// ---------- Daten ----------

function neueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function leererStand() {
    return { version: 1, bereiche: [], verlauf: [] };
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

function platzLabel(bereich, platz) {
    const nr = bereich.plaetze.indexOf(platz) + 1;
    return bereich.kuerzel ? bereich.kuerzel + nr : bereich.name + ' ' + nr;
}

function allePlaetze() {
    const liste = [];
    daten.bereiche.forEach((bereich) => bereich.plaetze.forEach((platz) => liste.push({ bereich, platz })));
    return liste;
}

function findeBus(nr) {
    return allePlaetze().find((e) => e.platz.bus === nr) || null;
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

function setzeBus(bereich, platz, roh) {
    const nr = normalisiere(roh);
    if (!nr || platz.bus === nr) return;
    merkeStand();
    const vorher = findeBus(nr);
    let text = vorher
        ? 'Bus ' + nr + ': ' + platzLabel(vorher.bereich, vorher.platz) + ' → ' + platzLabel(bereich, platz)
        : 'Bus ' + nr + ' → ' + platzLabel(bereich, platz);
    if (vorher) {
        vorher.platz.bus = null;
        vorher.platz.zeit = Date.now();
    }
    if (platz.bus) text += ' (Bus ' + platz.bus + ' entfernt)';
    platz.bus = nr;
    platz.zeit = Date.now();
    aenderungFertig(text);
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
    $('#statusZeile').textContent = alle.length ? belegt + ' von ' + alle.length + ' Plätzen belegt' : 'Noch keine Plätze angelegt';

    document.querySelectorAll('.tabbar button').forEach((btn) => {
        const aktiv = btn.dataset.ansicht === aktiveAnsicht;
        btn.classList.toggle('aktiv', aktiv);
        if (aktiv) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
    });
    ['Plaetze', 'Liste', 'Verlauf', 'Bereiche'].forEach((a) => { $('#ansicht' + a).hidden = a !== aktiveAnsicht; });
    $('.suche').hidden = aktiveAnsicht === 'Bereiche' || aktiveAnsicht === 'Verlauf';

    renderSuchErgebnis();
    renderZuweisen();
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
            esc(platzLabel(genau.bereich, genau.platz)) + '</strong><span class="leise">' + esc(genau.bereich.name) +
            (genau.platz.zeit ? ' · seit ' + esc(zeitText(genau.platz.zeit)) : '') + '</span></div>' +
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
    banner.hidden = !zuweisenBus || aktiveAnsicht !== 'Plaetze';
    if (zuweisenBus) $('#zuweisenText').textContent = 'Bus ' + zuweisenBus + ': tippe auf den Platz, wo er steht';
    document.body.classList.toggle('zuweisen-modus', !!zuweisenBus && aktiveAnsicht === 'Plaetze');
}

function renderPlaetze() {
    const el = $('#ansichtPlaetze');
    if (!daten.bereiche.length) {
        el.innerHTML = '<div class="karte leer-zustand"><h2>Willkommen!</h2><p>Lege zuerst deine Stellplätze an – z. B. „Reihe A“ mit 12 Plätzen. ' +
            'Danach tippst du einfach auf einen Platz und gibst die Busnummer ein.</p>' +
            '<button type="button" class="btn primaer" data-aktion="zu-bereichen">Bereiche anlegen</button></div>';
        return;
    }
    const trefferIds = new Set(trefferListe().map((e) => e.platz.id));
    el.innerHTML = daten.bereiche.map((bereich) => {
        const belegt = bereich.plaetze.filter((p) => p.bus).length;
        const kacheln = bereich.plaetze.map((platz) => {
            const klassen = ['platz', platz.bus ? 'belegt' : 'frei'];
            if (trefferIds.has(platz.id)) klassen.push('treffer');
            const label = platzLabel(bereich, platz);
            return '<button type="button" class="' + klassen.join(' ') + '" data-bereich="' + esc(bereich.id) + '" data-platz="' + esc(platz.id) + '"' +
                ' aria-label="Platz ' + esc(label) + ': ' + (platz.bus ? 'Bus ' + esc(platz.bus) : 'frei') + '">' +
                '<span class="platz-label">' + esc(label) + '</span>' +
                '<span class="platz-bus">' + (platz.bus ? esc(platz.bus) : 'frei') + '</span>' +
                '<span class="platz-zeit">' + (platz.bus ? esc(zeitText(platz.zeit)) : '&nbsp;') + '</span>' +
                '</button>';
        }).join('');
        return '<section class="bereich"><div class="bereich-kopf"><h2>' + esc(bereich.name) + '</h2>' +
            '<span class="leise">' + belegt + ' / ' + bereich.plaetze.length + ' belegt</span></div>' +
            (bereich.plaetze.length ? '<div class="raster">' + kacheln + '</div>' : '<p class="leise">Keine Plätze in diesem Bereich.</p>') +
            '</section>';
    }).join('');
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
        '<span class="zeile-platz">' + esc(platzLabel(e.bereich, e.platz)) + '<span class="leise">' + esc(e.bereich.name) + '</span></span>' +
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

function vorschlagKuerzel() {
    const benutzt = new Set(daten.bereiche.map((b) => b.kuerzel));
    for (let i = 0; i < 26; i++) {
        const k = String.fromCharCode(65 + i);
        if (!benutzt.has(k)) return k;
    }
    return '';
}

function renderBereiche() {
    const el = $('#ansichtBereiche');
    const k = vorschlagKuerzel();
    const neu = '<form class="karte formular" id="formNeu">' +
        '<h2>Neuer Bereich</h2>' +
        '<div class="felder">' +
        '<label>Name<input name="name" required maxlength="40" value="' + esc(k ? 'Reihe ' + k : '') + '"></label>' +
        '<label>Kürzel<input name="kuerzel" maxlength="6" value="' + esc(k) + '" autocapitalize="characters"></label>' +
        '<label>Plätze<input name="anzahl" type="number" inputmode="numeric" min="1" max="' + MAX_PLAETZE + '" required value="10"></label>' +
        '</div>' +
        '<p class="leise klein-text">Die Plätze heißen dann Kürzel + Nummer, z. B. A1, A2, …</p>' +
        '<button type="submit" class="btn primaer">Bereich anlegen</button>' +
        '</form>';

    const liste = daten.bereiche.map((b, i) => {
        if (b.id === bearbeiteBereichId) {
            return '<form class="karte formular" data-bearbeiten="' + esc(b.id) + '">' +
                '<div class="felder">' +
                '<label>Name<input name="name" required maxlength="40" value="' + esc(b.name) + '"></label>' +
                '<label>Kürzel<input name="kuerzel" maxlength="6" value="' + esc(b.kuerzel) + '" autocapitalize="characters"></label>' +
                '<label>Plätze<input name="anzahl" type="number" inputmode="numeric" min="0" max="' + MAX_PLAETZE + '" required value="' + b.plaetze.length + '"></label>' +
                '</div>' +
                '<div class="knopfreihe"><button type="button" class="btn" data-aktion="bearbeiten-abbrechen">Abbrechen</button>' +
                '<button type="submit" class="btn primaer">Speichern</button></div>' +
                '</form>';
        }
        const belegt = b.plaetze.filter((p) => p.bus).length;
        const bereichsText = b.plaetze.length
            ? platzLabel(b, b.plaetze[0]) + (b.plaetze.length > 1 ? ' – ' + platzLabel(b, b.plaetze[b.plaetze.length - 1]) : '')
            : 'keine Plätze';
        return '<div class="karte bereich-zeile">' +
            '<div class="bereich-info"><strong>' + esc(b.name) + '</strong>' +
            '<span class="leise">' + esc(bereichsText) + ' · ' + belegt + '/' + b.plaetze.length + ' belegt</span></div>' +
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

    el.innerHTML = neu + liste + werkzeuge;
}

// ---------- Eingabefenster (Ziffernblock) ----------

function oeffneEingabe(bereich, platz) {
    const warSchonOffen = !!offen;
    offen = { bereich, platz };
    eingabe = platz.bus || '';
    eingabeVorbelegt = !!platz.bus;
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
    $('#sheetTitel').textContent = 'Platz ' + platzLabel(bereich, platz);
    $('#sheetInfo').textContent = bereich.name + ' · ' + (platz.bus ? 'jetzt: Bus ' + platz.bus + (platz.zeit ? ' (seit ' + zeitText(platz.zeit) + ')' : '') : 'frei');
    $('#anzeigeText').textContent = eingabe;
    $('#anzeige').classList.toggle('vorbelegt', eingabeVorbelegt);
    $('#anzeige').classList.toggle('leer', !eingabe);

    let hinweis = '';
    const nr = normalisiere(eingabe);
    if (nr && nr !== platz.bus) {
        const woanders = findeBus(nr);
        if (woanders) hinweis = 'Bus ' + nr + ' steht auf ' + platzLabel(woanders.bereich, woanders.platz) + ' – wird hierher umgesetzt.';
        else if (platz.bus) hinweis = 'Bus ' + platz.bus + ' wird hier ersetzt.';
    } else if (!nr && platz.bus) {
        hinweis = 'Leer speichern gibt den Platz frei.';
    }
    $('#sheetHinweis').textContent = hinweis;

    $('#btnFreigeben').disabled = !platz.bus;
    const weiter = naechsterPlatz(bereich, platz);
    $('#btnWeiter').textContent = weiter ? 'Weiter › ' + platzLabel(weiter.bereich, weiter.platz) : 'Fertig';
}

function markiereKachel(platzId) {
    document.querySelectorAll('.platz.aktuell').forEach((k) => k.classList.remove('aktuell'));
    const kachel = document.querySelector('.platz[data-platz="' + CSS.escape(platzId) + '"]');
    if (kachel) {
        kachel.classList.add('aktuell');
        kachel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function taste(t) {
    if (!offen) return;
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
    if (nr) setzeBus(bereich, platz, nr);
    else if (platz.bus) freigeben(bereich, platz);
}

function speichernUndSchliessen() {
    if (!offen) return;
    uebernehmeEingabe();
    schliesseEingabe();
}

function speichernUndWeiter() {
    if (!offen) return;
    const { bereich, platz } = offen;
    uebernehmeEingabe();
    const weiter = naechsterPlatz(bereich, platz);
    if (weiter) oeffneEingabe(weiter.bereich, weiter.platz);
    else schliesseEingabe();
}

// ---------- Toast ----------

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
    return { name, kuerzel, anzahl };
}

function kuerzelVergeben(kuerzel, ausserId) {
    return kuerzel && daten.bereiche.some((b) => b.id !== ausserId && b.kuerzel === kuerzel);
}

function bereichAnlegen(form) {
    const { name, kuerzel, anzahl } = leseFormular(form);
    if (!name || !(anzahl >= 1 && anzahl <= MAX_PLAETZE)) { zeigeToast('Bitte Name und 1–' + MAX_PLAETZE + ' Plätze angeben'); return; }
    if (kuerzelVergeben(kuerzel)) { zeigeToast('Kürzel „' + kuerzel + '“ ist schon vergeben'); return; }
    merkeStand();
    const bereich = { id: neueId(), name, kuerzel, plaetze: [] };
    for (let i = 0; i < anzahl; i++) bereich.plaetze.push({ id: neueId(), bus: null, zeit: null });
    daten.bereiche.push(bereich);
    aenderungFertig('Bereich „' + name + '“ mit ' + anzahl + ' Plätzen angelegt');
}

function bereichSpeichern(form) {
    const bereich = daten.bereiche.find((b) => b.id === form.dataset.bearbeiten);
    if (!bereich) return;
    const { name, kuerzel, anzahl } = leseFormular(form);
    if (!name || !(anzahl >= 0 && anzahl <= MAX_PLAETZE)) { zeigeToast('Bitte Name und 0–' + MAX_PLAETZE + ' Plätze angeben'); return; }
    if (kuerzelVergeben(kuerzel, bereich.id)) { zeigeToast('Kürzel „' + kuerzel + '“ ist schon vergeben'); return; }
    const wegfallend = bereich.plaetze.slice(anzahl).filter((p) => p.bus);
    if (wegfallend.length && !confirm('Auf den wegfallenden Plätzen stehen noch ' + wegfallend.length + ' Busse (' +
        wegfallend.map((p) => p.bus).join(', ') + '). Trotzdem verkleinern?')) return;
    merkeStand();
    bereich.name = name;
    bereich.kuerzel = kuerzel;
    if (anzahl < bereich.plaetze.length) bereich.plaetze.length = anzahl;
    while (bereich.plaetze.length < anzahl) bereich.plaetze.push({ id: neueId(), bus: null, zeit: null });
    bearbeiteBereichId = null;
    aenderungFertig('Bereich „' + name + '“ geändert (' + anzahl + ' Plätze)');
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
        belegt.forEach((p) => zeilen.push(platzLabel(b, p) + ': ' + p.bus));
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
        setzeBus(ziel.bereich, ziel.platz, nr);
        return;
    }
    oeffneEingabe(ziel.bereich, ziel.platz);
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

    // Klicks in den Ansichten (Kacheln, Listenzeilen, Knöpfe)
    document.querySelector('main').addEventListener('click', (e) => {
        const platzEl = e.target.closest('[data-platz]');
        if (platzEl) { aufPlatzGetippt(platzEl.dataset.bereich, platzEl.dataset.platz); return; }
        const btn = e.target.closest('[data-aktion]');
        if (!btn || btn.disabled) return;
        const id = btn.dataset.id;
        switch (btn.dataset.aktion) {
            case 'zu-bereichen': wechsleAnsicht('Bereiche'); break;
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

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    }
}

init();
