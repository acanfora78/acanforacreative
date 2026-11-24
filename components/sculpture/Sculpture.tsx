"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { SculptureEngine, Tier, View } from "./engine";

/*
 * Scultura 3D "Lama" con fallback progressivo:
 *   livello 0 — solo immagine (senza JavaScript, WebGL assente, risparmio dati, "riduci movimento");
 *   livello 1 — 3D leggero (telefoni e dispositivi modesti: meno poligoni, 30 fps, DPR ≤ 1,25);
 *   livello 2 — 3D completo (60 fps, antialias, DPR ≤ 2).
 * L'immagine è sempre nel markup: la tela 3D compare sopra solo dopo il primo fotogramma.
 * Il rendering si ferma fuori schermo e con la scheda nascosta; il contesto WebGL
 * viene liberato quando il componente esce dalla pagina.
 */

export type SculptureTier = 0 | Tier;

/** Sceglie il livello in base al dispositivo. */
export function detectTier(): SculptureTier {
  if (typeof window === "undefined") return 0;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return 0;
  try {
    if (!document.createElement("canvas").getContext("webgl2")) return 0;
  } catch {
    return 0;
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  if (coarse || cores <= 4 || memory <= 4) return 1;
  return 2;
}

type Props = {
  /** Immagine di riserva (stessa inquadratura della vista scelta). */
  poster?: string;
  view?: View;
  /** Forza un livello (pagina di revisione); altrimenti automatico. */
  tier?: SculptureTier;
  /** Ferma nella posa di base, un solo fotogramma (immagini di riserva, revisione). */
  still?: boolean;
  /** La scultura segue leggermente il puntatore. */
  interactive?: boolean;
  /** Riceve il motore quando è pronto (per animarlo con GSAP). */
  onEngine?: (engine: SculptureEngine | null) => void;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

export function Sculpture({ poster, view = "tq", tier, still = false, interactive = true, onEngine, className = "", sizes = "100vw", preload = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const onEngineRef = useRef(onEngine);
  useEffect(() => { onEngineRef.current = onEngine; });

  useEffect(() => {
    const level = tier ?? detectTier();
    const el = canvas.current, box = wrap.current;
    if (level === 0 || !el || !box) return;

    let engine: SculptureEngine | null = null;
    let cancelled = false;
    let visible = false;
    const sync = () => { if (!engine) return; if (visible && !document.hidden) engine.start(); else engine.stop(); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: "100px" });
    const onVisibility = () => sync();
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      engine?.setPointer(MathClamp(((e.clientX - r.left) / r.width) * 2 - 1), MathClamp(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLost = (e: Event) => { e.preventDefault(); el.dataset.ready = "false"; engine?.stop(); };

    import("./engine")
      .then(({ createSculptureEngine }) => {
        if (cancelled) return;
        engine = createSculptureEngine(el, { tier: level, view });
        if (still) engine.params.idle = 0;
        engine.renderOnce();
        el.dataset.ready = "true";
        onEngineRef.current?.(engine);
        if (still) return;
        io.observe(box);
        document.addEventListener("visibilitychange", onVisibility);
        if (interactive && level === 2) window.addEventListener("pointermove", onMove, { passive: true });
        el.addEventListener("webglcontextlost", onLost);
      })
      .catch(() => { /* resta l'immagine di riserva */ });

    return () => {
      cancelled = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("webglcontextlost", onLost);
      onEngineRef.current?.(null);
      engine?.dispose();
      el.dataset.ready = "false";
    };
  }, [tier, view, still, interactive]);

  return (
    <div ref={wrap} className={`relative [&:has(canvas[data-ready=true])>img]:opacity-0 ${className}`} aria-hidden="true">
      {poster && <Image src={poster} alt="" fill sizes={sizes} preload={preload} className="object-contain transition-opacity duration-700" />}
      <canvas
        ref={canvas}
        data-ready="false"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
      />
    </div>
  );
}

const MathClamp = (v: number) => Math.max(-1, Math.min(1, v));
