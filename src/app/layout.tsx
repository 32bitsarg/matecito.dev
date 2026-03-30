import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import Script from "next/script";
import { Toaster } from "sonner";

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
  title: "Matecito.Dev — Páginas Web y Landings para Emprendimientos y Pymes",
  description: "Creamos páginas web y landings de alta conversión para emprendimientos y pymes en Argentina. Diseño profesional, SEO optimizado y resultados medibles.",
  keywords: ["páginas web pymes Argentina", "landing page emprendimiento", "diseño web Pergamino", "desarrollo web Argentina", "SEO local Argentina"],
  openGraph: {
    title: "Matecito.Dev — Páginas Web para Emprendimientos y Pymes",
    description: "Potenciá tu emprendimiento con una página web profesional. Diseño + SEO + conversión.",
    url: "https://matecito.dev",
    siteName: "Matecito.Dev",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matecito.Dev — Páginas Web para Emprendimientos y Pymes",
    description: "Potenciá tu emprendimiento con una página web profesional. Diseño + SEO + conversión.",
  },
  icons: {
    icon: "/logos/matecitologo.png",
    shortcut: "/logos/matecitologo.png",
    apple: "/logos/matecitologo.png",
  },
};

import { WorkspaceProvider } from "@/contexts/WorkspaceContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0Z1TBB6SX2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0Z1TBB6SX2');
          `}
        </Script>
        {/* End Google Analytics */}
      </head>
      <body
        className={`${clashDisplay.variable} ${commitMono.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <WorkspaceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
          <Toaster position="top-right" richColors theme="light" />
        </WorkspaceProvider>
      </body>
    </html>
  );
}
