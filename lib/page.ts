import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionaries";
import { getPages } from "@/content/pages";
import { href, isLocale, locales, type Locale, type RouteKey } from "@/lib/i18n";

/** Lingua dalla route, con 404 se non valida, più i testi già pronti. */
export async function resolveLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return { locale: lang as Locale, t: getDictionary(lang), p: getPages(lang) };
}

/** Metadata di pagina con alternative di lingua. Sito non indicizzabile fino al lancio. */
export function pageMeta(locale: Locale, key: RouteKey, title: string, description: string, slug?: string): Metadata {
  const path = (l: Locale) => (slug ? href(l, key, slug) : href(l, key));
  return {
    title: `${title} — ACANFORA CREATIVE`,
    description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: path(locale),
      languages: { ...Object.fromEntries(locales.map((l) => [l, path(l)])), "x-default": path("it") },
    },
  };
}
