import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/content";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logos/matecitologo.png`,
  description:
    "Studio digital desde Pergamino, Argentina. Comunidades, videojuegos, productos digitales y servicios web.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pergamino",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: "+54-2477-699586",
    url: WHATSAPP_URL,
    availableLanguage: ["Spanish"],
  },
  sameAs: ["https://recienllegue.com"],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Ecosistema de proyectos digitales desde Argentina: plataformas locales, gaming, juegos y servicios web.",
  inLanguage: "es-AR",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]),
      }}
    />
  );
}
