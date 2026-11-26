"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { createStudioEnvironment } from "@/components/sculpture/studio";
import { journey } from "../progress";
import { FilmStrip } from "./FilmStrip";
import { Lenses } from "./Lenses";
import { Clapper } from "./Clapper";
import { Particles } from "./Particles";
import { Post } from "./Post";
import { ProjectReel } from "./ProjectReel";
import { Ring } from "./Ring";
import { Rig } from "./Rig";

/*
 * Tela unica del viaggio: fissa a tutto schermo, dietro ai testi HTML.
 * Caricata con next/dynamic (ssr: false) dopo il primo render.
 * Il disegno si ferma da solo con la scheda nascosta (requestAnimationFrame) e quando
 * la scena è finita (capitoli non ancora in 3D): vedi <Rig>.
 */
export default function Stage() {
  const [dpr, setDpr] = useState(1.5);
  const [post, setPost] = useState(!journey.lite);
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        gl={{ antialias: !journey.lite, powerPreference: "high-performance" }}
        camera={{ fov: 35, near: 0.05, far: 60, position: [0, 0, 5] }}
        onCreated={({ gl }) => {
          // Prima immagine disegnata: da qui le sezioni-scena diventano trasparenti.
          requestAnimationFrame(() => { document.documentElement.dataset.journey = "3d"; });
          gl.domElement.addEventListener("webglcontextlost", () => {
            document.documentElement.dataset.journey = "static";
          });
        }}
      >
        <PerformanceMonitor
          onDecline={() => { setDpr(1); setPost(false); }}
          onIncline={() => setDpr(1.5)}
        >
          <Studio />
          <Rig />
          <Ring />
          <Lenses />
          <FilmStrip />
          <ProjectReel />
          <Particles />
          <Clapper />
          {post && <Post />}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}

/** Ambiente di riflessi: lo studio procedurale della scultura (nessun HDRI da scaricare). */
function Studio() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const env = createStudioEnvironment(gl);
    scene.environment = env;
    return () => { scene.environment = null; env.dispose(); };
  }, [gl, scene]);
  // Luce di taglio calda (accento oro tenue).
  return <directionalLight position={[-3, 2, -2]} intensity={2.2} color="#e9d3a8" />;
}
