import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Wireframe — ACANFORA CREATIVE", template: "%s · Wireframe" },
  robots: { index: false, follow: false },
};

/** Wireframe di revisione (fase 3): fuori dal sito pubblico, non indicizzati. */
export default function WireframesLayout({ children }: LayoutProps<"/wireframes">) {
  return <div className="theme-light">{children}</div>;
}
