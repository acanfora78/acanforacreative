import { WfBox, WfButton, WfHeading, WfLabel, WfNote, WfPage, WfSection, WfText } from "@/components/wireframe/Wf";

export const metadata = { title: "Contatti" };

function Field({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div>
      <p className="mb-2 text-xs tracking-widest text-neutral-600 uppercase">{label}</p>
      <div className={`border-b border-neutral-500 ${tall ? "h-24" : "h-10"}`} />
    </div>
  );
}

export default function WfContatti() {
  return (
    <WfPage title="Contatti">
      <WfSection name="Apertura">
        <WfLabel>Contatti</WfLabel>
        <WfHeading size="xl">Parliamo del tuo progetto</WfHeading>
        <WfText lines={2} className="mt-6 max-w-xl" />
      </WfSection>

      <WfSection name="Canali e modulo" dark>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-8 md:col-span-4">
            {["Email", "WhatsApp", "Telefono"].map((c) => (
              <div key={c}>
                <WfLabel>{c}</WfLabel>
                <p className="text-sm text-neutral-600">[[{c} — DA CONFERMARE]]</p>
              </div>
            ))}
            <div>
              <WfLabel>Cosa succede dopo</WfLabel>
              <WfText lines={3} />
              <p className="mt-2 text-xs text-neutral-500">Tempi di risposta: da confermare.</p>
            </div>
          </div>

          <div className="grid gap-8 md:col-span-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label="Nome *" />
              <Field label="Email *" />
              <Field label="Telefono" />
              <Field label="Azienda o attività" />
            </div>
            <div>
              <p className="mb-3 text-xs tracking-widest text-neutral-600 uppercase">Servizi di interesse</p>
              <div className="flex flex-wrap gap-2">
                {["Web Design", "E-commerce", "Branding", "Social", "Marketing", "Digital e AI"].map((s) => (
                  <span key={s} className="border border-neutral-500 px-3 py-1.5 text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <Field label="Budget indicativo (facoltativo — da confermare)" />
            <Field label="Messaggio *" tall />
            <div className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 h-5 w-5 shrink-0 border border-neutral-600" />
              <span>Ho letto l&apos;informativa privacy *</span>
            </div>
            <div>
              <WfButton primary>Invia richiesta</WfButton>
            </div>
            <WfBox label="Messaggio di conferma dopo l'invio (stessa pagina)" h="h-16" />
          </div>
        </div>
        <WfNote n={1}>Pochi campi obbligatori. Servizio e tipo di progetto possono arrivare già selezionati dalle altre pagine.</WfNote>
        <WfNote n={2}>Invio diretto via email (Server Action + Resend). Consenso privacy obbligatorio e non preselezionato.</WfNote>
      </WfSection>
    </WfPage>
  );
}
