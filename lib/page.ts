import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { getPages } from "@/content/pages";
import { href, isLocale, locales, type Locale, type RouteKey } from "@/lib/i18n";
import { ogImage, robotsMeta } from "@/lib/site-url";

/** Lingua dalla route, con 404 se non valida, più i testi già pronti. */
export async function resolveLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { locale: lang as Locale, t: getDictionary(lang), p: getPages(lang) };
}

/** Metadata di pagina con canonical, alternative di lingua e Open Graph. Indicizzazione da SITE_INDEXABLE. */
export function pageMeta(locale: Locale, key: RouteKey, title: string, description: string, slug?: string): Metadata {
  const path = (l: Locale) => (slug ? href(l, key, slug) : href(l, key));
  const fullTitle = `${title} — ACANFORA CREATIVE`;
  return {
    title: fullTitle,
    description,
    robots: robotsMeta,
    openGraph: {
      type: "website",
      siteName: "ACANFORA CREATIVE",
      locale: locale === "it" ? "it_IT" : "en_US",
      url: path(locale),
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", images: [ogImage.url] },
    alternates: {
      canonical: path(locale),
      languages: { ...Object.fromEntries(locales.map((l) => [l, path(l)])), "x-default": path("it") },
    },
  };
}
