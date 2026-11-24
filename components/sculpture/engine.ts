import {
  ACESFilmicToneMapping,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { createLamaGeometry } from "./geometry";
import { createSculptureMaterial, createStudioEnvironment } from "./studio";

/*
 * Motore della scultura. Caricato solo quando serve (import dinamico da
 * Sculpture.tsx), così Three.js non pesa sulle pagine che non lo usano.
 */

export type Tier = 1 | 2;
export type View = "front" | "tq";

/** Valori pilotabili dall'esterno (GSAP dalla fase 9.3): un solo motore per proprietà. */
export type SculptureParams = {
  /** Rotazione aggiuntiva sull'asse verticale (radianti). */
  turn: number;
  /** Inclinazione aggiuntiva (radianti). */
  tilt: number;
  /** Esposizione: 0 = buio, 1 = normale. */
  exposure: number;
  /** Ampiezza del movimento lento a riposo: 0 = ferma. */
  idle: number;
  /** Avvicinamento della camera: 1 = normale, 1,12 = più vicina del 12%. */
  zoom: number;
  /** 0 = vista scelta, 1 = di fronte (silhouette del simbolo). */
  facing: number;
  /** Rotazione dello studio di luci (radianti): fa scorrere i riflessi sul metallo. */
  light: number;
};

const QUALITY = {
  1: { samples: 160, ring: 24, dpr: 1.25, fps: 30, antialias: false },
  2: { samples: 200, ring: 30, dpr: 1.5, fps: 60, antialias: true },
} as const;

const FOV = 28;
const EXPOSURE = 0.9;

export function createSculptureEngine(canvas: HTMLCanvasElement, { tier, view }: { tier: Tier; view: View }) {
  const q = QUALITY[tier];
  const renderer = new WebGLRenderer({ canvas, antialias: q.antialias, alpha: true, powerPreference: tier === 2 ? "high-performance" : "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.dpr));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0); // fondo trasparente: il colore lo dà la pagina

  const scene = new Scene();
  scene.environment = createStudioEnvironment(renderer);
  const geometry = createLamaGeometry({ samples: q.samples, ring: q.ring });
  const material = createSculptureMaterial();
  const mesh = new Mesh(geometry, material);
  const pivot = new Group(); // rotazioni esterne sul pivot, posa di base sulla mesh
  pivot.add(mesh);
  scene.add(pivot);
  const baseRoll = view === "tq" ? 0.08 : 0;

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  const FRONT = new Vector3(0, 0, 1);
  const BASE = view === "front" ? FRONT.clone() : new Vector3(2.7, 1.25, 3.0).normalize();
  const dir = new Vector3();
  const hHalf = Math.tan(MathUtils.degToRad(FOV / 2));
  let dist = 4.3;

  const params: SculptureParams = { turn: 0, tilt: 0, exposure: 1, idle: 1, zoom: 1, facing: 0, light: 0 };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Distanza che fa entrare la scultura (≈ 2,3 unità di larghezza) anche in verticale.
    dist = Math.max(4.3, 1.2 / (hHalf * camera.aspect));
    camera.updateProjectionMatrix();
  }

  function placeCamera() {
    dir.copy(BASE).lerp(FRONT, params.facing).normalize();
    camera.position.copy(dir).multiplyScalar(dist / params.zoom);
    camera.lookAt(0, 0, 0);
  }

  let raf = 0, last = 0, clock = 0, running = false;
  const frameMs = 1000 / q.fps;

  function draw(dt: number) {
    clock += dt;
    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3);
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);
    // Movimento a riposo lentissimo; il puntatore inclina fino a circa 8°.
    pivot.rotation.y = params.turn + Math.sin(clock * 0.18) * 0.3 * params.idle + pointer.sx * 0.14;
    pivot.rotation.x = params.tilt + Math.sin(clock * 0.13) * 0.06 * params.idle - pointer.sy * 0.14;
    mesh.rotation.z = baseRoll * (1 - params.facing);
    scene.environmentRotation.y = params.light;
    renderer.toneMappingExposure = EXPOSURE * params.exposure;
    placeCamera();
    renderer.render(scene, camera);
  }

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (now - last < frameMs - 1) return;
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    draw(dt);
  }

  resize();
  const ro = new ResizeObserver(() => { resize(); if (!running) draw(0); });
  ro.observe(canvas);

  return {
    params,
    /** Disegna un solo fotogramma (es. con "riduci movimento"). */
    renderOnce() { draw(0); },
    start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    /** Pixel per unità di scena sul piano della scultura (zoom 1): serve ad allineare la scultura al logo. */
    pixelsPerUnit() { return canvas.clientHeight / (2 * dist * hHalf); },
    /** Posizione del puntatore normalizzata, da -1 a 1. */
    setPointer(x: number, y: number) { pointer.x = x; pointer.y = y; },
    dispose() {
      this.stop();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.forceContextLoss(); // libera subito il contesto WebGL
    },
  };
}

export type SculptureEngine = ReturnType<typeof createSculptureEngine>;
