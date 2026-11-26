"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, ShaderMaterial } from "three";
import { journey, span } from "../progress";
import { FRAME_TARGET } from "./Rig";

/*
 * Capitolo 2 — la striscia di pellicola, tutta procedurale (nessuna immagine):
 * nastro curvo con perforazioni sui bordi e fotogrammi vuoti luminosi.
 * Compare dal centro verso i lati mentre le lenti si allineano; alla fine la camera
 * entra nel fotogramma centrale, che si spegne nel nero del capitolo 3.
 */
const LENGTH = 12; // unità di scena
const FRAMES = 12; // fotogrammi su tutta la lunghezza: larghezza 1
const HEIGHT = 0.78;
export const FRAME = { width: LENGTH / FRAMES, y: FRAME_TARGET.y, inner: 0.62 };

function stripGeometry() {
  const seg = 240;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    const x = (u - 0.5) * LENGTH;
    // Curva dolce: i lati si allontanano dalla camera.
    const z = -0.06 * x * x;
    for (const v of [0, 1]) {
      pos.push(x, FRAME.y + (v - 0.5) * HEIGHT, z);
      uv.push(u, v);
    }
  }
  for (let i = 0; i < seg; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

export function FilmStrip() {
  const geometry = useMemo(stripGeometry, []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: DoubleSide,
        transparent: true,
        uniforms: {
          uReveal: { value: 0 },
          uGlow: { value: 0 },
          uDark: { value: 0 },
          uBase: { value: new Color("#141210") },
          uLight: { value: new Color("#f3e3c0") },
          uFrames: { value: FRAMES },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          uniform float uReveal, uGlow, uDark, uFrames; uniform vec3 uBase, uLight; varying vec2 vUv;
          float box(vec2 p, vec2 a, vec2 b, float s){ vec2 q = smoothstep(a - s, a + s, p) * (1.0 - smoothstep(b - s, b + s, p)); return q.x * q.y; }
          void main(){
            // Compare dal centro verso i lati.
            float d = abs(vUv.x - 0.5) * 2.0;
            float reveal = 1.0 - smoothstep(uReveal - 0.04, uReveal, d);
            if (reveal < 0.01) discard;
            // Perforazioni: 4 per fotogramma, sui due bordi.
            float perfU = fract(vUv.x * uFrames * 4.0);
            float edgeV = min(vUv.y, 1.0 - vUv.y);
            float hole = box(vec2(perfU, edgeV), vec2(0.3, 0.035), vec2(0.7, 0.095), 0.01);
            if (hole > 0.5) discard;
            // Fotogrammi: celle con angoli morbidi tra le due file di perforazioni.
            float cell = fract(vUv.x * uFrames);
            float frame = box(vec2(cell, vUv.y), vec2(0.06, 0.17), vec2(0.94, 0.83), 0.006);
            // Fotogramma centrale (quello in cui entra la camera) un po' più luminoso.
            float centre = 1.0 - smoothstep(0.0, 1.0 / uFrames, abs(vUv.x - 0.5 - 0.5 / uFrames));
            vec3 lightCol = mix(uLight, vec3(0.067), uDark * centre);
            float glow = uGlow * (0.75 + 0.25 * centre);
            vec3 col = mix(uBase, lightCol, frame * glow);
            gl_FragColor = vec4(col, reveal);
          }`,
      }),
    [],
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame(() => {
    const [p1, p2] = journey.local;
    const visible = p1 >= 1 && p2 > 0.13;
    material.visible = visible;
    if (!visible) return;
    material.uniforms.uReveal.value = 0.04 + span(p2, 0.13, 0.42) * 1.04;
    material.uniforms.uGlow.value = span(p2, 0.18, 0.4);
    material.uniforms.uDark.value = span(p2, 0.9, 1);
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
