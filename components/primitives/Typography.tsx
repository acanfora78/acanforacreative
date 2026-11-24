import type { ElementType, ReactNode } from "react";

/** Etichetta spaziata (stile "CREATIVE" del logo). */
export function Label({ children, as: Tag = "p", className = "" }: { children: ReactNode; as?: ElementType; className?: string }) {
  return <Tag className={`label text-muted ${className}`}>{children}</Tag>;
}

/** Titolo editoriale in GFS Didot. `size` mappa la scala del design system (mai sotto 32px). */
export function Display({
  children,
  as: Tag = "h2",
  size = "l",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  size?: "xl" | "l" | "m" | "heading";
  className?: string;
}) {
  const sizes = {
    xl: "text-display-xl",
    l: "text-display-l",
    m: "text-display-m",
    heading: "text-heading",
  };
  return <Tag className={`font-display text-balance ${sizes[size]} ${className}`}>{children}</Tag>;
}

/** Filetto orizzontale sottile. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-line ${className}`} />;
}
