import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "ACANFORA CREATIVE — revisione interna",
  // Pagine di lavoro (design system, wireframe): mai indicizzate.
  robots: { index: false, follow: false },
};

/** Layout radice delle pagine interne di revisione, fuori dalle lingue del sito. */
export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
