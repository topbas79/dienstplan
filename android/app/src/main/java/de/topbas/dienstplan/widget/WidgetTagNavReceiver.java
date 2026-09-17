package de.topbas.dienstplan.widget;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import org.json.JSONArray;

// Ziel der "‹" / "›"-Taster oben in einer Widget-Instanz - verschiebt deren
// manuell gewaehlten Tag-Index um -1/+1 und setzt die Punkt-Navigation
// dieser Instanz zurueck auf automatisch, damit der neue Tag mit seinem
// eigenen aktuellen/ersten Punkt startet statt mit dem zuvor manuell
// gewaehlten Punkt des alten Tages.
public class WidgetTagNavReceiver extends BroadcastReceiver {
    public static final String EXTRA_RICHTUNG = "richtung";

    @Override
    public void onReceive(Context context, Intent intent) {
        int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);
        int richtung = intent.getIntExtra(EXTRA_RICHTUNG, 0);
        if (appWidgetId == -1 || richtung == 0) return;

        JSONArray tage = WidgetDaten.tageLaden(context);
        int tageGesamt = tage.length();
        if (tageGesamt == 0) return;

        int aktuell = WidgetDaten.aktuellerTagIndex(context, appWidgetId, tageGesamt);
        int neu = Math.max(0, Math.min(tageGesamt - 1, aktuell + richtung));
        WidgetDaten.manuellerTagIndexSpeichern(context, appWidgetId, neu);
        WidgetDaten.manuellerIndexLoeschen(context, appWidgetId);

        AktuelleFahrtWidgetProvider.aktualisieren(context, AppWidgetManager.getInstance(context), appWidgetId);
    }
}
