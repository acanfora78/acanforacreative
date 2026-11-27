/**
 * Testo diviso in parole sul server (nessun JavaScript): ogni parola ha il suo indice,
 * usato dalle animazioni guidate dallo scroll. Gli spazi restano veri spazi: lettori di schermo
 * e copia-incolla leggono la frase intera.
 */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={`k-word ${className}`} style={{ "--i": i, "--n": words.length } as React.CSSProperties}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/** Lettere singole (solo per titoli brevi): il testo vero per i lettori di schermo è in sr-only. */
export function Letters({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => (
          <span key={i} className="k-letter" style={{ "--i": i } as React.CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </>
  );
}
