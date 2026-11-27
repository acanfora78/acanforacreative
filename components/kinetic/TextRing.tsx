/** Testo che gira su un cerchio (decorativo, il testo vero è altrove nella pagina). Unità ≥ 12 per la leggibilità. */
export function TextRing({ text, className = "" }: { text: string; className?: string }) {
  const id = "k-ring-path";
  return (
    <svg viewBox="0 0 300 300" className={`k-ring ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d="M 150,150 m -129,0 a 129,129 0 1,1 258,0 a 129,129 0 1,1 -258,0" />
      </defs>
      <text className="label" fill="currentColor" style={{ fontSize: 12.4, letterSpacing: "0.32em" }}>
        <textPath href={`#${id}`} textLength={805} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
