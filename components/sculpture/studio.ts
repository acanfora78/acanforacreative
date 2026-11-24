import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  type Texture,
  type WebGLRenderer,
} from "three";

/*
 * Lookdev della scultura: metallo satinato in uno studio fotografico nero.
 * Tutta la luce arriva dall'ambiente (pannelli luminosi riflessi), nessuna
 * luce diretta: è ciò che dà riflessi lunghi e morbidi invece di macchie bianche.
 * Toni: bianco caldo e un controluce freddo leggero. Nessun colore d'identità
 * nuovo: il metallo è neutro, leggermente caldo, coerente con avorio e nero.
 */

/** Intensità complessiva dei pannelli (calibrata in fase 9.2). */
const PANEL_GAIN = 8;

type Panel = [w: number, h: number, x: number, y: number, z: number, ry: number, rx: number, intensity: number, tint: number];

const PANELS: Panel[] = [
  [6, 1.2, 0, 4, 1, 0, Math.PI / 2, 3.2, 0xfff3e0], // striscia dall'alto
  [1.4, 5, -5, 0.5, 1.5, Math.PI / 2, 0, 2.2, 0xfff6ea], // softbox laterale sinistro
  [0.6, 4, 4.5, 0, -1.5, -Math.PI / 2.4, 0, 1.6, 0xdfe7ff], // controluce freddo
  [3, 0.25, 0, -1.2, 4, 0, 0, 1.2, 0xffffff], // filo frontale basso
  [0.5, 6, 1.6, 1.0, 6, Math.PI, 0, 1.4, 0xfff8ef], // striscia verticale alle spalle della camera
  [0.25, 6, -1.4, 0.5, 6, Math.PI, 0, 0.7, 0xfff8ef], // seconda striscia, più debole
  [2.5, 0.35, -2, -2.5, 5, Math.PI, 0.5, 0.6, 0xe8eeff], // riflesso freddo dal basso
];

/** Mappa d'ambiente dello studio, pre-filtrata per i riflessi (PMREM). */
export function createStudioEnvironment(renderer: WebGLRenderer): Texture {
  const studio = new Scene();
  studio.background = new Color(0x050505);
  const disposables: { dispose(): void }[] = [];
  for (const [w, h, x, y, z, ry, rx, intensity, tint] of PANELS) {
    const geo = new PlaneGeometry(w, h);
    const mat = new MeshBasicMaterial({ color: new Color(tint).multiplyScalar(intensity * PANEL_GAIN), side: DoubleSide });
    const m = new Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    studio.add(m);
    disposables.push(geo, mat);
  }
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(studio, 0.02).texture;
  pmrem.dispose();
  disposables.forEach((d) => d.dispose());
  return env;
}

/** Metallo satinato, leggermente caldo. */
export function createSculptureMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: 0x8f8b84, metalness: 1, roughness: 0.28 });
}
