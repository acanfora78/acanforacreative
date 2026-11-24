/**
 * Lingue e percorsi tradotti.
 * Le cartelle in app/[lang]/ usano i nomi italiani; per l'inglese proxy.ts
 * riscrive /en/services → /en/servizi (e reindirizza i nomi "sbagliati" per lingua).
 */

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Segmento di primo livello per pagina e lingua. La chiave interna è il nome della cartella. */
export const routes = {
  home: { it: "", en: "" },
  studio: { it: "studio", en: "studio" },
  servizi: { it: "servizi", en: "services" },
  lavori: { it: "lavori", en: "work" },
  contatti: { it: "contatti", en: "contact" },
  privacy: { it: "privacy", en: "privacy" },
  cookie: { it: "cookie", en: "cookies" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Percorso pubblico di una pagina, es. href("en", "servizi") → "/en/services". */
export function href(locale: Locale, key: RouteKey, ...rest: string[]): string {
  const seg = routes[key][locale];
  return "/" + [locale, seg, ...rest].filter(Boolean).join("/");
}

/** Dal segmento pubblico di una lingua alla cartella interna (italiana). */
export function internalSegment(locale: Locale, publicSeg: string): string | undefined {
  for (const [key, map] of Object.entries(routes)) {
    if (map[locale] === publicSeg) return key === "home" ? "" : routes[key as RouteKey].it;
  }
  return undefined;
}

/** Il segmento giusto per una lingua, se l'utente ha usato quello dell'altra lingua. */
export function correctSegment(locale: Locale, publicSeg: string): string | undefined {
  for (const map of Object.values(routes)) {
    const other = locale === "it" ? map.en : map.it;
    if (other === publicSeg && map[locale] !== publicSeg) return map[locale];
  }
  return undefined;
}
