import type { Locale } from "@/lib/i18n";

/**
 * Portfolio. Regole (CLAUDE.md): solo progetti e materiali reali, nessun risultato inventato.
 * `published: false` = presente nei dati ma non mostrato sul sito.
 * Ruoli dedotti dalle indicazioni del titolare e dall'analisi dei siti online (24/11/2026).
 */

type L = Record<Locale, string>;

export type ProjectKind = "client" | "internal" | "concept";

export type Project = {
  slug: string;
  name: string;
  kind: ProjectKind;
  year: number;
  category: L;
  services: Record<Locale, string[]>;
  summary: L;
  url?: string;
  /** Immagini reali (screenshot del sito live). Assenti = copertina tipografica. */
  cover?: { src: string; mobile?: string; alt: L };
  published: boolean;
  featured: boolean;
  /** Nota interna, non mostrata. */
  note?: string;
};

export const projects: Project[] = [
  {
    slug: "sudditalia",
    name: "Sudditalia",
    kind: "client",
    year: 2026,
    category: { it: "E-commerce", en: "E-commerce" },
    services: { it: ["E-commerce Shopify", "Web design"], en: ["Shopify e-commerce", "Web design"] },
    summary: {
      it: "Negozio online per un brand streetwear e denim Made in Italy, costruito attorno alle collezioni stagionali.",
      en: "Online store for a Made in Italy streetwear and denim brand, built around its seasonal collections.",
    },
    url: "https://sudditalia.it",
    cover: {
      src: "/work/sudditalia/cover.jpg",
      mobile: "/work/sudditalia/mobile.jpg",
      alt: { it: "Homepage del sito Sudditalia", en: "Sudditalia website homepage" },
    },
    published: true,
    featured: true,
    note: "Shopify, tema Horizon personalizzato. Refuso nella meta description del sito (2036/27).",
  },
  {
    slug: "osteria-il-tormentone",
    name: "Osteria Il Tormentone",
    kind: "client",
    year: 2026,
    category: { it: "Sito web", en: "Website" },
    services: { it: ["Web design", "Prenotazioni online"], en: ["Web design", "Online booking"] },
    summary: {
      it: "Sito per un ristorante di cucina napoletana a conduzione familiare, con prenotazione del tavolo in pochi passaggi.",
      en: "Website for a family-run Neapolitan restaurant, with table booking in a few steps.",
    },
    url: "https://osteriatormentone.it",
    cover: {
      src: "/work/osteria-il-tormentone/cover.jpg",
      mobile: "/work/osteria-il-tormentone/mobile.jpg",
      alt: { it: "Homepage del sito Osteria Il Tormentone", en: "Osteria Il Tormentone website homepage" },
    },
    published: true,
    featured: true,
    note: "Realizzato con Emergent. Titolo e descrizione SEO del sito ancora quelli di Emergent: da correggere.",
  },
  {
    slug: "korme",
    name: "Kormè",
    kind: "client",
    year: 2026,
    category: { it: "App", en: "App" },
    services: { it: ["App di prenotazione", "Mappa interattiva"], en: ["Booking app", "Interactive map"] },
    summary: {
      it: "App per prenotare i lettini della piscina di un bar, con una mappa interattiva dei posti.",
      en: "App for booking poolside loungers at a bar, with an interactive map of the spots.",
    },
    published: true,
    featured: true,
    note: "Nessuna immagine reale disponibile: copertina tipografica finché non arrivano screenshot dell'app.",
  },
  {
    slug: "22side",
    name: "22SIDE",
    kind: "client",
    year: 2026,
    category: { it: "E-commerce", en: "E-commerce" },
    services: { it: ["E-commerce Shopify", "Tema su misura"], en: ["Shopify e-commerce", "Custom theme"] },
    summary: {
      it: "E-commerce streetwear su Shopify con un tema su misura: intro animata, drop e newsletter.",
      en: "Streetwear e-commerce on Shopify with a custom theme: animated intro, drops and newsletter.",
    },
    url: "https://22sideshop.it",
    cover: {
      src: "/work/22side/cover.jpg",
      mobile: "/work/22side/mobile.jpg",
      alt: { it: "Homepage del sito 22SIDE", en: "22SIDE website homepage" },
    },
    published: true,
    featured: false,
    note: "Tema pubblicato chiamato '22SIDE — launch-ready (dev)': da verificare.",
  },
  {
    slug: "oro-croccante",
    name: "Oro Croccante",
    kind: "client",
    year: 2026,
    category: { it: "Social media", en: "Social media" },
    services: { it: ["Social Media Management"], en: ["Social media management"] },
    summary: {
      it: "Gestione dei canali social per un'azienda di patatine chips.",
      en: "Social media management for a potato chips company.",
    },
    published: true,
    featured: false,
    note: "Cliente appena acquisito: nessun risultato o numero finché non consegnato e approvato.",
  },
  {
    slug: "oddscore",
    name: "Oddscore",
    kind: "client",
    year: 2026,
    category: { it: "App", en: "App" },
    services: { it: ["App"], en: ["App"] },
    summary: { it: "", en: "" },
    published: false,
    featured: false,
    note: "Scommesse sportive: divieto di pubblicità anche indiretta (art. 9 DL 87/2018). Nascosto fino a verifica legale.",
  },
  {
    slug: "acanfora-creative",
    name: "Acanfora Creative",
    kind: "internal",
    year: 2026,
    category: { it: "Branding", en: "Branding" },
    services: { it: ["Identità visiva"], en: ["Visual identity"] },
    summary: {
      it: "L'identità dello studio: simbolo ad anello aperto, Didot e Lato, nero e avorio.",
      en: "The studio's own identity: open-loop symbol, Didot and Lato, black and ivory.",
    },
    published: true,
    featured: false,
  },
  {
    slug: "caldera",
    name: "CALDERA",
    kind: "concept",
    year: 2026,
    category: { it: "E-commerce", en: "E-commerce" },
    services: { it: ["Concept e-commerce"], en: ["E-commerce concept"] },
    summary: {
      it: "Concept di e-commerce sviluppato dallo studio. Non è un cliente reale.",
      en: "E-commerce concept developed by the studio. Not a real client.",
    },
    published: true,
    featured: false,
  },
];

export const publishedProjects = projects.filter((p) => p.published);
export const featuredProjects = projects.filter((p) => p.published && p.featured);
