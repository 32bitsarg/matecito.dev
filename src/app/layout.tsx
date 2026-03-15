import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";

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
  title: "Matecito.Dev | Branding, Landing Pages & Ingeniería Software",
  description: "Estudio de ingeniería de software especializado en Branding premium, Landing Pages de alta conversión y SEO técnico. Escalamos tu negocio con soluciones tecnológicas de alto rendimiento.",
  openGraph: {
    title: "Matecito.Dev | Branding, Landing Pages & Ingeniería Software",
    description: "Estudio de ingeniería de software especializado en Branding premium, Landing Pages de alta conversión y SEO técnico.",
    url: "https://matecito.dev",
    siteName: "Matecito.Dev",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matecito.Dev | Branding, Landing Pages & Ingeniería Software",
    description: "Diseño, desarrollo y performance extrema para tu negocio.",
  },
};

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
        className={`${clashDisplay.variable} ${commitMono.variable} flex min-h-screen flex-col font-sans antialiased bg-black text-white`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
