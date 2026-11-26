/*
 * Inquadratura comune dei capitoli 3–7: distanza della camera e posizione del "soggetto"
 * (pellicola, particelle, ciak, ologramma). Su schermi larghi il soggetto sta a destra del testo;
 * su schermi verticali sta in alto, sopra il testo.
 */
export const FOV = 35;
const TAN = Math.tan((FOV / 2) * (Math.PI / 180));

/** Distanza della camera che fa entrare la scena anche in verticale. */
export function viewDist(aspect: number) {
  return Math.max(5, 1.45 / (TAN * aspect));
}

/** Metà altezza visibile sul piano z = 0. */
export function halfHeight(aspect: number) {
  return viewDist(aspect) * TAN;
}

/** Posizione e scala del soggetto per l'aspetto dello schermo. */
export function subject(aspect: number) {
  const h = halfHeight(aspect);
  return aspect > 1 ? { x: h * aspect * 0.42, y: 0.05, s: 0.95, wide: true } : { x: 0, y: h * 0.42, s: 0.9, wide: false };
}
