"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CanvasTexture,
  Color,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { subject } from "../layout";
import { ease, journey, lerp, span } from "../progress";

/*
 * Capitolo 3 — Progetti. I fotogrammi della pellicola diventano i progetti in evidenza.
 * Immagini: solo gli screenshot reali dei case study; i progetti senza immagini hanno un
 * fotogramma tipografico (nome e categoria), mai immagini inventate.
 * Scorrendo la pellicola avanza in orizzontale: il progetto attivo è a fuoco, gli altri sfocati.
 * Passando sul titolo del progetto (HTML): leggera distorsione e separazione RGB.
 * Alla fine la pellicola si avvolge in una bobina, che il capitolo 4 dissolve in particelle.
 */
export const TILE = { w: 1.6, h: 1.0 };
/** Altezza della pellicola: sotto l'intestazione, sopra il progetto attivo. */
export const stripY = (sub: { wide: boolean; y: number }) => (sub.wide ? 0.1 : sub.y * 0.41);
const PAD = 2; // fotogrammi vuoti prima e dopo
const CELL = { w: 1024, h: 640 };

/** Indice del progetto attivo (continuo) per l'avanzamento del capitolo. */
export const activeProject = (p: number, n: number) => span(p, 0.15, 0.8) * Math.max(0, n - 1);
/** Avvolgimento in bobina, da 0 a 1. */
export const windOf = (p: number) => ease.inOut(span(p, 0.82, 1));

async function buildAtlas(lite: boolean) {
  const items = journey.projects;
  const cols = 2, rows = Math.max(1, Math.ceil(items.length / cols));
  const k = lite ? 0.5 : 1;
  const cw = CELL.w * k, ch = CELL.h * k;
  const canvas = document.createElement("canvas");
  canvas.width = cw * cols;
  canvas.height = ch * rows;
  const ctx = canvas.getContext("2d")!;
  await document.fonts?.ready;
  const display = getComputedStyle(document.querySelector(".font-display") ?? document.body).fontFamily;
  const sans = getComputedStyle(document.body).fontFamily;
  await Promise.all(
    items.map(async (p, i) => {
      const x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
      ctx.fillStyle = "#242424";
      ctx.fillRect(x, y, cw, ch);
      if (p.cover) {
        const img = new Image();
        img.src = p.cover;
        try {
          await img.decode();
          // Come "object-cover object-top": riempie il fotogramma partendo dall'alto.
          const s = Math.max(cw / img.width, ch / img.height);
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, cw, ch);
          ctx.clip();
          ctx.drawImage(img, x + (cw - img.width * s) / 2, y, img.width * s, img.height * s);
          ctx.restore();
          return;
        } catch {
          /* fotogramma tipografico */
        }
      }
      ctx.fillStyle = "#f7f4ec";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.round(ch * 0.16)}px ${display}`;
      ctx.fillText(p.name, x + cw / 2, y + ch * 0.46);
      ctx.fillStyle = "#aba79e";
      ctx.font = `${Math.round(ch * 0.04)}px ${sans}`;
      ctx.letterSpacing = `${Math.round(ch * 0.012)}px`;
      ctx.fillText(p.category.toUpperCase(), x + cw / 2, y + ch * 0.62);
    }),
  );
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, cols, rows };
}

export function ProjectReel() {
  const mesh = useRef<InstancedMesh>(null);
  const size = useThree((s) => s.size);
  const n = journey.projects.length;
  const count = n + PAD * 2;
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(TILE.w, TILE.h);
    g.setAttribute("aTile", new InstancedBufferAttribute(new Float32Array(count).map((_, i) => (i >= PAD && i < PAD + n ? i - PAD : -1)), 1));
    const focus = new InstancedBufferAttribute(new Float32Array(count), 1);
    focus.setUsage(DynamicDrawUsage);
    g.setAttribute("aFocus", focus);
    return g;
  }, [count, n]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        uniforms: {
          uMap: { value: null },
          uGrid: { value: [2, 1] },
          uHover: { value: 0 },
          uTime: { value: 0 },
          uAlpha: { value: 1 },
          uBase: { value: new Color("#0d0c0b") },
        },
        vertexShader: `
          attribute float aTile; attribute float aFocus;
          varying vec2 vUv; varying float vTile; varying float vFocus;
          void main(){ vUv = uv; vTile = aTile; vFocus = aFocus;
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform sampler2D uMap; uniform vec2 uGrid; uniform float uHover, uTime, uAlpha; uniform vec3 uBase;
          varying vec2 vUv; varying float vTile; varying float vFocus;
          float box(vec2 p, vec2 a, vec2 b, float s){ vec2 q = smoothstep(a - s, a + s, p) * (1.0 - smoothstep(b - s, b + s, p)); return q.x * q.y; }
          void main(){
            // Bordo di pellicola con perforazioni (4 per fotogramma).
            float edge = min(vUv.y, 1.0 - vUv.y);
            float hole = box(vec2(fract(vUv.x * 4.0), edge), vec2(0.3, 0.035), vec2(0.7, 0.085), 0.01);
            if (hole > 0.5) discard;
            vec2 a = vec2(0.05, 0.13), b = vec2(0.95, 0.87);
            float inside = box(vUv, a, b, 0.004);
            vec3 col = uBase;
            if (inside > 0.0) {
              vec2 uv = (vUv - a) / (b - a);
              float blur = clamp(vFocus, 0.0, 1.0);
              vec3 img = vec3(0.045);
              if (vTile >= 0.0) {
                float h = uHover * (1.0 - blur);
                uv.x += sin(uv.y * 18.0 + uTime * 3.0) * 0.004 * h;
                vec2 cell = vec2(mod(vTile, uGrid.x), floor(vTile / uGrid.x));
                vec2 base = (cell + vec2(uv.x, 1.0 - uv.y)) / uGrid; base.y = 1.0 - base.y;
                vec2 off = vec2(0.006 * h / uGrid.x, 0.0);
                float bias = blur * 5.0;
                img = vec3(texture2D(uMap, base + off, bias).r, texture2D(uMap, base, bias).g, texture2D(uMap, base - off, bias).b);
              }
              // Sfocati e più scuri fuori fuoco.
              img *= 1.0 - 0.55 * blur;
              col = mix(col, img, inside);
            }
            gl_FragColor = vec4(col, uAlpha);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );

  useEffect(() => {
    let alive = true;
    buildAtlas(journey.lite).then(({ tex, cols, rows }) => {
      if (!alive) return tex.dispose();
      material.uniforms.uMap.value = tex;
      material.uniforms.uGrid.value = [cols, rows];
    });
    const onHover = (e: Event) => { hoverTarget.current = (e as CustomEvent<number>).detail; };
    window.addEventListener("journey:hover", onHover);
    return () => {
      alive = false;
      window.removeEventListener("journey:hover", onHover);
      material.uniforms.uMap.value?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const hoverTarget = useRef(0);
  const tmp = useMemo(() => ({ m: new Matrix4(), q: new Quaternion(), p: new Vector3(), s: new Vector3(), z: new Vector3(0, 0, 1) }), []);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const p = journey.local[2];
    // Resta come bobina all'inizio del capitolo 4, mentre le particelle la sostituiscono.
    const fadeOut = span(journey.local[3], 0, 0.06);
    const on = journey.local[1] >= 1 && (p < 1 || fadeOut < 1);
    material.uniforms.uAlpha.value = 1 - fadeOut;
    m.visible = on && material.uniforms.uMap.value !== null;
    if (!m.visible) return;
    const aspect = size.width / size.height;
    const sub = subject(aspect);
    const a = activeProject(p, n);
    const wind = windOf(p);
    const sy = stripY(sub);
    const scale = sub.wide ? 1.25 : 1.1;
    // Bobina: i fotogrammi si dispongono su un cerchio attorno al soggetto, uno ogni 2π/count.
    const R = 0.72 * sub.s;
    const reelScale = ((Math.PI * 2 * R) / count / TILE.w) * 0.96;
    const focus = geometry.getAttribute("aFocus") as InstancedBufferAttribute;
    for (let i = 0; i < count; i++) {
      const k = i - PAD - a;
      const s = k * TILE.w * scale;
      const wi = ease.inOut(Math.min(1, Math.max(0, wind * 1.6 - Math.abs(k) * 0.12)));
      const phi = (k * Math.PI * 2) / count; // dall'alto, in senso orario
      const reel = { x: sub.x + Math.sin(phi) * R, y: sub.y + Math.cos(phi) * R };
      tmp.p.set(lerp(s, reel.x, wi), lerp(sy, reel.y, wi), -Math.abs(s) * 0.04 * (1 - wi));
      tmp.q.setFromAxisAngle(tmp.z, lerp(0, -phi, wi));
      tmp.s.setScalar(lerp(scale, reelScale, wi));
      tmp.m.compose(tmp.p, tmp.q, tmp.s);
      m.setMatrixAt(i, tmp.m);
      focus.setX(i, Math.min(1, Math.abs(i - PAD - a)) * (1 - wind));
    }
    m.instanceMatrix.needsUpdate = true;
    focus.needsUpdate = true;
    const u = material.uniforms;
    u.uTime.value += dt;
    u.uHover.value += (hoverTarget.current - u.uHover.value) * Math.min(1, dt * 6);
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}
