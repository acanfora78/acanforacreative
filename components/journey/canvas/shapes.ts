import { symbolSpine } from "@/components/sculpture/geometry";

/*
 * Forme bersaglio delle particelle (capitoli 4–7), generate nel browser: nessun modello da scaricare.
 * Ogni forma restituisce N punti (x, y, z) larghi circa 2 unità, centrati sull'origine.
 * Generatore pseudo-casuale con seme: le forme sono sempre le stesse a ogni visita.
 */
export const SHAPES = ["reel", "browser", "bag", "symbol", "phone", "chart", "network", "clapper", "silhouette", "logo"] as const;
export type ShapeName = (typeof SHAPES)[number];
export const shapeIndex = (name: ShapeName) => SHAPES.indexOf(name);
/** Forme dei 6 servizi, nell'ordine dei dizionari. */
export const SERVICE_SHAPES: ShapeName[] = ["browser", "bag", "symbol", "phone", "chart", "network"];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Inside = (x: number, y: number) => boolean;
type Box = [number, number, number, number]; // minX, minY, maxX, maxY

/** Riempimento per rifiuto: punti dentro la regione, con profondità leggera. */
function fill(out: number[], n: number, inside: Inside, box: Box, r: () => number, depth = 0.05) {
  let guard = 0;
  while (n > 0 && guard++ < n * 60) {
    const x = box[0] + r() * (box[2] - box[0]);
    const y = box[1] + r() * (box[3] - box[1]);
    if (!inside(x, y)) continue;
    out.push(x, y, (r() - 0.5) * depth);
    n--;
  }
}
/** Punti lungo un segmento, con un piccolo spessore. */
function line(out: number[], n: number, ax: number, ay: number, bx: number, by: number, r: () => number, w = 0.012) {
  for (let i = 0; i < n; i++) {
    const t = r();
    out.push(ax + (bx - ax) * t + (r() - 0.5) * w, ay + (by - ay) * t + (r() - 0.5) * w, (r() - 0.5) * 0.02);
  }
}
const rect = (x0: number, y0: number, x1: number, y1: number): Inside => (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
function rectOutline(out: number[], n: number, x0: number, y0: number, x1: number, y1: number, r: () => number) {
  const w = x1 - x0, h = y1 - y0, per = 2 * (w + h);
  line(out, Math.round((n * w) / per), x0, y0, x1, y0, r);
  line(out, Math.round((n * w) / per), x0, y1, x1, y1, r);
  line(out, Math.round((n * h) / per), x0, y0, x0, y1, r);
  line(out, n - 2 * Math.round((n * w) / per) - Math.round((n * h) / per), x1, y0, x1, y1, r);
}

const builders: Record<Exclude<ShapeName, "silhouette">, (n: number, r: () => number) => number[]> = {
  reel(n, r) {
    const o: number[] = [];
    const holes = [0, 1, 2].map((i) => [Math.cos(Math.PI / 2 + (i * Math.PI * 2) / 3) * 0.47, Math.sin(Math.PI / 2 + (i * Math.PI * 2) / 3) * 0.47]);
    fill(o, Math.round(n * 0.7), (x, y) => {
      const d = Math.hypot(x, y);
      return d > 0.12 && d < 0.88 && holes.every(([hx, hy]) => Math.hypot(x - hx, y - hy) > 0.22);
    }, [-0.9, -0.9, 0.9, 0.9], r, 0.08);
    for (let i = o.length / 3; i < n; i++) { const a = r() * Math.PI * 2, d = 0.9 + r() * 0.04; o.push(Math.cos(a) * d, Math.sin(a) * d, (r() - 0.5) * 0.08); }
    return o;
  },
  browser(n, r) {
    const o: number[] = [];
    rectOutline(o, Math.round(n * 0.3), -1, -0.65, 1, 0.65, r);
    fill(o, Math.round(n * 0.12), rect(-1, 0.48, 1, 0.65), [-1, 0.48, 1, 0.65], r);
    fill(o, Math.round(n * 0.18), rect(-0.85, 0.05, 0.1, 0.38), [-0.85, 0.05, 0.1, 0.38], r);
    for (let k = 0; k < 4; k++) line(o, Math.round(n * 0.04), 0.25, 0.32 - k * 0.09, 0.85, 0.32 - k * 0.09, r);
    for (let k = 0; k < 3; k++) fill(o, Math.round(n * 0.08), rect(-0.85 + k * 0.6, -0.5, -0.4 + k * 0.6, -0.08), [-0.85 + k * 0.6, -0.5, -0.4 + k * 0.6, -0.08], r);
    fill(o, n - o.length / 3, rect(-1, -0.65, 1, 0.65), [-1, -0.65, 1, 0.65], r, 0.02);
    return o;
  },
  bag(n, r) {
    const o: number[] = [];
    const inside: Inside = (x, y) => y >= -0.75 && y <= 0.35 && Math.abs(x) <= 0.65 + (0.35 - y) * 0.13;
    fill(o, Math.round(n * 0.3), inside, [-0.85, -0.75, 0.85, 0.35], r, 0.1);
    line(o, Math.round(n * 0.12), -0.65, 0.35, 0.65, 0.35, r, 0.02);
    line(o, Math.round(n * 0.12), -0.79, -0.75, 0.79, -0.75, r, 0.02);
    line(o, Math.round(n * 0.1), -0.65, 0.35, -0.79, -0.75, r, 0.02);
    line(o, Math.round(n * 0.1), 0.65, 0.35, 0.79, -0.75, r, 0.02);
    for (let i = o.length / 3; i < n; i++) {
      // Manico: un arco sopra la borsa.
      const a = r() * Math.PI;
      o.push(Math.cos(a) * 0.34 + (r() - 0.5) * 0.02, 0.35 + Math.sin(a) * 0.38 + (r() - 0.5) * 0.02, (r() - 0.5) * 0.04);
    }
    return o;
  },
  symbol(n, r) {
    const { center, width } = symbolSpine(260);
    const o: number[] = [];
    for (let i = 0; i < n; i++) {
      const k = Math.min(258, Math.floor(r() * 259));
      const [ax, ay] = center[k], [bx, by] = center[k + 1];
      const f = r(), x = ax + (bx - ax) * f, y = ay + (by - ay) * f;
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const u = (r() - 0.5) * width[k];
      o.push(x - ((by - ay) / len) * u, y + ((bx - ax) / len) * u, (r() - 0.5) * 0.06);
    }
    return o;
  },
  phone(n, r) {
    const o: number[] = [];
    const rr = 0.14;
    const inside: Inside = (x, y) => {
      const dx = Math.max(Math.abs(x) - (0.46 - rr), 0), dy = Math.max(Math.abs(y) - (0.92 - rr), 0);
      return Math.hypot(dx, dy) <= rr;
    };
    const outline: Inside = (x, y) => inside(x, y) && !inside(x * 1.09, y * 1.04);
    fill(o, Math.round(n * 0.45), outline, [-0.46, -0.92, 0.46, 0.92], r, 0.06);
    line(o, Math.round(n * 0.04), -0.1, 0.82, 0.1, 0.82, r, 0.02);
    for (let k = 0; k < 4; k++) fill(o, Math.round(n * 0.06), rect(-0.32, 0.45 - k * 0.32, 0.32, 0.62 - k * 0.32), [-0.32, 0.45 - k * 0.32, 0.32, 0.62 - k * 0.32], r, 0.02);
    fill(o, n - o.length / 3, inside, [-0.46, -0.92, 0.46, 0.92], r, 0.02);
    return o;
  },
  chart(n, r) {
    const o: number[] = [];
    const bars = [0.35, 0.6, 0.85, 1.15];
    bars.forEach((h, k) => {
      const x0 = -0.85 + k * 0.42;
      fill(o, Math.round(n * 0.12), rect(x0, -0.7, x0 + 0.26, -0.7 + h), [x0, -0.7, x0 + 0.26, -0.7 + h], r, 0.08);
    });
    line(o, Math.round(n * 0.08), -1, -0.72, 1, -0.72, r);
    const pts = [[-0.9, -0.3], [-0.45, -0.05], [-0.05, -0.2], [0.4, 0.3], [0.85, 0.65]];
    for (let k = 0; k < pts.length - 1; k++) line(o, Math.round(n * 0.05), pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1], r, 0.03);
    line(o, n - o.length / 3 - Math.round(n * 0.04), 0.85, 0.65, 0.62, 0.62, r, 0.03);
    line(o, n - o.length / 3, 0.85, 0.65, 0.8, 0.42, r, 0.03);
    return o;
  },
  network(n, r) {
    const nodes: [number, number, number][] = [];
    for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()); nodes.push([Math.cos(a) * d * 1.0, Math.sin(a) * d * 0.78, (r() - 0.5) * 0.6]); }
    const o: number[] = [];
    const nodePts = Math.round(n * 0.4);
    for (let i = 0; i < nodePts; i++) {
      const [x, y, z] = nodes[i % nodes.length], g = () => (r() + r() + r() - 1.5) * 0.05;
      o.push(x + g(), y + g(), z + g());
    }
    const edges: [number, number][] = [];
    nodes.forEach((a, i) => {
      nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])] as const).filter(([j]) => j !== i).sort((x, y) => x[1] - y[1]).slice(0, 2).forEach(([j]) => edges.push([i, j]));
    });
    for (let i = o.length / 3; i < n; i++) {
      const [a, b] = edges[Math.floor(r() * edges.length)], t = r();
      o.push(nodes[a][0] + (nodes[b][0] - nodes[a][0]) * t, nodes[a][1] + (nodes[b][1] - nodes[a][1]) * t, nodes[a][2] + (nodes[b][2] - nodes[a][2]) * t);
    }
    return o;
  },
  clapper(n, r) {
    const o: number[] = [];
    fill(o, Math.round(n * 0.62), rect(-0.8, -0.75, 0.8, 0.32), [-0.8, -0.75, 0.8, 0.32], r, 0.08);
    // Stecca con le strisce diagonali.
    fill(o, n - o.length / 3, (x, y) => y > 0.38 && y < 0.6 && x > -0.8 && x < 0.8 && Math.floor((x + y) * 5) % 2 === 0, [-0.8, 0.38, 0.8, 0.6], r, 0.06);
    return o;
  },
  logo(n, r) {
    return builders.symbol(n, r).map((v, i) => (i % 3 === 2 ? v : v * 1.2));
  },
};

/** Sagoma segnaposto (mezzo busto) finché manca /images/morgan-sagoma.png. */
function bustPlaceholder(n: number, r: () => number) {
  const o: number[] = [];
  const inside: Inside = (x, y) => {
    if (Math.hypot(x / 0.27, (y - 0.5) / 0.34) <= 1) return true; // testa
    if (y > 0.05 && y < 0.2 && Math.abs(x) < 0.11) return true; // collo
    if (y <= 0.12 && y >= -0.95) return Math.abs(x) <= 0.3 + Math.min(1, (0.12 - y) / 0.35) * 0.55; // spalle e busto
    return false;
  };
  fill(o, n, inside, [-0.9, -0.95, 0.9, 0.85], r, 0.12);
  return o;
}

/** Sagoma dall'immagine (pixel con alpha > soglia), se il file esiste. */
async function silhouetteFromImage(n: number, r: () => number, src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const w = 200, h = Math.round((200 * img.height) / img.width);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const on: number[] = [];
  for (let i = 0; i < w * h; i++) if (data[i * 4 + 3] > 128) on.push(i);
  if (on.length < 50) throw new Error("sagoma vuota");
  const s = 1.9 / h; // altezza ≈ 1,9 unità
  const o: number[] = [];
  for (let k = 0; k < n; k++) {
    const i = on[Math.floor(r() * on.length)];
    const x = (i % w) + r(), y = Math.floor(i / w) + r();
    o.push((x - w / 2) * s, (h / 2 - y) * s, (r() - 0.5) * 0.12);
  }
  return o;
}

/** Tutte le forme, in un'unica tabella: [forma][punto] → x, y, z. */
export async function buildShapes(n: number, silhouette?: string) {
  const table = new Float32Array(SHAPES.length * n * 3);
  for (const [k, name] of SHAPES.entries()) {
    const r = rng(1000 + k * 7919);
    let pts: number[];
    if (name === "silhouette") {
      // TODO: finché manca /public/images/morgan-sagoma.png si usa il mezzo busto segnaposto (vedi docs/viaggio.md).
      try {
        pts = silhouette ? await silhouetteFromImage(n, r, silhouette) : bustPlaceholder(n, r);
      } catch {
        pts = bustPlaceholder(n, r);
      }
    } else pts = builders[name](n, r);
    // Sicurezza: esattamente n punti (si ripetono gli ultimi se ne mancano).
    for (let i = 0; i < n * 3; i++) table[k * n * 3 + i] = pts[i] ?? pts[i % Math.max(3, pts.length - (pts.length % 3))] ?? 0;
  }
  return table;
}
