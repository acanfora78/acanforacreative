import { GFS_Didot, Lato } from "next/font/google";

// Font ospitati dal sito (next/font li scarica in build): nessuna richiesta a Google durante la navigazione.
// Licenza SIL OFL 1.1: vedi licenses/.
export const didot = GFS_Didot({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gfs-didot",
  display: "swap",
});

export const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-lato",
  display: "swap",
});

export const fontVariables = `${didot.variable} ${lato.variable}`;
