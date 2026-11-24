import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";

/*
 * Geometria della scultura "Lama" (concept C, fase 9).
 *
 * La forma NON è disegnata a mano: viene ricavata dal tracciato del simbolo
 * master (brand/logo-master/01_logo_master_avorio.svg, primo <path>), copiato
 * qui sotto senza modifiche. Dal contorno si calcolano linea centrale e
 * spessore; poi una sezione a lente viene fatta scorrere lungo la linea,
 * con una leggera profondità e una torsione di quasi mezzo giro.
 * Vista di fronte, la scultura riprende la silhouette del simbolo; il logo
 * resta il logo, la scultura ne è un'interpretazione.
 */

/** Tracciato del simbolo master, identico al file SVG (solo M e C, chiuso). */
export const MASTER_SYMBOL_PATH =
  "M 182 250 C 220 135 405 58 585 69 C 655 73 694 103 687 143 C 684 164 669 184 648 202 C 663 177 675 153 670 133 C 661 98 626 89 581 91 C 420 99 263 166 207 246 C 178 288 198 318 252 323 C 354 333 520 278 630 211 C 535 292 374 357 257 354 C 161 351 136 310 182 250 Z";

/** Le due punte del simbolo aperto, nelle coordinate del tracciato. */
const TIP_A: Pt = [648, 202];
const TIP_B: Pt = [630, 211];
/** Centro del simbolo e scala: la scultura misura circa 2 unità di larghezza. */
const CX = 434;
const CY = 211;
const SCALE = 1 / 260;

type Pt = [number, number];

/** Punti del tracciato campionati a passo costante lungo la lunghezza. */
function samplePath(d: string, count: number): Pt[] {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  // "M x y" seguito da gruppi "C x1 y1 x2 y2 x y".
  let p0: Pt = [nums[0], nums[1]];
  const dense: Pt[] = [p0];
  const steps = 200;
  for (let i = 2; i + 5 < nums.length; i += 6) {
    const [x1, y1, x2, y2, x3, y3] = nums.slice(i, i + 6);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const u = 1 - t;
      const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, e = t * t * t;
      dense.push([a * p0[0] + b * x1 + c * x2 + e * x3, a * p0[1] + b * y1 + c * y2 + e * y3]);
    }
    p0 = [x3, y3];
  }
  return resample(dense, count + 1).slice(0, count); // il tracciato è chiuso: l'ultimo punto coincide col primo
}

/** Ricampiona una polilinea in `count` punti equidistanti. */
function resample(arr: Pt[], count: number): Pt[] {
  const d = [0];
  for (let i = 1; i < arr.length; i++) d.push(d[i - 1] + Math.hypot(arr[i][0] - arr[i - 1][0], arr[i][1] - arr[i - 1][1]));
  const total = d[d.length - 1];
  const out: Pt[] = [];
  let j = 0;
  for (let k = 0; k < count; k++) {
    const s = (k / (count - 1)) * total;
    while (j < d.length - 2 && d[j + 1] < s) j++;
    const f = (s - d[j]) / (d[j + 1] - d[j] || 1);
    out.push([arr[j][0] + (arr[j + 1][0] - arr[j][0]) * f, arr[j][1] + (arr[j + 1][1] - arr[j][1]) * f]);
  }
  return out;
}

const nearest = (pts: Pt[], [x, y]: Pt) =>
  pts.reduce((best, p, i) => (Math.hypot(p[0] - x, p[1] - y) < Math.hypot(pts[best][0] - x, pts[best][1] - y) ? i : best), 0);

export type Spine = { center: [number, number][]; width: number[] };

/** Linea centrale e spessore del simbolo, in unità scena (y verso l'alto). */
export function symbolSpine(samples: number): Spine {
  const N = 1200;
  const pts = samplePath(MASTER_SYMBOL_PATH, N);
  const a = nearest(pts, TIP_A);
  const b = nearest(pts, TIP_B);
  // Contorno interno: da una punta all'altra in avanti; esterno: all'indietro.
  const inner: Pt[] = [];
  for (let i = a; i !== b; i = (i + 1) % N) inner.push(pts[i]);
  const outer: Pt[] = [];
  for (let i = a; i !== b; i = (i - 1 + N) % N) outer.push(pts[i]);
  const A = resample(inner, samples);
  const B = resample(outer, samples);
  const center = A.map((p, i) => [((p[0] + B[i][0]) / 2 - CX) * SCALE, -((p[1] + B[i][1]) / 2 - CY) * SCALE] as [number, number]);
  const raw = A.map((p, i) => Math.hypot(p[0] - B[i][0], p[1] - B[i][1]) * SCALE);
  // Spessore lisciato (finestra di ±4 campioni a 260): le punte restano sottili.
  const r = Math.max(1, Math.round((4 * samples) / 260));
  const width = raw.map((_, i) => {
    let s = 0, n = 0;
    for (let k = -r; k <= r; k++) { s += raw[Math.min(samples - 1, Math.max(0, i + k))]; n++; }
    return s / n;
  });
  return { center, width };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Sezione a lente affilata: larga quanto il tratto del simbolo, spessa `ratio` volte. */
function lens(width: number, ratio: number, k: number): [number, number][] {
  return Array.from({ length: k }, (_, j) => {
    const a = (j / k) * Math.PI * 2;
    const s = Math.sin(a);
    return [Math.cos(a) * width * 0.5, Math.sign(s) * Math.pow(Math.abs(s), 0.7) * width * 0.5 * ratio];
  });
}

export type LamaOptions = {
  /** Campioni lungo il percorso (qualità). */
  samples?: number;
  /** Punti della sezione (qualità). */
  ring?: number;
};

/** Parametri di forma approvati per il concept C — modificarli cambia la scultura. */
export const LAMA = {
  depth: 0.26, // separazione in profondità tra le due estremità
  thickness: 0.16, // spessore della lente rispetto alla larghezza
  twist: Math.PI * 0.95, // torsione totale lungo il percorso
} as const;

/** Costruisce la geometria della scultura. */
export function createLamaGeometry({ samples = 260, ring = 36 }: LamaOptions = {}): BufferGeometry {
  const { center, width } = symbolSpine(samples);
  const P = center.map(([x, y], i) => new Vector3(x, y, (smooth(i / (samples - 1)) - 0.5) * LAMA.depth));
  const pos: number[] = [];
  const idx: number[] = [];
  const Z = new Vector3(0, 0, 1);
  const T = new Vector3(), Nn = new Vector3(), Bn = new Vector3(), N2 = new Vector3(), B2 = new Vector3(), v = new Vector3();

  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    T.subVectors(P[Math.min(samples - 1, i + 1)], P[Math.max(0, i - 1)]).normalize();
    Nn.crossVectors(Z, T).normalize(); // normale nel piano del simbolo
    Bn.crossVectors(T, Nn).normalize();
    const tw = (smooth(t) - 0.5) * LAMA.twist;
    const c = Math.cos(tw), s = Math.sin(tw);
    N2.copy(Nn).multiplyScalar(c).addScaledVector(Bn, s);
    B2.copy(Bn).multiplyScalar(c).addScaledVector(Nn, -s);
    for (const [u, w] of lens(width[i], LAMA.thickness, ring)) {
      v.copy(P[i]).addScaledVector(N2, u).addScaledVector(B2, w);
      pos.push(v.x, v.y, v.z);
    }
  }
  for (let i = 0; i < samples - 1; i++) {
    for (let k = 0; k < ring; k++) {
      const a = i * ring + k, b = i * ring + ((k + 1) % ring), c = (i + 1) * ring + k, d = (i + 1) * ring + ((k + 1) % ring);
      idx.push(a, c, b, b, c, d);
    }
  }
  // Tappi alle due punte.
  for (const i of [0, samples - 1]) {
    const base = i * ring;
    for (let k = 1; k < ring - 1; k++) {
      if (i === 0) idx.push(base, base + k + 1, base + k);
      else idx.push(base, base + k, base + k + 1);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}
