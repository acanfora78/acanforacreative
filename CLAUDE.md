@AGENTS.md

# ACANFORA CREATIVE — regole di progetto

Sito della Creative Digital Studio ACANFORA CREATIVE. Direzione: Cinematic Digital. Lingue: italiano e inglese.
Fonte autorevole delle decisioni: `docs/handoff/`. Stato e piano: `docs/`.

## Identità (non negoziabile)
- Logo: usare SOLO gli SVG in `brand/logo-master/` (copie servite da `public/brand/`). Non ridisegnare, deformare, ricolorare.
- Palette ufficiale: Nero `#111111`, Avorio `#F7F4EC`. Graphite e oro tenue sono solo supporto, mai identità.
- Font: GFS Didot (titoli, ≥ 32 px, solo peso 400) e Lato (testo ed etichette). Licenza SIL OFL 1.1, testi in `licenses/`.

## Portfolio: integrità
- Mai inventare clienti, progetti, risultati, testimonianze, numeri o permessi.
- Progetti approvati dal titolare (autorizzazioni dichiarate): Sudditalia, Osteria Il Tormentone, Kormè, Oddscore, 22SIDE, Oro Croccante; più l'identità Acanfora Creative (progetto interno) e CALDERA (SOLO come "Concept dimostrativo / Demonstration concept").
- Oro Croccante: nessun risultato o numero finché non consegnato e approvato.
- Oddscore: scommesse sportive. In Italia vige il divieto di pubblicità anche indiretta del gioco con vincita in denaro (art. 9 DL 87/2018). Non pubblicare marchio, link o riferimenti al gioco senza verifica legale.
- Usare solo materiali reali forniti dal titolare.

## Dati dello studio
- Approvati dal titolare (24/11/2026): Morgan Acanfora; email morganacanfora5@gmail.com; WhatsApp +39 329 021 1669; Instagram @acanforacreative. Fonte: `content/site.ts`.
- Dati legali (approvati): SMM di Acanfora Morgan, ditta individuale, P.IVA 06367880652. Per scelta del titolare NON pubblicare indirizzi. Il codice fiscale non va MAI pubblicato né salvato nel repository.
- Codici ATECO: lasciati invariati per scelta del titolare.
- Ancora mancante: dominio (lo acquista il titolare) → segnaposto `[[DOMINIO — DA CONFERMARE]]`.
- Tempi di risposta: "il prima possibile", nessun numero di ore promesso.
- Nessun deploy o pubblicazione senza approvazione esplicita del titolare.

## Metodo
- Fasi controllate (vedi `docs/roadmap.md`). Un branch per fase, merge su `main` solo dopo approvazione.
- Niente librerie senza motivo scritto. Un solo motore di animazione: GSAP (dalla fase 7).
- Animazioni come miglioramento progressivo: contenuti visibili senza JavaScript, `prefers-reduced-motion` rispettato.
- Next.js 16: leggere `node_modules/next/dist/docs/` prima di usare un'API.
