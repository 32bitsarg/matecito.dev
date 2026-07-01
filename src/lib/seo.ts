import type { Metadata } from "next";

export const SITE_URL = "https://matecito.dev";
export const SITE_NAME = "Matecito.dev";

export const DEFAULT_DESCRIPTION =
  "Studio digital desde Pergamino, Argentina. Comunidades, videojuegos y productos construidos en público: Recién Llegué, ZeroLagARG, Conquest of Etheria y Labs.";

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
}: {
  title?: string;
  description?: string;
  path: string;
  absoluteTitle?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const resolvedTitle = absoluteTitle ?? title ?? SITE_NAME;
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
