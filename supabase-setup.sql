-- ============================================================
--  DIENSTPLAN-APP – SUPABASE SETUP
--  Einmalig im Supabase SQL-Editor ausführen (Kompletter Inhalt).
-- ============================================================

-- ------------------------------------------------------------
-- 1) PROFILE  (ein Eintrag je registriertem Nutzer)
--    rolle: 'admin' oder 'nutzer'
--    aktiv: erst nach Einlösen eines Einladungscodes true
-- ------------------------------------------------------------
create table if not exists public.profile (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  anzeigename text,
  rolle       text not null default 'nutzer',
  aktiv       boolean not null default false,
  erstellt_am timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2) EINLADUNGEN  (Codes, die der Admin ausgibt)
-- ------------------------------------------------------------
create table if not exists public.einladungen (
  code           text primary key,
  erstellt_von   uuid references auth.users on delete set null,
  verwendet_von  uuid references auth.users on delete set null,
  verwendet_am   timestamptz,
  erstellt_am    timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3) SCHICHTEN  (die eigentlichen Dienstdaten)
--    daten = komplettes Berechnungsergebnis als JSON
-- ------------------------------------------------------------
create table if not exists public.schichten (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references auth.users on delete cascade,
  datum           date not null,
  daten           jsonb not null,
  aktualisiert_am timestamptz not null default now(),
  unique (user_id, datum)
);

-- ------------------------------------------------------------
-- 4) HILFSFUNKTION: Ist der aktuelle Nutzer Admin?
--    SECURITY DEFINER verhindert Endlosschleifen in den Regeln.
-- ------------------------------------------------------------
create or replace function public.ist_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profile
    where id = auth.uid() and rolle = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- 5) HILFSFUNKTION: Ist der aktuelle Nutzer freigeschaltet?
-- ------------------------------------------------------------
create or replace function public.ist_aktiv()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profile
    where id = auth.uid() and aktiv = true
  );
$$;

-- ------------------------------------------------------------
-- 6) AUTOMATISCH ein Profil anlegen, wenn sich jemand registriert
-- ------------------------------------------------------------
create or replace function public.neues_profil_anlegen()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profile (id, email, anzeigename)
  values (new.id, new.email, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.neues_profil_anlegen();

-- ------------------------------------------------------------
-- 7) EINLADUNGSCODE EINLÖSEN
--    Schaltet den aufrufenden Nutzer frei, wenn der Code gültig
--    und noch unbenutzt ist.
-- ------------------------------------------------------------
create or replace function public.einladung_einloesen(code_eingabe text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  gefunden public.einladungen%rowtype;
begin
  if auth.uid() is null then
    return 'FEHLER: Nicht angemeldet.';
  end if;

  select * into gefunden
  from public.einladungen
  where upper(code) = upper(trim(code_eingabe))
  for update;

  if not found then
    return 'FEHLER: Code unbekannt.';
  end if;

  if gefunden.verwendet_von is not null then
    return 'FEHLER: Code wurde bereits verwendet.';
  end if;

  update public.einladungen
     set verwendet_von = auth.uid(),
         verwendet_am  = now()
   where code = gefunden.code;

  update public.profile
     set aktiv = true
   where id = auth.uid();

  return 'OK';
end;
$$;

-- ------------------------------------------------------------
-- 8) ZUGRIFFSREGELN (Row Level Security)
--    Grundsatz: Jeder sieht nur seine eigenen Daten.
--    Ausnahme: Admin sieht alles.
-- ------------------------------------------------------------
alter table public.profile     enable row level security;
alter table public.einladungen enable row level security;
alter table public.schichten   enable row level security;

-- --- PROFILE ---
drop policy if exists "profil_lesen" on public.profile;
create policy "profil_lesen" on public.profile
  for select using ( id = auth.uid() or public.ist_admin() );

drop policy if exists "profil_aendern" on public.profile;
create policy "profil_aendern" on public.profile
  for update using ( id = auth.uid() or public.ist_admin() );

-- --- EINLADUNGEN ---
-- Nur der Admin darf Codes erstellen und die Liste sehen.
drop policy if exists "einladung_lesen" on public.einladungen;
create policy "einladung_lesen" on public.einladungen
  for select using ( public.ist_admin() );

drop policy if exists "einladung_erstellen" on public.einladungen;
create policy "einladung_erstellen" on public.einladungen
  for insert with check ( public.ist_admin() );

drop policy if exists "einladung_loeschen" on public.einladungen;
create policy "einladung_loeschen" on public.einladungen
  for delete using ( public.ist_admin() );

-- --- SCHICHTEN ---
drop policy if exists "schicht_lesen" on public.schichten;
create policy "schicht_lesen" on public.schichten
  for select using ( user_id = auth.uid() or public.ist_admin() );

drop policy if exists "schicht_anlegen" on public.schichten;
create policy "schicht_anlegen" on public.schichten
  for insert with check ( user_id = auth.uid() and public.ist_aktiv() );

drop policy if exists "schicht_aendern" on public.schichten;
create policy "schicht_aendern" on public.schichten
  for update using ( user_id = auth.uid() and public.ist_aktiv() );

drop policy if exists "schicht_loeschen" on public.schichten;
create policy "schicht_loeschen" on public.schichten
  for delete using ( user_id = auth.uid() );

-- ============================================================
--  FERTIG.
--
--  WICHTIG – NACH dem Ausführen dieses Skripts:
--  1. Registriere dich EINMAL in der App mit deiner E-Mail.
--  2. Führe dann diesen Befehl hier aus (deine Mail eintragen),
--     um dich selbst zum Admin zu machen und freizuschalten:
--
--     update public.profile
--        set rolle = 'admin', aktiv = true
--      where email = 'DEINE@EMAIL.DE';
--
--  Danach kannst du in der App im Admin-Bereich Einladungscodes
--  erzeugen und an deine Kollegen weitergeben.
-- ============================================================
