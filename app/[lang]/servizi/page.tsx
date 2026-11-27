import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { Label } from "@/components/primitives/Typography";
import { PageIntro, PageShell, SectionHead } from "@/components/site/Page";
import { serviceProjects } from "@/content/pages";
import { publishedProjects } from "@/content/projects";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale } from "@/lib/page";

const pad = (n: number) => String(n).padStart(2, "0");

export async function generateMetadata({ params }: PageProps<"/[lang]/servizi">) {
  const { locale, p } = await resolveLocale(params);
  return pageMeta(locale, "servizi", p.services.label, p.services.lead);
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/servizi">) {
  const { locale, t, p } = await resolveLocale(params);
  const s = p.services;

  return (
    <PageShell locale={locale} t={t} current="servizi">
      <PageIntro label={s.label} title={s.title} lead={s.lead}>
        <nav aria-label={s.label} className="mt-12">
          <ul className="flex flex-wrap gap-2">
            {s.items.map((item) => (
              <li key={item.slug}>
                <a href={`#${item.slug}`} className="label inline-flex min-h-11 items-center border border-line px-4 text-muted hover:border-fg hover:text-fg">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      {s.items.map((item, i) => {
        const related = publishedProjects.filter((pr) => serviceProjects[item.slug].includes(pr.slug));
        return (
          <section
            key={item.slug}
            id={item.slug}
            aria-labelledby={`${item.slug}-title`}
            className={`${i % 2 === 0 ? "theme-light" : "theme-dark"} scroll-mt-8 py-[var(--spacing-section)]`}
          >
            <div className="container-site grid-editorial gap-y-12">
              <div className="col-span-4 md:col-span-8 lg:col-span-5">
                <p className="label mb-6 text-muted">{pad(i + 1)}</p>
                <h2 id={`${item.slug}-title`} className="k-up font-display text-display-m text-balance">
                  {item.name}
                </h2>
                <p className="mt-8 text-lead font-light">{item.intro}</p>
              </div>
              <div className="col-span-4 grid gap-10 sm:grid-cols-2 md:col-span-8 lg:col-span-6 lg:col-start-7">
                <div>
                  <Label className="mb-4">{s.includesLabel}</Label>
                  <ul className="space-y-3 border-t border-line pt-4">
                    {item.includes.map((inc) => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Label className="mb-4">{s.forWhoLabel}</Label>
                  <p className="border-t border-line pt-4 text-muted">{item.forWho}</p>
                </div>
                {related.length > 0 && (
                  <div className="sm:col-span-2">
                    <Label className="mb-4">{s.relatedLabel}</Label>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
                      {related.map((pr) => (
                        <li key={pr.slug}>
                          <Link href={href(locale, "lavori", pr.slug)} className="font-display text-heading hover:text-accent">
                            {pr.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <Button href={`${href(locale, "contatti")}?servizio=${item.slug}`}>{s.cta}</Button>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section aria-labelledby="faq" className="theme-dark border-t border-line py-[var(--spacing-section)]">
        <div className="container-site grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <SectionHead id="faq" label={s.faqLabel} title={s.faqLabel} />
          </div>
          <div className="col-span-4 border-t border-line md:col-span-8 lg:col-span-7 lg:col-start-6">
            {s.faq.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lead [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-2xl text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="prose-measure pb-6 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
