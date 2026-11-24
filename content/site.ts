/**
 * Dati dello studio. Contatti approvati dal titolare il 24/11/2026.
 * Dati legali e dominio: segnaposto finché non confermati (regola in CLAUDE.md).
 */
export const studio = {
  name: "ACANFORA CREATIVE",
  owner: "Morgan Acanfora",
  email: "morganacanfora5@gmail.com",
  whatsapp: { number: "393290211669", display: "+39 329 021 1669" },
  instagram: { handle: "@acanforacreative", url: "https://www.instagram.com/acanforacreative/" },
  legal: {
    // TODO: dati legali da confermare dal titolare
    holder: "[[Titolare — DA CONFERMARE]]",
    address: "[[Sede — DA CONFERMARE]]",
    vat: "[[P.IVA — DA CONFERMARE]]",
  },
  // TODO: dominio da scegliere
  domain: "[[DOMINIO — DA CONFERMARE]]",
} as const;

export function whatsappHref(text: string) {
  return `https://wa.me/${studio.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export function mailHref(subject: string) {
  return `mailto:${studio.email}?subject=${encodeURIComponent(subject)}`;
}
