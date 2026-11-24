import { WfBox, WfButton, WfHeading, WfLabel, WfNote, WfPage, WfSection, WfText } from "@/components/wireframe/Wf";

export const metadata = { title: "Home" };

export default function WfHome() {
  return (
    <WfPage title="Home">
      <WfSection name="Scena 1 — Apertura">
        <div className="grid min-h-[60svh] items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <WfLabel>Creative Digital Studio</WfLabel>
            <WfHeading size="xl">Frase di posizionamento in Didot, su 2–3 righe</WfHeading>
            <WfText lines={2} className="mt-6 max-w-md" />
            <div className="mt-8 flex flex-wrap gap-3">
              <WfButton primary>Parliamo del tuo progetto</WfButton>
              <WfButton>Guarda i lavori</WfButton>
            </div>
          </div>
          <WfBox label="Simbolo / immagine o video di apertura" h="h-64 md:h-96" className="md:col-span-5" />
        </div>
        <WfNote n={1}>Chi sei, cosa fai e cosa fare dopo, tutto nella prima schermata. Azione principale: contatto.</WfNote>
      </WfSection>

      <WfSection name="Scena 2 — Manifesto" dark>
        <div className="max-w-4xl">
          <WfHeading size="l">Due o tre frasi sul punto di vista dello studio</WfHeading>
          <WfText lines={2} className="mt-6 max-w-xl" />
        </div>
        <WfNote n={2}>Tono, non elenco di servizi. Testo da scrivere in fase 4.</WfNote>
      </WfSection>

      <WfSection name="Scena 3 — Lavori selezionati">
        <div className="mb-8 flex items-end justify-between gap-4">
          <WfHeading size="l">Lavori selezionati</WfHeading>
          <WfButton>Tutti i lavori</WfButton>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {["Sudditalia", "Osteria Il Tormentone", "Kormè"].map((p, i) => (
            <div key={p} className={i === 0 ? "md:col-span-2" : ""}>
              <WfBox label={`Immagine — ${p}`} h={i === 0 ? "h-56 md:h-[28rem]" : "h-56 md:h-72"} />
              <div className="mt-3 flex justify-between text-sm">
                <span className="font-bold">{p}</span>
                <span className="text-neutral-500">Tipo · Anno</span>
              </div>
            </div>
          ))}
        </div>
        <WfNote n={3}>3 progetti in evidenza (proposta). Uno grande, due affiancati. Ogni scheda apre il case study.</WfNote>
      </WfSection>

      <WfSection name="Scena 4 — Servizi" dark>
        <WfHeading size="l">Cosa facciamo</WfHeading>
        <ol className="mt-8 divide-y divide-neutral-400 border-y border-neutral-400">
          {["Web Design", "E-commerce", "Branding", "Social Media Management", "Digital Marketing", "Digital Solutions e AI"].map((s, i) => (
            <li key={s} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 py-5 md:grid-cols-[4rem_1fr_1fr]">
              <span className="font-mono text-sm text-neutral-500">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-xl font-bold">{s}</span>
              <WfText lines={1} className="col-start-2 md:col-start-3" />
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <WfButton>Tutti i servizi</WfButton>
        </div>
        <WfNote n={4}>Indice numerato: ogni riga porta al capitolo del servizio nella pagina Servizi.</WfNote>
      </WfSection>

      <WfSection name="Scena 5 — Metodo">
        <WfHeading size="l">Come lavoriamo</WfHeading>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {["Ascolto", "Direzione", "Produzione", "Lancio"].map((s, i) => (
            <div key={s} className="border-t border-neutral-400 pt-4">
              <p className="font-mono text-sm text-neutral-500">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-lg font-bold">{s}</p>
              <WfText lines={3} className="mt-3" />
            </div>
          ))}
        </div>
        <WfNote n={5}>Descrive il processo, non promette risultati. Su desktop sarà la scena animata principale (fase 7).</WfNote>
      </WfSection>

      <WfSection name="Scena 6 — Studio" dark>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <WfBox label="Foto dello studio / ritratto (da fornire)" h="h-72" />
          <div>
            <WfHeading size="m">Anteprima dello studio</WfHeading>
            <WfText lines={4} className="mt-5" />
            <div className="mt-6">
              <WfButton>Scopri lo studio</WfButton>
            </div>
          </div>
        </div>
      </WfSection>

      <WfSection name="Scena 7 — Chiusura">
        <div className="py-10 text-center">
          <WfHeading size="xl">Invito al contatto</WfHeading>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <WfButton primary>Parliamo del tuo progetto</WfButton>
            <WfButton>Email</WfButton>
            <WfButton>WhatsApp</WfButton>
          </div>
        </div>
        <WfNote n={6}>Ultima occasione prima del piè di pagina: tre strade per contattare, la principale è il modulo.</WfNote>
      </WfSection>
    </WfPage>
  );
}
