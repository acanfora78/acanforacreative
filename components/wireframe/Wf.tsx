import Link from "next/link";
import type { ReactNode } from "react";

/*
 * Primitivi per i wireframe a bassa fedeltà (fase 3).
 * Solo struttura: grigi neutri, nessun colore o tipografia di brand.
 * Verranno rimossi quando le pagine reali li sostituiscono.
 */

export function WfBox({ label, h = "h-40", className = "" }: { label: string; h?: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-neutral-400 bg-neutral-200/70 p-3 text-center text-xs tracking-wide text-neutral-600 uppercase ${h} ${className}`}
    >
      {label}
    </div>
  );
}

export function WfText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-2.5 bg-neutral-300" style={{ width: i === lines - 1 ? "62%" : "100%" }} />
      ))}
    </div>
  );
}

export function WfHeading({ children, size = "m" }: { children: ReactNode; size?: "xl" | "l" | "m" | "s" }) {
  const s = { xl: "text-4xl md:text-7xl", l: "text-3xl md:text-5xl", m: "text-2xl md:text-3xl", s: "text-lg" }[size];
  return <p className={`${s} leading-tight font-bold text-neutral-800`}>{children}</p>;
}

export function WfLabel({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-[11px] tracking-[0.25em] text-neutral-500 uppercase">{children}</p>;
}

export function WfButton({ children, primary = false }: { children: ReactNode; primary?: boolean }) {
  return (
    <span
      className={`inline-flex min-h-11 items-center px-5 text-xs tracking-widest uppercase ${
        primary ? "bg-neutral-800 text-neutral-50" : "border border-neutral-500 text-neutral-700"
      }`}
    >
      {children}
    </span>
  );
}

/** Nota numerata per la revisione: spiega a cosa serve un blocco. */
export function WfNote({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="mt-4 flex gap-3 border-l-2 border-amber-500 bg-amber-50 px-3 py-2 text-sm text-neutral-700">
      <span className="font-bold text-amber-700">{n}</span>
      <span>{children}</span>
    </p>
  );
}

export function WfSection({ name, children, dark = false }: { name: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={`border-b border-neutral-300 py-14 md:py-20 ${dark ? "bg-neutral-300/60" : ""}`}>
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <p className="mb-6 font-mono text-[11px] text-neutral-500">▸ {name}</p>
        {children}
      </div>
    </section>
  );
}

const pages = [
  { href: "/wireframes/home", label: "Home" },
  { href: "/wireframes/studio", label: "Studio" },
  { href: "/wireframes/servizi", label: "Servizi" },
  { href: "/wireframes/lavori", label: "Lavori" },
  { href: "/wireframes/case-study", label: "Case study" },
  { href: "/wireframes/contatti", label: "Contatti" },
];

/** Intestazione, piè di pagina e barra di navigazione tra i wireframe. */
export function WfPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-800">
      <nav aria-label="Wireframe" className="sticky top-0 z-20 flex flex-wrap items-center gap-x-4 gap-y-1 bg-amber-400 px-5 py-2 text-xs">
        <span className="font-bold">WIREFRAME · {title}</span>
        {pages.map((p) => (
          <Link key={p.href} href={p.href} className="underline underline-offset-2">
            {p.label}
          </Link>
        ))}
        <Link href="/wireframes" className="ml-auto underline underline-offset-2">
          Indice
        </Link>
      </nav>

      {/* Intestazione del sito */}
      <header className="border-b border-neutral-300 bg-neutral-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-10">
          <WfBox label="Lockup negativo" h="h-8" className="w-40" />
          <div className="hidden items-center gap-6 text-xs tracking-widest text-neutral-600 uppercase md:flex">
            <span>Studio</span>
            <span>Servizi</span>
            <span>Lavori</span>
            <span>IT / EN</span>
            <WfButton primary>Contatti</WfButton>
          </div>
          <span className="text-xs tracking-widest uppercase md:hidden">Menu ☰</span>
        </div>
      </header>

      <main>{children}</main>

      {/* Piè di pagina del sito */}
      <footer className="bg-neutral-300/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-10">
          <div className="md:col-span-2">
            <WfHeading size="m">Frase di chiusura + invito al contatto</WfHeading>
            <div className="mt-5 flex flex-wrap gap-3">
              <WfButton primary>Contatti</WfButton>
              <WfButton>WhatsApp</WfButton>
            </div>
          </div>
          <div>
            <WfLabel>Navigazione</WfLabel>
            <WfText lines={4} />
          </div>
          <div>
            <WfLabel>Contatti e social</WfLabel>
            <WfText lines={4} />
          </div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-neutral-400 px-5 py-5 text-xs text-neutral-600 md:px-10">
          © 2026 [[Titolare — DA CONFERMARE]] · [[Sede]] · P.IVA [[DA CONFERMARE]] · Privacy · Cookie
        </div>
      </footer>
    </div>
  );
}
