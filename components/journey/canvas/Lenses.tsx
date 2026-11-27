"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Color, MeshStandardMaterial, RingGeometry, ShaderMaterial, TorusGeometry, type Group } from "three";
import { FRAME } from "./FilmStrip";
import { ease, journey, lerp, span } from "../progress";

/*
 * Le sei lenti.
 * Capitolo 1: tunnel di lenti concentriche che scorrono verso la camera, dentro l'anello.
 * Capitolo 2: le stesse lenti si allineano sulla pellicola e diventano i suoi fotogrammi.
 */
const COUNT = 6;
const RADII = [0.78, 0.6, 0.9, 0.66, 0.84, 0.56];
const ACCENT = new Color("#a89575");

export function Lenses() {
  const groups = useRef<(Group | null)[]>([]);
  const torus = useMemo(() => new TorusGeometry(1, 0.012, 12, 160), []);
  const rim = useMemo(() => new MeshStandardMaterial({ color: ACCENT, metalness: 1, roughness: 0.25, envMapIntensity: 1.6 }), []);
  // Disco di vetro: trasparente al centro, luminoso sul bordo (fresnel), luce additiva.
  const disc = useMemo(() => new RingGeometry(0.02, 1, 96, 1), []);
  const glass = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uOpacity: { value: 1 }, uColor: { value: new Color("#e9d3a8") } },
        vertexShader: `varying vec2 vUv; varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform float uOpacity; uniform vec3 uColor; varying vec3 vPos;
          void main(){ float r = length(vPos.xy); float edge = smoothstep(0.55, 1.0, r); float caustic = 0.06 * (1.0 - r);
            gl_FragColor = vec4(uColor * (edge * edge * 0.55 + caustic), 1.0) * uOpacity; }`,
      }),
    [],
  );
  useEffect(() => () => { torus.dispose(); rim.dispose(); disc.dispose(); glass.dispose(); }, [torus, rim, disc, glass]);

  useFrame(() => {
    const [p1, p2] = journey.local;
    const inTunnel = p1 > 0.28 && p1 < 0.9;
    const onStrip = p1 >= 1 && p2 < 0.4;
    glass.uniforms.uOpacity.value = inTunnel ? span(p1, 0.28, 0.4) : 0;
    rim.envMapIntensity = onStrip ? 0.9 : 1.6;
    for (let i = 0; i < COUNT; i++) {
      const g = groups.current[i];
      if (!g) continue;
      g.visible = inTunnel || onStrip;
      if (!g.visible) continue;
      const disc = g.children[1];
      if (inTunnel) {
        // Scorrono verso la camera (che si ferma poco dopo l'anello, z ≈ -1).
        const travel = span(p1, 0.28, 0.92) * 15;
        const z = -3 - i * 2.2 + travel;
        g.position.set(Math.sin(i * 1.7) * 0.05, Math.cos(i * 2.3) * 0.05, z);
        g.rotation.set(0, 0, i * 0.4 + p1 * (i % 2 ? 1 : -1));
        g.scale.setScalar(RADII[i]);
        disc.visible = true;
      } else {
        // Allineamento sulla pellicola: dal fondo al proprio fotogramma, poi svaniscono nel fotogramma.
        const a = ease.out(span(p2, 0, 0.16));
        const x = (i - (COUNT - 1) / 2) * FRAME.width;
        g.position.set(lerp(x * 0.3, x, a), lerp(0.4, FRAME.y, a), lerp(-3, -0.06 * x * x + 0.03, a));
        g.rotation.set(0, 0, lerp(i, 0, a));
        const fade = 1 - span(p2, 0.18 + i * 0.025, 0.3 + i * 0.025);
        g.scale.setScalar(lerp(0.42, FRAME.inner * 0.5, a) * (0.6 + 0.4 * fade));
        g.visible = fade > 0.01;
        disc.visible = false;
      }
    }
  });

  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }} visible={false}>
          <mesh geometry={torus} material={rim} />
          <mesh geometry={disc} material={glass} />
        </group>
      ))}
    </>
  );
}
