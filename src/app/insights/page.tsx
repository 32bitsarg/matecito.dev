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
        <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent)] selection:text-[var(--background)] relative">
            {/* Subtle background grid (Hero style) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--accent)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--accent)_0.5px,transparent_0.5px)] opacity-[0.03] bg-[size:24px_24px] pointer-events-none"></div>

            <section className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-6xl">

                {/* Hero CTA: El último gran post */}
                {featuredPost ? (
                    <div className="flex flex-col gap-16 mb-40 border-b border-[var(--accent)]/10 pb-32">
                        <header className="flex flex-col gap-8 max-w-4xl">
                            <div className="inline-flex items-center border border-[var(--accent)]/5 bg-[var(--accent)]/[0.03] px-6 py-2 text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--accent)] backdrop-blur-sm w-fit rounded-full font-bold shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] mr-4 animate-pulse"></span>
                                Último Insight // {featuredPost.category || "Ingeniería"}
                            </div>

                            <h1 className="text-5xl sm:text-8xl font-bold tracking-tighter leading-none mt-4 text-balance text-[var(--accent)] uppercase">
                                {featuredPost.title}
                            </h1>
                            <p className="text-[var(--foreground)] opacity-60 text-xl font-medium leading-relaxed max-w-3xl">
                                {featuredPost.excerpt}
                            </p>
                            <div className="mt-8">
                                <Link
                                    href={`/insights/${featuredPost.slug}`}
                                    className="inline-flex items-center justify-center px-12 py-5 bg-[var(--accent)] text-[var(--background)] text-[10px] font-mono uppercase tracking-[0.3em] hover:opacity-90 transition-all group rounded-full font-bold shadow-xl shadow-[var(--accent)]/20"
                                >
                                    Ver Artículo Completo
                                    <span className="ml-4 group-hover:translate-x-2 transition-transform text-lg">→</span>
                                </Link>
                            </div>
                        </header>
                    </div>
                ) : (
                    <header className="flex flex-col gap-8 mb-32 max-w-3xl">
                        <h1 className="text-6xl font-bold tracking-tighter text-[var(--accent)] uppercase">Insights</h1>
                        <p className="text-[var(--foreground)] opacity-60 text-xl font-medium leading-relaxed">
                            Una curaduría de pensamientos sobre arquitectura de sistemas, ingeniería de software
                            y el arte de construir productos digitales.
                        </p>
                    </header>
                )}

                {/* Secondary Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
                    {otherPosts.map((post) => (
                        <Link
                            href={`/insights/${post.slug}`}
                            key={post.id}
                            className="group flex flex-col gap-8 p-10 rounded-[2.5rem] border border-[var(--accent)]/5 bg-[var(--accent)]/[0.02] hover:bg-[var(--accent)]/[0.05] transition-all hover:shadow-xl hover:shadow-[var(--accent)]/5"
                        >
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--accent)] opacity-40 font-bold border-b border-[var(--accent)]/5 pb-6">
                                <span>{post.category || "General"}</span>
                                <span>{new Date(post.published_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex flex-col gap-6">
                                <h3 className="text-3xl font-bold tracking-tighter text-[var(--accent)] uppercase leading-none group-hover:translate-x-1 transition-transform">
                                    {post.title}
                                </h3>
                                <p className="text-[var(--foreground)] opacity-60 text-sm font-medium leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-mono uppercase text-[var(--accent)] font-bold group-hover:gap-5 transition-all mt-auto pt-6">
                                <span>Leer Insight</span>
                                <span className="text-lg">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <footer className="mt-48 pt-16 border-t border-[var(--accent)]/10 flex items-center justify-between opacity-30">
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--foreground)] font-bold">Matecito // Laboratorio</span>
                    <span className="text-[10px] font-mono text-[var(--foreground)] font-bold">© 2026</span>
                </footer>
            </section>
        </div>
    );
}
