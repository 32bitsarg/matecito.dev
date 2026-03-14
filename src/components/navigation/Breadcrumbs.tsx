import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="flex py-2 px-6 md:px-0 relative z-20">
            <ol className="flex items-center space-x-2 font-mono text-[9px] uppercase tracking-widest text-zinc-600">
                <li className="flex items-center">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 group">
                        <Home className="w-2.5 h-2.5" />
                        <span className="group-hover:underline decoration-white/20 underline-offset-4">Home</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center space-x-2">
                        <ChevronRight className="w-2.5 h-2.5 text-zinc-800" />
                        <Link
                            href={item.href}
                            className={`transition-all hover:text-white group ${index === items.length - 1 ? "text-white font-bold" : "hover:underline decoration-white/20 underline-offset-4"
                                }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
