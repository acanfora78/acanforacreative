import { studio } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";

/**
 * Dati strutturati schema.org per la homepage: chi è lo studio, contatti, servizi.
 * Solo dati reali e approvati (nessuna recensione o valutazione).
 */
export function StructuredData({ locale, description, services }: { locale: Locale; description: string; services: string[] }) {
  const base = siteUrl().origin;
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${base}/#studio`,
    name: studio.name,
    legalName: studio.legal.holder,
    url: base + href(locale, "home"),
    logo: `${base}/brand/04_simbolo_instagram.svg`,
    image: `${base}/studio/morgan-acanfora.jpg`,
    description,
    email: studio.email,
    telephone: `+${studio.whatsapp.number}`,
    vatID: `IT${studio.legal.vat}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Lo Porto 111/D",
      postalCode: "84018",
      addressLocality: "Scafati",
      addressRegion: "SA",
      addressCountry: "IT",
    },
    founder: { "@type": "Person", name: studio.owner },
    sameAs: [studio.instagram.url],
    knowsLanguage: ["it", "en"],
    makesOffer: services.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON da dati statici del progetto: nessun contenuto inserito dagli utenti.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
