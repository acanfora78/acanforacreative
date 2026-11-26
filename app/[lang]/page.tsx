import { notFound } from "next/navigation";
import { Closing, FeaturedWork, Hero, Manifesto, Method, ServicesIndex, StudioTeaser } from "@/components/home/Sections";
import { chapters } from "@/components/journey/chapters";
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

  // Ogni sezione della home è un capitolo del viaggio (components/journey/chapters.ts).
  const scenes: Record<string, React.ReactNode> = {
    obiettivo: <Hero locale={lang} t={t} />,
    manifesto: <Manifesto t={t} />,
    progetti: <FeaturedWork locale={lang} t={t} projects={featuredProjects} />,
    servizi: <ServicesIndex locale={lang} t={t} />,
    metodo: <Method t={t} />,
    studio: <StudioTeaser locale={lang} t={t} />,
    contatto: <Closing locale={lang} t={t} />,
  };
  // Dati per la pellicola del capitolo 3: solo immagini reali (cover), altrimenti fotogramma tipografico.
  const journeyProjects = featuredProjects.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category[lang],
    year: p.year,
    cover: p.cover && !p.cover.src.endsWith(".svg") ? p.cover.src : undefined,
  }));

  return (
    <>
      <Header locale={lang} t={t} current="home" />
      <PageTransition>
        <main id="contenuto">
          <MotionScope>
            {/* Fase 10: un solo viaggio in zoom guidato dallo scroll. Ogni sezione è un capitolo. */}
            <JourneyClient nav={t.journey.nav} labels={t.journey.chapters} projects={journeyProjects}>
              {chapters.map((c) => (
                <div key={c.id} data-chapter={c.id} data-pin={c.pin ? "" : undefined} data-stage={c.stage ? "" : undefined}>
                  {scenes[c.id]}
                </div>
              ))}
            </JourneyClient>
          </MotionScope>
        </main>
      </PageTransition>
      <Footer locale={lang} t={t} />
      <StructuredData locale={lang} description={t.meta.description} services={t.services.items.map((s) => s.name)} />
    </>
  );
}
