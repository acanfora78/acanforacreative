import Link from "next/link";

const items = [
  ["home", "Home", "7 scene: apertura, manifesto, lavori, servizi, metodo, studio, chiusura"],
  ["studio", "Studio", "Manifesto, approccio, metodo, chi c'è dietro"],
  ["servizi", "Servizi", "6 capitoli, ognuno con richiesta diretta"],
  ["lavori", "Lavori", "Filtri e griglia degli 8 progetti"],
  ["case-study", "Case study", "Modello unico per ogni progetto"],
  ["contatti", "Contatti", "Canali diretti e modulo"],
];

export default function WireframesIndex() {
  return (
    <main className="mx-auto min-h-dvh max-w-3xl bg-neutral-100 px-5 py-16 text-neutral-800">
      <p className="mb-2 text-xs tracking-[0.25em] text-neutral-500 uppercase">Fase 3 · Struttura UX</p>
      <h1 className="text-4xl font-bold">Wireframe</h1>
      <p className="mt-4 text-neutral-600">
        Solo struttura e gerarchia: niente colori, font o testi definitivi. Le note gialle spiegano lo scopo di ogni
        blocco. Mappa del sito e percorsi verso il contatto in <code>docs/ux.md</code>.
      </p>
      <ul className="mt-10 divide-y divide-neutral-300 border-y border-neutral-300">
        {items.map(([slug, name, desc]) => (
          <li key={slug}>
            <Link href={`/wireframes/${slug}`} className="flex flex-col gap-1 py-5 hover:bg-neutral-200/60 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-32 text-lg font-bold">{name}</span>
              <span className="text-neutral-600">{desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
