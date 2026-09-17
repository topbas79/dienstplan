package de.topbas.dienstplan;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import com.getcapacitor.JSArray;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import de.topbas.dienstplan.widget.AktuelleFahrtWidgetProvider;
import de.topbas.dienstplan.widget.WidgetDaten;
import de.topbas.dienstplan.widget.WidgetUpdateReceiver;
import org.json.JSONException;

// Bruecke zwischen app.js (Aktuelle-Fahrt-Punkte des heutigen Dienstes) und
// dem nativen Homescreen-Widget: speichert die Punkte fuer das Widget und
// plant exakte Alarme, damit das Widget sich genau bei jedem Wende-/
// Pausenwechsel auf den neuen aktuellen Punkt umschaltet (nicht nur alle
// 30 Min wie beim normalen Android-Widget-Update).
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    // Eigener Request-Code-Bereich fuer unsere Alarme, damit sie nicht mit
    // denen der Benachrichtigungen oder anderer Funktionen kollidieren.
    private static final int ALARM_REQUEST_BASIS = 91000;
    private static final int ALARM_MAX_ANZAHL = 32;

    // Speichert die letzten/naechsten gespeicherten Dienste (jeweils mit
    // ihren Fahrtpunkten) fuers Widget, plus den Index des heutigen Tages
    // darin - damit sich per Pfeile oben zwischen Tagen blaettern laesst.
    @PluginMethod
    public void tageSpeichern(PluginCall call) {
        String tageJson = call.getString("tageJson", "[]");
        int heuteIndex = call.getInt("heuteIndex", -1);
        Context ctx = getContext().getApplicationContext();
        WidgetDaten.tageSpeichern(ctx, tageJson, heuteIndex);
        AktuelleFahrtWidgetProvider.alleAktualisieren(ctx, true);
        call.resolve();
    }

    @PluginMethod
    public void updatesPlanen(PluginCall call) {
        Context ctx = getContext().getApplicationContext();
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) { call.resolve(); return; }

        alteAlarmeVerwerfen(ctx, am);

        JSArray zeiten = call.getArray("zeitenMs");
        if (zeiten != null) {
            try {
                int anzahl = Math.min(zeiten.length(), ALARM_MAX_ANZAHL);
                for (int i = 0; i < anzahl; i++) {
                    long zeitMs = zeiten.getLong(i);
                    if (zeitMs <= System.currentTimeMillis()) continue;
                    PendingIntent pi = PendingIntent.getBroadcast(ctx, ALARM_REQUEST_BASIS + i,
                            new Intent(ctx, WidgetUpdateReceiver.class),
                            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, zeitMs, pi);
                }
            } catch (JSONException e) {
                call.reject("Ungueltige Zeiten", e);
                return;
            }
        }
        call.resolve();
    }

    @PluginMethod
    public void leeren(PluginCall call) {
        Context ctx = getContext().getApplicationContext();
        WidgetDaten.tageSpeichern(ctx, "[]", -1);
        AktuelleFahrtWidgetProvider.alleAktualisieren(ctx, true);
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am != null) alteAlarmeVerwerfen(ctx, am);
        call.resolve();
    }

    private void alteAlarmeVerwerfen(Context ctx, AlarmManager am) {
        for (int i = 0; i < ALARM_MAX_ANZAHL; i++) {
            PendingIntent alt = PendingIntent.getBroadcast(ctx, ALARM_REQUEST_BASIS + i,
                    new Intent(ctx, WidgetUpdateReceiver.class),
                    PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);
            if (alt != null) {
                am.cancel(alt);
                alt.cancel();
            }
        }
    }
}
