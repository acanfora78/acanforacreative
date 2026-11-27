# Fase 10 — Home come viaggio in zoom: "dall'obiettivo alla scena"

Approvato dal titolare (26/11/2026): librerie R3F + drei + postprocessing + Lenis (niente zustand),
rimozione dell'intro a velo, accento **A — oro tenue** `#A89575` (`#7A6A4F` sulle scene chiare), Lenis solo in home.

## Stato
| Capitolo | Scena | HTML sincronizzato | Stato |
|---|---|---|---|
| 1 Obiettivo | Anello di vetro (forma Lama), la camera entra, tunnel di 6 lenti, lampo, nero → crema | titolo che sfuma | fatto |
| 2 Manifesto | Le lenti si allineano e diventano una pellicola; zoom dentro un fotogramma | testo riga per riga | fatto |
| 3 Progetti | La camera esce dal fotogramma; pellicola dei progetti in evidenza, attivo a fuoco, altri sfocati; passaggio sul titolo = distorsione + RGB; bobina | titolo, tipo, anno, link | fatto |
| 4 Servizi | La bobina si dissolve in particelle: browser, borsa, ellisse del logo, telefono, grafico, rete | servizio attivo | fatto |
| 5 Metodo | Le particelle diventano un ciak; colpo della stecca a ogni passo (scossa + lampo), SCENA 01–04 | passo attivo | fatto (ciak procedurale) |
| 6 Studio | Sagoma olografica su piattaforma, anello di scansione | testo dello studio | fatto (sagoma segnaposto) |
| 7 Contatto | L'ellisse del logo si accende come un faro e segue il cursore | titolo illuminato dal faro | fatto |

Il titolare ha chiesto di procedere senza fermarsi tra i capitoli (26/11/2026). Un commit per capitolo sul branch `fase-10-viaggio`.

## Architettura
- `components/journey/chapters.ts`: capitoli, durate in vh (desktop/mobile), pin, scena.
- `components/journey/progress.ts`: stato condiviso mutabile (`journey.local[i]` da 0 a 1), letto in `useFrame`. Nessun setState per fotogramma.
- `components/journey/JourneyClient.tsx`: Lenis (ticker GSAP) + una ScrollTrigger per capitolo (pin + scrub) che scrive l'avanzamento; testi HTML sulla stessa timeline; puntini dei capitoli (clic → `lenis.scrollTo`).
- `components/journey/layout.ts`: inquadratura comune (soggetto a destra su schermi larghi, in alto su telefono).
- `components/journey/canvas/`: tela unica fissa (next/dynamic, ssr false) — `Stage`, `Rig` (camera, fondo, lampo), `fx.ts` (fondi, colpo del ciak), `Ring`, `Lenses`, `FilmStrip`, `ProjectReel`, `Particles` + `shapes.ts`, `Clapper`, `Hologram`, `Post`.
- Particelle: un solo `THREE.Points` (32.000 punti desktop, 7.000 telefono, ridotti se gli fps calano); 10 forme in una texture float, morph nello shader.
- Reversibilità: lo stato della scena è funzione pura dell'avanzamento. Verificato: stesso punto in avanti e all'indietro → stessa scena (resta solo il leggero movimento continuo nel tempo: rotazione lenta e scintillio delle particelle).
- In 3D la regia di MotionScope non anima i capitoli fissati: un solo motore per proprietà.
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
| Senza GPU, WebGL assente, "riduci movimento" | Sezioni normali, nessun pin né scrub; immagini statiche: anello (capitolo 1, da tablet in su), copertine reali (3), foto (6), ciak (5) e faro (7) resi dalla scena (`public/journey/`) |

`PerformanceMonitor` abbassa la risoluzione e spegne il postprocessing se gli fps calano.

## Come provarlo in locale
1. `git checkout fase-10-viaggio && npm install`
2. `npm run dev` e apri http://localhost:3000/it (o `/en`).
3. Scorri lentamente tutti i 7 capitoli; prova anche a tornare indietro. Passa col mouse sul titolo del progetto attivo (capitolo 3) e muovi il cursore nel capitolo 7.
4. Puntini a destra (da tablet in su): portano all'inizio di ogni capitolo.
5. Modalità statica: attiva "Riduci movimento" nel sistema operativo e ricarica.
6. Su un computer senza scheda grafica il 3D si spegne da solo. Per forzarlo (solo test): nella console del browser `localStorage.setItem("ac-sculpture-force","1")` e ricarica.

## Misure (Lighthouse mobile, build di produzione, 3 prove per lingua)
| | Prestazioni | LCP | TBT | CLS | Altre categorie |
|---|---|---|---|---|---|
| Prima (fase 9, 24/11) | 87–93 | 2,5–3,5 s | 140–280 ms | 0 | 100 |
| Prototipo 1–2 (26/11) | 88–95 | 2,6–3,4 s | 140–220 ms | 0 | 100 |
| 7 capitoli (26/11) | 88–95 (una prova a 76 a server appena avviato) | 2,6–3,4 s | 150–200 ms | 0 | 100 |

- Lighthouse gira senza GPU, quindi misura la modalità statica, non il 3D.
- Il titolo della Hero è visibile dal primo disegno ed è l'elemento LCP: nel browser reale appare insieme al primo contenuto (~70 ms in locale).
- LCP di laboratorio sopra 2,5 s: la simulazione di Lighthouse conta tutti gli script richiesti prima del primo disegno (~220 KB, framework compreso). Problema già presente in fase 8; si verifica con i dati reali (Search Console / CrUX) dopo il lancio, o riducendo il JavaScript iniziale in un passo dedicato.

## Controlli automatici (26/11/2026)
- Tutti i 7 capitoli in IT ed EN, desktop e telefono: nessun errore in console.
- Puntini: quello attivo segue il capitolo; il clic porta all'inizio del capitolo.
- Avanti/indietro, anche dalla fine del viaggio: stessa scena.
- Dopo l'ultimo capitolo la tela smette di disegnare e il piè di pagina è visibile; tornando su riparte.
- Senza GPU e con "riduci movimento": nessuna tela, nessun pin, immagini statiche caricate.

## Prestazioni (correzioni del 27/11/2026)
Segnalazione del titolare: animazioni lente e blocchi. Misure con traccia del browser (senza GPU, quindi i valori assoluti sono gonfiati; contano i rapporti).
| Problema | Prima | Correzione | Dopo |
|---|---|---|---|
| Shader compilati al primo ingresso in ogni scena | blocco di 1,3 s nel capitolo 1, ~150 ms a ogni capitolo | `Warmup` in `Stage.tsx`: compila tutti gli shader all'avvio, un oggetto per fotogramma, in parallelo dove possibile | nessun blocco nel capitolo 1, quasi nessuno ai cambi di capitolo |
| Vetro con trasmissione nell'anello | scena ridisegnata due volte per fotogramma nella Hero | vetro "finto": trasparenza + riflessi + iridescenza | un solo disegno per fotogramma |
| Forme delle particelle costruite tutte insieme | blocco di 0,7 s al caricamento | una forma alla volta, con pause | blocchi sotto 0,3 s |
| Qualità adattiva che saliva e scendeva | buffer riallocati più volte (scatti) | scende una volta sola e non risale | — |
| Lavagne del ciak create al colpo | piccolo blocco a ogni passo | 4 lavagne preparate e caricate sulla GPU all'avvio | — |
| Luce del faro aggiornata a ogni movimento del mouse | ridisegno a tutto schermo continuo | solo nel capitolo 7, al massimo una volta per fotogramma | — |
| Viaggio molto lungo, scroll "in ritardo" | ~18 schermate di scroll fissato, Lenis morbido | durate ridotte di circa il 30%, Lenis più reattivo (lerp 0,14) | ~12,5 schermate |
| Avvio della tela 3D | durante il caricamento | quando il browser è libero (requestIdleCallback) | primo disegno non conteso |
| Risoluzione | fino a 1,5× anche su schermi Retina | 1,25× su schermi ad alta densità; bloom a mezza risoluzione | — |

## Asset da fornire
- `public/images/morgan-sagoma.png`: figura su sfondo trasparente, mezzo busto, almeno 1000 px di altezza (capitolo 6).
- `public/models/ciak.glb` (facoltativo): sotto i 300 KB, stecca come nodo separato con il perno sulla cerniera (capitolo 5). Senza, ciak procedurale.
- Screenshot reali di Kormè, Oro Croccante e CALDERA (facoltativi): altrimenti fotogrammi tipografici, nessuna immagine inventata. Oddscore resta escluso.

## Limiti noti
- Rendering verificato senza GPU (SwiftShader): vetro, riflessi e fluidità vanno provati su un computer e un telefono reali.
- La vecchia scultura resta nella pagina interna `/design-system/scultura`.
- Servizi senza immagine statica nella modalità senza 3D: l'elenco è il contenuto.
- Forme delle particelle procedurali e semplici (scelta voluta): si possono rifinire una per una.
