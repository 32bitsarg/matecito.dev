import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://matecito.dev';

    const routes = [
        { route: '',             priority: 1.0, freq: 'weekly'  },
        { route: '/estudio',     priority: 0.9, freq: 'monthly' },
        { route: '/labs',        priority: 0.8, freq: 'monthly' },
        { route: '/apps',        priority: 0.7, freq: 'monthly' },
        { route: '/web',         priority: 0.7, freq: 'monthly' },
        { route: '/servicios',   priority: 0.5, freq: 'monthly' },
        { route: '/consultoria', priority: 0.5, freq: 'monthly' },
        { route: '/privacidad',  priority: 0.3, freq: 'yearly'  },
    ]

    return routes.map(({ route, priority, freq }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority,
    }))
}
