import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { route: "", priority: 1.0, freq: "weekly" as const },
    { route: "/landing-pages", priority: 0.95, freq: "monthly" as const },
    { route: "/proyectos", priority: 0.9, freq: "monthly" as const },
    { route: "/labs", priority: 0.8, freq: "monthly" as const },
    { route: "/privacidad", priority: 0.3, freq: "yearly" as const },
  ];

  return routes.map(({ route, priority, freq }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));
}
