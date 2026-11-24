# Design system — fase 2

Anteprima interattiva: `/design-system` (non indicizzata). Token in `app/globals.css`.

## Colore

Identità (dal logo master, non modificabili): **Nero `#111111`**, **Avorio `#F7F4EC`**.
Supporto (mai identità): Graphite `#242424`, Oro `#A89575`, Oro scuro `#7A6A4F`.

Contrasti WCAG 2.x verificati:

| Coppia | Rapporto | Uso consentito |
|---|---|---|
| Avorio su Nero | 17.18:1 | tutto |
| `#ABA79E` su Nero | 7.87:1 | testo secondario (tema scuro) |
| Oro `#A89575` su Nero | 6.49:1 | testo e dettagli su scuro |
| Oro `#A89575` su Avorio | 2.65:1 | **solo decorazione**, mai testo |
| Oro scuro `#7A6A4F` su Avorio | 4.77:1 | testo e dettagli su chiaro |
| `#5E5A52` su Avorio | 6.24:1 | testo secondario (tema chiaro) |
| Nero su Oro (pulsante hover) | 6.49:1 | testo pulsante |

Temi semantici (`.theme-dark` predefinito, `.theme-light` per sezioni editoriali): `--bg`, `--fg`, `--muted`, `--surface`, `--line`, `--accent`. In Tailwind: `bg-bg`, `text-fg`, `text-muted`, `bg-surface`, `border-line`, `text-accent`.

## Tipografia

- **GFS Didot 400** (titoli): unico peso, niente corsivo o grassetto. Tratti sottili: **mai sotto 32 px**.
- **Lato 300 / 400 / 700** (testo, interfaccia, etichette).
- Ospitati dal sito tramite `next/font` (nessuna richiesta a Google durante la navigazione). Licenze in `licenses/`.

| Token | Font | Da 360 a 1600 px |
|---|---|---|
| `display-xl` | Didot | 56 → 176 px, interlinea 0.92 |
| `display-l` | Didot | 44 → 120 px |
| `display-m` | Didot | 36 → 76 px |
| `heading` | Didot | 32 → 48 px |
| `lead` | Lato 300 | 20 → 26 px |
| `body` | Lato 400 | 17 px, interlinea 1.65, misura ~65 caratteri |
| `small` | Lato 400 | 14 px |
| `label` | Lato 400 | 12 px, maiuscolo, spaziatura 0.32em (come "CREATIVE") |

Testi lunghi: `prose-measure` (misura + sillabazione IT/EN). Titoli: `text-balance`.

## Griglia e spazi

- Griglia `grid-editorial`: 4 colonne (telefono), 8 (≥ 768 px), 12 (≥ 1024 px).
- Margine laterale `--spacing-margin` 20 → 64 px; gutter `--spacing-gutter` 16 → 32 px.
- Ritmo tra sezioni `--spacing-section` 96 → 224 px. Contenitore massimo 1680 px (`container-site`).

## Movimento

Principi: una scena alla volta; solo `transform` e `opacity`; contenuti visibili senza JavaScript; tutto spento con `prefers-reduced-motion`.

| Curva | Valore | Uso |
|---|---|---|
| `--ease-cinema` | `cubic-bezier(0.76, 0, 0.24, 1)` | aperture/chiusure di scena, transizioni di pagina |
| `--ease-reveal` | `cubic-bezier(0.16, 1, 0.3, 1)` | entrate di testi e immagini |
| `--ease-quiet` | `cubic-bezier(0.33, 1, 0.68, 1)` | hover, focus, stati |

Durate: 150 ms micro · 300 ms stati · 600 ms entrate · 1000 ms rivelazioni · 1600 ms cambi di scena.
Implementazione con GSAP in fase 7; gli stessi valori verranno usati nei timeline.

## Logo

- Solo i file master (`public/brand/`), tramite il componente `Logo`. Nessun ridisegno o ricolorazione.
- Larghezze minime: logo master 160 px, lockup 200 px, simbolo 24 px.
- Favicon: `app/icon.svg` = simbolo 04. Da valutare a 16 px (estremità sottili).
- **Varianti mancanti nel master** (servono per l'intestazione su fondo scuro): logo negativo senza fondo e lockup orizzontale negativo. Ottenibili scambiando solo i due colori ufficiali. **Da approvare.**
- Controlli ancora aperti dal LEGGIMI del master: kerning, spaziature ottiche, resa a 32–40 px, originalità del simbolo rispetto a marchi registrati.

## Componenti di base

- `components/brand/Logo.tsx` — varianti del master.
- `components/primitives/Button.tsx` — `primary`, `secondary`, `text`; interni con `next/link`, esterni con `<a>`.
- `components/primitives/Typography.tsx` — `Display`, `Label`, `Rule`.
