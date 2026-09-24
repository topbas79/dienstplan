package de.topbas.dienstplan;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import de.topbas.dienstplan.widget.AktuelleFahrtWidgetProvider;
import de.topbas.dienstplan.widget.KalenderWidgetProvider;
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

    // Tag, auf den im Kalender-Widget getippt wurde ("2026-09-21") - bleibt gemerkt, bis die App ihn
    // abholt (sie kann beim Antippen noch gar nicht gestartet/angemeldet sein).
    private static String offenesDatum = null;

    // App wird durch Tipp aufs Widget neu gestartet
    @Override
    public void load() {
        datumUebernehmen(getActivity() != null ? getActivity().getIntent() : null);
    }

    // App laeuft schon und wird durch Tipp aufs Widget nach vorn geholt
    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        if (datumUebernehmen(intent)) notifyListeners("widgetTag", new JSObject());
    }

    private static boolean datumUebernehmen(Intent intent) {
        if (intent == null) return false;
        String datum = intent.getStringExtra("widget_datum");
        if (datum == null) return false;
        offenesDatum = datum;
        intent.removeExtra("widget_datum");   // nicht bei jeder Neuerstellung der Oberflaeche erneut auslesen
        return true;
    }

    // Holt (und loescht) den vom Widget angetippten Tag - leeres Objekt, wenn keiner ansteht
    @PluginMethod
    public void offenesDatum(PluginCall call) {
        JSObject ergebnis = new JSObject();
        if (offenesDatum != null) {
            ergebnis.put("datum", offenesDatum);
            offenesDatum = null;
        }
        call.resolve(ergebnis);
    }

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

    // Alle gespeicherten Tage fuers Kalender-Widget (Dienste, Urlaub/Krank/Frei, Feiertage).
    // Bei neuen Daten springen alle Kalender-Widgets wieder auf den aktuellen Monat.
    @PluginMethod
    public void kalenderSpeichern(PluginCall call) {
        String kalenderJson = call.getString("kalenderJson", "{}");
        Context ctx = getContext().getApplicationContext();
        WidgetDaten.kalenderSpeichern(ctx, kalenderJson);
        KalenderWidgetProvider.alleAktualisieren(ctx, true);
        call.resolve();
    }

    // Bittet Android, ein Widget auf den Startbildschirm zu legen (der Nutzer bestaetigt im
    // Systemdialog). art: "kalender" oder "fahrt". unterstuetzt=false, wenn der Launcher das
    // nicht kann - dann muss das Widget von Hand hinzugefuegt werden.
    @PluginMethod
    public void widgetHinzufuegen(PluginCall call) {
        String art = call.getString("art", "kalender");
        Context ctx = getContext().getApplicationContext();
        boolean unterstuetzt = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
            if (mgr.isRequestPinAppWidgetSupported()) {
                Class<?> klasse = "fahrt".equals(art) ? AktuelleFahrtWidgetProvider.class : KalenderWidgetProvider.class;
                unterstuetzt = mgr.requestPinAppWidget(new ComponentName(ctx, klasse), null, null);
            }
        }
        JSObject ergebnis = new JSObject();
        ergebnis.put("unterstuetzt", unterstuetzt);
        call.resolve(ergebnis);
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
                    try {
                        am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, zeitMs, pi);
                    } catch (SecurityException e) {
                        // Ab Android 12 braucht ein exakter Alarm die Berechtigung "Alarme & Erinnerungen"
                        // (Einstellungen > Apps > Dienstplan > Spezieller Zugriff). Fehlt sie - z. B. weil
                        // die App neu signiert/neu installiert wurde - NIE abstuerzen, sondern ungefaehr
                        // planen. Das Widget aktualisiert sich dann zur Not weiterhin von selbst alle
                        // 30 Minuten (siehe updatePeriodMillis in aktuelle_fahrt_widget_info.xml).
                        try {
                            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, zeitMs, pi);
                        } catch (SecurityException e2) { /* selbes Sicherheitsnetz, dann eben ganz ohne Alarm */ }
                    }
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
        // Auch das Kalender-Widget leeren (z. B. beim Abmelden - keine Daten auf dem Startbildschirm liegen lassen)
        WidgetDaten.kalenderSpeichern(ctx, "{}");
        KalenderWidgetProvider.alleAktualisieren(ctx, true);
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am != null) alteAlarmeVerwerfen(ctx, am);
        call.resolve();
    }

    // Meldet, ob punktgenaue Widget-Updates gerade moeglich sind (fuer eine kleine Statusanzeige
    // in den Einstellungen). Vor Android 12 gibt es diese Einschraenkung gar nicht - dort immer true.
    @PluginMethod
    public void alarmBerechtigungStatus(PluginCall call) {
        boolean erlaubt = true;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager am = (AlarmManager) getContext().getApplicationContext().getSystemService(Context.ALARM_SERVICE);
            erlaubt = am != null && am.canScheduleExactAlarms();
        }
        JSObject ergebnis = new JSObject();
        ergebnis.put("erlaubt", erlaubt);
        call.resolve(ergebnis);
    }

    // Oeffnet direkt den passenden Android-Einstellungsbildschirm fuer diese App (spart das
    // Suchen durch "Spezieller App-Zugriff"). Vor Android 12 gibt es dort nichts zu erlauben.
    @PluginMethod
    public void alarmBerechtigungOeffnen(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            Context ctx = getContext().getApplicationContext();
            Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
            intent.setData(Uri.parse("package:" + ctx.getPackageName()));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(intent);
        }
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
