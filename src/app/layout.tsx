import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const clashDisplay = localFont({
  src: [
    { path: "../../public/fonts/clash-display-Principal/ClashDisplay-Extralight.otf", weight: "200", style: "normal" },
    { path: "../../public/fonts/clash-display-Principal/ClashDisplay-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/clash-display-Principal/ClashDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/clash-display-Principal/ClashDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/clash-display-Principal/ClashDisplay-Semibold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/clash-display-Principal/ClashDisplay-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
});

const commitMono = localFont({
  src: [
    { path: "../../public/fonts/commit-mono_5.2.5-Secundaria/webfonts/commit-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/commit-mono_5.2.5-Secundaria/webfonts/commit-mono-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-commit-mono",
});

export const metadata: Metadata = {
  title: "Matecito.Dev | Boutique de Ingeniería & Arquitectura Digital",
  description: "Desarrollamos ecosistemas digitales de alto rendimiento. Consultoría estratégica, arquitectura escalable y soluciones de software con precisión quirúrgica.",
  openGraph: {
    title: "Matecito.Dev | Boutique de Ingeniería",
    description: "Desarrollamos ecosistemas digitales de alto rendimiento.",
    url: "https://matecito.dev",
    siteName: "Matecito.Dev",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matecito.Dev | Boutique de Ingeniería",
    description: "Desarrollamos ecosistemas digitales de alto rendimiento.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${clashDisplay.variable} ${commitMono.variable} flex min-h-screen flex-col font-sans antialiased bg-black text-white`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
