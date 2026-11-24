# Struttura UX — fase 3

Wireframe a bassa fedeltà: `/wireframes` (non indicizzati, solo struttura: niente colori, font o testi definitivi).

## Obiettivo del sito
Presentare lo studio in modo credibile e trasformare i visitatori qualificati in richieste di contatto.
Ogni pagina porta a **Contatti**; nessuna pagina è un vicolo cieco.

## Mappa del sito

| Pagina | Italiano | English | Scopo |
|---|---|---|---|
| Home | `/it` | `/en` | Posizionamento, prova del lavoro, porta al contatto |
| Studio | `/it/studio` | `/en/studio` | Chi c'è dietro, come lavora, perché fidarsi |
| Servizi | `/it/servizi` | `/en/services` | Cosa offre lo studio, per chi, cosa si ottiene |
| Lavori | `/it/lavori` | `/en/work` | Portfolio con filtri per tipo di progetto |
| Case study | `/it/lavori/[slug]` | `/en/work/[slug]` | Racconto di un progetto, invito a un progetto simile |
| Contatti | `/it/contatti` | `/en/contact` | Modulo e canali diretti |
| Privacy | `/it/privacy` | `/en/privacy` | Obbligo di legge |
| Cookie | `/it/cookie` | `/en/cookies` | Obbligo di legge |
| 404 | — | — | Riporta a home, lavori, contatti |

Navigazione principale: Studio · Servizi · Lavori · Contatti, più selettore lingua IT/EN.
Il pulsante "Contatti" nell'intestazione è sempre visibile e diverso dagli altri link.

## Percorsi verso il contatto

1. **Diretto** — Home, apertura → pulsante "Parliamo del tuo progetto" → Contatti.
2. **Dal servizio** — Servizi → capitolo di un servizio → "Richiedi questo servizio" → Contatti con il servizio già selezionato (`?servizio=web-design`).
3. **Dal lavoro** — Lavori → case study → "Hai un progetto simile?" → Contatti con il tipo di progetto già selezionato.
4. **Dallo studio** — Studio → chiusura → Contatti.
5. **Rapido** — intestazione, piè di pagina, ogni chiusura di pagina: link email e WhatsApp (segnaposto finché non confermati).

## Pagine

### Home — sequenza di scene
1. **Apertura** — simbolo, frase di posizionamento, sottotitolo, due azioni: contatto (principale) e lavori (secondaria).
2. **Manifesto** — 2–3 frasi sul punto di vista dello studio.
3. **Lavori selezionati** — 3–4 progetti in evidenza, link a tutti i lavori.
4. **Servizi** — i 6 servizi come indice numerato, link alla pagina Servizi.
5. **Metodo** — 4 fasi di lavoro (ascolto, direzione, produzione, lancio). Descrive il processo, non promette risultati.
6. **Studio** — anteprima con link alla pagina Studio.
7. **Chiusura** — invito al contatto, email e WhatsApp.

### Studio
Manifesto esteso · approccio e valori · metodo in dettaglio · chi c'è dietro (foto e bio: **da fornire**) · strumenti e competenze · chiusura con contatto.

### Servizi
Introduzione · 6 capitoli (Web Design, E-commerce, Branding, Social Media Management, Digital Marketing, Digital Solutions e AI). Ogni capitolo: cosa comprende, cosa si consegna, per chi è adatto, lavori collegati, pulsante "Richiedi questo servizio" · metodo · domande frequenti (facoltative) · chiusura.

### Lavori
Introduzione · filtri per tipo (Web, E-commerce, App, Branding, Social) · griglia di progetti. Ogni scheda: immagine, nome, tipo di progetto, servizi, anno, etichetta "Interno" o "Concept dimostrativo" quando serve.

### Case study (modello unico)
Apertura (nome, cliente, anno, servizi, ruolo) · contesto · obiettivo · approccio · soluzione (galleria desktop e mobile) · cosa abbiamo consegnato · link al sito (se pubblico) · progetto successivo · chiusura "Hai un progetto simile?".
**Nessun numero o risultato** se non fornito e documentato dal cliente.

### Contatti
Introduzione · canali diretti (email, WhatsApp, telefono: segnaposto) · modulo · cosa succede dopo l'invio (tempi di risposta: **da confermare**, non li inventiamo) · nota privacy.

Campi del modulo: nome*, email*, telefono, azienda o attività, servizi di interesse (scelta multipla), budget indicativo (facoltativo, **da confermare se lo vuoi**), messaggio*, consenso privacy* (non spuntato). *obbligatorio

### Intestazione e piè di pagina
- **Intestazione:** lockup negativo · Studio · Servizi · Lavori · pulsante Contatti · IT/EN. Su telefono: menu a schermo intero.
- **Piè di pagina:** frase di chiusura · contatti · navigazione · social · dati legali (titolare, sede, P.IVA: segnaposto) · Privacy · Cookie.

## Portfolio

| Progetto | Tipo | Servizi (da confermare) | In evidenza in home |
|---|---|---|---|
| Sudditalia | Cliente | E-commerce, Web Design | sì |
| Osteria Il Tormentone | Cliente | Web Design, Prenotazioni | sì |
| Kormè | Cliente | App, mappa interattiva, prenotazioni | sì |
| 22SIDE | Cliente | da confermare | — |
| Oro Croccante | Cliente | Social Media Management | — (cliente appena acquisito) |
| Oddscore | Cliente | App | **no — in attesa di verifica legale**, eventualmente anonimo |
| Acanfora Creative | Interno | Branding | — |
| CALDERA | Concept dimostrativo | E-commerce | — |

Mancano per ogni progetto: ruolo esatto, anno, materiali (immagini reali). La scelta dei progetti in evidenza è una proposta.

## Decisioni del titolare (fase 3, 24/11/2026)
- Fase 3 approvata.
- Anno di tutti i progetti: 2026. Ruolo esatto per progetto: ancora da confermare.
- Pagina Studio: presenta solo il titolare. Bio scritta da noi (bozza in `docs/contenuti/studio-bio.md`, da approvare).
- Social: Instagram `@acanforacreative`.
- In evidenza in home: Sudditalia, Osteria Il Tormentone, Kormè (confermato).
- Domande frequenti nella pagina Servizi: sì.

## Domande ancora aperte
1. Ruolo esatto per ogni progetto.
2. Nome e cognome da mostrare nella pagina Studio.
3. Campo "budget indicativo" nel modulo e tempi di risposta da indicare.
4. Foto del titolare: vedi nota in `docs/contenuti/studio-bio.md`.
