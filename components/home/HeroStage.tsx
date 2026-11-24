"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import type { SculptureEngine } from "@/components/sculpture/engine";
import { detectTier, Sculpture } from "@/components/sculpture/Sculpture";

gsap.registerPlugin(ScrollTrigger);

/*
 * Scena della Hero (fasi 9.3 e 9.4): la scultura e l'intro cinematica.
 *
 * Intro — solo all'arrivo diretto in home, una volta per sessione (decisione presa
 * prima del primo disegno da uno script in app/[lang]/layout.tsx, che imposta
 * <html data-intro="pending">). Quattro scene, 4,2 s:
 *   01 Arrival   0–1,1 s  la luce scorre sul metallo, la scultura emerge dal buio
 *   02 Form      1,1–2,5  la camera si avvicina del 12%, la scultura ruota e mostra la torsione
 *   03 Identity  2,5–3,4  si ferma di fronte, sulla silhouette del simbolo; il logo ufficiale
 *                          (file 06, non ricreato) si rivela dal basso, solo la parte del wordmark
 *   04 Experience 3,4–4,2 la scultura scivola nella Hero, il velo si apre, il titolo sale
 * Si salta con il pulsante, Esc o un clic. Se la scena 3D non è pronta in tempo, niente intro.
 * Il titolo resta disegnato sotto il velo: la misura del primo contenuto non peggiora.
 *
 * Regola anti-conflitto: GSAP guida i parametri della scultura, Three.js disegna.
 * L'intro e lo scroll non animano mai la stessa proprietà nello stesso momento.
 */

/** Ancoraggio del simbolo nel logo master (1200×760): centro della scultura e scala. */
const LOGO = { w: 1200, h: 760, anchorX: (295 + 434 * 0.9) / 1200, anchorY: (65 + 211 * 0.9) / 760, unit: 0.9 / 1200 };
/** Unità del tracciato per unità di scena (geometry.ts: SCALE = 1/260). */
const PATH_UNITS = 260;

type Props = { skipLabel: string; introLabel: string };

export function HeroStage({ skipLabel, introLabel }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<SculptureEngine | null>(null);
  const onEngine = useCallback((e: SculptureEngine | null) => setEngine(e), []);

  useEffect(() => {
    const root = document.documentElement;
    const box = stage.current;
    if (!engine || !box) return;
    const hero = box.closest("section") ?? box;
    const ctx = gsap.context(() => {});

    const scroll = () =>
      ctx.add(() => {
        // Scorrendo la scultura ruota fino a 60° e si allontana.
        gsap.fromTo(
          engine.params,
          { turn: 0, zoom: 1 },
          { turn: Math.PI / 3, zoom: 0.8, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } },
        );
      });

    if (root.dataset.intro !== "pending") {
      scroll();
      return () => ctx.revert();
    }

    root.dataset.intro = "playing";
    try { sessionStorage.setItem("ac-intro", "1"); } catch {}
    const p = engine.params;
    const v = veil.current!, m = mark.current!, logo = m.querySelector("img")!;
    const vw = window.innerWidth, vh = window.innerHeight;
    const r = box.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const unitPx = engine.pixelsPerUnit();
    // Scene 01–02: scultura al centro, grande (ingrandita al massimo 1,25 volte, per restare nitida).
    const big = Math.min(1.25, Math.min(vw * 0.82, vh * 0.95, 900) / (unitPx * 2.2));
    // Scena 03: scultura sovrapposta al simbolo del logo.
    const lr = logo.getBoundingClientRect();
    const toLogo = {
      x: lr.left + lr.width * LOGO.anchorX - cx,
      y: lr.top + lr.height * LOGO.anchorY - cy,
      scale: (lr.width * LOGO.unit) / (unitPx / PATH_UNITS),
    };
    const lines = hero.querySelectorAll<HTMLElement>(".intro-line > span");
    const fades = hero.querySelectorAll<HTMLElement>(".intro-fade");

    let tl: gsap.core.Timeline | null = null;
    const finish = () => {
      root.dataset.intro = "done";
      gsap.set(box, { clearProps: "transform,zIndex" });
      p.idle = 1;
      scroll();
    };
    const skip = () => tl?.progress(1);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") skip(); };

    ctx.add(() => {
      gsap.set(box, { x: vw / 2 - cx, y: vh / 2 - cy, scale: big, zIndex: 95, transformOrigin: "50% 50%" });
      Object.assign(p, { exposure: 0, light: -1.8, turn: -0.7, facing: 0.2, zoom: 1 / 1.12, idle: 0 });
      gsap.set(m, { clipPath: "inset(100% 0% 0% 0%)" });

      tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: finish });
      // 01 Arrival
      tl.to(p, { exposure: 1, duration: 1.1, ease: "power2.out" }, 0)
        .to(p, { light: 0, duration: 2.2, ease: "power2.inOut" }, 0)
        // 02 Form
        .to(p, { zoom: 1, turn: 0, duration: 1.4 }, 1.1)
        // 03 Identity
        .to(p, { facing: 1, duration: 0.9 }, 2.5)
        .to(box, { x: toLogo.x, y: toLogo.y, scale: toLogo.scale, duration: 0.9 }, 2.5)
        .to(m, { clipPath: "inset(55% 0% 0% 0%)", duration: 0.7, ease: "expo.out" }, 2.75)
        // 04 Experience
        .to(m, { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, 3.4)
        .to(p, { facing: 0, duration: 0.8 }, 3.4)
        .to(box, { x: 0, y: 0, scale: 1, duration: 0.8, ease: "expo.inOut" }, 3.4)
        .to(v, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 3.4)
        .from(lines, { yPercent: 105, stagger: 0.12, duration: 1.1, ease: "expo.out" }, 3.6)
        .from(fades, { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.9, ease: "expo.out" }, 3.8);
    });

    v.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);
    return () => {
      v.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      if (root.dataset.intro === "playing") root.dataset.intro = "done";
      ctx.revert();
    };
  }, [engine]);

  // Nessuna intro se il dispositivo mostra solo l'immagine, o se la scultura non è pronta in tempo.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "pending" && detectTier() === 0) root.dataset.intro = "done";
    const id = window.setTimeout(() => { if (root.dataset.intro === "pending") root.dataset.intro = "done"; }, 1800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <div
        ref={stage}
        className="pointer-events-none absolute inset-x-0 top-[9%] h-[42%] md:top-[3%] md:left-auto md:h-[64%] md:w-[58%]"
      >
        <Sculpture
          className="h-full w-full"
          poster="/sculpture/poster-tq.avif"
          sizes="(min-width: 768px) 58vw, 100vw"
          onEngine={onEngine}
          preload
        />
      </div>

      {/* Velo dell'intro: visibile solo con <html data-intro="pending|playing">. */}
      <div ref={veil} className="intro-veil fixed inset-0 z-[90] bg-nero" role="dialog" aria-label={introLabel}>
        <div
          ref={mark}
          className="absolute top-1/2 left-1/2 w-[min(86vw,720px)] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <Logo variant="negative-transparent" width={720} className="h-auto w-full" alt="" />
        </div>
        {/* Il clic arriva al velo, che salta l'intro. */}
        <button
          type="button"
          className="label absolute right-6 bottom-6 z-10 min-h-12 px-4 text-muted transition-colors duration-[var(--dur-short)] hover:text-fg md:right-10 md:bottom-10"
        >
          {skipLabel}
        </button>
      </div>
    </>
  );
}
