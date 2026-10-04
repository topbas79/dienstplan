'use strict';

// Spracheingabe über die eingebaute Spracherkennung des Browsers (Chrome auf Android, Safari).
// Verstanden werden Busnummer und Akkustand, z. B. "1801 Akku 64", "Bus 1801 mit 64 Prozent" oder nur "Akku 80".
// Die Erkennung selbst läuft über den Browser-Hersteller (braucht Internet); die App schickt nichts selbst weg.

const SpracheKlasse = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let laufendeErkennung = null;

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
    const text = ' ' + String(roh).toLowerCase().replace(/%/g, ' prozent ').replace(/[.,;:!?/-]/g, ' ') + ' ';
    const ergebnis = { bus: null, akku: null, frei: false, mitAkkuWort: false };
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
    const busZiffern = zahlenIn(busTeil).join('');
    if (busZiffern) ergebnis.bus = busZiffern.slice(0, 8);
    const akkuZahlen = zahlenIn(akkuTeil);
    if (akkuZahlen.length && Number(akkuZahlen[0]) <= 100) ergebnis.akku = Number(akkuZahlen[0]);
    ergebnis.frei = /\s(frei|freigeben|leer|weg)\s/.test(text);
    return ergebnis;
}

function spracheVerfuegbar() {
    return !!SpracheKlasse;
}

// Startet einmaliges Zuhören. Rückrufe: beiZwischen(text), beiErgebnis(text), beiFehler(code), beiEnde().
function hoereZu(rueckrufe) {
    if (laufendeErkennung) laufendeErkennung.abort();
    const erkennung = new SpracheKlasse();
    erkennung.lang = 'de-DE';
    erkennung.interimResults = true;
    erkennung.continuous = false;
    erkennung.maxAlternatives = 1;
    erkennung.onresult = (e) => {
        let text = '';
        let endgueltig = false;
        for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
            if (e.results[i].isFinal) endgueltig = true;
        }
        if (endgueltig) rueckrufe.beiErgebnis(text);
        else if (rueckrufe.beiZwischen) rueckrufe.beiZwischen(text);
    };
    erkennung.onerror = (e) => {
        if (e.error !== 'aborted') rueckrufe.beiFehler(e.error);
    };
    erkennung.onend = () => {
        if (laufendeErkennung === erkennung) laufendeErkennung = null;
        rueckrufe.beiEnde();
    };
    laufendeErkennung = erkennung;
    try {
        erkennung.start();
    } catch (e) {
        laufendeErkennung = null;
        rueckrufe.beiFehler('start');
        rueckrufe.beiEnde();
    }
}

function hoereAuf() {
    if (laufendeErkennung) laufendeErkennung.abort();
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
