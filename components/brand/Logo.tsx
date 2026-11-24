import Image from "next/image";

/**
 * Logo ufficiale ACANFORA CREATIVE.
 * Usa SOLO i file master in public/brand/ (copie di brand/logo-master/): nessun ridisegno o ricolorazione.
 *
 * Varianti disponibili nel master:
 * - "master-light":       01 — logo su fondo avorio
 * - "master-transparent": 02 — logo nero senza fondo, per fondi chiari
 * - "master-dark":        03 — logo avorio su fondo nero (#111111)
 * - "symbol-app":         04 — simbolo in quadrato nero arrotondato (avatar, favicon)
 * - "lockup-light":       05 — composizione orizzontale su fondo avorio
 *
 * Varianti derivate (approvate, solo scambio dei due colori ufficiali; vedi brand/derived/):
 * - "negative-transparent": 06 — logo avorio senza fondo, per fondi scuri
 * - "lockup-dark":          07 — lockup orizzontale avorio su fondo nero
 */
const variants = {
  "master-light": { src: "/brand/01_logo_master_avorio.svg", w: 1200, h: 760 },
  "master-transparent": { src: "/brand/02_logo_master_trasparente.svg", w: 1200, h: 760 },
  "master-dark": { src: "/brand/03_logo_master_fondo_nero.svg", w: 1200, h: 760 },
  "symbol-app": { src: "/brand/04_simbolo_instagram.svg", w: 800, h: 800 },
  "lockup-light": { src: "/brand/05_lockup_orizzontale.svg", w: 1400, h: 520 },
  "negative-transparent": { src: "/brand/06_logo_negativo_trasparente.svg", w: 1200, h: 760 },
  "lockup-dark": { src: "/brand/07_lockup_orizzontale_negativo.svg", w: 1400, h: 520 },
} as const;

export type LogoVariant = keyof typeof variants;

/** Larghezze minime digitali consigliate (px), sotto cui il marchio perde leggibilità. */
export const LOGO_MIN_WIDTH: Record<LogoVariant, number> = {
  "master-light": 160,
  "master-transparent": 160,
  "master-dark": 160,
  "symbol-app": 24,
  "lockup-light": 200,
  "negative-transparent": 160,
  "lockup-dark": 200,
};

export function Logo({
  variant,
  width,
  preload = false,
  className = "",
  alt = "ACANFORA CREATIVE",
}: {
  variant: LogoVariant;
  /** Larghezza resa in px; l'altezza segue le proporzioni del master. */
  width: number;
  preload?: boolean;
  className?: string;
  alt?: string;
}) {
  const v = variants[variant];
  return (
    <Image
      src={v.src}
      alt={alt}
      width={width}
      height={Math.round((width * v.h) / v.w)}
      preload={preload}
      className={className}
    />
  );
}
