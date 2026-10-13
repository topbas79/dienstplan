# Bauplan: App „Planer“

Planer ist eine **schlankere Zweit-App**, die aus der Dienstplan-App (`C:\dienstplan`, Repo `Topbas79/dienstplan`) abgeleitet wird. Sie ist nur für BVG-Kollegen gedacht und hat ein neues Design in Gelb und Schwarz. Jeder nutzt sie nur für sich selbst: Es gibt weder Admin noch Chat noch Einladungen.

Dieses Dokument ist die Vorgabe für Claude Code. Die Design-Entwürfe liegen im Ordner `planer-entwurf/`: Bilder als Übersicht, `.dc.html`-Dateien mit exakten Farben, Abständen und Texten.

---

## 1. Rahmen

| Punkt | Festlegung |
|---|---|
| Name | **Planer** (Kurzname „Planer“) |
| Repo | neues, eigenes GitHub-Repo **`Topbas79/planer`** |
| Adresse | **https://topbas79.github.io/planer** (GitHub Pages) |
| Plattform | **zuerst nur Web-App (PWA)**. Die APK kommt später (Widgets sind dafür vorgemerkt). |
| Zielgruppe | nur BVG-Kollegen. Der **BVG-Tarif (TV-N Berlin) wird fest übernommen**. |
| Technik | wie Dienstplan: reines HTML/CSS/JS ohne Build-Schritt (`index.html`, `app.js`, `styles.css`, `pdf-import.js`, `service-worker.js`, `manifest.json`, `vendor/`) |
| Start | Dienstplan-Code kopieren, dann alles Entfallende entfernen und das Design umbauen. Nicht bei null anfangen. |

## 2. Anmeldung und Daten

- **Gleiches Supabase-Projekt** wie Dienstplan, aber **eigene Tabellen**. Die Daten sind komplett getrennt von Dienstplan, und Schichten werden **nicht** geteilt.
- **Freie Registrierung** mit E-Mail und Passwort. Es gibt keinen Einladungscode und keinen Schritt „Zugang freischalten“.
- **Wichtig, damit Dienstplan geschützt bleibt:** Der bestehende Trigger `neues_profil_anlegen` legt für jeden neuen Login eine Zeile in `profile` mit `aktiv = false` an. Das bleibt so. Ein Planer-Konto bekommt dadurch **keinen** Zugang zu Dienstplan, denn Dienstplan prüft `ist_aktiv()`. Planer selbst prüft `aktiv` **nicht**.
  - Hinweis: Planer-Nutzer tauchen dadurch in der Dienstplan-Nutzerliste als „nicht freigeschaltet“ auf. Falls das stört: in `profile` eine Spalte `app text default 'dienstplan'` ergänzen und beim Planer-Registrieren `app = 'planer'` setzen. Die Dienstplan-Admin-Liste filtert dann danach. **Vorher den Nutzer fragen.**
- **Neue Tabellen** (alle mit RLS, jeder sieht und ändert nur seine eigenen Zeilen, `user_id = auth.uid()`):
  - `planer_schichten`: gleicher Aufbau wie `schichten` (`id`, `user_id`, `datum`, `daten jsonb`, `aktualisiert_am`, `unique(user_id, datum)`)
  - `planer_einstellungen`: `user_id` als Primärschlüssel und `daten jsonb` (Verdienst, Zuschläge, Zeitfenster, Verpflegung, Name für PDFs, Bundesland, Darstellung, Datum der letzten Tarifprüfung)
  - `planer_ereignisse`: wie `ereignisse`. Fotos kommen in einen eigenen Storage-Bucket `planer-ereignis-fotos` (privat, Pfad beginnt mit `user_id/`).
  - `planer_haltestellen`: `user_id`, `kuerzel`, `name`, `unique(user_id, kuerzel)`
- **Haltestellen:** Beim ersten Login einmal **die komplette heutige Liste aus `haltestellen` kopieren**. Danach pflegt jeder Nutzer nur noch seine eigene Liste, die Apps sind dann nicht mehr verbunden. Beim PDF-Import lernt die eigene Liste automatisch mit (wie heute).
- **BVG-Meldungen:** die bestehende Edge Function `bvg-meldungen` mitbenutzen (gleiches Projekt).
- localStorage-Schlüssel mit eigenem Präfix **`planer_`**, nie `dienstplan_`, sonst überschreiben sich beide Apps im selben Browser.
- Ein eigener Service-Worker-Cache-Name: `planer-cache-v1`.

## 3. Funktionen

### ✅ Wird übernommen
1. **Startseite**
   - Begrüßung oben: „Hallo! Di, 13. Okt.“ (aktuelles Datum)
   - Verdienst des Monats (brutto, groß), darunter die Kapseln: Anzahl Dienste · Stunden · Zuschläge
   - Knöpfe „Dienst erfassen“ und „Aktuelle Fahrt“
   - Nächster Dienst (Datum, Zeiten, Dienstnummer, Linie, „in X Std.“)
   - BVG-Meldung zu den eigenen Linien (wenn vorhanden)
   - Nächster Feiertag
   - **Statistik „Monat im Überblick“** (Nacht, Samstag, Sonntag, Überstunden als Balken). Eine eigene Statistik-Seite gibt es nicht mehr.
   - Erinnerung „Verdienst prüfen“, wenn die Verdienst-Einstellungen älter als 1 Jahr sind
2. **Aktuelle Fahrt** (Fahrtbericht für unterwegs, mit Zurück/Jetzt/Weiter, „Als Nächstes“ und BVG-Meldung)
3. **Schicht erfassen:** Formular mit Datum, Dienstnummer, Beginn, Ende und optional „Tatsächliches Ende“. Dazu Pausenregel (B30 / Sechstel / Reserve) mit Pausen-Hilfe, unbezahlte Pausen, Feiertags-/Sonderregelung, „Berechnen“ mit Tagesauswertung, „Im Kalender speichern“, Löschen.
4. **PDF-Import des Dienstplans** (`pdf-import.js`, ohne KI). Mehrere Dienste werden auf einmal erkannt und gespeichert, inklusive Fahrten für „Aktuelle Fahrt“.
5. **Einzelne Schicht in den Google Kalender** exportieren
6. **Monatskalender** mit Krank, Urlaub und Frei. **Feiertage automatisch nach Bundesland**, Standard Berlin.
7. **Dienstliste** (Monat) mit PDF **„Dienstübersicht“** und PDF **„Verpflegungsmehraufwand“** für Monat und Jahr. Auf den PDFs steht der Name aus den Einstellungen, falls einer eingetragen ist.
8. **Dienstverlauf mit Ereignissen** (Foto). Teilen geht **nur extern** („WhatsApp & Co.“), Teilen im Chat entfällt.
9. **Fehlermeldungen:** die Busfehler-Icons für Solaris Urbino 12 electric und ADL Enviro500 mit Suche und Detail-Popup samt Handlungshinweis. Die Icons aus `busfehler-icons/` übernehmen (bereits geschärft, 512 px).
10. **Verdienst-Einstellungen** im BVG-Tarif: Entgeltgruppe, Stufe, Monatsentgelt, Wochenstunden, Unregelm. Dienste, Pausch. Dienstklasse, Entgelt stdl. ZZ, Zuschlagssätze, Zeitfenster, Verpflegungsmehraufwand. Neu dazu kommen **„Name für die PDFs“** (optional), **Bundesland** und **Darstellung** (Automatisch/Hell/Dunkel).
11. **Haltestellen** (eigene Liste, siehe oben)
12. **Hell- und Dunkelmodus:** folgt automatisch dem Handy, zusätzlich mit Umschalt-Knopf

### ❌ Fällt weg (Code und Oberfläche komplett entfernen)
- Foto-Erkennung mit KI (Dienstzettel), Cropper, Tesseract, „Meldung fotografieren“ (KI) bei Fehlermeldungen, KI-Nutzung
- Zeitkonto
- Monatsexport als .ics
- Wegstrecken und Fahrtkosten-PDF
- Chat, Nachrichten, Gruppen
- Profil „Wer bist du?“ (Vorname, Nachname, Betriebshof)
- Hilfe durch den Admin (24-Std.-Zugriff)
- Datensicherung (Backup und Wiederherstellen)
- Admin-Bereich: Einladungen, Nutzerliste, Schichten anderer Nutzer, „Zugang freischalten“
- Einmalige Einrichtung der Supabase-Verbindung: URL und Key fest eintragen

### 🆕 Ersteinrichtung
Nach der ersten Anmeldung kommt **nur „Verdienst einrichten“**: Entgeltgruppe und Stufe wählen, das Monatsentgelt wird aus der TV-N-Tabelle übernommen. Dazu „Übernehmen und weiter“ und „Später einrichten“.

### ⏳ Für später vorgemerkt (APK)
- Widgets „Kalender“ und „Aktuelle Fahrt“ für den Startbildschirm

## 4. Navigation

- **Untere Leiste mit 4 Reitern:** Start · Erfassen · Kalender · Liste
- **Mehr-Menü** (Knopf oben rechts mit drei Strichen): schiebt sich **von rechts** auf, ist 304 px breit und schwarz, der Hintergrund wird zu 55 % abgedunkelt.
  Inhalt: Dienstverlauf · Dienstliste · Fehlermeldungen · Haltestellen · Einstellungen, unten der Schalter Dunkelmodus und „Abmelden“.
- Unterseiten (Aktuelle Fahrt, Fehlermeldungen, Dienstverlauf, Einstellungen, Haltestellen) haben oben links einen schwarzen Zurück-Knopf.

## 5. Design

Vorlage: `planer-entwurf/*.dc.html` (genaue Werte) und `planer-entwurf/*.png` (Übersicht).

### Farben
| Name | Hell | Dunkel |
|---|---|---|
| Hintergrund | `#FFD100` (Gelb) | `#0B0B0C` |
| Karte, stark | `#0A0A0A` (schwarz, Text weiß, Zahlen gelb) | `#18181B` mit Rand `#2A2A2E` |
| Karte, hell | `#FFFFFF` mit **3 px Rand `#0A0A0A`** | `#18181B` |
| Haupttext | `#0A0A0A` | `#F5F5F5` |
| Nebentext | `#3B3A35` / auf Schwarz `#C9C9C9` | `#B8B8BD` |
| Akzent | `#0A0A0A` auf Gelb, `#FFD100` auf Schwarz | `#FFD100` |
| Felder grau | `#F1F0EC` | `#1C1C1E` |
| Orange (Feiertag, Sonntag, Meldung) | `#FF8A3D` | `#FF8A3D` |
| Rot (Fehler „Rot“) | `#EF4444`, Hinweisbox `#3B1414` / `#FECACA` | gleich |
| Krank | `#C4B5FD` | gleich |
| Icon-Kachel Fehlermeldungen | `#2B2F36` | gleich |

- Theme-Farbe im Manifest: `#FFD100`, Hintergrund `#FFD100`

### Schrift
- **Barlow Condensed** (600/700/800): Überschriften, große Zahlen, Uhrzeiten, Beträge
- **Barlow** (400–700): Fließtext, Beschriftungen, Knöpfe
- Die Schriften **selbst einbinden** (woff2 in `vendor/fonts/`, z. B. aus dem npm-Paket `@fontsource`), damit sie offline gehen. Kein Google-Fonts-Link.
- Beschriftungen über Feldern: 12 px, fett, GROSS, Buchstabenabstand ca. 1 px

### Formen
- Karten: Rundung 22–28 px, Knöpfe 16–20 px, Eingabefelder 13–16 px, Kapseln voll rund
- Alle Knöpfe mindestens 44 px hoch, Hauptknöpfe 56–64 px
- Icons: einfache Linien-Icons als Inline-SVG, keine Emojis
- Untere Leiste: schwarz, oben 28 px gerundet, der aktive Reiter als gelbe Kapsel
- Ein Pop-up (z. B. Fehlermeldung) kommt als schwarzes Fenster von unten, mit Griff-Strich

### Seiten und ihre Entwurfsdateien
| Seite | Entwurf |
|---|---|
| Startseite hell / dunkel | `Hell.dc.html`, `Dunkel.dc.html` |
| Dienst erfassen | `Erfassen.dc.html` |
| Kalender | `Kalender.dc.html` |
| Dienstliste | `Liste.dc.html` |
| Aktuelle Fahrt | `Fahrt.dc.html` |
| Mehr-Menü | `Mehr.dc.html` |
| Fehlermeldungen + Detail | `Fehler.dc.html`, `FehlerDetail.dc.html` |
| Dienstverlauf | `Verlauf.dc.html` |
| Einstellungen | `Einstellungen.dc.html` (Bundesland ergänzen) |
| Haltestellen | `Haltestellen.dc.html` |
| Anmelden / Registrieren | `Anmelden.dc.html` |
| Verdienst einrichten | `Einrichten.dc.html` |

Alle Zahlen in den Entwürfen sind Beispielwerte. Texte in eckigen Klammern sind Platzhalter. Der Dunkelmodus ist nur für die Startseite gezeichnet; alle anderen Seiten folgen demselben Muster (Farbtabelle oben).

### App-Icon
Schwarzer Bus auf gelbem Grund (`#FFD100`) mit einem kleinen schwarzen Kalender-Zeichen unten rechts, also das heutige Dienstplan-Icon mit getauschten Farben. Als `icon-192.png` und `icon-512.png` (maskable) erzeugen.

## 6. Reihenfolge beim Bauen
1. Neues Repo `Topbas79/planer` anlegen, den Dienstplan-Code hineinkopieren und GitHub Pages einschalten.
2. Supabase: die neuen `planer_`-Tabellen, den Bucket und die RLS-Regeln anlegen. Migration als `planer-setup.sql` ins Repo legen.
3. Alles Entfallende entfernen (Abschnitt 3 ❌).
4. Anmeldung umbauen: freie Registrierung, ohne Freischaltung. Danach die Ersteinrichtung „Verdienst einrichten“.
5. Daten auf die `planer_`-Tabellen umstellen und die Haltestellen einmalig kopieren.
6. Neues Design und neue Navigation (Abschnitte 4 und 5), Seite für Seite nach den Entwürfen.
7. Icon und Manifest erstellen, den Service-Worker-Cache auf `planer-cache-v1` setzen.
8. Prüfen: Registrieren, Verdienst einrichten, PDF-Import, Erfassen, Kalender, Dienstliste-PDFs, Hell/Dunkel. Zusätzlich sicherstellen, dass ein Planer-Konto sich **nicht** in Dienstplan anmelden kann.

Vor jedem größeren Schritt den Nutzer fragen, ob es losgehen soll.
