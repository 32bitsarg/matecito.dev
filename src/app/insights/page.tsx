import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 3600;

export default async function InsightsPage() {
    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

    const blogPosts = posts || [];
    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1);

    return (
        <div className="flex flex-col min-h-screen bg-black text-white selection:bg-zinc-800">
            {/* Subtle background grid (Hero style) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-6xl">

                {/* Hero CTA: El último gran post */}
                {featuredPost ? (
                    <div className="flex flex-col gap-12 mb-32 border-b border-white/10 pb-24">
                        <header className="flex flex-col gap-6 max-w-3xl">
                            <div className="inline-flex items-center border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.3em] text-white backdrop-blur-sm w-fit">
                                <span className="flex h-2 w-2 rounded-full bg-white mr-3 animate-pulse"></span>
                                Último Insight // {featuredPost.category || "Ingeniería"}
                            </div>

                            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter leading-tight mt-2 text-balance">
                                {featuredPost.title}
                            </h1>
                            <p className="text-zinc-400 text-xl font-light leading-relaxed max-w-2xl">
                                {featuredPost.excerpt}
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={`/insights/${featuredPost.slug}`}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-xs font-mono uppercase tracking-widest hover:bg-zinc-200 transition-all group"
                                >
                                    Ver Artículo Completo
                                    <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </header>
                    </div>
                ) : (
                    <header className="flex flex-col gap-5 mb-24 max-w-2xl">
                        <h1 className="text-3xl font-medium tracking-tight">Insights</h1>
                        <p className="text-zinc-500 text-lg font-light leading-relaxed">
                            Una curaduría de pensamientos sobre arquitectura de sistemas, ingeniería de software
                            y el arte de construir productos digitales.
                        </p>
                    </header>
                )}

                {/* Secondary Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {otherPosts.map((post) => (
                        <Link
                            href={`/insights/${post.slug}`}
                            key={post.id}
                            className="group flex flex-col gap-6"
                        >
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-600 border-b border-white/5 pb-4">
                                <span>{post.category || "General"}</span>
                                <span className="text-zinc-500">{new Date(post.published_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-2xl font-medium tracking-tight group-hover:text-zinc-400 transition-colors duration-300">
                                    {post.title}
                                </h3>
                                <p className="text-zinc-500 text-base font-light leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-zinc-400 font-bold group-hover:text-white transition-colors">
                                <span>Leer Insight</span>
                                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <footer className="mt-48 pt-12 border-t border-white/5 flex items-center justify-between opacity-30">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Matecito // Laboratorio</span>
                    <span className="text-[10px] font-mono text-zinc-700">© 2026</span>
                </footer>
            </section>
        </div>
    );
}
