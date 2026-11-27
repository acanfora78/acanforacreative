import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { Label } from "@/components/primitives/Typography";
import type { Dictionary } from "@/content/dictionaries";
import type { Project } from "@/content/projects";
import { mailHref, studio, whatsappHref } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";

/*
 * Sezioni della homepage. Versione senza 3D né animazioni (27/11/2026): base per il nuovo motion design.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function Hero({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="hero-title" className="theme-dark relative flex min-h-svh flex-col">
      <div className="container-site relative z-10 flex flex-1 flex-col justify-end pt-32 pb-12 md:pt-40 md:pb-16">
        <p className="label mb-8 text-muted md:mb-12">{t.hero.eyebrow}</p>
        <h1 id="hero-title" className="font-display text-display-xl text-balance">
          {t.hero.titleLines.map((line, i) => (
            <span key={i} className={`block ${i > 0 ? "text-muted" : ""}`}>
              {line}
            </span>
          ))}
        </h1>
        <div className="mt-12 grid gap-8 border-t border-line pt-8 md:mt-16 md:grid-cols-12 md:items-end">
          <p className="text-lead font-light text-muted md:col-span-6 lg:col-span-5">{t.hero.text}</p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end lg:col-span-7">
            <Button href={href(locale, "contatti")}>{t.hero.primary}</Button>
            <Button href={href(locale, "lavori")} variant="secondary">
              {t.hero.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Manifesto({ t }: { t: Dictionary }) {
  return (
    <section aria-label={t.manifesto.label} className="theme-light py-[var(--spacing-section)]">
      <div className="container-site grid-editorial">
        <Label className="col-span-4 mb-8 md:col-span-2">
          {t.manifesto.label}
        </Label>
        <p className="font-display col-span-4 text-display-m text-pretty md:col-span-8 lg:col-span-9 lg:col-start-4">
          {t.manifesto.text}
        </p>
      </div>
    </section>
  );
}

export function ProjectCover({ project, locale, t, large }: { project: Project; locale: Locale; t: Dictionary; large?: boolean }) {
  if (project.cover) {
    // Loghi SVG: interi e centrati su nero; screenshot: riempiono e partono dall'alto.
    const fit = project.cover.src.endsWith(".svg") ? "bg-nero object-contain p-[10%]" : "object-cover object-top";
    const motion = `${fit} transition-transform duration-[var(--dur-long)] ease-[var(--ease-reveal)] group-hover:scale-[1.03]`;
    // Su telefono la copertina è verticale: si usa lo screenshot mobile, se c'è.
    return (
      <div className="absolute inset-x-0 -top-[7%] -bottom-[7%]">
        {project.cover.mobile && (
          <Image src={project.cover.mobile} alt={project.cover.alt[locale]} fill sizes="100vw" className={`${motion} sm:hidden`} />
        )}
        <Image
          src={project.cover.src}
          alt={project.cover.alt[locale]}
          fill
          sizes={large ? "(min-width: 1680px) 1552px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className={`${motion} ${project.cover.mobile ? "hidden sm:block" : ""}`}
        />
      </div>
    );
  }
  // Nessuna immagine reale disponibile: copertina tipografica, senza immagini inventate.
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-surface p-8 text-center">
      <span className="font-display text-display-l">{project.name}</span>
      <span className="label text-muted">{project.category[locale]}</span>
      <span className="sr-only">{t.work.noImage}</span>
    </div>
  );
}

export function FeaturedWork({ locale, t, projects }: { locale: Locale; t: Dictionary; projects: Project[] }) {
  return (
    <section aria-labelledby="work-title" className="theme-dark py-[var(--spacing-section)]">
      <div className="container-site">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <Label className="mb-4">{t.work.label}</Label>
            <h2 id="work-title" className="font-display text-display-l">
              {t.work.title}
            </h2>
          </div>
          <Button href={href(locale, "lavori")} variant="text">
            {t.work.all}
          </Button>
        </div>

        <ul className="grid gap-x-[var(--spacing-gutter)] gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => {
            const large = i === 0;
            const kind = t.work.kinds[p.kind];
            return (
              <li key={p.slug} className={large ? "md:col-span-2" : ""}>
                <Link href={href(locale, "lavori", p.slug)} className="group block">
                    <div
                      className={`relative overflow-hidden border border-line ${large ? "aspect-[4/5] sm:aspect-[16/9]" : "aspect-[4/5] sm:aspect-[4/3]"}`}
                    >
                      <ProjectCover project={p} locale={locale} t={t} large={large} />
                    </div>
                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="font-display text-heading">{p.name}</h3>
                    <p className="label text-muted">
                      {p.category[locale]} · {p.year}
                    </p>
                  </div>
                  <p className="mt-2 max-w-xl text-muted">{p.summary[locale]}</p>
                  {kind && <p className="label mt-3 text-accent">{kind}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function ServicesIndex({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="services-title" className="theme-dark border-t border-line py-[var(--spacing-section)]">
      <div className="container-site">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <Label className="mb-4">{t.services.label}</Label>
            <h2 id="services-title" className="font-display text-display-l">
              {t.services.title}
            </h2>
          </div>
          <Button href={href(locale, "servizi")} variant="text">
            {t.services.all}
          </Button>
        </div>
        <ol className="border-t border-line">
          {t.services.items.map((s, i) => (
            <li key={s.name} className="border-b border-line">
              <Link
                href={href(locale, "servizi")}
                className="group grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-[var(--spacing-gutter)] md:py-10"
              >
                <span className="label text-muted md:col-span-1">{pad(i + 1)}</span>
                <span className="font-display text-heading transition-colors group-hover:text-accent md:col-span-6">
                  {s.name}
                </span>
                <span className="text-muted md:col-span-5">{s.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Method({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="method-title" className="theme-light py-[var(--spacing-section)]">
      <div className="container-site">
        <div>
          <Label className="mb-4">{t.method.label}</Label>
          <h2 id="method-title" className="font-display mb-12 text-display-l md:mb-20">
            {t.method.title}
          </h2>
        </div>
        <ol className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-[var(--spacing-gutter)]">
          {t.method.steps.map((s, i) => (
            <li key={s.name} className="relative pt-6">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-fg" />
              <p className="label text-muted">{pad(i + 1)}</p>
              <h3 className="font-display mt-6 text-heading">{s.name}</h3>
              <p className="mt-3 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function StudioTeaser({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="studio-title" className="theme-dark py-[var(--spacing-section)]">
      <div className="container-site grid-editorial items-center gap-y-12">
        <div className="col-span-4 md:col-span-4 lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden border border-line">
            <Image
              src="/studio/morgan-acanfora.jpg"
              alt={t.studio.photoAlt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
          <Label className="mb-4">{t.studio.label}</Label>
          <h2 id="studio-title" className="font-display text-display-l">
            {t.studio.title}
          </h2>
          <p className="mt-8 max-w-xl text-lead font-light">{t.studio.text}</p>
          <p className="label mt-8 text-muted">
            {studio.owner} — {t.studio.role}
          </p>
          <div className="mt-10">
            <Button href={href(locale, "studio")} variant="secondary">
              {t.studio.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Closing({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="closing-title" className="theme-dark border-t border-line py-[var(--spacing-section)]">
      <div className="container-site">
        <h2 id="closing-title" className="font-display text-display-xl text-balance">
          {t.closing.titleLines.map((line, i) => (
            <span key={i} className={`block ${i > 0 ? "text-muted" : ""}`}>
              {line}
            </span>
          ))}
        </h2>
        <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:items-end">
          <p className="text-lead font-light text-muted md:col-span-5">{t.closing.text}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:col-span-7 md:justify-end">
            <Button href={href(locale, "contatti")}>{t.closing.primary}</Button>
            <Button href={whatsappHref(t.closing.whatsappMessage)} variant="secondary">
              {t.closing.whatsapp}
            </Button>
            <Button href={mailHref(t.closing.emailSubject)} variant="secondary">
              {t.closing.email}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
