import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-body",
  weight: "400 800",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  variable: "--font-heading",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Deltime | Tecnologia que não para",
  description: "Soluções de tecnologia para manter seu negócio em movimento.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
