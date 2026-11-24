import Link from "next/link";
import { ProjectCover } from "@/components/home/Sections";
import { PageIntro, PageShell } from "@/components/site/Page";
import { publishedProjects } from "@/content/projects";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale } from "@/lib/page";

export async function generateMetadata({ params }: PageProps<"/[lang]/lavori">) {
  const { locale, p } = await resolveLocale(params);
  return pageMeta(locale, "lavori", p.work.label, p.work.lead);
}

export default async function WorkPage({ params }: PageProps<"/[lang]/lavori">) {
  const { locale, t, p } = await resolveLocale(params);

  return (
    <PageShell locale={locale} t={t} current="lavori">
      <PageIntro label={p.work.label} title={p.work.title} lead={p.work.lead} />
      <section aria-label={p.work.label} className="theme-dark pb-[var(--spacing-section)]">
        <ul className="container-site grid gap-x-[var(--spacing-gutter)] gap-y-20 md:grid-cols-2">
          {publishedProjects.map((pr) => {
            const kind = t.work.kinds[pr.kind];
            return (
              <li key={pr.slug}>
                <Link href={href(locale, "lavori", pr.slug)} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden border border-line sm:aspect-[4/3]">
                    <ProjectCover project={pr} locale={locale} t={t} />
                  </div>
                  <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h2 className="font-display text-heading">{pr.name}</h2>
                    <p className="label text-muted">
                      {pr.category[locale]} · {pr.year}
                    </p>
                  </div>
                  <p className="mt-2 max-w-xl text-muted">{pr.summary[locale]}</p>
                  {kind && <p className="label mt-3 text-accent">{kind}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </PageShell>
  );
}
