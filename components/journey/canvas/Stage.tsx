"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { createStudioEnvironment } from "@/components/sculpture/studio";
import { journey } from "../progress";
import { FilmStrip } from "./FilmStrip";
import { Lenses } from "./Lenses";
import { Clapper } from "./Clapper";
import { Hologram } from "./Hologram";
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
  // Risoluzione: 1,5 al massimo; 1,25 su schermi ad alta densità e telefoni (il costo cresce col quadrato).
  const [dpr, setDpr] = useState(() => (journey.lite || window.devicePixelRatio > 1.5 ? 1.25 : 1.5));
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
        {/* Se gli fps calano si scende di qualità una volta sola e non si risale:
            ogni cambio di risoluzione rialloca tutti i buffer e fa scattare la scena. */}
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => { setDpr(1); setPost(false); }}
          onFallback={() => { setDpr(1); setPost(false); }}
        >
          <Studio />
          <Warmup />
          <Wake />
          <Rig />
          <Ring />
          <Lenses />
          <FilmStrip />
          <ProjectReel />
          <Particles />
          <Clapper />
          <Hologram />
          {post && <Post />}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}

/** Dopo la fine del viaggio la tela disegna solo su richiesta: lo scroll la risveglia. */
function Wake() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    journey.onChange = () => invalidate();
    return () => { journey.onChange = null; };
  }, [invalidate]);
  return null;
}

/**
 * Compila subito tutti gli shader della scena (anche dei capitoli non ancora visibili), in parallelo
 * dove il browser lo permette: senza, ogni capitolo compila al primo ingresso e la pagina si blocca.
 */
function Warmup() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let alive = true;
    const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    (async () => {
      await nextFrame();
      // Un oggetto alla volta, con un fotogramma in mezzo: nessun blocco unico lungo,
      // anche nei browser senza compilazione parallela degli shader.
      for (const child of [...scene.children]) {
        if (!alive) return;
        await gl.compileAsync(child, camera, scene).catch(() => {});
        await nextFrame();
      }
    })();
    return () => { alive = false; };
  }, [gl, scene, camera]);
  return null;
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
