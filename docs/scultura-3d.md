# Scultura 3D master — fase 9

Concept approvato: **C — Lama**. Una scultura in metallo satinato che interpreta il simbolo ad anello aperto. Non sostituisce il logo: il marchio resta quello di `brand/logo-master/`, la scultura vive solo nel sito.

## Stato
| Sottofase | Contenuto | Stato |
|---|---|---|
| 9.1 | Analisi, concept, storyboard, architettura | approvata |
| 9.2 | Modellazione definitiva e lookdev | fatta — `/design-system/scultura` |
| 9.3 | Integrazione nella hero (caricamento differito, livelli, puntatore e scroll) | fatta |
| 9.4 | Intro cinematica (4 scene, 4,2 s, saltabile, una volta per sessione) | fatta |
| 9.5 | Motion system v2 | fatta |
| 9.6 | QA automatico | fatta (24/11/2026); manca la prova su dispositivi reali |

Il titolare ha chiesto di procedere senza fermarsi tra le sottofasi (24/11/2026).

## Come è fatta
- **Forma**: calcolata dal tracciato del simbolo master (copiato senza modifiche in `components/sculpture/geometry.ts`). Dal contorno si ricavano linea centrale e spessore; una sezione a lente scorre lungo la linea con profondità (0,26) e torsione di quasi mezzo giro. Di fronte riprende la silhouette del simbolo.
- **Materiale**: metallo satinato leggermente caldo (`roughness 0.28`). Luce solo dall'ambiente: uno studio nero con pannelli luminosi (`studio.ts`), nessuna luce diretta. Nessun colore nuovo d'identità.
- **Motore**: `engine.ts`, caricato con import dinamico solo dove serve. Valori pilotabili (`turn`, `tilt`, `exposure`, `idle`) per GSAP dalla fase 9.3.
- **Componente**: `Sculpture.tsx`, con immagine di riserva sempre nel markup.

## Livelli (fallback)
| Livello | Quando | Cosa |
|---|---|---|
| 0 | Senza JavaScript, WebGL 2 assente, nessuna scheda grafica (rendering software), risparmio dati, "riduci movimento" | Immagine `public/sculpture/poster-*.avif` (12–16 KB, precaricata nella Hero) |
| 1 | Puntatore touch, ≤ 4 core o ≤ 4 GB di memoria | 3D leggero: ≈ 7.700 triangoli, 30 fps, DPR ≤ 1,25, senza puntatore |
| 2 | Computer | 3D completo: ≈ 12.000 triangoli, 60 fps, antialias, DPR ≤ 1,5, segue il puntatore (fino a 8°) |

Per i test automatici (senza GPU) il 3D si forza con `localStorage["ac-sculpture-force"] = "1"`.

Sempre: rendering fermo fuori schermo e con la scheda nascosta; contesto WebGL liberato all'uscita dalla pagina; se il contesto si perde torna l'immagine.

## Dipendenza aggiunta
- `three@0.181.0` (licenza MIT). Motivo: il WebGL serve alla scultura e nessuna libreria già presente lo offre. Usato senza wrapper (niente React Three Fiber, drei o altri motori di animazione): una dipendenza sola, caricata solo dove c'è la scultura.

## Hero (9.3)
- Scultura a destra (metà alta), leggermente dietro il titolo; su telefono sopra il titolo.
- Etichetta: "Creative Digital Studio — Brand · Web · E-commerce · AI".
- Scorrendo, la scultura ruota fino a 60° e si allontana (GSAP ScrollTrigger sui parametri del motore).

## Intro (9.4) — `components/home/HeroStage.tsx`
| Tempo | Scena | Cosa succede |
|---|---|---|
| 0–1,1 s | 01 Arrival | Dal nero, la luce scorre sul metallo e la scultura emerge |
| 1,1–2,5 s | 02 Form | La camera si avvicina del 12%, la scultura ruota e mostra la torsione |
| 2,5–3,4 s | 03 Identity | Si ferma di fronte, sopra il simbolo del logo ufficiale (file 06); il wordmark si rivela dal basso |
| 3,4–4,2 s | 04 Experience | La scultura scivola nella Hero, il velo si apre, il titolo sale |

- Parte solo all'arrivo diretto in home, una volta per sessione (`sessionStorage["ac-intro"]`). Mai nella navigazione interna.
- Decisione prima del primo disegno: script in `app/[lang]/layout.tsx` che imposta `<html data-intro>`.
- Si salta con il pulsante "Salta intro", con Esc o con un clic.
- Niente intro con "riduci movimento", risparmio dati, livello 0, o se la scultura non è pronta entro 1,8 s. Sicurezza: il velo sparisce comunque dopo 8 s.
- Il titolo è già disegnato sotto il velo: la misura del primo contenuto non peggiora.

## Motion system v2 (9.5)
- Pulsanti: riempimento che sale (300 ms). Link con filetto: si cancella e si ridisegna. Navigazione e footer: filetto che si disegna da sinistra.
- Modulo: linea attiva che si allunga, errore che entra dall'alto.
- Immagini: sipario dal basso con zoom da 1,08 a 1.
- Passaggio nero ↔ avorio: lo sfondo sfuma allo scroll quando una sezione cambia tema.
- Cambio pagina: uscita 280 ms, entrata 520 ms (invariato).
- Un solo motore per proprietà: CSS per pseudo-elementi e sfondi dei controlli, GSAP per trasformazioni e scroll, Three.js solo per il disegno.

## Verifiche (24/11/2026, build di produzione)
- Lighthouse mobile: home 87–93 di prestazioni (fase 8: 88–99), accessibilità, best practice e SEO 100. Lavori 92–93, Contatti 96–98. CLS 0.
- Senza GPU, con "riduci movimento" e senza JavaScript: immagine, nessuna intro, nessun velo.
- Intro in produzione: parte in circa 0,6 s; Esc la salta; non si ripete ricaricando né arrivando da un'altra pagina.
- Tornando in home con "indietro" la scultura riparte (tela nuova a ogni avvio).
- Nessun errore in console.

## Immagini di riserva
Generate dal motore vero, dalla pagina `/design-system/scultura` (blocchi `capture-tq` e `capture-front`), con sfondo trasparente, poi convertite in AVIF.

## Limiti noti
- Il lookdev è stato calibrato con un rendering software (senza GPU). Va controllato su un computer e un telefono reali: luminosità e riflessi possono variare.
- Da provare a mano: iPhone (Safari), Android di fascia media, Firefox.
- Le misure di Lighthouse girano senza GPU, quindi vedono l'immagine e non il 3D: il costo reale del 3D si misura sui dispositivi.
