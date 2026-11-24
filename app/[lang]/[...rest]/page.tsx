import { notFound } from "next/navigation";

/** Qualsiasi percorso sconosciuto sotto /it o /en mostra la 404 localizzata. */
export default function CatchAll() {
  notFound();
}
