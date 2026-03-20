import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const { data: post } = await supabase
        .from("posts")
        .select("title, excerpt")
        .eq("slug", slug)
        .single();

    if (!post) {
        return {
            title: "Post no encontrado | Matecito.Dev",
        };
    }

    return {
        title: `${post.title} | Matecito.Dev Insights`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;

    // Fetch current post
    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !post) {
        notFound();
    }

    // Fetch related posts (same category or recent)
    const { data: relatedPosts } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, category, published_at")
        .neq("id", post.id)
        .order("published_at", { ascending: false })
        .limit(2);

    const backButton = (
        <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-[0.2em] group"
        >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Volver a Insights
        </Link>
    );

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative selection:bg-[var(--accent)] selection:text-[var(--background)]">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--accent)_0.05%,transparent_50%)] opacity-[0.03] pointer-events-none"></div>

            <article className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-3xl">
                {/* Navegación Superior */}
                <nav className="mb-16">
                    <Link
                        href="/insights"
                        className="inline-flex items-center gap-3 text-[var(--accent)] opacity-40 hover:opacity-100 transition-all font-mono text-[10px] uppercase tracking-[0.3em] group font-bold"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                        Volver a Insights
                    </Link>
                </nav>

                <header className="flex flex-col gap-8 mb-24 border-l border-[var(--accent)]/10 pl-12 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] opacity-20"></div>
                    <div className="flex items-center gap-6 text-[var(--accent)] font-mono text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">
                        <span>{post.category}</span>
                        <span className="w-6 h-px bg-[var(--accent)] opacity-20"></span>
                        <span>{new Date(post.published_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-none text-[var(--accent)] text-balance uppercase">
                        {post.title}
                    </h1>

                    <p className="text-xl text-[var(--foreground)] opacity-60 font-medium leading-relaxed max-w-2xl">
                        {post.excerpt}
                    </p>
                </header>

                <div className="prose prose-zinc max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h2: ({ node, ...props }) => <h2 className="text-4xl font-bold mt-24 mb-10 text-[var(--accent)] tracking-tighter uppercase leading-none" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-16 mb-6 text-[var(--accent)] tracking-tight uppercase" {...props} />,
                            p: ({ node, ...props }) => <p className="text-[var(--foreground)] opacity-60 text-lg leading-relaxed mb-8 font-medium" {...props} />,
                            li: ({ node, ...props }) => <li className="text-[var(--foreground)] opacity-60 text-lg mb-4 ml-6 list-disc font-medium marker:text-[var(--accent)]" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-[var(--accent)]/[0.05] text-[var(--accent)] px-2 py-0.5 rounded-md font-mono text-sm border border-[var(--accent)]/5 font-bold" {...props} />,
                            pre: ({ node, ...props }) => <pre className="bg-[var(--accent)]/[0.02] p-10 rounded-[2rem] border border-[var(--accent)]/5 overflow-x-auto my-12 font-mono text-sm shadow-sm" {...props} />,
                            a: ({ node, ...props }) => <a className="text-[var(--accent)] font-bold underline underline-offset-8 decoration-[var(--accent)]/20 hover:decoration-[var(--accent)] transition-all duration-300" target="_blank" rel="noopener noreferrer" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[var(--accent)] pl-10 py-4 my-12 italic text-2xl font-serif text-[var(--accent)] opacity-80" {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                <footer className="mt-40">
                    {/* Related Posts Section */}
                    {relatedPosts && relatedPosts.length > 0 && (
                        <div className="border-t border-[var(--accent)]/10 pt-24 mb-32">
                            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--accent)] opacity-40 block mb-16 font-bold">Siguiente Lectura</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                                {relatedPosts.map((rPost) => (
                                    <Link key={rPost.id} href={`/insights/${rPost.slug}`} className="group flex flex-col gap-8 p-10 rounded-[2rem] border border-[var(--accent)]/5 bg-[var(--accent)]/[0.02] hover:bg-[var(--accent)]/[0.05] transition-all">
                                        <span className="text-[9px] font-mono text-[var(--accent)] opacity-40 uppercase tracking-[0.3em] font-bold">{rPost.category}</span>
                                        <h4 className="text-2xl font-bold tracking-tighter text-[var(--accent)] group-hover:translate-x-2 transition-transform leading-tight uppercase">
                                            {rPost.title}
                                        </h4>
                                        <p className="text-[var(--foreground)] opacity-40 text-sm font-medium line-clamp-2 leading-relaxed">
                                            {rPost.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navegación Inferior */}
                    <nav className="pt-16 border-t border-[var(--accent)]/10 mb-24">
                        <Link
                            href="/insights"
                            className="inline-flex items-center gap-3 text-[var(--accent)] opacity-40 hover:opacity-100 transition-all font-mono text-[10px] uppercase tracking-[0.3em] group font-bold"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-2" />
                            Volver a Insights
                        </Link>
                    </nav>

                    <div className="flex flex-col gap-6 p-10 rounded-[2rem] bg-[var(--accent)]/[0.02] border border-[var(--accent)]/5">
                        <span className="font-mono text-[9px] text-[var(--accent)] opacity-40 uppercase tracking-[0.4em] font-bold">Publicado por</span>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-[var(--background)] flex items-center justify-center font-bold text-2xl shadow-xl shadow-[var(--accent)]/20">M</div>
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-lg text-[var(--accent)] uppercase tracking-tighter">Equipo Matecito</span>
                                <span className="text-[10px] text-[var(--foreground)] opacity-40 font-mono uppercase tracking-widest font-bold">Laboratorio de Ingeniería</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
}
