import type { MetadataRoute } from "next";
import { publishedProjects } from "@/content/projects";
import { href, locales, type Locale, type RouteKey } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";

/** Sitemap di tutte le pagine pubbliche, con le alternative di lingua (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().origin;
  const entry = (key: RouteKey, priority: number, slug?: string) => {
    const url = (l: Locale) => base + (slug ? href(l, key, slug) : href(l, key));
    return locales.map((locale) => ({
      url: url(locale),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l)])) },
    }));
  };
  return [
    ...entry("home", 1),
    ...entry("studio", 0.8),
    ...entry("servizi", 0.9),
    ...entry("lavori", 0.9),
    ...entry("contatti", 0.8),
    ...publishedProjects.flatMap((p) => entry("lavori", 0.7, p.slug)),
    ...entry("privacy", 0.2),
    ...entry("cookie", 0.2),
  ];
}
