import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text";

const base =
  "label inline-flex min-h-12 items-center justify-center gap-4 transition-[color,background-color,border-color] duration-[var(--dur-short)] ease-[var(--ease-quiet)]";

const styles: Record<Variant, string> = {
  // Motion system v2 (fase 9.5): riempimento che sale (300 ms), filetto che si ridisegna. Classi in globals.css.
  // Pieno: colore del testo come fondo (avorio su tema scuro, nero su tema chiaro)
  primary: "fx-fill bg-fg px-8 text-bg [--fill:var(--accent)]",
  // Contorno sottile
  secondary: "fx-fill border border-fg/40 px-8 text-fg [--fill:var(--fg)] hover:border-fg hover:text-bg focus-visible:text-bg",
  // Link testuale con filetto
  text: "fx-line min-h-11 pb-1 text-fg",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">;

/** Pulsante/collegamento di brand. Esterni (http, mailto, tel) come <a>, interni con next/link. */
export function Button({ href, children, variant = "primary", className = "", ...rest }: Props) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
