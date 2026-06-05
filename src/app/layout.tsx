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
  title: {
    default: "Matecito.dev — Construyendo comunidades, videojuegos y productos digitales",
    template: "%s — matecito.dev",
  },
  description: "Matecito.dev es un ecosistema de proyectos digitales: Recién Llegué, ZeroLagARG, Conquest of Etheria y Labs. Construimos en público desde Pergamino, Argentina.",
  keywords: ["ecosistema digital Argentina", "videojuegos Argentina", "comunidad gaming Argentina", "build in public", "software Pergamino Buenos Aires"],
  openGraph: {
    title: "Matecito.dev — Ecosistema digital desde Argentina",
    description: "Comunidades, videojuegos y productos digitales construidos en público desde Pergamino, Argentina.",
    url: "https://matecito.dev",
    siteName: "Matecito.dev",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matecito.dev — Ecosistema digital desde Argentina",
    description: "Comunidades, videojuegos y productos digitales. Construimos en público.",
  },
  icons: {
    icon: "/logos/matecitologo.png",
    shortcut: "/logos/matecitologo.png",
    apple: "/logos/matecitologo.png",
  },
};

import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
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
        <ThemeProvider>
          <WorkspaceProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <ConditionalFooter />
            <Toaster position="top-right" richColors />
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
