import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/content/dictionaries";
import { mailHref, studio, whatsappHref } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="theme-dark border-t border-line">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <Logo variant="negative-transparent" width={200} alt="ACANFORA CREATIVE" className="-ml-6" />
        </div>
        <nav aria-label={t.footer.navigation} className="md:col-span-3">
          <p className="label mb-5 text-muted">{t.footer.navigation}</p>
          <ul className="space-y-2">
            {(
              [
                ["studio", t.nav.studio],
                ["servizi", t.nav.services],
                ["lavori", t.nav.work],
                ["contatti", t.nav.contact],
              ] as const
            ).map(([key, label]) => (
              <li key={key}>
                <Link href={href(locale, key)} className="hover:text-accent">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="label mb-5 text-muted">{t.footer.contacts}</p>
          <ul className="space-y-2">
            <li>
              <a href={mailHref(t.closing.emailSubject)} className="break-all hover:text-accent">
                {studio.email}
              </a>
            </li>
            <li>
              <a href={whatsappHref(t.closing.whatsappMessage)} className="hover:text-accent">
                WhatsApp {studio.whatsapp.display}
              </a>
            </li>
            <li>
              <a href={studio.instagram.url} className="hover:text-accent">
                Instagram {studio.instagram.handle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-site flex flex-col gap-3 border-t border-line py-8 text-small text-muted md:flex-row md:items-center md:justify-between">
        {/* TODO: dati legali reali (titolare, sede, P.IVA) prima della pubblicazione */}
        <p>
          © 2026 {studio.legal.holder} · {studio.legal.address} · P.IVA {studio.legal.vat}
        </p>
        <ul className="flex gap-6">
          <li>
            <Link href={href(locale, "privacy")} className="hover:text-fg">
              {t.footer.privacy}
            </Link>
          </li>
          <li>
            <Link href={href(locale, "cookie")} className="hover:text-fg">
              {t.footer.cookies}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
