package de.topbas.dienstplan.widget;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import org.json.JSONArray;

// Ziel der "‹ Zurück" / "Weiter ›"-Taster einer einzelnen Widget-Instanz -
// verschiebt deren manuell gewaehlten Index um -1/+1 (wie
// aktuelleFahrtWeiter()/aktuelleFahrtZurueck() in app.js) und rendert nur
// diese eine Instanz neu.
public class WidgetNavReceiver extends BroadcastReceiver {
    public static final String EXTRA_RICHTUNG = "richtung";

    @Override
    public void onReceive(Context context, Intent intent) {
        int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);
        int richtung = intent.getIntExtra(EXTRA_RICHTUNG, 0);
        if (appWidgetId == -1 || richtung == 0) return;

        JSONArray punkte = WidgetDaten.punkteLaden(context);
        if (punkte.length() == 0) return;

        Integer manuell = WidgetDaten.manuellerIndexLaden(context, appWidgetId);
        int aktuell = manuell != null ? manuell : WidgetDaten.aktuellerIndex(punkte);
        int neu = Math.max(0, Math.min(punkte.length() - 1, aktuell + richtung));
        WidgetDaten.manuellerIndexSpeichern(context, appWidgetId, neu);

        AktuelleFahrtWidgetProvider.aktualisieren(context, AppWidgetManager.getInstance(context), appWidgetId);
    }
}
