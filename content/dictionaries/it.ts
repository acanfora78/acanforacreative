/** Testi italiani. Nessun risultato, numero o testimonianza inventati. */
export const it = {
  meta: {
    title: "ACANFORA CREATIVE — Creative Digital Studio",
    description:
      "Studio creativo digitale: identità visive, siti web, e-commerce, social media e soluzioni digitali progettate con la cura di una produzione cinematografica.",
  },
  nav: {
    studio: "Studio",
    services: "Servizi",
    work: "Lavori",
    contact: "Contatti",
    menu: "Menu",
    close: "Chiudi",
    skip: "Vai al contenuto",
    switchTo: "English",
  },
  hero: {
    eyebrow: "Creative Digital Studio — Brand · Web · E-commerce · AI",
    skipIntro: "Salta intro",
    introLabel: "Introduzione",
    titleLines: ["Ogni brand ha una storia.", "Noi la mettiamo in scena."],
    text: "Identità visive, siti, e-commerce e contenuti digitali, progettati con la cura di una produzione cinematografica.",
    primary: "Parliamo del tuo progetto",
    secondary: "Guarda i lavori",
    scroll: "Scorri",
  },
  manifesto: {
    label: "Manifesto",
    text: "Un'immagine forte non nasce per caso. Nasce da una storia chiara, da scelte precise e da dettagli curati uno per uno. Lavoriamo come su un set: ogni inquadratura ha una ragione.",
  },
  work: {
    label: "Lavori selezionati",
    title: "Progetti",
    all: "Tutti i lavori",
    visit: "Visita il sito",
    noImage: "Immagini in arrivo",
    kinds: { client: "", internal: "Progetto interno", concept: "Concept dimostrativo" },
  },
  services: {
    label: "Servizi",
    title: "Cosa facciamo",
    all: "Tutti i servizi",
    items: [
      { name: "Web Design", text: "Siti su misura, veloci e pensati prima per il telefono." },
      { name: "E-commerce", text: "Negozi online che raccontano il prodotto e semplificano l'acquisto." },
      { name: "Branding", text: "Identità visive coerenti, dal logo a ogni punto di contatto." },
      { name: "Social Media Management", text: "Piano editoriale, contenuti e gestione dei profili." },
      { name: "Digital Marketing", text: "Campagne e strategie per farti trovare dalle persone giuste." },
      { name: "Digital Solutions e AI", text: "App, automazioni e strumenti su misura per il tuo lavoro." },
    ],
  },
  method: {
    label: "Metodo",
    title: "Come lavoriamo",
    steps: [
      { name: "Ascolto", text: "Capiamo la tua attività, il tuo pubblico e cosa vuoi ottenere." },
      { name: "Direzione", text: "Definiamo la storia, lo stile e le priorità del progetto." },
      { name: "Produzione", text: "Progettiamo e sviluppiamo, con revisioni condivise a ogni passaggio." },
      { name: "Lancio", text: "Mettiamo online e verifichiamo ogni dettaglio prima del debutto." },
    ],
  },
  studio: {
    label: "Studio",
    title: "Dietro le quinte",
    text: "Dietro ACANFORA CREATIVE c'è Morgan Acanfora: un solo interlocutore che segue il tuo progetto dall'idea alla messa online.",
    role: "Fondatore e direttore creativo",
    photoAlt: "Ritratto di Morgan Acanfora",
    cta: "Scopri lo studio",
  },
  closing: {
    titleLines: ["Hai un progetto in mente?", "Parliamone."],
    text: "Raccontaci cosa ti serve: ti risponde direttamente Morgan.",
    primary: "Scrivici",
    whatsapp: "WhatsApp",
    email: "Email",
    whatsappMessage: "Ciao Morgan, vorrei parlarti di un progetto.",
    emailSubject: "Nuovo progetto",
  },
  footer: {
    tagline: "Creative Digital Studio",
    navigation: "Navigazione",
    contacts: "Contatti",
    legal: "Note legali",
    privacy: "Privacy",
    cookies: "Cookie",
    rights: "Tutti i diritti riservati.",
  },
} as const;

/** Stessa forma dei testi italiani, valori stringa liberi: le altre lingue devono rispettarla. */
type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Widen<U>[] : { [K in keyof T]: Widen<T[K]> };
export type Dictionary = Widen<typeof it>;
