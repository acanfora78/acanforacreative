import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { fontVariables } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import { ogImage, robotsMeta, siteUrl } from "@/lib/site-url";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    // URL assoluti per canonical, hreflang e Open Graph (dominio da SITE_URL).
    metadataBase: siteUrl(),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: "ACANFORA CREATIVE",
    // Indicizzazione solo con SITE_INDEXABLE="true" (dopo l'approvazione del titolare).
    robots: robotsMeta,
    alternates: { canonical: `/${lang}`, languages: { it: "/it", en: "/en", "x-default": "/it" } },
    openGraph: {
      type: "website",
      siteName: "ACANFORA CREATIVE",
      locale: lang === "it" ? "it_IT" : "en_US",
      alternateLocale: lang === "it" ? ["en_US"] : ["it_IT"],
      url: `/${lang}`,
      title: t.meta.title,
      description: t.meta.description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", images: [ogImage.url] },
  };
}

/** Layout radice del sito pubblico: una per lingua, con <html lang> corretto. */
export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <a
          href="#contenuto"
          className="label sr-only z-50 bg-fg px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {t.nav.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
