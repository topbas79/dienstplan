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

// Zeigt den aktuellen/naechsten Wende- oder Pausenpunkt eines Dienstes (wie
// die "Aktuelle Fahrt"-Ansicht in der App) - standardmaessig des heutigen,
// per Pfeile oben lassen sich aber auch die letzten/naechsten gespeicherten
// Dienste durchblaettern. Bewusst OHNE StackView/RemoteViewsService gebaut:
// der wischbare Kartenstapel wird von manchen Launchern (u. a. getestet auf
// Samsung One UI) nicht zuverlaessig unterstuetzt und zeigte dort alle
// Punkte nebeneinander statt gestapelt. Stattdessen genau wie in der App
// selbst: feste Karte mit Taster-Navigation per PendingIntent (siehe
// WidgetNavReceiver fuer Punkte innerhalb eines Tages, WidgetTagNavReceiver
// fuer den Tageswechsel).
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
            WidgetDaten.manuellerTagIndexLoeschen(context, id);
        }
    }

    public static void aktualisieren(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_aktuelle_fahrt);

        JSONArray tage = WidgetDaten.tageLaden(context);
        int tageGesamt = tage.length();

        if (tageGesamt == 0) {
            views.setViewVisibility(R.id.tag_nav, View.GONE);
            views.setViewVisibility(R.id.karte, View.GONE);
            views.setViewVisibility(R.id.leer_text, View.VISIBLE);
            views.setTextViewText(R.id.leer_text, "Kein Dienst gespeichert");
            appWidgetManager.updateAppWidget(appWidgetId, views);
            return;
        }

        int tagIndex = WidgetDaten.aktuellerTagIndex(context, appWidgetId, tageGesamt);
        JSONObject tag = tage.optJSONObject(tagIndex);
        JSONArray punkte = WidgetDaten.punkteFuerTag(tage, tagIndex);
        int gesamt = punkte.length();

        // Tag-Kopfzeile (Dienstnummer + Datum) und Pfeile zum Blaettern
        // durch die gespeicherten Tage - immer sichtbar, unabhaengig davon
        // ob der gewaehlte Tag Fahrtdaten hat.
        views.setViewVisibility(R.id.tag_nav, View.VISIBLE);
        String dienstnummer = tag != null ? tag.optString("dienstnummer", "") : "";
        String datumKurz = tag != null ? tag.optString("datumKurz", "") : "";
        StringBuilder kopf = new StringBuilder();
        if (!dienstnummer.isEmpty()) kopf.append("Dienst ").append(dienstnummer);
        if (!datumKurz.isEmpty()) {
            if (kopf.length() > 0) kopf.append(" · ");
            kopf.append(datumKurz);
        }
        views.setTextViewText(R.id.tag_kopf, kopf.toString());
        views.setOnClickPendingIntent(R.id.tag_zurueck, tagNavPendingIntent(context, appWidgetId, -1));
        views.setOnClickPendingIntent(R.id.tag_weiter, tagNavPendingIntent(context, appWidgetId, 1));
        views.setViewVisibility(R.id.tag_zurueck, tagIndex > 0 ? View.VISIBLE : View.INVISIBLE);
        views.setViewVisibility(R.id.tag_weiter, tagIndex < tageGesamt - 1 ? View.VISIBLE : View.INVISIBLE);

        if (gesamt == 0) {
            views.setViewVisibility(R.id.karte, View.GONE);
            views.setViewVisibility(R.id.leer_text, View.VISIBLE);
            views.setTextViewText(R.id.leer_text, "Keine Fahrtdaten für diesen Tag");
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

    private static PendingIntent tagNavPendingIntent(Context context, int appWidgetId, int richtung) {
        Intent intent = new Intent(context, WidgetTagNavReceiver.class)
                .putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                .putExtra(WidgetTagNavReceiver.EXTRA_RICHTUNG, richtung);
        // Eigener Request-Code-Bereich (+5/+6), damit er nicht mit den
        // Punkt-Navigations-PendingIntents (+1/+2) desselben Widgets kollidiert.
        int requestCode = appWidgetId * 10 + (richtung < 0 ? 5 : 6);
        return PendingIntent.getBroadcast(context, requestCode, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // Von aussen (Bridge-Plugin, Alarm-Empfaenger) aufgerufen, um alle
    // platzierten Instanzen dieses Widgets auf den Stand zu bringen.
    // resetManuell=true (neue Daten oder echter Wende-/Pausenwechsel)
    // springt alle Instanzen wieder auf den heutigen Tag und den
    // automatisch aktuellen Punkt, so wie "Jetzt" in der App.
    public static void alleAktualisieren(Context context, boolean resetManuell) {
        if (resetManuell) WidgetDaten.alleManuellenIndicesLoeschen(context);
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(context, AktuelleFahrtWidgetProvider.class));
        for (int id : ids) aktualisieren(context, mgr, id);
    }
}
