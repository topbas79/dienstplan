package de.topbas.dienstplan.widget;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

// Ziel der von WidgetBridgePlugin per AlarmManager exakt zu jedem Wende-/
// Pausenwechsel gesetzten Alarme - aktualisiert bei jedem Feuern nur den
// angezeigten Punkt, laedt keine neuen Daten (das passiert separat beim
// Speichern via WidgetBridgePlugin.datenSpeichern).
public class WidgetUpdateReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        AktuelleFahrtWidgetProvider.alleAktualisieren(context.getApplicationContext(), true);
        // Kalender nur neu zeichnen (die Markierung fuer "heute" wandert mit), Monat nicht zuruecksetzen
        KalenderWidgetProvider.alleAktualisieren(context.getApplicationContext(), false);
    }
}
