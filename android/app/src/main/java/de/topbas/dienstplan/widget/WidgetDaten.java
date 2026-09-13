package de.topbas.dienstplan.widget;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// Gemeinsamer Speicher- und Auswertungscode fuer das "Aktuelle Fahrt"-Widget -
// wird sowohl vom Capacitor-Bridge-Plugin (schreibt) als auch vom Widget-
// Provider/Empfaenger (liest) genutzt.
public class WidgetDaten {
    private static final String PREFS = "aktuelle_fahrt_widget";
    private static final String SCHLUESSEL_PUNKTE = "punkte_json";
    private static final String SCHLUESSEL_UEBERSICHT = "uebersicht_text";
    private static final String SCHLUESSEL_MANUELL_PREFIX = "manueller_index_";

    public static void punkteSpeichern(Context ctx, String punkteJson) {
        SharedPreferences.Editor e = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit();
        e.putString(SCHLUESSEL_PUNKTE, punkteJson);
        e.apply();
    }

    public static JSONArray punkteLaden(Context ctx) {
        String json = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(SCHLUESSEL_PUNKTE, "[]");
        try {
            return new JSONArray(json);
        } catch (JSONException e) {
            return new JSONArray();
        }
    }

    // Kurzuebersicht (letzte/naechste Dienste) fuer Tage ohne aktuellen Dienst
    // (frei/krank/Urlaub) - fertig formatierter Text aus app.js, damit die
    // Datumsformatierung (deutsche Schreibweise) nicht doppelt gepflegt wird.
    public static void uebersichtSpeichern(Context ctx, String text) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putString(SCHLUESSEL_UEBERSICHT, text == null ? "" : text).apply();
    }

    public static String uebersichtLaden(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(SCHLUESSEL_UEBERSICHT, "");
    }

    // Letzter Punkt, dessen Zeit schon erreicht ist - spiegelt exakt
    // aktuelleFahrtAutoIndex() in app.js, nur mit fertigen zeitMs statt
    // erneuter Datumsberechnung.
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

    // Manuell per Zurück/Weiter gewählter Index dieser einen Widget-Instanz
    // (Pendant zu aktuelleFahrtManuellerIndex in app.js) - null = automatisch
    // anhand der Uhrzeit.
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

    // Wird bei neuen Daten (neuer Dienst) und bei jedem echten Wende-/
    // Pausenwechsel aufgerufen, damit alle Widget-Instanzen wieder auf den
    // automatisch aktuellen Punkt springen (wie "Jetzt" in der App).
    public static void alleManuellenIndicesLoeschen(Context ctx) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        SharedPreferences.Editor e = prefs.edit();
        for (String schluessel : prefs.getAll().keySet()) {
            if (schluessel.startsWith(SCHLUESSEL_MANUELL_PREFIX)) e.remove(schluessel);
        }
        e.apply();
    }
}
