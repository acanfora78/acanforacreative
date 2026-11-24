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

Stato: in sviluppo, non pubblicato.
