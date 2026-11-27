# Roadmap

Ogni fase si chiude con una revisione e un'approvazione del titolare. Branch dedicato per fase, merge su `main` dopo l'approvazione.

| Fase | Contenuto | Stato |
|---|---|---|
| 1 | Discovery e architettura tecnica | approvata |
| 2 | Direzione creativa e design system (token, tipografia, griglia, motion, uso del logo) | approvata |
| 3 | Struttura UX e wireframe (sitemap, flussi verso il contatto, wireframe a bassa fedeltà) | approvata |
| 4 | Prototipo visivo della homepage (statico, IT/EN, testi reali) | approvata |
| 5 | Approvazione homepage | approvata (24/11/2026) |
| 6 | Pagine e componenti restanti (Studio, Servizi, Lavori, case study, Contatti, pagine legali) | approvata |
| 7 | Animazioni e interazioni (GSAP, transizioni di pagina) | approvata |
| 8 | SEO, performance, accessibilità, QA | approvata — vedi `docs/pubblicazione.md` |
| 9 | Scultura 3D master, intro cinematica, motion system v2 (concept C "Lama") | fatta, da provare su dispositivi reali — vedi `docs/scultura-3d.md` |
| 10 | Home come viaggio in zoom "dall'obiettivo alla scena" (7 capitoli) | approvata (27/11/2026); da provare su dispositivi reali — vedi `docs/viaggio.md` |

## Architettura approvata (fase 1)
- Next.js 16 App Router, TypeScript strict, Tailwind CSS 4, componenti server di default.
- Lingue: `/it` (predefinita) e `/en`, percorsi tradotti, `hreflang` + `x-default`. Implementate in fase 4 con il sistema integrato di Next 16 (`proxy.ts` + dizionari in `content/dictionaries/`) al posto di `next-intl`: guida ufficiale disponibile offline, compatibilità certa con Cache Components, una dipendenza in meno.
- Percorsi: `/it` `/it/studio` `/it/servizi` `/it/lavori` `/it/lavori/[slug]` `/it/contatti`; `/en` `/en/studio` `/en/services` `/en/work` `/en/work/[slug]` `/en/contact`.
- Animazioni: GSAP + `@gsap/react` (fase 7). Smooth scroll (Lenis) solo se giustificato.
- Contenuti: dati tipizzati per lingua; case study in MDX. Form: Server Action + Resend + validazione server.
- Obiettivi: Lighthouse mobile ≥ 90 in tutte le categorie, WCAG 2.2 AA, CLS < 0.05, LCP < 2,5 s su 4G.
