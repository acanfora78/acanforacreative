import Image from "next/image";
import { SharedCover } from "@/components/motion/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo, type LogoVariant } from "@/components/brand/Logo";
import { ProjectCover } from "@/components/home/Sections";
import { Button } from "@/components/primitives/Button";
import { Label } from "@/components/primitives/Typography";
import { PageShell } from "@/components/site/Page";
import { publishedProjects } from "@/content/projects";
import { href, locales } from "@/lib/i18n";
import { pageMeta, resolveLocale } from "@/lib/page";

export function generateStaticParams() {
  return locales.flatMap((lang) => publishedProjects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/lavori/[slug]">) {
  const { slug } = await params;
  const { locale } = await resolveLocale(params);
  const project = publishedProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return pageMeta(locale, "lavori", project.name, project.summary[locale], slug);
}

// File reali del logo dello studio, mostrati nel progetto interno di identità.
const brandFiles: LogoVariant[] = ["master-dark", "master-light", "lockup-light", "symbol-app"];

export default async function CaseStudyPage({ params }: PageProps<"/[lang]/lavori/[slug]">) {
  const { slug } = await params;
  const { locale, t, p } = await resolveLocale(params);
  const index = publishedProjects.findIndex((pr) => pr.slug === slug);
  if (index === -1) notFound();
  const pr = publishedProjects[index];
  const next = publishedProjects[(index + 1) % publishedProjects.length];
  const c = p.caseStudy;
  const kind = t.work.kinds[pr.kind];

  return (
    <PageShell locale={locale} t={t} current="lavori" slug={slug}>
      <section aria-labelledby="cs-title" className="theme-dark">
        <div className="container-site pt-40 md:pt-48">
          <Link href={href(locale, "lavori")} className="label text-muted hover:text-fg">
            ← {c.back}
          </Link>
          <h1 id="cs-title" className="font-display mt-10 text-display-xl text-balance">
            <span className="intro-line">
              <span>{pr.name}</span>
            </span>
          </h1>
          {kind && <p className="label mt-6 text-accent">{kind}</p>}
          <dl className="intro-fade mt-12 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4 [--d:0.7s]">
            {pr.kind === "client" && (
              <div>
                <dt className="label text-muted">{c.client}</dt>
                <dd className="mt-2">{pr.name}</dd>
              </div>
            )}
            <div>
              <dt className="label text-muted">{c.type}</dt>
              <dd className="mt-2">{pr.category[locale]}</dd>
            </div>
            <div>
              <dt className="label text-muted">{c.year}</dt>
              <dd className="mt-2">{pr.year}</dd>
            </div>
            <div>
              <dt className="label text-muted">{c.services}</dt>
              <dd className="mt-2">{pr.services[locale].join(", ")}</dd>
            </div>
          </dl>
        </div>
        <div className="container-site py-16">
          <SharedCover slug={pr.slug}>
            <div className="relative aspect-[4/5] overflow-hidden border border-line sm:aspect-[16/9]">
              <ProjectCover project={pr} locale={locale} t={t} large />
            </div>
          </SharedCover>
        </div>
      </section>

      <section aria-labelledby="overview" className="theme-light py-[var(--spacing-section)]">
        <div className="container-site grid-editorial gap-y-10">
          <Label className="col-span-4 md:col-span-2">{c.overview}</Label>
          <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-4">
            <h2 id="overview" className="sr-only">
              {c.overview}
            </h2>
            <p data-split className="font-display text-display-m text-pretty">{pr.summary[locale]}</p>
            <h3 className="label mt-14 mb-5 text-muted">{c.done}</h3>
            <ul data-stagger className="border-t border-line">
              {pr.services[locale].map((sv) => (
                <li key={sv} className="border-b border-line py-4 text-lead">
                  {sv}
                </li>
              ))}
            </ul>
            {pr.url && (
              <div className="mt-12">
                <Button href={pr.url} target="_blank" rel="noopener noreferrer">
                  {c.visit} ↗
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {(pr.cover?.mobile || pr.slug === "acanfora-creative") && (
        <section aria-labelledby="gallery" className="theme-dark py-[var(--spacing-section)]">
          <div className="container-site">
            <h2 id="gallery" className="font-display mb-12 text-display-m">
              {pr.slug === "acanfora-creative" ? c.brandFiles : c.gallery}
            </h2>
            {pr.slug === "acanfora-creative" ? (
              <ul className="grid gap-[var(--spacing-gutter)] sm:grid-cols-2">
                {brandFiles.map((v) => (
                  <li key={v} className="flex aspect-[4/3] items-center justify-center border border-line bg-avorio p-8 first:bg-nero last:bg-graphite">
                    <Logo variant={v} width={v === "symbol-app" ? 140 : 320} alt={`ACANFORA CREATIVE — ${v}`} />
                  </li>
                ))}
              </ul>
            ) : (
              pr.cover && (
                <div className="grid gap-[var(--spacing-gutter)] md:grid-cols-12">
                  <figure className="md:col-span-8">
                    <div className="relative aspect-[16/10] overflow-hidden border border-line">
                      <Image src={pr.cover.src} alt={pr.cover.alt[locale]} fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover object-top" />
                    </div>
                    <figcaption className="label mt-3 text-muted">{c.desktop}</figcaption>
                  </figure>
                  {pr.cover.mobile && (
                    <figure className="md:col-span-4">
                      <div className="relative mx-auto aspect-[390/844] max-w-xs overflow-hidden rounded-[2rem] border border-line">
                        <Image src={pr.cover.mobile} alt={pr.cover.alt[locale]} fill sizes="(min-width: 768px) 25vw, 80vw" className="object-cover object-top" />
                      </div>
                      <figcaption className="label mt-3 text-center text-muted">{c.mobile}</figcaption>
                    </figure>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      <section className="theme-dark border-t border-line py-[var(--spacing-section)]">
        <div className="container-site grid gap-16 md:grid-cols-2">
          <Link href={href(locale, "lavori", next.slug)} className="group block">
            <Label className="mb-6">{c.next}</Label>
            <p className="font-display text-display-m transition-colors group-hover:text-accent">{next.name} →</p>
          </Link>
          <div>
            <h2 className="font-display text-display-m">{c.ctaTitle}</h2>
            <div className="mt-8">
              <Button href={href(locale, "contatti")}>{c.ctaButton}</Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
