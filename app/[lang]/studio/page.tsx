import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Label } from "@/components/primitives/Typography";
import { PageIntro, PageShell, SectionHead } from "@/components/site/Page";
import { studio } from "@/content/site";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale } from "@/lib/page";

const pad = (n: number) => String(n).padStart(2, "0");

export async function generateMetadata({ params }: PageProps<"/[lang]/studio">) {
  const { locale, p } = await resolveLocale(params);
  return pageMeta(locale, "studio", p.studio.label, p.studio.lead);
}

export default async function StudioPage({ params }: PageProps<"/[lang]/studio">) {
  const { locale, t, p } = await resolveLocale(params);
  const s = p.studio;

  return (
    <PageShell locale={locale} t={t} current="studio">
      <PageIntro label={s.label} title={s.title} lead={s.lead} />

      <section aria-labelledby="values" className="theme-light py-[var(--spacing-section)]">
        <div className="container-site">
          <SectionHead id="values" label={s.valuesLabel} title={s.valuesTitle} />
          <ul className="grid gap-12 md:grid-cols-3 md:gap-[var(--spacing-gutter)]">
            {s.values.map((v) => (
              <li key={v.name} className="border-t border-fg pt-6">
                <h3 className="font-display text-heading">{v.name}</h3>
                <p className="mt-4 text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="method" className="theme-dark py-[var(--spacing-section)]">
        <div className="container-site">
          <SectionHead id="method" label={s.methodLabel} title={s.methodTitle} />
          <ol className="border-t border-line">
            {s.method.map((m, i) => (
              <li key={m.name} className="grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-[var(--spacing-gutter)]">
                <span className="label text-muted md:col-span-1">{pad(i + 1)}</span>
                <h3 className="font-display text-heading md:col-span-4">{m.name}</h3>
                <p className="md:col-span-4">{m.text}</p>
                <p className="text-muted md:col-span-3">
                  <span className="label mb-2 block text-accent">{s.outputLabel}</span>
                  {m.output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="who" className="theme-dark border-t border-line py-[var(--spacing-section)]">
        <div className="container-site grid-editorial items-start gap-y-12">
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
            <Label className="mb-4">{s.whoLabel}</Label>
            <h2 id="who" className="font-display text-display-l">
              {studio.owner}
            </h2>
            <p className="label mt-4 text-muted">{t.studio.role}</p>
            <div className="mt-10 space-y-5 text-lead font-light">
              {s.bio.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <div className="mt-12">
              <Label className="mb-5">{s.skillsLabel}</Label>
              <ul className="flex flex-wrap gap-2">
                {s.skills.map((k) => (
                  <li key={k} className="border border-line px-3 py-2 text-small text-muted">
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="theme-light py-[var(--spacing-section)]">
        <div className="container-site flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display text-display-l text-balance">{t.closing.titleLines.join(" ")}</h2>
          <Button href={href(locale, "contatti")}>{t.closing.primary}</Button>
        </div>
      </section>
    </PageShell>
  );
}
