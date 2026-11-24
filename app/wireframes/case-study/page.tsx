import { WfBox, WfButton, WfHeading, WfLabel, WfNote, WfPage, WfSection, WfText } from "@/components/wireframe/Wf";

export const metadata = { title: "Case study" };

export default function WfCaseStudy() {
  return (
    <WfPage title="Case study (modello)">
      <WfSection name="Apertura">
        <WfLabel>Case study · Tipo di progetto</WfLabel>
        <WfHeading size="xl">Nome del progetto</WfHeading>
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-neutral-400 pt-6 md:grid-cols-4">
          {["Cliente", "Anno", "Servizi", "Ruolo"].map((k) => (
            <div key={k}>
              <WfLabel>{k}</WfLabel>
              <WfText lines={1} />
            </div>
          ))}
        </div>
        <WfBox label="Immagine principale a tutta larghezza" h="h-64 md:h-[32rem]" className="mt-10" />
        <WfNote n={1}>Dati essenziali subito visibili. Ruolo e anno da fornire per ogni progetto.</WfNote>
      </WfSection>

      <WfSection name="Contesto · Obiettivo · Approccio" dark>
        <div className="grid gap-10 md:grid-cols-3">
          {["Contesto", "Obiettivo", "Approccio"].map((k) => (
            <div key={k}>
              <p className="text-xl font-bold">{k}</p>
              <WfText lines={5} className="mt-4" />
            </div>
          ))}
        </div>
      </WfSection>

      <WfSection name="Soluzione — galleria">
        <WfBox label="Schermata desktop" h="h-64 md:h-96" />
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <WfBox key={i} label="Schermata mobile" h="h-64" />
          ))}
        </div>
        <WfNote n={2}>Solo immagini reali del progetto. Nessuna schermata ricostruita o inventata.</WfNote>
      </WfSection>

      <WfSection name="Cosa abbiamo consegnato" dark>
        <div className="grid gap-x-10 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border-b border-neutral-400 py-4">
              <WfText lines={1} />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <WfButton>Visita il sito ↗</WfButton>
        </div>
        <WfNote n={3}>Elenco concreto dei lavori fatti. Nessun numero o risultato se non fornito e documentato dal cliente.</WfNote>
      </WfSection>

      <WfSection name="Progetto successivo + chiusura">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <WfLabel>Progetto successivo</WfLabel>
            <WfBox label="Anteprima del prossimo case study" h="h-48" />
          </div>
          <div className="flex flex-col justify-center">
            <WfHeading size="l">Hai un progetto simile?</WfHeading>
            <div className="mt-6">
              <WfButton primary>Parliamone</WfButton>
            </div>
          </div>
        </div>
        <WfNote n={4}>Il pulsante apre Contatti con il tipo di progetto già selezionato.</WfNote>
      </WfSection>
    </WfPage>
  );
}
