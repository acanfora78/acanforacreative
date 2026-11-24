import { Label } from "@/components/primitives/Typography";
import { PageIntro, PageShell } from "@/components/site/Page";
import { mailHref, studio, whatsappHref } from "@/content/site";
import { href } from "@/lib/i18n";
import { pageMeta, resolveLocale } from "@/lib/page";
import { ContactForm } from "./ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contatti">) {
  const { locale, p } = await resolveLocale(params);
  return pageMeta(locale, "contatti", p.contact.label, p.contact.lead);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contatti">) {
  const { locale, t, p } = await resolveLocale(params);
  const c = p.contact;
  const mail = mailHref(t.closing.emailSubject);
  const wa = whatsappHref(t.closing.whatsappMessage);

  return (
    <PageShell locale={locale} t={t} current="contatti">
      <PageIntro label={c.label} title={c.title} lead={c.lead} />
      <section aria-label={c.label} className="theme-dark pb-[var(--spacing-section)]">
        <div className="container-site grid-editorial gap-y-16">
          <div className="col-span-4 space-y-10 md:col-span-8 lg:col-span-4">
            <div>
              <Label className="mb-4">{c.channels}</Label>
              <ul className="space-y-3 border-t border-line pt-4 text-lead font-light">
                <li>
                  <a href={mail} className="break-all hover:text-accent">
                    {studio.email}
                  </a>
                </li>
                <li>
                  <a href={wa} className="hover:text-accent">
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
            <div>
              <Label className="mb-4">{c.after}</Label>
              <p className="border-t border-line pt-4 text-muted">{c.afterText}</p>
            </div>
          </div>
          <div className="relative col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <ContactForm
              locale={locale}
              f={c.form}
              services={p.services.items.map((s) => ({ slug: s.slug, name: s.name }))}
              privacyHref={href(locale, "privacy")}
              mailHref={mail}
              whatsappHref={wa}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
