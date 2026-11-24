import { PrivacyText } from "@/components/legal/LegalTexts";
import { PageIntro, PageShell } from "@/components/site/Page";
import { pageMeta, resolveLocale } from "@/lib/page";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  const { locale } = await resolveLocale(params);
  return pageMeta(locale, "privacy", locale === "en" ? "Privacy policy" : "Informativa privacy", "GDPR art. 13");
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { locale, t } = await resolveLocale(params);
  return (
    <PageShell locale={locale} t={t} current="privacy">
      <PageIntro label={t.footer.legal} title={locale === "en" ? "Privacy policy" : "Informativa privacy"} />
      <section className="theme-dark pb-[var(--spacing-section)]">
        <div className="legal container-site max-w-3xl">
          <PrivacyText locale={locale} />
        </div>
      </section>
    </PageShell>
  );
}
