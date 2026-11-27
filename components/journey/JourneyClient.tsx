"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { detectTier } from "@/components/sculpture/Sculpture";
import { chapters } from "./chapters";
import { journey, type JourneyProject } from "./progress";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** La tela 3D arriva dopo il primo render, in un pacchetto separato (three + R3F). */
const Stage = dynamic(() => import("./canvas/Stage"), { ssr: false });

type Mode = "pending" | "3d" | "static";

/*
 * Regia del viaggio in home (fase 10).
 * - 3D: Lenis + una ScrollTrigger per capitolo (pin e scrub), che scrive l'avanzamento in `journey`.
 *   I testi HTML del capitolo seguono la stessa timeline (scrub): tutto è reversibile.
 * - Statico ("riduci movimento", dispositivi senza GPU, WebGL assente): nessun pin, nessuno scrub,
 *   sezioni normali con semplici entrate.
 * <html data-journey="3d|static"> guida il CSS (sfondi trasparenti solo quando la tela è pronta).
 */
type Props = { nav: string; labels: readonly string[]; scene: string; projects: JourneyProject[]; silhouette?: string; children: ReactNode };

export function JourneyClient({ nav, labels, scene, projects, silhouette, children }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [active, setActive] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const triggers = useRef<(ScrollTrigger | null)[]>([]);

  // Modalità decisa in un layout effect: arriva prima della regia di MotionScope (componente padre),
  // che così non anima gli elementi dei capitoli guidati dalla scena 3D (un solo motore per proprietà).
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tier = detectTier();
    const next: Mode = reduced || tier === 0 ? "static" : "3d";
    journey.lite = tier === 1 || window.matchMedia("(max-width: 767px)").matches;
    journey.projects = projects;
    journey.silhouette = silhouette;
    journey.sceneLabel = scene;
    root.dataset.journeyMode = next;
    if (next === "static") root.dataset.journey = "static";
    // La tela 3D parte quando il browser è libero dopo il caricamento: non contende il primo disegno.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = next === "3d" ? idle(() => setMode(next), { timeout: 1500 }) : (setTimeout(() => setMode(next), 0) as unknown as number);
    return () => {
      if (next === "3d") cancelIdle(id);
      else clearTimeout(id);
      delete root.dataset.journeyMode;
    };
  }, [projects, silhouette, scene]);

  useEffect(() => {
    const el = root.current;
    if (!el || mode === "pending") return;
    const sections = chapters.map((c) => el.querySelector<HTMLElement>(`[data-chapter="${c.id}"]`));
    const ctx = gsap.context(() => {}, el);
    let lenis: Lenis | null = null;

    // Capitolo attivo (puntini): la sezione che attraversa la metà dello schermo.
    // Va creato dopo i pin, perché ScrollTrigger calcola le posizioni in ordine di creazione.
    const trackActive = () =>
      ctx.add(() => {
        sections.forEach((s, i) => {
          if (!s) return;
          ScrollTrigger.create({ trigger: s, start: "top 50%", end: "bottom 50%", onToggle: (t) => t.isActive && setActive(i) });
        });
      });

    if (mode === "static") {
      trackActive();
      // Entrate semplici, una volta sola (solo se il movimento è permesso).
      ctx.add(() => {
        gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
          el.querySelectorAll<HTMLElement>("[data-journey-lines]").forEach((p) =>
            gsap.from(p, { autoAlpha: 0, y: 32, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%", once: true } }),
          );
        });
      });
      return () => ctx.revert();
    }

    // ── 3D ──
    // lerp più alto del predefinito (0,1): lo scroll segue la rotella con meno ritardo.
    lenis = new Lenis({ autoRaf: false, lerp: 0.14 });
    lenisRef.current = lenis;
    lenis.on("scroll", (e: Lenis) => {
      journey.velocity = e.velocity;
      ScrollTrigger.update();
    });
    const tick = (time: number) => lenis!.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Capitolo 7: la luce del faro segue il cursore anche sul testo (variabili CSS, nessun render React).
    const beacon = el.querySelector<HTMLElement>('[data-chapter="contatto"] > section');
    // Solo durante il capitolo 7 e al massimo una volta per fotogramma (ridisegna un gradiente a tutto schermo).
    let beaconFrame = 0;
    const onPointer = (e: PointerEvent) => {
      journey.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      journey.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      const p7 = journey.local[journey.local.length - 1];
      if (!beacon || p7 <= 0 || p7 >= 1 || beaconFrame) return;
      beaconFrame = requestAnimationFrame(() => {
        beaconFrame = 0;
        beacon.style.setProperty("--bx", `${e.clientX}px`);
        beacon.style.setProperty("--by", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    // Passaggio sul titolo del progetto attivo: distorsione leggera nella pellicola (capitolo 3).
    const hover = (v: number) => () => window.dispatchEvent(new CustomEvent("journey:hover", { detail: v }));
    const links = [...el.querySelectorAll<HTMLElement>('[data-chapter="progetti"] li a')];
    const on = hover(1), off = hover(0);
    links.forEach((a) => { a.addEventListener("pointerenter", on); a.addEventListener("pointerleave", off); a.addEventListener("focus", on); a.addEventListener("blur", off); });

    ctx.add(() => {
      sections.forEach((s, i) => {
        const c = chapters[i];
        if (!s) return;
        const vh = journey.lite ? c.vh.mobile : c.vh.desktop;
        const write = (t: ScrollTrigger) => {
          journey.local[i] = t.progress;
          journey.onChange?.();
        };
        if (!c.pin) {
          triggers.current[i] = ScrollTrigger.create({ trigger: s, start: "top bottom", end: "bottom top", onUpdate: write, onRefresh: write });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "none" } });
        chapterText(tl, s, c.id);
        triggers.current[i] = ScrollTrigger.create({
          trigger: s,
          start: "top top",
          end: `+=${vh}%`,
          pin: true,
          scrub: true,
          animation: tl,
          onUpdate: write,
          onRefresh: write,
          // Puntino attivo: il capitolo il cui pin è in corso.
          onToggle: (t) => t.isActive && setActive(i),
        });
      });
    });
    // Capitoli non fissati (se ce ne sono): puntino attivo dalla posizione della sezione.
    if (chapters.some((c) => !c.pin)) trackActive();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    // Solo in sviluppo: espone l'avanzamento per i test automatici.
    if (process.env.NODE_ENV !== "production") Object.assign(window, { __journey: { journey, triggers: triggers.current } });

    return () => {
      links.forEach((a) => { a.removeEventListener("pointerenter", on); a.removeEventListener("pointerleave", off); a.removeEventListener("focus", on); a.removeEventListener("blur", off); });
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(beaconFrame);
      gsap.ticker.remove(tick);
      ctx.revert();
      lenis?.destroy();
      lenisRef.current = null;
      triggers.current = [];
      journey.local.fill(0);
      delete document.documentElement.dataset.journey;
    };
  }, [mode]);

  // Elemento della tela memorizzato: il cambio di capitolo (puntini) non ridisegna l'albero 3D.
  const stage = useMemo(() => (mode === "3d" ? <Stage /> : null), [mode]);

  const goTo = (i: number) => {
    const t = triggers.current[i];
    const s = root.current?.querySelector<HTMLElement>(`[data-chapter="${chapters[i].id}"]`);
    // Nei capitoli fissati si arriva all'inizio della scena; altrimenti all'inizio della sezione.
    const y = t && chapters[i].pin ? t.start : s ? s.getBoundingClientRect().top + window.scrollY : 0;
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: mode === "static" ? "auto" : "smooth" });
    s?.querySelector<HTMLElement>("h1, h2, [tabindex]")?.focus({ preventScroll: true });
  };

  return (
    <div ref={root} className="relative">
      {stage}
      <div className="relative z-10">{children}</div>
      {/* Puntini in differenza di colore: leggibili sia sul nero sia sul crema. */}
      <nav aria-label={nav} className="fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 text-white mix-blend-difference sm:block md:right-6">
        <ol className="flex flex-col gap-1">
          {labels.map((label, i) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={label}
                aria-current={active === i ? "step" : undefined}
                className="group flex h-7 w-7 items-center justify-center"
              >
                <span
                  className={`block rounded-full bg-current transition-all duration-[var(--dur-short)] ease-[var(--ease-quiet)] ${
                    active === i ? "h-2.5 w-2.5 opacity-100" : "h-1.5 w-1.5 opacity-40 group-hover:opacity-80"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

/** Movimenti dei testi HTML dentro i capitoli fissati, sulla stessa linea temporale (0–1). */
function chapterText(tl: gsap.core.Timeline, s: HTMLElement, id: string) {
  tl.set({}, {}, 1); // durata fissa 1: le posizioni qui sotto sono frazioni del capitolo
  if (id === "obiettivo") {
    const copy = s.querySelector("[data-hero-copy]");
    if (copy) tl.fromTo(copy, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -60, duration: 0.2 }, 0.1);
  }
  if (id === "manifesto") {
    const label = s.querySelector("[data-journey-label]");
    const p = s.querySelector<HTMLElement>("[data-journey-lines]");
    if (label) tl.fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.06);
    if (p) {
      const split = SplitText.create(p, { type: "lines", mask: "lines", aria: "none" });
      tl.fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, stagger: { amount: 0.3 }, duration: 0.14 }, 0.12);
      tl.to(p, { autoAlpha: 0, y: -40, duration: 0.1 }, 0.66);
    }
    if (label) tl.to(label, { autoAlpha: 0, duration: 0.08 }, 0.66);
  }
  if (id === "servizi") {
    // Un servizio alla volta in evidenza, sincronizzato con le forme (vedi activeService).
    const head = s.querySelector("[data-journey-head]");
    const items = [...s.querySelectorAll<HTMLElement>("ol > li")];
    if (head) tl.fromTo(head, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.02);
    const seg = 0.96 / items.length;
    items.forEach((li, i) => {
      const start = 0.04 + i * seg;
      tl.fromTo(li, { opacity: 0.28 }, { opacity: 1, duration: 0.03 }, Math.max(0.02, start));
      const text = li.querySelector("[data-service-text]");
      if (text) tl.fromTo(text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, Math.max(0.02, start));
      if (i < items.length - 1) {
        tl.to(li, { opacity: 0.28, duration: 0.03 }, start + seg - 0.03);
        if (text) tl.to(text, { autoAlpha: 0, duration: 0.03 }, start + seg - 0.03);
      }
    });
  }
  if (id === "metodo") {
    // Il ciak arriva (0,1–0,2), poi un passo alla volta: il passo attivo coincide con la scena sulla lavagna.
    s.querySelectorAll("[data-journey-head]").forEach((h) => tl.fromTo(h, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.1));
    const items = [...s.querySelectorAll<HTMLElement>("ol > li")];
    items.forEach((li, i) => {
      const start = 0.15 + i * 0.2125;
      tl.fromTo(li, { opacity: 0.28 }, { opacity: 1, duration: 0.03 }, start);
      const text = li.querySelector("[data-step-text]");
      if (text) tl.fromTo(text, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, start);
      if (i < items.length - 1) tl.to(li, { opacity: 0.28, duration: 0.03 }, start + 0.2125 - 0.03);
    });
  }
  if (id === "studio") {
    const copy = s.querySelector("[data-journey-copy]");
    if (copy) tl.fromTo(copy, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.2);
  }
  if (id === "contatto") {
    // Il faro si accende (stesso intervallo di Particles: beacon 0,3–0,6) e illumina il titolo.
    const section = s.querySelector("section");
    const copy = s.querySelector("[data-journey-copy]");
    if (copy) tl.fromTo(copy, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.15);
    if (section) tl.fromTo(section, { "--beacon": 0 }, { "--beacon": 1, duration: 0.3 }, 0.3);
  }
  if (id === "progetti") {
    // Intestazione, poi un progetto alla volta sincronizzato con la pellicola (vedi activeProject).
    const head = s.querySelector("[data-journey-head]");
    const items = [...s.querySelectorAll<HTMLElement>("li")];
    const n = items.length;
    if (head) tl.fromTo(head, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.06).to(head, { autoAlpha: 0, duration: 0.05 }, 0.8);
    const seg = n > 1 ? 0.65 / (n - 1) : 0.65;
    items.forEach((li, i) => {
      const c = 0.15 + i * seg;
      const start = i === 0 ? 0.1 : c - seg / 2;
      const end = i === n - 1 ? 0.8 : c + seg / 2;
      tl.fromTo(li, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.04 }, start);
      tl.to(li, { autoAlpha: 0, y: -24, duration: 0.04 }, end - 0.04);
    });
  }
}
