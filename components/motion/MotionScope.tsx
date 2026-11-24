"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Regia delle animazioni allo scroll (fase 7). Miglioramento progressivo:
 * senza JavaScript o con "riduci movimento" tutto resta visibile e fermo.
 *
 * Attributi che attivano un movimento (solo sotto la piega; l'apertura è in CSS):
 * - data-split   titolo che sale riga per riga da una maschera
 * - data-reveal  entrata con dissolvenza e piccolo spostamento verso l'alto
 * - data-stagger figli diretti che entrano uno dopo l'altro
 * - data-wipe    immagine che si scopre dal basso, come un sipario
 * - data-parallax contenuto che scorre più lento della pagina (dentro un contenitore con overflow nascosto)
 * - data-draw    filetto che si disegna da sinistra
 * - (fase 9.5) sezioni chiare/scure consecutive: lo sfondo sfuma da un tema all'altro allo scroll
 *
 * Ogni pagina ha il suo MotionScope: con Cache Components le pagine nascoste restano nel DOM,
 * e lo scope garantisce che animazioni e ScrollTrigger vengano rimossi quando la pagina si nasconde.
 */
export function MotionScope({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scope = root.current;
        if (!scope) return;
        const q = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, scope);
        const reveal = { duration: 1.1, ease: "expo.out" } as const;

        q<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            // Divisione solo per righe: le parole restano intere e leggibili dagli screen reader,
            // quindi niente aria-label (non valido su <p>).
            aria: "none",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                stagger: 0.08,
                duration: 1.2,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          });
        });

        q<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 40, ...reveal, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });

        q<HTMLElement>("[data-stagger]").forEach((el) => {
          gsap.from(el.children, {
            autoAlpha: 0,
            y: 32,
            stagger: 0.09,
            ...reveal,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        q<HTMLElement>("[data-wipe]").forEach((el) => {
          const trigger = { trigger: el, start: "top 85%", once: true };
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: trigger },
          );
          // Fase 9.5: mentre il sipario si apre, l'immagine arretra da 1,08 a 1 (stesso motore della parallasse).
          const inner = el.querySelector<HTMLElement>("[data-parallax]");
          if (inner) gsap.fromTo(inner, { scale: 1.08 }, { scale: 1, duration: 2, ease: "expo.out", scrollTrigger: trigger });
        });

        // Fase 9.5: passaggio nero ↔ avorio. Una sezione che cambia tema rispetto alla precedente
        // parte dal colore di quella e arriva al suo mentre entra nello schermo.
        q<HTMLElement>(".theme-light, .theme-dark").forEach((el) => {
          const prev = el.previousElementSibling;
          if (!prev) return;
          const light = el.classList.contains("theme-light");
          if (!prev.classList.contains(light ? "theme-dark" : "theme-light")) return;
          const from = getComputedStyle(prev).backgroundColor;
          const to = getComputedStyle(el).backgroundColor;
          gsap.fromTo(
            el,
            { backgroundColor: from },
            // immediateRender: false — finché la sezione non arriva sullo schermo resta col suo colore
            // (contrasto corretto al caricamento e per chi non scorre).
            { backgroundColor: to, ease: "none", immediateRender: false, scrollTrigger: { trigger: el, start: "top bottom", end: "top 45%", scrub: true } },
          );
        });

        q<HTMLElement>("[data-parallax]").forEach((el) => {
          // fromTo su yPercent soltanto: la scala del sipario (sopra) resta indipendente.
          gsap.fromTo(
            el,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        q<HTMLElement>("[data-draw]").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: "left center", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 90%", once: true } },
          );
        });
      });

      // Ricalcola le posizioni quando i font e le immagini cambiano le altezze.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        mm.revert();
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
