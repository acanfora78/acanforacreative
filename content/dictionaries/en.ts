import type { Dictionary } from "./it";

/** English copy. No invented results, figures or testimonials. */
export const en = {
  meta: {
    title: "ACANFORA CREATIVE — Creative Digital Studio",
    description:
      "Creative digital studio: visual identities, websites, e-commerce, social media and digital solutions crafted with the care of a film production.",
  },
  nav: {
    studio: "Studio",
    services: "Services",
    work: "Work",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    switchTo: "Italiano",
  },
  hero: {
    eyebrow: "Creative Digital Studio",
    titleLines: ["Every brand has a story.", "We put it on screen."],
    text: "Visual identities, websites, e-commerce and digital content, crafted with the care of a film production.",
    primary: "Let's talk about your project",
    secondary: "See the work",
    scroll: "Scroll",
  },
  manifesto: {
    label: "Manifesto",
    text: "A strong image is never an accident. It comes from a clear story, precise choices and details refined one by one. We work like a film set: every frame has a reason.",
  },
  work: {
    label: "Selected work",
    title: "Projects",
    all: "All work",
    visit: "Visit the site",
    noImage: "Images coming soon",
    kinds: { client: "", internal: "In-house project", concept: "Demonstration concept" },
  },
  services: {
    label: "Services",
    title: "What we do",
    all: "All services",
    items: [
      { name: "Web Design", text: "Tailor-made, fast websites designed for the phone first." },
      { name: "E-commerce", text: "Online stores that tell the product's story and make buying simple." },
      { name: "Branding", text: "Consistent visual identities, from the logo to every touchpoint." },
      { name: "Social Media Management", text: "Editorial planning, content and profile management." },
      { name: "Digital Marketing", text: "Campaigns and strategy to reach the right people." },
      { name: "Digital Solutions & AI", text: "Apps, automations and custom tools for the way you work." },
    ],
  },
  method: {
    label: "Method",
    title: "How we work",
    steps: [
      { name: "Listen", text: "We learn your business, your audience and what you want to achieve." },
      { name: "Direct", text: "We define the story, the style and the project's priorities." },
      { name: "Produce", text: "We design and build, with shared reviews at every step." },
      { name: "Launch", text: "We go live and check every detail before the premiere." },
    ],
  },
  studio: {
    label: "Studio",
    title: "Behind the scenes",
    text: "Behind ACANFORA CREATIVE is Morgan Acanfora: one point of contact who follows your project from idea to launch.",
    role: "Founder and Creative Director",
    photoAlt: "Portrait of Morgan Acanfora",
    cta: "Discover the studio",
  },
  closing: {
    titleLines: ["Have a project in mind?", "Let's talk."],
    text: "Tell us what you need: Morgan will reply to you personally.",
    primary: "Write to us",
    whatsapp: "WhatsApp",
    email: "Email",
    whatsappMessage: "Hi Morgan, I'd like to talk to you about a project.",
    emailSubject: "New project",
  },
  footer: {
    tagline: "Creative Digital Studio",
    navigation: "Navigation",
    contacts: "Contact",
    legal: "Legal",
    privacy: "Privacy",
    cookies: "Cookies",
    rights: "All rights reserved.",
  },
} as const satisfies Dictionary;
