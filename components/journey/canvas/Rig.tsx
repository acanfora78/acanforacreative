"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Mesh, type MeshBasicMaterial } from "three";
import { lastStage } from "../chapters";
import { subject, viewDist } from "../layout";
import { currentChapter, ease, journey, lerp, span } from "../progress";
import { stageFx } from "./fx";
import { stripY } from "./ProjectReel";

/*
 * Camera, colore di fondo e lampo di luce: tutto calcolato dall'avanzamento dei capitoli.
 * 1 Obiettivo: la camera entra nell'anello, attraversa il tunnel di lenti, lampo, nero → crema.
 * 2 Manifesto: inquadratura sulla pellicola; alla fine zoom dentro un fotogramma (→ nero).
 * 3 Progetti: la camera esce dal fotogramma e mostra la pellicola dei progetti.
 * 4–7: camera fissa con un leggero parallasse; colori e scosse dai capitoli (vedi fx.ts).
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
    const ch = currentChapter();
    const p = journey.local[ch];
    const aspect = size.width / size.height;
    const dist = viewDist(aspect);
    const px = journey.pointer.x, py = journey.pointer.y;
    let f = 0;

    if (ch === 0) {
      const approach = ease.inOut(span(p, 0.1, 0.48));
      const z = lerp(dist, -0.6, approach) - span(p, 0.48, 1) * 0.8;
      camera.position.set(px * 0.08 * (1 - approach), -py * 0.05 * (1 - approach), z);
      camera.lookAt(0, 0, z - 5);
      f = span(p, 0.8, 0.88) * (1 - span(p, 0.88, 0.97));
      bg.copy(p < 0.88 ? COLORS.nero : COLORS.crema);
    } else if (ch === 1) {
      const zoom = ease.in(span(p, 0.72, 1));
      // Su schermi verticali la pellicola scende un po' di più, sotto il testo.
      const cy0 = aspect < 1 ? 0.45 : 0.22;
      const cx = lerp(0, FRAME_TARGET.x, zoom), cy = lerp(cy0, FRAME_TARGET.y, zoom);
      camera.position.set(cx + px * 0.05 * (1 - zoom), cy - py * 0.04 * (1 - zoom), lerp(dist * 0.9, FRAME_TARGET.z + 0.12, zoom));
      camera.lookAt(cx, cy, FRAME_TARGET.z - 1);
      bg.copy(COLORS.crema).lerp(COLORS.nero, span(p, 0.96, 1));
    } else if (ch === 2) {
      // Esce dal primo fotogramma dei progetti fino all'inquadratura completa.
      const sub = subject(aspect);
      const out = ease.out(span(p, 0, 0.16));
      const y = lerp(stripY(sub), 0, out);
      camera.position.set(px * 0.05 * out, y - py * 0.04 * out, lerp(0.75, dist, out));
      camera.lookAt(0, y, -1);
      bg.copy(COLORS.nero);
    } else {
      const fx = stageFx(ch, p);
      camera.position.set(px * 0.06 + fx.shake.x, -py * 0.04 + fx.shake.y, dist);
      camera.lookAt(fx.shake.x * 0.5, fx.shake.y * 0.5, 0);
      bg.copy(fx.from).lerp(fx.to, fx.mix);
      f = fx.flash;
    }
    setFlash(f);
    scene.background = bg;

    // Dopo l'ultimo capitolo con scena 3D la tela smette di disegnare.
    const finished = journey.local[lastStage] >= 1;
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
