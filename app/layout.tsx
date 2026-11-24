import type { Metadata } from "next";
import { GFS_Didot, Lato } from "next/font/google";
import "./globals.css";

// Font ospitati dal sito (next/font li scarica in build): nessuna richiesta a Google durante la navigazione.
// Licenza SIL OFL 1.1: vedi licenses/.
const didot = GFS_Didot({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gfs-didot",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACANFORA CREATIVE",
  description: "Creative Digital Studio.",
  // Non indicizzare finché il sito non è approvato e pubblicato.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${didot.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  );
}
