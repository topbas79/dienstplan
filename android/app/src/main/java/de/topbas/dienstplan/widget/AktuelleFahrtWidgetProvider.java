package de.topbas.dienstplan.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.RemoteViews;
import de.topbas.dienstplan.R;
import org.json.JSONArray;
import org.json.JSONObject;

// Zeigt den aktuellen/naechsten Wende- oder Pausenpunkt des heutigen
// Dienstes (wie die "Aktuelle Fahrt"-Ansicht in der App). Bewusst OHNE
// StackView/RemoteViewsService gebaut: der wischbare Kartenstapel wird von
// manchen Launchern (u. a. getestet auf Samsung One UI) nicht zuverlaessig
// unterstuetzt und zeigte dort alle Punkte nebeneinander statt gestapelt.
// Stattdessen genau wie in der App selbst: feste Karte mit "‹ Zurück" /
// "Weiter ›"-Tastern, die per PendingIntent einen Index-Wechsel ausloesen
// (siehe WidgetNavReceiver).
public class AktuelleFahrtWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int id : appWidgetIds) {
            aktualisieren(context, appWidgetManager, id);
        }
    }

    @Override
    public void onDeleted(Context context, int[] appWidgetIds) {
        for (int id : appWidgetIds) {
            WidgetDaten.manuellerIndexLoeschen(context, id);
        }
    }

    public static void aktualisieren(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_aktuelle_fahrt);

        JSONArray punkte = WidgetDaten.punkteLaden(context);
        int gesamt = punkte.length();

        if (gesamt == 0) {
            views.setViewVisibility(R.id.karte, View.GONE);
            views.setViewVisibility(R.id.leer_text, View.VISIBLE);
            appWidgetManager.updateAppWidget(appWidgetId, views);
            return;
        }

        views.setViewVisibility(R.id.karte, View.VISIBLE);
        views.setViewVisibility(R.id.leer_text, View.GONE);

        Integer manuell = WidgetDaten.manuellerIndexLaden(context, appWidgetId);
        int index = Math.max(0, Math.min(gesamt - 1,
                manuell != null ? manuell : WidgetDaten.aktuellerIndex(punkte)));

        JSONObject p = punkte.optJSONObject(index);
        if (p != null) {
            views.setTextViewText(R.id.item_label, p.optString("label", ""));
            views.setTextViewText(R.id.item_ort, p.optString("ort", "–"));

            String ankunft = p.optString("ankunft", "");
            String abfahrt = p.optString("abfahrt", "");
            String zeitText;
            if (!ankunft.isEmpty() && ankunft.equals(abfahrt)) {
                zeitText = "Abfahrt " + abfahrt;
            } else {
                StringBuilder sb = new StringBuilder();
                if (!ankunft.isEmpty()) sb.append("Ankunft ").append(ankunft);
                if (!abfahrt.isEmpty()) {
                    if (sb.length() > 0) sb.append("   ");
                    sb.append("Abfahrt ").append(abfahrt);
                }
                zeitText = sb.toString();
            }
            views.setTextViewText(R.id.item_zeiten, zeitText);

            String folge = p.optString("folge", "");
            views.setTextViewText(R.id.item_folge, folge);
        }

        views.setTextViewText(R.id.nav_position, (index + 1) + " / " + gesamt);

        views.setOnClickPendingIntent(R.id.nav_zurueck,
                navPendingIntent(context, appWidgetId, -1));
        views.setOnClickPendingIntent(R.id.nav_weiter,
                navPendingIntent(context, appWidgetId, 1));
        views.setViewVisibility(R.id.nav_zurueck, index > 0 ? View.VISIBLE : View.INVISIBLE);
        views.setViewVisibility(R.id.nav_weiter, index < gesamt - 1 ? View.VISIBLE : View.INVISIBLE);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static PendingIntent navPendingIntent(Context context, int appWidgetId, int richtung) {
        Intent intent = new Intent(context, WidgetNavReceiver.class)
                .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                .putExtra(WidgetNavReceiver.EXTRA_RICHTUNG, richtung);
        // Eindeutiger Request-Code je (Widget, Richtung), sonst ueberschreiben
        // sich die PendingIntents mehrerer Widget-Instanzen gegenseitig.
        int requestCode = appWidgetId * 10 + (richtung < 0 ? 1 : 2);
        return PendingIntent.getBroadcast(context, requestCode, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // Von aussen (Bridge-Plugin, Alarm-Empfaenger) aufgerufen, um alle
    // platzierten Instanzen dieses Widgets auf den Stand zu bringen.
    // resetManuell=true (neue Daten oder echter Wende-/Pausenwechsel)
    // springt alle Instanzen wieder auf den automatisch aktuellen Punkt,
    // so wie "Jetzt" in der App.
    public static void alleAktualisieren(Context context, boolean resetManuell) {
        if (resetManuell) WidgetDaten.alleManuellenIndicesLoeschen(context);
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(context, AktuelleFahrtWidgetProvider.class));
        for (int id : ids) aktualisieren(context, mgr, id);
    }
}
