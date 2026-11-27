/*
 * Stato condiviso del viaggio: un oggetto mutabile, scritto dalla timeline (ScrollTrigger)
 * e letto dagli oggetti 3D in useFrame. Nessun setState a ogni fotogramma.
 * Tutto ciò che si vede è funzione pura di questi valori: avanti e indietro danno
 * esattamente lo stesso fotogramma.
 */
import { chapters } from "./chapters";

export const journey = {
  /** Avanzamento locale di ogni capitolo, da 0 a 1. */
  local: chapters.map(() => 0),
  /** Velocità dello scroll (da Lenis), per gli effetti solo-transizione. */
  velocity: 0,
  /** Puntatore normalizzato, da -1 a 1. */
  pointer: { x: 0, y: 0 },
  /** Telefono o dispositivo modesto: scena semplificata. */
  lite: false,
  /** Progetti in evidenza (capitolo 3): solo materiali reali. */
  projects: [] as JourneyProject[],
  /** Sagoma del capitolo 6, se il file esiste (altrimenti segnaposto procedurale). */
  silhouette: undefined as string | undefined,
  /** Parola sulla lavagna del ciak (capitolo 5), nella lingua della pagina. */
  sceneLabel: "SCENA",
  /** Chiamata a ogni cambio di avanzamento: risveglia la tela quando è ferma (fine del viaggio). */
  onChange: null as null | (() => void),
};

export type JourneyProject = { slug: string; name: string; category: string; year: number; cover?: string };

/** Capitolo corrente per la scena 3D: il primo non ancora completato. */
export function currentChapter() {
  const i = journey.local.findIndex((p) => p < 1);
  return i === -1 ? chapters.length - 1 : i;
}

/** Porzione 0–1 di `p` compresa tra `a` e `b`. */
export const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
export const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  in: (t: number) => t * t * t,
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
