/**
 * Dati dello studio. Contatti approvati dal titolare il 24/11/2026.
 * Dominio: segnaposto finché non acquistato (regola in CLAUDE.md).
 */
export const studio = {
  name: "ACANFORA CREATIVE",
  owner: "Morgan Acanfora",
  email: "morganacanfora5@gmail.com",
  whatsapp: { number: "393290211669", display: "+39 329 021 1669" },
  instagram: { handle: "@acanforacreative", url: "https://www.instagram.com/acanforacreative/" },
  // Dati legali dal certificato di attribuzione P.IVA (Agenzia delle Entrate, 09/07/2025), approvati dal titolare.
  // Il codice fiscale NON va pubblicato.
  legal: {
    holder: "SMM di Acanfora Morgan",
    form: "Ditta individuale",
    address: "Via Lo Porto 111/D, 84018 Scafati (SA)",
    vat: "06367880652",
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
