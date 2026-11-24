import type { Locale } from "@/lib/i18n";

/**
 * Testi delle pagine interne (fase 6). Nessun risultato, numero, testimonianza
 * o tempo di consegna promesso: solo fatti noti e descrizione del lavoro.
 */

export const serviceSlugs = ["web-design", "e-commerce", "branding", "social-media", "digital-marketing", "digital-ai"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

type Service = { slug: ServiceSlug; name: string; intro: string; includes: string[]; forWho: string };

const it = {
  studio: {
    label: "Studio",
    title: "Uno studio, un punto di vista.",
    lead: "ACANFORA CREATIVE è uno studio creativo digitale. Progetta identità, siti, e-commerce, app e contenuti con un metodo preso dal cinema: prima la storia, poi l'inquadratura, infine i dettagli.",
    valuesLabel: "Approccio",
    valuesTitle: "Come pensiamo",
    values: [
      { name: "La storia prima di tutto", text: "Ogni progetto parte da cosa vuoi raccontare e a chi. Lo stile viene dopo, al servizio del messaggio." },
      { name: "Poche cose, fatte bene", text: "Meglio un sito chiaro e curato che uno pieno di effetti. Ogni elemento deve avere un motivo per esserci." },
      { name: "Un solo interlocutore", text: "Parli sempre con chi progetta e sviluppa il tuo lavoro, dalla prima idea alla messa online." },
    ],
    methodLabel: "Metodo",
    methodTitle: "Dall'idea alla messa online",
    method: [
      { name: "Ascolto", text: "Una conversazione per capire la tua attività, il tuo pubblico e i tuoi obiettivi.", output: "Un quadro chiaro del progetto e una proposta su misura." },
      { name: "Direzione", text: "Definiamo storia, stile visivo, struttura dei contenuti e priorità.", output: "La direzione creativa approvata da te prima di produrre." },
      { name: "Produzione", text: "Progettiamo e sviluppiamo, con revisioni condivise a ogni passaggio.", output: "Il progetto completo, verificato su telefono e computer." },
      { name: "Lancio", text: "Mettiamo online e controlliamo ogni dettaglio prima del debutto.", output: "Il progetto pubblicato e le indicazioni per gestirlo." },
    ],
    outputLabel: "Cosa ricevi",
    whoLabel: "Chi c'è dietro",
    bio: [
      "Morgan Acanfora ha fondato ACANFORA CREATIVE per riunire in un solo studio design, tecnologia e racconto.",
      "Segue ogni progetto in prima persona, dalla prima conversazione alla messa online: identità visive, siti web, e-commerce, applicazioni e comunicazione social.",
      "Lavora come in un set: prima capisce la storia da raccontare, poi sceglie l'inquadratura, infine cura ogni dettaglio perché il risultato sia chiaro, riconoscibile e fatto per durare.",
    ],
    skillsLabel: "Competenze",
    skills: ["Web design", "Sviluppo web", "E-commerce Shopify", "App", "Branding", "Social media", "Digital marketing", "AI e automazioni"],
  },
  services: {
    label: "Servizi",
    title: "Cosa facciamo, per chi.",
    lead: "Sei servizi, un unico studio. Puoi partire da uno solo o costruire con noi tutta la tua presenza digitale.",
    includesLabel: "Cosa comprende",
    forWhoLabel: "Per chi è adatto",
    relatedLabel: "Lavori collegati",
    cta: "Richiedi questo servizio",
    items: [
      { slug: "web-design", name: "Web Design", intro: "Siti su misura, veloci e pensati prima per il telefono, che presentano la tua attività con chiarezza.", includes: ["Struttura dei contenuti e testi", "Design su misura", "Sviluppo e messa online", "Ottimizzazione per telefono e motori di ricerca"], forWho: "Attività e professionisti che vogliono un sito credibile, facile da usare e da trovare." },
      { slug: "e-commerce", name: "E-commerce", intro: "Negozi online che raccontano il prodotto e rendono l'acquisto semplice, anche su Shopify.", includes: ["Negozio Shopify o su misura", "Schede prodotto e collezioni", "Pagamenti e spedizioni", "Formazione per gestire il negozio"], forWho: "Brand e negozi che vogliono vendere online con un'immagine all'altezza dei loro prodotti." },
      { slug: "branding", name: "Branding", intro: "Identità visive coerenti: dal logo ai colori, dai caratteri a ogni punto di contatto.", includes: ["Logo e simbolo", "Palette e tipografia", "Linee guida d'uso", "Applicazioni per social e stampa"], forWho: "Nuove attività o brand che vogliono un'immagine riconoscibile e coerente." },
      { slug: "social-media", name: "Social Media Management", intro: "Piano editoriale, contenuti e gestione dei profili con continuità e uno stile riconoscibile.", includes: ["Strategia e piano editoriale", "Grafiche e contenuti", "Pubblicazione e gestione dei profili", "Analisi periodica"], forWho: "Attività che vogliono essere presenti sui social con costanza, senza occuparsene ogni giorno." },
      { slug: "digital-marketing", name: "Digital Marketing", intro: "Campagne e strategie per farti trovare dalle persone giuste, nel momento giusto.", includes: ["Strategia digitale", "Campagne sui social", "Posizionamento sui motori di ricerca", "Monitoraggio dei risultati"], forWho: "Chi vuole far crescere la propria attività online con obiettivi chiari e misurabili." },
      { slug: "digital-ai", name: "Digital Solutions e AI", intro: "App, automazioni e strumenti su misura che semplificano il lavoro di ogni giorno.", includes: ["Web app e app su misura", "Prenotazioni e gestionali", "Automazioni dei processi", "Integrazioni con l'intelligenza artificiale"], forWho: "Attività con esigenze specifiche che gli strumenti pronti non coprono." },
    ] satisfies Service[],
    faqLabel: "Domande frequenti",
    faq: [
      { q: "Quanto costa un progetto?", a: "Dipende da obiettivi e complessità. Dopo una prima conversazione ricevi un preventivo su misura, senza impegno." },
      { q: "Quanto tempo serve?", a: "Dipende dal progetto. I tempi vengono concordati insieme e indicati nel preventivo." },
      { q: "Potrò aggiornare il sito da solo?", a: "Sì, dove serve: ti consegniamo strumenti e indicazioni per gestire testi, immagini e prodotti in autonomia." },
      { q: "Seguite il progetto anche dopo la messa online?", a: "Sì, possiamo concordare manutenzione, aggiornamenti e gestione continuativa." },
    ],
  },
  work: {
    label: "Lavori",
    title: "Lavori selezionati.",
    lead: "Siti, e-commerce, app e social realizzati nel 2026. Per ogni progetto: cosa abbiamo fatto e come appare oggi.",
  },
  caseStudy: {
    back: "Tutti i lavori",
    client: "Cliente",
    year: "Anno",
    type: "Tipo",
    services: "Servizi",
    overview: "Il progetto",
    done: "Cosa abbiamo fatto",
    gallery: "Galleria",
    desktop: "Computer",
    mobile: "Telefono",
    visit: "Visita il sito",
    next: "Progetto successivo",
    ctaTitle: "Hai un progetto simile?",
    ctaButton: "Parliamone",
    noImages: "Immagini del progetto in arrivo.",
    brandFiles: "File del logo",
  },
  contact: {
    label: "Contatti",
    title: "Parliamo del tuo progetto.",
    lead: "Raccontaci cosa ti serve. Ti risponde direttamente Morgan, il prima possibile.",
    channels: "Contatti diretti",
    after: "Cosa succede dopo",
    afterText: "Leggiamo la tua richiesta e ti ricontattiamo il prima possibile per una prima conversazione, senza impegno.",
    form: {
      name: "Nome",
      email: "Email",
      phone: "Telefono",
      company: "Azienda o attività",
      services: "Servizi di interesse",
      message: "Messaggio",
      privacy: "Ho letto l'informativa privacy",
      privacyLink: "informativa privacy",
      required: "obbligatorio",
      submit: "Invia richiesta",
      sending: "Invio in corso…",
      success: "Richiesta inviata. Ti rispondiamo il prima possibile.",
      error: "Controlla i campi evidenziati.",
      unavailable: "Il modulo non è ancora attivo. Scrivici direttamente:",
      failed: "Invio non riuscito. Scrivici direttamente:",
      errors: { name: "Inserisci il tuo nome.", email: "Inserisci un'email valida.", message: "Scrivi un breve messaggio.", privacy: "Serve il consenso per poterti rispondere." },
    },
  },
  notFound: { label: "Errore 404", title: "Scena tagliata al montaggio.", text: "Questa pagina non esiste o è stata spostata.", home: "Torna alla home" },
};

type Content = typeof it;

const en: Content = {
  studio: {
    label: "Studio",
    title: "One studio, one point of view.",
    lead: "ACANFORA CREATIVE is a creative digital studio. It designs identities, websites, e-commerce, apps and content with a method borrowed from cinema: first the story, then the frame, then the details.",
    valuesLabel: "Approach",
    valuesTitle: "How we think",
    values: [
      { name: "Story first", text: "Every project starts from what you want to say and to whom. Style comes after, in service of the message." },
      { name: "Fewer things, done well", text: "A clear, crafted site beats one full of effects. Every element needs a reason to be there." },
      { name: "One point of contact", text: "You always talk to the person who designs and builds your work, from the first idea to launch." },
    ],
    methodLabel: "Method",
    methodTitle: "From idea to launch",
    method: [
      { name: "Listen", text: "A conversation to understand your business, your audience and your goals.", output: "A clear picture of the project and a tailored proposal." },
      { name: "Direct", text: "We define story, visual style, content structure and priorities.", output: "The creative direction, approved by you before production." },
      { name: "Produce", text: "We design and build, with shared reviews at every step.", output: "The complete project, tested on phone and desktop." },
      { name: "Launch", text: "We go live and check every detail before the premiere.", output: "The published project and guidance to manage it." },
    ],
    outputLabel: "What you get",
    whoLabel: "Behind the scenes",
    bio: [
      "Morgan Acanfora founded ACANFORA CREATIVE to bring design, technology and storytelling together in one studio.",
      "He leads every project personally, from the first conversation to launch: visual identities, websites, e-commerce, applications and social media.",
      "He works like a film set: first he understands the story, then he chooses the frame, then he refines every detail so the result is clear, recognisable and built to last.",
    ],
    skillsLabel: "Skills",
    skills: ["Web design", "Web development", "Shopify e-commerce", "Apps", "Branding", "Social media", "Digital marketing", "AI and automation"],
  },
  services: {
    label: "Services",
    title: "What we do, and for whom.",
    lead: "Six services, one studio. Start with just one, or build your whole digital presence with us.",
    includesLabel: "What's included",
    forWhoLabel: "Who it's for",
    relatedLabel: "Related work",
    cta: "Request this service",
    items: [
      { slug: "web-design", name: "Web Design", intro: "Tailor-made, fast websites designed for the phone first, presenting your business with clarity.", includes: ["Content structure and copy", "Custom design", "Development and launch", "Mobile and search optimisation"], forWho: "Businesses and professionals who want a credible website that is easy to use and to find." },
      { slug: "e-commerce", name: "E-commerce", intro: "Online stores that tell the product's story and make buying simple, including on Shopify.", includes: ["Shopify or custom store", "Product pages and collections", "Payments and shipping", "Training to run the store"], forWho: "Brands and shops that want to sell online with an image worthy of their products." },
      { slug: "branding", name: "Branding", intro: "Consistent visual identities: from logo to colours, from typefaces to every touchpoint.", includes: ["Logo and symbol", "Palette and typography", "Usage guidelines", "Social and print applications"], forWho: "New businesses or brands that want a recognisable, consistent image." },
      { slug: "social-media", name: "Social Media Management", intro: "Editorial planning, content and profile management, with consistency and a recognisable style.", includes: ["Strategy and editorial plan", "Graphics and content", "Publishing and profile management", "Regular review"], forWho: "Businesses that want a steady social presence without handling it every day." },
      { slug: "digital-marketing", name: "Digital Marketing", intro: "Campaigns and strategy to reach the right people at the right moment.", includes: ["Digital strategy", "Social campaigns", "Search engine visibility", "Performance tracking"], forWho: "Anyone who wants to grow their business online with clear, measurable goals." },
      { slug: "digital-ai", name: "Digital Solutions & AI", intro: "Custom apps, automations and tools that simplify everyday work.", includes: ["Custom web apps and apps", "Booking and management tools", "Process automation", "Artificial intelligence integrations"], forWho: "Businesses with specific needs that off-the-shelf tools don't cover." },
    ],
    faqLabel: "Frequently asked questions",
    faq: [
      { q: "How much does a project cost?", a: "It depends on goals and complexity. After a first conversation you receive a tailored quote, with no obligation." },
      { q: "How long does it take?", a: "It depends on the project. Timing is agreed together and stated in the quote." },
      { q: "Can I update the site myself?", a: "Yes, where needed: you receive tools and guidance to manage copy, images and products on your own." },
      { q: "Do you support the project after launch?", a: "Yes, we can agree on maintenance, updates and ongoing management." },
    ],
  },
  work: {
    label: "Work",
    title: "Selected work.",
    lead: "Websites, e-commerce, apps and social media delivered in 2026. For each project: what we did and how it looks today.",
  },
  caseStudy: {
    back: "All work",
    client: "Client",
    year: "Year",
    type: "Type",
    services: "Services",
    overview: "The project",
    done: "What we did",
    gallery: "Gallery",
    desktop: "Desktop",
    mobile: "Mobile",
    visit: "Visit the site",
    next: "Next project",
    ctaTitle: "Have a similar project?",
    ctaButton: "Let's talk",
    noImages: "Project images coming soon.",
    brandFiles: "Logo files",
  },
  contact: {
    label: "Contact",
    title: "Let's talk about your project.",
    lead: "Tell us what you need. Morgan will reply to you personally, as soon as possible.",
    channels: "Direct contact",
    after: "What happens next",
    afterText: "We read your request and get back to you as soon as possible for a first conversation, with no obligation.",
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company or business",
      services: "Services of interest",
      message: "Message",
      privacy: "I have read the privacy notice",
      privacyLink: "privacy notice",
      required: "required",
      submit: "Send request",
      sending: "Sending…",
      success: "Request sent. We'll get back to you as soon as possible.",
      error: "Please check the highlighted fields.",
      unavailable: "The form is not active yet. Write to us directly:",
      failed: "Sending failed. Write to us directly:",
      errors: { name: "Please enter your name.", email: "Please enter a valid email.", message: "Please write a short message.", privacy: "We need your consent to reply." },
    },
  },
  notFound: { label: "Error 404", title: "Cut in the edit.", text: "This page doesn't exist or has moved.", home: "Back to home" },
};

const content: Record<Locale, Content> = { it, en };

export function getPages(locale: Locale): Content {
  return content[locale];
}

/** Collegamento servizio → progetti reali che lo hanno usato. */
export const serviceProjects: Record<ServiceSlug, string[]> = {
  "web-design": ["osteria-il-tormentone", "sudditalia", "22side"],
  "e-commerce": ["sudditalia", "22side"],
  branding: ["acanfora-creative"],
  "social-media": ["oro-croccante"],
  "digital-marketing": [],
  "digital-ai": ["korme"],
};
