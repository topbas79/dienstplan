package de.topbas.dienstplan.widget;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// Gemeinsamer Speicher- und Auswertungscode fuer das "Aktuelle Fahrt"-Widget -
// wird sowohl vom Capacitor-Bridge-Plugin (schreibt) als auch vom Widget-
// Provider/Empfaenger (liest) genutzt.
//
// Ab hier kennt das Widget mehrere Tage (letzte 3 + heute + naechste 3
// gespeicherte Dienste), nicht mehr nur "heute": "tage_json" ist ein Array
// von {datumStr, datumKurz, dienstnummer, punkte:[...]}, "heute_index" der
// Index des heutigen Tages darin (oder -1). Jede Widget-Instanz merkt sich
// zusaetzlich zwei eigene manuelle Positionen: welcher Tag (Pfeile oben)
// und welcher Punkt innerhalb dieses Tages (Zurück/Weiter unten).
public class WidgetDaten {
    private static final String PREFS = "aktuelle_fahrt_widget";
    private static final String SCHLUESSEL_TAGE = "tage_json";
    private static final String SCHLUESSEL_HEUTE_INDEX = "heute_index";
    private static final String SCHLUESSEL_MANUELL_PREFIX = "manueller_index_";
    private static final String SCHLUESSEL_MANUELL_TAG_PREFIX = "manueller_tag_index_";

    public static void tageSpeichern(Context ctx, String tageJson, int heuteIndex) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putString(SCHLUESSEL_TAGE, tageJson)
                .putInt(SCHLUESSEL_HEUTE_INDEX, heuteIndex)
                .apply();
    }

    public static JSONArray tageLaden(Context ctx) {
        String json = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(SCHLUESSEL_TAGE, "[]");
        try {
            return new JSONArray(json);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    public static int heuteIndexLaden(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getInt(SCHLUESSEL_HEUTE_INDEX, -1);
    }

    // Punkte-Array des angegebenen Tag-Index, oder ein leeres Array wenn
    // es ihn nicht gibt.
    public static JSONArray punkteFuerTag(JSONArray tage, int tagIndex) {
        JSONObject tag = tagIndex >= 0 ? tage.optJSONObject(tagIndex) : null;
        JSONArray punkte = tag != null ? tag.optJSONArray("punkte") : null;
        return punkte != null ? punkte : new JSONArray();
    }

    // Loest den fuer diese Widget-Instanz aktiven Tag-Index auf: manuell
    // per Pfeil gewaehlt, sonst automatisch der heutige Tag (oder der
    // letzte verfuegbare, falls heute keiner gespeichert ist).
    public static int aktuellerTagIndex(Context ctx, int appWidgetId, int tageGesamt) {
        if (tageGesamt == 0) return -1;
        int heuteIndex = heuteIndexLaden(ctx);
        int autoIndex = heuteIndex >= 0 ? heuteIndex : tageGesamt - 1;
        Integer manuell = manuellerTagIndexLaden(ctx, appWidgetId);
        return Math.max(0, Math.min(tageGesamt - 1, manuell != null ? manuell : autoIndex));
    }

    // Letzter Punkt, dessen Zeit schon erreicht ist - spiegelt exakt
    // aktuelleFahrtAutoIndex() in app.js, nur mit fertigen zeitMs statt
    // erneuter Datumsberechnung. Liegen alle Zeiten in der Zukunft (ein
    // kommender Tag), bleibt es beim ersten Punkt; liegen alle in der
    // Vergangenheit (ein vergangener Tag), landet es beim letzten.
    public static int aktuellerIndex(JSONArray punkte) {
        long jetzt = System.currentTimeMillis();
        int index = 0;
        for (int i = 0; i < punkte.length(); i++) {
            JSONObject p = punkte.optJSONObject(i);
            long zeitMs = p != null ? p.optLong("zeitMs", Long.MAX_VALUE) : Long.MAX_VALUE;
            if (zeitMs <= jetzt) index = i; else break;
        }
        return index;
    }

    // Manuell per Zurück/Weiter gewählter Punkt-Index dieser einen Widget-
    // Instanz innerhalb des aktuell gewaehlten Tages (Pendant zu
    // aktuelleFahrtManuellerIndex in app.js) - null = automatisch anhand
    // der Uhrzeit.
    public static Integer manuellerIndexLaden(Context ctx, int appWidgetId) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String schluessel = SCHLUESSEL_MANUELL_PREFIX + appWidgetId;
        if (!prefs.contains(schluessel)) return null;
        return prefs.getInt(schluessel, 0);
    }

    public static void manuellerIndexSpeichern(Context ctx, int appWidgetId, int index) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putInt(SCHLUESSEL_MANUELL_PREFIX + appWidgetId, index).apply();
    }

    public static void manuellerIndexLoeschen(Context ctx, int appWidgetId) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .remove(SCHLUESSEL_MANUELL_PREFIX + appWidgetId).apply();
    }

    // Manuell per Pfeile oben gewaehlter Tag-Index dieser einen Widget-
    // Instanz - null = automatisch (heutiger Tag).
    public static Integer manuellerTagIndexLaden(Context ctx, int appWidgetId) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String schluessel = SCHLUESSEL_MANUELL_TAG_PREFIX + appWidgetId;
        if (!prefs.contains(schluessel)) return null;
        return prefs.getInt(schluessel, 0);
    }

    public static void manuellerTagIndexSpeichern(Context ctx, int appWidgetId, int index) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putInt(SCHLUESSEL_MANUELL_TAG_PREFIX + appWidgetId, index).apply();
    }

    public static void manuellerTagIndexLoeschen(Context ctx, int appWidgetId) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .remove(SCHLUESSEL_MANUELL_TAG_PREFIX + appWidgetId).apply();
    }

    // ---------- Darstellung (beide Widgets): Deckkraft des Hintergrunds ----------
    // 0..100 in 10er-Schritten je Widget-Instanz, Standard 100 (deckend).
    private static final String PREFS_DARSTELLUNG = "widget_darstellung";
    private static final String SCHLUESSEL_DECKKRAFT_PREFIX = "deckkraft_";

    public static int deckkraftLaden(Context ctx, int appWidgetId) {
        return ctx.getSharedPreferences(PREFS_DARSTELLUNG, Context.MODE_PRIVATE)
                .getInt(SCHLUESSEL_DECKKRAFT_PREFIX + appWidgetId, 100);
    }

    public static void deckkraftSpeichern(Context ctx, int appWidgetId, int prozent) {
        int gerundet = Math.max(0, Math.min(100, Math.round(prozent / 10f) * 10));
        ctx.getSharedPreferences(PREFS_DARSTELLUNG, Context.MODE_PRIVATE).edit()
                .putInt(SCHLUESSEL_DECKKRAFT_PREFIX + appWidgetId, gerundet).apply();
    }

    public static void deckkraftLoeschen(Context ctx, int appWidgetId) {
        ctx.getSharedPreferences(PREFS_DARSTELLUNG, Context.MODE_PRIVATE).edit()
                .remove(SCHLUESSEL_DECKKRAFT_PREFIX + appWidgetId).apply();
    }

    // Hintergrund-Drawable (drawable/ bzw. drawable-night/widget_bg_<prozent>) fuer dieses Widget
    public static int hintergrundRes(Context ctx, int appWidgetId) {
        return ctx.getResources().getIdentifier("widget_bg_" + deckkraftLaden(ctx, appWidgetId), "drawable", ctx.getPackageName());
    }

    // ---------- Kalender-Widget ----------
    // Eigene Preferences-Datei: {"schichten": {"2026-09-21": {s: "05:12", t: "", m: false}, ...},
    // "feiertage": {"2026-10-03": {a: "f", k: "Einheit"}, ...}} plus je Widget-Instanz der
    // angezeigte Monat als Versatz zum aktuellen Monat (0 = dieser Monat).
    private static final String PREFS_KALENDER = "kalender_widget";
    private static final String SCHLUESSEL_KALENDER = "kalender_json";
    private static final String SCHLUESSEL_VERSATZ_PREFIX = "monat_versatz_";

    public static void kalenderSpeichern(Context ctx, String json) {
        ctx.getSharedPreferences(PREFS_KALENDER, Context.MODE_PRIVATE).edit()
                .putString(SCHLUESSEL_KALENDER, json).apply();
    }

    public static JSONObject kalenderLaden(Context ctx) {
        String json = ctx.getSharedPreferences(PREFS_KALENDER, Context.MODE_PRIVATE).getString(SCHLUESSEL_KALENDER, "{}");
        try {
            return new JSONObject(json);
        } catch (JSONException e) {
            return new JSONObject();
        }
    }

    public static int kalenderVersatzLaden(Context ctx, int appWidgetId) {
        return ctx.getSharedPreferences(PREFS_KALENDER, Context.MODE_PRIVATE).getInt(SCHLUESSEL_VERSATZ_PREFIX + appWidgetId, 0);
    }

    public static void kalenderVersatzSpeichern(Context ctx, int appWidgetId, int versatz) {
        ctx.getSharedPreferences(PREFS_KALENDER, Context.MODE_PRIVATE).edit()
                .putInt(SCHLUESSEL_VERSATZ_PREFIX + appWidgetId, versatz).apply();
    }

    public static void kalenderVersatzLoeschen(Context ctx, int appWidgetId) {
        ctx.getSharedPreferences(PREFS_KALENDER, Context.MODE_PRIVATE).edit()
                .remove(SCHLUESSEL_VERSATZ_PREFIX + appWidgetId).apply();
    }

    public static void alleKalenderVersaetzeLoeschen(Context ctx) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS_KALENDER, Context.MODE_PRIVATE);
        SharedPreferences.Editor e = prefs.edit();
        for (String schluessel : prefs.getAll().keySet()) {
            if (schluessel.startsWith(SCHLUESSEL_VERSATZ_PREFIX)) e.remove(schluessel);
        }
        e.apply();
    }

    // Wird bei neuen Daten und bei jedem echten Wende-/Pausenwechsel
    // aufgerufen, damit alle Widget-Instanzen wieder auf den heutigen Tag
    // und den automatisch aktuellen Punkt springen (wie "Jetzt" in der App).
    public static void alleManuellenIndicesLoeschen(Context ctx) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor e = prefs.edit();
        for (String schluessel : prefs.getAll().keySet()) {
            if (schluessel.startsWith(SCHLUESSEL_MANUELL_PREFIX) || schluessel.startsWith(SCHLUESSEL_MANUELL_TAG_PREFIX)) {
                e.remove(schluessel);
            }
        }
        e.apply();
    }
}
