/*
 * Simbolo ad anello aperto: tracciato identico al logo master (brand/logo-master/01_logo_master_avorio.svg).
 * Animazione (fase 11): il contorno si disegna, poi il simbolo si riempie e resta esattamente il master.
 * Senza movimento ("riduci movimento" o browser senza supporto) si vede subito pieno.
 */
export const MASTER_SYMBOL_PATH =
  "M 182 250 C 220 135 405 58 585 69 C 655 73 694 103 687 143 C 684 164 669 184 648 202 C 663 177 675 153 670 133 C 661 98 626 89 581 91 C 420 99 263 166 207 246 C 178 288 198 318 252 323 C 354 333 520 278 630 211 C 535 292 374 357 257 354 C 161 351 136 310 182 250 Z";

export function Symbol({ className = "", draw = true }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="130 50 570 315" className={className} aria-hidden="true" focusable="false">
      <path d={MASTER_SYMBOL_PATH} pathLength={1} className={draw ? "k-symbol" : ""} fill="currentColor" />
    </svg>
  );
}
