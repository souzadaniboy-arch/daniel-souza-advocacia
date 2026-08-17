import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F3EE",
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  try {
    const base = await buildMetadata({});
    return {
      ...base,
      metadataBase: new URL(SITE_URL),
    };
  } catch {
    return {
      title: "Daniel de Souza Advocacia e Consultoria Jurídica",
      description: "Advocacia e consultoria jurídica nas áreas Previdenciária, Trabalhista, Tributária, Bancária e Direitos das Pessoas Autistas.",
      metadataBase: new URL(SITE_URL),
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
