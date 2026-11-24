import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACANFORA CREATIVE",
  description: "Creative Digital Studio.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
