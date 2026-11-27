"use client";

import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo } from "react";
import { Vector2 } from "three";
import { journey } from "../progress";

/*
 * Postprocessing leggero, solo desktop: grana pellicola, vignettatura, bloom basso.
 * L'aberrazione cromatica cresce solo con la velocità dello scroll (transizioni veloci).
 */
export function Post() {
  const offset = useMemo(() => new Vector2(0, 0), []);
  useFrame(() => {
    const v = Math.min(1, Math.abs(journey.velocity) / 60);
    offset.set(0.0025 * v, 0.0012 * v);
  });
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.35} luminanceThreshold={0.82} luminanceSmoothing={0.15} resolutionScale={0.5} />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      <Vignette offset={0.3} darkness={0.45} />
    </EffectComposer>
  );
}
