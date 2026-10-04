'use strict';

// Spracheingabe über die eingebaute Spracherkennung des Browsers (Chrome auf Android, Safari).
// Verstanden werden Busnummer, Akkustand und Reichweite, z. B. "1801 Akku 64 Reichweite 150",
// "Bus 1801 mit 64 Prozent, 150 Kilometer" oder nur "Akku 80",
// dazu die Befehle "weiter", "frei" und "stopp" für das Durchsprechen ganzer Reihen.
// Die Erkennung selbst läuft über den Browser-Hersteller (braucht Internet); die App schickt nichts selbst weg.

const SpracheKlasse = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const DAUER_STILLE_MS = 120000;
const MAX_KM = 999;   // Dauer-Zuhören endet nach 2 Minuten ohne Erkanntes
let laufendeErkennung = null;
let dauerAktiv = false;

const ZAHLWOERTER = {
    null: 0, eins: 1, ein: 1, eine: 1, zwei: 2, zwo: 2, drei: 3, vier: 4, 'fünf': 5, sechs: 6,
    sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, 'zwölf': 12, hundert: 100, einhundert: 100
};

// Alle Zahlen in einem Text, als Ziffernfolgen ("18 01" → ["18", "01"], "eins acht" → ["1", "8"]).
function zahlenIn(text) {
    const zahlen = [];
    text.split(/\s+/).forEach((wort) => {
        if (/^\d+$/.test(wort)) zahlen.push(wort);
        else if (Object.prototype.hasOwnProperty.call(ZAHLWOERTER, wort)) zahlen.push(String(ZAHLWOERTER[wort]));
    });
    return zahlen;
}

function versteheSprache(roh) {
    let text = ' ' + String(roh).toLowerCase().replace(/%/g, ' prozent ').replace(/[.,;:!?/-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const ergebnis = { bus: null, akku: null, km: null, frei: false, mitAkkuWort: false, mitKmWort: false, befehl: null, teilung: null };
    // Reichweite zuerst herauslösen: "Reichweite 150 (km)" oder "150 Kilometer/km"
    const kmNach = text.match(/ reichweite (\S+)( kilometer| km)? /);
    const kmVor = text.match(/ (\S+) (kilometer|km) /);
    const kmTreffer = kmNach || kmVor;
    if (kmTreffer) {
        const kmZahl = zahlenIn(kmTreffer[1]);
        if (kmZahl.length && Number(kmZahl[0]) <= MAX_KM) ergebnis.km = Number(kmZahl[0]);
        ergebnis.mitKmWort = true;
        text = text.slice(0, kmTreffer.index) + ' ' + text.slice(kmTreffer.index + kmTreffer[0].length);
    }
    let busTeil = text;
    let akkuTeil = '';
    const akkuWort = text.match(/\s(akku|batterie|ladung|ladestand)\s/);
    const prozent = text.match(/(\S+)\s+prozent\s/);
    if (akkuWort) {
        busTeil = text.slice(0, akkuWort.index);
        akkuTeil = text.slice(akkuWort.index + akkuWort[0].length);
        ergebnis.mitAkkuWort = true;
    } else if (prozent) {
        busTeil = text.slice(0, prozent.index);
        akkuTeil = prozent[1];
        ergebnis.mitAkkuWort = true;
    }
    const busZahlen = zahlenIn(busTeil);
    const busZiffern = busZahlen.join('');
    // "1801 64" ohne Akku-Wort: vorne mindestens 4 Ziffern, hinten bis 100 → mögliche Aufteilung Bus + Akku.
    // Ob sie gilt, entscheidet die App (nur bei E-Bussen), weil "18 01" auch einfach 1801 heißen kann.
    if (!ergebnis.mitAkkuWort && busZahlen.length >= 2) {
        const letzte = busZahlen[busZahlen.length - 1];
        const vorne = busZahlen.slice(0, -1).join('');
        if (vorne.length >= 4 && letzte.length <= 3 && Number(letzte) <= 100) {
            ergebnis.teilung = { bus: vorne.slice(0, 8), akku: Number(letzte) };
        }
    }
    if (busZiffern) ergebnis.bus = busZiffern.slice(0, 8);
    const akkuZahlen = zahlenIn(akkuTeil);
    if (akkuZahlen.length && Number(akkuZahlen[0]) <= 100) ergebnis.akku = Number(akkuZahlen[0]);
    ergebnis.frei = /\s(frei|freigeben|leer|weg)\s/.test(text);
    if (/\s(stopp|stop|stoppen|fertig|ende|beenden|aufhören)\s/.test(text)) ergebnis.befehl = 'stopp';
    else if (/\s(weiter|nächster|nächste|überspringen)\s/.test(text)) ergebnis.befehl = 'weiter';
    return ergebnis;
}

function spracheVerfuegbar() {
    return !!SpracheKlasse;
}

// Startet das Zuhören. Rückrufe: beiZwischen(text), beiErgebnis(text), beiFehler(code), beiEnde().
// dauer = true: hört weiter zu, bis hoereAuf() kommt (der Browser beendet die Erkennung nach Pausen selbst,
// dann wird sie still neu gestartet); jeder fertig gesprochene Satz kommt einzeln bei beiErgebnis an.
function hoereZu(rueckrufe, dauer = false) {
    if (laufendeErkennung) {
        dauerAktiv = false;
        laufendeErkennung.abort();
    }
    const erkennung = new SpracheKlasse();
    erkennung.lang = 'de-DE';
    erkennung.interimResults = true;
    erkennung.continuous = dauer;
    erkennung.maxAlternatives = 1;
    dauerAktiv = dauer;
    let letzteAktivitaet = Date.now();
    erkennung.onresult = (e) => {
        letzteAktivitaet = Date.now();
        let zwischen = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) rueckrufe.beiErgebnis(e.results[i][0].transcript);
            else zwischen += e.results[i][0].transcript;
        }
        if (zwischen && rueckrufe.beiZwischen) rueckrufe.beiZwischen(zwischen);
    };
    erkennung.onerror = (e) => {
        if (e.error === 'aborted' || (dauerAktiv && e.error === 'no-speech')) return;
        dauerAktiv = false;
        rueckrufe.beiFehler(e.error);
    };
    erkennung.onend = () => {
        if (laufendeErkennung !== erkennung) { rueckrufe.beiEnde(); return; }
        if (dauerAktiv && Date.now() - letzteAktivitaet < DAUER_STILLE_MS) {
            try { erkennung.start(); return; } catch (e) { /* unten beenden */ }
        }
        dauerAktiv = false;
        laufendeErkennung = null;
        rueckrufe.beiEnde();
    };
    laufendeErkennung = erkennung;
    try {
        erkennung.start();
    } catch (e) {
        laufendeErkennung = null;
        dauerAktiv = false;
        rueckrufe.beiFehler('start');
        rueckrufe.beiEnde();
    }
}

function hoereAuf() {
    dauerAktiv = false;
    if (laufendeErkennung) {
        const erkennung = laufendeErkennung;
        laufendeErkennung = null;
        erkennung.abort();
    }
}

function hoertZu() {
    return !!laufendeErkennung;
}

function spracheFehlerText(code) {
    if (code === 'not-allowed' || code === 'service-not-allowed') return 'Mikrofon nicht erlaubt – bitte in den Browser-Einstellungen zulassen';
    if (code === 'network') return 'Spracherkennung braucht Internet';
    if (code === 'no-speech') return 'Nichts gehört – bitte nochmal';
    if (code === 'audio-capture') return 'Kein Mikrofon gefunden';
    return 'Spracherkennung hat nicht geklappt';
}
