package de.topbas.dienstplan.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.view.View;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.style.RelativeSizeSpan;
import android.text.style.StyleSpan;
import android.widget.RemoteViews;
import de.topbas.dienstplan.MainActivity;
import de.topbas.dienstplan.R;
import java.util.Calendar;
import java.util.Locale;
import org.json.JSONObject;

// Monatskalender fuers Homescreen: zeigt wie der Kalender der App alle gespeicherten Dienste
// (mit Dienstbeginn), Urlaub, Krank- und freie Tage sowie Feiertage. Mit den Pfeilen oben
// laesst sich durch die Monate blaettern, Tippen auf den Monatsnamen springt zurueck auf
// heute, Tippen irgendwo sonst oeffnet die App. Die Daten schreibt WidgetBridgePlugin
// (kalenderSpeichern), hier wird nur gelesen und gezeichnet.
public class KalenderWidgetProvider extends AppWidgetProvider {

    private static final String[] MONATE = {"Januar", "Februar", "März", "April", "Mai", "Juni",
            "Juli", "August", "September", "Oktober", "November", "Dezember"};

    private static int[] zellenIds;
    private static int[] zeilenIds;

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int id : appWidgetIds) aktualisieren(context, appWidgetManager, id);
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        for (int id : appWidgetIds) {
            WidgetDaten.kalenderVersatzLoeschen(context, id);
            WidgetDaten.deckkraftLoeschen(context, id);
        }
    }

    private static synchronized int[] zeilenIds(Context context) {
        if (zeilenIds == null) {
            int[] ids = new int[6];
            for (int i = 0; i < ids.length; i++) {
                ids[i] = context.getResources().getIdentifier("kal_zeile_" + i, "id", context.getPackageName());
            }
            zeilenIds = ids;
        }
        return zeilenIds;
    }

    // Textfarben je Zustand {hell, dunkel} - passend zu den Zellen-Hintergruenden (drawable/kal_zelle_*
    // und drawable-night/kal_zelle_*), Werte wie im App-Kalender (styles.css, body.dark).
    private static int[] textFarben(String zustand) {
        switch (zustand) {
            case "schicht":    return new int[]{Color.parseColor("#15803D"), Color.parseColor("#4ADE80")};
            case "mehrarbeit": return new int[]{Color.parseColor("#92400E"), Color.parseColor("#FDE68A")};
            case "krank":      return new int[]{Color.parseColor("#5B21B6"), Color.parseColor("#DDD6FE")};
            case "urlaub":     return new int[]{Color.parseColor("#075985"), Color.parseColor("#BAE6FD")};
            case "frei":       return new int[]{Color.parseColor("#475569"), Color.parseColor("#E2E8F0")};
            case "feiertag":   return new int[]{Color.parseColor("#B91C1C"), Color.parseColor("#FCA5A5")};
            case "sondertag":  return new int[]{Color.parseColor("#B45309"), Color.parseColor("#FCD34D")};
            default:           return new int[]{Color.parseColor("#12141C"), Color.parseColor("#F1F5F9")};
        }
    }

    // Ab Android 12 bekommt das Widget beide Farben mit und wechselt selbst mit dem Dunkelmodus;
    // davor wird die zum Zeitpunkt des Zeichnens passende Farbe festgelegt.
    private static void textFarbeSetzen(Context context, RemoteViews views, int viewId, String zustand) {
        int[] farben = textFarben(zustand);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            views.setColorInt(viewId, "setTextColor", farben[0], farben[1]);
        } else {
            boolean nacht = (context.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK)
                    == Configuration.UI_MODE_NIGHT_YES;
            views.setTextColor(viewId, nacht ? farben[1] : farben[0]);
        }
    }

    private static synchronized int[] zellenIds(Context context) {
        if (zellenIds == null) {
            int[] ids = new int[KalenderGitter.ZELLEN];
            for (int i = 0; i < ids.length; i++) {
                ids[i] = context.getResources().getIdentifier("kal_tag_" + i, "id", context.getPackageName());
            }
            zellenIds = ids;
        }
        return zellenIds;
    }

    public static void aktualisieren(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_kalender);

        JSONObject daten = WidgetDaten.kalenderLaden(context);
        JSONObject schichten = daten.optJSONObject("schichten");
        JSONObject feiertage = daten.optJSONObject("feiertage");
        if (schichten == null) schichten = new JSONObject();
        if (feiertage == null) feiertage = new JSONObject();

        Calendar heute = Calendar.getInstance();
        String heuteStr = String.format(Locale.US, "%04d-%02d-%02d",
                heute.get(Calendar.YEAR), heute.get(Calendar.MONTH) + 1, heute.get(Calendar.DAY_OF_MONTH));

        int versatz = WidgetDaten.kalenderVersatzLaden(context, appWidgetId);
        KalenderGitter gitter = KalenderGitter.fuer(heute, versatz);
        views.setTextViewText(R.id.kal_titel, MONATE[gitter.monat] + " " + gitter.jahr);
        views.setInt(R.id.kal_wurzel, "setBackgroundResource", WidgetDaten.hintergrundRes(context, appWidgetId));

        // Zeilen ohne einen Tag des Monats (z. B. die 6. bei einem Monat mit 5 Wochen) ausblenden,
        // dann werden die uebrigen Zeilen hoeher
        int[] zeilen = zeilenIds(context);
        for (int z = 0; z < zeilen.length; z++) {
            boolean leer = gitter.startOffset + gitter.tageImMonat <= z * 7;
            views.setViewVisibility(zeilen[z], leer ? View.GONE : View.VISIBLE);
        }

        int[] ids = zellenIds(context);
        for (int i = 0; i < KalenderGitter.ZELLEN; i++) {
            int tag = gitter.tagInZelle(i);
            if (tag == 0) {
                views.setTextViewText(ids[i], "");
                views.setInt(ids[i], "setBackgroundResource", 0);
                continue;
            }

            String datum = gitter.datum(tag);
            JSONObject sch = schichten.optJSONObject(datum);
            JSONObject ft = feiertage.optJSONObject(datum);

            String zustand = "normal";
            String zeile2 = "";
            if (sch != null) {
                String typ = sch.optString("t", "");
                if ("krank".equals(typ)) { zustand = "krank"; zeile2 = "Krank"; }
                else if ("urlaub".equals(typ)) { zustand = "urlaub"; zeile2 = "Urlaub"; }
                else if ("frei".equals(typ)) { zustand = "frei"; zeile2 = "Frei"; }
                else if (sch.optBoolean("m", false)) { zustand = "mehrarbeit"; zeile2 = sch.optString("s", ""); }
                else { zustand = "schicht"; zeile2 = sch.optString("s", ""); }
            } else if (ft != null) {
                zustand = "f".equals(ft.optString("a", "")) ? "feiertag" : "sondertag";
                zeile2 = ft.optString("k", "");
            }

            String zelle = "kal_zelle_" + zustand + (datum.equals(heuteStr) ? "_heute" : "");
            int hintergrund = context.getResources().getIdentifier(zelle, "drawable", context.getPackageName());
            views.setInt(ids[i], "setBackgroundResource", hintergrund);
            textFarbeSetzen(context, views, ids[i], zustand);

            // Zeile 1: Tageszahl fett, Zeile 2 (Dienstbeginn, Art des Tages oder Feiertag) kleiner
            SpannableStringBuilder text = new SpannableStringBuilder(String.valueOf(tag));
            text.setSpan(new StyleSpan(Typeface.BOLD), 0, text.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            if (!zeile2.isEmpty()) {
                int start = text.length() + 1;
                text.append("\n").append(zeile2);
                text.setSpan(new RelativeSizeSpan(0.72f), start, text.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
            views.setTextViewText(ids[i], text);

            // Tippen auf den Tag oeffnet die App genau bei diesem Tag (wie ein Tipp im Kalender der App)
            views.setOnClickPendingIntent(ids[i], tagPendingIntent(context, appWidgetId, i, datum));
        }

        views.setOnClickPendingIntent(R.id.kal_zurueck, navPendingIntent(context, appWidgetId, -1));
        views.setOnClickPendingIntent(R.id.kal_weiter, navPendingIntent(context, appWidgetId, 1));
        views.setOnClickPendingIntent(R.id.kal_titel, navPendingIntent(context, appWidgetId, 0));

        Intent start = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        if (start != null) {
            views.setOnClickPendingIntent(R.id.kal_wurzel, PendingIntent.getActivity(context,
                    appWidgetId * 10 + 4, start, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE));
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    // Startet die App mit dem gewaehlten Datum (WidgetBridgePlugin reicht es an app.js weiter)
    private static PendingIntent tagPendingIntent(Context context, int appWidgetId, int zelle, String datum) {
        Intent intent = new Intent(context, MainActivity.class)
                .setAction("de.topbas.dienstplan.WIDGET_TAG")
                .setData(Uri.parse("dienstplan://kalender/" + datum))
                .putExtra("widget_datum", datum)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(context, appWidgetId * 100 + zelle, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static PendingIntent navPendingIntent(Context context, int appWidgetId, int richtung) {
        Intent intent = new Intent(context, KalenderNavReceiver.class)
                .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                .putExtra(KalenderNavReceiver.EXTRA_RICHTUNG, richtung);
        // Eindeutiger Request-Code je (Widget, Richtung), sonst ueberschreiben sich die PendingIntents
        int requestCode = appWidgetId * 10 + (richtung < 0 ? 1 : (richtung > 0 ? 2 : 3));
        return PendingIntent.getBroadcast(context, requestCode, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // Von aussen (Bridge-Plugin, Alarm-Empfaenger) aufgerufen. zuruecksetzen=true springt alle
    // Instanzen wieder auf den aktuellen Monat (bei neuen Daten aus der App).
    public static void alleAktualisieren(Context context, boolean zuruecksetzen) {
        if (zuruecksetzen) WidgetDaten.alleKalenderVersaetzeLoeschen(context);
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(context, KalenderWidgetProvider.class));
        for (int id : ids) aktualisieren(context, mgr, id);
    }
}
