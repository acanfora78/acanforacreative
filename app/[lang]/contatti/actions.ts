"use server";

import { studio } from "@/content/site";

export type ContactState = {
  status: "idle" | "success" | "invalid" | "unavailable" | "failed";
  errors?: Partial<Record<"name" | "email" | "message" | "privacy", true>>;
};

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/**
 * Invio del modulo di contatto.
 * Consegna via API Resend (fetch, nessuna libreria) se è impostata RESEND_API_KEY.
 * Senza chiave risponde "unavailable": la pagina mostra email e WhatsApp come alternativa.
 * Variabili: RESEND_API_KEY (obbligatoria), CONTACT_FROM (mittente verificato), CONTACT_TO (destinatario).
 */
export async function sendContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Campo nascosto anti-spam: se compilato è un bot. Rispondiamo "ok" senza inviare nulla.
  if (clip(form.get("website"), 200)) return { status: "success" };

  const data = {
    name: clip(form.get("name"), 120),
    email: clip(form.get("email"), 200),
    phone: clip(form.get("phone"), 40),
    company: clip(form.get("company"), 160),
    services: form.getAll("services").map((s) => clip(s, 40)).slice(0, 6),
    message: clip(form.get("message"), 4000),
    privacy: form.get("privacy") === "on",
    lang: clip(form.get("lang"), 2),
  };

  const errors: ContactState["errors"] = {};
  if (!data.name) errors.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = true;
  if (data.message.length < 5) errors.message = true;
  if (!data.privacy) errors.privacy = true;
  if (Object.keys(errors).length) return { status: "invalid", errors };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "unavailable" };

  const text = [
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Telefono: ${data.phone}`,
    data.company && `Azienda: ${data.company}`,
    data.services.length > 0 && `Servizi: ${data.services.join(", ")}`,
    `Lingua: ${data.lang}`,
    "",
    data.message,
  ]
    .filter((l) => l !== false && l !== "")
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "ACANFORA CREATIVE <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? studio.email],
        reply_to: data.email,
        subject: `Nuova richiesta dal sito — ${data.name}`,
        text,
      }),
    });
    return res.ok ? { status: "success" } : { status: "failed" };
  } catch {
    return { status: "failed" };
  }
}
