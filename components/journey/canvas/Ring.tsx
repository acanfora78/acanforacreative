"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MeshPhysicalMaterial, MeshStandardMaterial, type Group } from "three";
import { createLamaGeometry } from "@/components/sculpture/geometry";
import { ease, journey, lerp, span } from "../progress";

/*
 * Capitolo 1 — l'anello/obiettivo: la scultura "Lama" (forma dal tracciato del simbolo master)
 * in vetro con un velo d'iridescenza. Su telefono: metallo satinato, molto più leggero
 * (la trasmissione del vetro richiede un passaggio di disegno in più).
 * Rotazione lenta e inclinazione verso il cursore; avvicinandosi la camera, si mette di fronte.
 */
export function Ring() {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => (journey.lite ? createLamaGeometry({ samples: 160, ring: 24 }) : createLamaGeometry({ samples: 220, ring: 32 })), []);
  const material = useMemo(
    () =>
      journey.lite
        ? new MeshStandardMaterial({ color: 0x8f8b84, metalness: 1, roughness: 0.28 })
        : new MeshPhysicalMaterial({
            color: 0xf3e6cc,
            metalness: 0.05,
            roughness: 0.06,
            transmission: 1,
            thickness: 0.35,
            ior: 1.5,
            iridescence: 0.35,
            iridescenceIOR: 1.3,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            envMapIntensity: 1.4,
          }),
    [],
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  const clock = useRef(0);
  const size = useThree((s) => s.size);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const p = journey.local[0];
    g.visible = p < 0.6;
    if (!g.visible) return;
    clock.current += Math.min(dt, 0.1);
    const front = span(p, 0.08, 0.36); // di fronte quando la camera entra
    const idle = 1 - front;
    // Nella Hero l'anello sta a destra del titolo (sopra, su telefono); entrando torna al centro.
    const wide = size.width / size.height > 1;
    const settle = 1 - ease.inOut(span(p, 0.06, 0.4));
    g.position.set((wide ? 0.95 : 0) * settle, (wide ? 0.32 : 0.4) * settle, 0);
    g.scale.setScalar(lerp(1, wide ? 1.15 : 1.25, settle));
    g.rotation.y = (Math.sin(clock.current * 0.25) * 0.45 + journey.pointer.x * 0.14) * idle + 0.5 * idle * 0.6;
    g.rotation.x = (Math.sin(clock.current * 0.18) * 0.08 + journey.pointer.y * 0.14) * idle + 0.35 * idle;
    // Entrata: la luce emerge (scala dell'ambiente) nei primi istanti dopo il caricamento.
    const intro = Math.min(1, clock.current / 1.2);
    if ("envMapIntensity" in material) material.envMapIntensity = (journey.lite ? 1 : 1.4) * intro;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} />
    </group>
  );
}
