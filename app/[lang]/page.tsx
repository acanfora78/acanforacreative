import { notFound } from "next/navigation";
import { Closing, FeaturedWork, Hero, Manifesto, Method, ServicesIndex, StudioTeaser } from "@/components/home/Sections";
import { JourneyClient } from "@/components/journey/JourneyClient";
import { MotionScope } from "@/components/motion/MotionScope";
import { PageTransition } from "@/components/motion/PageTransition";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StructuredData } from "@/components/site/StructuredData";
import { getDictionary } from "@/content/dictionaries";
import { featuredProjects } from "@/content/projects";
import { isLocale } from "@/lib/i18n";

/** Homepage: struttura approvata in fase 4, movimento in fase 7, dati strutturati in fase 8, viaggio 3D in fase 10. */
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
            {/* Fase 10: un solo viaggio in zoom guidato dallo scroll. Ogni sezione è un capitolo. */}
            <JourneyClient nav={t.journey.nav} labels={t.journey.chapters}>
              <div data-chapter="obiettivo" data-stage>
                <Hero locale={lang} t={t} />
              </div>
              <div data-chapter="manifesto" data-stage>
                <Manifesto t={t} />
              </div>
              <div data-chapter="progetti">
                <FeaturedWork locale={lang} t={t} projects={featuredProjects} />
              </div>
              <div data-chapter="servizi">
                <ServicesIndex locale={lang} t={t} />
              </div>
              <div data-chapter="metodo">
                <Method t={t} />
              </div>
              <div data-chapter="studio">
                <StudioTeaser locale={lang} t={t} />
              </div>
              <div data-chapter="contatto">
                <Closing locale={lang} t={t} />
              </div>
            </JourneyClient>
          </MotionScope>
        </main>
      </PageTransition>
      <Footer locale={lang} t={t} />
      <StructuredData locale={lang} description={t.meta.description} services={t.services.items.map((s) => s.name)} />
    </>
  );
}
