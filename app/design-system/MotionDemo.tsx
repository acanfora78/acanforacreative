"use client";

import { useState } from "react";

const curves = [
  { name: "--ease-cinema", use: "Apertura e chiusura di scena, sipari, transizioni di pagina", value: "var(--ease-cinema)", dur: "var(--dur-scene)" },
  { name: "--ease-reveal", use: "Entrata di testi e immagini, decelerazione lunga", value: "var(--ease-reveal)", dur: "var(--dur-long)" },
  { name: "--ease-quiet", use: "Micro-interazioni: hover, focus, stati", value: "var(--ease-quiet)", dur: "var(--dur-short)" },
];

/** Anteprima delle curve di movimento. Con "riduci movimento" attivo, le barre saltano allo stato finale. */
export function MotionDemo() {
  const [on, setOn] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className="label mb-8 min-h-11 border border-fg/40 px-6 hover:border-fg"
        aria-pressed={on}
      >
        {on ? "Riavvolgi" : "Riproduci"}
      </button>
      <ul className="space-y-8">
        {curves.map((c) => (
          <li key={c.name}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <code className="text-small">{c.name}</code>
              <span className="text-small text-muted">{c.use}</span>
            </div>
            <div className="relative h-px bg-line">
              <span
                aria-hidden="true"
                className="absolute -top-1.5 left-0 h-3 w-3 bg-fg"
                style={{
                  transform: on ? "translateX(calc(100cqw - 0.75rem))" : "translateX(0)",
                  transition: `transform ${c.dur} ${c.value}`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
