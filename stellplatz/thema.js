// Gewählten Hell-/Nachtmodus setzen, bevor die Seite gezeichnet wird (sonst blitzt kurz das falsche Farbschema auf).
try {
    const thema = localStorage.getItem('stellplatz-thema');
    if (thema === 'hell' || thema === 'dunkel') document.documentElement.dataset.thema = thema;
} catch (e) { /* ohne Speicher: Handy-Einstellung */ }
