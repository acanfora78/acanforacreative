# ACANFORA CREATIVE — sito

Creative Digital Studio. Direzione: Cinematic Digital. Italiano e inglese.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

- Regole di progetto: `CLAUDE.md`
- Roadmap e architettura: `docs/roadmap.md`
- Decisioni e materiali consegnati: `docs/handoff/`
- Logo master (non modificare): `brand/logo-master/`
- Licenze dei font (SIL OFL 1.1): `licenses/`

## Lingue
`/it` e `/en`, gestite da `proxy.ts` e `lib/i18n.ts`. Le cartelle in `app/[lang]/` hanno i nomi italiani; gli indirizzi inglesi (`/en/services`, `/en/work`, `/en/contact`, `/en/cookies`) vengono riscritti verso di esse. Testi: `content/dictionaries/` e `content/pages.ts`.

## Modulo di contatto
Server Action in `app/[lang]/contatti/actions.ts`, invio via API Resend (nessuna libreria). Variabili d'ambiente:

| Variabile | Obbligatoria | Uso |
|---|---|---|
| `RESEND_API_KEY` | sì, per attivare l'invio | chiave API di Resend |
| `CONTACT_FROM` | dopo il dominio | mittente su dominio verificato, es. `ACANFORA CREATIVE <sito@dominio.it>` |
| `CONTACT_TO` | no | destinatario (predefinito: email dello studio) |

Senza `RESEND_API_KEY` il modulo valida i dati e invita a scrivere per email o WhatsApp.

## Portfolio
`content/projects.ts`. Solo progetti reali; `published: false` li nasconde (rispondono 404).

## Animazioni
- Aperture di pagina (letterbox, titoli che salgono): solo CSS, in `app/globals.css` (classi `letterbox`, `intro-line`, `intro-fade`).
- Movimenti allo scroll: GSAP + ScrollTrigger + SplitText in `components/motion/MotionScope.tsx`, attivati da attributi `data-split`, `data-reveal`, `data-stagger`, `data-wipe`, `data-parallax`, `data-draw`.
- Cambio pagina e copertina condivisa griglia → case study: React `<ViewTransition>` in `components/motion/PageTransition.tsx`.
- Con "riduci movimento" del sistema operativo tutto si spegne e i contenuti restano visibili.

## Pubblicazione
Guida, variabili d'ambiente e checklist di lancio: `docs/pubblicazione.md`.
Dopo ogni `npm run build` parte `scripts/check-placeholders.mjs`: la build fallisce se nelle pagine pubbliche restano segnaposto `[[…]]`.

Stato: pronto per Vercel, non pubblicato (in attesa di dominio e approvazione del titolare).
