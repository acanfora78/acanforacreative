import { ViewTransition, type ReactNode } from "react";

/**
 * Dissolvenza al cambio pagina (React 19.3 + View Transitions del browser).
 * Va messa in ogni pagina, non nel layout: i layout restano montati e non animerebbero.
 * Nei browser senza supporto la navigazione resta normale.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}

/** Copertina condivisa tra griglia e case study: si sposta da una pagina all'altra. */
export function SharedCover({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`cover-${slug}`} share="cover" default="none">
      {children}
    </ViewTransition>
  );
}
