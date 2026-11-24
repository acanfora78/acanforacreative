import { CookieText } from "@/components/legal/LegalTexts";
import { PageIntro, PageShell } from "@/components/site/Page";
import { pageMeta, resolveLocale } from "@/lib/page";

export async function generateMetadata({ params }: PageProps<"/[lang]/cookie">) {
  const { locale } = await resolveLocale(params);
  return pageMeta(locale, "cookie", "Cookie policy", locale === "en" ? "Cookies used by this site" : "Cookie usati da questo sito");
}

export default async function CookiePage({ params }: PageProps<"/[lang]/cookie">) {
  const { locale, t } = await resolveLocale(params);
  return (
    <PageShell locale={locale} t={t} current="cookie">
      <PageIntro label={t.footer.legal} title="Cookie policy" />
      <section className="theme-dark pb-[var(--spacing-section)]">
        <div className="legal container-site max-w-3xl">
          <CookieText locale={locale} />
        </div>
      </section>
    </PageShell>
  );
}
