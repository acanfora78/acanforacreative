# Pubblicazione su Vercel — guida e checklist

Il sito è pronto per Vercel. **Non va reso indicizzabile né annunciato finché il titolare non approva.**

## 1. Collegare il repository (una volta)
1. Accedi a https://vercel.com con GitHub.
2. "Add New… → Project" e importa `acanfora78/acanforacreative`.
3. Framework: Next.js (rilevato da solo). Branch di produzione: `main`.
4. Prima di "Deploy", aggiungi le variabili d'ambiente (passo 2).

## 2. Variabili d'ambiente (Settings → Environment Variables)

| Variabile | Valore | Quando |
|---|---|---|
| `SITE_URL` | `https://www.tuodominio.it` | appena hai il dominio |
| `SITE_INDEXABLE` | `true` | **solo al lancio approvato**; finché manca, Google non indicizza |
| `RESEND_API_KEY` | chiave da resend.com | per attivare l'invio del modulo |
| `CONTACT_FROM` | `ACANFORA CREATIVE <sito@tuodominio.it>` | dopo aver verificato il dominio su Resend |
| `CONTACT_TO` | facoltativo | se le richieste devono arrivare a un'altra email |

Senza `SITE_URL`, Vercel usa il suo indirizzo `*.vercel.app` per canonical, sitemap e anteprime social.

## 3. Dominio
1. Acquista il dominio.
2. Vercel → Project → Settings → Domains → aggiungi `tuodominio.it` e `www.tuodominio.it` e segui le istruzioni DNS.
3. Imposta `SITE_URL` e rifai il deploy.

## 4. Email del modulo (Resend)
1. Crea un account su https://resend.com e genera una API key → `RESEND_API_KEY`.
2. Aggiungi e verifica il dominio su Resend (record DNS indicati da Resend).
3. Imposta `CONTACT_FROM` con un indirizzo del dominio verificato.
4. Prova il modulo in produzione e controlla che l'email arrivi.

Finché Resend non è attivo, il modulo valida i dati e propone email e WhatsApp: nessuna richiesta va persa.

## 5. Checklist di lancio
- [ ] Titolare ha approvato testi, immagini, portfolio e dati legali.
- [ ] Dominio collegato e `SITE_URL` impostato.
- [ ] Modulo di contatto provato (email ricevuta).
- [ ] Privacy e cookie policy riviste (consigliato un consulente).
- [ ] Siti dei clienti in portfolio sistemati (titolo SEO Osteria, refuso Sudditalia).
- [ ] `SITE_INDEXABLE=true` e nuovo deploy.
- [ ] Sitemap inviata a Google Search Console: `https://tuodominio.it/sitemap.xml`.
- [ ] Controllo finale da telefono di tutte le pagine.

## Cosa è già fatto (fase 8)
- Metadati completi: titoli, descrizioni, canonical, `hreflang` IT/EN, Open Graph e immagine social (`public/og.png`).
- `robots.txt` e `sitemap.xml` generati; indicizzazione controllata da `SITE_INDEXABLE`.
- Dati strutturati schema.org (`ProfessionalService`) in homepage.
- Intestazioni di sicurezza (`next.config.ts`).
- Pagine interne (`/design-system`, `/wireframes`) bloccate in produzione.
- Controllo automatico dopo ogni build: nessun segnaposto `[[…]]` nelle pagine pubbliche.
- Verifiche (24/11/2026, build di prova indicizzabile): 28 pagine senza errori; Lighthouse mobile performance 88–99 (variabile tra misure), accessibilità, best practice e SEO 100; navigazione da tastiera con focus visibile; testi leggibili senza JavaScript; nessuna animazione con "riduci movimento".

## Limiti noti
- Test automatici solo su Chromium; da provare a mano su Safari (iPhone) e Firefox.
- Nessuna Content Security Policy rigida: da valutare dopo il lancio.
- Kormè, Oro Croccante e CALDERA senza immagini reali.
