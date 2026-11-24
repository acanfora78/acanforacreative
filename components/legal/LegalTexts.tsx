import Link from "next/link";
import { studio } from "@/content/site";
import { href, type Locale } from "@/lib/i18n";

/*
 * Informativa privacy (art. 13 GDPR) e cookie policy (art. 122 D.Lgs. 196/2003,
 * Linee guida Garante 10/06/2021), scritte per QUESTO sito com'è oggi:
 * nessun analytics né pixel, font ospitati sul sito, un solo cookie tecnico ("lang").
 * Se si aggiungono strumenti di terzi, vanno aggiornate PRIMA.
 * TODO: far rivedere a un consulente; confermare hosting (Vercel) al lancio.
 */

const UPDATED = { it: "24 novembre 2026", en: "24 November 2026" };

function Holder() {
  return (
    <address className="not-italic">
      <strong>{studio.legal.holder}</strong> ({studio.legal.form}), {studio.name}
      <br />
      P.IVA {studio.legal.vat}
      <br />
      Email: <a href={`mailto:${studio.email}`}>{studio.email}</a>
    </address>
  );
}

export function PrivacyText({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <>
        <p className="text-muted">Last updated: {UPDATED.en}</p>
        <h2>1. Data controller</h2>
        <Holder />
        <h2>2. What data we process</h2>
        <p>
          <strong>Browsing data.</strong> The hosting provider automatically records technical data (IP address, date and time,
          page requested, browser). It is used only to run and secure the site.
        </p>
        <p>
          <strong>Data you send us.</strong> Through the contact form: name, email, and optionally phone, company, services of
          interest and your message. If you write by email, WhatsApp or Instagram, we process the data you choose to share.
        </p>
        <p>The site uses no analytics, advertising pixels or profiling cookies.</p>
        <h2>3. Purposes, legal basis and retention</h2>
        <ul>
          <li>Replying to your request and preparing a quote — pre-contractual measures (art. 6.1.b GDPR) — up to 24 months after the last contact.</li>
          <li>Managing the client relationship and invoicing — contract and legal obligations (art. 6.1.b and 6.1.c) — 10 years for accounting records.</li>
          <li>Site security — legitimate interest (art. 6.1.f) — for the time kept by the hosting provider.</li>
        </ul>
        <p>Providing data is optional, but without an email we cannot reply. No automated decision-making.</p>
        <h2>4. Recipients</h2>
        <p>
          Data may be processed by: Vercel Inc. (hosting); Resend (delivery of form emails); Google (email service, Gmail); WhatsApp
          / Meta, if you write to us there; our accountant, for tax obligations. Some providers are based in the USA: transfers rely on
          the EU-U.S. Data Privacy Framework or the European Commission&apos;s standard contractual clauses.
        </p>
        <h2>5. Your rights</h2>
        <p>
          You can ask to access, rectify, erase, restrict or port your data and object to processing (arts. 15–22 GDPR) by writing
          to <a href={`mailto:${studio.email}`}>{studio.email}</a>. You can also lodge a complaint with the Italian Data Protection
          Authority (<a href="https://www.garanteprivacy.it">garanteprivacy.it</a>).
        </p>
        <h2>6. Cookies</h2>
        <p>
          See the <Link href={href("en", "cookie")}>cookie policy</Link>.
        </p>
      </>
    );
  }
  return (
    <>
      <p className="text-muted">Ultimo aggiornamento: {UPDATED.it}</p>
      <h2>1. Titolare del trattamento</h2>
      <Holder />
      <h2>2. Quali dati trattiamo</h2>
      <p>
        <strong>Dati di navigazione.</strong> Il fornitore di hosting registra in automatico dati tecnici (indirizzo IP, data e ora,
        pagina richiesta, browser). Servono solo a far funzionare il sito e a proteggerlo.
      </p>
      <p>
        <strong>Dati che ci invii.</strong> Con il modulo di contatto: nome, email e, se vuoi, telefono, azienda, servizi di
        interesse e messaggio. Se ci scrivi per email, WhatsApp o Instagram, trattiamo i dati che scegli di condividere.
      </p>
      <p>Il sito non usa strumenti di statistica, pixel pubblicitari né cookie di profilazione.</p>
      <h2>3. Finalità, base giuridica e conservazione</h2>
      <ul>
        <li>Rispondere alla tua richiesta e preparare un preventivo — misure precontrattuali (art. 6.1.b GDPR) — fino a 24 mesi dall&apos;ultimo contatto.</li>
        <li>Gestire il rapporto con i clienti e la fatturazione — contratto e obblighi di legge (art. 6.1.b e 6.1.c) — 10 anni per i documenti contabili.</li>
        <li>Sicurezza del sito — legittimo interesse (art. 6.1.f) — per il tempo previsto dal fornitore di hosting.</li>
      </ul>
      <p>Conferire i dati è facoltativo, ma senza un&apos;email non possiamo risponderti. Nessuna decisione automatizzata.</p>
      <h2>4. Destinatari</h2>
      <p>
        I dati possono essere trattati da: Vercel Inc. (hosting); Resend (invio delle email del modulo); Google (servizio email
        Gmail); WhatsApp / Meta, se ci scrivi lì; il commercialista, per gli obblighi fiscali. Alcuni fornitori hanno sede negli Stati
        Uniti: il trasferimento si basa sull&apos;EU-U.S. Data Privacy Framework o sulle clausole contrattuali standard della
        Commissione europea.
      </p>
      <h2>5. I tuoi diritti</h2>
      <p>
        Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità dei tuoi dati e opporti al trattamento (artt. 15–22
        GDPR) scrivendo a <a href={`mailto:${studio.email}`}>{studio.email}</a>. Puoi anche proporre reclamo al Garante per la
        protezione dei dati personali (<a href="https://www.garanteprivacy.it">garanteprivacy.it</a>).
      </p>
      <h2>6. Cookie</h2>
      <p>
        Vedi la <Link href={href("it", "cookie")}>cookie policy</Link>.
      </p>
    </>
  );
}

export function CookieText({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <>
      <p className="text-muted">{en ? `Last updated: ${UPDATED.en}` : `Ultimo aggiornamento: ${UPDATED.it}`}</p>
      <p>
        {en
          ? "This site uses only one technical cookie, needed to remember your language. It uses no analytics, advertising or profiling cookies, ours or third-party. For technical cookies the law does not require consent, so there is no consent banner."
          : "Questo sito usa un solo cookie tecnico, necessario a ricordare la lingua. Non usa cookie di statistica, pubblicitari o di profilazione, né nostri né di terze parti. Per i cookie tecnici la legge non richiede il consenso: per questo non c'è un banner."}
      </p>
      <h2>{en ? "Cookies used" : "Cookie utilizzati"}</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">{en ? "Name" : "Nome"}</th>
            <th scope="col">{en ? "Purpose" : "Finalità"}</th>
            <th scope="col">{en ? "Duration" : "Durata"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>lang</td>
            <td>{en ? "Remembers the language you chose (it/en)" : "Ricorda la lingua scelta (it/en)"}</td>
            <td>{en ? "1 year" : "1 anno"}</td>
          </tr>
        </tbody>
      </table>
      <h2>{en ? "Third parties" : "Terze parti"}</h2>
      <p>
        {en
          ? "Fonts are hosted on this site: your browser does not contact Google Fonts. Links to WhatsApp, Instagram and client websites take you to third-party sites with their own policies; nothing is sent to them until you click."
          : "I caratteri tipografici sono ospitati su questo sito: il browser non contatta Google Fonts. I link a WhatsApp, Instagram e ai siti dei clienti portano su siti di terzi, con le loro regole; finché non clicchi non ricevono nulla."}
      </p>
      <h2>{en ? "How to manage cookies" : "Come gestirli"}</h2>
      <p>
        {en
          ? "You can delete or block cookies in your browser settings. The site keeps working; it will just ask your language again."
          : "Puoi cancellare o bloccare i cookie dalle impostazioni del browser. Il sito continua a funzionare: chiederà di nuovo la lingua."}
      </p>
      <p>
        {en ? "Data controller and rights: see the " : "Titolare e diritti: vedi l'"}
        <Link href={href(locale, "privacy")}>{en ? "privacy policy" : "informativa privacy"}</Link>.
      </p>
    </>
  );
}
