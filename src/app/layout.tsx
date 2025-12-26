import type { Metadata } from "next";
import { Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Nossa história",
  description: "Um blog contando a nossa história.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Nosso História de Amor",
    description: "Uma historia, cartas e memorias cheias de carinho.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
