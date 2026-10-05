// Reine Umwandlung der BVG-Störungsmeldungen in ein kompaktes, gut lesbares Format
// (ohne Deno-Besonderheiten, damit sie sich auch lokal testen lässt).

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  auml: "ä", ouml: "ö", uuml: "ü", Auml: "Ä", Ouml: "Ö", Uuml: "Ü", szlig: "ß",
  ndash: "–", mdash: "—", hellip: "…", laquo: "«", raquo: "»",
  bdquo: "„", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", euro: "€",
};

// HTML der BVG -> Klartext. Die BVG nutzt eigene Elemente: <bds-signet-line line-id='U2'> steht
// für das Liniensymbol (wird zur Liniennummer), <bds-icon alt='und'> für ein Zeichen zwischen
// zwei Haltestellen (wird zum Alternativtext).
export function klartext(html: unknown): string {
  return String(html ?? "")
    .replace(/<bds-signet-line\b[\s\S]*?line-id=['"]([^'"]+)['"][\s\S]*?<\/bds-signet-line>/gi, "$1")
    .replace(/<bds-icon\b[^>]*?alt=['"]([^'"]*)['"][^>]*>(?:<\/bds-icon>)?/gi, " $1 ")
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h\d|ul|ol)>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (treffer, name: string) => {
      if (name[0] === "#") {
        const zahl = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
        return Number.isFinite(zahl) && zahl > 0 && zahl < 0x110000 ? String.fromCodePoint(zahl) : "";
      }
      return ENTITIES[name] ?? treffer;
    })
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export interface Meldung {
  id: string;
  art: string;
  ueberschrift: string;
  text: string;
  von: string | null;
  bis: string | null;
  richtung: string | null;
  haltestelle: string;
  haltestelle2: string;
  karte: string | null;
  linien: string[];
  aktualisiert: string | null;
}

// Eine Meldung der BVG (Rohformat) in das kompakte Format. Gibt null zurück, wenn es keine
// Verkehrsmeldung ist (z. B. Aufzugsstörungen interessieren hier nicht).
// deno-lint-ignore no-explicit-any
export function vereinfachen(m: any): Meldung | null {
  if (!m || m.messageType !== "TRAFFIC") return null;

  const teile = Array.isArray(m.content) ? m.content : [];
  const text = teile.map((c: { content?: string }) => klartext(c?.content)).filter(Boolean).join("\n");
  const ueberschrift = teile.map((c: { headline?: string }) => klartext(c?.headline)).find(Boolean) ?? "";

  // Kartenbild nur von der Fahrinfo der VBB/BVG akzeptieren (https), nichts anderes weiterreichen
  const bilder = Array.isArray(m.images) ? m.images : [];
  const karte = bilder
    .map((i: { rawImage?: { link?: string; "@link"?: string } }) => i?.rawImage?.link ?? i?.rawImage?.["@link"])
    .find((u: unknown) => typeof u === "string" && /^https:\/\/fahrinfo\.vbb\.de\/[^\s"'<>]+$/.test(u)) ?? null;

  const linien = new Set<string>();
  for (const gruppe of Array.isArray(m.lines) ? m.lines : []) {
    for (const arten of Object.values(gruppe ?? {})) {
      if (!Array.isArray(arten)) continue;
      for (const l of arten) if (l?.name) linien.add(String(l.name).toUpperCase());
    }
  }

  const arten = Array.isArray(m.disruptionTypes)
    ? m.disruptionTypes.map((t: { displayName?: string }) => t?.displayName).filter(Boolean)
    : [];

  return {
    id: String(m.id ?? ""),
    art: arten.join(", ") || ueberschrift,
    ueberschrift,
    text,
    von: typeof m.startDate === "string" ? m.startDate : null,
    bis: typeof m.endDate === "string" ? m.endDate : null,
    richtung: typeof m.directionOne === "string" ? m.directionOne : null,
    haltestelle: String(m.stationOne?.displayName ?? ""),
    haltestelle2: String(m.stationTwo?.displayName ?? ""),
    karte,
    linien: [...linien],
    aktualisiert: typeof m.modDate === "string" ? m.modDate : null,
  };
}
