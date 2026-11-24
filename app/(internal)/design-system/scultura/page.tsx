import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { Display, Label } from "@/components/primitives/Typography";
import { Sculpture } from "@/components/sculpture/Sculpture";

export const metadata: Metadata = {
  title: "Scultura 3D — revisione interna — ACANFORA CREATIVE",
  robots: { index: false, follow: false },
};

/*
 * Pagina interna di revisione della fase 9.2 (modellazione e lookdev).
 * Non fa parte del sito pubblico ed è bloccata in produzione dal proxy.
 * I blocchi con id "capture-*" servono a generare le immagini di riserva.
 */

const cells = [
  {
    id: "live-tq",
    title: "Livello 2 — 3D completo",
    note: "Vista di tre quarti, movimento lento e puntatore. Sul sito: computer.",
    tier: 2,
    view: "tq",
    still: false,
  },
  {
    id: "live-t1",
    title: "Livello 1 — 3D leggero",
    note: "Meno poligoni, 30 fps, DPR ≤ 1,25, senza puntatore. Sul sito: telefoni e dispositivi modesti.",
    tier: 1,
    view: "tq",
    still: false,
  },
  {
    id: "capture-tq",
    title: "Posa di base — livello 0",
    note: "Ferma. È anche l’immagine di riserva: senza JavaScript, WebGL assente, risparmio dati o “riduci movimento”.",
    tier: 2,
    view: "tq",
    still: true,
  },
  {
    id: "capture-front",
    title: "Vista frontale",
    note: "Di fronte la scultura riprende la silhouette del simbolo master.",
    tier: 2,
    view: "front",
    still: true,
  },
] as const;

export default function SculturaPage() {
  return (
    <main className="theme-dark min-h-svh">
      <header className="container-site flex items-center justify-between border-b border-line py-8">
        <Logo variant="symbol-app" width={40} preload />
        <Label>Fase 9.2 · Revisione interna</Label>
      </header>

      <section className="container-site py-16">
        <Label className="mb-6">Concept C — Lama</Label>
        <Display as="h1" size="l">
          Scultura master
        </Display>
        <p className="prose-measure mt-6 text-lead font-light text-muted">
          Interpretazione in metallo satinato del simbolo ad anello aperto. La
          forma è calcolata dal tracciato del logo master, senza modificarlo:
          una sezione affilata che ruota di quasi mezzo giro lungo il percorso.
          Il logo resta il marchio; la scultura vive solo nel sito.
        </p>
      </section>

      <section className="container-site pb-16">
        <div className="grid gap-px border border-line bg-line md:grid-cols-2">
          {cells.map((c) => (
            <figure key={c.id} className="bg-bg">
              <div id={c.id} className="aspect-[4/3] w-full">
                <Sculpture
                  className="h-full w-full"
                  view={c.view}
                  tier={c.tier}
                  still={c.still}
                  poster={`/sculpture/poster-${c.view}.avif`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <figcaption className="border-t border-line p-6">
                <p className="font-medium">{c.title}</p>
                <p className="mt-1 text-sm text-muted">{c.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
