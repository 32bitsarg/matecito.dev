'use client'

import { cn } from '@/lib/utils';
import { FilePlus, Eye, EyeOff, Code, FileText } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const JsonEditorComponent = dynamic(() => import('./JsonEditor'), { 
    ssr: false,
    loading: () => <div className="p-8 text-center bg-black/20 rounded-xl animate-pulse text-[10px] text-muted uppercase font-black">Cargando Editor...</div>
});

interface FieldInputProps {
    field: any;
    value: any;
    onChange: (value: any) => void;
}

export default function FieldInput({ field, value, onChange }: FieldInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const baseClasses = "w-full bg-black/40 border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:border-accent/50 outline-none transition-all placeholder:text-muted/30 shadow-inner";

    switch (field.type) {
        case 'bool':
            return (
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-border/50 cursor-pointer hover:bg-white/[0.04] transition-all group">
                    <span className="text-xs font-bold text-muted group-hover:text-white transition-colors">
                        Activo / Habilitado
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => onChange(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                    </div>
                </label>
            );

        case 'number':
            return (
                <input
                    type="number"
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className={baseClasses}
                    placeholder="0"
                />
            );

        case 'date':
            return (
                <input
                    type="datetime-local"
                    value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseClasses}
                />
            );

        case 'password':
            return (
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(baseClasses, "pr-10")}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            );

        case 'json':
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <Code className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">JSON Object</span>
                    </div>
                    <JsonEditorComponent 
                        value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''} 
                        onChange={onChange}
                    />
                </div>
            );

        case 'editor':
            return (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <FileText className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Rich Text / Markdown</span>
                    </div>
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(baseClasses, "min-h-[150px] leading-relaxed resize-y")}
                        placeholder="Escribe contenido enriquecido aquí..."
                    />
                </div>
            );

        case 'file':
            return (
                <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-black/20 hover:bg-black/40 hover:border-accent/40 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FilePlus className="w-8 h-8 text-muted group-hover:text-accent mb-3 transition-colors" />
                            <p className="text-xs text-muted font-bold group-hover:text-white transition-colors">
                                {value ? (value instanceof File ? value.name : 'Archivo seleccionado') : 'Haz clic para subir un archivo'}
                            </p>
                            <p className="text-[10px] text-muted/40 mt-1 uppercase tracking-tighter">PNG, JPG, PDF (Max 5MB)</p>
                        </div>
                        <input 
                            type="file" 
                            className="hidden" 
                            multiple={field.maxSelect > 1}
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    onChange(field.maxSelect === 1 ? files[0] : files);
                                }
                            }}
                        />
                    </label>
                    {value && (
                         <div className="flex items-center gap-2 text-[10px] text-accent font-mono bg-accent/5 p-2 rounded-lg border border-accent/10 truncate">
                            📎 {value instanceof File ? value.name : typeof value === 'string' ? value : 'Cargado'}
                         </div>
                    )}
                </div>
            );

        case 'select':
            return (
                <select 
                    value={value || ''} 
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(baseClasses, "appearance-none cursor-pointer")}
                >
                    <option value="" disabled className="bg-card text-muted">Seleccionar opción...</option>
                    {field.options?.values?.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-card text-white">{opt}</option>
                    ))}
                </select>
            );

        default:
            return (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseClasses}
                    placeholder={`Ingresa ${field.name}...`}
                />
            );
    }
}
