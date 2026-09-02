    // ============================================================
    //  ICON-BIBLIOTHEK — Strichzeichnungen statt Emoji, dynamisch erzeugtes Markup
    // ============================================================
    const ICONS = {
        home: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"></path></svg>',
        camera: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5a2 2 0 0 1 2-2h1.2l1-1.5h7.6l1 1.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5Z"></path><circle cx="12" cy="13" r="3.1"></circle></svg>',
        calendar: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="15" rx="2.5"></rect><path d="M3.5 9.5h17"></path><path d="M8 3.5v4M16 3.5v4"></path></svg>',
        chat: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5V17.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5Z"></path></svg>',
        more: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>',
        gear: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.6a1.7 1.7 0 0 0 1-1.55V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.6a1.7 1.7 0 0 0 1 .9h.19a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"></path></svg>',
        chart: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="3.4" height="8" rx="1"></rect><rect x="10.3" y="7" width="3.4" height="13" rx="1"></rect><rect x="16.6" y="3.5" width="3.4" height="16.5" rx="1"></rect></svg>',
        history: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3.2 2"></path></svg>',
        fileText: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z"></path><path d="M14 3.5V8h4"></path><path d="M8.5 12.5h7M8.5 15.5h7M8.5 9.5h2"></path></svg>',
        mapPin: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.7A7 7 0 0 0 5 9.3C5 14.8 12 21 12 21Z"></path><circle cx="12" cy="9.3" r="2.4"></circle></svg>',
        calendarDownload: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="15" rx="2.5"></rect><path d="M3.5 9.5h17"></path><path d="M12 12v5.5M9.7 15.3 12 17.6l2.3-2.3"></path></svg>',
        download: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v11.5M8 11l4 4 4-4"></path><path d="M4.5 17.5v2A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-2"></path></svg>',
        upload: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5V9M8 13l4-4 4 4"></path><path d="M4.5 17.5v2A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5v-2"></path></svg>',
        users: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="8" r="3"></circle><path d="M2.8 19.5a5.7 5.7 0 0 1 11.4 0"></path><circle cx="17" cy="9" r="2.4"></circle><path d="M15 12.2c2.6.2 4.6 1.9 5.2 4.3"></path></svg>',
        chevronRight: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5 15.5 12 9 18.5"></path></svg>',
        chevronLeft: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5.5 8.5 12 15 18.5"></path></svg>',
        euro: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"></circle><path d="M14.6 9.3a3 3 0 0 0-2.4-1.1c-1.9 0-3.4 1.7-3.4 3.8s1.5 3.8 3.4 3.8a3 3 0 0 0 2.4-1.1M8 11h5.2M8 13.3h5.2"></path></svg>',
        trendUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 16.5 10 10l4 4 6.5-6.5"></path><path d="M15.5 7.5H20.5V12.5"></path></svg>',
        star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="15" rx="2.5"></rect><path d="M3.5 9.5h17"></path><path d="M12 12.3l1 2 2.2.2-1.7 1.5.5 2.1-2-1.2-2 1.2.5-2.1-1.7-1.5 2.2-.2Z"></path></svg>',
        trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"></path><path d="M10 11v6M14 11v6"></path></svg>',
        pencil: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20.5 4.6 17.2 15.8 6l3 3L7.6 20.2 4 20.5Z"></path><path d="M13.8 7.2l3 3"></path></svg>',
        lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.2"></rect><path d="M8 10.5V7.8a4 3.9 0 0 1 8 0v2.7"></path></svg>',
        unlock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.2"></rect><path d="M8 10.5V7.8A4 3.6 0 0 1 15.5 6.4"></path></svg>',
        check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.5 17 19 6.5"></path></svg>',
        x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12"></path><path d="M18 6 6 18"></path></svg>',
        hourglass: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h11M6.5 20.5h11"></path><path d="M7.5 3.5v3.2c0 1.9 1.7 3.5 4.5 5.3 2.8-1.8 4.5-3.4 4.5-5.3V3.5"></path><path d="M7.5 20.5v-3.2c0-1.9 1.7-3.5 4.5-5.3 2.8 1.8 4.5 3.4 4.5 5.3v3.2"></path></svg>',
        robot: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="8.5" width="15" height="11" rx="2.5"></rect><path d="M12 8.5V5"></path><circle cx="12" cy="3.7" r="1.1"></circle><circle cx="9" cy="14" r="1.3"></circle><circle cx="15" cy="14" r="1.3"></circle><path d="M2.5 12v4M21.5 12v4"></path></svg>',
        coffee: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 9.5h12v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-6Z"></path><path d="M16.5 11h1.7a2.3 2.3 0 0 1 0 4.6h-1.7"></path><path d="M8 6.5c0-1 1-1 1-2s-1-1-1-2M12 6.5c0-1 1-1 1-2s-1-1-1-2"></path></svg>',
        bus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="12" rx="2.5"></rect><path d="M3.5 11h17"></path><path d="M7 19.5v1.5M17 19.5v1.5"></path><circle cx="7.5" cy="16.5" r="0.1"></circle><circle cx="16.5" cy="16.5" r="0.1"></circle></svg>',
        share: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-6 16-3-7-7-3Z"></path></svg>',
        play: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M6 4.5v15l14-7.5Z"></path></svg>',
        stop: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="5.5" y="5.5" width="13" height="13" rx="2"></rect></svg>',
        handoverOut: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12h13M12.5 7l4.5 5-4.5 5"></path></svg>',
        handoverIn: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 12h-13M11.5 7l-4.5 5 4.5 5"></path></svg>',
        busStop: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"></path><path d="M12 4.5h6v6h-6"></path><path d="M8 21c0-2 1.8-3 4-3s4 1 4 3"></path></svg>',
        warning: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 21.5 20H2.5Z"></path><path d="M12 10v4.3"></path><path d="M12 17.2h.01"></path></svg>',
        person: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.3" r="3.6"></circle><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"></path></svg>',
        arrowDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15.5M6.5 14l5.5 5.5 5.5-5.5"></path></svg>',
        arrowUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V4.5M6.5 10l5.5-5.5L17.5 10"></path></svg>',
        swap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8h13.5M13.5 4.5 17 8l-3.5 3.5"></path><path d="M20.5 16h-13.5M10.5 12.5 7 16l3.5 3.5"></path></svg>'
    };

    document.getElementById('datum').valueAsDate = new Date();
    let cropper = null;
    let aktuellesBerechnetesErgebnis = null;

    let aktuellesDatumAnzeige = new Date();
    let gespeicherteSchichten = {};

    // Persönliches Entfernungs-Buch: Ort -> km von der Wohnung (einfache Strecke),
    // für die Fahrtkosten-Kilometerpauschale. Nur lokal auf diesem Gerät gespeichert.
    let wegstrecken = {};
    let wegstreckenFehlendCache = {};

    // ============================================================
    //  SUPABASE: Verbindung, Anmeldung, Nutzerverwaltung
    // ============================================================
    let sb = null;                 // Supabase-Client
    let aktuellerNutzer = null;    // eingeloggter auth-User
    let aktuellesProfil = null;    // Zeile aus Tabelle "profile"
    let angezeigterNutzerId = null;// wessen Daten gerade angezeigt werden (Admin kann wechseln)
    let angezeigterNutzerName = null;
    let authModus = 'login';       // 'login' oder 'registrieren'

    function zeigeMeldung(elId, text, typ) {
        const el = document.getElementById(elId);
        el.className = 'meldung ' + (typ || 'ok');
        el.innerText = text;
    }
    function versteckeMeldung(elId) {
        document.getElementById(elId).className = 'meldung';
    }

    function setzeAppSichtbarkeit(zustand) {
        // zustand: 'setup' | 'login' | 'freischalten' | 'app'
        document.getElementById('setupScreen').classList.toggle('aktiv', zustand === 'setup');
        document.getElementById('authScreen').classList.toggle('aktiv', zustand === 'login');

        const appSichtbar = (zustand === 'app');
        document.querySelector('.tabbar').style.display = appSichtbar ? 'flex' : 'none';
        document.getElementById('logoutBtn').style.display =
            (zustand === 'app' || zustand === 'freischalten') ? 'block' : 'none';
        document.getElementById('settingsBtn').style.display = appSichtbar ? 'block' : 'none';

        ['start', 'erfassen', 'verlauf', 'kalender', 'statistik', 'liste', 'admin', 'einstellungen', 'mehr', 'einrichten', 'profil', 'chat', 'kontakte', 'gruppe-neu', 'chatraum'].forEach(s => {
            document.getElementById('page-' + s).classList.remove('active');
        });
        document.getElementById('page-freischalten').classList.toggle('active', zustand === 'freischalten');

        if (appSichtbar) document.getElementById('page-start').classList.add('active');
    }

    // ---------- Einrichtung (Supabase-Zugangsdaten) ----------
    function setupSpeichern() {
        const url = document.getElementById('setupUrl').value.trim();
        const key = document.getElementById('setupKey').value.trim();
        if (!url || !key) {
            zeigeMeldung('setupMeldung', 'Bitte beide Felder ausfüllen.', 'fehler');
            return;
        }
        if (!url.startsWith('http')) {
            zeigeMeldung('setupMeldung', 'Die Project URL muss mit https:// beginnen.', 'fehler');
            return;
        }
        localStorage.setItem('dienstplan_sb_url', url);
        localStorage.setItem('dienstplan_sb_key', key);
        starteApp();
    }

    // ---------- Anmelden / Registrieren ----------
    function authModusWechseln() {
        authModus = (authModus === 'login') ? 'registrieren' : 'login';
        const istReg = authModus === 'registrieren';
        document.getElementById('authTitel').innerText = istReg ? 'Registrieren' : 'Anmelden';
        document.getElementById('authHinweis').innerText = istReg
            ? 'Erstelle ein Konto. Du brauchst dafür einen Einladungscode vom Admin.'
            : 'Melde dich mit deiner E-Mail-Adresse an.';
        document.getElementById('authButton').innerText = istReg ? 'Konto erstellen' : 'Anmelden';
        document.getElementById('authWechsel').innerText = istReg
            ? 'Ich habe schon ein Konto – anmelden'
            : 'Noch kein Konto? Mit Einladungscode registrieren';
        document.getElementById('codeFeldGruppe').style.display = istReg ? 'block' : 'none';
        versteckeMeldung('authMeldung');
    }

    async function authAbsenden() {
        const email = document.getElementById('authEmail').value.trim();
        const passwort = document.getElementById('authPasswort').value;
        const btn = document.getElementById('authButton');

        if (!email || !passwort) {
            zeigeMeldung('authMeldung', 'Bitte E-Mail und Passwort eingeben.', 'fehler');
            return;
        }

        btn.disabled = true;
        btn.innerText = 'Bitte warten...';

        try {
            if (authModus === 'registrieren') {
                const code = document.getElementById('authCode').value.trim();
                if (!code) {
                    zeigeMeldung('authMeldung', 'Bitte den Einladungscode eingeben.', 'fehler');
                    return;
                }
                const { data, error } = await sb.auth.signUp({ email, password: passwort });
                if (error) throw error;

                if (!data.session) {
                    zeigeMeldung('authMeldung',
                        'Konto erstellt. Bitte bestätige zuerst die E-Mail, die dir Supabase geschickt hat, und melde dich dann an.', 'ok');
                    return;
                }
                // direkt eingeloggt -> Code sofort einlösen
                const { data: ergebnis, error: fehler } = await sb.rpc('einladung_einloesen', { code_eingabe: code });
                if (fehler) throw fehler;
                if (ergebnis !== 'OK') {
                    zeigeMeldung('authMeldung', ergebnis + ' Du kannst den Code nach dem Anmelden erneut eingeben.', 'fehler');
                }
                await nutzerLaden();
            } else {
                const { error } = await sb.auth.signInWithPassword({ email, password: passwort });
                if (error) throw error;
                await nutzerLaden();
            }
        } catch (e) {
            zeigeMeldung('authMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        } finally {
            btn.disabled = false;
            btn.innerText = authModus === 'registrieren' ? 'Konto erstellen' : 'Anmelden';
        }
    }

    async function abmelden() {
        if (!confirm('Wirklich abmelden?')) return;
        await sb.auth.signOut();
        aktuellerNutzer = null;
        aktuellesProfil = null;
        gespeicherteSchichten = {};
        document.getElementById('topbarUser').innerText = '';
        setzeAppSichtbarkeit('login');
    }

    async function codeEinloesen() {
        const code = document.getElementById('freischaltCode').value.trim();
        if (!code) {
            zeigeMeldung('freischaltMeldung', 'Bitte einen Code eingeben.', 'fehler');
            return;
        }
        try {
            const { data, error } = await sb.rpc('einladung_einloesen', { code_eingabe: code });
            if (error) throw error;
            if (data === 'OK') {
                zeigeMeldung('freischaltMeldung', 'Freigeschaltet! Einen Moment...', 'ok');
                setTimeout(nutzerLaden, 800);
            } else {
                zeigeMeldung('freischaltMeldung', data, 'fehler');
            }
        } catch (e) {
            zeigeMeldung('freischaltMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    // ---------- Nutzer + Profil laden, App-Zustand bestimmen ----------
    async function nutzerLaden() {
        const { data: { session } } = await sb.auth.getSession();
        if (!session) {
            setzeAppSichtbarkeit('login');
            return;
        }
        aktuellerNutzer = session.user;

        const { data: profil, error } = await sb
            .from('profile').select('*').eq('id', aktuellerNutzer.id).single();

        if (error || !profil) {
            zeigeMeldung('authMeldung', 'Profil konnte nicht geladen werden. Wurde das SQL-Skript in Supabase ausgeführt?', 'fehler');
            setzeAppSichtbarkeit('login');
            return;
        }
        aktuellesProfil = profil;
        wegstreckenEinstellungenAusProfilUebernehmen(profil);

        const istAdmin = profil.rolle === 'admin';
        document.getElementById('topbarUser').innerHTML =
            (profil.anzeigename || profil.email) + (istAdmin ? '<span class="badge admin">Admin</span>' : '');
        const verwaltungGruppe = document.getElementById('mehrVerwaltungGruppe');
        if (verwaltungGruppe) verwaltungGruppe.style.display = istAdmin ? 'block' : 'none';

        if (!profil.aktiv) {
            setzeAppSichtbarkeit('freischalten');
            return;
        }

        angezeigterNutzerId = aktuellerNutzer.id;
        angezeigterNutzerName = null;
        setzeAppSichtbarkeit('app');
        await schichtenLaden();
        if (istAdmin) adminDatenLaden();

        await haltestellenLaden();
        chatListeLaden();
        kontakteLaden();

        tarifListenFuellen('einrEG', 'einrStufe');
        tarifListenFuellen('setEG', 'setStufe');

        // Pflicht: erst Profil, dann Verdienst, dann App
        if (!profil.profil_fertig) {
            document.getElementById('profVorname').value = profil.vorname || '';
            document.getElementById('profNachname').value = profil.nachname || '';
            document.getElementById('profBetriebshof').value = profil.betriebshof || '';
            wechselSeite('profil');
        } else if (!ein.eingerichtetAm) {
            wechselSeite('einrichten');
        } else {
            tarifErinnerungPruefen();
        }
    }

    // ---------- Schichten aus der Datenbank laden ----------
    async function schichtenLaden() {
        if (!sb || !angezeigterNutzerId) return;
        try {
            const { data, error } = await sb
                .from('schichten').select('datum, daten').eq('user_id', angezeigterNutzerId);
            if (error) throw error;

            gespeicherteSchichten = {};
            (data || []).forEach(zeile => { gespeicherteSchichten[zeile.datum] = zeile.daten; });
            renderCalendar();
        } catch (e) {
            console.error('Laden fehlgeschlagen:', e);
            alert('Schichten konnten nicht geladen werden: ' + (e.message || e));
        }
    }

    // ============================================================
    //  ADMIN-BEREICH
    // ============================================================
    function zufallsCode() {
        const zeichen = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ohne I/O/0/1 (Verwechslungsgefahr)
        let teil = () => Array.from({length: 4}, () => zeichen[Math.floor(Math.random() * zeichen.length)]).join('');
        return teil() + '-' + teil();
    }

    function einladungsText(code) {
        return `Hier ist dein Zugang zur Dienstplan-App:\n` +
               `${APP_ADRESSE}\n\n` +
               `Einladungscode: ${code}\n\n` +
               `So geht's:\n` +
               `1. Link öffnen\n` +
               `2. Auf "Noch kein Konto? Mit Einladungscode registrieren" tippen\n` +
               `3. E-Mail, Passwort und den Code eintragen\n\n` +
               `Tipp: Danach im Browser-Menü "Zum Startbildschirm hinzufügen" wählen, ` +
               `dann hast du die App wie eine normale App auf dem Handy.`;
    }

    async function einladungTeilen(code) {
        const text = einladungsText(code);
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Dienstplan-App', text: text });
                return;
            }
            await navigator.clipboard.writeText(text);
            zeigeMeldung('adminMeldung', 'Einladung in die Zwischenablage kopiert – jetzt einfügen und verschicken.', 'ok');
        } catch (e) {
            if (e && e.name === 'AbortError') return;   // Teilen abgebrochen
            // Rückfall: Text zum Markieren anzeigen
            const feld = document.getElementById('einladungText');
            feld.style.display = 'block';
            feld.value = text;
            feld.select();
            zeigeMeldung('adminMeldung', 'Text markiert – zum Kopieren lange drauftippen.', 'ok');
        }
    }

    async function codeErzeugen() {
        try {
            const code = zufallsCode();
            const { error } = await sb.from('einladungen').insert({ code, erstellt_von: aktuellerNutzer.id });
            if (error) throw error;
            zeigeMeldung('adminMeldung', 'Code erstellt: ' + code, 'ok');
            adminDatenLaden();
            einladungTeilen(code);
        } catch (e) {
            zeigeMeldung('adminMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    async function codeLoeschen(code) {
        if (!confirm('Code ' + code + ' löschen?')) return;
        const { error } = await sb.from('einladungen').delete().eq('code', code);
        if (error) { zeigeMeldung('adminMeldung', 'Fehler: ' + error.message, 'fehler'); return; }
        adminDatenLaden();
    }

    async function adminDatenLaden() {
        // Einladungscodes
        try {
            const { data: codes } = await sb.from('einladungen').select('*').order('erstellt_am', { ascending: false });
            const listeEl = document.getElementById('codeListe');
            if (!codes || codes.length === 0) {
                listeEl.innerHTML = '<p class="auth-hinweis">Noch keine Codes erstellt.</p>';
            } else {
                listeEl.innerHTML = codes.map(c => `
                    <div class="user-zeile">
                        <div style="flex:1;">
                            <div class="code-box ${c.verwendet_von ? 'verwendet' : ''}">${c.code}</div>
                            <div class="auth-hinweis" style="margin:4px 0 0 0;">
                                ${c.verwendet_von ? '✓ bereits verwendet' : 'noch frei'}
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            ${c.verwendet_von ? '' :
                              `<button class="btn-gcal stapel-btn" onclick="einladungTeilen('${c.code}')">${ICONS.share} Teilen</button>`}
                            <button class="btn-danger stapel-btn" onclick="codeLoeschen('${c.code}')">${ICONS.trash}</button>
                        </div>
                    </div>`).join('');
            }
        } catch (e) { console.error(e); }

        // Nutzerliste
        try {
            const { data: nutzer } = await sb.from('profile').select('*').order('erstellt_am', { ascending: true });
            const el = document.getElementById('nutzerListe');
            if (!nutzer || !nutzer.length) { el.innerHTML = '<p class="auth-hinweis">Keine Nutzer.</p>'; return; }

            el.innerHTML = nutzer.map(n => {
                const istIch = n.id === aktuellerNutzer.id;
                const name = (n.anzeigename || n.email || '').replace(/'/g, "\\'");
                const entfernt = !!n.loeschen_am;

                let restTage = null;
                if (entfernt) {
                    restTage = Math.max(0, Math.ceil((new Date(n.loeschen_am) - Date.now()) / 86400000));
                }

                const abzeichen =
                    (n.rolle === 'admin' ? '<span class="badge admin">Admin</span>' : '') +
                    (entfernt ? `<span class="badge entfernt">wird in ${restTage} Tagen gelöscht</span>`
                              : (!n.aktiv ? '<span class="badge">nicht aktiv</span>' : '')) +
                    (istIch ? '<span class="badge">du</span>' : '') +
                    ((n.hilfe_bis && new Date(n.hilfe_bis) > new Date())
                      ? '<span class="badge frei">Hilfe freigegeben</span>' : '');

                const zweiteZeile = n.betriebshof
                    ? `<br><small style="opacity:.75;">${n.betriebshof}</small>` : '';

                let knoepfe = '';
                if (!istIch) {
                    if (entfernt) {
                        knoepfe = `
                            <button class="btn-save stapel-btn" onclick="nutzerWiederherstellen('${n.id}','${name}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px; margin-right:4px;"><path d="M15 5.5 8.5 12 15 18.5"></path></svg>Zurück</button>
                            <button class="btn-danger stapel-btn" onclick="nutzerSofortLoeschen('${n.id}','${name}')">${ICONS.trash} Sofort</button>`;
                    } else {
                        const freigabe = n.hilfe_bis && new Date(n.hilfe_bis) > new Date();
                        knoepfe = `
                            ${freigabe
                              ? `<button class="btn-save stapel-btn" onclick="fremdeDatenAnzeigen('${n.id}','${name}')">${ICONS.unlock} Daten</button>`
                              : `<button class="btn-secondary stapel-btn" onclick="hilfeAnfragen('${n.id}','${name}')">Hilfe anfragen</button>`}
                            <button class="btn-danger stapel-btn" onclick="nutzerEntfernen('${n.id}','${name}')">Entfernen</button>`;
                    }
                }

                return `
                <div class="user-zeile">
                    <div>${n.anzeigename || n.email}${abzeichen}${zweiteZeile}</div>
                    <div style="display:flex; flex-direction:column; gap:6px;">${knoepfe}</div>
                </div>`;
            }).join('');
        } catch (e) { console.error(e); }
    }

    // ---------- Nutzer entfernen / wiederherstellen ----------
    async function nutzerEntfernen(id, name) {
        if (!confirm(`${name} entfernen?\n\nDer Zugang wird sofort gesperrt. Die Daten bleiben noch 14 Tage erhalten – so lange kannst du die Person wieder aufnehmen.`)) return;
        try {
            const { data, error } = await sb.rpc('nutzer_entfernen', { ziel_id: id });
            if (error) throw error;
            if (data !== 'OK') { zeigeMeldung('adminMeldung', data, 'fehler'); return; }
            zeigeMeldung('adminMeldung', `${name} wurde gesperrt. Endgültige Löschung in 14 Tagen.`, 'ok');
            adminDatenLaden();
        } catch (e) {
            zeigeMeldung('adminMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    async function nutzerWiederherstellen(id, name) {
        try {
            const { data, error } = await sb.rpc('nutzer_wiederherstellen', { ziel_id: id });
            if (error) throw error;
            if (data !== 'OK') { zeigeMeldung('adminMeldung', data, 'fehler'); return; }
            zeigeMeldung('adminMeldung', `${name} ist wieder freigeschaltet – alle Daten sind erhalten.`, 'ok');
            adminDatenLaden();
        } catch (e) {
            zeigeMeldung('adminMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    async function nutzerSofortLoeschen(id, name) {
        if (!confirm(`${name} ENDGÜLTIG löschen?\n\nKonto und alle Schichten werden unwiderruflich entfernt. Das kann nicht rückgängig gemacht werden.`)) return;
        try {
            const { data, error } = await sb.rpc('nutzer_endgueltig_loeschen', { ziel_id: id });
            if (error) throw error;
            if (data !== 'OK') { zeigeMeldung('adminMeldung', data, 'fehler'); return; }
            zeigeMeldung('adminMeldung', `${name} wurde endgültig gelöscht.`, 'ok');
            adminDatenLaden();
        } catch (e) {
            zeigeMeldung('adminMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    // ---------- KI-Nutzung / Kostenübersicht ----------
    let scanDatum = new Date();
    const KOSTEN_JE_SCAN = 0.012;   // grobe Schätzung in Euro
    const APP_ADRESSE = 'https://topbas79.github.io/dienstplan';

    function scansMonatWechseln(delta) {
        scanDatum.setMonth(scanDatum.getMonth() + delta);
        scansLaden();
    }

    async function scansLaden() {
        const el = document.getElementById('scanListe');
        if (!el || !sb) return;

        const jahr = scanDatum.getFullYear(), monat = scanDatum.getMonth();
        document.getElementById('scanTitel').innerText = `${MONATSNAMEN[monat]} ${jahr}`;

        const von = new Date(jahr, monat, 1).toISOString();
        const bis = new Date(jahr, monat + 1, 1).toISOString();

        try {
            const { data, error } = await sb.from('scans')
                .select('user_id, erfolg').gte('erstellt_am', von).lt('erstellt_am', bis);
            if (error) throw error;

            if (!data || !data.length) {
                el.innerHTML = '<p class="auth-hinweis">In diesem Monat wurden keine Scans gemacht.</p>';
                return;
            }

            const { data: profile } = await sb.from('profile').select('id, anzeigename, email');
            const namen = {};
            (profile || []).forEach(p => { namen[p.id] = p.anzeigename || p.email || 'Unbekannt'; });

            const proNutzer = {};
            data.forEach(z => {
                if (!proNutzer[z.user_id]) proNutzer[z.user_id] = { gesamt: 0, fehler: 0 };
                proNutzer[z.user_id].gesamt++;
                if (!z.erfolg) proNutzer[z.user_id].fehler++;
            });

            const zeilen = Object.entries(proNutzer)
                .sort((a, b) => b[1].gesamt - a[1].gesamt)
                .map(([id, z]) => `
                    <div class="result-item">
                        <span class="label">${namen[id] || 'Unbekannt'}</span>
                        <span style="text-align:right;">${z.gesamt} Scans` +
                        (z.fehler ? `<br><small style="opacity:.8;">${z.fehler} fehlgeschlagen</small>` : '') +
                        `</span>
                    </div>`).join('');

            el.innerHTML = zeilen + `
                <div class="total-box">
                    <span>${data.length} Scans gesamt</span>
                    <span>ca. ${euroText(data.length * KOSTEN_JE_SCAN)}</span>
                </div>`;
        } catch (e) {
            el.innerHTML = '<p class="auth-hinweis">Nutzungsdaten konnten nicht geladen werden.</p>';
            console.error(e);
        }
    }

    async function fremdeDatenAnzeigen(nutzerId, name) {
        angezeigterNutzerId = nutzerId;
        angezeigterNutzerName = name;
        document.getElementById('fremdAnsichtBox').style.display = 'block';
        document.getElementById('fremdAnsichtTitel').innerText = 'Schichten von ' + name;
        await schichtenLaden();
        wechselSeite('kalender');
    }

    async function zurueckZuEigenenDaten() {
        angezeigterNutzerId = aktuellerNutzer.id;
        angezeigterNutzerName = null;
        document.getElementById('fremdAnsichtBox').style.display = 'none';
        await schichtenLaden();
    }

    function nurEigeneDatenPruefen() {
        if (angezeigterNutzerId !== aktuellerNutzer?.id) {
            alert('Du siehst gerade die Daten von ' + angezeigterNutzerName + '. Wechsle im Admin-Bereich zurück zu deinen eigenen Daten, um etwas zu ändern.');
            return false;
        }
        return true;
    }

    // ============================================================
    //  FEIERTAGE (automatisch je Bundesland berechnet, ohne Internet)
    // ============================================================

    // Gaußsche Osterformel -> Ostersonntag
    function ostersonntag(jahr) {
        const a = jahr % 19, b = Math.floor(jahr / 100), c = jahr % 100;
        const d = Math.floor(b / 4), e = b % 4;
        const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4), k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const monat = Math.floor((h + l - 7 * m + 114) / 31);
        const tag = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(jahr, monat - 1, tag);
    }

    function tageVersetzen(datum, tage) {
        const d = new Date(datum.getTime());
        d.setDate(d.getDate() + tage);
        return d;
    }

    function alsDatumsText(d) {
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    // Buß- und Bettag: Mittwoch vor dem 23. November
    function bussUndBettag(jahr) {
        const d = new Date(jahr, 10, 23);
        do { d.setDate(d.getDate() - 1); } while (d.getDay() !== 3);
        return d;
    }

    const feiertagsCache = {};

    function feiertageFuer(jahr, land) {
        const schluessel = jahr + '_' + land;
        if (feiertagsCache[schluessel]) return feiertagsCache[schluessel];

        const o = ostersonntag(jahr);
        const liste = {};
        const add = (datum, name, art) => {
            liste[alsDatumsText(datum)] = { name, art: art || 'feiertag' };
        };

        // Bundesweit
        add(new Date(jahr, 0, 1), 'Neujahr');
        add(tageVersetzen(o, -2), 'Karfreitag');
        add(tageVersetzen(o, 1), 'Ostermontag');
        add(new Date(jahr, 4, 1), 'Tag der Arbeit');
        add(tageVersetzen(o, 39), 'Christi Himmelfahrt');
        add(tageVersetzen(o, 50), 'Pfingstmontag');
        add(new Date(jahr, 9, 3), 'Tag der Deutschen Einheit');
        add(new Date(jahr, 11, 25), '1. Weihnachtstag');
        add(new Date(jahr, 11, 26), '2. Weihnachtstag');

        if (['BW', 'BY', 'ST'].includes(land)) add(new Date(jahr, 0, 6), 'Heilige Drei Könige');
        if (['BE', 'MV'].includes(land)) add(new Date(jahr, 2, 8), 'Internationaler Frauentag');
        if (['BW', 'BY', 'HE', 'NW', 'RP', 'SL'].includes(land)) add(tageVersetzen(o, 60), 'Fronleichnam');
        if (land === 'SL') add(new Date(jahr, 7, 15), 'Mariä Himmelfahrt');
        if (land === 'TH') add(new Date(jahr, 8, 20), 'Weltkindertag');
        if (['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'].includes(land)) add(new Date(jahr, 9, 31), 'Reformationstag');
        if (['BW', 'BY', 'NW', 'RP', 'SL'].includes(land)) add(new Date(jahr, 10, 1), 'Allerheiligen');
        if (land === 'SN') add(bussUndBettag(jahr), 'Buß- und Bettag');

        // Sondertage (+40%)
        add(tageVersetzen(o, -1), 'Karsamstag', 'sonderstichtag');
        add(tageVersetzen(o, 48), 'Pfingstsamstag', 'sonderstichtag');
        add(new Date(jahr, 11, 24), 'Heiligabend', 'sonderstichtag');
        add(new Date(jahr, 11, 31), 'Silvester', 'sonderstichtag');

        feiertagsCache[schluessel] = liste;
        return liste;
    }

    // Kurzform des Feiertagsnamens für die kleine Kalenderkachel
    function feiertagKurz(name) {
        const kurz = {
            'Neujahr': 'Neujahr',
            'Karfreitag': 'Karfr.',
            'Karsamstag': 'Karsa.',
            'Ostermontag': 'Ostermo.',
            'Tag der Arbeit': '1. Mai',
            'Internationaler Frauentag': 'Frauentag',
            'Christi Himmelfahrt': 'Himmelf.',
            'Pfingstsamstag': 'Pfingstsa.',
            'Pfingstmontag': 'Pfingstmo.',
            'Tag der Deutschen Einheit': 'Einheit',
            'Heiligabend': 'Heiligab.',
            '1. Weihnachtstag': '1. Weihn.',
            '2. Weihnachtstag': '2. Weihn.',
            'Silvester': 'Silvester'
        };
        return kurz[name] || name;
    }

    function feiertagAm(datumStr) {
        if (!datumStr) return null;
        const jahr = Number(datumStr.slice(0, 4));
        const land = document.getElementById('bundesland').value;
        return feiertageFuer(jahr, land)[datumStr] || null;
    }

    function bundeslandGespeichert() {
        localStorage.setItem('dienstplan_bundesland', document.getElementById('bundesland').value);
    }

    // Setzt die Feiertagsauswahl passend zum gewählten Datum
    function feiertagPruefen() {
        const datumStr = document.getElementById('datum').value;
        const hinweisEl = document.getElementById('feiertagHinweis');
        const auswahlEl = document.getElementById('feiertagsArt');
        const treffer = feiertagAm(datumStr);

        if (treffer) {
            auswahlEl.value = treffer.art;
            const zuschlag = treffer.art === 'feiertag' ? '+135%' : '+40%';
            hinweisEl.innerHTML = `<span style="display:flex; align-items:flex-start; gap:6px;">${ICONS.star} <span><b>${treffer.name}</b> – automatisch als ${zuschlag} gesetzt. Du kannst es oben überschreiben.</span></span>`;
        } else {
            // nur zurücksetzen, wenn vorher automatisch gesetzt war
            if (auswahlEl.dataset.autoGesetzt === 'ja') auswahlEl.value = 'normal';
            hinweisEl.innerText = '';
        }
        auswahlEl.dataset.autoGesetzt = treffer ? 'ja' : 'nein';
    }

    // Bundesland aus dem Speicher laden und auf Datumsänderungen reagieren
    (function feiertageInitialisieren() {
        document.getElementById('datum').addEventListener('change', feiertagPruefen);
        feiertagPruefen();
    })();


    // ============================================================
    //  DIENSTLISTE (aus der Jahresübersicht) + PDF-Export
    // ============================================================
    let listeDatum = new Date();

    const MONATSNAMEN = ["Januar","Februar","März","April","Mai","Juni",
                         "Juli","August","September","Oktober","November","Dezember"];

    function listeOeffnen(jahr) {
        if (jahr) listeDatum = new Date(jahr, aktuellesDatumAnzeige.getMonth(), 1);
        wechselSeite('liste');
        listeRendern();
    }

    function listeMonatWechseln(delta) {
        listeDatum.setMonth(listeDatum.getMonth() + delta);
        listeRendern();
    }

    // Volle Dauer eines Dienstes von Anfang bis Ende in Minuten (inkl. Pausen,
    // NICHT die bezahlte Arbeitszeit — nur für die Anzeige in der Dienstliste)
    function schichtDauerMinuten(datumStr, startStr, endeStr) {
        if (!datumStr || !startStr || !endeStr) return 0;
        const [jahr, monat, tag] = datumStr.split('-').map(Number);
        const [hStart, mStart] = startStr.split(':').map(Number);
        const [hEnde, mEnde] = endeStr.split(':').map(Number);
        const start = new Date(jahr, monat - 1, tag, hStart, mStart);
        const ende = new Date(jahr, monat - 1, tag, hEnde, mEnde);
        if (ende <= start) ende.setDate(ende.getDate() + 1);
        return (ende - start) / 60000;
    }

    // Minuten als "8h 25m"
    function stundenMinutenKurz(minuten) {
        const m = Math.max(0, Math.round(minuten));
        return `${Math.floor(m / 60)}h ${m % 60}m`;
    }

    // Anzeigename fuer einen Ort: Klartext-Name, sonst Kuerzel als Rueckfall
    // (Variante-B-Dienstzettel liefern nur ein Kuerzel, siehe dienstplan-lesen).
    // Zentral definiert, damit Dienstliste und Wegstrecken-Buch denselben
    // Ort immer gleich benennen - sonst findet das Wegstrecken-Buch einen
    // per Kuerzel angezeigten Ort nicht wieder.
    function ortAnzeige(name, kuerzel) {
        const n = (name || '').trim(), kz = (kuerzel || '').trim();
        if (!n && !kz) return '';
        if (!n) return kz;
        return n;
    }

    // Sammelt die Schichten eines Monats als Zeilen: Datum, Beginn, Ende
    function listeZeilen() {
        const pad = (n) => n < 10 ? '0' + n : n;
        const praefix = `${listeDatum.getFullYear()}-${pad(listeDatum.getMonth() + 1)}`;

        return Object.keys(gespeicherteSchichten)
            .filter(k => k.startsWith(praefix))
            .sort()
            .map(k => {
                const s = gespeicherteSchichten[k];
                const d = s.details || {};
                const linie = (l, u) => {
                    const teile = [];
                    if (l) teile.push(String(l));
                    if (u) teile.push('Umlauf ' + u);
                    return teile.join(' / ');
                };
                return {
                    datum: k,
                    datumKurz: k.split('-').reverse().join('.'),
                    dienst: s.dienstnummer || '',
                    beginnZeit: s.startStr || '',
                    beginnOrt: ortAnzeige(d.beginn_ort, d.beginn_ort_kuerzel),
                    beginnLinie: linie(d.beginn_linie, d.beginn_umlauf),
                    endeZeit: (s.endeStr || '') + (d.ende_folgetag ? '+' : ''),
                    endeOrt: ortAnzeige(d.ende_ort, d.ende_ort_kuerzel),
                    endeLinie: linie(d.ende_linie, d.ende_umlauf),
                    dauerMinuten: schichtDauerMinuten(k, s.startStr, s.endeIst || s.endeStr),
                    verdienst: s.zuschlagSumme || 0
                };
            })
            .map(z => {
                const fahrzeitBeginn = wegFahrzeitFuerOrt(z.beginnOrt);
                const fahrzeitEnde = wegFahrzeitFuerOrt(z.endeOrt);
                const anfahrt = fahrzeitBeginn ?? ein.fahrzeitMin;
                const rueckfahrt = fahrzeitEnde ?? ein.fahrzeitMin;
                return {
                    ...z,
                    abwesenheitMinuten: anfahrt + z.dauerMinuten + rueckfahrt,
                    fahrzeitAbweichend: fahrzeitBeginn != null || fahrzeitEnde != null
                };
            });
    }

    function listeRendern() {
        document.getElementById('listeTitel').innerText =
            `${MONATSNAMEN[listeDatum.getMonth()]} ${listeDatum.getFullYear()}`;

        const zeilen = listeZeilen();
        const el = document.getElementById('listeInhalt');

        if (!zeilen.length) {
            el.innerHTML = '<p class="auth-hinweis">Für diesen Monat sind keine Dienste gespeichert.</p>';
            return;
        }

        const summeMinuten = zeilen.reduce((a, z) => a + z.dauerMinuten, 0);
        const summeEuro = zeilen.reduce((a, z) => a + z.verdienst, 0);

        el.innerHTML = zeilen.map(z => `
            <div class="dienst-karte">
                <div class="dienst-kopf">
                    <b>${z.datumKurz}</b>${z.dienst ? ' · Dienst ' + z.dienst : ''}
                    <span style="float:right; opacity:.8;">${stundenMinutenKurz(z.dauerMinuten)}</span>
                </div>
                <div class="dienst-zeile">
                    <span class="dienst-marke gruen">Beginn</span>
                    <span>${z.beginnZeit} · ${z.beginnOrt || '–'}${z.beginnLinie ? '<br><small>' + z.beginnLinie + '</small>' : ''}</span>
                </div>
                <div class="dienst-zeile">
                    <span class="dienst-marke rot">Ende</span>
                    <span>${z.endeZeit} · ${z.endeOrt || '–'}${z.endeLinie ? '<br><small>' + z.endeLinie + '</small>' : ''}</span>
                </div>
            </div>`).join('') +
            `<div class="total-box" style="margin-top:14px;">
                <span>${zeilen.length} Dienste</span>
                <span>${stundenMinutenKurz(summeMinuten)} → ${summeEuro.toFixed(2).replace('.', ',')} €</span>
             </div>`;
    }

    function listeAlsPdf() {
        const zeilen = listeZeilen();
        if (!zeilen.length) {
            alert('Für diesen Monat sind keine Dienste gespeichert.');
            return;
        }
        if (!window.jspdf) {
            alert('PDF-Bibliothek konnte nicht geladen werden. Bitte mit Internetverbindung erneut versuchen.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        const monat = `${MONATSNAMEN[listeDatum.getMonth()]} ${listeDatum.getFullYear()}`;
        const name = (aktuellesProfil && (aktuellesProfil.anzeigename || aktuellesProfil.email)) || '';

        doc.setFontSize(15);
        doc.text(`Dienstübersicht ${monat}`, 14, 16);
        if (name) {
            doc.setFontSize(10);
            doc.setTextColor(110);
            doc.text(name, 14, 22);
            doc.setTextColor(0);
        }

        const kopf = [['Datum', 'Dienst', 'Beginn', 'Ort', 'Linie', 'Ende', 'Ort', 'Linie', 'Dauer']];
        const koerper = zeilen.map(z => [
            z.datumKurz, z.dienst,
            z.beginnZeit, z.beginnOrt, z.beginnLinie,
            z.endeZeit, z.endeOrt, z.endeLinie,
            stundenMinutenKurz(z.dauerMinuten)
        ]);

        const summeMinuten = zeilen.reduce((a, z) => a + z.dauerMinuten, 0);

        doc.autoTable({
            head: kopf,
            body: koerper,
            startY: name ? 27 : 22,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
            alternateRowStyles: { fillColor: [246, 248, 252] },
            columnStyles: {
                0: { cellWidth: 20 }, 1: { cellWidth: 16 },
                2: { cellWidth: 16 }, 3: { cellWidth: 48 }, 4: { cellWidth: 26 },
                5: { cellWidth: 16 }, 6: { cellWidth: 48 }, 7: { cellWidth: 26 },
                8: { cellWidth: 15, halign: 'right' }
            },
            didDrawPage: (daten) => {
                const y = daten.cursor.y + 8;
                doc.setFontSize(10);
                doc.text(
                    `${zeilen.length} Dienste · ${stundenMinutenKurz(summeMinuten)}`,
                    14, y
                );
            }
        });

        const pad = (n) => n < 10 ? '0' + n : n;
        dateiSpeichernOderTeilen(`Dienstuebersicht_${listeDatum.getFullYear()}-${pad(listeDatum.getMonth() + 1)}.pdf`, doc.output('blob'));
    }

    // ============================================================
    //  WEGSTRECKEN (Entfernung Wohnung -> Ort, für Fahrtkosten)
    // ============================================================
    function wegstreckenLaden() {
        try {
            const roh = localStorage.getItem('dienstplan_wegstrecken');
            wegstrecken = roh ? JSON.parse(roh) : {};
        } catch (e) { wegstrecken = {}; }
    }

    function wegstreckenSpeichernLocal() {
        localStorage.setItem('dienstplan_wegstrecken', JSON.stringify(wegstrecken));
        profilFeldSpeichern('wegstrecken', wegstrecken);
    }

    // Sichert ein Feld (wegstrecken/einstellungen) zusaetzlich in der Cloud (profile-Tabelle),
    // damit es ein lokales "Website-Daten löschen" im Browser übersteht.
    async function profilFeldSpeichern(feld, wert) {
        if (!aktuellerNutzer) return;
        try {
            await sb.from('profile').update({ [feld]: wert }).eq('id', aktuellerNutzer.id);
        } catch (e) { console.log('Cloud-Sync fehlgeschlagen (' + feld + '):', e); }
    }

    // Beim Login: Cloud-Stand von Wegstrecken/Einstellungen übernehmen (falls vorhanden),
    // sonst - falls hier bereits lokale Daten liegen - einmalig in die Cloud hochladen.
    function wegstreckenEinstellungenAusProfilUebernehmen(profil) {
        if (profil.wegstrecken && typeof profil.wegstrecken === 'object' && Object.keys(profil.wegstrecken).length) {
            localStorage.setItem('dienstplan_wegstrecken', JSON.stringify(profil.wegstrecken));
            wegstreckenLaden();
        } else if (Object.keys(wegstrecken || {}).length) {
            profilFeldSpeichern('wegstrecken', wegstrecken);
        }

        if (profil.einstellungen && typeof profil.einstellungen === 'object' && Object.keys(profil.einstellungen).length) {
            localStorage.setItem('dienstplan_einstellungen', JSON.stringify(profil.einstellungen));
            einstellungenLaden();
        } else if (ein && ein.eingerichtetAm) {
            profilFeldSpeichern('einstellungen', ein);
        }
    }

    function normOrt(name) {
        return (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }

    // Liefert die gespeicherte Entfernung (km, einfache Strecke) zu einem Ort, oder null
    function wegKmFuerOrt(name) {
        const key = normOrt(name);
        if (!key) return null;
        const eintrag = wegstrecken[key];
        return eintrag ? eintrag.km : null;
    }

    // Liefert die für einen Ort hinterlegte Fahrzeit (Minuten, je Richtung), oder null
    // wenn dafür nichts eingetragen ist - dann gilt die Voreinstellung aus den Einstellungen.
    function wegFahrzeitFuerOrt(name) {
        const key = normOrt(name);
        if (!key) return null;
        const eintrag = wegstrecken[key];
        return (eintrag && eintrag.fahrzeitMin != null) ? eintrag.fahrzeitMin : null;
    }

    function wegstreckenOeffnen() {
        wechselSeite('wegstrecken');
    }

    function wegstreckeSpeichern() {
        const ortRoh = document.getElementById('wsOrt').value.trim();
        const km = parseFloat(document.getElementById('wsKm').value);
        const fahrzeitRoh = document.getElementById('wsFahrzeit').value;
        const fahrzeitMin = fahrzeitRoh === '' ? null : Math.max(0, parseFloat(fahrzeitRoh) || 0);
        if (!ortRoh || !(km >= 0)) {
            zeigeMeldung('wsMeldung', 'Bitte Ort und Entfernung (km) eingeben.', 'fehler');
            return;
        }
        wegstrecken[normOrt(ortRoh)] = { name: ortRoh, km, fahrzeitMin };
        wegstreckenSpeichernLocal();
        document.getElementById('wsOrt').value = '';
        document.getElementById('wsKm').value = '';
        document.getElementById('wsFahrzeit').value = '';
        zeigeMeldung('wsMeldung', ortRoh + ' gespeichert.', 'ok');
        wegstreckenRendern();
    }

    function wegstreckeBearbeiten(key) {
        const e = wegstrecken[key];
        if (!e) return;
        document.getElementById('wsOrt').value = e.name;
        document.getElementById('wsKm').value = e.km;
        document.getElementById('wsFahrzeit').value = e.fahrzeitMin != null ? e.fahrzeitMin : '';
        document.getElementById('wsOrt').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function wegstreckeLoeschen(key) {
        const e = wegstrecken[key];
        if (!e || !confirm(`Eintrag "${e.name}" löschen?`)) return;
        delete wegstrecken[key];
        wegstreckenSpeichernLocal();
        wegstreckenRendern();
    }

    function wegstreckenVorausfuellen(key) {
        const name = wegstreckenFehlendCache[key];
        if (!name) return;
        document.getElementById('wsOrt').value = name;
        document.getElementById('wsKm').value = '';
        document.getElementById('wsFahrzeit').value = '';
        document.getElementById('wsOrt').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('wsKm').focus();
    }

    // Alle je als Beginn-/Endort gespeicherten Orte, für die noch keine km hinterlegt sind
    function wegstreckenFehlendeOrte() {
        const gefunden = {};
        Object.values(gespeicherteSchichten).forEach(s => {
            const d = (s && s.details) || {};
            [
                ortAnzeige(d.beginn_ort, d.beginn_ort_kuerzel),
                ortAnzeige(d.ende_ort, d.ende_ort_kuerzel)
            ].forEach(name => {
                const n = (name || '').trim();
                if (!n) return;
                const key = normOrt(n);
                if (!wegstrecken[key]) gefunden[key] = n;
            });
        });
        return gefunden;
    }

    function wegstreckenRendern() {
        const el = document.getElementById('wsListe');
        if (!el) return;

        const fehlend = wegstreckenFehlendeOrte();
        wegstreckenFehlendCache = fehlend;
        const fehlKeys = Object.keys(fehlend).sort((a, b) => fehlend[a].localeCompare(fehlend[b]));
        const bekanntKeys = Object.keys(wegstrecken).sort((a, b) => wegstrecken[a].name.localeCompare(wegstrecken[b].name));

        let html = '';
        if (fehlKeys.length) {
            html += `<p class="auth-hinweis" style="color:#b45309; font-weight:600; display:flex; align-items:center; gap:6px;">${ICONS.warning} ${fehlKeys.length} Ort(e) ohne Entfernung:</p>` +
                fehlKeys.map(k => `
                <div class="result-item">
                    <span class="label">${sicher(fehlend[k])}</span>
                    <button class="btn-secondary" style="width:auto; margin:0; padding:6px 12px;" onclick="wegstreckenVorausfuellen('${k}')">+ km eintragen</button>
                </div>`).join('');
        }

        if (!bekanntKeys.length) {
            html += '<p class="auth-hinweis">Noch keine Entfernungen gespeichert.</p>';
        } else {
            html += `<p class="auth-hinweis" style="margin-top:${fehlKeys.length ? '16px' : '0'};">${bekanntKeys.length} gespeicherte Orte</p>` +
                bekanntKeys.map(k => `
                <div class="result-item">
                    <span class="label"><b>${sicher(wegstrecken[k].name)}</b><br><small>${wegstrecken[k].km} km (einfache Strecke)${wegstrecken[k].fahrzeitMin != null ? ' · ' + wegstrecken[k].fahrzeitMin + ' Min. Fahrzeit je Richtung' : ''}</small></span>
                    <span>
                        <button class="btn-secondary" style="width:auto; margin:0 4px 0 0; padding:6px 10px;" onclick="wegstreckeBearbeiten('${k}')">${ICONS.pencil}</button>
                        <button class="btn-danger" style="width:auto; margin:0; padding:6px 10px;" onclick="wegstreckeLoeschen('${k}')">${ICONS.trash}</button>
                    </span>
                </div>`).join('');
        }
        el.innerHTML = html;
    }

    // ============================================================
    //  VERPFLEGUNG & FAHRTKOSTEN — PDF-Exporte für die Steuererklärung
    // ============================================================
    // Werte nach § 9 Abs. 4a EStG (Stand 2026) bzw. Reisekosten-Kilometersatz Pkw.
    // Bitte vor dem Steuerjahr-Export einmal gegenprüfen, ob sich die Sätze geändert haben.
    const VERPFLEGUNGSPAUSCHALE_EURO = 14;
    const VERPFLEGUNGSPAUSCHALE_SCHWELLE_MIN = 8 * 60;
    const KILOMETERPAUSCHALE_EURO_PRO_KM = 0.30;

    function listeAlsPdfVerpflegung() {
        const zeilen = listeZeilen().filter(z => z.abwesenheitMinuten > VERPFLEGUNGSPAUSCHALE_SCHWELLE_MIN);
        if (!zeilen.length) {
            alert('Für diesen Monat gibt es keine Dienste über 8 Stunden.');
            return;
        }
        if (!window.jspdf) {
            alert('PDF-Bibliothek konnte nicht geladen werden. Bitte mit Internetverbindung erneut versuchen.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const monat = `${MONATSNAMEN[listeDatum.getMonth()]} ${listeDatum.getFullYear()}`;
        const name = (aktuellesProfil && (aktuellesProfil.anzeigename || aktuellesProfil.email)) || '';
        const satzText = VERPFLEGUNGSPAUSCHALE_EURO.toFixed(2).replace('.', ',') + ' €';

        doc.setFontSize(15);
        doc.text(`Verpflegungsmehraufwand ${monat}`, 14, 16);
        let y = 22;
        if (name) {
            doc.setFontSize(10);
            doc.setTextColor(110);
            doc.text(name, 14, y);
            doc.setTextColor(0);
            y += 6;
        }
        doc.setFontSize(9);
        doc.setTextColor(110);
        doc.text(`Abwesenheit jeweils mehr als 8 Stunden — Pauschale ${satzText} pro Tag`, 14, y);
        y += 5;
        const fahrzeitHinweis = zeilen.some(z => z.fahrzeitAbweichend)
            ? `Abwesenheit einschließlich Anfahrt und Rückfahrt, pauschal ${ein.fahrzeitMin} Minuten je Richtung ` +
              `(für einzelne Orte abweichend laut Wegstreckenbuch hinterlegt).`
            : `Abwesenheit einschließlich Anfahrt und Rückfahrt, pauschal ${ein.fahrzeitMin} Minuten je Richtung.`;
        doc.text(fahrzeitHinweis, 14, y);
        doc.setTextColor(0);

        const kopf = [['Datum', 'Dienst', 'Beginn', 'Ende', 'Dauer', 'Abwesenheit', 'Pauschale']];
        const koerper = zeilen.map(z => [
            z.datumKurz, z.dienst, z.beginnZeit, z.endeZeit,
            stundenMinutenKurz(z.dauerMinuten), stundenMinutenKurz(z.abwesenheitMinuten), satzText
        ]);

        doc.autoTable({
            head: kopf,
            body: koerper,
            startY: y + 6,
            styles: { fontSize: 9, cellPadding: 2.5 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
            alternateRowStyles: { fillColor: [246, 248, 252] },
            columnStyles: { 5: { halign: 'right' }, 6: { halign: 'right' } },
            didDrawPage: (daten) => {
                const fussY = daten.cursor.y + 8;
                doc.setFontSize(10);
                doc.text(
                    `${zeilen.length} Tage × ${satzText} = ` +
                    `${(zeilen.length * VERPFLEGUNGSPAUSCHALE_EURO).toFixed(2).replace('.', ',')} €`,
                    14, fussY
                );
            }
        });

        const pad = (n) => n < 10 ? '0' + n : n;
        dateiSpeichernOderTeilen(`Verpflegungsmehraufwand_${listeDatum.getFullYear()}-${pad(listeDatum.getMonth() + 1)}.pdf`, doc.output('blob'));
    }

    function wegZeilen() {
        return listeZeilen().map(z => {
            const kmBeginn = wegKmFuerOrt(z.beginnOrt);
            const kmEnde = wegKmFuerOrt(z.endeOrt);
            const bekannt = kmBeginn != null && kmEnde != null;
            return { ...z, kmBeginn, kmEnde, kmGesamt: bekannt ? kmBeginn + kmEnde : null, bekannt };
        });
    }

    function listeAlsPdfWeg() {
        const zeilen = wegZeilen();
        if (!zeilen.length) {
            alert('Für diesen Monat sind keine Dienste gespeichert.');
            return;
        }
        const fehlend = zeilen.filter(z => !z.bekannt);
        if (fehlend.length) {
            const namen = [...new Set(fehlend.flatMap(z => [
                z.kmBeginn == null ? z.beginnOrt : null,
                z.kmEnde == null ? z.endeOrt : null
            ].filter(Boolean)))];
            if (!confirm(
                `Für ${fehlend.length} Dienst(e) fehlt noch die Entfernung zu: ${namen.join(', ')}.\n` +
                `Diese Tage werden im PDF ohne Kilometerangabe aufgeführt. Trotzdem fortfahren?\n` +
                `(Fehlende Orte trägst du unter Mehr → Wegstrecken nach.)`
            )) return;
        }
        if (!window.jspdf) {
            alert('PDF-Bibliothek konnte nicht geladen werden. Bitte mit Internetverbindung erneut versuchen.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape' });
        const monat = `${MONATSNAMEN[listeDatum.getMonth()]} ${listeDatum.getFullYear()}`;
        const name = (aktuellesProfil && (aktuellesProfil.anzeigename || aktuellesProfil.email)) || '';

        doc.setFontSize(15);
        doc.text(`Fahrtkosten ${monat}`, 14, 16);
        let y = 22;
        if (name) {
            doc.setFontSize(10);
            doc.setTextColor(110);
            doc.text(name, 14, y);
            doc.setTextColor(0);
            y += 6;
        }
        doc.setFontSize(9);
        doc.setTextColor(110);
        doc.text(
            `Reisekosten-Kilometerpauschale (Pkw) ${KILOMETERPAUSCHALE_EURO_PRO_KM.toFixed(2).replace('.', ',')} € je gefahrenem km, ` +
            `Hin- und Rückweg zu wechselnden Einsatzorten (kein fester Sammelpunkt)`,
            14, y
        );
        doc.setTextColor(0);

        const kopf = [['Datum', 'Beginnort', 'km', 'Endort', 'km', 'Gesamt km', 'Betrag']];
        const koerper = zeilen.map(z => [
            z.datumKurz,
            z.beginnOrt || '–', z.kmBeginn != null ? z.kmBeginn.toFixed(1) : '?',
            z.endeOrt || '–', z.kmEnde != null ? z.kmEnde.toFixed(1) : '?',
            z.kmGesamt != null ? z.kmGesamt.toFixed(1) : '–',
            z.kmGesamt != null ? (z.kmGesamt * KILOMETERPAUSCHALE_EURO_PRO_KM).toFixed(2).replace('.', ',') + ' €' : '–'
        ]);

        const gesamtKm = zeilen.reduce((a, z) => a + (z.kmGesamt || 0), 0);
        const gesamtEuro = gesamtKm * KILOMETERPAUSCHALE_EURO_PRO_KM;

        doc.autoTable({
            head: kopf,
            body: koerper,
            startY: y + 6,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [37, 99, 235], textColor: 255 },
            alternateRowStyles: { fillColor: [246, 248, 252] },
            columnStyles: { 2: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' } },
            didDrawPage: (daten) => {
                const fussY = daten.cursor.y + 8;
                doc.setFontSize(10);
                doc.text(
                    `${zeilen.length} Dienste · ${gesamtKm.toFixed(1)} km gesamt · ${gesamtEuro.toFixed(2).replace('.', ',')} €`,
                    14, fussY
                );
            }
        });

        const pad = (n) => n < 10 ? '0' + n : n;
        dateiSpeichernOderTeilen(`Fahrtkosten_${listeDatum.getFullYear()}-${pad(listeDatum.getMonth() + 1)}.pdf`, doc.output('blob'));
    }


    // ============================================================
    //  EINSTELLUNGEN (Verdienstwerte aus der Abrechnung)
    // ============================================================
    const EIN_STANDARD = {
        monatsentgelt: 3365.46, unregelm: 255.00, dienstklasse: 80.00, zz: 19.85,
        nacht: 25, samstag: 20, sonntag: 25, feiertag: 135, sonder: 40, mehrarbeit: 30,
        nachtVon: 21, nachtBis: 6, samstagAb: 13,
        wochenstunden: 37.5, entgeltgruppe: '', stufe: '', tarifStand: '', eingerichtetAm: '',
        fahrzeitMin: 30
    };
    let ein = { ...EIN_STANDARD };

    function einstellungenLaden() {
        try {
            const roh = localStorage.getItem('dienstplan_einstellungen');
            if (roh) ein = { ...EIN_STANDARD, ...JSON.parse(roh) };
        } catch (e) { ein = { ...EIN_STANDARD }; }

        const setze = (id, wert) => { const el = document.getElementById(id); if (el) el.value = wert; };
        setze('einMonatsentgelt', ein.monatsentgelt);
        setze('einWochenstunden', ein.wochenstunden);
        setze('einUnregelm', ein.unregelm);
        setze('einDienstklasse', ein.dienstklasse);
        setze('einZZ', ein.zz);
        setze('einNacht', ein.nacht);
        setze('einSamstag', ein.samstag);
        setze('einSonntag', ein.sonntag);
        setze('einFeiertag', ein.feiertag);
        setze('einSonder', ein.sonder);
        setze('einMehrarbeit', ein.mehrarbeit);
        setze('einNachtVon', ein.nachtVon);
        setze('einNachtBis', ein.nachtBis);
        setze('einSamstagAb', ein.samstagAb);
        setze('einFahrzeit', ein.fahrzeitMin);

        tarifListenFuellen('setEG', 'setStufe');
        if (ein.entgeltgruppe) setze('setEG', ein.entgeltgruppe);
        if (ein.stufe) setze('setStufe', ein.stufe);
        const hinweis = document.getElementById('tarifHinweis');
        if (hinweis && ein.entgeltgruppe) {
            hinweis.innerText = `Aus der TV-N-Berlin-Tabelle: EG ${ein.entgeltgruppe} Stufe ${ein.stufe}` +
                (ein.tarifStand ? ` · gültig ${ein.tarifStand}` : '');
        }
    }

    function einstellungenSpeichern() {
        const hole = (id, standard) => {
            const w = parseFloat(document.getElementById(id).value);
            return isNaN(w) ? standard : w;
        };
        ein = {
            monatsentgelt: hole('einMonatsentgelt', EIN_STANDARD.monatsentgelt),
            wochenstunden: hole('einWochenstunden', EIN_STANDARD.wochenstunden),
            unregelm: hole('einUnregelm', EIN_STANDARD.unregelm),
            dienstklasse: hole('einDienstklasse', EIN_STANDARD.dienstklasse),
            zz: hole('einZZ', EIN_STANDARD.zz),
            nacht: hole('einNacht', EIN_STANDARD.nacht),
            samstag: hole('einSamstag', EIN_STANDARD.samstag),
            sonntag: hole('einSonntag', EIN_STANDARD.sonntag),
            feiertag: hole('einFeiertag', EIN_STANDARD.feiertag),
            sonder: hole('einSonder', EIN_STANDARD.sonder),
            mehrarbeit: hole('einMehrarbeit', EIN_STANDARD.mehrarbeit),
            nachtVon: hole('einNachtVon', EIN_STANDARD.nachtVon),
            nachtBis: hole('einNachtBis', EIN_STANDARD.nachtBis),
            samstagAb: hole('einSamstagAb', EIN_STANDARD.samstagAb),
            fahrzeitMin: hole('einFahrzeit', EIN_STANDARD.fahrzeitMin),
            // Tarif-Angaben unveraendert uebernehmen
            entgeltgruppe: ein.entgeltgruppe || '',
            stufe: ein.stufe || '',
            tarifStand: ein.tarifStand || '',
            eingerichtetAm: ein.eingerichtetAm || new Date().toISOString()
        };
        einstellungenSpeichernLocal();
        zeigeMeldung('einMeldung', 'Gespeichert.', 'ok');
        renderCalendar();
    }

    function einstellungenSpeichernLocal() {
        localStorage.setItem('dienstplan_einstellungen', JSON.stringify(ein));
        profilFeldSpeichern('einstellungen', ein);
    }

    // ============================================================
    //  PAUSENLISTE
    // ============================================================
    let pausenEintraege = [];   // {von, bis, unbezahlt, ausgefallen}

    function pausenregelGeaendert() {
        const regel = document.getElementById('pausenregel').value;
        document.getElementById('pausenBereich').style.display =
            regel === 'reserve' ? 'none' : 'block';
        if (regel === 'B30') {
            // B30 kennt nur EINE unbezahlte Pause - aber bezahlte Pausen (BEZPAU)
            // koennen trotzdem mehrfach vorkommen und bleiben unangetastet.
            let ersteUnbezahlteGesehen = false;
            pausenEintraege = pausenEintraege.filter(p => {
                if (p.art === 'BEZPAU') return true;
                if (ersteUnbezahlteGesehen) return false;
                ersteUnbezahlteGesehen = true;
                return true;
            });
        }
        pausenRendern();
    }

    function pauseHinzufuegen() {
        pausenEintraege.push({ von: '', bis: '', unbezahlt: 30, gearbeitet: 0, art: 'UNBPAU' });
        pausenRendern();
    }

    function pauseEntfernen(i) {
        pausenEintraege.splice(i, 1);
        pausenRendern();
    }

    function pauseGeaendert(i, feld, wert) {
        const p = pausenEintraege[i];
        if (feld === 'unbezahlt' || feld === 'gearbeitet') {
            p[feld] = Math.max(0, Number(wert) || 0);
            // Nicht mehr arbeiten als unbezahlte Minuten vorhanden sind
            const dauer = minutenZwischen(p.von, p.bis);
            if (dauer) p.unbezahlt = Math.min(p.unbezahlt, dauer);
            p.gearbeitet = Math.min(Number(p.gearbeitet) || 0, p.unbezahlt || 0);
        } else {
            p[feld] = wert;
        }
        pausenSummeAktualisieren();
    }

    function minutenZwischen(von, bis) {
        if (!von || !bis) return 0;
        const [vh, vm] = von.split(':').map(Number);
        const [bh, bm] = bis.split(':').map(Number);
        let dauer = (bh * 60 + bm) - (vh * 60 + vm);
        if (dauer < 0) dauer += 24 * 60;     // über Mitternacht
        return dauer;
    }

    function pausenRendern() {
        const el = document.getElementById('pausenListe');
        if (!el) return;

        if (!pausenEintraege.length) {
            el.innerHTML = '<p class="auth-hinweis" style="margin:0;">Keine Pause eingetragen.</p>';
            pausenSummeAktualisieren();
            return;
        }

        el.innerHTML = pausenEintraege.map((p, i) => {
            const dauer = minutenZwischen(p.von, p.bis);
            const gearbeitet = Number(p.gearbeitet) || 0;
            const unbezahlt = Number(p.unbezahlt) || 0;
            const wirklichUnbezahlt = Math.max(0, unbezahlt - gearbeitet);
            const istBezahlt = p.art === 'BEZPAU';

            return `
            <div class="pause-karte ${gearbeitet > 0 ? 'ausgefallen' : ''}">
                <span class="dienst-marke ${istBezahlt ? 'gruen' : 'rot'}" style="display:inline-block; margin-bottom:6px;">${istBezahlt ? 'Bezahlt' : 'Unbezahlt'}</span>
                <div class="pause-zeilen">
                    <input type="time" value="${p.von}" onchange="pauseGeaendert(${i},'von',this.value); pausenRendern();">
                    <span>bis</span>
                    <input type="time" value="${p.bis}" onchange="pauseGeaendert(${i},'bis',this.value); pausenRendern();">
                    <button class="btn-danger pause-weg" onclick="pauseEntfernen(${i})">${ICONS.x}</button>
                </div>
                <div class="pause-zeilen" style="margin-top:6px;">
                    <span style="font-size:.8rem; white-space:nowrap;">davon unbezahlt</span>
                    <input type="number" min="0" step="1" value="${unbezahlt}"
                           onchange="pauseGeaendert(${i},'unbezahlt',this.value); pausenRendern();" style="max-width:80px;">
                    <span style="font-size:.8rem;">von ${dauer} Min.</span>
                </div>
                <div class="pause-zeilen" style="margin-top:6px;">
                    <span style="font-size:.8rem; white-space:nowrap;">davon gearbeitet</span>
                    <input type="number" min="0" max="${unbezahlt}" step="1" value="${gearbeitet}"
                           onchange="pauseGeaendert(${i},'gearbeitet',this.value); pausenRendern();" style="max-width:80px;">
                    <span style="font-size:.8rem;">Min.</span>
                </div>
                ${gearbeitet > 0 ? `<div class="pause-info">
                    ${gearbeitet} Min. zählen als Mehrarbeit · ${wirklichUnbezahlt} Min. bleiben unbezahlt
                </div>` : ''}
            </div>`;
        }).join('');

        pausenSummeAktualisieren();
    }

    function pausenSummeAktualisieren() {
        const el = document.getElementById('pausenSumme');
        if (!el) return;
        const regel = document.getElementById('pausenregel').value;
        if (regel === 'reserve') { el.innerText = 'Reservedienst – die gesamte Zeit ist bezahlt.'; return; }

        let summeUnbezahlt = 0, summeGearbeitet = 0;
        pausenEintraege.forEach(p => {
            const dauer = minutenZwischen(p.von, p.bis);
            const unbezahlt = Math.min(Number(p.unbezahlt) || 0, dauer || Number(p.unbezahlt) || 0);
            const gearbeitet = Math.min(Number(p.gearbeitet) || 0, unbezahlt);
            summeUnbezahlt += Math.max(0, unbezahlt - gearbeitet);
            summeGearbeitet += gearbeitet;
        });

        el.innerText = `Unbezahlt insgesamt: ${summeUnbezahlt} Min.` +
            (summeGearbeitet ? ` · ${summeGearbeitet} Min. gearbeitet → Mehrarbeit` : '');
        document.getElementById('pause').value = summeUnbezahlt;
    }






    // ============================================================
    //  HILFE-ANLEITUNGEN (Bildfolge mit gezeichneten Schritten)
    // ============================================================
    let hilfeAktuell = null;
    let hilfeIndex = 0;

    // Handy-Rahmen für die Anleitungen
    function handyRahmen(inhalt) {
        return `<svg viewBox="0 0 200 250" class="hilfe-bild" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="6" width="152" height="238" rx="18"
                  fill="var(--bg)" stroke="var(--border)" stroke-width="1"/>
            <rect x="82" y="14" width="36" height="4" rx="2" fill="var(--border)"/>
            ${inhalt}
        </svg>`;
    }

    // Kalendergitter für die letzte Seite
    function kalenderGitter() {
        let g = '';
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                const aktiv = r === 1 && c === 3;
                g += `<rect x="${c * 17}" y="${r * 20}" width="15" height="15" rx="3"
                       fill="${aktiv ? '#dcfce7' : 'var(--card)'}"
                       ${aktiv ? 'stroke="#10b981" stroke-width="1" class="hf" style="animation-delay:.7s"' : ''}/>`;
            }
        }
        return g;
    }

    const HILFEN = {
        upload: {
            titel: 'Dienst erfassen',
            schritte: [
                {
                    text: '<b>1. Foto auswählen</b><br>Dienstzettel fotografieren oder aus der Galerie wählen. Mehrere auf einmal gehen auch.',
                    bild: handyRahmen(`
                        <rect x="40" y="40" width="120" height="52" rx="8" fill="var(--upload-bg)"
                              stroke="#10b981" stroke-width="1" stroke-dasharray="4 3"/>
                        <rect x="62" y="55" width="76" height="22" rx="11" fill="#10b981"/>
                        <text x="100" y="70" font-size="11" fill="#fff" text-anchor="middle">Foto</text>
                        <circle cx="128" cy="96" r="9" fill="var(--text)" opacity=".8" class="h-tippen"/>
                        <rect x="40" y="110" width="120" height="9" rx="4" fill="var(--card)"/>
                        <rect x="40" y="126" width="120" height="9" rx="4" fill="var(--card)"/>
                        <rect x="40" y="142" width="74" height="9" rx="4" fill="var(--card)"/>`)
                },
                {
                    text: '<b>2. Die KI liest den Zettel</b><br>Datum, Zeiten, Pausen, Linien und Umläufe werden automatisch erkannt.',
                    bild: handyRahmen(`
                        <rect x="40" y="40" width="120" height="30" rx="8" fill="var(--total-bg)"/>
                        <text x="100" y="59" font-size="11" fill="var(--primary)" text-anchor="middle">liest aus</text>
                        <rect x="48" y="76" width="104" height="5" rx="2.5" fill="var(--card)"/>
                        <rect x="48" y="76" height="5" rx="2.5" fill="var(--primary)" class="h-balken"/>
                        <g class="hf" style="animation-delay:.5s">
                            <rect x="40" y="94" width="56" height="30" rx="6" fill="var(--card)"/>
                            <text x="47" y="106" font-size="10" fill="var(--text-soft)">Datum</text>
                            <text x="47" y="119" font-size="11" fill="var(--text)">28.08.</text></g>
                        <g class="hf" style="animation-delay:.9s">
                            <rect x="104" y="94" width="56" height="30" rx="6" fill="var(--card)"/>
                            <text x="111" y="106" font-size="10" fill="var(--text-soft)">Dienst</text>
                            <text x="111" y="119" font-size="11" fill="var(--text)">B 36</text></g>
                        <g class="hf" style="animation-delay:1.3s">
                            <rect x="40" y="130" width="56" height="30" rx="6" fill="var(--card)"/>
                            <text x="47" y="142" font-size="10" fill="var(--text-soft)">Beginn</text>
                            <text x="47" y="155" font-size="11" fill="var(--text)">15:37</text></g>
                        <g class="hf" style="animation-delay:1.7s">
                            <rect x="104" y="130" width="56" height="30" rx="6" fill="var(--card)"/>
                            <text x="111" y="142" font-size="10" fill="var(--text-soft)">Ende</text>
                            <text x="111" y="155" font-size="11" fill="var(--text)">00:29</text></g>`)
                },
                {
                    text: '<b>3. Werte prüfen</b><br>Kurz drüberschauen. Jedes Feld lässt sich von Hand ändern, falls etwas nicht stimmt.',
                    bild: handyRahmen(`
                        <rect x="40" y="44" width="120" height="30" rx="6" fill="var(--card)"
                              stroke="var(--primary)" stroke-width="1" class="h-pulsieren"/>
                        <text x="47" y="56" font-size="10" fill="var(--text-soft)">Beginn</text>
                        <text x="47" y="69" font-size="11" fill="var(--text)">15:37</text>
                        <rect x="40" y="82" width="120" height="30" rx="6" fill="var(--card)"/>
                        <text x="47" y="94" font-size="10" fill="var(--text-soft)">Pause</text>
                        <text x="47" y="107" font-size="11" fill="var(--text)">20:09 – 20:39</text>
                        <rect x="40" y="122" width="120" height="26" rx="7" fill="var(--primary)"/>
                        <text x="100" y="139" font-size="11" fill="#fff" text-anchor="middle">Berechnen</text>
                        <circle cx="140" cy="158" r="9" fill="var(--text)" opacity=".8" class="h-tippen" style="animation-delay:1s"/>`)
                },
                {
                    text: '<b>4. Kontrolle</b><br>Die App vergleicht ihr Ergebnis mit den Werten auf deinem Dienstzettel. Grün heißt: passt.',
                    bild: handyRahmen(`
                        <rect x="40" y="44" width="120" height="20" rx="5" fill="var(--card)"/>
                        <text x="47" y="58" font-size="10" fill="var(--text)">Bezahlte Zeit</text>
                        <text x="153" y="58" font-size="10" fill="var(--text)" text-anchor="end">08:22</text>
                        <rect x="40" y="70" width="120" height="20" rx="5" fill="var(--card)"/>
                        <text x="47" y="84" font-size="10" fill="var(--text)">Nacht</text>
                        <text x="153" y="84" font-size="10" fill="var(--text)" text-anchor="end">17,29 €</text>
                        <g class="hf" style="animation-delay:.6s">
                            <rect x="40" y="100" width="120" height="40" rx="8" fill="rgba(22,163,74,.15)"/>
                            <path d="M62 120 l7 8 14 -16" fill="none" stroke="#16a34a" stroke-width="2.5"
                                  stroke-linecap="round" stroke-linejoin="round" class="h-haken"/>
                            <text x="96" y="124" font-size="10" fill="#16a34a">stimmt überein</text></g>`)
                },
                {
                    text: '<b>5. Speichern</b><br>Der Dienst landet im Kalender. Du kannst ihn später antippen und nachträglich ändern.',
                    bild: handyRahmen(`
                        <rect x="40" y="44" width="120" height="26" rx="7" fill="#10b981"/>
                        <text x="100" y="61" font-size="11" fill="#fff" text-anchor="middle">Speichern</text>
                        <g transform="translate(40,86)">${kalenderGitter()}</g>
                        <text x="100" y="168" font-size="10" fill="var(--text-soft)" text-anchor="middle">im Kalender</text>`)
                }
            ]
        },

        pausen: {
            titel: 'Pausenregelung',
            schritte: [
                {
                    text: '<b>Wo steht die Regel?</b><br>Im Kopf deines Dienstzettels findest du das Feld „Pausenregel". Die App liest es beim Scannen automatisch mit aus.',
                    bild: handyRahmen(`
                        <rect x="40" y="40" width="120" height="90" rx="6" fill="var(--card)"/>
                        <text x="47" y="54" font-size="9" fill="var(--text-soft)">Dienstdauer</text>
                        <text x="47" y="66" font-size="10" fill="var(--text)">08:52</text>
                        <text x="110" y="54" font-size="9" fill="var(--text-soft)">Bezahlte Zeit</text>
                        <text x="110" y="66" font-size="10" fill="var(--text)">08:22</text>
                        <rect x="44" y="74" width="60" height="30" rx="4" fill="var(--total-bg)" class="h-pulsieren"/>
                        <text x="47" y="86" font-size="9" fill="var(--text-soft)">Pausenregel</text>
                        <text x="47" y="99" font-size="11" fill="var(--primary)">B30</text>
                        <text x="110" y="86" font-size="9" fill="var(--text-soft)">Unbez. Pause</text>
                        <text x="110" y="99" font-size="10" fill="var(--text)">00:30</text>
                        <text x="100" y="150" font-size="10" fill="var(--text-soft)" text-anchor="middle">Kopfbereich des Zettels</text>`)
                },
                {
                    text: '<b>B30</b><br>Eine Pause, davon sind genau 30 Minuten unbezahlt – und zwar die letzten 30. Der Rest der Pause zählt als bezahlte Zeit.',
                    bild: handyRahmen(`
                        <text x="100" y="46" font-size="10" fill="var(--text-soft)" text-anchor="middle">Pause 20:09 – 20:39</text>
                        <rect x="40" y="56" width="120" height="26" rx="5" fill="var(--card)"/>
                        <rect x="40" y="56" width="120" height="26" rx="5" fill="rgba(245,158,11,.3)" class="hf" style="animation-delay:.4s"/>
                        <text x="100" y="73" font-size="10" fill="var(--text)" text-anchor="middle">30 Min. unbezahlt</text>
                        <text x="100" y="104" font-size="10" fill="var(--text-soft)" text-anchor="middle">Ist die Pause länger,</text>
                        <text x="100" y="118" font-size="10" fill="var(--text-soft)" text-anchor="middle">zählt der Anfang als</text>
                        <text x="100" y="132" font-size="10" fill="var(--text-soft)" text-anchor="middle">bezahlte Zeit.</text>
                        <rect x="40" y="146" width="120" height="22" rx="5" fill="var(--card)"/>
                        <rect x="40" y="146" width="44" height="22" rx="5" fill="rgba(22,163,74,.25)"/>
                        <text x="62" y="161" font-size="9" fill="#16a34a" text-anchor="middle">bezahlt</text>
                        <text x="122" y="161" font-size="9" fill="var(--text-soft)" text-anchor="middle">unbezahlt</text>`)
                },
                {
                    text: '<b>Sechste</b><br>Mehrere Pausen über den Dienst verteilt. Bei jeder trägst du ein, wie viele Minuten davon unbezahlt sind.',
                    bild: handyRahmen(`
                        <g class="hf" style="animation-delay:.2s">
                            <rect x="40" y="44" width="120" height="34" rx="6" fill="var(--card)"/>
                            <text x="47" y="58" font-size="10" fill="var(--text)">13:45 – 13:51</text>
                            <text x="153" y="58" font-size="9" fill="var(--text-soft)" text-anchor="end">6 Min.</text>
                            <text x="47" y="71" font-size="9" fill="var(--text-soft)">davon unbezahlt</text></g>
                        <g class="hf" style="animation-delay:.6s">
                            <rect x="40" y="84" width="120" height="34" rx="6" fill="var(--card)"/>
                            <text x="47" y="98" font-size="10" fill="var(--text)">16:06 – 16:10</text>
                            <text x="153" y="98" font-size="9" fill="var(--text-soft)" text-anchor="end">4 Min.</text>
                            <text x="47" y="111" font-size="9" fill="var(--text-soft)">davon unbezahlt</text></g>
                        <g class="hf" style="animation-delay:1s">
                            <rect x="40" y="124" width="120" height="34" rx="6" fill="var(--card)"/>
                            <text x="47" y="138" font-size="10" fill="var(--text)">18:35 – 18:42</text>
                            <text x="153" y="138" font-size="9" fill="var(--text-soft)" text-anchor="end">7 Min.</text>
                            <text x="47" y="151" font-size="9" fill="var(--text-soft)">davon unbezahlt</text></g>
                        <text x="100" y="180" font-size="10" fill="var(--primary)" text-anchor="middle">zusammen 17 Min.</text>`)
                },
                {
                    text: '<b>Reserve</b><br>Bei Reservediensten ist die gesamte Zeit bezahlt. Die App blendet die Pausenliste dann aus.',
                    bild: handyRahmen(`
                        <rect x="40" y="50" width="120" height="30" rx="6" fill="var(--card)"/>
                        <text x="47" y="63" font-size="9" fill="var(--text-soft)">Pausenregel</text>
                        <text x="47" y="76" font-size="11" fill="var(--text)">Reserve</text>
                        <g class="hf" style="animation-delay:.5s">
                            <rect x="40" y="94" width="120" height="46" rx="8" fill="rgba(22,163,74,.15)"/>
                            <text x="100" y="113" font-size="10" fill="#16a34a" text-anchor="middle">gesamte Zeit</text>
                            <text x="100" y="128" font-size="10" fill="#16a34a" text-anchor="middle">bezahlt</text></g>
                        <text x="100" y="164" font-size="10" fill="var(--text-soft)" text-anchor="middle">erkennbar am Typ „Res"</text>`)
                },
                {
                    text: '<b>Durchgearbeitet?</b><br>Musstest du in der Pause fahren, trag die Minuten bei „davon gearbeitet" ein. Sie zählen dann als Mehrarbeit mit Zuschlag.',
                    bild: handyRahmen(`
                        <rect x="40" y="44" width="120" height="70" rx="6" fill="var(--card)"
                              stroke="#f59e0b" stroke-width="1"/>
                        <text x="47" y="58" font-size="10" fill="var(--text)">20:09 – 20:39</text>
                        <text x="47" y="74" font-size="9" fill="var(--text-soft)">davon unbezahlt</text>
                        <text x="153" y="74" font-size="10" fill="var(--text)" text-anchor="end">30</text>
                        <text x="47" y="92" font-size="9" fill="var(--text-soft)">davon gearbeitet</text>
                        <rect x="120" y="82" width="33" height="14" rx="3" fill="var(--total-bg)" class="h-pulsieren"/>
                        <text x="136" y="93" font-size="10" fill="var(--primary)" text-anchor="middle">12</text>
                        <g class="hf" style="animation-delay:.6s">
                            <rect x="40" y="126" width="120" height="34" rx="6" fill="rgba(245,158,11,.18)"/>
                            <text x="100" y="141" font-size="9" fill="#b45309" text-anchor="middle">12 Min. Mehrarbeit</text>
                            <text x="100" y="154" font-size="9" fill="#b45309" text-anchor="middle">18 Min. unbezahlt</text></g>`)
                }
            ]
        },

        verdienst: {
            titel: 'Verdienst eintragen',
            schritte: [
                {
                    text: '<b>Wo finde ich die Werte?</b><br>Alle Angaben stehen auf deiner Verdienstabrechnung. Nimm sie am besten zur Hand.',
                    bild: handyRahmen(`
                        <rect x="40" y="34" width="120" height="150" rx="6" fill="var(--card)"/>
                        <text x="100" y="50" font-size="10" fill="var(--text)" text-anchor="middle">Verdienstabrechnung</text>
                        <line x1="48" y1="58" x2="152" y2="58" stroke="var(--border)" stroke-width="1"/>
                        ${[0,1,2,3,4,5,6].map(i => `<rect x="48" y="${68 + i*15}" width="${i%3===0?90:104}" height="7" rx="3" fill="var(--bg)"/>`).join('')}
                        <text x="100" y="200" font-size="10" fill="var(--text-soft)" text-anchor="middle">monatlich per Post</text>`)
                },
                {
                    text: '<b>Entgeltgruppe wählen</b><br>Wähle deine Gruppe und Stufe – das Monatsentgelt wird dann automatisch aus der Tariftabelle übernommen.',
                    bild: handyRahmen(`
                        <rect x="40" y="44" width="56" height="30" rx="6" fill="var(--card)"
                              stroke="var(--primary)" stroke-width="1" class="h-pulsieren"/>
                        <text x="47" y="56" font-size="9" fill="var(--text-soft)">Gruppe</text>
                        <text x="47" y="69" font-size="11" fill="var(--text)">EG 5</text>
                        <rect x="104" y="44" width="56" height="30" rx="6" fill="var(--card)"
                              stroke="var(--primary)" stroke-width="1" class="h-pulsieren"/>
                        <text x="111" y="56" font-size="9" fill="var(--text-soft)">Stufe</text>
                        <text x="111" y="69" font-size="11" fill="var(--text)">5</text>
                        <g class="hf" style="animation-delay:.7s">
                            <rect x="40" y="88" width="120" height="40" rx="8" fill="var(--total-bg)"/>
                            <text x="100" y="104" font-size="9" fill="var(--text-soft)" text-anchor="middle">Monatsentgelt</text>
                            <text x="100" y="120" font-size="12" fill="var(--primary)" text-anchor="middle">3.365,46 €</text></g>
                        <text x="100" y="156" font-size="9" fill="var(--text-soft)" text-anchor="middle">aus der TV-N-Tabelle</text>`)
                },
                {
                    text: '<b>Zuschlagsentgelt</b><br>Suche auf der Abrechnung die Zeile „Entgelt stdl. ZZ". Dieser Wert ist die Grundlage für alle Zuschläge – nicht dein Stundenlohn.',
                    bild: handyRahmen(`
                        <rect x="36" y="40" width="128" height="112" rx="6" fill="var(--card)"/>
                        <text x="44" y="54" font-size="9" fill="var(--text-soft)">Entgelt mit Stufe</text>
                        <text x="156" y="54" font-size="9" fill="var(--text)" text-anchor="end">3.365,46</text>
                        <text x="44" y="70" font-size="9" fill="var(--text-soft)">Entg.pers.stdl.</text>
                        <text x="156" y="70" font-size="9" fill="var(--text)" text-anchor="end">20,64</text>
                        <rect x="40" y="76" width="120" height="18" rx="4" fill="rgba(245,158,11,.25)" class="hf" style="animation-delay:.5s"/>
                        <text x="44" y="89" font-size="9" fill="#b45309">Entgelt stdl. ZZ</text>
                        <text x="156" y="89" font-size="10" fill="#b45309" text-anchor="end">19,85</text>
                        <text x="44" y="108" font-size="9" fill="var(--text-soft)">Entg.Stufe 1 ZZ</text>
                        <text x="156" y="108" font-size="9" fill="var(--text)" text-anchor="end">19,20</text>
                        <text x="100" y="176" font-size="10" fill="var(--text-soft)" text-anchor="middle">diese Zeile brauchst du</text>`)
                },
                {
                    text: '<b>Zulagen</b><br>„Unregelm. Dienste" und „Pausch. Dienstklasse" stehen als eigene Zeilen auf der Abrechnung. Sie sind bei jedem anders.',
                    bild: handyRahmen(`
                        <rect x="36" y="46" width="128" height="80" rx="6" fill="var(--card)"/>
                        <text x="44" y="62" font-size="9" fill="var(--text-soft)">Monatsentgelt</text>
                        <text x="156" y="62" font-size="9" fill="var(--text)" text-anchor="end">3.365,46</text>
                        <rect x="40" y="70" width="120" height="17" rx="4" fill="rgba(37,99,235,.18)" class="hf" style="animation-delay:.4s"/>
                        <text x="44" y="82" font-size="9" fill="var(--primary)">unregelm. Dienste</text>
                        <text x="156" y="82" font-size="9" fill="var(--primary)" text-anchor="end">255,00</text>
                        <rect x="40" y="92" width="120" height="17" rx="4" fill="rgba(37,99,235,.18)" class="hf" style="animation-delay:.8s"/>
                        <text x="44" y="104" font-size="9" fill="var(--primary)">Pausch. Dienstkl.</text>
                        <text x="156" y="104" font-size="9" fill="var(--primary)" text-anchor="end">80,00</text>
                        <text x="100" y="152" font-size="10" fill="var(--text-soft)" text-anchor="middle">beide Werte eintragen</text>`)
                },
                {
                    text: '<b>Fertig</b><br>Wochenstunden noch ergänzen, speichern – und die App rechnet ab jetzt mit deinen Werten. Bei einer Tarifrunde einfach anpassen.',
                    bild: handyRahmen(`
                        <rect x="40" y="44" width="120" height="24" rx="5" fill="var(--card)"/>
                        <text x="47" y="60" font-size="10" fill="var(--text-soft)">Wochenstunden</text>
                        <text x="153" y="60" font-size="10" fill="var(--text)" text-anchor="end">37,5</text>
                        <rect x="40" y="78" width="120" height="26" rx="7" fill="var(--primary)"/>
                        <text x="100" y="95" font-size="11" fill="#fff" text-anchor="middle">Speichern</text>
                        <g class="hf" style="animation-delay:.6s">
                            <rect x="40" y="118" width="120" height="44" rx="8" fill="rgba(22,163,74,.15)"/>
                            <path d="M60 138 l7 8 14 -16" fill="none" stroke="#16a34a" stroke-width="2.5"
                                  stroke-linecap="round" stroke-linejoin="round" class="h-haken"/>
                            <text x="96" y="143" font-size="10" fill="#16a34a">eingerichtet</text></g>`)
                }
            ]
        }
    };

    function hilfeOeffnen(name) {
        hilfeAktuell = HILFEN[name];
        if (!hilfeAktuell) return;
        hilfeIndex = 0;
        document.getElementById('hilfeTitel').innerText = hilfeAktuell.titel;
        document.getElementById('hilfeOverlay').style.display = 'flex';
        hilfeRendern();
    }

    function hilfeSchliessen(ereignis) {
        if (ereignis && ereignis.target !== document.getElementById('hilfeOverlay')) return;
        document.getElementById('hilfeOverlay').style.display = 'none';
    }

    function hilfeSchritt(richtung) {
        const anzahl = hilfeAktuell.schritte.length;
        if (hilfeIndex + richtung < 0) return;
        if (hilfeIndex + richtung >= anzahl) { hilfeSchliessen(); return; }
        hilfeIndex += richtung;
        hilfeRendern();
    }

    function hilfeRendern() {
        const schritt = hilfeAktuell.schritte[hilfeIndex];
        const anzahl = hilfeAktuell.schritte.length;

        const inhalt = document.getElementById('hilfeInhalt');
        inhalt.innerHTML = '';
        requestAnimationFrame(() => {
            inhalt.innerHTML = schritt.bild + `<p class="hilfe-text">${schritt.text}</p>`;
        });

        document.getElementById('hilfePunkte').innerHTML =
            hilfeAktuell.schritte.map((_, i) =>
                `<span class="hilfe-punkt ${i === hilfeIndex ? 'aktiv' : ''}"></span>`).join('');

        document.getElementById('hilfeZurueck').style.visibility = hilfeIndex === 0 ? 'hidden' : 'visible';
        document.getElementById('hilfeWeiter').innerText =
            hilfeIndex === anzahl - 1 ? 'Fertig' : 'Weiter ›';
    }

    // ============================================================
    //  HILFE-ZUGRIFF (Admin sieht fremde Daten nur nach Freigabe)
    // ============================================================
    function hilfeRestzeit() {
        if (!aktuellesProfil || !aktuellesProfil.hilfe_bis) return 0;
        const rest = new Date(aktuellesProfil.hilfe_bis) - Date.now();
        return rest > 0 ? rest : 0;
    }

    function hilfeAnzeigeAktualisieren() {
        const rest = hilfeRestzeit();
        const box = document.getElementById('hilfeAktivBox');
        const status = document.getElementById('hilfeStatus');
        const knopf = document.getElementById('hilfeKnopf');

        if (rest > 0) {
            const stunden = Math.floor(rest / 3600000);
            const minuten = Math.floor((rest % 3600000) / 60000);
            const text = `Der Admin kann deine Dienste noch ${stunden} Std. ${minuten} Min. lang sehen und Einstellungen für dich anpassen.`;
            if (box) { box.style.display = 'block'; document.getElementById('hilfeAktivText').innerText = text; }
            if (status) status.innerHTML = `<span style="display:flex; align-items:flex-start; gap:6px;">${ICONS.unlock} ${text}</span>`;
            if (knopf) { knopf.innerText = 'Zugriff jetzt beenden'; knopf.className = 'btn-danger'; }
        } else {
            if (box) box.style.display = 'none';
            if (status) status.innerHTML = `<span style="display:flex; align-items:flex-start; gap:6px;">${ICONS.lock} Zurzeit kann niemand deine Daten sehen.</span>`;
            if (knopf) { knopf.innerText = 'Zugriff für 24 Std. freigeben'; knopf.className = 'btn-secondary'; }
        }
    }

    async function hilfeUmschalten() {
        if (hilfeRestzeit() > 0) return hilfeBeenden();

        if (!confirm('Dem Admin für 24 Stunden Zugriff geben?\n\nEr kann dann deine Dienste sehen und Einstellungen für dich anpassen. Du kannst den Zugriff jederzeit wieder beenden.')) return;
        try {
            const { data, error } = await sb.rpc('hilfe_freigeben');
            if (error) throw error;
            aktuellesProfil.hilfe_bis = data;
            hilfeAnzeigeAktualisieren();
        } catch (e) {
            alert('Freigabe fehlgeschlagen: ' + (e.message || e));
        }
    }

    async function hilfeBeenden() {
        try {
            const { error } = await sb.rpc('hilfe_beenden');
            if (error) throw error;
            aktuellesProfil.hilfe_bis = null;
            hilfeAnzeigeAktualisieren();
        } catch (e) {
            alert('Beenden fehlgeschlagen: ' + (e.message || e));
        }
    }

    // Admin bittet einen Nutzer per Chat um Freigabe
    async function hilfeAnfragen(nutzerId, name) {
        if (!confirm(`${name} um Hilfe-Zugriff bitten?\n\nEr bekommt eine Nachricht im Chat und kann dort freigeben. Ohne seine Zustimmung siehst du seine Daten nicht.`)) return;
        try {
            const { data: chatId, error } = await sb.rpc('einzelchat_oeffnen', { partner_id: nutzerId });
            if (error) throw error;

            const text = 'Hallo! Ich würde dir gerne bei den Einstellungen helfen. ' +
                'Dafür brauche ich für 24 Stunden Zugriff auf deine Daten.\n\n' +
                'Wenn das für dich in Ordnung ist: Zahnrad oben rechts → ganz unten ' +
                '"Zugriff für 24 Std. freigeben".\n\n' +
                'Du kannst den Zugriff jederzeit selbst wieder beenden, und nach ' +
                '24 Stunden läuft er automatisch ab.';

            const { error: fehler } = await sb.from('nachrichten').insert({
                unterhaltung_id: chatId, absender_id: aktuellerNutzer.id, text: text
            });
            if (fehler) throw fehler;

            zeigeMeldung('adminMeldung', `Anfrage an ${name} gesendet.`, 'ok');
            await chatListeLaden();
        } catch (e) {
            zeigeMeldung('adminMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    // ============================================================
    //  CHAT
    // ============================================================
    let unterhaltungen = [];
    let kontakte = [];
    let aktuelleUnterhaltung = null;   // { id, art, titel, unter }
    let chatKanal = null;              // Verbindung für neue Nachrichten
    let zuTeilenderDienst = null;

    function zeitKurz(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        const heute = new Date();
        const gleicherTag = d.toDateString() === heute.toDateString();
        const pad = n => n < 10 ? '0' + n : n;
        if (gleicherTag) return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}. ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function sicher(text) {
        const div = document.createElement('div');
        div.innerText = text == null ? '' : String(text);
        return div.innerHTML;
    }

    // ---------- Übersicht ----------
    async function chatListeLaden() {
        const el = document.getElementById('chatListe');
        if (!sb || !aktuellerNutzer) return;

        document.getElementById('btnGruppeNeu').style.display =
            (aktuellesProfil && aktuellesProfil.rolle === 'admin') ? 'block' : 'none';

        try {
            const { data, error } = await sb.rpc('meine_unterhaltungen');
            if (error) throw error;
            unterhaltungen = data || [];

            if (!unterhaltungen.length) {
                el.innerHTML = `<p class="auth-hinweis">Noch keine Gespräche. Tippe oben auf ${ICONS.pencil}, um jemandem zu schreiben.</p>`;
            } else {
                el.innerHTML = unterhaltungen.map(u => {
                    const titel = u.art === 'gruppe' ? u.name : (u.partner_name || 'Unbekannt');
                    const symbol = u.art === 'gruppe' ? ICONS.users : ICONS.person;
                    const unter = u.art === 'gruppe' ? 'Gruppe'
                                : (u.partner_hof || '');
                    return `
                    <div class="chat-eintrag" onclick="chatOeffnen(${u.id})">
                        <div class="chat-avatar">${symbol}</div>
                        <div style="flex:1; min-width:0;">
                            <div class="chat-name">${sicher(titel)}
                                ${u.ungelesen > 0 ? `<span class="chat-zaehler">${u.ungelesen}</span>` : ''}</div>
                            <div class="chat-vorschau">${sicher(u.letzte_nachricht || unter)}</div>
                        </div>
                        <div class="chat-zeit">${zeitKurz(u.letzte_zeit)}</div>
                    </div>`;
                }).join('');
            }

            ungelesenPruefen();
        } catch (e) {
            el.innerHTML = '<p class="auth-hinweis">Gespräche konnten nicht geladen werden.</p>';
            console.error(e);
        }
    }

    function ungelesenPruefen() {
        const gesamt = unterhaltungen.reduce((a, u) => a + (u.ungelesen || 0), 0);
        const punkt = document.getElementById('chatPunkt');
        if (punkt) punkt.style.display = gesamt > 0 ? 'block' : 'none';
    }

    // ---------- Kontakte ----------
    async function kontakteLaden() {
        try {
            const { data, error } = await sb.rpc('chat_kontakte');
            if (error) throw error;
            kontakte = data || [];
            kontakteRendern();
            gruppenMitgliederRendern();
        } catch (e) {
            document.getElementById('kontaktListe').innerHTML =
                '<p class="auth-hinweis">Kontakte konnten nicht geladen werden.</p>';
        }
    }

    function kontakteRendern() {
        const el = document.getElementById('kontaktListe');
        if (!el) return;
        const suche = (document.getElementById('kontaktSuche').value || '').toLowerCase();
        const treffer = kontakte.filter(k =>
            !suche || (k.anzeigename || '').toLowerCase().includes(suche) ||
                      (k.betriebshof || '').toLowerCase().includes(suche));

        if (!treffer.length) {
            el.innerHTML = '<p class="auth-hinweis">' +
                (suche ? 'Niemand gefunden.' : 'Noch keine anderen Nutzer.') + '</p>';
            return;
        }

        el.innerHTML = treffer.map(k => `
            <div class="chat-eintrag" onclick="einzelchatStarten('${k.id}')">
                <div class="chat-avatar">${ICONS.person}</div>
                <div style="flex:1;">
                    <div class="chat-name">${sicher(k.anzeigename)}</div>
                    <div class="chat-vorschau">${sicher(k.betriebshof || '')}</div>
                </div>
            </div>`).join('');
    }

    async function einzelchatStarten(partnerId) {
        try {
            const { data, error } = await sb.rpc('einzelchat_oeffnen', { partner_id: partnerId });
            if (error) throw error;
            await chatListeLaden();
            chatOeffnen(data);
        } catch (e) {
            alert('Gespräch konnte nicht geöffnet werden: ' + (e.message || e));
        }
    }

    // ---------- Gruppe anlegen ----------
    function gruppenMitgliederRendern() {
        const el = document.getElementById('gruppeMitglieder');
        if (!el) return;
        if (!kontakte.length) {
            el.innerHTML = '<p class="auth-hinweis">Keine Nutzer vorhanden.</p>';
            return;
        }
        el.innerHTML = kontakte.map(k => `
            <label class="pause-check" style="padding:8px 0; border-bottom:1px solid var(--border);">
                <input type="checkbox" value="${k.id}" class="gruppe-mitglied">
                ${sicher(k.anzeigename)}${k.betriebshof ? ' · ' + sicher(k.betriebshof) : ''}
            </label>`).join('');
    }

    async function gruppeAnlegen() {
        const name = document.getElementById('gruppeName').value.trim();
        const gewaehlt = [...document.querySelectorAll('.gruppe-mitglied:checked')].map(e => e.value);

        if (!name) { zeigeMeldung('gruppeMeldung', 'Bitte einen Namen eingeben.', 'fehler'); return; }
        if (!gewaehlt.length) { zeigeMeldung('gruppeMeldung', 'Bitte mindestens ein Mitglied wählen.', 'fehler'); return; }

        try {
            const { data, error } = await sb.rpc('gruppe_anlegen', {
                gruppen_name: name, mitglieder: gewaehlt
            });
            if (error) throw error;
            document.getElementById('gruppeName').value = '';
            document.querySelectorAll('.gruppe-mitglied').forEach(e => e.checked = false);
            await chatListeLaden();
            chatOeffnen(data);
        } catch (e) {
            zeigeMeldung('gruppeMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    // ---------- Ein Gespräch öffnen ----------
    async function chatOeffnen(id) {
        // Wartet ein Dienstverlauf aufs Teilen? Dann jetzt senden.
        if (zuTeilenderDienst) {
            await dienstTeilenIn(id);
            return;
        }
        const u = unterhaltungen.find(x => x.id === id);
        aktuelleUnterhaltung = {
            id: id,
            art: u ? u.art : 'einzel',
            titel: u ? (u.art === 'gruppe' ? u.name : u.partner_name) : '',
            unter: u ? (u.art === 'gruppe' ? 'Gruppe' : (u.partner_hof || '')) : ''
        };

        document.getElementById('chatTitel').innerText = aktuelleUnterhaltung.titel || 'Gespräch';
        document.getElementById('chatUnter').innerText = aktuelleUnterhaltung.art === 'einzel'
            ? '🔒 Privat – nur ihr beide könnt mitlesen'
            : aktuelleUnterhaltung.unter;

        wechselSeite('chatraum');
        await nachrichtenLaden();
        kanalVerbinden(id);

        try { await sb.rpc('chat_gelesen', { u_id: id }); } catch (e) {}
    }

    async function nachrichtenLaden() {
        const el = document.getElementById('chatVerlauf');
        if (!aktuelleUnterhaltung) return;
        try {
            const { data, error } = await sb.from('nachrichten')
                .select('*').eq('unterhaltung_id', aktuelleUnterhaltung.id)
                .order('erstellt_am', { ascending: true });
            if (error) throw error;

            // Namen der Absender für Gruppen
            const namen = {};
            kontakte.forEach(k => { namen[k.id] = k.anzeigename; });
            namen[aktuellerNutzer.id] = 'Du';

            el.innerHTML = (data || []).map(n => nachrichtHtml(n, namen)).join('');
            el.scrollTop = el.scrollHeight;
        } catch (e) {
            el.innerHTML = '<p class="auth-hinweis">Nachrichten konnten nicht geladen werden.</p>';
        }
    }

    function nachrichtHtml(n, namen) {
        const eigen = n.absender_id === aktuellerNutzer.id;
        const absender = (namen && namen[n.absender_id]) || 'Unbekannt';
        const zeigeName = aktuelleUnterhaltung.art === 'gruppe' && !eigen;

        let inhalt;
        if (n.dienst) {
            inhalt = dienstKarteHtml(n.dienst);
        } else {
            inhalt = sicher(n.text).replace(/\n/g, '<br>');
        }

        return `<div class="chat-blase-zeile ${eigen ? 'eigen' : ''}">
            <div class="chat-blase ${eigen ? 'eigen' : ''}">
                ${zeigeName ? `<div class="chat-absender">${sicher(absender)}</div>` : ''}
                ${inhalt}
                <div class="chat-blase-zeit">${zeitKurz(n.erstellt_am)}
                    ${(eigen || (aktuellesProfil && aktuellesProfil.rolle === 'admin'))
                      ? `<span class="chat-weg" onclick="nachrichtLoeschen(${n.id})">${ICONS.x}</span>` : ''}
                </div>
            </div>
        </div>`;
    }

    // Geteilter Dienstverlauf: nur wann und wo, keine Beträge
    function dienstSymbol(art) {
        const a = (art || '').toLowerCase();
        if (a.startsWith('beginn')) return ICONS.play;
        if (a.startsWith('ende')) return ICONS.stop;
        if (a.startsWith('pause')) return ICONS.coffee;
        if (/(ü|ue|u)bergabe/.test(a)) return ICONS.handoverOut;
        if (/(ü|ue|u)bernahme/.test(a)) return ICONS.handoverIn;
        if (a.startsWith('aussetz')) return ICONS.stop;
        if (a.startsWith('einsetz')) return ICONS.busStop;
        return '•';
    }

    function dienstKarteHtml(d) {
        const kopf = `${ICONS.fileText} ${sicher(d.datum ? d.datum.split('-').reverse().join('.') : '')}` +
                     `${d.dienstnummer ? ' · ' + sicher(d.dienstnummer) : ''}`;

        // Ältere geteilte Dienste hatten noch kein "punkte"-Feld
        const punkte = d.punkte || [];
        if (!punkte.length) {
            return `<div class="dienst-karte-chat"><div class="dk-kopf">${kopf}</div>
                    <div class="dk-zeile">Keine Verlaufsdaten.</div></div>`;
        }

        const zeilen = punkte.map(pt => {
            const zeit = pt.art === 'Pause'
                ? `${pt.zeit || ''}–${pt.bis || ''}`
                : `${pt.zeit || ''}${pt.folgetag ? '+' : ''}`;

            const teile = [];
            if (pt.linie) teile.push('Linie ' + pt.linie);
            if (pt.umlauf) teile.push('Umlauf ' + pt.umlauf);
            let unten = teile.join(' · ');
            if (pt.nach) unten += (unten ? ' → ' : '→ ') + sicher(pt.nach);

            return `<div class="dk-punkt">
                <div class="dk-zeile"><b>${dienstSymbol(pt.art)} ${sicher(pt.art)} ${zeit}</b></div>
                ${pt.ort ? `<div class="dk-ort">${sicher(pt.ort)}${pt.dienst ? ' (von ' + sicher(pt.dienst) + ')' : ''}</div>` : ''}
                ${unten ? `<div class="dk-info">${unten}</div>` : ''}
            </div>`;
        }).join('');

        return `<div class="dienst-karte-chat">
            <div class="dk-kopf">${kopf}</div>
            ${zeilen}
        </div>`;
    }

    async function nachrichtSenden() {
        const feld = document.getElementById('chatText');
        const text = feld.value.trim();
        if (!text || !aktuelleUnterhaltung) return;

        feld.value = '';
        feld.style.height = 'auto';

        try {
            const { error } = await sb.from('nachrichten').insert({
                unterhaltung_id: aktuelleUnterhaltung.id,
                absender_id: aktuellerNutzer.id,
                text: text
            });
            if (error) throw error;
            await nachrichtenLaden();
        } catch (e) {
            alert('Nachricht konnte nicht gesendet werden: ' + (e.message || e));
            feld.value = text;
        }
    }

    async function nachrichtLoeschen(id) {
        if (!confirm('Nachricht löschen?')) return;
        try {
            const { error } = await sb.from('nachrichten').delete().eq('id', id);
            if (error) throw error;
            await nachrichtenLaden();
        } catch (e) {
            alert('Löschen fehlgeschlagen: ' + (e.message || e));
        }
    }

    function chatFeldAnpassen(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    // Neue Nachrichten sofort empfangen
    function kanalVerbinden(unterhaltungId) {
        if (chatKanal) { sb.removeChannel(chatKanal); chatKanal = null; }
        chatKanal = sb.channel('chat-' + unterhaltungId)
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'nachrichten',
                  filter: 'unterhaltung_id=eq.' + unterhaltungId },
                () => { nachrichtenLaden(); })
            .subscribe();
    }

    function kanalTrennen() {
        if (chatKanal) { sb.removeChannel(chatKanal); chatKanal = null; }
    }

    // ---------- Dienstverlauf teilen ----------
    // Stellt die zu teilenden Punkte zusammen: nur Beginn, Pausen, Ende
    function teilPunkteBauen() {
        const d = aktuelleDetails;
        if (!d) return null;

        const punkte = [];

        if (d.beginn) {
            punkte.push({
                art: 'Beginn', zeit: d.beginn,
                ort: d.beginn_ort || d.beginn_ort_kuerzel || '',
                linie: d.beginn_linie, umlauf: d.beginn_umlauf,
                nach: d.beginn_nach || d.beginn_nach_kuerzel || ''
            });
        }

        (d.pausen || []).forEach(p => {
            punkte.push({
                art: 'Pause', zeit: p.von, bis: p.bis,
                ort: p.ort || p.ort_kuerzel || ''
            });
        });

        if (d.ende) {
            punkte.push({
                art: 'Ende', zeit: d.ende, folgetag: d.ende_folgetag === true,
                ort: d.ende_ort || d.ende_ort_kuerzel || '',
                linie: d.ende_linie, umlauf: d.ende_umlauf,
                nach: d.ende_nach || d.ende_nach_kuerzel || ''
            });
        }

        return {
            datum: document.getElementById('datum').value,
            dienstnummer: document.getElementById('dienstnummer').value.trim(),
            punkte: punkte
        };
    }

    // Dieselben Daten als reiner Text, z. B. für WhatsApp
    function teilTextBauen(d) {
        const symbol = { 'Beginn': '▶️', 'Pause': '☕', 'Ende': '⏹️' };
        let text = `Dienst${d.dienstnummer ? ' ' + d.dienstnummer : ''}`;
        if (d.datum) text += ' · ' + d.datum.split('-').reverse().join('.');
        text += '\n';

        d.punkte.forEach(p => {
            const zeit = p.art === 'Pause'
                ? `${p.zeit || ''}–${p.bis || ''}`
                : `${p.zeit || ''}${p.folgetag ? '+' : ''}`;
            text += `\n${symbol[p.art] || '•'} ${p.art} ${zeit}\n`;
            if (p.ort) text += `${p.ort}\n`;

            const teile = [];
            if (p.linie) teile.push('Linie ' + p.linie);
            if (p.umlauf) teile.push('Umlauf ' + p.umlauf);
            let zusatz = teile.join(' · ');
            if (p.nach) zusatz += (zusatz ? ' → ' : '→ ') + p.nach;
            if (zusatz) text += zusatz + '\n';
        });

        return text.trim();
    }

    // In den App-Chat teilen
    function verlaufTeilenStarten() {
        const d = teilPunkteBauen();
        if (!d || !d.punkte.length) { alert('Kein Dienstverlauf vorhanden.'); return; }
        zuTeilenderDienst = d;

        wechselSeite('chat');
        setTimeout(() => {
            alert('Wähle jetzt das Gespräch aus, in dem du den Dienstverlauf teilen möchtest.');
        }, 100);
    }

    // Über WhatsApp und andere Apps teilen
    async function verlaufExternTeilen() {
        const d = teilPunkteBauen();
        if (!d || !d.punkte.length) { alert('Kein Dienstverlauf vorhanden.'); return; }
        const text = teilTextBauen(d);

        try {
            if (navigator.share) {
                await navigator.share({ title: 'Dienstverlauf', text: text });
                return;
            }
            await navigator.clipboard.writeText(text);
            alert('Dienstverlauf in die Zwischenablage kopiert – jetzt in WhatsApp einfügen.');
        } catch (e) {
            if (e && e.name === 'AbortError') return;   // Teilen abgebrochen
            alert('Teilen nicht möglich. Text:\n\n' + text);
        }
    }

    async function dienstTeilenIn(unterhaltungId) {
        try {
            const { error } = await sb.from('nachrichten').insert({
                unterhaltung_id: unterhaltungId,
                absender_id: aktuellerNutzer.id,
                dienst: zuTeilenderDienst
            });
            if (error) throw error;
            zuTeilenderDienst = null;
            await chatListeLaden();
            chatOeffnen(unterhaltungId);
        } catch (e) {
            alert('Teilen fehlgeschlagen: ' + (e.message || e));
        }
    }

    // ============================================================
    //  PROFIL (Pflichtangaben nach der Anmeldung)
    // ============================================================
    async function profilSpeichern() {
        const vorname = document.getElementById('profVorname').value.trim();
        const nachname = document.getElementById('profNachname').value.trim();
        const betriebshof = document.getElementById('profBetriebshof').value.trim();

        if (!vorname || !nachname || !betriebshof) {
            zeigeMeldung('profMeldung', 'Bitte alle drei Felder ausfüllen.', 'fehler');
            return;
        }

        try {
            const { error } = await sb.from('profile').update({
                vorname, nachname, betriebshof,
                anzeigename: vorname + ' ' + nachname,
                profil_fertig: true
            }).eq('id', aktuellerNutzer.id);
            if (error) throw error;

            aktuellesProfil.vorname = vorname;
            aktuellesProfil.nachname = nachname;
            aktuellesProfil.betriebshof = betriebshof;
            aktuellesProfil.anzeigename = vorname + ' ' + nachname;
            aktuellesProfil.profil_fertig = true;

            document.getElementById('topbarUser').innerHTML =
                aktuellesProfil.anzeigename +
                (aktuellesProfil.rolle === 'admin' ? '<span class="badge admin">Admin</span>' : '');

            // Weiter zur Verdienst-Einrichtung oder in die App
            if (!ein.eingerichtetAm) wechselSeite('einrichten');
            else wechselSeite('start');
        } catch (e) {
            zeigeMeldung('profMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    // ============================================================
    //  HALTESTELLEN (Kürzel -> voller Name, gemeinsam für alle)
    // ============================================================
    let haltestellen = {};   // { KUERZEL: name }

    async function haltestellenLaden() {
        if (!sb) return;
        try {
            const { data, error } = await sb.from('haltestellen').select('kuerzel, name');
            if (error) throw error;
            haltestellen = {};
            (data || []).forEach(h => { haltestellen[h.kuerzel.toUpperCase()] = h.name; });
        } catch (e) {
            console.warn('Haltestellen konnten nicht geladen werden:', e);
        }
    }

    // Schlägt einen Namen zum Kürzel nach
    function haltestelleName(kuerzel) {
        if (!kuerzel) return '';
        return haltestellen[String(kuerzel).trim().toUpperCase()] || '';
    }

    // Lernt neue Paare aus einem gescannten Dienstzettel
    async function haltestellenLernen(details) {
        if (!sb || !details) return;
        const paare = {};
        const merke = (kuerzel, name) => {
            const k = (kuerzel || '').trim().toUpperCase();
            const n = (name || '').trim();
            // Nur echte Paare: Name muss sich vom Kürzel unterscheiden
            if (k && n && k !== n.toUpperCase() && !haltestellen[k]) paare[k] = n;
        };

        merke(details.beginn_ort_kuerzel, details.beginn_ort);
        merke(details.beginn_nach_kuerzel, details.beginn_nach);
        merke(details.ende_ort_kuerzel, details.ende_ort);
        merke(details.ende_nach_kuerzel, details.ende_nach);
        (details.wechsel || []).forEach(w => {
            merke(w.ort_kuerzel, w.ort); merke(w.nach_kuerzel, w.nach);
        });
        (details.pausen || []).forEach(p => {
            merke(p.ort_kuerzel, p.ort);
            merke(p.davor_ort_kuerzel, p.davor_ort);
            merke(p.danach_nach_kuerzel, p.danach_nach);
        });
        (details.fahrten || []).forEach(f => {
            merke(f.von_kuerzel, f.von); merke(f.nach_kuerzel, f.nach);
        });

        const neue = Object.keys(paare);
        if (!neue.length) return;

        try {
            const zeilen = neue.map(k => ({ kuerzel: k, name: paare[k], automatisch: true }));
            await sb.from('haltestellen').upsert(zeilen, { onConflict: 'kuerzel', ignoreDuplicates: true });
            neue.forEach(k => { haltestellen[k] = paare[k]; });
        } catch (e) {
            console.warn('Haltestellen konnten nicht gelernt werden:', e);
        }
    }

    // Ergänzt fehlende Namen aus der Liste
    function detailsMitHaltestellen(d) {
        if (!d) return d;
        const fuelle = (obj, kuerzelFeld, nameFeld) => {
            const k = obj[kuerzelFeld];
            if (k && !(obj[nameFeld] || '').trim()) {
                const name = haltestelleName(k);
                if (name) obj[nameFeld] = name;
            }
        };
        fuelle(d, 'beginn_ort_kuerzel', 'beginn_ort');
        fuelle(d, 'beginn_nach_kuerzel', 'beginn_nach');
        fuelle(d, 'ende_ort_kuerzel', 'ende_ort');
        fuelle(d, 'ende_nach_kuerzel', 'ende_nach');
        (d.wechsel || []).forEach(w => {
            fuelle(w, 'ort_kuerzel', 'ort'); fuelle(w, 'nach_kuerzel', 'nach');
        });
        (d.pausen || []).forEach(p => {
            fuelle(p, 'ort_kuerzel', 'ort');
            fuelle(p, 'davor_ort_kuerzel', 'davor_ort');
            fuelle(p, 'danach_nach_kuerzel', 'danach_nach');
        });
        (d.fahrten || []).forEach(f => {
            fuelle(f, 'von_kuerzel', 'von'); fuelle(f, 'nach_kuerzel', 'nach');
        });
        return d;
    }

    async function haltestelleSpeichern() {
        const kuerzel = document.getElementById('hsKuerzel').value.trim().toUpperCase();
        const name = document.getElementById('hsName').value.trim();
        if (!kuerzel || !name) {
            zeigeMeldung('hsMeldung', 'Bitte Kürzel und Namen eingeben.', 'fehler');
            return;
        }
        try {
            const { error } = await sb.from('haltestellen')
                .upsert({ kuerzel, name, automatisch: false, aktualisiert_am: new Date().toISOString() },
                        { onConflict: 'kuerzel' });
            if (error) throw error;
            haltestellen[kuerzel] = name;
            document.getElementById('hsKuerzel').value = '';
            document.getElementById('hsName').value = '';
            zeigeMeldung('hsMeldung', kuerzel + ' gespeichert.', 'ok');
            haltestellenRendern();
        } catch (e) {
            zeigeMeldung('hsMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    async function haltestelleLoeschen(kuerzel) {
        if (!confirm('Haltestelle ' + kuerzel + ' löschen?')) return;
        try {
            const { error } = await sb.from('haltestellen').delete().eq('kuerzel', kuerzel);
            if (error) throw error;
            delete haltestellen[kuerzel];
            haltestellenRendern();
        } catch (e) {
            zeigeMeldung('hsMeldung', 'Fehler: ' + (e.message || e), 'fehler');
        }
    }

    function haltestelleBearbeiten(kuerzel) {
        document.getElementById('hsKuerzel').value = kuerzel;
        document.getElementById('hsName').value = haltestellen[kuerzel] || '';
        document.getElementById('hsKuerzel').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function haltestellenRendern() {
        const el = document.getElementById('hsListe');
        if (!el) return;
        const suche = (document.getElementById('hsSuche').value || '').toLowerCase();

        const treffer = Object.keys(haltestellen).sort().filter(k =>
            !suche || k.toLowerCase().includes(suche) || haltestellen[k].toLowerCase().includes(suche));

        if (!treffer.length) {
            el.innerHTML = '<p class="auth-hinweis">' +
                (suche ? 'Nichts gefunden.' : 'Noch keine Haltestellen gespeichert.') + '</p>';
            return;
        }

        el.innerHTML = `<p class="auth-hinweis">${treffer.length} von ${Object.keys(haltestellen).length} Einträgen</p>` +
            treffer.map(k => `
            <div class="result-item">
                <span class="label"><b>${k}</b><br><small>${haltestellen[k]}</small></span>
                <span style="display:flex; gap:6px;">
                    <button class="btn-secondary stapel-btn" onclick="haltestelleBearbeiten('${k}')">${ICONS.pencil}</button>
                    <button class="btn-danger stapel-btn" onclick="haltestelleLoeschen('${k}')">${ICONS.trash}</button>
                </span>
            </div>`).join('');
    }

    // ============================================================
    //  TV-N BERLIN – ENTGELTTABELLE
    //  Quelle: TV-N Berlin, gültig 01.06.2026 – 31.12.2026
    //  Monatsentgelte (Vollzeit 39 Std./Woche laut Tabelle)
    // ============================================================
    const TARIF_GUELTIG = '01.06.2026 – 31.12.2026';
    const TARIF_TABELLE = {
        1:  [2585.18, 2622.87, 2660.54, 2698.21, 2735.91, 2773.61],
        2:  [2784.50, 2828.53, 2872.55, 2916.62, 2960.62, 3004.62],
        3:  [2939.24, 2988.66, 3038.07, 3087.47, 3136.84, 3186.21],
        4:  [3002.93, 3054.36, 3105.80, 3157.24, 3217.98, 3278.72],
        5:  [3130.06, 3183.41, 3236.79, 3290.12, 3365.46, 3440.80],
        6:  [3314.21, 3374.17, 3434.11, 3494.04, 3554.00, 3613.96],
        7:  [3541.27, 3608.44, 3675.62, 3742.82, 3810.02, 3877.22],
        8:  [3763.52, 3838.69, 3913.87, 3989.03, 4064.18, 4139.33],
        9:  [4016.02, 4099.95, 4183.88, 4267.82, 4351.73, 4435.64],
        10: [4264.57, 4356.82, 4449.13, 4541.41, 4633.70, 4725.99],
        11: [4592.37, 4695.12, 4797.86, 4900.59, 5003.36, 5106.13],
        12: [4952.94, 5067.22, 5181.47, 5295.72, 5418.56, 5541.40],
        13: [5353.36, 5490.44, 5627.49, 5764.59, 5901.65, 6038.71],
        14: [5824.59, 5976.69, 6128.78, 6280.93, 6433.02, 6585.11],
        15: [6342.92, 6511.59, 6680.23, 6848.90, 7017.55, 7186.20]
    };

    function tarifBetrag(eg, stufe) {
        const zeile = TARIF_TABELLE[Number(eg)];
        if (!zeile) return null;
        return zeile[Number(stufe) - 1] || null;
    }

    // Füllt ein Paar Auswahllisten mit Gruppen und Stufen
    function tarifListenFuellen(egId, stufeId) {
        const egEl = document.getElementById(egId);
        const stEl = document.getElementById(stufeId);
        if (!egEl || !stEl || egEl.options.length) return;

        egEl.innerHTML = '<option value="">– wählen –</option>' +
            Object.keys(TARIF_TABELLE).map(g => `<option value="${g}">EG ${g}</option>`).join('');
        stEl.innerHTML = '<option value="">– wählen –</option>' +
            [1, 2, 3, 4, 5, 6].map(st => `<option value="${st}">Stufe ${st}</option>`).join('');
    }

    // Vorschau auf der Einrichtungsseite
    function tarifVorschau() {
        const eg = document.getElementById('einrEG').value;
        const stufe = document.getElementById('einrStufe').value;
        const box = document.getElementById('tarifVorschauBox');
        const betrag = tarifBetrag(eg, stufe);

        if (!betrag) { box.style.display = 'none'; return; }
        box.style.display = 'block';
        document.getElementById('tarifBetrag').innerText = euroText(betrag);
        document.getElementById('tarifGueltig').innerText =
            `TV-N Berlin, EG ${eg} Stufe ${stufe} · gültig ${TARIF_GUELTIG}`;
    }

    function tarifUebernehmen() {
        const eg = document.getElementById('einrEG').value;
        const stufe = document.getElementById('einrStufe').value;
        const betrag = tarifBetrag(eg, stufe);

        if (!betrag) {
            zeigeMeldung('einrMeldung', 'Bitte Entgeltgruppe und Stufe wählen.', 'fehler');
            return;
        }

        ein.monatsentgelt = betrag;
        ein.entgeltgruppe = eg;
        ein.stufe = stufe;
        ein.tarifStand = TARIF_GUELTIG;
        ein.eingerichtetAm = new Date().toISOString();
        einstellungenSpeichernLocal();

        einstellungenLaden();
        wechselSeite('einstellungen');
        zeigeMeldung('einMeldung',
            'Monatsentgelt übernommen. Bitte jetzt noch Wochenstunden, Zulagen und das Zuschlagsentgelt von deiner Abrechnung eintragen.', 'ok');
    }

    function einrichtungUeberspringen() {
        ein.eingerichtetAm = new Date().toISOString();
        einstellungenSpeichernLocal();
        wechselSeite('start');
    }

    // Auswahl in den Einstellungen -> Monatsentgelt setzen
    function tarifInEinstellungen() {
        const eg = document.getElementById('setEG').value;
        const stufe = document.getElementById('setStufe').value;
        const betrag = tarifBetrag(eg, stufe);
        const hinweis = document.getElementById('tarifHinweis');

        if (!betrag) { hinweis.innerText = ''; return; }
        document.getElementById('einMonatsentgelt').value = betrag.toFixed(2);
        hinweis.innerText = `Aus der TV-N-Berlin-Tabelle: EG ${eg} Stufe ${stufe} · gültig ${TARIF_GUELTIG}`;
    }

    // Einmal im Jahr an die Tarifrunde erinnern
    function tarifErinnerungPruefen() {
        if (!ein.eingerichtetAm) return;
        const letzte = new Date(ein.eingerichtetAm);
        const tage = (Date.now() - letzte.getTime()) / 86400000;
        if (tage < 365) return;

        const box = document.getElementById('tarifErinnerung');
        if (box) box.style.display = 'block';
    }

    function tarifErinnerungErledigt() {
        ein.eingerichtetAm = new Date().toISOString();
        einstellungenSpeichernLocal();
        document.getElementById('tarifErinnerung').style.display = 'none';
        wechselSeite('einstellungen');
    }

    // ============================================================
    //  STARTSEITE
    // ============================================================
    function startseiteAktualisieren() {
        const heute = new Date();
        const pad = (n) => n < 10 ? '0' + n : n;
        const monatPraefix = `${heute.getFullYear()}-${pad(heute.getMonth() + 1)}`;
        const heuteStr = `${monatPraefix}-${pad(heute.getDate())}`;

        let anzahl = 0, minuten = 0, zuschlaege = 0, zeitkonto = 0;
        Object.keys(gespeicherteSchichten).forEach(k => {
            const sch = gespeicherteSchichten[k];
            if (k.startsWith(monatPraefix)) {
                anzahl++;
                minuten += sch.nettoMinuten || 0;
                zuschlaege += sch.zuschlagSumme || 0;
            }
            if (k.startsWith(String(heute.getFullYear()))) {
                zeitkonto += sch.mehrarbeitMinuten || 0;
            }
        });

        const fest = ein.monatsentgelt + ein.unregelm + ein.dienstklasse;
        const setze = (id, t) => { const el = document.getElementById(id); if (el) el.innerText = t; };

        setze('startMonatName', MONATSNAMEN[heute.getMonth()] + ' ' + heute.getFullYear());
        setze('startBrutto', euroText(fest + zuschlaege));
        setze('startSchichten', anzahl + (anzahl === 1 ? ' Dienst' : ' Dienste'));
        setze('startStunden', minuten ? zeitText(minuten) : '–');
        setze('startZuschlaege', euroText(zuschlaege));
        setze('startZeitkonto', zeitkonto ? zeitText(zeitkonto) : '–');

        // Nächster Dienst ab heute
        const kommende = Object.keys(gespeicherteSchichten).filter(k => k >= heuteStr).sort();
        const box = document.getElementById('startNaechsterBox');
        if (kommende.length) {
            const k = kommende[0];
            const sch = gespeicherteSchichten[k];
            const d = sch.details || {};
            const ort = (n, kz) => (n || kz || '').trim();
            const wann = k === heuteStr ? 'Heute' : k.split('-').reverse().join('.');
            document.getElementById('startNaechster').innerHTML = `
                <div class="result-item klickbar-karte" onclick="dienstVerlaufOeffnen('${k}')">
                    <span class="label">${wann}${sch.dienstnummer ? ' · ' + sch.dienstnummer : ''}` +
                    (d.beginn_ort ? `<br><small style="opacity:.75;">Start: ${ort(d.beginn_ort, d.beginn_ort_kuerzel)}</small>` : '') +
                    `</span>
                    <span style="text-align:right;">${sch.startStr || ''} – ${sch.endeStr || ''}<br>
                    <small style="opacity:.7;">Verlauf ansehen ›</small></span>
                </div>`;
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }

        // "Aktuelle Fahrt" nur anbieten, wenn heute ein Dienst ansteht
        const afBtn = document.getElementById('startAktuelleFahrtBtn');
        if (afBtn) afBtn.style.display = gespeicherteSchichten[heuteStr] ? 'flex' : 'none';

        // Nächster Feiertag
        let naechster = null;
        for (let jahr = heute.getFullYear(); jahr <= heute.getFullYear() + 1 && !naechster; jahr++) {
            const liste = feiertageFuer(jahr, 'BE');
            Object.keys(liste).sort().forEach(datum => {
                if (!naechster && datum >= heuteStr) naechster = { datum, ...liste[datum] };
            });
        }
        setze('startFeiertag', naechster
            ? `${naechster.name} · ${naechster.datum.split('-').reverse().join('.')}`
            : '–');
    }

    // Öffnet den Dienstverlauf eines bestimmten Tages
    function dienstVerlaufOeffnen(datumStr) {
        const sch = gespeicherteSchichten[datumStr];
        if (!sch) return;
        klickKalenderTag(datumStr);
        wechselSeite('verlauf');
    }

    // ============================================================
    //  AKTUELLE FAHRT — großformatige Ansicht für den Fahrtbericht bei
    //  jeder Wende: zeigt Soll-Ankunft/-Abfahrt am Punkt, an dem der
    //  Fahrer gerade ist oder der als nächstes kommt. Aktualisiert sich
    //  selbst und hält den Bildschirm wach (Vorstufe zu einer späteren
    //  Sperrbildschirm-Benachrichtigung in der nativen App).
    // ============================================================
    let aktuelleFahrtPunkte = [];
    let aktuelleFahrtDetails = null;          // die Dienst-Details, aus denen aktuelleFahrtPunkte gebaut wurden
    let aktuelleFahrtManuellerIndex = null;   // null = automatisch anhand der Uhrzeit
    let aktuelleFahrtIntervall = null;
    let aktuelleFahrtWakeLock = null;

    // Heutiges Datum als "YYYY-MM-DD" in der lokalen Zeitzone (nicht UTC).
    function heutigesDatumStr() {
        const heute = new Date();
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${heute.getFullYear()}-${pad(heute.getMonth() + 1)}-${pad(heute.getDate())}`;
    }

    // Zeigt den vollen Haltestellennamen: Klartext, sonst aus der gelernten
    // Haltestellen-Liste, sonst als letzten Rückfall das rohe Kürzel.
    function aktuelleFahrtOrtName(name, kuerzel) {
        const n = (name || '').trim();
        if (n) return n;
        const gelernt = haltestelleName(kuerzel);
        if (gelernt) return gelernt;
        return (kuerzel || '').trim();
    }

    const AKTUELLEFAHRT_STANDTYPEN = ['wenden', 'ruest', 'rüst', 'nb', 'uewegz', 'üwegz'];

    // Zeigt den Punkt-Typ als kurzes, lesbares Label auf der Karte
    // (die KI schreibt manche Typen nur als ASCII, z. B. "Ruest").
    const AKTUELLEFAHRT_LABEL_ANZEIGE = { ruest: 'Rüst', uewegz: 'ÜWegZ', weiter: 'Weiter' };
    function aktuelleFahrtLabelText(label) {
        const key = (label || '').toLowerCase();
        return AKTUELLEFAHRT_LABEL_ANZEIGE[key] || label || '';
    }

    // Manche Dienstzettel listen Wenden als eigene Tabellenzeile (Typ
    // "Wenden"/"NB"/...), andere reihen die Linienfahrten einfach direkt
    // aneinander und die KI übernimmt dann keine eigene Zeile für die
    // Standzeit dazwischen. Diese Funktion ergänzt genau solche fehlenden
    // Wenden: jede Lücke zwischen zwei aufeinanderfolgenden Linienfahrten
    // an DERSELBEN Haltestelle wird als zusätzliche "Wenden"-Zeile
    // eingefügt, sofern dafür nicht schon eine eigene Zeile existiert.
    // Wird sowohl von der Dienstverlauf- ("Alle Fahrten") als auch der
    // "Aktuelle Fahrt"-Ansicht genutzt, damit beide dieselben Wenden zeigen.
    // "pausen" (optional) sind die separat gespeicherten Pausen des Dienstes -
    // liegt eine echte Pause bereits in der Lücke, wird dort nichts
    // Zusätzliches eingefügt (sonst Überlappung mit den Pausen-Punkten).
    function fahrtenMitAbgeleitetenWenden(fahrten, beginnZeit, pausen) {
        const beginnMin = (() => {
            if (!beginnZeit) return 0;
            const [h, m] = beginnZeit.split(':').map(Number);
            return isNaN(h) ? 0 : h * 60 + m;
        })();
        const sortWert = (zeit) => {
            if (!zeit) return null;
            const [h, m] = String(zeit).split(':').map(Number);
            if (isNaN(h)) return null;
            let wert = h * 60 + m;
            if (wert < beginnMin) wert += 24 * 60;   // Folgetag
            return wert;
        };

        const liste = (fahrten || []).slice()
            .filter(f => sortWert(f.von_zeit) !== null)
            .sort((a, b) => sortWert(a.von_zeit) - sortWert(b.von_zeit));
        const explizit = new Set();
        liste.forEach(f => {
            if (!f.linie) explizit.add(`${f.von_zeit}|${f.bis_zeit}|${f.von_kuerzel || f.von || ''}`);
        });

        // Nur WIRKLICH direkt benachbarte Zeilen (nichts dazwischen) prüfen -
        // liegt bereits eine eigene Zeile (Rüst, Pause, ...) in der Lücke,
        // sind die direkten Nachbarn keine zwei Linienfahrten mehr und es
        // wird nichts Zusätzliches eingefügt (sonst Überlappung).
        const zusaetzliche = [];
        for (let i = 0; i < liste.length - 1; i++) {
            const aktuell = liste[i], naechste = liste[i + 1];
            if (!aktuell.linie || !naechste.linie) continue;
            const gleicherOrt = aktuell.nach_kuerzel && naechste.von_kuerzel &&
                aktuell.nach_kuerzel === naechste.von_kuerzel;
            if (!gleicherOrt) continue;
            const ankunftSort = sortWert(aktuell.bis_zeit), abfahrtSort = sortWert(naechste.von_zeit);
            if (ankunftSort === null || abfahrtSort === null || abfahrtSort <= ankunftSort) continue;
            const schluessel = `${aktuell.bis_zeit}|${naechste.von_zeit}|${aktuell.nach_kuerzel}`;
            if (explizit.has(schluessel)) continue;   // schon als eigene Zeile erfasst
            const durchPauseAbgedeckt = (pausen || []).some(p => {
                if ((p.ort_kuerzel || '') !== aktuell.nach_kuerzel) return false;
                const pVon = sortWert(p.von), pBis = sortWert(p.bis);
                return pVon !== null && pBis !== null && pVon < abfahrtSort && pBis > ankunftSort;
            });
            if (durchPauseAbgedeckt) continue;   // Luecke ist bereits eine erfasste Pause
            zusaetzliche.push({
                von_zeit: aktuell.bis_zeit, von: aktuell.nach, von_kuerzel: aktuell.nach_kuerzel,
                bis_zeit: naechste.von_zeit, nach: aktuell.nach, nach_kuerzel: aktuell.nach_kuerzel,
                typ: 'Wenden', linie: '', umlauf: aktuell.umlauf || naechste.umlauf || '',
                abgeleitet: true
            });
        }

        return liste.concat(zusaetzliche).sort((a, b) => (sortWert(a.von_zeit) ?? 0) - (sortWert(b.von_zeit) ?? 0));
    }

    // Baut aus den Dienst-Details eine chronologische Liste aller Punkte,
    // für die ein Fahrtbericht anfällt: Wendezeiten, Pausen, Übernahme/
    // Übergabe - jeweils mit Ankunft/Abfahrt und der anschließenden Fahrt.
    function aktuelleFahrtPunkteBauen(d) {
        if (!d) return [];
        const beginnMin = (() => {
            if (!d.beginn) return 0;
            const [h, m] = d.beginn.split(':').map(Number);
            return isNaN(h) ? 0 : h * 60 + m;
        })();
        const sortWert = (zeit) => {
            if (!zeit) return null;
            const [h, m] = String(zeit).split(':').map(Number);
            if (isNaN(h)) return null;
            let wert = h * 60 + m;
            if (wert < beginnMin) wert += 24 * 60;   // Folgetag
            return wert;
        };

        const fahrten = fahrtenMitAbgeleitetenWenden(d.fahrten, d.beginn, d.pausen);

        // Nächste Linienfahrt ab einem Zeitpunkt (für die "danach"-Zeile bei
        // Standzeilen, die selbst keine Linie tragen).
        const naechsteLinie = (abZeit) => {
            const ab = sortWert(abZeit);
            if (ab === null) return null;
            return fahrten.find(f => f.linie && sortWert(f.von_zeit) !== null && sortWert(f.von_zeit) >= ab) || null;
        };

        const punkte = [];

        // Dienstbeginn/-ende: reine Abfahrt- bzw. Ankunft-Punkte am Rand.
        // Faellt der Dienstbeginn zeitlich und oertlich genau mit der ersten
        // Uebernahme zusammen (Dienst beginnt direkt durch Uebernahme eines
        // fremden Wagens), reicht der Uebernahme-Punkt allein - sonst
        // erscheinen zwei fast identische Punkte fuer denselben Moment.
        const beginnIstUebernahme = (d.wechsel || []).some(w =>
            (w.art || '').toLowerCase().startsWith('uebernahme') &&
            w.zeit === d.beginn && w.ort_kuerzel && w.ort_kuerzel === d.beginn_ort_kuerzel);
        if (d.beginn && !beginnIstUebernahme) {
            punkte.push({
                ankunft: null, abfahrt: d.beginn,
                ort: aktuelleFahrtOrtName(d.beginn_ort, d.beginn_ort_kuerzel),
                ortKuerzel: d.beginn_ort_kuerzel || '',
                sort: sortWert(d.beginn),
                folgeLinie: d.beginn_linie || '', folgeUmlauf: d.beginn_umlauf || '',
                folgeNach: aktuelleFahrtOrtName(d.beginn_nach, d.beginn_nach_kuerzel),
                label: 'Dienstbeginn'
            });
        }
        if (d.ende) {
            punkte.push({
                ankunft: d.ende, abfahrt: null,
                ort: aktuelleFahrtOrtName(d.ende_ort, d.ende_ort_kuerzel),
                ortKuerzel: d.ende_ort_kuerzel || '',
                sort: sortWert(d.ende),
                label: 'Dienstende'
            });
        }

        // Einsetzen/Aussetzen: eigener Punkt an dem Rand, an dem der Fahrer
        // in den bzw. aus dem Fahrgastbetrieb wechselt (Betriebshof).
        fahrten.forEach(f => {
            const typ = (f.typ || '').toLowerCase();
            if (typ === 'e') {
                punkte.push({
                    ankunft: null, abfahrt: f.von_zeit || null,
                    ort: aktuelleFahrtOrtName(f.von, f.von_kuerzel),
                    ortKuerzel: f.von_kuerzel || '',
                    sort: sortWert(f.von_zeit),
                    folgeLinie: f.linie || '', folgeUmlauf: f.umlauf || '',
                    folgeNach: aktuelleFahrtOrtName(f.nach, f.nach_kuerzel),
                    label: 'Einsetzen'
                });
            } else if (typ === 'a') {
                punkte.push({
                    ankunft: f.bis_zeit || null, abfahrt: null,
                    ort: aktuelleFahrtOrtName(f.nach, f.nach_kuerzel),
                    ortKuerzel: f.nach_kuerzel || '',
                    sort: sortWert(f.bis_zeit),
                    label: 'Aussetzen'
                });
            }
        });

        (d.wechsel || []).forEach(w => {
            const art = (w.art || '').toLowerCase();
            if (art.startsWith('uebernahme')) {
                // "w.abfahrt" ist in der Praxis unzuverlässig (bezieht sich
                // teils auf die Fahrt des ABGEBENDEN Fahrers, nicht auf die
                // eigene Abfahrt) - stattdessen die tatsächlich folgende
                // Linienfahrt ab dem Übernahme-Zeitpunkt nachschlagen.
                const folgeAbfahrt = naechsteLinie(w.zeit);
                punkte.push({
                    ankunft: w.zeit || null,
                    abfahrt: (folgeAbfahrt && folgeAbfahrt.von_zeit) || w.abfahrt || null,
                    ort: aktuelleFahrtOrtName(w.ort, w.ort_kuerzel),
                    ortKuerzel: w.ort_kuerzel || '',
                    sort: sortWert(w.zeit),
                    folgeLinie: w.linie, folgeUmlauf: w.umlauf,
                    folgeNach: aktuelleFahrtOrtName(w.nach, w.nach_kuerzel),
                    label: 'Übernahme'
                });
            } else if (art.startsWith('uebergabe')) {
                punkte.push({
                    ankunft: null, abfahrt: w.zeit || null,
                    ort: aktuelleFahrtOrtName(w.ort, w.ort_kuerzel),
                    ortKuerzel: w.ort_kuerzel || '',
                    sort: sortWert(w.zeit),
                    label: 'Übergabe'
                });
            }
        });

        (d.pausen || []).forEach(p => {
            const folge = naechsteLinie(p.bis);
            punkte.push({
                ankunft: p.von || null, abfahrt: p.bis || null,
                ort: aktuelleFahrtOrtName(p.ort, p.ort_kuerzel),
                ortKuerzel: p.ort_kuerzel || '',
                sort: sortWert(p.von),
                folgeLinie: p.danach_linie || (folge && folge.linie) || '',
                folgeUmlauf: p.danach_umlauf || (folge && folge.umlauf) || '',
                folgeNach: aktuelleFahrtOrtName(p.danach_nach, p.danach_nach_kuerzel) ||
                    (folge ? aktuelleFahrtOrtName(folge.nach, folge.nach_kuerzel) : ''),
                label: p.art === 'BEZPAU' ? 'Bezahlte Pause' : 'Pause'
            });
        });

        // Standzeiten (Wenden/Rüst/NB/ÜWegZ) - eigene Zeilen der KI plus die
        // von fahrtenMitAbgeleitetenWenden ergänzten Lücken zwischen zwei
        // Linienfahrten an derselben Haltestelle.
        fahrten.forEach(f => {
            if (f.linie) return;   // normale Linienfahrt - kein Report-Punkt
            const typ = (f.typ || '').toLowerCase();
            if (!AKTUELLEFAHRT_STANDTYPEN.includes(typ)) return;
            const folge = naechsteLinie(f.bis_zeit);
            const ortBis = (f.nach_kuerzel && f.nach_kuerzel !== f.von_kuerzel)
                ? aktuelleFahrtOrtName(f.nach, f.nach_kuerzel) : '';
            punkte.push({
                ankunft: f.von_zeit || null, abfahrt: f.bis_zeit || null,
                ort: aktuelleFahrtOrtName(f.von, f.von_kuerzel) + (ortBis ? ' → ' + ortBis : ''),
                ortKuerzel: f.von_kuerzel || '',
                sort: sortWert(f.von_zeit),
                folgeLinie: (folge && folge.linie) || '', folgeUmlauf: (folge && folge.umlauf) || '',
                folgeNach: folge ? aktuelleFahrtOrtName(folge.nach, folge.nach_kuerzel) : '',
                label: f.typ || 'Wenden'
            });
        });

        // Übergänge OHNE Wartezeit zwischen zwei direkt aufeinanderfolgenden
        // Fahrten an derselben Haltestelle (z. B. Einsetzen endet genau da,
        // wo die erste Linienfahrt beginnt) - fahrtenMitAbgeleitetenWenden
        // ergänzt nur echte Standzeiten, diese 0-Minuten-Übergänge fehlen
        // sonst als Punkt.
        const linienfolge = fahrten.filter(f => f.linie && sortWert(f.von_zeit) !== null)
            .sort((a, b) => sortWert(a.von_zeit) - sortWert(b.von_zeit));
        for (let i = 0; i < linienfolge.length - 1; i++) {
            const aktuell = linienfolge[i], naechste = linienfolge[i + 1];
            if (!aktuell.nach_kuerzel || aktuell.nach_kuerzel !== naechste.von_kuerzel) continue;
            const ankunftSort = sortWert(aktuell.bis_zeit), abfahrtSort = sortWert(naechste.von_zeit);
            if (ankunftSort === null || abfahrtSort !== ankunftSort) continue;   // nur echte 0-Minuten-Übergänge
            punkte.push({
                ankunft: aktuell.bis_zeit, abfahrt: naechste.von_zeit,
                ort: aktuelleFahrtOrtName(aktuell.nach, aktuell.nach_kuerzel),
                ortKuerzel: aktuell.nach_kuerzel || '',
                sort: ankunftSort,
                folgeLinie: naechste.linie || '', folgeUmlauf: naechste.umlauf || '',
                folgeNach: aktuelleFahrtOrtName(naechste.nach, naechste.nach_kuerzel),
                label: 'Weiter'
            });
        }

        const sortiert = punkte.filter(p => p.sort !== null).sort((a, b) => a.sort - b.sort);
        return aktuelleFahrtPunkteZusammenfassen(sortiert);
    }

    // Fasst mehrere lückenlos aufeinanderfolgende Punkte an DERSELBEN
    // Haltestelle (z. B. Rüst, dann bezahlte, dann unbezahlte Pause direkt
    // hintereinander an einem Ort) zu einem einzigen Ankunft/Abfahrt-Punkt
    // zusammen - für den Fahrtbericht zählt nur die erste Ankunft und die
    // letzte Abfahrt an diesem Ort, nicht die Unterteilung dazwischen.
    // Grenzpunkte bleiben immer eigenständig, auch wenn sie lückenlos an
    // einen Wenden-/Pausen-Punkt anschließen - sie markieren einen fürs
    // Melden wichtigen Wechsel (Dienstbeginn/-ende, Betriebshof, Fahrerwechsel).
    const AKTUELLEFAHRT_GRENZPUNKTE = ['Dienstbeginn', 'Dienstende', 'Einsetzen', 'Aussetzen', 'Übernahme', 'Übergabe'];

    function aktuelleFahrtPunkteZusammenfassen(punkte) {
        const ergebnis = [];
        punkte.forEach(p => {
            const letzter = ergebnis[ergebnis.length - 1];
            const gleicherOrt = letzter && letzter.ortKuerzel && p.ortKuerzel &&
                letzter.ortKuerzel === p.ortKuerzel;
            const nahtlos = letzter && letzter.abfahrt && p.ankunft && letzter.abfahrt === p.ankunft;
            const grenzpunkt = AKTUELLEFAHRT_GRENZPUNKTE.includes(letzter && letzter.label) ||
                AKTUELLEFAHRT_GRENZPUNKTE.includes(p.label);
            if (letzter && gleicherOrt && nahtlos && !grenzpunkt) {
                if (p.abfahrt) letzter.abfahrt = p.abfahrt;
                if (p.folgeLinie) {
                    letzter.folgeLinie = p.folgeLinie;
                    letzter.folgeUmlauf = p.folgeUmlauf;
                    letzter.folgeNach = p.folgeNach;
                }
            } else {
                ergebnis.push({ ...p });
            }
        });
        return ergebnis;
    }

    // Minuten seit Mitternacht "jetzt", mit derselben Folgetag-Logik wie
    // aktuelleFahrtPunkteBauen (vor Dienstbeginn liegende Zeiten zählen als
    // Folgetag), damit der Vergleich mit den Punkt-Sortierwerten passt.
    function aktuelleFahrtJetztMinuten(d) {
        const beginnMin = (() => {
            if (!d || !d.beginn) return 0;
            const [h, m] = d.beginn.split(':').map(Number);
            return isNaN(h) ? 0 : h * 60 + m;
        })();
        const jetzt = new Date();
        let min = jetzt.getHours() * 60 + jetzt.getMinutes();
        if (min < beginnMin) min += 24 * 60;
        return min;
    }

    function aktuelleFahrtAutoIndex(punkte, d) {
        if (!punkte.length) return 0;
        const jetzt = aktuelleFahrtJetztMinuten(d);
        let index = 0;
        for (let i = 0; i < punkte.length; i++) {
            if (punkte[i].sort <= jetzt) index = i; else break;
        }
        return index;
    }

    function aktuelleFahrtZeile(text) {
        return text ? `<div class="af-zeile">${sicher(text)}</div>` : '';
    }

    function aktuelleFahrtRendern() {
        const box = document.getElementById('afInhalt');
        if (!box) return;

        if (!aktuelleFahrtPunkte.length) {
            box.innerHTML = '<p class="auth-hinweis">Für den heutigen Dienst wurden keine Wende-, Pausen- oder Übergabepunkte erkannt.</p>';
            return;
        }

        const istManuell = aktuelleFahrtManuellerIndex !== null;
        const index = Math.max(0, Math.min(aktuelleFahrtPunkte.length - 1,
            istManuell ? aktuelleFahrtManuellerIndex : aktuelleFahrtAutoIndex(aktuelleFahrtPunkte, aktuelleFahrtDetails)));
        const p = aktuelleFahrtPunkte[index];

        const folgeTeile = [];
        if (p.folgeLinie) folgeTeile.push('Linie ' + p.folgeLinie);
        if (p.folgeUmlauf) folgeTeile.push('Umlauf ' + p.folgeUmlauf);
        let folge = folgeTeile.join(' · ');
        if (p.folgeNach) folge += (folge ? ' → ' : '→ ') + p.folgeNach;

        // Eigene Dienstnummer nur auf den ersten beiden Punkten des Tages
        // zeigen (Übernahme/Dienstbeginn + erste Endhaltestelle) - dort
        // steht sie auch auf dem Fahrtbericht.
        const eigeneDienstnummer = aktuelleFahrtDetails && aktuelleFahrtDetails.dienstnummer;
        const zeigeDienstnummer = index < 2 && eigeneDienstnummer;
        const kopfzeile = aktuelleFahrtLabelText(p.label) +
            (zeigeDienstnummer ? ' · Dienst ' + eigeneDienstnummer : '');

        box.innerHTML = `
            <div class="af-gross">
                ${kopfzeile ? `<div class="af-label">${sicher(kopfzeile)}</div>` : ''}
                <div class="af-ort">${sicher(p.ort || '–')}</div>
                ${(p.ankunft && p.ankunft === p.abfahrt) ? `<div class="af-zeit">Abfahrt <b>${sicher(p.abfahrt)}</b></div>` : `
                ${p.ankunft ? `<div class="af-zeit">Ankunft <b>${sicher(p.ankunft)}</b></div>` : ''}
                ${p.abfahrt ? `<div class="af-zeit">Abfahrt <b>${sicher(p.abfahrt)}</b></div>` : ''}`}
                ${folge ? `<div class="af-folge">danach: ${sicher(folge)}</div>` : ''}
            </div>
            <div class="af-nav">
                <button class="btn-secondary" onclick="aktuelleFahrtZurueck()" ${index === 0 ? 'disabled' : ''}>‹ Zurück</button>
                ${istManuell ? '<button class="btn-secondary" onclick="aktuelleFahrtJetzt()">Jetzt</button>' : ''}
                <button class="btn-secondary" onclick="aktuelleFahrtWeiter()" ${index === aktuelleFahrtPunkte.length - 1 ? 'disabled' : ''}>Weiter ›</button>
            </div>`;

        const naechste = aktuelleFahrtPunkte.slice(index + 1, index + 3);
        const naechsteEl = document.getElementById('afNaechste');
        if (naechsteEl) {
            naechsteEl.innerHTML = naechste.length ? naechste.map(np => `
                <div class="af-kleine-karte">
                    <span class="af-kleine-zeit">${sicher(np.ankunft || np.abfahrt || '')}</span>
                    <span class="af-kleine-ort">${sicher(np.ort || '–')}</span>
                </div>`).join('') : '';
        }
    }

    function aktuelleFahrtWeiter() {
        const aktuell = aktuelleFahrtManuellerIndex !== null
            ? aktuelleFahrtManuellerIndex : aktuelleFahrtAutoIndex(aktuelleFahrtPunkte, aktuelleFahrtDetails);
        aktuelleFahrtManuellerIndex = Math.min(aktuelleFahrtPunkte.length - 1, aktuell + 1);
        aktuelleFahrtRendern();
    }
    function aktuelleFahrtZurueck() {
        const aktuell = aktuelleFahrtManuellerIndex !== null
            ? aktuelleFahrtManuellerIndex : aktuelleFahrtAutoIndex(aktuelleFahrtPunkte, aktuelleFahrtDetails);
        aktuelleFahrtManuellerIndex = Math.max(0, aktuell - 1);
        aktuelleFahrtRendern();
    }
    function aktuelleFahrtJetzt() {
        aktuelleFahrtManuellerIndex = null;
        aktuelleFahrtRendern();
    }

    // Von der Startseite: heutigen Dienst laden und die Ansicht öffnen.
    function aktuelleFahrtOeffnen() {
        const heuteStr = heutigesDatumStr();
        const sch = gespeicherteSchichten[heuteStr];
        if (!sch) return;
        aktuelleFahrtManuellerIndex = null;
        aktuelleFahrtDetails = sch.details || null;
        aktuelleFahrtPunkte = aktuelleFahrtPunkteBauen(aktuelleFahrtDetails);
        wechselSeite('aktuellefahrt');
    }

    function aktuelleFahrtIntervallStarten() {
        aktuelleFahrtIntervallStoppen();
        aktuelleFahrtIntervall = setInterval(aktuelleFahrtRendern, 15000);
    }
    function aktuelleFahrtIntervallStoppen() {
        if (aktuelleFahrtIntervall) { clearInterval(aktuelleFahrtIntervall); aktuelleFahrtIntervall = null; }
    }

    async function aktuelleFahrtWakeLockAnfordern() {
        if (!('wakeLock' in navigator)) return;
        try {
            aktuelleFahrtWakeLock = await navigator.wakeLock.request('screen');
        } catch (e) {
            console.warn('Wake Lock nicht verfügbar:', e);
        }
    }
    function aktuelleFahrtWakeLockFreigeben() {
        if (aktuelleFahrtWakeLock) { aktuelleFahrtWakeLock.release().catch(() => {}); aktuelleFahrtWakeLock = null; }
    }
    // Wake Lock wird vom Browser automatisch freigegeben, sobald die Seite
    // in den Hintergrund geht - bei Rückkehr auf "Aktuelle Fahrt" erneut anfordern.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' &&
            document.getElementById('page-aktuellefahrt') &&
            document.getElementById('page-aktuellefahrt').classList.contains('active')) {
            aktuelleFahrtWakeLockAnfordern();
        }
    });

    // ---------- Native App via Capacitor ----------
    // Im normalen Browser/PWA gibt es kein window.Capacitor - dort bleiben
    // diese Funktionen wirkungslose No-Ops bzw. der bisherige Web-Weg greift.
    const AKTUELLEFAHRT_NOTIF_BASIS_ID = 84000;

    function capacitorAktiv() {
        return typeof window !== 'undefined' && !!window.Capacitor &&
            typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform();
    }

    // "Dienstzettel fotografieren oder auswählen": im Browser öffnet das
    // <label for="dienstplanBild"> wie gewohnt den Datei-Dialog des Systems
    // (der dort auch die Kamera anbietet). In der nativen App zeigt Capacitors
    // WebView bei einem einfachen <input type=file> aber nur den Galerie-
    // Picker ohne Kamera-Zugriff - dort wird stattdessen per @capacitor/camera
    // gefragt, ob fotografiert oder aus der Galerie gewählt werden soll.
    function dienstzettelLabelKlick(ev) {
        if (!capacitorAktiv()) return true;
        ev.preventDefault();
        document.getElementById('dzWahlOverlay').style.display = 'flex';
        return false;
    }

    // ereignis nur gesetzt, wenn per Klick auf den Hintergrund ausgelöst (wie hilfeSchliessen).
    async function dienstzettelWahl(wahl, ereignis) {
        if (ereignis && ereignis.target !== document.getElementById('dzWahlOverlay')) return;
        document.getElementById('dzWahlOverlay').style.display = 'none';
        if (wahl === 'abbrechen') return;
        if (wahl === 'galerie') { document.getElementById('dienstplanBild').click(); return; }

        try {
            const Camera = window.Capacitor.Plugins.Camera;
            const foto = await Camera.getPhoto({ resultType: 'uri', source: 'CAMERA', quality: 85 });
            const antwort = await fetch(foto.webPath);
            const blob = await antwort.blob();
            document.getElementById('stapelBox').style.display = 'none';
            starteAutomatischeAnalyse(blob);
        } catch (e) {
            if (e && /cancel/i.test(e.message || '')) return;   // Nutzer hat abgebrochen
            console.log('Kamera-Aufnahme fehlgeschlagen:', e);
            alert('Kamera konnte nicht geöffnet werden.');
        }
    }

    function blobZuBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const ergebnis = reader.result || '';
                const kommaIndex = ergebnis.indexOf(',');
                resolve(kommaIndex >= 0 ? ergebnis.slice(kommaIndex + 1) : ergebnis);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Datei speichern: im Browser wie bisher per Download-Link, in der nativen
    // App gibt es dafür keinen Download-Ordner - dort wird die Datei ins
    // App-eigene Cache-Verzeichnis geschrieben und direkt der native
    // Teilen-Dialog geöffnet (speichern/WhatsApp/Drucken uebernimmt der Nutzer dort).
    async function dateiSpeichernOderTeilen(dateiname, blob) {
        if (!capacitorAktiv()) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', dateiname);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }
        try {
            const Filesystem = window.Capacitor.Plugins.Filesystem;
            const Share = window.Capacitor.Plugins.Share;
            const base64 = await blobZuBase64(blob);
            const geschrieben = await Filesystem.writeFile({ path: dateiname, data: base64, directory: 'CACHE' });
            await Share.share({ title: dateiname, url: geschrieben.uri });
        } catch (e) {
            if (e && e.message === 'Share canceled') return;   // Nutzer hat den Teilen-Dialog abgebrochen
            console.log('Datei speichern/teilen fehlgeschlagen:', e);
            alert('Datei konnte nicht erstellt werden.');
        }
    }

    // Uhrzeit "HH:MM" auf den Kalendertag von "heuteStr" gelegt, plus die
    // Folgetag-Verschiebung aus p.sort (>= 24*60 bei Zeiten nach Mitternacht).
    function aktuelleFahrtAlsDatum(heuteStr, sortMinuten) {
        if (sortMinuten == null) return null;
        const [jahr, monat, tag] = heuteStr.split('-').map(Number);
        const d = new Date(jahr, monat - 1, tag, 0, 0, 0, 0);
        d.setMinutes(sortMinuten);
        return d;
    }

    async function aktuelleFahrtBenachrichtigungenPlanen(punkte, heuteStr) {
        if (!capacitorAktiv()) return;
        const LN = window.Capacitor.Plugins.LocalNotifications;
        try {
            const erlaubnis = await LN.checkPermissions();
            if (erlaubnis.display !== 'granted') {
                const angefragt = await LN.requestPermissions();
                if (angefragt.display !== 'granted') return;
            }

            // Vorherige Aktuelle-Fahrt-Benachrichtigungen verwerfen, bevor neu geplant wird
            // (z. B. nach manuellem Neu-Öffnen oder wenn sich die Auswertung geändert hat).
            const anstehend = await LN.getPending();
            const alteIds = (anstehend.notifications || [])
                .filter(n => n.id >= AKTUELLEFAHRT_NOTIF_BASIS_ID && n.id < AKTUELLEFAHRT_NOTIF_BASIS_ID + 1000)
                .map(n => ({ id: n.id }));
            if (alteIds.length) await LN.cancel({ notifications: alteIds });

            const jetzt = new Date();
            const notifications = [];
            let id = AKTUELLEFAHRT_NOTIF_BASIS_ID;
            punkte.forEach(p => {
                const wann = aktuelleFahrtAlsDatum(heuteStr, p.sort);
                if (!wann || wann.getTime() <= jetzt.getTime()) return;
                const zeitText = [p.ankunft ? 'Ankunft ' + p.ankunft : '', p.abfahrt ? 'Abfahrt ' + p.abfahrt : '']
                    .filter(Boolean).join(' · ');
                notifications.push({
                    id: id++,
                    title: aktuelleFahrtLabelText(p.label) + (p.ort ? ' · ' + p.ort : ''),
                    body: zeitText,
                    schedule: { at: wann }
                });
            });
            if (notifications.length) await LN.schedule({ notifications });
        } catch (e) { console.log('Benachrichtigungen planen fehlgeschlagen:', e); }
    }

    // ---------- App starten ----------
    // Verbindungsdaten des Supabase-Projekts (dürfen öffentlich sein –
    // der Zugriffsschutz passiert über die Regeln in der Datenbank).
    const SB_URL_STANDARD = 'https://ixbvmzvnubtccmwmxukv.supabase.co';
    const SB_KEY_STANDARD = 'sb_publishable_lYFhhVM7sitKYiDbBJWnUA_ytCQEMIh';

    function starteApp() {
        const url = localStorage.getItem('dienstplan_sb_url') || SB_URL_STANDARD;
        const key = localStorage.getItem('dienstplan_sb_key') || SB_KEY_STANDARD;
        if (!url || !key) {
            setzeAppSichtbarkeit('setup');
            return;
        }
        sb = supabase.createClient(url, key);
        nutzerLaden();
    }

    // ---------- Tabs ----------
    // Unterseiten ohne eigenen Tab: welcher Tab bleibt markiert?
    const TAB_ZUORDNUNG = {
        verlauf: 'mehr', liste: 'mehr', einstellungen: 'mehr', admin: 'mehr', wegstrecken: 'mehr'
    };

    function wechselSeite(seite) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        document.getElementById('page-' + seite).classList.add('active');

        const tab = document.getElementById('tab-' + (TAB_ZUORDNUNG[seite] || seite));
        if (tab) tab.classList.add('active');

        window.scrollTo(0, 0);

        if (seite === 'start') { startseiteAktualisieren(); hilfeAnzeigeAktualisieren(); }
        if (seite === 'kalender' || seite === 'statistik') renderCalendar();
        if (seite === 'admin') { adminDatenLaden(); scansLaden(); haltestellenRendern(); }
        if (seite === 'liste') listeRendern();
        if (seite === 'wegstrecken') wegstreckenRendern();
        if (seite === 'einstellungen') { einstellungenLaden(); hilfeAnzeigeAktualisieren(); }
        if (seite === 'chat') chatListeLaden();
        if (seite === 'kontakte' || seite === 'gruppe-neu') kontakteLaden();
        if (seite !== 'chatraum') kanalTrennen();

        if (seite === 'aktuellefahrt') {
            aktuelleFahrtRendern();
            aktuelleFahrtIntervallStarten();
            aktuelleFahrtWakeLockAnfordern();
            aktuelleFahrtBenachrichtigungenPlanen(aktuelleFahrtPunkte, heutigesDatumStr());
        } else {
            aktuelleFahrtIntervallStoppen();
            aktuelleFahrtWakeLockFreigeben();
        }
    }

    // ---------- Dark Mode ----------
    function darkModeIconAktualisieren(istDark) {
        const btn = document.getElementById('darkModeBtn');
        if (!btn) return;
        const mond = btn.querySelector('.icon-mond');
        const sonne = btn.querySelector('.icon-sonne');
        if (mond) mond.style.display = istDark ? 'none' : '';
        if (sonne) sonne.style.display = istDark ? '' : 'none';
    }
    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        const istDark = document.body.classList.contains('dark');
        localStorage.setItem('dienstplan_darkmode', istDark ? '1' : '0');
        darkModeIconAktualisieren(istDark);
    }
    if (localStorage.getItem('dienstplan_darkmode') === '1') {
        document.body.classList.add('dark');
    }
    darkModeIconAktualisieren(document.body.classList.contains('dark'));

    let letztesHochgeladenesBild = null; // merkt sich die Bild-DataURL für die manuelle Korrektur

    function ladeBildInCropper(dataUrl) {
        const image = document.getElementById('imageToCrop');
        const cropModal = document.getElementById('cropModal');

        image.src = dataUrl;
        cropModal.style.display = 'block';

        if (cropper) cropper.destroy();

        cropper = new Cropper(image, {
            viewMode: 1,
            autoCropArea: 0.35,
            movable: true,
            zoomable: true
        });
    }

    function oeffneCropperManuell() {
        if (!letztesHochgeladenesBild) return;
        ladeBildInCropper(letztesHochgeladenesBild);
    }

    // ---------- Automatische Dienstzettel-Analyse (positionsbasiert) ----------
    // Statt reinem Text-Regex: findet einzelne Label-WÖRTER ("Beginn", "Ende", ...) im Bild
    // per Fuzzy-Matching und liest den Wert gezielt aus der Zeile darunter aus, an der
    // gleichen horizontalen Position (Spalte). Das ist robuster bei mehrspaltigen Belegen,
    // bei denen mehrere Label nebeneinander in einer Zeile stehen (z.B. "Datum  Dienstnummer
    // Beginn  Ende") und ein reiner Zeilen- oder Text-Vergleich sonst durcheinanderkäme.

    function levenshteinDistanz(a, b) {
        const m = a.length, n = b.length;
        const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        for (let i = 0; i <= m; i++) d[i][0] = i;
        for (let j = 0; j <= n; j++) d[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const kosten = a[i - 1] === b[j - 1] ? 0 : 1;
                d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + kosten);
            }
        }
        return d[m][n];
    }

    function normalisiereLabelText(text) {
        return (text || '').toLowerCase().replace(/[^a-zäöüß]/g, '');
    }

    // Baut aus den von Tesseract gelieferten Zeilen eine flache Liste aller Wörter
    // inkl. Zeilenindex, damit wir sowohl wort- als auch zeilenweise suchen können.
    function sammleWoerterMitZeile(zeilen) {
        const alle = [];
        zeilen.forEach((zeile, zeilenIdx) => {
            (zeile.words || []).forEach(w => {
                if (w.text && w.text.trim()) alle.push({ text: w.text, bbox: w.bbox, zeilenIdx });
            });
        });
        return alle;
    }

    // Sucht das Wort (oder bei mehrteiligen Labels die Wortfolge), das einem Label am
    // ähnlichsten ist - toleriert OCR-Tippfehler wie "Begimn" statt "Beginn".
    function findeLabelWort(woerter, labelText) {
        const labelTeile = labelText.split(' ');
        let beste = null, besterScore = Infinity;

        for (let i = 0; i < woerter.length; i++) {
            if (i + labelTeile.length > woerter.length) continue;
            const kandidatWoerter = woerter.slice(i, i + labelTeile.length);
            // alle Teilwörter müssen in derselben Zeile stehen
            if (new Set(kandidatWoerter.map(w => w.zeilenIdx)).size > 1) continue;

            const kandidatText = normalisiereLabelText(kandidatWoerter.map(w => w.text).join(''));
            const nLabel = normalisiereLabelText(labelTeile.join(''));
            if (!kandidatText) continue;

            const dist = levenshteinDistanz(kandidatText, nLabel);
            const score = dist / Math.max(kandidatText.length, nLabel.length, 1);
            if (score < besterScore) {
                besterScore = score;
                const x0 = Math.min(...kandidatWoerter.map(w => w.bbox.x0));
                const x1 = Math.max(...kandidatWoerter.map(w => w.bbox.x1));
                const y0 = Math.min(...kandidatWoerter.map(w => w.bbox.y0));
                const y1 = Math.max(...kandidatWoerter.map(w => w.bbox.y1));
                beste = { zeilenIdx: kandidatWoerter[0].zeilenIdx, bbox: { x0, y0, x1, y1 } };
            }
        }
        return besterScore <= 0.34 ? beste : null;
    }

    // Sucht ausgehend von der Label-Position den passenden Wert: in den nächsten 1-3
    // Zeilen, an einer Wort-Position, die horizontal (x) mit dem Label überlappt.
    function findeWertZuLabel(zeilen, woerter, label, wertMuster) {
        const regex = new RegExp(wertMuster, 'i');
        const xToleranz = 70;

        for (let z = label.zeilenIdx + 1; z <= Math.min(zeilen.length - 1, label.zeilenIdx + 3); z++) {
            const woerterInZeile = woerter.filter(w => w.zeilenIdx === z);
            for (const w of woerterInZeile) {
                const ueberlapptHorizontal = w.bbox.x0 <= label.bbox.x1 + xToleranz &&
                                              w.bbox.x1 >= label.bbox.x0 - xToleranz;
                if (!ueberlapptHorizontal) continue;
                const match = w.text.match(regex);
                if (match) return match[0];
            }
        }
        return null;
    }

    function zeitNormalisieren(roh) {
        // "12.45" oder "12:45" -> "12:45"
        if (!roh) return null;
        const teile = roh.replace('.', ':').split(':');
        const h = teile[0].padStart(2, '0');
        const m = (teile[1] || '00').padStart(2, '0');
        return `${h}:${m}`;
    }

    function zeitZuMinuten(hhmm) {
        if (!hhmm) return null;
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    }


    // ============================================================
    //  MEHRERE DIENSTZETTEL AUF EINMAL
    // ============================================================
    let stapel = [];   // {datei, name, status, ergebnis, fehler}

    async function dateienVerarbeiten(input) {
        if (!input.files || !input.files.length) return;
        const dateien = Array.from(input.files);

        // Einzelne Datei: bisheriger Ablauf mit Formular-Befuellung
        if (dateien.length === 1) {
            document.getElementById('stapelBox').style.display = 'none';
            return starteAutomatischeAnalyse(dateien[0]);
        }

        stapel = dateien.map(d => ({ datei: d, name: d.name, status: 'wartet', ergebnis: null, fehler: null }));
        document.getElementById('stapelBox').style.display = 'block';
        document.getElementById('stapelSpeichern').style.display = 'none';
        stapelRendern();

        for (let i = 0; i < stapel.length; i++) {
            stapel[i].status = 'liest';
            stapelRendern();
            try {
                const dataUrl = await dateiAlsDataUrl(stapel[i].datei);
                const ergebnis = await kiErkennung(dataUrl);
                if (!ergebnis.datum || !ergebnis.beginn || !ergebnis.ende) {
                    throw new Error('Datum oder Zeiten nicht erkannt');
                }
                stapel[i].ergebnis = ergebnis;
                stapel[i].status = 'fertig';
            } catch (e) {
                stapel[i].status = 'fehler';
                stapel[i].fehler = e.message || String(e);
            }
            stapelRendern();
        }

        const fertige = stapel.filter(s => s.status === 'fertig').length;
        document.getElementById('stapelSpeichern').style.display = fertige ? 'block' : 'none';
        input.value = '';
    }

    function dateiAlsDataUrl(datei) {
        return new Promise((erfuellen, ablehnen) => {
            const leser = new FileReader();
            leser.onload = e => erfuellen(e.target.result);
            leser.onerror = () => ablehnen(new Error('Datei konnte nicht gelesen werden'));
            leser.readAsDataURL(datei);
        });
    }

    function stapelRendern() {
        const el = document.getElementById('stapelListe');
        el.innerHTML = stapel.map((s, i) => {
            const symbol = { wartet: ICONS.hourglass, liest: ICONS.robot, fertig: ICONS.check, fehler: ICONS.warning }[s.status];
            let text = s.name;
            if (s.status === 'liest') text = 'wird gelesen...';
            else if (s.status === 'fertig') {
                const e = s.ergebnis;
                text = `${e.datum.split('-').reverse().join('.')}` +
                       `${e.dienstnummer ? ' · ' + e.dienstnummer : ''} · ${e.beginn}–${e.ende}`;
            } else if (s.status === 'fehler') text = s.fehler;

            return `<div class="result-item">
                <span class="label">${symbol} ${text}</span>
                ${s.status === 'fertig'
                    ? `<button class="btn-secondary stapel-btn" onclick="stapelUebernehmen(${i})">Öffnen</button>` : ''}
            </div>`;
        }).join('');
    }

    // Einen Dienst aus dem Stapel ins Formular laden
    function stapelUebernehmen(i) {
        const e = stapel[i].ergebnis;
        if (!e) return;
        felderSetzen(e);
        if (e.kontrolle && aktuelleDetails) aktuelleDetails.kontrolle = e.kontrolle;
        berechneSchicht();
        document.getElementById('stapelBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Alle erkannten Dienste berechnen und in die Datenbank schreiben
    async function stapelAlleSpeichern() {
        if (!nurEigeneDatenPruefen()) return;
        const fertige = stapel.filter(s => s.status === 'fertig');
        if (!fertige.length) return;

        const knopf = document.getElementById('stapelSpeichern');
        knopf.disabled = true;
        knopf.innerHTML = 'Speichere...';

        let gespeichert = 0, fehlgeschlagen = 0;
        for (const eintrag of fertige) {
            try {
                felderSetzen(eintrag.ergebnis);
                if (eintrag.ergebnis.kontrolle && aktuelleDetails) {
                    aktuelleDetails.kontrolle = eintrag.ergebnis.kontrolle;
                }
                berechneSchicht();
                await schichtSpeichern(aktuellesBerechnetesErgebnis, true);
                gespeichert++;
            } catch (e) {
                console.error('Speichern fehlgeschlagen:', e);
                fehlgeschlagen++;
            }
        }

        knopf.disabled = false;
        knopf.innerHTML = `${ICONS.download} Alle speichern`;
        await schichtenLaden();
        alert(`✅ ${gespeichert} Dienste gespeichert.` +
              (fehlgeschlagen ? ` ${fehlgeschlagen} fehlgeschlagen.` : ''));
    }

    // ---------- KI-Erkennung über die Server-Funktion ----------
    // Das Bild geht an eine Supabase-Funktion, die es von Claude auslesen lässt.
    // Der API-Schlüssel liegt dort auf dem Server und ist hier nicht sichtbar.
    async function kiErkennung(dataUrl) {
        const komma = dataUrl.indexOf(',');
        const base64 = dataUrl.slice(komma + 1);
        const medienTyp = (dataUrl.match(/^data:(image\/[a-z+]+);/) || [])[1] || 'image/jpeg';

        const { data, error } = await sb.functions.invoke('dienstplan-lesen', {
            body: { bild_base64: base64, medien_typ: medienTyp }
        });

        // Nutzung mitzaehlen (stoert die Erkennung nicht, wenn es fehlschlaegt)
        const erfolgreich = !error && !(data && data.fehler);
        sb.from('scans').insert({ user_id: aktuellerNutzer.id, erfolg: erfolgreich })
          .then(() => {}, () => {});

        if (error) throw error;
        if (data && data.fehler) throw new Error(data.fehler);
        return data;
    }

    // Merkt sich die von der KI gelesenen Dienstdetails zur aktuellen Schicht
    let aktuelleDetails = null;

    // Zeigt den vollen Haltestellennamen; weicht das Kuerzel ab, steht es dahinter.
    function ortText(name, kuerzel) {
        const n = (name || '').trim();
        const k = (kuerzel || '').trim();
        if (!n && !k) return '';
        if (!n) return k;
        if (!k || n === k) return n;
        return `${n} <small style="opacity:.7;">(${k})</small>`;
    }

    // Baut einen Kurztext wie "Linie M46 · Umlauf 2 → Zoologischer Garten (ab 12:45)"
    function fahrtInfo(linie, umlauf, nach, nachKuerzel, abfahrt) {
        const teile = [];
        const l = (linie === 0 || linie) ? String(linie).trim() : '';
        const u = (umlauf === 0 || umlauf) ? String(umlauf).trim() : '';
        if (l) teile.push('Linie ' + l);
        if (u) teile.push('Umlauf ' + u);
        let text = teile.join(' · ');
        const ziel = ortText(nach, nachKuerzel);
        if (ziel) text += (text ? ' → ' : '→ ') + ziel;
        if (abfahrt) text += (text ? ' ' : '') + '(ab ' + abfahrt + ')';
        return text;
    }

    // Symbol je Wechsel-Art
    function wechselSymbol(art) {
        const a = (art || '').toLowerCase();
        if (a.startsWith('überg') || a.startsWith('uberg') || a.startsWith('übg')) return ICONS.handoverOut;
        if (a.startsWith('übern') || a.startsWith('ubern')) return ICONS.handoverIn;
        if (a.startsWith('aussetz')) return ICONS.stop;
        if (a.startsWith('einsetz')) return ICONS.busStop;
        if (a.startsWith('ankunft')) return ICONS.arrowDown;
        if (a.startsWith('abfahrt')) return ICONS.arrowUp;
        return ICONS.swap;
    }

    function detailsAnzeigen(d) {
        const box = document.getElementById('dienstDetails');
        const inhalt = document.getElementById('dienstDetailsInhalt');
        const leerEl = document.getElementById('verlaufLeer');
        aktuelleDetails = d;

        if (!d || (!d.beginn_ort && !d.ende_ort &&
                   !(d.wechsel || []).length && !(d.pausen || []).length)) {
            box.style.display = 'none';
            inhalt.innerHTML = '';
            if (leerEl) leerEl.style.display = 'block';
            return;
        }
        if (leerEl) leerEl.style.display = 'none';

        const farbKlasse = (art) => {
            const a = (art || '').toLowerCase();
            if (a.startsWith('übern') || a.startsWith('ubern') ||
                a.startsWith('überg') || a.startsWith('uberg') || a.startsWith('übg')) return 'verlauf-gruen';
            if (a.startsWith('aussetz') || a.startsWith('einsetz')) return 'verlauf-rot';
            if (a.startsWith('pause')) return 'verlauf-pause';
            return '';
        };

        // Uhrzeit in Minuten, für die Sortierung. Zeiten nach Mitternacht
        // (kleiner als der Dienstbeginn) kommen ans Ende.
        const beginnMin = (() => {
            if (!d.beginn) return 0;
            const [h, m] = d.beginn.split(':').map(Number);
            return h * 60 + m;
        })();
        const sortWert = (zeit) => {
            if (!zeit) return 99999;
            const [h, m] = String(zeit).split(':').map(Number);
            if (isNaN(h)) return 99999;
            let wert = h * 60 + m;
            if (wert < beginnMin) wert += 24 * 60;      // Folgetag
            return wert;
        };

        // --- Alle Punkte sammeln, dann chronologisch sortieren ---
        const punkte = [];

        if (d.beginn) {
            punkte.push({
                zeit: d.beginn, sort: sortWert(d.beginn) - 1,   // immer ganz vorn
                symbol: ICONS.play, titel: 'Dienstbeginn',
                haupt: `${d.beginn} · ${ortText(d.beginn_ort, d.beginn_ort_kuerzel)}`,
                unten: fahrtInfo(d.beginn_linie, d.beginn_umlauf, d.beginn_nach, d.beginn_nach_kuerzel, d.beginn_abfahrt),
                klasse: ''
            });
        }

        (d.wechsel || []).forEach(w => {
            punkte.push({
                zeit: w.zeit, sort: sortWert(w.zeit),
                schluessel: `${(w.art || '').toLowerCase()}|${w.zeit}`,
                symbol: wechselSymbol(w.art), titel: w.art || 'Wechsel',
                haupt: `${w.zeit || ''} · ${ortText(w.ort, w.ort_kuerzel)}` +
                       (w.von_dienst ? ` (Dienst ${w.von_dienst})` : ''),
                unten: fahrtInfo(w.linie, w.umlauf, w.nach, w.nach_kuerzel, w.abfahrt),
                klasse: farbKlasse(w.art)
            });
        });

        (d.pausen || []).forEach(p => {
            if (p.davor_art) {
                punkte.push({
                    zeit: p.davor_zeit, sort: sortWert(p.davor_zeit),
                    schluessel: `${p.davor_art.toLowerCase()}|${p.davor_zeit}`,
                    symbol: wechselSymbol(p.davor_art), titel: p.davor_art,
                    haupt: `${p.davor_zeit || ''} · ${ortText(p.davor_ort, p.davor_ort_kuerzel)}`,
                    unten: fahrtInfo(p.davor_linie, p.davor_umlauf, null, null, null),
                    klasse: farbKlasse(p.davor_art)
                });
            }

            punkte.push({
                zeit: p.von, sort: sortWert(p.von),
                symbol: ICONS.coffee, titel: 'Pause',
                haupt: `${p.von || ''}–${p.bis || ''} · ${ortText(p.ort, p.ort_kuerzel)}`,
                unten: '', klasse: 'verlauf-pause'
            });

            const weiter = fahrtInfo(p.danach_linie, p.danach_umlauf, p.danach_nach, p.danach_nach_kuerzel, p.danach_abfahrt);
            if (weiter || p.danach_art) {
                punkte.push({
                    zeit: p.danach_abfahrt || p.bis,
                    sort: sortWert(p.danach_abfahrt || p.bis) + 0.5,   // direkt nach der Pause
                    schluessel: `${(p.danach_art || '').toLowerCase()}|${p.danach_abfahrt}`,
                    symbol: wechselSymbol(p.danach_art || 'abfahrt'),
                    titel: p.danach_art || 'Weiter nach Pause',
                    haupt: p.danach_abfahrt || '', unten: weiter,
                    klasse: farbKlasse(p.danach_art)
                });
            }
        });

        if (d.ende) {
            const folgetag = d.ende_folgetag ? ' <small style="opacity:.7;">(Folgetag)</small>' : '';
            punkte.push({
                zeit: d.ende, sort: 999998,                       // immer ganz hinten
                symbol: ICONS.stop, titel: 'Dienstende',
                haupt: `${d.ende}${folgetag} · ${ortText(d.ende_ort, d.ende_ort_kuerzel)}`,
                unten: fahrtInfo(d.ende_linie, d.ende_umlauf, d.ende_nach, d.ende_nach_kuerzel, null),
                klasse: ''
            });
        }

        // Doppelte Einträge entfernen (gleiche Art zur gleichen Zeit)
        const gesehen = new Set();
        const gefiltert = punkte.filter(pt => {
            if (!pt.schluessel) return true;
            if (gesehen.has(pt.schluessel)) return false;
            gesehen.add(pt.schluessel);
            return true;
        });

        gefiltert.sort((a, b) => a.sort - b.sort);

        // --- Ausgeben, Abschnitte durch kräftige Linie trennen ---
        // Ein neuer Abschnitt beginnt bei jeder Pause und beim Dienstende.
        let html = '';
        gefiltert.forEach((pt, i) => {
            const neuerAbschnitt = i > 0 &&
                (pt.titel === 'Pause' || pt.titel === 'Dienstende' ||
                 gefiltert[i - 1].titel === 'Pause');
            if (neuerAbschnitt) html += '<div class="verlauf-trenner"></div>';

            html += `<div class="result-item verlauf-zeile ${pt.klasse}">` +
                    `<span class="label">${pt.symbol} ${pt.titel}</span>` +
                    `<span style="text-align:right;">${pt.haupt}` +
                    (pt.unten ? `<br><small style="opacity:.85;">${pt.unten}</small>` : '') +
                    `</span></div>`;
        });

        const alleFahrten = fahrtenMitAbgeleitetenWenden(d.fahrten, d.beginn, d.pausen);
        if (alleFahrten.length) {
            const reihen = alleFahrten.map(f =>
                `<div class="result-item" style="font-size:.82rem;">
                    <span class="label">${f.von_zeit || ''} ${ortText(f.von, f.von_kuerzel)}${f.typ ? ' <small style="opacity:.6;">' + f.typ + '</small>' : ''}</span>
                    <span style="text-align:right;">${fahrtInfo(f.linie, f.umlauf, f.nach, f.nach_kuerzel, null)}</span>
                 </div>`).join('');
            html += `<details style="margin-top:14px;">
                        <summary style="cursor:pointer; font-weight:600; font-size:.85rem; display:flex; align-items:center; gap:6px;">
                            ${ICONS.bus} Alle Fahrten (${alleFahrten.length})
                        </summary>${reihen}</details>`;
        }

        inhalt.innerHTML = html;
        box.style.display = html ? 'block' : 'none';

        const titelEl = document.getElementById('verlaufTitel');
        if (titelEl) {
            const dat = document.getElementById('datum').value;
            const nr = document.getElementById('dienstnummer').value.trim();
            titelEl.innerText = 'Dienstverlauf' +
                (nr ? ' · ' + nr : '') +
                (dat ? ' · ' + dat.split('-').reverse().join('.') : '');
        }
    }

    // Nimmt "15:37", "00:29+", "9:05" und macht daraus "15:37" / "00:29" / "09:05"
    function zeitBereinigen(wert) {
        if (wert === null || wert === undefined) return '';
        const treffer = String(wert).replace('+', '').trim().match(/^(\d{1,2}):(\d{2})/);
        if (!treffer) return '';
        return treffer[1].padStart(2, '0') + ':' + treffer[2];
    }

    function felderSetzen(ergebnis) {
        const gefunden = [];
        if (ergebnis.datum && /^\d{4}-\d{2}-\d{2}$/.test(ergebnis.datum)) {
            document.getElementById('datum').value = ergebnis.datum;
            gefunden.push('Datum');
        }
        const beginn = zeitBereinigen(ergebnis.beginn);
        if (beginn) {
            document.getElementById('start').value = beginn;
            gefunden.push('Beginn');
        }
        const ende = zeitBereinigen(ergebnis.ende);
        if (ende) {
            document.getElementById('ende').value = ende;
            gefunden.push('Ende');
        }
        if (ergebnis.pausenregel) {
            const auswahl = document.getElementById('pausenregel');
            const regel = String(ergebnis.pausenregel).toLowerCase();
            if (regel.startsWith('b')) auswahl.value = 'B30';
            else if (regel.includes('sechst')) auswahl.value = 'sechste';
            else if (regel.includes('res')) auswahl.value = 'reserve';
            gefunden.push('Pausenregel');
        }

        // Pausen aus dem Dienstzettel in die Liste uebernehmen (bezahlt UND unbezahlt)
        pausenEintraege = (ergebnis.pausen || [])
            .filter(p => p.von && p.bis)
            .map(p => ({
                von: p.von, bis: p.bis,
                unbezahlt: Number(p.unbezahlt_minuten) || 0,
                gearbeitet: 0,
                art: String(p.art || '').toUpperCase() === 'BEZPAU' ? 'BEZPAU' : 'UNBPAU'
            }));

        if (!pausenEintraege.length && Number(ergebnis.pause_minuten) > 0) {
            document.getElementById('pause').value = Number(ergebnis.pause_minuten);
        }
        pausenregelGeaendert();
        if (pausenEintraege.length) gefunden.push('Pausen');
        if (gefunden.includes('Datum')) feiertagPruefen();

        if (ergebnis.dienstnummer) {
            document.getElementById('dienstnummer').value = ergebnis.dienstnummer;
        }
        detailsMitHaltestellen(ergebnis);
        detailsAnzeigen(ergebnis);
        if (aktuelleDetails && ergebnis.kontrolle) aktuelleDetails.kontrolle = ergebnis.kontrolle;
        haltestellenLernen(ergebnis);

        return gefunden;
    }

    async function starteAutomatischeAnalyse(file) {
        if (!file) return;
        const statusEl = document.getElementById('statusText');
        const btnKorrigieren = document.getElementById('btnManuellKorrigieren');

        const reader = new FileReader();
        reader.onload = async function (e) {
            letztesHochgeladenesBild = e.target.result;
            statusEl.style.color = "#2563eb";
            statusEl.innerText = "🤖 KI liest den Dienstzettel...";

            // 1. Versuch: KI-Erkennung
            try {
                const ergebnis = await kiErkennung(letztesHochgeladenesBild);
                const gefunden = felderSetzen(ergebnis);

                btnKorrigieren.style.display = 'block';

                if (gefunden.length >= 3) {
                    const dienst = ergebnis.dienstnummer ? ` (Dienst ${ergebnis.dienstnummer})` : '';
                    if (ergebnis.sicher === false) {
                        statusEl.style.color = "#d97706";
                        statusEl.innerText = `⚠️ Erkannt${dienst}, aber die KI war sich unsicher. Bitte die Werte genau prüfen.`;
                    } else {
                        statusEl.style.color = "#047857";
                        statusEl.innerText = `✅ KI hat erkannt: ${gefunden.join(', ')}${dienst}. Bitte prüfen und auf "Berechnen" tippen.`;
                    }
                    return;
                }
                statusEl.innerText = "⚠️ KI konnte nicht alles lesen – versuche lokale Erkennung...";
            } catch (fehler) {
                console.warn('KI-Erkennung fehlgeschlagen, nutze lokale Erkennung:', fehler);
                statusEl.innerText = "ℹ️ KI nicht erreichbar – nutze lokale Erkennung...";
            }

            // 2. Versuch: lokale Erkennung (Tesseract), falls die KI nichts liefert
            try {
                const result = await Tesseract.recognize(letztesHochgeladenesBild, 'deu');
                const zeilen = result.data.lines || [];
                const woerter = sammleWoerterMitZeile(zeilen);

                const zeitMuster = '[0-2]?\\d[:.][0-5]\\d';
                const datumMuster = '\\d{2}[./]\\d{2}[./]\\d{4}';

                const labelDatum = findeLabelWort(woerter, 'Datum');
                const labelBeginn = findeLabelWort(woerter, 'Beginn');
                const labelEnde = findeLabelWort(woerter, 'Ende');
                const labelPause = findeLabelWort(woerter, 'Unbezahlte Pausenzeit');

                const datumRoh = labelDatum ? findeWertZuLabel(zeilen, woerter, labelDatum, datumMuster) : null;
                const beginnRoh = labelBeginn ? findeWertZuLabel(zeilen, woerter, labelBeginn, zeitMuster) : null;
                const endeRoh = labelEnde ? findeWertZuLabel(zeilen, woerter, labelEnde, zeitMuster) : null;
                const pauseRoh = labelPause ? findeWertZuLabel(zeilen, woerter, labelPause, zeitMuster) : null;

                const ergebnis = {};
                if (datumRoh) {
                    const [tag, monat, jahr] = datumRoh.split(/[./]/);
                    ergebnis.datum = `${jahr}-${monat}-${tag}`;
                }
                ergebnis.beginn = zeitNormalisieren(beginnRoh);
                ergebnis.ende = zeitNormalisieren(endeRoh);
                if (pauseRoh) ergebnis.pause_minuten = zeitZuMinuten(zeitNormalisieren(pauseRoh));

                const gefunden = felderSetzen(ergebnis);
                btnKorrigieren.style.display = 'block';

                if (gefunden.length >= 3) {
                    statusEl.style.color = "#047857";
                    statusEl.innerText = `✅ Erkannt: ${gefunden.join(', ')}. Bitte prüfen und auf "Berechnen" tippen.`;
                } else if (gefunden.length > 0) {
                    statusEl.style.color = "#d97706";
                    statusEl.innerText = `⚠️ Nur teilweise erkannt (${gefunden.join(', ')}). Bitte fehlende Felder ergänzen.`;
                } else {
                    statusEl.style.color = "#d97706";
                    statusEl.innerText = "⚠️ Erkennung fehlgeschlagen. Bitte den Bereich manuell markieren.";
                    ladeBildInCropper(letztesHochgeladenesBild);
                }
            } catch (error) {
                console.error("OCR Fehler:", error);
                statusEl.style.color = "#b91c1c";
                statusEl.innerText = "❌ Fehler bei der Texterkennung. Bitte manuell markieren.";
                btnKorrigieren.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }

    async function scanneAusschnitt() {
        if (!cropper) return;
        const statusEl = document.getElementById('statusText');
        statusEl.innerText = "🔍 Lese Datum & Zeiten aus dem Ausschnitt...";

        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedDataUrl = croppedCanvas.toDataURL('image/png');

        try {
            const result = await Tesseract.recognize(croppedDataUrl, 'deu');
            const rawText = result.data.text;

            const datumMatch = rawText.match(/(\d{2})[./-](\d{2})[./-](\d{4})/);
            if (datumMatch) {
                const tag = datumMatch[1];
                const monat = datumMatch[2];
                const jahr = datumMatch[3];
                document.getElementById('datum').value = `${jahr}-${monat}-${tag}`;
            }

            const zeitMatches = [...rawText.matchAll(/\b([0-1]?[0-9]|2[0-3])[:.]([0-5][0-9])\b/g)];

            if (zeitMatches.length >= 2) {
                const startGefunden = zeitMatches[0][0].replace('.', ':').padStart(5, '0');
                const endeGefunden = zeitMatches[1][0].replace('.', ':').padStart(5, '0');

                document.getElementById('start').value = startGefunden;
                document.getElementById('ende').value = endeGefunden;

                statusEl.innerText = `✅ Erkannt: Datum ${datumMatch ? datumMatch[0] : 'manuell'} | ${startGefunden} - ${endeGefunden}`;
                statusEl.style.color = "#047857";
            } else {
                statusEl.innerText = "⚠️ Nicht alle Zeiten gefunden. Bitte Auswahlrahmen anpassen oder manuell eintragen.";
                statusEl.style.color = "#d97706";
            }

        } catch (error) {
            console.error("OCR Fehler:", error);
            statusEl.innerText = "❌ Fehler bei der Texterkennung.";
            statusEl.style.color = "#b91c1c";
        }
    }

    function berechneSchicht() {
        const datumStr = document.getElementById('datum').value;
        const startStr = document.getElementById('start').value;
        const endeStr = document.getElementById('ende').value;
        const endeIst = document.getElementById('endeTatsaechlich').value;
        const feiertagsArt = document.getElementById('feiertagsArt').value;
        const dienstnummer = document.getElementById('dienstnummer').value.trim();
        const pausenregel = document.getElementById('pausenregel').value;
        const details = aktuelleDetails;

        if (!datumStr || !startStr || !endeStr) return;

        const [jahr, monat, tag] = datumStr.split('-').map(Number);
        const baue = (zeitStr, referenz) => {
            const [h, m] = zeitStr.split(':').map(Number);
            const d = new Date(jahr, monat - 1, tag, h, m);
            if (referenz && d <= referenz) d.setDate(d.getDate() + 1);
            return d;
        };

        const dStart = baue(startStr);
        const dPlanEnde = baue(endeStr, dStart);
        const dEnde = endeIst ? baue(endeIst, dStart) : dPlanEnde;

        // --- Unbezahlte Fenster: immer am ENDE der jeweiligen Pause ---
        const unbezahlteFenster = [];
        let ausgefallenMin = 0;

        if (pausenregel !== 'reserve') {
            pausenEintraege.forEach(p => {
                if (!p.von || !p.bis) return;
                const von = baue(p.von, dStart);
                const bis = baue(p.bis, von);
                const dauer = (bis - von) / 60000;

                const unbezahlt = Math.max(0, Math.min(Number(p.unbezahlt) || 0, dauer));
                if (unbezahlt === 0) return;

                // Die unbezahlte Zeit liegt am ENDE der Pause.
                const unbezahltVon = new Date(bis.getTime() - unbezahlt * 60000);

                // Wurde ein Teil davon gearbeitet, sind das die ERSTEN Minuten
                // der unbezahlten Zeit -> sie zaehlen als Mehrarbeit.
                const gearbeitet = Math.max(0, Math.min(Number(p.gearbeitet) || 0, unbezahlt));
                ausgefallenMin += gearbeitet;

                const restVon = new Date(unbezahltVon.getTime() + gearbeitet * 60000);
                if (restVon < bis) {
                    unbezahlteFenster.push({ von: restVon, bis: bis });
                }
            });
        }

        const unbezahltMinuten = unbezahlteFenster
            .reduce((sum, f) => sum + (f.bis - f.von) / 60000, 0);

        // Pauschale Rueckfallebene, falls keine Pausenzeiten eingetragen sind
        const pauschalPause = parseFloat(document.getElementById('pause').value) || 0;
        const genau = pausenregel === 'reserve' || unbezahlteFenster.length > 0 || pauschalPause === 0;

        const istUnbezahlt = (z) => unbezahlteFenster.some(f => z >= f.von && z < f.bis);

        // --- Minutenweise durchgehen ---
        let gearbeitet = 0, nachtMin = 0, samstagMin = 0, sonntagMin = 0, feiertagMin = 0, sonderMin = 0;
        let mehrMin = 0;
        let curr = new Date(dStart.getTime());

        while (curr < dEnde) {
            if (genau && istUnbezahlt(curr)) { curr.setMinutes(curr.getMinutes() + 1); continue; }

            const wochentag = curr.getDay();
            const stunde = curr.getHours();
            const nachPlan = curr >= dPlanEnde;

            if (nachPlan) mehrMin++;
            else gearbeitet++;

            if (stunde >= ein.nachtVon || stunde < ein.nachtBis) nachtMin++;

            if (feiertagsArt === 'feiertag') feiertagMin++;
            else if (feiertagsArt === 'sonderstichtag') sonderMin++;
            else if (wochentag === 6 && stunde >= ein.samstagAb) samstagMin++;
            else if (wochentag === 0) sonntagMin++;

            curr.setMinutes(curr.getMinutes() + 1);
        }

        // Bei genauer Rechnung sind die in der Pause gearbeiteten Minuten schon
        // in "gearbeitet" enthalten (sie liegen nicht im unbezahlten Fenster).
        // Nur bei der pauschalen Rueckfallebene muessen sie ergaenzt werden.
        const nettoMinuten = genau
            ? gearbeitet
            : Math.max(0, (dPlanEnde - dStart) / 60000 - pauschalPause) + ausgefallenMin;
        const nettoStunden = nettoMinuten / 60;

        const mehrarbeitMinuten = mehrMin + ausgefallenMin;
        const mehrarbeitStunden = mehrarbeitMinuten / 60;

        // --- Zuschlaege auf das Zuschlagsentgelt (ZZ) ---
        const zuschlag = (min, prozent) => (min / 60) * ein.zz * (prozent / 100);

        const nachtEuro = zuschlag(nachtMin, ein.nacht);
        const samstagEuro = zuschlag(samstagMin, ein.samstag);
        const sonntagEuro = zuschlag(sonntagMin, ein.sonntag);
        const feiertagEuro = zuschlag(feiertagMin, ein.feiertag);
        const sonderEuro = zuschlag(sonderMin, ein.sonder);
        const mehrarbeitEuro = zuschlag(mehrarbeitMinuten, ein.mehrarbeit);

        const zuschlagSumme = nachtEuro + samstagEuro + sonntagEuro +
                              feiertagEuro + sonderEuro + mehrarbeitEuro;

        aktuellesBerechnetesErgebnis = {
            datumStr, startStr, endeStr, endeIst, feiertagsArt, dienstnummer, details,
            pausenregel, pausen: JSON.parse(JSON.stringify(pausenEintraege)),
            pauseMinuten: unbezahltMinuten,
            genau, nettoStunden, nettoMinuten, unbezahltMinuten,
            nachtMin, samstagMin, sonntagMin, feiertagMin, sonderMin,
            mehrarbeitMinuten, mehrarbeitStunden,
            nachtEuro, samstagEuro, sonntagEuro, feiertagEuro, sonderEuro, mehrarbeitEuro,
            zuschlagSumme, zz: ein.zz,
            dEnde
        };

        zeigeErgebnis(aktuellesBerechnetesErgebnis);
        pruefeGegenZettel(aktuellesBerechnetesErgebnis, details);

        document.getElementById('ausgabe').style.display = 'block';
        document.getElementById('btnDelete').style.display = gespeicherteSchichten[datumStr] ? 'block' : 'none';

        const verlaufHinweis = document.getElementById('verlaufHinweis');
        const hatVerlauf = aktuelleDetails && (aktuelleDetails.beginn_ort ||
            (aktuelleDetails.wechsel || []).length || (aktuelleDetails.pausen || []).length);
        if (verlaufHinweis) verlaufHinweis.style.display = hatVerlauf ? 'block' : 'none';
    }

    // Zeit als "8.42 Std. (8h 25m)"
    function zeitText(minuten) {
        const m = Math.round(minuten);
        return `${(m / 60).toFixed(2)} Std. (${Math.floor(m / 60)}h ${m % 60}m)`;
    }
    function euroText(betrag) {
        return betrag.toFixed(2).replace('.', ',') + ' €';
    }

    function zeigeErgebnis(r) {
        const setze = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

        setze('resNetto', zeitText(r.nettoMinuten));
        setze('resNacht', r.nachtMin ? `${zeitText(r.nachtMin)} → ${euroText(r.nachtEuro)}` : '–');
        setze('resSamstag', r.samstagMin ? `${zeitText(r.samstagMin)} → ${euroText(r.samstagEuro)}` : '–');
        setze('resSonntag', r.sonntagMin ? `${zeitText(r.sonntagMin)} → ${euroText(r.sonntagEuro)}` : '–');
        setze('resFeiertag', r.feiertagMin ? `${zeitText(r.feiertagMin)} → ${euroText(r.feiertagEuro)}` : '–');
        setze('resSonder', r.sonderMin ? `${zeitText(r.sonderMin)} → ${euroText(r.sonderEuro)}` : '–');
        setze('resMehrarbeit', r.mehrarbeitMinuten
            ? `${zeitText(r.mehrarbeitMinuten)} aufs Zeitkonto → ${euroText(r.mehrarbeitEuro)} Zuschlag`
            : '–');
        setze('resGesamt', `Zuschläge: ${euroText(r.zuschlagSumme)}`);
    }

    // Vergleich mit den Kopfwerten des Dienstzettels
    function pruefeGegenZettel(r, details) {
        const box = document.getElementById('kontrolleBox');
        if (!box) return;
        const k = details && details.kontrolle;
        if (!k) { box.style.display = 'none'; return; }

        const inMin = (hhmm) => {
            if (!hhmm) return null;
            const [h, m] = hhmm.split(':').map(Number);
            return isNaN(h) ? null : h * 60 + m;
        };
        const alsText = (min) =>
            `${Math.floor(min / 60).toString().padStart(2, '0')}:${Math.round(min % 60).toString().padStart(2, '0')}`;

        const abweichungen = [];

        const sollBezahlt = inMin(k.bezahlte_zeit);
        if (sollBezahlt !== null && Math.abs(sollBezahlt - r.nettoMinuten) > 1) {
            abweichungen.push(`Bezahlte Zeit: Zettel ${k.bezahlte_zeit}, berechnet ${alsText(r.nettoMinuten)}`);
        }

        const sollPause = inMin(k.unbezahlte_pausenzeit);
        if (sollPause !== null && Math.abs(sollPause - r.unbezahltMinuten) > 1) {
            abweichungen.push(`Unbezahlte Pause: Zettel ${k.unbezahlte_pausenzeit}, eingetragen ${alsText(r.unbezahltMinuten)}`);
        }

        (k.zuschlagsfelder || []).forEach(z => {
            const soll = inMin(z.wert);
            if (soll === null) return;
            const name = (z.name || '').toLowerCase();
            let ist = null;
            if (name.includes('nacht')) ist = r.nachtMin;
            else if (name.includes('samstag')) ist = r.samstagMin;
            else if (name.includes('sonntag')) ist = r.sonntagMin;
            else if (name.includes('feiertag')) ist = r.feiertagMin;
            if (ist !== null && Math.abs(soll - ist) > 1) {
                abweichungen.push(`${z.name}: Zettel ${z.wert}, berechnet ${alsText(ist)}`);
            }
        });

        box.style.display = 'block';
        if (!abweichungen.length) {
            box.className = 'kontrolle-box ok';
            box.innerHTML = `<span style="display:flex; align-items:flex-start; gap:6px;">${ICONS.check} Stimmt mit den Werten auf dem Dienstzettel überein.</span>`;
        } else {
            box.className = 'kontrolle-box abweichung';
            box.innerHTML = `<span style="display:flex; align-items:flex-start; gap:6px;">${ICONS.warning}<span>Abweichung zum Dienstzettel:<br>• ` + abweichungen.join('<br>• ') + '</span></span>';
        }
    }

    // Schreibt ein Berechnungsergebnis in die Datenbank
    async function schichtSpeichern(ergebnis, stillschweigend) {
        if (!ergebnis) return;
        const datumStr = ergebnis.datumStr;
        const { error } = await sb.from('schichten').upsert({
            user_id: aktuellerNutzer.id,
            datum: datumStr,
            daten: ergebnis,
            aktualisiert_am: new Date().toISOString()
        }, { onConflict: 'user_id,datum' });
        if (error) throw error;

        gespeicherteSchichten[datumStr] = ergebnis;
        if (!stillschweigend) renderCalendar();
    }

    async function speichereTagInKalender() {
        if (!aktuellesBerechnetesErgebnis) return;
        if (!nurEigeneDatenPruefen()) return;
        try {
            await schichtSpeichern(aktuellesBerechnetesErgebnis);
            alert(`✅ Schicht für den ${aktuellesBerechnetesErgebnis.datumStr} gespeichert!`);
        } catch (e) {
            alert('❌ Speichern fehlgeschlagen: ' + (e.message || e));
        }
    }

    async function loescheTagAusKalender() {
        if (!nurEigeneDatenPruefen()) return;
        const datumStr = document.getElementById('datum').value;
        if (!gespeicherteSchichten[datumStr]) return;

        try {
            const { error } = await sb.from('schichten').delete()
                .eq('user_id', aktuellerNutzer.id).eq('datum', datumStr);
            if (error) throw error;

            delete gespeicherteSchichten[datumStr];
            document.getElementById('ausgabe').style.display = 'none';
            renderCalendar();
            alert(`🗑️ Schicht für ${datumStr} gelöscht.`);
        } catch (e) {
            alert('❌ Löschen fehlgeschlagen: ' + (e.message || e));
        }
    }

    // Baut aus den Dienstdetails einen lesbaren Verlaufstext fuer Kalendereintraege
    function verlaufAlsText(res, nl) {
        const d = res.details;
        if (!d) return '';

        const ort = (name, kuerzel) => {
            const n = (name || '').trim(), k = (kuerzel || '').trim();
            if (!n && !k) return '';
            if (!n) return k;
            if (!k || n === k) return n;
            return `${n} (${k})`;
        };

        const info = (linie, umlauf, nach, nachK, abfahrt) => {
            const teile = [];
            const l = (linie === 0 || linie) ? String(linie).trim() : '';
            const u = (umlauf === 0 || umlauf) ? String(umlauf).trim() : '';
            if (l) teile.push('Linie ' + l);
            if (u) teile.push('Umlauf ' + u);
            let t = teile.join(' - ');
            const ziel = ort(nach, nachK);
            if (ziel) t += (t ? ' -> ' : '-> ') + ziel;
            if (abfahrt) t += (t ? ' ' : '') + '(ab ' + abfahrt + ')';
            return t;
        };

        let t = '';
        if (d.beginn_ort || d.beginn_ort_kuerzel) {
            const f = info(d.beginn_linie, d.beginn_umlauf, d.beginn_nach, d.beginn_nach_kuerzel, d.beginn_abfahrt);
            t += `${nl}\u25b6\ufe0f Beginn: ${res.startStr} ${ort(d.beginn_ort, d.beginn_ort_kuerzel)}` + (f ? ` | ${f}` : '');
        }
        (d.wechsel || []).forEach(w => {
            const f = info(w.linie, w.umlauf, w.nach, w.nach_kuerzel, w.abfahrt);
            t += `${nl}\u2022 ${w.art || 'Wechsel'}: ${w.zeit || ''} ${ort(w.ort, w.ort_kuerzel)}` +
                 `${w.von_dienst ? ' (Dienst ' + w.von_dienst + ')' : ''}` + (f ? ` | ${f}` : '');
        });
        const gezeigt = new Set((d.wechsel || []).map(w => `${w.art}|${w.zeit}`));
        (d.pausen || []).forEach(p => {
            if (p.davor_art && !gezeigt.has(`${p.davor_art}|${p.davor_zeit}`)) {
                const fv = info(p.davor_linie, p.davor_umlauf, null, null, null);
                t += `${nl}\u2022 ${p.davor_art}: ${p.davor_zeit || ''} ${ort(p.davor_ort, p.davor_ort_kuerzel)}` + (fv ? ` | ${fv}` : '');
            }
            t += `${nl}\u2615 Pause: ${p.von || ''}-${p.bis || ''} ${ort(p.ort, p.ort_kuerzel)}`;
            const f = info(p.danach_linie, p.danach_umlauf, p.danach_nach, p.danach_nach_kuerzel, p.danach_abfahrt);
            if (f) t += `${nl}   ${p.danach_art || 'danach'}: ${f}`;
        });
        if (d.ende_ort || d.ende_ort_kuerzel) {
            const f = info(d.ende_linie, d.ende_umlauf, d.ende_nach, d.ende_nach_kuerzel, null);
            t += `${nl}\u23f9\ufe0f Ende: ${res.endeStr}${d.ende_folgetag ? ' (Folgetag)' : ''} ${ort(d.ende_ort, d.ende_ort_kuerzel)}` + (f ? ` | ${f}` : '');
        }
        return t ? `${nl}${nl}\ud83d\uddfa\ufe0f DIENSTVERLAUF:${t}${nl}` : '';
    }

    function exportToGoogleCalendar() {
        if (!aktuellesBerechnetesErgebnis) return;
        const res = aktuellesBerechnetesErgebnis;
        const startIso = res.datumStr.replace(/-/g, '') + 'T' + res.startStr.replace(':', '') + '00';

        const pad = (n) => n < 10 ? '0' + n : n;
        const dEndeObj = new Date(res.dEnde);
        const endeIso = dEndeObj.getFullYear() +
            pad(dEndeObj.getMonth() + 1) +
            pad(dEndeObj.getDate()) + 'T' +
            pad(dEndeObj.getHours()) +
            pad(dEndeObj.getMinutes()) + '00';

        const title = encodeURIComponent(res.dienstnummer ? "Dienst " + res.dienstnummer : "Dienstschicht");
        const descriptionText =
            `📊 SCHICHT-AUSWERTUNG\n----------------------------------\n` +
            verlaufAlsText(res, '\n') +
            `⏱️ Bezahlte Arbeitszeit: ${zeitText(res.nettoMinuten)}\n` +
            `☕ Unbezahlte Pause: ${Math.round(res.unbezahltMinuten || 0)} Min.\n\n` +
            `💰 ZUSCHLÄGE:\n` +
            `- Nacht: ${euroText(res.nachtEuro || 0)}\n` +
            `- Samstag: ${euroText(res.samstagEuro || 0)}\n` +
            `- Sonntag: ${euroText(res.sonntagEuro || 0)}\n` +
            `- Feiertag: ${euroText(res.feiertagEuro || 0)}\n` +
            `- Sondertag: ${euroText(res.sonderEuro || 0)}\n` +
            `- Mehrarbeit: ${euroText(res.mehrarbeitEuro || 0)}\n` +
            `----------------------------------\n` +
            `💶 ZUSCHLÄGE GESAMT: ${euroText(res.zuschlagSumme || 0)}`;

        const details = encodeURIComponent(descriptionText);
        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endeIso}&details=${details}`;
        window.open(gCalUrl, '_blank');
    }

    function exportMonatIcs() {
        const jahr = aktuellesDatumAnzeige.getFullYear();
        const monat = aktuellesDatumAnzeige.getMonth() + 1;
        const pad = (n) => n < 10 ? '0' + n : n;
        const monatStr = `${jahr}-${pad(monat)}`;

        const relevanteSchichten = Object.keys(gespeicherteSchichten)
            .filter(key => key.startsWith(monatStr))
            .map(key => gespeicherteSchichten[key]);

        if (relevanteSchichten.length === 0) {
            alert("Für diesen Monat sind keine Schichten im Kalender gespeichert.");
            return;
        }

        let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Dienstplan Rechner//DE\r\n";

        relevanteSchichten.forEach(res => {
            const startIso = res.datumStr.replace(/-/g, '') + 'T' + res.startStr.replace(':', '') + '00';
            const dEndeObj = new Date(res.dEnde);
            const endeIso = dEndeObj.getFullYear() +
                pad(dEndeObj.getMonth() + 1) +
                pad(dEndeObj.getDate()) + 'T' +
                pad(dEndeObj.getHours()) +
                pad(dEndeObj.getMinutes()) + '00';

            const descriptionText =
                `📊 SCHICHT-AUSWERTUNG\\n` +
                verlaufAlsText(res, '\\n') +
                `⏱️ Bezahlte Arbeitszeit: ${zeitText(res.nettoMinuten || 0)}\\n` +
                `☕ Unbezahlte Pause: ${Math.round(res.unbezahltMinuten || 0)} Min.\\n\\n` +
                `💰 ZUSCHLÄGE:\\n` +
                `- Nacht: ${euroText(res.nachtEuro || 0)}\\n` +
                `- Samstag: ${euroText(res.samstagEuro || 0)}\\n` +
                `- Sonntag: ${euroText(res.sonntagEuro || 0)}\\n` +
                `- Feiertag: ${euroText(res.feiertagEuro || 0)}\\n` +
                `- Sondertag: ${euroText(res.sonderEuro || 0)}\\n` +
                `- Mehrarbeit: ${euroText(res.mehrarbeitEuro || 0)}\\n` +
                `----------------------------------\\n` +
                `💶 ZUSCHLÄGE GESAMT: ${euroText(res.zuschlagSumme || 0)}`;

            icsContent += "BEGIN:VEVENT\r\n";
            icsContent += `SUMMARY:${res.dienstnummer ? 'Dienst ' + res.dienstnummer : 'Dienstschicht'}\r\n`;
            icsContent += `DTSTART:${startIso}\r\n`;
            icsContent += `DTEND:${endeIso}\r\n`;
            icsContent += `DESCRIPTION:${descriptionText}\r\n`;
            icsContent += "END:VEVENT\r\n";
        });

        icsContent += "END:VCALENDAR\r\n";

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
        dateiSpeichernOderTeilen(`Dienstplan_${monatStr}.ics`, blob);
    }

    // ---------- Backup ----------
    function backupExportieren() {
        const blob = new Blob([JSON.stringify(gespeicherteSchichten, null, 2)], { type: 'application/json' });
        const heute = new Date().toISOString().split('T')[0];
        dateiSpeichernOderTeilen(`Dienstplan_Backup_${heute}.json`, blob);
    }

    function backupImportieren(input) {
        if (!input.files || !input.files[0]) return;
        if (!nurEigeneDatenPruefen()) { input.value = ''; return; }

        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const importiert = JSON.parse(e.target.result);
                const zeilen = Object.keys(importiert).map(datum => ({
                    user_id: aktuellerNutzer.id,
                    datum: datum,
                    daten: importiert[datum],
                    aktualisiert_am: new Date().toISOString()
                }));
                if (zeilen.length === 0) { alert('Die Datei enthält keine Schichten.'); input.value = ''; return; }

                const { error } = await sb.from('schichten').upsert(zeilen, { onConflict: 'user_id,datum' });
                if (error) throw error;

                await schichtenLaden();
                alert(`✅ Backup importiert: ${zeilen.length} Schichten übernommen.`);
            } catch (err) {
                alert("❌ Import fehlgeschlagen: " + (err.message || err));
            }
            input.value = '';
        };
        reader.readAsText(input.files[0]);
    }

    function renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        const jahr = aktuellesDatumAnzeige.getFullYear();
        const monat = aktuellesDatumAnzeige.getMonth();

        const monatsNamen = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        document.getElementById('calendarMonthTitle').innerText = `${monatsNamen[monat]} ${jahr}`;

        const tageKurz = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
        tageKurz.forEach(t => {
            const h = document.createElement('div');
            h.className = 'cal-day-header';
            h.innerText = t;
            grid.appendChild(h);
        });

        const ersterTagMonat = new Date(jahr, monat, 1);
        const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

        let startOffset = ersterTagMonat.getDay() - 1;
        if (startOffset === -1) startOffset = 6;

        for (let i = 0; i < startOffset; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day empty';
            grid.appendChild(emptyCell);
        }

        let mCount = 0, mNettoMin = 0, mNacht = 0, mSamstag = 0, mSonntag = 0,
            mFeiertag = 0, mSonder = 0, mMehrMin = 0, mMehrEuro = 0, mZuschlaege = 0;

        const heuteStr = new Date().toISOString().split('T')[0];

        for (let d = 1; d <= tageImMonat; d++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'cal-day';

            const pad = (n) => n < 10 ? '0' + n : n;
            const currentDatumStr = `${jahr}-${pad(monat + 1)}-${pad(d)}`;

            if (currentDatumStr === heuteStr) dayCell.classList.add('today');

            const feiertag = feiertagAm(currentDatumStr);
            if (feiertag) {
                dayCell.classList.add(feiertag.art === 'feiertag' ? 'feiertag' : 'sondertag');
                dayCell.title = feiertag.name;
            }

            const zahlSpan = document.createElement('div');
            zahlSpan.innerText = d;
            dayCell.appendChild(zahlSpan);

            if (feiertag) {
                const nameSpan = document.createElement('div');
                nameSpan.className = 'feiertag-name';
                nameSpan.innerText = feiertagKurz(feiertag.name);
                dayCell.appendChild(nameSpan);
            }

            if (gespeicherteSchichten[currentDatumStr]) {
                dayCell.classList.add('has-shift');
                const sch = gespeicherteSchichten[currentDatumStr];

                const euroSpan = document.createElement('div');
                euroSpan.className = 'euro';
                const betrag = sch.zuschlagSumme || 0;
                // Kleine Betraege genau zeigen, grosse gekuerzt (Platz in der Kachel)
                euroSpan.innerText = betrag < 100
                    ? betrag.toFixed(2).replace('.', ',') + '€'
                    : Math.round(betrag) + '€';
                dayCell.appendChild(euroSpan);

                mCount++;
                mNettoMin += sch.nettoMinuten || 0;
                mNacht += sch.nachtEuro || 0;
                mSamstag += sch.samstagEuro || 0;
                mSonntag += sch.sonntagEuro || 0;
                mFeiertag += sch.feiertagEuro || 0;
                mSonder += sch.sonderEuro || 0;
                mMehrMin += sch.mehrarbeitMinuten || 0;
                mMehrEuro += sch.mehrarbeitEuro || 0;
                mZuschlaege += sch.zuschlagSumme || 0;
            }

            dayCell.onclick = () => klickKalenderTag(currentDatumStr);
            grid.appendChild(dayCell);
        }

        const festeBezuege = ein.monatsentgelt + ein.unregelm + ein.dienstklasse;
        const setzeM = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };

        setzeM('mSchichten', mCount);
        setzeM('mNetto', zeitText(mNettoMin));
        setzeM('mNacht', euroText(mNacht));
        setzeM('mSamstag', euroText(mSamstag));
        setzeM('mSonntag', euroText(mSonntag));
        setzeM('mFeiertag', euroText(mFeiertag));
        setzeM('mSonder', euroText(mSonder));
        setzeM('mMehrarbeit', mMehrMin ? `${zeitText(mMehrMin)} → ${euroText(mMehrEuro)}` : '–');
        setzeM('mZuschlaege', euroText(mZuschlaege));
        setzeM('mFest', euroText(festeBezuege));
        setzeM('mGesamt', euroText(festeBezuege + mZuschlaege));

        renderJahresuebersicht(jahr);

    }

    function renderJahresuebersicht(jahr) {
        const el = document.getElementById('jahrLabel');
        if (el) el.innerText = jahr;

        let jCount = 0, jZuschlaege = 0, jMehrMin = 0;
        Object.keys(gespeicherteSchichten).forEach(key => {
            if (key.startsWith(String(jahr))) {
                const sch = gespeicherteSchichten[key];
                jCount++;
                jZuschlaege += sch.zuschlagSumme || 0;
                jMehrMin += sch.mehrarbeitMinuten || 0;
            }
        });

        const festJahr = (ein.monatsentgelt + ein.unregelm + ein.dienstklasse) * 12;
        const s1 = document.getElementById('jSchichten');
        if (s1) s1.innerText = jCount;
        const s2 = document.getElementById('jGesamt');
        if (s2) s2.innerText = euroText(festJahr + jZuschlaege);
        const s3 = document.getElementById('jZeitkonto');
        if (s3) s3.innerText = jMehrMin ? zeitText(jMehrMin) : '–';
    }

    function klickKalenderTag(datumStr) {
        document.getElementById('datum').value = datumStr;
        const sch = gespeicherteSchichten[datumStr];

        if (sch) {
            document.getElementById('start').value = sch.startStr || '';
            document.getElementById('ende').value = sch.endeStr || '';
            document.getElementById('endeTatsaechlich').value = sch.endeIst || '';
            document.getElementById('dienstnummer').value = sch.dienstnummer || '';
            document.getElementById('feiertagsArt').value = sch.feiertagsArt || 'normal';
            document.getElementById('pausenregel').value = sch.pausenregel || 'B30';
            pausenEintraege = (sch.pausen || []).map(p => ({
                von: p.von || '', bis: p.bis || '',
                unbezahlt: Number(p.unbezahlt) || 0,
                // Aeltere Eintraege kannten nur "ausgefallen" (alles gearbeitet)
                gearbeitet: p.gearbeitet !== undefined
                    ? (Number(p.gearbeitet) || 0)
                    : (p.ausgefallen ? (Number(p.unbezahlt) || 0) : 0),
                // Aeltere gespeicherte Dienste kannten nur unbezahlte Pausen
                art: p.art === 'BEZPAU' ? 'BEZPAU' : 'UNBPAU'
            }));
            pausenregelGeaendert();
            detailsAnzeigen(sch.details || null);
            berechneSchicht();
        } else {
            document.getElementById('ausgabe').style.display = 'none';
            feiertagPruefen();
        }
        wechselSeite('erfassen');
    }

    function wechselMonat(delta) {
        aktuellesDatumAnzeige.setMonth(aktuellesDatumAnzeige.getMonth() + delta);
        renderCalendar();
    }

    // Formatierungsfunktion für Dezimal + Normale Zeit + Euro
    function formatVollstaendig(val, lohn) {
        if (!val || val === 0) return '0.00 Std. (0h 0m) → 0,00 €';

        const mins = Math.round(val * 60);
        const h = Math.floor(mins / 60);
        const m = mins % 60;

        const euro = (val * lohn).toFixed(2).replace('.', ',');
        const dezimal = val.toFixed(2);

        return `${dezimal} Std. (${h}h ${m}m) → ${euro} €`;
    }

    // Einstellungen laden, dann App starten
    einstellungenLaden();
    wegstreckenLaden();
    pausenregelGeaendert();
    starteApp();

    // PWA: Service Worker registrieren (ermöglicht Offline-Nutzung & Installation).
    // Browser prüfen von sich aus höchstens einmal pro 24 Stunden auf eine neue
    // service-worker.js - das reicht nicht, wenn mehrmals am Tag ein Update
    // erscheint. Deshalb selbst aktiv nach Updates suchen (bei jedem Start und
    // wann immer die App wieder in den Vordergrund kommt) und, sobald eine
    // neue Version übernimmt, die Seite automatisch neu laden.
    if ('serviceWorker' in navigator) {
        let neuladenLaeuft = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (neuladenLaeuft) return;
            neuladenLaeuft = true;
            window.location.reload();
        });

        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').then((reg) => {
                reg.update().catch(() => {});
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') reg.update().catch(() => {});
                });
            }).catch((err) => console.log('Service Worker Registrierung fehlgeschlagen:', err));
        });
    }
