package de.topbas.dienstplan.widget;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProviderInfo;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.widget.SeekBar;
import android.widget.TextView;
import de.topbas.dienstplan.R;

// Einstellungen eines Widgets (beide Widgets nutzen sie): Deckkraft des Hintergrunds in 10-%-Schritten.
// Erscheint beim Hinzufuegen des Widgets und - dank "reconfigurable" - spaeter ueber langes Druecken auf das
// Widget -> Einstellungen. Aenderungen sieht man sofort im Widget hinter dem Dialog.
public class WidgetKonfigActivity extends Activity {

    private int appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle extras = getIntent() != null ? getIntent().getExtras() : null;
        if (extras != null) {
            appWidgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            setResult(RESULT_CANCELED);
            finish();
            return;
        }

        // Die Einstellung ist freiwillig: auch wer den Dialog einfach wegtippt, bekommt das Widget
        setResult(RESULT_OK, new Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId));

        setContentView(R.layout.widget_konfig);
        final SeekBar regler = findViewById(R.id.konfig_regler);
        final TextView wert = findViewById(R.id.konfig_wert);

        int prozent = WidgetDaten.deckkraftLaden(this, appWidgetId);
        regler.setProgress(prozent / 10);
        wert.setText(text(prozent));

        regler.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean vonNutzer) {
                int neu = progress * 10;
                wert.setText(text(neu));
                WidgetDaten.deckkraftSpeichern(WidgetKonfigActivity.this, appWidgetId, neu);
                widgetNeuZeichnen(WidgetKonfigActivity.this, appWidgetId);
            }

            @Override public void onStartTrackingTouch(SeekBar seekBar) { }
            @Override public void onStopTrackingTouch(SeekBar seekBar) { }
        });

        findViewById(R.id.konfig_fertig).setOnClickListener(v -> finish());
    }

    private static String text(int prozent) {
        if (prozent >= 100) return "Deckend";
        if (prozent <= 0) return "Durchsichtig";
        return prozent + " % Deckkraft";
    }

    // Zeichnet genau dieses eine Widget neu (je nach Art)
    static void widgetNeuZeichnen(Context ctx, int id) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        AppWidgetProviderInfo info = mgr.getAppWidgetInfo(id);
        if (info == null) return;
        if (KalenderWidgetProvider.class.getName().equals(info.provider.getClassName())) {
            KalenderWidgetProvider.aktualisieren(ctx, mgr, id);
        } else {
            AktuelleFahrtWidgetProvider.aktualisieren(ctx, mgr, id);
        }
    }
}
