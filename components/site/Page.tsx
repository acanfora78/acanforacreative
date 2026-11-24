import type { ReactNode } from "react";
import { Label } from "@/components/primitives/Typography";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale, RouteKey } from "@/lib/i18n";

/** Guscio comune delle pagine interne: intestazione, contenuto, piè di pagina. */
export function PageShell({
  locale,
  t,
  current,
  slug,
  children,
}: {
  locale: Locale;
  t: Dictionary;
  current: RouteKey;
  slug?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header locale={locale} t={t} current={current} slug={slug} />
      <main id="contenuto">{children}</main>
      <Footer locale={locale} t={t} />
    </>
  );
}

/** Apertura di pagina: etichetta, titolo in Didot, testo introduttivo. */
export function PageIntro({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="theme-dark">
      <div className="container-site pt-40 pb-[var(--spacing-section)] md:pt-48">
        <Label className="mb-8">{label}</Label>
        <h1 className="font-display max-w-5xl text-display-xl text-balance">{title}</h1>
        {lead && <p className="prose-measure mt-10 text-lead font-light text-muted">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/** Intestazione di sezione: etichetta + titolo. */
export function SectionHead({ label, title, id }: { label: string; title: string; id?: string }) {
  return (
    <div className="mb-12 md:mb-16">
      <Label className="mb-4">{label}</Label>
      <h2 id={id} className="font-display text-display-l text-balance">
        {title}
      </h2>
    </div>
  );
}
