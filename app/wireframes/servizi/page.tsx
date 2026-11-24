import { WfBox, WfButton, WfHeading, WfLabel, WfNote, WfPage, WfSection, WfText } from "@/components/wireframe/Wf";

export const metadata = { title: "Servizi" };

const servizi = ["Web Design", "E-commerce", "Branding", "Social Media Management", "Digital Marketing", "Digital Solutions e AI"];

export default function WfServizi() {
  return (
    <WfPage title="Servizi">
      <WfSection name="Apertura">
        <WfLabel>Servizi</WfLabel>
        <WfHeading size="xl">Cosa facciamo, per chi</WfHeading>
        <WfText lines={2} className="mt-6 max-w-xl" />
        <div className="mt-8 flex flex-wrap gap-2">
          {servizi.map((s) => (
            <span key={s} className="border border-neutral-400 px-3 py-1.5 text-xs">
              {s}
            </span>
          ))}
        </div>
        <WfNote n={1}>Indice cliccabile: porta direttamente al capitolo del servizio.</WfNote>
      </WfSection>

      {servizi.map((s, i) => (
        <WfSection key={s} name={`Capitolo ${i + 1} — ${s}`} dark={i % 2 === 1}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-mono text-sm text-neutral-500">{String(i + 1).padStart(2, "0")}</p>
              <WfHeading size="l">{s}</WfHeading>
              <WfText lines={3} className="mt-5" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:col-span-7">
              <div>
                <WfLabel>Cosa comprende</WfLabel>
                <WfText lines={5} />
              </div>
              <div>
                <WfLabel>Per chi è adatto</WfLabel>
                <WfText lines={4} />
              </div>
              <div className="sm:col-span-2">
                <WfLabel>Lavori collegati</WfLabel>
                <div className="grid grid-cols-2 gap-3">
                  <WfBox label="Progetto" h="h-24" />
                  <WfBox label="Progetto" h="h-24" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <WfButton primary>Richiedi questo servizio</WfButton>
              </div>
            </div>
          </div>
          {i === 0 && <WfNote n={2}>Stessa struttura per tutti e 6. Il pulsante apre Contatti con il servizio già selezionato.</WfNote>}
          {i === 5 && <WfNote n={3}>Lavori collegati solo se esistono: nessun progetto inventato per riempire lo spazio.</WfNote>}
        </WfSection>
      ))}

      <WfSection name="Domande frequenti (facoltative)">
        <div className="max-w-3xl divide-y divide-neutral-400 border-y border-neutral-400">
          {[1, 2, 3, 4].map((q) => (
            <div key={q} className="flex items-center justify-between py-4">
              <WfText lines={1} className="w-3/4" />
              <span className="text-xl">+</span>
            </div>
          ))}
        </div>
        <WfNote n={4}>Utile per rispondere a dubbi tipici (tempi, costi, manutenzione). Da decidere se includerla.</WfNote>
      </WfSection>
    </WfPage>
  );
}
