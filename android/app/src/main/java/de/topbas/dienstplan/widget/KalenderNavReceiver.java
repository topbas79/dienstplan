package de.topbas.dienstplan.widget;

import android.appwidget.AppWidgetManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

// Ziel der Taster im Kalender-Widget: "‹" / "›" verschieben den angezeigten Monat dieser einen
// Widget-Instanz um -1/+1, ein Tipp auf den Monatsnamen (richtung 0) springt zurueck auf heute.
public class KalenderNavReceiver extends BroadcastReceiver {
    public static final String EXTRA_RICHTUNG = "richtung";
    private static final int MAX_VERSATZ = 36;   // hoechstens 3 Jahre vor/zurueck

    @Override
    public void onReceive(Context context, Intent intent) {
        int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, -1);
        int richtung = intent.getIntExtra(EXTRA_RICHTUNG, 0);
        if (appWidgetId == -1) return;

        int neu = richtung == 0 ? 0
                : Math.max(-MAX_VERSATZ, Math.min(MAX_VERSATZ, WidgetDaten.kalenderVersatzLaden(context, appWidgetId) + richtung));
        WidgetDaten.kalenderVersatzSpeichern(context, appWidgetId, neu);
        KalenderWidgetProvider.aktualisieren(context, AppWidgetManager.getInstance(context), appWidgetId);
    }
}
