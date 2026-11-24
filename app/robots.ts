import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site-url";

/** robots.txt: tutto bloccato finché SITE_INDEXABLE non è "true". Pagine interne sempre escluse. */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().origin;
  return {
    rules: indexable
      ? { userAgent: "*", allow: "/", disallow: ["/design-system", "/wireframes"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
