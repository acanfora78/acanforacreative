"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Mesh, type MeshBasicMaterial } from "three";
import { ease, journey, lerp, span } from "../progress";

/*
 * Camera, colore di fondo e lampo di luce: tutto calcolato dall'avanzamento dei capitoli.
 * Capitolo 1 (obiettivo): la camera si avvicina, entra nell'anello, attraversa il tunnel di lenti,
 *   lampo, il fondo passa da nero a crema.
 * Capitolo 2 (manifesto): fondo crema, inquadratura sulla pellicola; alla fine zoom dentro un
 *   fotogramma, che porta al nero del capitolo 3.
 */
export const COLORS = {
  nero: new Color("#111111"),
  crema: new Color("#f7f4ec"),
  flash: new Color("#fff4dc"),
};
/** Centro del fotogramma in cui entra la camera alla fine del capitolo 2. */
export const FRAME_TARGET = { x: 0.5, y: -0.86, z: -0.015 };

export function Rig() {
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const setFrameloop = useThree((s) => s.setFrameloop);
  const flash = useRef<Mesh>(null);
  const bg = useMemo(() => new Color(), []);
  const done = useRef(false);

  function setFlash(v: number) {
    const m = flash.current;
    if (!m) return;
    m.visible = v > 0.001;
    (m.material as MeshBasicMaterial).opacity = v;
    m.position.copy(camera.position);
    m.quaternion.copy(camera.quaternion);
    m.translateZ(-0.1);
  }

  useFrame(() => {
    const [p1, p2] = journey.local;
    const aspect = size.width / size.height;
    // Distanza che fa entrare la scena anche in verticale.
    const dist = Math.max(5, 1.45 / (Math.tan((35 / 2) * (Math.PI / 180)) * aspect));
    const px = journey.pointer.x, py = journey.pointer.y;

    if (p1 < 1) {
      // Capitolo 1
      const approach = ease.inOut(span(p1, 0.1, 0.48));
      const z = lerp(dist, -0.6, approach) - span(p1, 0.48, 1) * 0.8;
      camera.position.set(px * 0.08 * (1 - approach), -py * 0.05 * (1 - approach), z);
      camera.lookAt(0, 0, z - 5);
      const f = span(p1, 0.8, 0.88) * (1 - span(p1, 0.88, 0.97));
      bg.copy(p1 < 0.88 ? COLORS.nero : COLORS.crema);
      setFlash(f);
    } else {
      // Capitolo 2
      const zoom = ease.in(span(p2, 0.72, 1));
      // Su schermi verticali la pellicola scende un po' di più, sotto il testo.
      const cy0 = aspect < 1 ? 0.45 : 0.22;
      const cx = lerp(0, FRAME_TARGET.x, zoom), cy = lerp(cy0, FRAME_TARGET.y, zoom);
      camera.position.set(cx + px * 0.05 * (1 - zoom), cy - py * 0.04 * (1 - zoom), lerp(dist * 0.9, FRAME_TARGET.z + 0.12, zoom));
      camera.lookAt(cx, cy, FRAME_TARGET.z - 1);
      bg.copy(COLORS.crema).lerp(COLORS.nero, span(p2, 0.96, 1));
      setFlash(0);
    }
    scene.background = bg;

    // A scena finita (capitolo 3 e oltre, ancora senza 3D) la tela non disegna più.
    const finished = p2 >= 1;
    if (finished !== done.current) {
      done.current = finished;
      setFrameloop(finished ? "demand" : "always");
      invalidate();
    }
  });

  return (
    <mesh ref={flash} renderOrder={999}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color={COLORS.flash} transparent opacity={0} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
