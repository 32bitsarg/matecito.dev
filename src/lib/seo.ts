import type { Metadata } from "next";

export const SITE_URL = "https://matecito.dev";
export const SITE_NAME = "Matecito.dev";

export const DEFAULT_DESCRIPTION =
  "Studio digital desde Pergamino, Argentina. Comunidades, videojuegos, productos digitales y landing pages construidos con proceso visible.";

export const OG_IMAGE = {
  url: "/banner/bannerfb.png",
  width: 1200,
  height: 630,
  alt: "Matecito.dev — Studio digital desde Argentina",
};

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  absoluteTitle,
  ogImage = OG_IMAGE,
}: {
  title?: string;
  description?: string;
  path: string;
  absoluteTitle?: string;
  ogImage?: typeof OG_IMAGE;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogTitle = absoluteTitle ?? (title ? `${title} — matecito.dev` : SITE_NAME);

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_AR",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage.url],
    },
  };
}
