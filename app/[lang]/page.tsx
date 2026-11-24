import { notFound } from "next/navigation";
import { Closing, FeaturedWork, Hero, Manifesto, Method, ServicesIndex, StudioTeaser } from "@/components/home/Sections";
import { MotionScope } from "@/components/motion/MotionScope";
import { PageTransition } from "@/components/motion/PageTransition";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getDictionary } from "@/content/dictionaries";
import { featuredProjects } from "@/content/projects";
import { isLocale } from "@/lib/i18n";

/** Homepage (fase 4): prototipo statico, stessa struttura approvata nei wireframe. */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Header locale={lang} t={t} current="home" />
      <PageTransition>
        <main id="contenuto">
          <MotionScope>
            <Hero locale={lang} t={t} />
            <Manifesto t={t} />
            <FeaturedWork locale={lang} t={t} projects={featuredProjects} />
            <ServicesIndex locale={lang} t={t} />
            <Method t={t} />
            <StudioTeaser locale={lang} t={t} />
            <Closing locale={lang} t={t} />
          </MotionScope>
        </main>
      </PageTransition>
      <Footer locale={lang} t={t} />
    </>
  );
}
