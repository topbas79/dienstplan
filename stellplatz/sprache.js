'use strict';

// Spracheingabe über die eingebaute Spracherkennung des Browsers (Chrome auf Android, Safari).
// Verstanden werden Busnummer, Akkustand und Reichweite, z. B. "1801 Akku 64 Reichweite 150",
// "Bus 1801 mit 64 Prozent, 150 Kilometer" oder nur "Akku 80",
// dazu die Befehle "weiter", "frei" und "stopp" für das Durchsprechen ganzer Reihen
// sowie "rote Karte" (defekt, nicht fahrbereit) und "fahrbereit" (rote Karte weg).
// Die Erkennung selbst läuft über den Browser-Hersteller (braucht Internet); die App schickt nichts selbst weg.

const SpracheKlasse = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const DAUER_STILLE_MS = 120000;   // Dauer-Zuhören endet nach 2 Minuten ohne Erkanntes
const MAX_KM = 999;
let laufendeErkennung = null;
let laufendeRueckrufe = null;
let dauerAktiv = false;
let pausiert = false;          // während einer Ansage hört die Erkennung nicht zu (sonst hört sie sich selbst)
let letzteAnsagen = [];        // { text, bis }: eigene Ansagen, die das Mikrofon nachträglich noch auffangen könnte

const EINER = { null: 0, ein: 1, eins: 1, eine: 1, zwei: 2, zwo: 2, drei: 3, vier: 4, 'fünf': 5, sechs: 6, sieben: 7, acht: 8, neun: 9 };
const ZEHNER_BIS_19 = { zehn: 10, elf: 11, 'zwölf': 12, dreizehn: 13, vierzehn: 14, 'fünfzehn': 15, sechzehn: 16, siebzehn: 17, achtzehn: 18, neunzehn: 19 };
const ZEHNER = { zwanzig: 20, 'dreißig': 30, dreissig: 30, vierzig: 40, 'fünfzig': 50, sechzig: 60, siebzig: 70, achtzig: 80, neunzig: 90 };

function hat(tabelle, wort) {
    return Object.prototype.hasOwnProperty.call(tabelle, wort);
}

// Ausgeschriebene Zahl bis 9999 → Zahl, sonst null ("vierundsechzig" → 64, "achtzehnhunderteins" → 1801).
function zahlAusWort(wort) {
    if (!wort) return null;
    const t = wort.indexOf('tausend');
    if (t >= 0) {
        const vorne = t === 0 ? 1 : zahlUnter100(wort.slice(0, t));
        const hinten = wort.slice(t + 7);
        const rest = hinten ? zahlUnter1000(hinten) : 0;
        return vorne === null || rest === null ? null : vorne * 1000 + rest;
    }
    return zahlUnter1000(wort);
}

function zahlUnter1000(wort) {
    const h = wort.indexOf('hundert');
    if (h >= 0) {
        // "achtzehnhundert..." (18 × 100) ist bei Busnummern üblich, daher bis 99 vorne erlaubt
        const vorne = h === 0 ? 1 : zahlUnter100(wort.slice(0, h));
        const hinten = wort.slice(h + 7).replace(/^und/, '');
        const rest = hinten ? zahlUnter100(hinten) : 0;
        return vorne === null || rest === null ? null : vorne * 100 + rest;
    }
    return zahlUnter100(wort);
}

function zahlUnter100(wort) {
    if (hat(EINER, wort)) return EINER[wort];
    if (hat(ZEHNER_BIS_19, wort)) return ZEHNER_BIS_19[wort];
    if (hat(ZEHNER, wort)) return ZEHNER[wort];
    const und = wort.match(/^(.+)und(.+)$/);
    if (und && hat(EINER, und[1]) && hat(ZEHNER, und[2])) return EINER[und[1]] + ZEHNER[und[2]];
    return null;
}

// Alle Zahlen in einem Text, als Ziffernfolgen ("18 01" → ["18", "01"], "eins acht" → ["1", "8"]).
function zahlenIn(text) {
    const zahlen = [];
    text.split(/\s+/).forEach((wort) => {
        if (/^\d+$/.test(wort)) { zahlen.push(wort); return; }
        const zahl = zahlAusWort(wort);
        if (zahl !== null) zahlen.push(String(zahl));
    });
    return zahlen;
}

function ohneLeerzeichen(text) {
    return String(text).toLowerCase().replace(/[^0-9a-zäöüß]/g, '');
}

// Hat das Mikrofon gerade eine eigene Ansage aufgefangen? (Android meldet das Ende der Ansage oft zu früh.)
function istEcho(text) {
    const jetzt = Date.now();
    letzteAnsagen = letzteAnsagen.filter((a) => a.bis > jetzt);
    const gehoert = ohneLeerzeichen(text);
    if (!gehoert) return true;
    return letzteAnsagen.some((a) => {
        // Nur Ziffern ("1801"): Echo nur, wenn es genau die angesagte Nummer ist – "23" als Akku nach "23 01 gespeichert" zählt
        if (/^\d+$/.test(gehoert)) return gehoert === a.text.replace(/\D/g, '');
        // Mit Wörtern: Echo, wenn das Gehörte ganz in der Ansage steckt ("Akku", "18 01 gespeichert"), nicht aber "Akku 64"
        return a.text.includes(gehoert);
    });
}

function versteheSprache(roh) {
    let text = ' ' + String(roh).toLowerCase().replace(/%/g, ' prozent ').replace(/[.,;:!?/-]/g, ' ').replace(/\s+/g, ' ') + ' ';
    const ergebnis = { bus: null, akku: null, km: null, frei: false, rot: null, mitAkkuWort: false, mitKmWort: false, befehl: null, teilung: null };
    // Rote Karte: "rote Karte"/"defekt"/"Werkstatt" → true, "fahrbereit"/"repariert"/"Karte weg" → false
    if (/ (fahrbereit|repariert|karte weg|keine rote karte) /.test(text)) ergebnis.rot = false;
    else if (/ (rote karte|defekt|werkstatt) /.test(text)) ergebnis.rot = true;
    text = text.replace(/ (keine rote karte|rote karte|karte weg|fahrbereit|repariert|defekt|werkstatt)(?= )/g, ' ');
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
    ergebnis.frei = /\s(frei|freigeben|leer)\s/.test(text);
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
    pausiert = false;
    let letzteAktivitaet = Date.now();
    erkennung.onresult = (e) => {
        if (pausiert) return;
        letzteAktivitaet = Date.now();
        let zwischen = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            const text = e.results[i][0].transcript;
            if (istEcho(text)) continue;
            if (e.results[i].isFinal) rueckrufe.beiErgebnis(text);
            else zwischen += text;
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
        if (pausiert) return;   // geht nach der Ansage weiter
        if (dauerAktiv && Date.now() - letzteAktivitaet < DAUER_STILLE_MS) {
            try { erkennung.start(); return; } catch (e) { /* unten beenden */ }
        }
        dauerAktiv = false;
        laufendeErkennung = null;
        rueckrufe.beiEnde();
    };
    laufendeErkennung = erkennung;
    laufendeRueckrufe = rueckrufe;
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
    if (pausiert && laufendeErkennung) {
        // während einer Ansage ist die Erkennung schon angehalten – Ende direkt melden
        pausiert = false;
        laufendeErkennung = null;
        if (laufendeRueckrufe) laufendeRueckrufe.beiEnde();
        return;
    }
    if (laufendeErkennung) {
        const erkennung = laufendeErkennung;
        laufendeErkennung = null;
        erkennung.abort();
    }
}

// Kurze Ansage (z. B. "18 01 gespeichert"). Läuft gerade Dauer-Zuhören, wird es dafür angehalten
// und danach fortgesetzt.
function sprich(text) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
    const ansage = new SpeechSynthesisUtterance(text);
    ansage.lang = 'de-DE';
    ansage.rate = 1.15;
    ansage.volume = 0.9;
    const erkennung = dauerAktiv ? laufendeErkennung : null;
    if (erkennung) {
        pausiert = true;
        try { erkennung.abort(); } catch (e) { /* schon beendet */ }
    }
    let fertig = false;
    const weiter = () => {
        if (fertig) return;
        fertig = true;
        if (!pausiert || laufendeErkennung !== erkennung || !erkennung) return;
        pausiert = false;
        if (!dauerAktiv) return;
        try {
            erkennung.start();
        } catch (e) {
            dauerAktiv = false;
            laufendeErkennung = null;
            if (laufendeRueckrufe) laufendeRueckrufe.beiEnde();
        }
    };
    // Mikrofon erst wieder an, wenn die Ansage sicher vorbei ist: nach dem gemeldeten Ende UND frühestens nach der
    // geschätzten Sprechdauer (Android meldet das Ende oft sofort, obwohl noch gesprochen wird).
    const beginn = Date.now();
    const dauer = 500 + text.length * 70;
    letzteAnsagen.push({ text: ohneLeerzeichen(text), bis: beginn + dauer + 2000 });
    const nachDemEnde = () => setTimeout(weiter, Math.max(300, beginn + dauer - Date.now()));
    ansage.onend = nachDemEnde;
    ansage.onerror = nachDemEnde;
    setTimeout(weiter, dauer + 5000);   // Sicherheitsnetz, falls das Ende der Ansage nie gemeldet wird
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(ansage);
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
