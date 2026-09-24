package de.topbas.dienstplan.widget;

import java.util.Calendar;
import java.util.GregorianCalendar;

// Reine Kalender-Geometrie fuer das Kalender-Widget (ohne Android-Klassen, damit sie
// einfach getestet werden kann): Wochen beginnen am Montag, das Raster hat immer 6 Zeilen
// zu 7 Tagen (42 Zellen), so wie im Kalender der App.
public final class KalenderGitter {
    public static final int ZELLEN = 42;

    public final int jahr;
    public final int monat;        // 0 = Januar ... 11 = Dezember
    public final int startOffset;  // Zellen vor dem 1. des Monats (0 = der 1. ist ein Montag)
    public final int tageImMonat;

    private KalenderGitter(int jahr, int monat, int startOffset, int tageImMonat) {
        this.jahr = jahr;
        this.monat = monat;
        this.startOffset = startOffset;
        this.tageImMonat = tageImMonat;
    }

    // Raster fuer den Monat, der monatsVersatz Monate vom Monat von "heute" entfernt liegt.
    public static KalenderGitter fuer(Calendar heute, int monatsVersatz) {
        Calendar erster = new GregorianCalendar(heute.get(Calendar.YEAR), heute.get(Calendar.MONTH), 1);
        erster.add(Calendar.MONTH, monatsVersatz);
        int wochentag = erster.get(Calendar.DAY_OF_WEEK);            // So = 1 ... Sa = 7
        int startOffset = (wochentag + 5) % 7;                       // Mo = 0 ... So = 6
        return new KalenderGitter(erster.get(Calendar.YEAR), erster.get(Calendar.MONTH), startOffset,
                erster.getActualMaximum(Calendar.DAY_OF_MONTH));
    }

    // Tag des Monats (1..n) in der Zelle mit diesem Index, oder 0 wenn die Zelle ausserhalb des Monats liegt.
    public int tagInZelle(int zelle) {
        int tag = zelle - startOffset + 1;
        return (tag >= 1 && tag <= tageImMonat) ? tag : 0;
    }

    // "2026-09-07" - wie die Datumsschluessel in der App
    public String datum(int tag) {
        return String.format(java.util.Locale.US, "%04d-%02d-%02d", jahr, monat + 1, tag);
    }
}
