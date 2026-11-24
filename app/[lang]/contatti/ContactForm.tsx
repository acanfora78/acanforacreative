"use client";

import Link from "next/link";
import { useActionState, useSyncExternalStore } from "react";
import { sendContact, type ContactState } from "./actions";

type FormText = {
  name: string;
  email: string;
  phone: string;
  company: string;
  services: string;
  message: string;
  privacy: string;
  privacyLink: string;
  required: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  unavailable: string;
  failed: string;
  errors: Record<"name" | "email" | "message" | "privacy", string>;
};

const field =
  "fx-field mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lead font-light text-fg placeholder:text-muted/60 focus:border-fg focus:outline-none aria-[invalid=true]:border-accent";

const noop = () => () => {};

function FieldLabel({ htmlFor, children, req, requiredText }: { htmlFor: string; children: string; req?: boolean; requiredText: string }) {
  return (
    <label htmlFor={htmlFor} className="label text-muted">
      {children}
      {req && <span aria-hidden="true"> *</span>}
      {req && <span className="sr-only"> ({requiredText})</span>}
    </label>
  );
}

function FieldError({ id, show, children }: { id: string; show?: true; children: string }) {
  return show ? (
    <p id={id} className="fx-error mt-2 text-small text-accent">
      {children}
    </p>
  ) : null;
}

export function ContactForm({
  locale,
  f,
  services,
  privacyHref,
  mailHref,
  whatsappHref,
}: {
  locale: string;
  f: FormText;
  services: { slug: string; name: string }[];
  privacyHref: string;
  mailHref: string;
  whatsappHref: string;
}) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  // Servizio già selezionato arrivando da "Richiedi questo servizio" (?servizio=...).
  // Sul server il valore è null; nel browser si legge dall'URL.
  const preselected = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("servizio"),
    () => null,
  );

  if (state.status === "success") {
    return (
      <p role="status" className="font-display border-t border-line pt-8 text-display-m">
        {f.success}
      </p>
    );
  }

  const err = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-10">
      <input type="hidden" name="lang" value={locale} />
      {/* Anti-spam: invisibile alle persone, compilato solo dai bot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cf-name" req requiredText={f.required}>{f.name}</FieldLabel>
          <input id="cf-name" name="name" required autoComplete="name" className={field} aria-invalid={err.name} aria-describedby={err.name ? "cf-name-err" : undefined} />
          <FieldError id="cf-name-err" show={err.name}>{f.errors.name}</FieldError>
        </div>
        <div>
          <FieldLabel htmlFor="cf-email" req requiredText={f.required}>{f.email}</FieldLabel>
          <input id="cf-email" name="email" type="email" required autoComplete="email" className={field} aria-invalid={err.email} aria-describedby={err.email ? "cf-email-err" : undefined} />
          <FieldError id="cf-email-err" show={err.email}>{f.errors.email}</FieldError>
        </div>
        <div>
          <FieldLabel htmlFor="cf-phone" requiredText={f.required}>{f.phone}</FieldLabel>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} />
        </div>
        <div>
          <FieldLabel htmlFor="cf-company" requiredText={f.required}>{f.company}</FieldLabel>
          <input id="cf-company" name="company" autoComplete="organization" className={field} />
        </div>
      </div>

      <fieldset>
        <legend className="label mb-4 text-muted">{f.services}</legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <label key={s.slug} className="cursor-pointer">
              <input
                type="checkbox"
                name="services"
                value={s.name}
                defaultChecked={preselected === s.slug}
                key={`${s.slug}-${preselected}`}
                className="peer sr-only"
              />
              <span className="label inline-flex min-h-11 items-center border border-line px-4 text-muted peer-checked:border-fg peer-checked:bg-fg peer-checked:text-bg peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4">
                {s.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <FieldLabel htmlFor="cf-message" req requiredText={f.required}>{f.message}</FieldLabel>
        <textarea id="cf-message" name="message" required rows={5} className={`${field} resize-y`} aria-invalid={err.message} aria-describedby={err.message ? "cf-message-err" : undefined} />
        <FieldError id="cf-message-err" show={err.message}>{f.errors.message}</FieldError>
      </div>

      <div>
        <div className="flex items-start gap-4">
          <input
            id="cf-privacy"
            name="privacy"
            type="checkbox"
            required
            className="mt-1 h-5 w-5 shrink-0 accent-[var(--fg)]"
            aria-invalid={err.privacy}
            aria-describedby={err.privacy ? "cf-privacy-err" : undefined}
          />
          <label htmlFor="cf-privacy" className="text-muted">
            {f.privacy.replace(f.privacyLink, "")}
            <Link href={privacyHref} className="text-fg underline underline-offset-4">
              {f.privacyLink}
            </Link>{" "}
            <span aria-hidden="true">*</span>
          </label>
        </div>
        <FieldError id="cf-privacy-err" show={err.privacy}>{f.errors.privacy}</FieldError>
      </div>

      <div className="flex flex-col gap-6">
        <button
          type="submit"
          disabled={pending}
          className="label inline-flex min-h-12 w-full items-center justify-center bg-fg px-8 text-bg transition-colors hover:bg-accent disabled:opacity-60 sm:w-auto sm:self-start"
        >
          {pending ? f.sending : f.submit}
        </button>

        <div role="status" aria-live="polite">
          {state.status === "invalid" && <p className="text-accent">{f.error}</p>}
          {(state.status === "unavailable" || state.status === "failed") && (
            <p className="text-muted">
              {state.status === "unavailable" ? f.unavailable : f.failed}{" "}
              <a href={mailHref} className="text-fg underline underline-offset-4">
                Email
              </a>{" "}
              ·{" "}
              <a href={whatsappHref} className="text-fg underline underline-offset-4">
                WhatsApp
              </a>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
