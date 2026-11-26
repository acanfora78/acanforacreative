# Fase 10 — Home come viaggio in zoom: "dall'obiettivo alla scena"

Approvato dal titolare (26/11/2026): librerie R3F + drei + postprocessing + Lenis (niente zustand),
rimozione dell'intro a velo, accento **A — oro tenue** `#A89575` (`#7A6A4F` sulle scene chiare), Lenis solo in home.

## Stato
| Capitolo | Contenuto | Stato |
|---|---|---|
| 1 Obiettivo | Anello di vetro (forma Lama), la camera entra, tunnel di 6 lenti, lampo, nero → crema | prototipo |
| 2 Manifesto | Le lenti si allineano e diventano una pellicola; il testo sale riga per riga; zoom dentro un fotogramma | prototipo |
| 3 Progetti | Pellicola con i progetti, sfocatura, bobina | da fare (sezione HTML attuale) |
| 4 Servizi | Particelle: 6 forme | da fare |
| 5 Metodo | Ciak | da fare |
| 6 Studio | Sagoma olografica | da fare |
| 7 Contatto | Ellisse del logo come faro | da fare |

## Architettura
- `components/journey/chapters.ts`: capitoli, durate in vh (desktop/mobile), pin, scena.
- `components/journey/progress.ts`: stato condiviso mutabile (`journey.local[i]` da 0 a 1), letto in `useFrame`. Nessun setState per fotogramma.
- `components/journey/JourneyClient.tsx`: Lenis (ticker GSAP) + una ScrollTrigger per capitolo (pin + scrub) che scrive l'avanzamento; testi HTML sulla stessa timeline; puntini dei capitoli (clic → `lenis.scrollTo`).
- `components/journey/canvas/`: tela unica fissa (next/dynamic, ssr false) — `Stage`, `Rig` (camera, fondo, lampo), `Ring`, `Lenses`, `FilmStrip`, `Post`.
- Reversibilità: ogni oggetto è funzione pura dell'avanzamento. Verificato: stesso punto in avanti e all'indietro → stessa immagine.
- `<html data-journey="3d|static">`: con il 3D le sezioni-scena diventano trasparenti; altrimenti sezioni normali.

### Perché queste librerie
- `@react-three/fiber` / `@react-three/drei` (solo `PerformanceMonitor`) / `@react-three/postprocessing`: scena dichiarativa con un ciclo per fotogramma; postprocessing solo desktop.
- `lenis`: scroll morbido in home; non anima nulla, GSAP resta l'unico motore di animazione.
- Peso: caricati dopo il primo render e solo in modalità 3D; il primo caricamento non cambia.
- Lint: in `components/journey/canvas/` sono spente due regole del React Compiler (non attivo nel progetto), perché R3F modifica gli oggetti Three.js in `useFrame` per scelta (vedi `eslint.config.mjs`).

## Modalità
| Caso | Cosa si vede |
|---|---|
| Desktop con GPU | Esperienza completa: vetro con trasmissione, postprocessing (grana, vignetta, bloom, aberrazione solo durante lo scroll veloce) |
| Telefono / dispositivo modesto | Stessa storia: anello in metallo satinato, niente postprocessing, pin più corti |
| Senza GPU, WebGL assente, "riduci movimento" | Sezioni normali, nessun pin né scrub; immagine statica del capitolo 1 (da tablet in su) |

`PerformanceMonitor` abbassa la risoluzione e spegne il postprocessing se gli fps calano.

## Come provarlo in locale
1. `git checkout fase-10-viaggio && npm install`
2. `npm run dev` e apri http://localhost:3000/it (o `/en`).
3. Scorri lentamente: capitolo 1 (anello → tunnel → lampo) e capitolo 2 (pellicola, manifesto, zoom nel fotogramma). Prova anche a tornare indietro.
4. Puntini a destra (da tablet in su): portano all'inizio di ogni capitolo.
5. Modalità statica: attiva "Riduci movimento" nel sistema operativo e ricarica.
6. Su un computer senza scheda grafica il 3D si spegne da solo. Per forzarlo (solo test): nella console del browser `localStorage.setItem("ac-sculpture-force","1")` e ricarica.

## Misure (Lighthouse mobile, build di produzione, 3 prove per lingua)
| | Prestazioni | LCP | TBT | CLS | Altre categorie |
|---|---|---|---|---|---|
| Prima (fase 9, 24/11) | 87–93 | 2,5–3,5 s | 140–280 ms | 0 | 100 |
| Dopo (26/11) | 88–95 | 2,6–3,4 s | 140–220 ms | 0 | 100 |

- Lighthouse gira senza GPU, quindi misura la modalità statica, non il 3D.
- Il titolo della Hero ora è visibile dal primo disegno (tolta l'entrata CSS a righe) ed è l'elemento LCP: nel browser reale appare insieme al primo contenuto (~70 ms in locale).
- LCP di laboratorio sopra 2,5 s: la simulazione di Lighthouse conta tutti gli script richiesti prima del primo disegno (~220 KB, framework compreso). Problema già presente in fase 8; si verifica con i dati reali (Search Console / CrUX) dopo il lancio, o riducendo il JavaScript iniziale in un passo dedicato.

## Asset da fornire
- `public/images/morgan-sagoma.png`: figura su sfondo trasparente, mezzo busto, almeno 1000 px di altezza (capitolo 6).
- `public/models/ciak.glb` (facoltativo): sotto i 300 KB, stecca come nodo separato con il perno sulla cerniera (capitolo 5). Senza, ciak procedurale.
- Screenshot reali di Kormè, Oro Croccante e CALDERA (facoltativi): altrimenti fotogrammi tipografici, nessuna immagine inventata. Oddscore resta escluso.

## Limiti noti
- Rendering verificato senza GPU (SwiftShader): vetro, riflessi e fluidità vanno provati su un computer e un telefono reali.
- La vecchia scultura resta nella pagina interna `/design-system/scultura`.
