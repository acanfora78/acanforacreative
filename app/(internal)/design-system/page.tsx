import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo, LOGO_MIN_WIDTH, type LogoVariant } from "@/components/brand/Logo";
import { Button } from "@/components/primitives/Button";
import { Display, Label, Rule } from "@/components/primitives/Typography";
import { MotionDemo } from "./MotionDemo";

export const metadata: Metadata = {
  title: "Design system — ACANFORA CREATIVE",
  robots: { index: false, follow: false },
};

/*
 * Pagina interna di revisione della fase 2. Non fa parte del sito pubblico.
 * I testi qui sono esempi tipografici, non copy definitivo.
 */

const palette = [
  { name: "Nero", token: "nero", hex: "#111111", role: "Identità — fondo principale", ratio: "17.18:1 con avorio", official: true },
  { name: "Avorio", token: "avorio", hex: "#F7F4EC", role: "Identità — testo e fondi chiari", ratio: "17.18:1 con nero", official: true },
  { name: "Graphite", token: "graphite", hex: "#242424", role: "Supporto — superfici su fondo scuro", ratio: "14.12:1 con avorio" },
  { name: "Oro", token: "oro", hex: "#A89575", role: "Supporto — dettagli su fondo scuro", ratio: "6.49:1 su nero · 2.65:1 su avorio (no testo)" },
  { name: "Oro scuro", token: "oro-scuro", hex: "#7A6A4F", role: "Supporto — dettagli su fondo chiaro", ratio: "4.77:1 su avorio" },
];

const themes = [
  {
    cls: "theme-dark",
    name: "Tema scuro (predefinito, cinematico)",
    rows: [
      ["--fg", "#F7F4EC", "Testo", "17.18:1"],
      ["--muted", "#ABA79E", "Testo secondario", "7.87:1"],
      ["--accent", "#A89575", "Dettagli, hover", "6.49:1"],
      ["--surface", "#242424", "Superfici", "—"],
      ["--line", "#2E2D2B", "Filetti decorativi", "—"],
    ],
  },
  {
    cls: "theme-light",
    name: "Tema chiaro (sezioni editoriali)",
    rows: [
      ["--fg", "#111111", "Testo", "17.18:1"],
      ["--muted", "#5E5A52", "Testo secondario", "6.24:1"],
      ["--accent", "#7A6A4F", "Dettagli, hover", "4.77:1"],
      ["--surface", "#EFEBE1", "Superfici", "—"],
      ["--line", "#D8D3C7", "Filetti decorativi", "—"],
    ],
  },
];

const typeScale = [
  { token: "display-xl", font: "GFS Didot 400", range: "56 → 176 px", sample: "Cinematic Digital", cls: "font-display text-display-xl" },
  { token: "display-l", font: "GFS Didot 400", range: "44 → 120 px", sample: "Creative Digital Studio", cls: "font-display text-display-l" },
  { token: "display-m", font: "GFS Didot 400", range: "36 → 76 px", sample: "Immagini che restano", cls: "font-display text-display-m" },
  { token: "heading", font: "GFS Didot 400", range: "32 → 48 px", sample: "Web design ed e-commerce", cls: "font-display text-heading" },
  { token: "lead", font: "Lato 300", range: "20 → 26 px", sample: "Testo introduttivo di una sezione, più ampio e leggero del corpo.", cls: "text-lead font-light" },
  { token: "body", font: "Lato 400", range: "17 px", sample: "Testo corrente: misura massima di circa 65 caratteri per riga, interlinea 1.65.", cls: "text-body" },
  { token: "small", font: "Lato 400", range: "14 px", sample: "Note, didascalie, dati secondari.", cls: "text-small" },
  { token: "label", font: "Lato 400 · spaziatura 0.32em", range: "12 px", sample: "Creative · Servizi · Lavori", cls: "label" },
];

const logos: { variant: LogoVariant; file: string; bg: string; use: string }[] = [
  { variant: "master-dark", file: "03_logo_master_fondo_nero.svg", bg: "bg-nero", use: "Logo principale su fondo nero" },
  { variant: "master-light", file: "01_logo_master_avorio.svg", bg: "bg-avorio", use: "Logo principale su fondo avorio" },
  { variant: "master-transparent", file: "02_logo_master_trasparente.svg", bg: "bg-avorio", use: "Senza fondo, solo su fondi chiari" },
  { variant: "lockup-light", file: "05_lockup_orizzontale.svg", bg: "bg-avorio", use: "Orizzontale, su fondo avorio" },
  { variant: "symbol-app", file: "04_simbolo_instagram.svg", bg: "bg-graphite", use: "Simbolo: avatar, favicon" },
  { variant: "negative-transparent", file: "06_logo_negativo_trasparente.svg", bg: "bg-graphite", use: "Derivato: senza fondo, su fondi scuri" },
  { variant: "lockup-dark", file: "07_lockup_orizzontale_negativo.svg", bg: "bg-nero", use: "Derivato: orizzontale su nero (intestazione)" },
];

function Section({ n, title, intro, children, light = false }: { n: string; title: string; intro?: string; children: ReactNode; light?: boolean }) {
  return (
    <section className={`${light ? "theme-light" : "theme-dark"} py-[var(--spacing-section)]`}>
      <div className="container-site">
        <Label className="mb-6">{n}</Label>
        <Display as="h2" size="m">
          {title}
        </Display>
        {intro && <p className="prose-measure mt-6 text-lead font-light text-muted">{intro}</p>}
        <div className="mt-16">{children}</div>
      </div>
    </section>
  );
}

export default function DesignSystem() {
  return (
    <main>
      {/* Copertina */}
      <header className="theme-dark border-b border-line">
        <div className="container-site flex min-h-[80svh] flex-col justify-between py-10">
          <div className="flex items-center justify-between">
            <Logo variant="symbol-app" width={40} preload />
            <Label>Fase 2 · Revisione interna</Label>
          </div>
          <div>
            <Label className="mb-6">Design system</Label>
            <Display as="h1" size="xl">
              Cinematic
              <br />
              Digital
            </Display>
            <p className="prose-measure mt-8 text-lead font-light text-muted">
              Token, tipografia, griglia, movimento e uso del logo per il sito di ACANFORA CREATIVE. Nero e avorio
              sono l&apos;identità; tutto il resto è supporto.
            </p>
          </div>
        </div>
      </header>

      <Section n="01 — Colore" title="Palette" intro="Due colori di identità dal logo master, tre di supporto. Ogni abbinamento di testo è verificato WCAG AA.">
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {palette.map((c) => (
            <li key={c.hex} className="bg-bg">
              <div className="aspect-[4/3] border-b border-line" style={{ background: c.hex }} />
              <div className="p-5">
                <p className="font-display text-heading">{c.name}</p>
                <p className="mt-2 text-small">
                  <code>{c.hex}</code> · <code>--color-{c.token}</code>
                </p>
                <p className="mt-2 text-small text-muted">{c.role}</p>
                <p className="mt-1 text-small text-muted">{c.ratio}</p>
                {c.official && <p className="label mt-4 text-accent">Ufficiale</p>}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-px bg-line lg:grid-cols-2">
          {themes.map((t) => (
            <div key={t.cls} className={`${t.cls} p-8`}>
              <p className="label mb-6 text-muted">{t.name}</p>
              <p className="font-display text-heading">Titolo di esempio</p>
              <p className="mt-3 text-muted">Testo secondario di esempio.</p>
              <p className="mt-3 text-accent">Dettaglio in accento</p>
              <table className="mt-8 w-full text-small">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="py-2 font-normal">Token</th>
                    <th className="py-2 font-normal">Valore</th>
                    <th className="py-2 font-normal">Uso</th>
                    <th className="py-2 font-normal">Contrasto</th>
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map(([tok, hex, use, ratio]) => (
                    <tr key={tok} className="border-t border-line">
                      <td className="py-2">
                        <code>{tok}</code>
                      </td>
                      <td className="py-2">
                        <span className="mr-2 inline-block h-3 w-3 border border-line align-middle" style={{ background: hex }} />
                        {hex}
                      </td>
                      <td className="py-2 text-muted">{use}</td>
                      <td className="py-2">{ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Section>

      <Section
        n="02 — Tipografia"
        title="GFS Didot e Lato"
        intro="Le famiglie del logo. Didot solo per titoli da 32 px in su (ha un solo peso e tratti sottili); Lato per tutto il resto. Scala fluida da 360 a 1600 px."
        light
      >
        <ul>
          {typeScale.map((t) => (
            <li key={t.token} className="grid gap-4 border-t border-line py-8 lg:grid-cols-[14rem_1fr]">
              <div className="text-small">
                <code>--text-{t.token}</code>
                <p className="text-muted">{t.font}</p>
                <p className="text-muted">{t.range}</p>
              </div>
              <p className={`${t.cls} min-w-0 break-words`}>{t.sample}</p>
            </li>
          ))}
        </ul>
        <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-2">
          <div>
            <Label className="mb-4">Italiano</Label>
            <Display size="heading" as="p">
              Progettiamo esperienze digitali con il ritmo del cinema.
            </Display>
            <p className="prose-measure mt-4">
              Testo di esempio per verificare parole lunghe come comunicazione, personalizzazione e responsabilità su
              colonne strette, con sillabazione automatica.
            </p>
          </div>
          <div lang="en">
            <Label className="mb-4">English</Label>
            <Display size="heading" as="p">
              We design digital experiences with the rhythm of cinema.
            </Display>
            <p className="prose-measure mt-4">
              Sample text to check line length and rhythm in English, which runs shorter than Italian at the same
              size.
            </p>
          </div>
        </div>
      </Section>

      <Section n="03 — Griglia e spazi" title="Griglia editoriale" intro="4 colonne su telefono, 8 su tablet, 12 da 1024 px. Margini e spazi tra colonne fluidi; contenuto massimo 1680 px.">
        <div className="grid-editorial h-40" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`border border-accent/40 bg-accent/10 ${i >= 4 ? "hidden md:block" : ""} ${i >= 8 ? "md:hidden lg:block" : ""}`}
            />
          ))}
        </div>
        <ul className="mt-12 grid gap-6 text-small sm:grid-cols-3">
          <li>
            <code>--spacing-margin</code>
            <p className="text-muted">20 → 64 px, margine laterale</p>
          </li>
          <li>
            <code>--spacing-gutter</code>
            <p className="text-muted">16 → 32 px, spazio tra colonne</p>
          </li>
          <li>
            <code>--spacing-section</code>
            <p className="text-muted">96 → 224 px, ritmo verticale tra scene</p>
          </li>
        </ul>
      </Section>

      <Section
        n="04 — Movimento"
        title="Principi di movimento"
        intro="Il movimento racconta, non decora. Lento in entrata, deciso in uscita, una cosa alla volta. Tutto si spegne con «riduci movimento»."
        light
      >
        <div className="grid gap-16 lg:grid-cols-2">
          <ol className="space-y-6">
            {[
              ["Una scena alla volta", "Ogni sezione ha un solo movimento protagonista; il resto è fermo."],
              ["Solo transform e opacity", "Niente animazioni di layout: scorrimento fluido anche su telefoni medi."],
              ["Contenuto sempre presente", "Testi e immagini visibili senza JavaScript; l'animazione li accompagna, non li nasconde."],
              ["Durate da cinema", "150 ms interazioni · 300 ms stati · 600 ms entrate · 1000 ms rivelazioni · 1600 ms cambi di scena."],
              ["Riduci movimento", "Con l'opzione attiva: nessun parallasse, nessuno scrub, nessuna transizione lunga."],
            ].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] border-t border-line pt-6">
                <span className="font-display text-heading text-accent">{i + 1}</span>
                <div>
                  <p className="text-body font-bold">{t}</p>
                  <p className="text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="[container-type:inline-size]">
            <MotionDemo />
          </div>
        </div>
      </Section>

      <Section
        n="05 — Logo"
        title="Uso del logo"
        intro="Solo i file del master, mai ridisegnati o ricolorati. Spazio di rispetto incluso nei file; dimensioni minime indicate per ogni variante."
      >
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logos.map((l) => (
            <li key={l.variant} className="border border-line">
              <div className={`${l.bg} flex aspect-[4/3] items-center justify-center p-8`}>
                <Logo variant={l.variant} width={l.variant === "symbol-app" ? 120 : 280} />
              </div>
              <div className="p-5 text-small">
                <code>{l.file}</code>
                <p className="text-muted">{l.use}</p>
                <p className="text-muted">Larghezza minima: {LOGO_MIN_WIDTH[l.variant]} px</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <Label className="mb-4">Prova favicon e avatar</Label>
            <div className="flex items-end gap-8 bg-surface p-8">
              {[16, 24, 32, 40, 48].map((s) => (
                <figure key={s} className="text-center">
                  <Logo variant="symbol-app" width={s} alt="" />
                  <figcaption className="mt-2 text-small text-muted">{s}px</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-4 text-small text-muted">
              A 16 px le estremità sottili dell&apos;anello si assottigliano molto: da valutare a occhio sui dispositivi.
            </p>
          </div>
          <div>
            <Label className="mb-4">Varianti derivate</Label>
            <p className="text-muted">
              06 e 07 sono ricavate dal master scambiando solo i due colori ufficiali: tracciati e composizione
              identici. Approvate in fase 2; dettagli in <code>brand/derived/LEGGIMI_DERIVATI.txt</code>.
            </p>
          </div>
        </div>
      </Section>

      <Section n="06 — Componenti" title="Componenti di base" intro="Primi elementi riutilizzabili, nei due temi." light>
        <div className="grid gap-px bg-line lg:grid-cols-2">
          {["theme-dark", "theme-light"].map((t) => (
            <div key={t} className={`${t} flex flex-col items-start gap-6 p-10`}>
              <Label>{t === "theme-dark" ? "Su nero" : "Su avorio"}</Label>
              <Button href="#">Richiedi una consulenza</Button>
              <Button href="#" variant="secondary">
                Vedi i lavori
              </Button>
              <Button href="#" variant="text">
                Scopri lo studio
              </Button>
              <Rule className="w-full" />
              <p className="label text-accent">Etichetta in accento</p>
            </div>
          ))}
        </div>
      </Section>

      <footer className="theme-dark border-t border-line py-12">
        <div className="container-site flex flex-wrap items-center justify-between gap-6 text-small text-muted">
          <p>ACANFORA CREATIVE — design system, fase 2</p>
          <p>GFS Didot e Lato · SIL Open Font License 1.1</p>
        </div>
      </footer>
    </main>
  );
}
