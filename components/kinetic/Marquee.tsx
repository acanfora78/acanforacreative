import { Fragment } from "react";

/**
 * Fascia che scorre all'infinito (decorativa: le stesse voci sono nell'elenco dei servizi).
 * Due copie identiche affiancate: l'animazione sposta di metà larghezza e riparte senza salto.
 */
export function Marquee({ items, reverse = false, outline = false }: { items: readonly string[]; reverse?: boolean; outline?: boolean }) {
  const row = (copy: number) => (
    <div className="k-marquee-row" aria-hidden={copy > 0 || undefined}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <span className={`font-display ${outline && i % 2 === 0 ? "k-outline" : ""}`}>{it}</span>
          <span className="k-marquee-dot" aria-hidden="true">✦</span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={`k-marquee ${reverse ? "k-marquee-reverse" : ""}`} aria-hidden="true">
      <div className="k-marquee-track">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
