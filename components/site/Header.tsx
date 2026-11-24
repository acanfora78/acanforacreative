import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/content/dictionaries";
import { href, type Locale, type RouteKey } from "@/lib/i18n";

/**
 * Intestazione del sito. Su telefono il menu usa <details>: funziona anche senza JavaScript.
 * `current` serve al selettore di lingua per portare alla stessa pagina nell'altra lingua.
 */
export function Header({
  locale,
  t,
  current = "home",
  slug,
}: {
  locale: Locale;
  t: Dictionary;
  current?: RouteKey;
  /** Sotto-pagina (es. slug del case study) da mantenere cambiando lingua. */
  slug?: string;
}) {
  const other: Locale = locale === "it" ? "en" : "it";
  const links = [
    { key: "studio", label: t.nav.studio },
    { key: "servizi", label: t.nav.services },
    { key: "lavori", label: t.nav.work },
  ] as const;

  const langSwitch = (
    <Link href={slug ? href(other, current, slug) : href(other, current)} hrefLang={other} lang={other} className="label text-muted transition-colors hover:text-fg">
      <span aria-hidden="true">{other.toUpperCase()}</span>
      <span className="sr-only">{t.nav.switchTo}</span>
    </Link>
  );

  return (
    <header className="theme-dark absolute inset-x-0 top-0 z-40">
      <div className="container-site flex h-20 items-center justify-between gap-6 md:h-24">
        <Link href={href(locale, "home")} aria-label="ACANFORA CREATIVE — Home" className="-ml-3 block">
          <Logo variant="lockup-dark" width={170} preload alt="" />
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.key}
              href={href(locale, l.key)}
              aria-current={current === l.key ? "page" : undefined}
              className="fx-link label text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
            >
              {l.label}
            </Link>
          ))}
          {langSwitch}
          <Link
            href={href(locale, "contatti")}
            className="label inline-flex min-h-11 items-center border border-fg/40 px-5 transition-colors hover:border-fg"
          >
            {t.nav.contact}
          </Link>
        </nav>

        <details className="group md:hidden">
          <summary className="label flex min-h-11 cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{t.nav.menu}</span>
            <span className="hidden group-open:inline">{t.nav.close}</span>
          </summary>
          <nav aria-label="Principale" className="fixed inset-x-0 top-20 bottom-0 bg-bg">
            <ul className="container-site flex flex-col gap-2 pt-10">
              {[...links, { key: "contatti" as const, label: t.nav.contact }].map((l) => (
                <li key={l.key}>
                  <Link href={href(locale, l.key)} className="font-display block py-2 text-display-m">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-8">{langSwitch}</li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
