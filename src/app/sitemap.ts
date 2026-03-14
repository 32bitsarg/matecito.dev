import { supabase } from "@/lib/supabase";
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://matecito.dev';

    // 1. Rutas Estáticas
    const staticRoutes = [
        '',
        '/consultoria',
        '/estudio',
        '/insights',
        '/landings',
        '/seo',
        '/marketing',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Rutas Dinámicas (Blog/Insights)
    // Obtenemos los slugs de supabase para incluirlos en el sitemap
    let postRoutes: any[] = [];
    try {
        const { data: posts } = await supabase
            .from("posts")
            .select("slug, published_at")
            .order("published_at", { ascending: false });

        if (posts) {
            postRoutes = posts.map((post) => ({
                url: `${baseUrl}/insights/${post.slug}`,
                lastModified: new Date(post.published_at),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }));
        }
    } catch (error) {
        console.error('Error generating dynamic sitemap routes:', error);
    }

    return [...staticRoutes, ...postRoutes];
}
