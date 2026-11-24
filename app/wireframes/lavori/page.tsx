import { WfBox, WfHeading, WfLabel, WfNote, WfPage, WfSection, WfText } from "@/components/wireframe/Wf";

export const metadata = { title: "Lavori" };

const progetti = [
  { nome: "Sudditalia", tipo: "E-commerce" },
  { nome: "Osteria Il Tormentone", tipo: "Web" },
  { nome: "Kormè", tipo: "App" },
  { nome: "22SIDE", tipo: "da confermare" },
  { nome: "Oro Croccante", tipo: "Social" },
  { nome: "Acanfora Creative", tipo: "Branding", etichetta: "Interno" },
  { nome: "CALDERA", tipo: "E-commerce", etichetta: "Concept dimostrativo" },
  { nome: "Oddscore", tipo: "App", etichetta: "In attesa di verifica legale" },
];

export default function WfLavori() {
  return (
    <WfPage title="Lavori">
      <WfSection name="Apertura">
        <WfLabel>Lavori</WfLabel>
        <WfHeading size="xl">Lavori selezionati</WfHeading>
        <WfText lines={2} className="mt-6 max-w-xl" />
      </WfSection>

      <WfSection name="Filtri e griglia">
        <div className="mb-8 flex flex-wrap gap-2">
          {["Tutti", "Web", "E-commerce", "App", "Branding", "Social"].map((f, i) => (
            <span key={f} className={`px-3 py-1.5 text-xs ${i === 0 ? "bg-neutral-800 text-neutral-50" : "border border-neutral-400"}`}>
              {f}
            </span>
          ))}
        </div>
        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
          {progetti.map((p) => (
            <div key={p.nome}>
              <WfBox label={`Immagine — ${p.nome}`} h="h-56 md:h-72" />
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-lg font-bold">{p.nome}</span>
                <span className="text-sm text-neutral-500">{p.tipo} · Anno</span>
              </div>
              {p.etichetta && (
                <span className="mt-2 inline-block border border-amber-600 px-2 py-0.5 text-[11px] text-amber-800 uppercase">
                  {p.etichetta}
                </span>
              )}
            </div>
          ))}
        </div>
        <WfNote n={1}>8 progetti. Etichette obbligatorie per progetti interni e concept. Oddscore resterà nascosto finché la verifica legale non lo consente.</WfNote>
        <WfNote n={2}>Filtri: con 8 progetti sono facoltativi. Diventano utili sopra i 10.</WfNote>
      </WfSection>
    </WfPage>
  );
}
