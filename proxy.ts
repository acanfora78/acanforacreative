import { NextResponse, type NextRequest } from "next/server";
import { correctSegment, defaultLocale, internalSegment, isLocale, type Locale } from "@/lib/i18n";

/**
 * Lingue (Next 16: proxy.ts sostituisce middleware.ts).
 * - "/" e percorsi senza lingua → redirect alla lingua del cookie, poi del browser, poi italiano.
 * - Segmento dell'altra lingua (es. /en/servizi) → redirect a quello giusto (/en/services).
 * - Segmento inglese tradotto (es. /en/services) → rewrite alla cartella interna (/en/servizi).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [first, second, ...rest] = pathname.split("/").filter(Boolean);

  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const locale: Locale = first;
  if (!second) return NextResponse.next();

  const fixed = correctSegment(locale, second);
  if (fixed !== undefined) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + [locale, fixed, ...rest].join("/");
    return NextResponse.redirect(url, 308);
  }

  const internal = internalSegment(locale, second);
  if (internal !== undefined && internal !== second) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + [locale, internal, ...rest].join("/");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("lang")?.value;
  if (cookie && isLocale(cookie)) return cookie;
  const accept = request.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export const config = {
  // Esclude file interni, file statici (con estensione) e pagine interne di revisione.
  matcher: ["/((?!_next|api|design-system|wireframes|.*\\.[^/]+$).*)"],
};
