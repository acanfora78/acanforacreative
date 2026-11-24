/**
 * URL pubblico del sito e indicizzazione, da variabili d'ambiente (il dominio non è ancora scelto).
 * - SITE_URL: dominio definitivo, es. https://www.acanforacreative.it
 * - in mancanza, su Vercel si usa il dominio di produzione del progetto; in locale localhost.
 * - SITE_INDEXABLE="true": permette ai motori di ricerca di indicizzare. Di default NO,
 *   finché il titolare non approva la pubblicazione.
 */
export function siteUrl(): URL {
  const raw =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return new URL(raw);
}

export const indexable = process.env.SITE_INDEXABLE === "true";

export const robotsMeta = indexable ? { index: true, follow: true } : { index: false, follow: false };

/** Immagine di anteprima per i social (1200×630), uguale per tutte le pagine e le lingue. */
export const ogImage = { url: "/og.png", width: 1200, height: 630, alt: "ACANFORA CREATIVE — Creative Digital Studio" };
