// PDF-Import fuer Dienstzettel aus dem IVU-Planungssystem: liest die Tabelle direkt aus dem Text der
// PDF aus - ohne KI, ohne Kosten, auch offline. Das Ergebnis hat exakt dieselbe Form wie die Antwort
// der Edge Function "dienstplan-lesen", damit Formular, Dienstverlauf, Kontrolle, Pausen-Pruefung und
// Widget unveraendert damit arbeiten.
(function (global) {
    'use strict';

    const ZEIT = /^(\d{1,2}):(\d{2})(\+?)$/;
    const WECHSEL_ANFANG = /^(Übernahme|Übergabe|Uebernahme|Uebergabe)\s+um\b/i;
    const X_TOLERANZ = 3;          // Spaltenposition in PDF-Punkten
    const ZEILEN_TOLERANZ = 20;    // groesster Abstand eines umgebrochenen Namens zur Zeilenmitte

    // Zeilentypen, die in der Fahrten-Liste erscheinen. "P" (Platzwechsel im selben Bahnhof, 0 Minuten)
    // und die Pausenzeilen gehoeren nicht dazu.
    const KEINE_FAHRT = ['P', 'BEZPAU', 'UNBPAU'];

    function zeitText(s) {
        const m = ZEIT.exec(String(s || '').trim());
        return m ? m[1].padStart(2, '0') + ':' + m[2] : '';
    }
    function zuMinuten(hhmm) {
        const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');
        return m ? Number(m[1]) * 60 + Number(m[2]) : null;
    }
    function minutenZwischen(von, bis) {
        const a = zuMinuten(von), b = zuMinuten(bis);
        if (a === null || b === null) return 0;
        return b >= a ? b - a : b + 24 * 60 - a;
    }
    function ascii(s) {
        return String(s || '').replace(/Ü/g, 'Ue').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/ä/g, 'ae')
            .replace(/Ö/g, 'Oe').replace(/ö/g, 'oe').replace(/ß/g, 'ss');
    }
    function zellenText(liste) {
        return (liste || []).slice()
            .sort((a, b) => (b.y - a.y) > 2 ? 1 : (a.y - b.y) > 2 ? -1 : a.x - b.x)
            .map(i => i.s).join(' ').replace(/\s+/g, ' ').trim();
    }

    // ---------- Kopfbereich: Beschriftung + Wert direkt darunter ----------
    function findeLabel(items, label) {
        const einzeln = items.find(i => i.s === label);
        if (einzeln) return einzeln;
        const woerter = label.split(' ');
        if (woerter.length < 2) return null;
        // Beschriftung auf mehrere Text-Elemente aufgeteilt: gleiche Zeile, Woerter nacheinander
        for (const start of items.filter(i => i.s === woerter[0])) {
            const zeile = items.filter(i => Math.abs(i.y - start.y) <= 2 && i.x >= start.x).sort((a, b) => a.x - b.x);
            if (zeile.slice(0, woerter.length).map(i => i.s).join(' ') === label) return start;
        }
        return null;
    }
    const KOPF_LABELS = ['Datum', 'Dienstnummer', 'Beginn', 'Ende', 'Dienstdauer', 'Betriebshof', 'Bezahlte Zeit', 'Pausenregel',
        'Unbezahlte Pausenzeit', 'Pausenzeit', 'Nachtminuten', 'Samstagsminuten', 'Sonntagsminuten', 'Feiertagsminuten', 'Kommentar'];
    function kopfWert(items, label) {
        const l = findeLabel(items, label);
        if (!l) return '';
        // Der Wert steht direkt unter der Beschriftung. Ist er leer, darf nicht die naechste Beschriftung darunter gelesen werden.
        const darunter = items.filter(i => i.y < l.y - 2 && l.y - i.y <= 30 && Math.abs(i.x - l.x) <= 4)
            .sort((a, b) => b.y - a.y);
        const wert = darunter[0];
        return wert && !KOPF_LABELS.includes(wert.s) ? wert.s : '';
    }

    // ---------- Tabellenkopf einer Seite -> Spaltenpositionen ----------
    function spaltenErmitteln(items) {
        const typ = items.find(i => i.s === 'Typ');
        if (!typ) return null;
        const zeile = items.filter(i => Math.abs(i.y - typ.y) <= 2).sort((a, b) => a.x - b.x);
        const alle = (t) => zeile.filter(i => i.s === t);
        const beginn = alle('Beginn')[0], von = alle('Von'), ende = alle('Ende')[0], nach = alle('Nach');
        const linie = alle('Linie')[0], kurs = alle('Kurs')[0], rbl = alle('RBL-Route')[0];
        if (!beginn || !von[0] || !ende || !nach[0] || !linie || !kurs) return null;
        const sp = { beginn: beginn.x, von: von[0].x, ende: ende.x, nach: nach[0].x, typ: typ.x, linie: linie.x, kurs: kurs.x };
        if (rbl) sp.rbl = rbl.x;
        // Mit Klartext-Namen stehen "Von" und "Nach" rechts von "RBL-Route" ein zweites Mal
        const rechts = rbl ? rbl.x : sp.kurs;
        const vonName = von.find(i => i.x > rechts + 5), nachName = nach.find(i => i.x > rechts + 5);
        if (vonName) sp.vonName = vonName.x;
        if (nachName) sp.nachName = nachName.x;
        sp.liste = Object.entries(sp).sort((a, b) => a[1] - b[1]);
        sp.kopfY = typ.y;
        return sp;
    }
    function spalteVon(x, sp) {
        let name = null;
        for (const [n, sx] of sp.liste) if (x >= sx - X_TOLERANZ) name = n;
        return name;
    }

    // ---------- Eine Seite in Tabellenzeilen und Uebernahme-/Uebergabe-Hinweise zerlegen ----------
    function seiteZerlegen(items, sp) {
        const tabelle = items.filter(i => i.y < sp.kopfY - 2);
        const istBeginnSpalte = (i) => Math.abs(i.x - sp.beginn) <= X_TOLERANZ;
        // Uebernahme-/Uebergabe-Hinweise stehen in der Beginn-Spalte oder (ohne Symbol davor) weiter links
        const istLinks = (i) => i.x <= sp.beginn + X_TOLERANZ;
        const zeilenAnker = tabelle.filter(i => istBeginnSpalte(i) && ZEIT.test(i.s))
            .map(i => ({ k: 'zeile', y: i.y, anker: i, zellen: {} }));
        const wechselAnker = tabelle.filter(i => istLinks(i) && WECHSEL_ANFANG.test(i.s))
            .map(i => ({ k: 'wechsel', y: i.y, anker: i, teile: [i] }));
        const alleAnker = zeilenAnker.concat(wechselAnker);
        const istAnker = new Set(alleAnker.map(a => a.anker));

        tabelle.forEach(i => {
            if (istAnker.has(i)) return;
            // Rest eines Hinweis-Textes in derselben Zeile
            const gleicheZeile = wechselAnker.find(w => Math.abs(w.y - i.y) <= 2);
            if (gleicheZeile) { gleicheZeile.teile.push(i); return; }
            const spalte = spalteVon(i.x, sp);
            if (!spalte || spalte === 'beginn') {
                // Fortsetzung eines umgebrochenen Uebernahme-/Uebergabe-Textes (Symbol-Namen wie "swap_horiz" ausgenommen)
                if (!istLinks(i) || /^[a-z]+(?:_[a-z]+)*$/.test(i.s)) return;
                const darueber = alleAnker.filter(a => a.y > i.y).sort((a, b) => a.y - b.y)[0];
                if (darueber && darueber.k === 'wechsel' && darueber.y - i.y <= 30) darueber.teile.push(i);
                return;
            }
            // Zelle einer Tabellenzeile (auch umgebrochene Namen liegen um die Zeilenmitte herum)
            let beste = null, abstand = Infinity;
            zeilenAnker.forEach(a => {
                const d = Math.abs(a.y - i.y);
                if (d < abstand) { abstand = d; beste = a; }
            });
            if (beste && abstand <= ZEILEN_TOLERANZ) (beste.zellen[spalte] = beste.zellen[spalte] || []).push(i);
        });

        return alleAnker.sort((a, b) => b.y - a.y).map(a => {
            if (a.k === 'wechsel') return { k: 'wechsel', text: zellenText(a.teile) };
            const z = (n) => zellenText(a.zellen[n]);
            return {
                k: 'zeile',
                row: {
                    von_zeit: zeitText(a.anker.s), von_kuerzel: z('von'), bis_zeit: zeitText(z('ende')),
                    nach_kuerzel: z('nach'), typ: ascii(z('typ')), linie: z('linie'), umlauf: z('kurs'),
                    von: z('vonName'), nach: z('nachName')
                }
            };
        }).filter(e => e.k === 'wechsel' || (e.row.von_zeit && e.row.bis_zeit));
    }

    // ---------- Text einer Uebernahme-/Uebergabe-Zeile ----------
    // 2026: "Übergabe um 07:14, an UJTC02 (U Johannisthaler Chaussee), an Dienst B 5003, Ankunft 07:37 an SSWS04 (...)"
    // 2024: "Übernahme um 07:07, Abfahrt 06:25 ab ZOOH01, an GRTW02, von Dienst B 246"
    function wechselAusText(text) {
        const kopf = WECHSEL_ANFANG.exec(text);
        if (!kopf) return null;
        const art = /nahme/i.test(kopf[1]) ? 'Uebernahme' : 'Uebergabe';
        const zeit = zeitText((/um\s+(\d{1,2}:\d{2})/i.exec(text) || [])[1]);
        const ort = /,\s*an\s+([A-Z0-9]+(?: [A-Z0-9]+)*?)(?=\s*\(|\s*,|\s*$)(?:\s*\(([^)]*)\))?/.exec(text);
        const dienst = /\bDienst\s+([A-Z]{1,3}\s?\d+(?:\/\d+)?)/.exec(text);
        return {
            art, zeit, ort: ort && ort[2] ? ort[2].trim() : '', ort_kuerzel: ort ? ort[1].trim() : '',
            von_dienst: dienst ? dienst[1] : '', abfahrt: '', linie: '', umlauf: '', nach: '', nach_kuerzel: ''
        };
    }

    function hatLinie(row) { return !!row.linie; }
    function fahrtObjekt(r) {
        return {
            von_zeit: r.von_zeit, von: r.von, von_kuerzel: r.von_kuerzel, bis_zeit: r.bis_zeit,
            nach: r.nach, nach_kuerzel: r.nach_kuerzel, typ: r.typ, linie: r.linie, umlauf: r.umlauf
        };
    }

    // ---------- Hauptfunktion ----------
    // seiten: [{ items: [{ s, x, y, w }] }]  (Text-Elemente mit Position, wie pdf.js sie liefert)
    function dienstzettelAusPdfElementen(seiten) {
        const zeichen = seiten.reduce((n, s) => n + s.items.reduce((m, i) => m + String(i.s).trim().length, 0), 0);
        if (zeichen < 50) {
            throw new Error('In diesem PDF steckt kein Text (vermutlich ein eingescanntes Bild). Bitte den Dienstzettel als Foto hochladen.');
        }

        let kopfItems = null;
        const folge = [];
        seiten.forEach(seite => {
            // Symbol-Zeichen (Private-Use-Bereich, z. B. die Icons vor Pausen und Uebergaben) entfernen
            const items = seite.items.map(i => ({ s: String(i.s).replace(/[-]/g, '').trim(), x: i.x, y: i.y, w: i.w || 0 }))
                .filter(i => i.s !== '');
            const sp = spaltenErmitteln(items);
            if (!sp) return;
            if (!kopfItems && findeLabel(items, 'Dienstnummer')) kopfItems = items.filter(i => i.y >= sp.kopfY - 2);
            seiteZerlegen(items, sp).forEach(e => folge.push(e));
        });
        if (!kopfItems) {
            throw new Error('Das PDF sieht nicht wie ein Dienstzettel aus (keine Dienstnummer bzw. Tabelle gefunden).');
        }

        // ----- Kopf -----
        const roh = (l) => kopfWert(kopfItems, l);
        const datumRoh = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(roh('Datum'));
        const endeRoh = roh('Ende');
        const beginn = zeitText(roh('Beginn'));
        const ende = zeitText(endeRoh);
        const kontrolle = {
            dienstdauer: zeitText(roh('Dienstdauer')), bezahlte_zeit: zeitText(roh('Bezahlte Zeit')),
            unbezahlte_pausenzeit: zeitText(roh('Unbezahlte Pausenzeit')), pausenzeit: zeitText(roh('Pausenzeit')),
            zuschlagsfelder: []
        };
        ['Nachtminuten', 'Samstagsminuten', 'Sonntagsminuten', 'Feiertagsminuten'].forEach(name => {
            const wert = zeitText(roh(name));
            if (wert) kontrolle.zuschlagsfelder.push({ name, wert });
        });

        // ----- Tabelle -----
        const zeilen = folge.filter(e => e.k === 'zeile').map(e => e.row);
        const fahrten = zeilen.filter(r => r.typ && !KEINE_FAHRT.includes(r.typ)).map(fahrtObjekt);

        const regelRoh = roh('Pausenregel').toLowerCase();
        let pausenregel = '';
        if (regelRoh.startsWith('b') && /\d/.test(regelRoh)) pausenregel = 'B30';
        else if (regelRoh.includes('sechst')) pausenregel = 'sechste';
        else if (regelRoh.includes('res')) pausenregel = 'reserve';
        else if (!regelRoh && zeilen.some(r => r.typ.toLowerCase().startsWith('res'))) pausenregel = 'reserve';

        const mitLinie = zeilen.filter(hatLinie);
        const erste = zeilen[0], letzte = zeilen[zeilen.length - 1];
        const ersteLinie = mitLinie[0], letzteLinie = mitLinie[mitLinie.length - 1];

        // ----- Uebernahme / Uebergabe / Einsetzen / Aussetzen in zeitlicher Reihenfolge -----
        const linienZeileNach = (i) => {
            for (let j = i + 1; j < folge.length; j++) if (folge[j].k === 'zeile' && folge[j].row.typ === 'L') return folge[j].row;
            for (let j = i + 1; j < folge.length; j++) if (folge[j].k === 'zeile' && hatLinie(folge[j].row)) return folge[j].row;
            return null;
        };
        const linienZeileVor = (i) => {
            for (let j = i - 1; j >= 0; j--) if (folge[j].k === 'zeile' && folge[j].row.typ === 'L') return folge[j].row;
            for (let j = i - 1; j >= 0; j--) if (folge[j].k === 'zeile' && hatLinie(folge[j].row)) return folge[j].row;
            return null;
        };
        const uebernehmen = (w, r) => {
            if (!r) return;
            w.abfahrt = r.von_zeit; w.linie = r.linie; w.umlauf = r.umlauf; w.nach = r.nach; w.nach_kuerzel = r.nach_kuerzel;
        };
        const wechsel = [];
        folge.forEach((e, i) => {
            if (e.k === 'wechsel') {
                const w = wechselAusText(e.text);
                if (!w) return;
                uebernehmen(w, w.art === 'Uebernahme' ? linienZeileNach(i) : linienZeileVor(i));
                wechsel.push(w);
            } else if (e.row.typ === 'E') {
                const w = { art: 'Einsetzen', zeit: e.row.von_zeit, ort: e.row.von, ort_kuerzel: e.row.von_kuerzel, von_dienst: '',
                    abfahrt: '', linie: '', umlauf: '', nach: '', nach_kuerzel: '' };
                uebernehmen(w, linienZeileNach(i) || e.row);
                wechsel.push(w);
            } else if (e.row.typ === 'A') {
                const w = { art: 'Aussetzen', zeit: e.row.von_zeit, ort: e.row.nach, ort_kuerzel: e.row.nach_kuerzel, von_dienst: '',
                    abfahrt: '', linie: '', umlauf: '', nach: '', nach_kuerzel: '' };
                uebernehmen(w, linienZeileVor(i) || e.row);
                wechsel.push(w);
            }
        });

        // ----- Pausen -----
        const unbezahltKopf = zuMinuten(kontrolle.unbezahlte_pausenzeit);
        let unbezahltVergeben = 0;
        const pausen = [];
        folge.forEach((e, i) => {
            if (e.k !== 'zeile' || (e.row.typ !== 'BEZPAU' && e.row.typ !== 'UNBPAU')) return;
            const r = e.row;
            const dauer = minutenZwischen(r.von_zeit, r.bis_zeit);
            let unbezahlt = 0;
            if (r.typ === 'UNBPAU') {
                if (pausenregel === 'B30') unbezahlt = Math.min(30, dauer);
                else if (pausenregel === 'sechste') {
                    // den Kopfwert "Unbezahlte Pausenzeit" nur auf die UNBPAU-Zeilen verteilen
                    unbezahlt = unbezahltKopf === null ? dauer : Math.max(0, Math.min(dauer, unbezahltKopf - unbezahltVergeben));
                    unbezahltVergeben += unbezahlt;
                } else if (pausenregel === 'reserve') unbezahlt = 0;
                else unbezahlt = dauer;
            }
            // Letzte Fahrt (Linie) vor der Pause
            let davor = null, davorIndex = -1;
            for (let j = i - 1; j >= 0; j--) if (folge[j].k === 'zeile' && hatLinie(folge[j].row)) { davor = folge[j].row; davorIndex = j; break; }
            let davorArt = 'Ankunft';
            if (davor) {
                const dazwischen = folge.slice(davorIndex + 1, i);
                if (dazwischen.some(x => x.k === 'wechsel' && /^(Übergabe|Uebergabe)/i.test(x.text))) davorArt = 'Uebergabe';
                else if (davor.typ === 'A') davorArt = 'Aussetzen';
                else if (davor.typ === 'E') davorArt = 'Einsetzen';
            }
            // Erste Fahrt (Linie) nach der Pause
            let danach = null, danachIndex = -1;
            for (let j = i + 1; j < folge.length; j++) if (folge[j].k === 'zeile' && hatLinie(folge[j].row)) { danach = folge[j].row; danachIndex = j; break; }
            let danachArt = 'Abfahrt';
            if (danach) {
                const dazwischen = folge.slice(i + 1, danachIndex);
                if (dazwischen.some(x => x.k === 'wechsel' && /^(Übernahme|Uebernahme)/i.test(x.text))) danachArt = 'Uebernahme';
                else if (danach.typ === 'E') danachArt = 'Einsetzen';
                else if (danach.typ === 'A') danachArt = 'Aussetzen';
            }
            pausen.push({
                von: r.von_zeit, bis: r.bis_zeit, art: r.typ, unbezahlt_minuten: unbezahlt,
                ort: r.von, ort_kuerzel: r.von_kuerzel,
                davor_art: davor ? davorArt : '', davor_zeit: davor ? davor.bis_zeit : '', davor_ort: davor ? davor.nach : '',
                davor_ort_kuerzel: davor ? davor.nach_kuerzel : '', davor_linie: davor ? davor.linie : '', davor_umlauf: davor ? davor.umlauf : '',
                danach_art: danach ? danachArt : '', danach_abfahrt: danach ? danach.von_zeit : '', danach_linie: danach ? danach.linie : '',
                danach_umlauf: danach ? danach.umlauf : '', danach_nach: danach ? danach.nach : '',
                danach_nach_kuerzel: danach ? danach.nach_kuerzel : ''
            });
        });

        // ----- Selbstpruefung mit den gedruckten Kopfwerten -----
        const hinweise = [];
        const dauer = minutenZwischen(beginn, ende);
        const druckDauer = zuMinuten(kontrolle.dienstdauer);
        if (druckDauer !== null && Math.abs(dauer - druckDauer) > 1) {
            hinweise.push(`Dienstdauer laut Beginn/Ende ${dauer} Min., gedruckt ${druckDauer} Min.`);
        }
        const druckBezahlt = zuMinuten(kontrolle.bezahlte_zeit);
        if (druckBezahlt !== null && unbezahltKopf !== null && Math.abs(dauer - unbezahltKopf - druckBezahlt) > 1) {
            hinweise.push('Bezahlte Zeit passt nicht zu Dienstdauer minus unbezahlter Pause.');
        }
        if (!datumRoh) hinweise.push('Datum nicht gelesen.');
        if (!fahrten.length) hinweise.push('Keine Fahrten gefunden.');
        else if (erste && beginn && erste.von_zeit !== beginn) hinweise.push('Erste Zeile beginnt nicht zur Dienstbeginn-Zeit.');

        return {
            datum: datumRoh ? `${datumRoh[3]}-${datumRoh[2]}-${datumRoh[1]}` : '',
            dienstnummer: roh('Dienstnummer'),
            pausenregel,
            beginn,
            beginn_ort: erste ? erste.von : '', beginn_ort_kuerzel: erste ? erste.von_kuerzel : '',
            beginn_abfahrt: ersteLinie ? ersteLinie.von_zeit : '', beginn_linie: ersteLinie ? ersteLinie.linie : '',
            beginn_umlauf: ersteLinie ? ersteLinie.umlauf : '',
            beginn_nach: ersteLinie ? ersteLinie.nach : '', beginn_nach_kuerzel: ersteLinie ? ersteLinie.nach_kuerzel : '',
            ende, ende_folgetag: /\+\s*$/.test(endeRoh) || (!!beginn && !!ende && zuMinuten(ende) < zuMinuten(beginn)),
            ende_ort: letzte ? letzte.nach : '', ende_ort_kuerzel: letzte ? letzte.nach_kuerzel : '',
            ende_linie: letzteLinie ? letzteLinie.linie : '', ende_umlauf: letzteLinie ? letzteLinie.umlauf : '',
            ende_nach: letzteLinie ? letzteLinie.nach : (letzte ? letzte.nach : ''),
            ende_nach_kuerzel: letzteLinie ? letzteLinie.nach_kuerzel : (letzte ? letzte.nach_kuerzel : ''),
            pause_minuten: unbezahltKopf === null ? 0 : unbezahltKopf,
            kontrolle,
            wechsel, pausen, fahrten,
            sicher: hinweise.length === 0,
            pruefhinweise: hinweise,
            quelle: 'pdf'
        };
    }

    // ---------- Browser: PDF-Datei lesen (pdf.js wird erst bei Bedarf geladen) ----------
    let pdfBibliothek = null;
    function pdfBibliothekLaden() {
        if (pdfBibliothek) return pdfBibliothek;
        pdfBibliothek = new Promise((erfuellen, ablehnen) => {
            if (global.pdfjsLib) { erfuellen(global.pdfjsLib); return; }
            const s = document.createElement('script');
            s.src = 'vendor/pdfjs/pdf.min.js';
            s.onload = () => {
                global.pdfjsLib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.js';
                erfuellen(global.pdfjsLib);
            };
            s.onerror = () => { pdfBibliothek = null; ablehnen(new Error('Die PDF-Bibliothek konnte nicht geladen werden.')); };
            document.head.appendChild(s);
        });
        return pdfBibliothek;
    }

    async function pdfDateiZuErgebnis(datei) {
        const lib = await pdfBibliothekLaden();
        const daten = new Uint8Array(await datei.arrayBuffer());
        let doc;
        try {
            doc = await lib.getDocument({ data: daten }).promise;
        } catch (e) {
            throw new Error('Die PDF-Datei konnte nicht geöffnet werden.');
        }
        const seiten = [];
        for (let p = 1; p <= doc.numPages; p++) {
            const seite = await doc.getPage(p);
            const inhalt = await seite.getTextContent();
            seiten.push({ items: inhalt.items.map(i => ({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width })) });
        }
        return dienstzettelAusPdfElementen(seiten);
    }

    global.DienstzettelPdf = { dienstzettelAusPdfElementen, pdfDateiZuErgebnis, wechselAusText };
    if (typeof module !== 'undefined' && module.exports) module.exports = global.DienstzettelPdf;
})(typeof window !== 'undefined' ? window : globalThis);
