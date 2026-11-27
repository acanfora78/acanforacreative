import { Color } from "three";
import { span } from "../progress";

/*
 * Colori di fondo, lampi e scosse dei capitoli 4–7, come funzioni pure dell'avanzamento.
 * 4 Servizi: nero. 5 Metodo: nero → crema, colpo del ciak a ogni passo.
 * 6 Studio: crema → nero. 7 Contatto: nero.
 */
const NERO = new Color("#111111");
const CREMA = new Color("#f7f4ec");

/** Momento del colpo del ciak dentro un passo del metodo (0–1). */
export const CLAP_AT = 0.6;
/** Passo del metodo (0–3) e avanzamento nel passo. Il primo 15% del capitolo è l'arrivo del ciak. */
export function methodStep(p: number) {
  const q = span(p, 0.15, 1) * 4;
  const step = Math.min(3, Math.floor(q));
  return { step, q: q - step };
}
/** Impulso del colpo (1 → 0 subito dopo la chiusura della stecca). */
export function clapImpulse(p: number) {
  if (p < 0.15) return 0;
  const { q } = methodStep(p);
  const d = q - CLAP_AT;
  return d < 0 || d > 0.12 ? 0 : 1 - d / 0.12;
}

export function stageFx(ch: number, p: number) {
  const shake = { x: 0, y: 0 };
  if (ch === 4) {
    const k = clapImpulse(p);
    shake.x = Math.sin(p * 1900) * 0.035 * k;
    shake.y = Math.cos(p * 1500) * 0.03 * k;
    return { from: NERO, to: CREMA, mix: span(p, 0, 0.1), flash: k * 0.35, shake };
  }
  if (ch === 5) return { from: CREMA, to: NERO, mix: span(p, 0, 0.1), flash: 0, shake };
  return { from: NERO, to: NERO, mix: 0, flash: 0, shake };
}
