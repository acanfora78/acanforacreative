# Scultura 3D master — fase 9

Concept approvato: **C — Lama**. Una scultura in metallo satinato che interpreta il simbolo ad anello aperto. Non sostituisce il logo: il marchio resta quello di `brand/logo-master/`, la scultura vive solo nel sito.

## Stato
| Sottofase | Contenuto | Stato |
|---|---|---|
| 9.1 | Analisi, concept, storyboard, architettura | approvata |
| 9.2 | Modellazione definitiva e lookdev | in revisione — `/design-system/scultura` |
| 9.3 | Integrazione nella hero (caricamento differito, livelli, puntatore e scroll) | da fare |
| 9.4 | Intro cinematica (4 scene, 3–5 s, saltabile, una volta per sessione) | da fare |
| 9.5 | Motion system v2 | da fare |
| 9.6 | QA (prestazioni, accessibilità, dispositivi reali) | da fare |

## Come è fatta
- **Forma**: calcolata dal tracciato del simbolo master (copiato senza modifiche in `components/sculpture/geometry.ts`). Dal contorno si ricavano linea centrale e spessore; una sezione a lente scorre lungo la linea con profondità (0,26) e torsione di quasi mezzo giro. Di fronte riprende la silhouette del simbolo.
- **Materiale**: metallo satinato leggermente caldo (`roughness 0.28`). Luce solo dall'ambiente: uno studio nero con pannelli luminosi (`studio.ts`), nessuna luce diretta. Nessun colore nuovo d'identità.
- **Motore**: `engine.ts`, caricato con import dinamico solo dove serve. Valori pilotabili (`turn`, `tilt`, `exposure`, `idle`) per GSAP dalla fase 9.3.
- **Componente**: `Sculpture.tsx`, con immagine di riserva sempre nel markup.

## Livelli (fallback)
| Livello | Quando | Cosa |
|---|---|---|
| 0 | Senza JavaScript, WebGL 2 assente, risparmio dati, "riduci movimento" | Immagine `public/sculpture/poster-*.avif` (12–16 KB) |
| 1 | Puntatore touch, ≤ 4 core o ≤ 4 GB di memoria | 3D leggero: meno poligoni, 30 fps, DPR ≤ 1,25, senza puntatore |
| 2 | Computer | 3D completo: 60 fps, antialias, DPR ≤ 2, segue il puntatore |

Sempre: rendering fermo fuori schermo e con la scheda nascosta; contesto WebGL liberato all'uscita dalla pagina; se il contesto si perde torna l'immagine.

## Dipendenza aggiunta
- `three@0.181.0` (licenza MIT). Motivo: il WebGL serve alla scultura e nessuna libreria già presente lo offre. Usato senza wrapper (niente React Three Fiber, drei o altri motori di animazione): una dipendenza sola, caricata solo dove c'è la scultura.

## Immagini di riserva
Generate dal motore vero, dalla pagina `/design-system/scultura` (blocchi `capture-tq` e `capture-front`), con sfondo trasparente, poi convertite in AVIF.

## Limiti noti
- Il lookdev è stato calibrato con un rendering software (senza GPU). Va controllato su un computer e un telefono reali prima della fase 9.3: luminosità e riflessi possono variare.
