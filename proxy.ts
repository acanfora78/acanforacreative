import { NextResponse, type NextRequest } from "next/server";
import { publishedProjects } from "@/content/projects";
import { correctSegment, defaultLocale, internalSegment, isLocale, type Locale } from "@/lib/i18n";

// Progetti pubblicati: gli altri slug (nascosti o inesistenti) devono rispondere 404.
const workSlugs = new Set(publishedProjects.map((p) => p.slug));

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
  if (!second) return remember(NextResponse.next(), request, locale);

  const fixed = correctSegment(locale, second);
  if (fixed !== undefined) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + [locale, fixed, ...rest].join("/");
    return NextResponse.redirect(url, 308);
  }

  const internal = internalSegment(locale, second);

  // Case study: con Cache Components non esiste dynamicParams=false, quindi gli slug non pubblicati
  // vengono mandati al catch-all, che risponde con un vero 404.
  if (internal === "lavori" && rest.length > 0 && (rest.length > 1 || !workSlugs.has(rest[0]))) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/_404`;
    return NextResponse.rewrite(url);
  }
  if (internal !== undefined && internal !== second) {
    const url = request.nextUrl.clone();
    url.pathname = "/" + [locale, internal, ...rest].join("/");
    return remember(NextResponse.rewrite(url), request, locale);
  }

  return remember(NextResponse.next(), request, locale);
}

/** Cookie tecnico "lang" (documentato nella cookie policy): ricorda l'ultima lingua visitata. */
function remember(response: NextResponse, request: NextRequest, locale: Locale) {
  if (request.cookies.get("lang")?.value !== locale) {
    response.cookies.set("lang", locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return response;
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
