import { WfBox, WfButton, WfHeading, WfLabel, WfNote, WfPage, WfSection, WfText } from "@/components/wireframe/Wf";

export const metadata = { title: "Studio" };

export default function WfStudio() {
  return (
    <WfPage title="Studio">
      <WfSection name="Apertura">
        <WfLabel>Studio</WfLabel>
        <WfHeading size="xl">Manifesto in una frase</WfHeading>
        <WfText lines={3} className="mt-6 max-w-2xl" />
      </WfSection>

      <WfSection name="Approccio e valori" dark>
        <div className="grid gap-8 md:grid-cols-3">
          {["Valore 1", "Valore 2", "Valore 3"].map((v) => (
            <div key={v}>
              <p className="text-xl font-bold">{v}</p>
              <WfText lines={4} className="mt-4" />
            </div>
          ))}
        </div>
        <WfNote n={1}>Principi concreti su come lavora lo studio. Niente frasi generiche da agenzia.</WfNote>
      </WfSection>

      <WfSection name="Metodo in dettaglio">
        <div className="space-y-6">
          {["Ascolto", "Direzione", "Produzione", "Lancio"].map((s, i) => (
            <div key={s} className="grid gap-4 border-t border-neutral-400 pt-6 md:grid-cols-[4rem_14rem_1fr]">
              <span className="font-mono text-sm text-neutral-500">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-xl font-bold">{s}</span>
              <WfText lines={3} />
            </div>
          ))}
        </div>
        <WfNote n={2}>Cosa succede in ogni fase e cosa riceve il cliente alla fine di ciascuna.</WfNote>
      </WfSection>

      <WfSection name="Chi c'è dietro" dark>
        <div className="grid items-center gap-10 md:grid-cols-12">
          <WfBox label="Ritratto (da fornire)" h="h-80" className="md:col-span-5" />
          <div className="md:col-span-7">
            <WfHeading size="m">Nome · Ruolo</WfHeading>
            <WfText lines={5} className="mt-5" />
          </div>
        </div>
        <WfNote n={3}>Da decidere: solo il titolare o un team. Servono foto e una breve bio.</WfNote>
      </WfSection>

      <WfSection name="Strumenti e competenze">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <WfBox key={i} label="Competenza" h="h-10" className="w-32" />
          ))}
        </div>
      </WfSection>

      <WfSection name="Chiusura" dark>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <WfHeading size="l">Lavoriamo insieme</WfHeading>
          <WfButton primary>Contatti</WfButton>
        </div>
      </WfSection>
    </WfPage>
  );
}
