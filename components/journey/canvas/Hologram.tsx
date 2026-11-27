"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, CylinderGeometry, MeshBasicMaterial, TorusGeometry, type Group } from "three";
import { subject } from "../layout";
import { currentChapter, journey, span } from "../progress";

/*
 * Capitolo 6 — Studio: piattaforma dell'ologramma con un anello di luce che sale e scende
 * come una scansione. La sagoma è fatta dalle particelle (Particles.tsx): dove passa l'anello,
 * i punti si accendono. Sagoma segnaposto finché manca /public/images/morgan-sagoma.png.
 */
const BOTTOM = -1.0;
const TOP = 0.9;

/** Altezza dell'anello di scansione (coordinate della sagoma) per l'avanzamento del capitolo. */
export function scanY(p: number) {
  const t = span(p, 0.25, 1) * 2; // due passaggi completi
  const tri = t % 2 < 1 ? t % 1 : 1 - (t % 1);
  return BOTTOM + (TOP - BOTTOM) * tri;
}
/** Il soggetto del capitolo 6 sta a sinistra su schermi larghi (dove c'era la foto). */
export const studioX = (sub: { x: number; wide: boolean }) => (sub.wide ? -sub.x : 0);

export function Hologram() {
  const group = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const size = useThree((s) => s.size);
  const res = useMemo(
    () => ({
      base: new CylinderGeometry(0.95, 1.0, 0.05, 96, 1, true),
      torus: new TorusGeometry(1, 0.008, 8, 160),
      glow: new MeshBasicMaterial({ color: 0xd6c29a, transparent: true, blending: AdditiveBlending, depthWrite: false }),
      dim: new MeshBasicMaterial({ color: 0xa89575, transparent: true, opacity: 0.25, blending: AdditiveBlending, depthWrite: false }),
    }),
    [],
  );
  useEffect(() => () => Object.values(res).forEach((r) => r.dispose()), [res]);

  useFrame(() => {
    const g = group.current, r = ring.current;
    if (!g || !r) return;
    const ch = currentChapter();
    const p = journey.local[ch];
    const a = ch === 5 ? span(p, 0.1, 0.25) : ch === 6 ? 1 - span(p, 0, 0.12) : 0;
    g.visible = a > 0.001;
    if (!g.visible) return;
    res.glow.opacity = 0.9 * a;
    res.dim.opacity = 0.25 * a;
    const sub = subject(size.width / size.height);
    g.position.set(studioX(sub), sub.y, 0);
    g.scale.setScalar(sub.s);
    g.rotation.set(0.12 - journey.pointer.y * 0.05, journey.pointer.x * 0.15, 0);
    r.position.y = ch === 5 ? scanY(p) : BOTTOM;
  });

  return (
    <group ref={group} visible={false}>
      {/* Piattaforma: bordo luminoso e anello di base. */}
      <mesh geometry={res.base} material={res.dim} position={[0, BOTTOM - 0.03, 0]} />
      <mesh geometry={res.torus} material={res.glow} position={[0, BOTTOM, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.98} />
      {/* Anello di scansione. */}
      <group ref={ring}>
        <mesh geometry={res.torus} material={res.glow} rotation={[Math.PI / 2, 0, 0]} scale={0.72} />
      </group>
    </group>
  );
}
