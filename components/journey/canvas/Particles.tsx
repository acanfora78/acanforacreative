"use client";

import { usePerformanceMonitor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  FloatType,
  NearestFilter,
  NormalBlending,
  RGBAFormat,
  ShaderMaterial,
  type Points,
} from "three";
import { FOV, subject } from "../layout";
import { currentChapter, ease, journey, span } from "../progress";
import { scanY } from "./Hologram";
import { buildShapes, SERVICE_SHAPES, SHAPES, shapeIndex, type ShapeName } from "./shapes";

/*
 * Sistema di particelle condiviso (capitoli 4–7): UN solo THREE.Points.
 * Le forme bersaglio stanno in una texture float (una fascia di righe per forma); il vertex shader
 * legge la forma A e la forma B per ogni punto e le mescola con uMix. Durante il passaggio:
 * rumore leggero, dimensione variabile per punto, luce additiva sul nero (normale sul crema).
 * Punti: 32.000 su desktop, 7.000 su telefono; si riducono se gli fps calano.
 */
const WIDTH = 256;
const ACCENT_DARK = new Color("#d6c29a"); // oro tenue, più luminoso per la luce additiva sul nero
const ACCENT_LIGHT = new Color("#7a6a4f"); // oro scuro, sulle scene crema

/** side: lato del soggetto su schermi larghi (1 destra, -1 sinistra); scan: anello del capitolo 6 (0 = spento). */
/** lift: quanto il faro (capitolo 7) sale sopra il titolo, da 0 a 1. */
type State = { a: ShapeName; b: ShapeName; mix: number; opacity: number; cream: number; beacon: number; side: number; scan: number; scanY: number; lift: number };

/** Stato delle particelle come funzione pura dell'avanzamento: reversibile. */
export function particleState(): State | null {
  const ch = currentChapter();
  const p = journey.local[ch];
  if (ch === 3) {
    // Servizi: dalla bobina alle 6 forme, una per servizio.
    const q = span(p, 0.04, 1) * 6;
    const s = Math.min(5, Math.floor(q));
    return {
      a: s === 0 ? "reel" : SERVICE_SHAPES[s - 1],
      b: SERVICE_SHAPES[s],
      mix: ease.inOut(span(q - s, 0, 0.5)),
      opacity: span(p, 0, 0.06),
      cream: 0,
      beacon: 0,
      side: 1,
      scan: 0,
      scanY: 0,
      lift: 0,
    };
  }
  const base = { beacon: 0, side: 1, scan: 0, scanY: 0, lift: 0 };
  if (ch === 4) return { ...base, a: "network", b: "clapper", mix: ease.inOut(span(p, 0, 0.12)), opacity: 1 - span(p, 0.1, 0.2), cream: span(p, 0, 0.1) };
  if (ch === 5) {
    // Dal ciak (a destra) alla sagoma (a sinistra, dove c'era la foto), poi la scansione.
    const mix = ease.inOut(span(p, 0.05, 0.35));
    return { ...base, a: "clapper", b: "silhouette", mix, opacity: span(p, 0, 0.08), cream: 1 - span(p, 0, 0.1), side: 1 - 2 * mix, scan: span(p, 0.22, 0.32), scanY: scanY(p) };
  }
  if (ch === 6) {
    const mix = ease.inOut(span(p, 0, 0.35));
    return { ...base, a: "silhouette", b: "logo", mix, opacity: 1, cream: 0, beacon: span(p, 0.3, 0.6), side: -1 + 2 * mix, lift: mix };
  }
  return null;
}

/** Servizio attivo (0–5) per l'avanzamento del capitolo 4. */
export const activeService = (p: number) => Math.min(5, Math.floor(span(p, 0.04, 1) * 6));

export function Particles() {
  const points = useRef<Points>(null);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const count = journey.lite ? 7000 : 32000;
  const rows = Math.ceil(count / WIDTH);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    const idx = new Float32Array(count), rand = new Float32Array(count);
    for (let i = 0; i < count; i++) { idx[i] = i; rand[i] = (Math.sin(i * 12.9898) * 43758.5453) % 1; rand[i] = Math.abs(rand[i]); }
    g.setAttribute("aIdx", new BufferAttribute(idx, 1));
    g.setAttribute("aRand", new BufferAttribute(rand, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uShapes: { value: null },
          uRows: { value: rows },
          uTexH: { value: rows * SHAPES.length },
          uA: { value: 0 },
          uB: { value: 0 },
          uMix: { value: 0 },
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uSize: { value: journey.lite ? 0.022 : 0.013 },
          uPx: { value: 500 },
          uColor: { value: ACCENT_DARK.clone() },
          uBeacon: { value: 0 },
          uScan: { value: 0 },
          uScanY: { value: 0 },
        },
        vertexShader: `
          uniform sampler2D uShapes; uniform float uRows, uTexH, uA, uB, uMix, uTime, uSize, uPx, uBeacon, uScan, uScanY;
          attribute float aIdx; attribute float aRand; varying float vGlow; varying float vScan;
          vec3 fetchShape(float s){
            float x = mod(aIdx, ${WIDTH}.0), y = floor(aIdx / ${WIDTH}.0) + s * uRows;
            return texture2D(uShapes, vec2((x + 0.5) / ${WIDTH}.0, (y + 0.5) / uTexH)).xyz;
          }
          void main(){
            // Ogni punto parte con un piccolo ritardo: il passaggio è organico, non rigido.
            float m = smoothstep(0.0, 1.0, clamp(uMix * 1.3 - aRand * 0.3, 0.0, 1.0));
            vec3 p = mix(fetchShape(uA), fetchShape(uB), m);
            // Ologramma: i punti vicini all'anello di scansione si accendono.
            vScan = uScan * smoothstep(0.09, 0.0, abs(p.y - uScanY));
            // Rumore leggero (campo di tipo curl approssimato), più forte a metà del passaggio.
            float amp = 0.18 * sin(3.14159 * m) + 0.006;
            float t = uTime * 0.6 + aRand * 6.28;
            p += amp * vec3(sin(p.y * 3.1 + t), sin(p.z * 3.7 + t * 1.3), sin(p.x * 2.9 + t * 0.7));
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * (0.45 + aRand * 1.1) * (1.0 + uBeacon * 0.6) * uPx / -mv.z;
            vGlow = (0.55 + 0.45 * aRand) * (1.0 - uScan * 0.35 * (0.5 + 0.5 * sin(uTime * 9.0 + aRand * 40.0)));
          }`,
        fragmentShader: `
          uniform float uOpacity, uBeacon; uniform vec3 uColor; varying float vGlow; varying float vScan;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.05, d);
            gl_FragColor = vec4(uColor * (vGlow + uBeacon * 0.8 + vScan * 1.6), a * uOpacity);
          }`,
      }),
    [rows],
  );

  useEffect(() => {
    let alive = true;
    buildShapes(count, journey.silhouette).then((table) => {
      if (!alive) return;
      // Riorganizza in RGBA, una fascia di `rows` righe per forma.
      const data = new Float32Array(WIDTH * rows * SHAPES.length * 4);
      for (let k = 0; k < SHAPES.length; k++)
        for (let i = 0; i < count; i++) {
          const src = (k * count + i) * 3, dst = (k * rows * WIDTH + i) * 4;
          data[dst] = table[src];
          data[dst + 1] = table[src + 1];
          data[dst + 2] = table[src + 2];
        }
      const tex = new DataTexture(data, WIDTH, rows * SHAPES.length, RGBAFormat, FloatType);
      tex.minFilter = tex.magFilter = NearestFilter;
      tex.needsUpdate = true;
      material.uniforms.uShapes.value = tex;
      gl.initTexture(tex); // caricata ora sulla GPU, non al primo ingresso nel capitolo
    });
    return () => {
      alive = false;
      material.uniforms.uShapes.value?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [count, rows, geometry, material, gl]);

  // Meno punti se il dispositivo fatica.
  usePerformanceMonitor({
    onDecline: () => geometry.setDrawRange(0, Math.round(count * 0.55)),
    onIncline: () => geometry.setDrawRange(0, count),
  });

  useFrame((_, dt) => {
    const pts = points.current;
    if (!pts) return;
    const st = material.uniforms.uShapes.value ? particleState() : null;
    pts.visible = !!st && st.opacity > 0.001;
    if (!st || !pts.visible) return;
    const u = material.uniforms;
    u.uA.value = shapeIndex(st.a);
    u.uB.value = shapeIndex(st.b);
    u.uMix.value = st.mix;
    u.uOpacity.value = st.opacity * (st.cream > 0.5 ? 0.9 : 0.85);
    u.uBeacon.value = st.beacon;
    u.uScan.value = st.scan;
    u.uScanY.value = st.scanY;
    u.uTime.value += Math.min(dt, 0.1);
    u.uColor.value.copy(ACCENT_DARK).lerp(ACCENT_LIGHT, st.cream);
    const blending = st.cream > 0.25 ? NormalBlending : AdditiveBlending;
    if (material.blending !== blending) material.blending = blending;
    u.uPx.value = (size.height * gl.getPixelRatio()) / (2 * Math.tan((FOV / 2) * (Math.PI / 180)));
    // Posizione del soggetto; rotazione lenta e cursore.
    const sub = subject(size.width / size.height);
    // Capitolo 7: il faro sale sopra il titolo e si rimpicciolisce, per non coprire il testo.
    const lift = st.lift * (sub.wide ? 0.72 : 0.5);
    pts.position.set((sub.wide ? sub.x * st.side : 0) + journey.pointer.x * 0.08 * st.beacon, sub.y + lift - journey.pointer.y * 0.06 * st.beacon, 0);
    pts.scale.setScalar(sub.s * (1 - st.lift * (sub.wide ? 0.2 : 0.3)));
    pts.rotation.y = Math.sin(u.uTime.value * 0.25) * 0.22 + journey.pointer.x * (0.18 + st.beacon * 0.2);
    pts.rotation.x = -journey.pointer.y * (0.1 + st.beacon * 0.15);
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
