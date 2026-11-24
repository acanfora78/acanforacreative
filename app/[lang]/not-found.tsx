import { Button } from "@/components/primitives/Button";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getDictionary } from "@/content/dictionaries";
import { getPages } from "@/content/pages";
import { href } from "@/lib/i18n";

/**
 * 404 del sito. not-found non riceve i parametri della route:
 * testo bilingue con italiano come lingua principale.
 */
export default function NotFound() {
  const t = getDictionary("it");
  const it = getPages("it").notFound;
  const en = getPages("en").notFound;
  return (
    <>
      <Header locale="it" t={t} />
      <main id="contenuto" className="theme-dark">
        <div className="container-site flex min-h-svh flex-col justify-center py-40">
          <p className="label mb-8 text-muted">{it.label}</p>
          <h1 className="font-display text-display-xl text-balance">{it.title}</h1>
          <p className="mt-6 text-lead font-light text-muted" lang="en">
            {en.title}
          </p>
          <p className="mt-10 text-muted">
            {it.text} <span lang="en">{en.text}</span>
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={href("it", "home")}>{it.home}</Button>
            <Button href={href("en", "home")} variant="secondary">
              <span lang="en">{en.home}</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer locale="it" t={t} />
    </>
  );
}
