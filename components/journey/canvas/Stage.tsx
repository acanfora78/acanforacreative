"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { WebGLRenderTarget, type Material } from "three";
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
          // Solo in sviluppo: espone il renderer per i test (programmi compilati, memoria).
          if (process.env.NODE_ENV !== "production") Object.assign(window, { __gl: gl });
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
          <Warmup post={post} />
          <Guard reduced={dpr === 1 && !post} post={post} />
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

/**
 * Misura gli fps mentre la scena si muove. Prima difesa: PerformanceMonitor abbassa la qualità.
 * Ultima difesa: se anche a qualità ridotta si resta sotto 24 fps per 4 secondi, la tela si spegne
 * e il sito continua senza 3D (stessi testi e capitoli, fondi normali), senza salti di scroll.
 */
function Guard({ reduced, post }: { reduced: boolean; post: boolean }) {
  const gl = useThree((s) => s.gl);
  const dpr = useThree((s) => s.viewport.dpr);
  const win = useRef({ t: 0, n: 0, slow: 0 });
  // Con il 3D forzato per i test (computer senza GPU) la tela non si spegne.
  const forced = useRef(false);
  useEffect(() => {
    try { forced.current = localStorage.getItem("ac-sculpture-force") === "1"; } catch {}
  }, []);
  useEffect(() => {
    const ctx = gl.getContext();
    const info = ctx.getExtension("WEBGL_debug_renderer_info");
    journey.stats.gpu = info ? String(ctx.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "?";
  }, [gl]);
  useFrame((_, dt) => {
    const w = win.current;
    w.t += dt;
    w.n++;
    if (w.t < 1) return;
    const fps = w.n / w.t;
    Object.assign(journey.stats, { fps: Math.round(fps), dpr, post, reduced });
    w.t = 0;
    w.n = 0;
    // Solo a scena attiva (non dopo la fine del viaggio) e solo a qualità già ridotta.
    if (reduced && fps < 24 && document.visibilityState === "visible") w.slow++;
    else w.slow = 0;
    if (w.slow >= 4 && !forced.current) journey.onGiveUp?.();
  });
  return null;
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
function Warmup({ post }: { post: boolean }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let alive = true;
    const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    // Con il postprocessing la scena si disegna in un'immagine intermedia, e Three.js usa
    // un'altra variante di ogni shader (senza tone mapping né conversione di colore):
    // va compilata quella. La variante "a schermo" serve se il postprocessing viene spento.
    const offscreen = new WebGLRenderTarget(1, 1);
    const variants: (WebGLRenderTarget | null)[] = post ? [offscreen, null] : [null];
    (async () => {
      await nextFrame();
      for (const target of variants) {
        // Un oggetto alla volta, con un fotogramma in mezzo: nessun blocco unico lungo,
        // anche nei browser senza compilazione parallela degli shader.
        for (const child of [...scene.children]) {
          if (!alive) return;
          const previous = gl.getRenderTarget();
          gl.setRenderTarget(target);
          const ready = gl.compileAsync(child, camera, scene); // la parte sincrona usa il target attuale
          gl.setRenderTarget(previous);
          await ready.catch(() => {});
          // Primo uso del programma: Three.js lo verifica solo al primo disegno e quella verifica
          // aspetta che la scheda grafica finisca tutto (la pagina si ferma). Lo facciamo ora,
          // un oggetto alla volta, invece che a metà dello scroll.
          child.traverse((o) => {
            const m = (o as { material?: Material | Material[] }).material;
            for (const mat of Array.isArray(m) ? m : m ? [m] : []) {
              const program = (gl.properties.get(mat) as { currentProgram?: { getUniforms(): unknown; getAttributes(): unknown } }).currentProgram;
              program?.getUniforms();
              program?.getAttributes();
            }
          });
          await nextFrame();
        }
      }
    })();
    return () => {
      alive = false;
      offscreen.dispose();
    };
  }, [gl, scene, camera, post]);
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
