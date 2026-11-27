# Fase 11 — Motion design "Title sequence"

La home come i titoli di testa di un film: tipografia cinetica in Didot e Lato, nero, avorio e un solo accento oro tenue.
Sostituisce il viaggio 3D (fase 10), rimosso il 27/11/2026 perché si bloccava su dispositivi reali.

## Principi
- **Niente WebGL.** Motion graphics in CSS e SVG; nessuna libreria di animazione aggiunta.
- **Allo scroll:** animazioni guidate dallo scroll del browser (`animation-timeline: view()`), eseguite dal browser stesso, non dal JavaScript: non possono bloccare la pagina. Dove non sono supportate (es. Firefox) tutto resta fermo e visibile.
- **Solo proprietà leggere:** trasformazioni, opacità all'apertura, colore e maschere (`clip-path`). Mai layout.
- **Entrate allo scroll con maschera, non con trasparenza:** il testo ha sempre il contrasto pieno (AA).
- **Il titolo della Hero è visibile dal primo disegno** (elemento LCP): si muove soltanto.
- **"Riduci movimento":** nessuna animazione.

## Elementi
| Dove | Movimento |
|---|---|
| Hero | Il simbolo master si disegna e si riempie (stato finale identico al logo); anello di testo che gira; luce che respira; grana di pellicola; titolo e filo d'oro in entrata |
| Fascia servizi | Due righe di servizi in Didot (piena e a contorno) che scorrono in versi opposti |
| Manifesto | Le parole passano dal grigio al nero una dopo l'altra mentre il paragrafo attraversa lo schermo |
| Progetti | Il fotogramma si apre come un sipario e l'immagine arretra; numero del progetto; freccia al passaggio |
| Servizi | Righe che entrano da sinistra in sequenza; fondo che scorre al passaggio |
| Metodo | Linea del tempo che si disegna con lo scroll; i numeri a contorno si riempiono al suo passaggio |
| Studio | La foto si apre da un cerchio, come un diaframma |
| Chiusura | "Parliamone." entra lettera per lettera; il simbolo gira lentissimo sullo sfondo |
| Pagine interne | Titolo e introduzione in entrata, titoli di sezione con maschera, copertine a sipario, foto a diaframma |

File: `components/kinetic/` (Symbol, TextRing, Marquee, Words/Letters), `components/home/Sections.tsx`, `app/globals.css` (blocco "Fase 11").

## Verifiche (27/11/2026, build di produzione)
- Scroll di tutta la home: nessun task oltre 50 ms (il più lungo 12 ms).
- Lighthouse mobile: prestazioni 92–98 su home, studio, servizi, case study, contatti; accessibilità, best practice e SEO 100; CLS 0.
- "Riduci movimento": nessuna animazione attiva.

## Come provarlo
Branch `fase-11-motion` (anteprima Vercel del branch, se il progetto è collegato), oppure in locale: `git checkout fase-11-motion && npm install && npm run dev` → http://localhost:3000/it
