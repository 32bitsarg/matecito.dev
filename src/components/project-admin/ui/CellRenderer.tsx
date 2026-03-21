'use client'

import { cn } from '@/lib/utils';
import { useProject } from '@/contexts/ProjectContext';
import { FileIcon, ImageIcon, ExternalLink, Code, Lock } from 'lucide-react';

interface CellRendererProps {
    value: any;
    type: string;
    fieldName: string;
    record: any;
}

export default function CellRenderer({ value, type, record }: CellRendererProps) {
    const { getFileUrl } = useProject();

    if (value === null || value === undefined || value === '') {
        return <span className="text-[#52525b]">-</span>;
    }

    switch (type) {
        case 'bool':
            return (
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase ring-1 ring-inset",
                    value 
                        ? "bg-accent/10 text-accent ring-accent/20" 
                        : "bg-red-500/10 text-red-500 ring-red-500/20"
                )}>
                    {value ? 'True' : 'False'}
                </span>
            );

        case 'date':
            return <span className="text-xs font-mono text-[#a1a1aa]">{new Date(value).toLocaleDateString()}</span>;

        case 'url':
            return (
                <a 
                    href={value} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-accent hover:underline truncate flex items-center gap-1.5 max-w-full group"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="truncate">{value}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            );

        case 'email':
            return <span className="text-blue-300 italic text-xs">{value}</span>;

        case 'json':
            return (
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10 w-fit group">
                    <Code className="w-3 h-3 text-muted/40 group-hover:text-accent transition-colors" />
                    <span className="text-[10px] text-muted group-hover:text-white transition-colors">JSON Data</span>
                </div>
            );

        case 'file':
            const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value);
            if (isImage) {
                const url = getFileUrl(record, value, { thumb: '100x100' });
                return (
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border group/img">
                        <img 
                            src={url} 
                            alt={value} 
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                        />
                    </div>
                );
            }
            return (
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10 w-fit">
                    <FileIcon className="w-3 h-3 text-muted/40" />
                    <span className="text-[10px] text-muted truncate max-w-[100px]">{value}</span>
                </div>
            );
        
        case 'password':
            return (
                <div className="flex items-center gap-2 opacity-30 select-none">
                    <Lock className="w-3 h-3" />
                    <span className="tracking-widest">••••••••</span>
                </div>
            )

        default:
            const content = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return <span className="text-xs text-white/80 truncate inline-block max-w-full" title={content}>{content}</span>;
    }
}
