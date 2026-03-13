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
        <div className="min-h-screen bg-black text-white relative selection:bg-zinc-800">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffff03_0%,transparent_50%)] pointer-events-none"></div>

            <article className="relative z-10 container mx-auto px-6 py-24 sm:py-32 max-w-3xl">
                {/* Navegación Superior */}
                <nav className="mb-16">
                    {backButton}
                </nav>

                <header className="flex flex-col gap-6 mb-20 border-l border-white/10 pl-8">
                    <div className="flex items-center gap-4 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                        <span>{post.category}</span>
                        <span className="w-4 h-px bg-zinc-800"></span>
                        <span>{new Date(post.published_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-semibold tracking-tighter leading-tight text-white text-balance">
                        {post.title}
                    </h1>

                    <p className="text-xl text-zinc-500 font-light leading-relaxed">
                        {post.excerpt}
                    </p>
                </header>

                <div className="prose prose-invert prose-zinc max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-16 mb-6 text-white tracking-tight" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-10 mb-4 text-white tracking-tight" {...props} />,
                            p: ({ node, ...props }) => <p className="text-zinc-400 text-lg leading-relaxed mb-6 font-light" {...props} />,
                            li: ({ node, ...props }) => <li className="text-zinc-400 text-lg mb-2 ml-4 list-disc font-light" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded-sm font-mono text-sm border border-white/5" {...props} />,
                            pre: ({ node, ...props }) => <pre className="bg-zinc-950 p-6 rounded-sm border border-white/5 overflow-x-auto my-8 font-mono text-sm" {...props} />,
                            a: ({ node, ...props }) => <a className="text-white underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all duration-300" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                <footer className="mt-32">
                    {/* Related Posts Section */}
                    {relatedPosts && relatedPosts.length > 0 && (
                        <div className="border-t border-white/10 pt-16 mb-24">
                            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600 block mb-12">Siguiente Lectura</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                {relatedPosts.map((rPost) => (
                                    <Link key={rPost.id} href={`/insights/${rPost.slug}`} className="group flex flex-col gap-4">
                                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{rPost.category}</span>
                                        <h4 className="text-xl font-medium tracking-tight group-hover:text-zinc-400 transition-colors leading-tight">
                                            {rPost.title}
                                        </h4>
                                        <p className="text-zinc-500 text-sm font-light line-clamp-2 leading-relaxed">
                                            {rPost.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navegación Inferior */}
                    <nav className="pt-12 border-t border-white/10 mb-16">
                        {backButton}
                    </nav>

                    <div className="flex flex-col gap-4 opacity-50">
                        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-[0.4em]">Publicado por</span>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-lg text-white">M</div>
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">Equipo Matecito</span>
                                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-tight">Departamento de Ingeniería</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </article>
        </div>
    );
}
