'use client'

import { useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Copy, 
    Check, 
    Eye, 
    EyeOff, 
    Globe, 
    Key, 
    ShieldCheck, 
    Terminal, 
    ChevronRight, 
    AlertTriangle, 
    Loader2 
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ConnectPage() {
    const { project } = useProject()
    const [revealAnon, setRevealAnon] = useState(false)
    const [revealService, setRevealService] = useState(false)
    const [activeTab, setActiveTab] = useState<'js' | 'rn' | 'flutter'>('js')

    if (!project) return null // No debería ocurrir por el layout

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copiado al portapapeles')
    }

    const projectUrl = `https://${project.subdomain}.matecito.dev`

    const envSnippet = `# .env.local
NEXT_PUBLIC_MATEBASE_URL=${projectUrl}
NEXT_PUBLIC_MATEBASE_ANON_KEY=${project.anon_key}
MATEBASE_SERVICE_KEY=${project.service_key}`

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Conectar</h1>
                <p className="text-muted text-sm mt-2">Configurá tu aplicación para interactuar con tu instancia de Matebase.</p>
            </div>

            {/* API Keys & URL */}
            <div className="grid gap-6">
                
                {/* Project URL */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-4 h-4 text-accent" />
                        <span className="text-xs font-black uppercase tracking-widest text-muted">Project URL</span>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            readOnly 
                            value={projectUrl}
                            className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:outline-none"
                        />
                        <button 
                            onClick={() => copyToClipboard(projectUrl, 'url')}
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all active:scale-95"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Anon Key */}
                <div className="p-6 bg-white/[0.02] border border-white/5 border-l-[#3ECF8E]/40 border-l-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-[#3ECF8E]" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted">Anon Key</span>
                        </div>
                        <span className="text-[10px] bg-[#3ECF8E]/10 text-[#3ECF8E] px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-[#3ECF8E]/20">Client Safe</span>
                    </div>
                    <p className="text-xs text-muted/60 mb-4">Usala en tu frontend — segura para el cliente.</p>
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <input 
                                readOnly 
                                type={revealAnon ? "text" : "password"}
                                value={project.anon_key || 'mb_anon_••••••••••'}
                                className="w-full bg-black/40 border border-white/5 rounded-xl pl-4 pr-12 py-3 text-sm font-mono text-white/80 focus:outline-none"
                            />
                            <button 
                                onClick={() => setRevealAnon(!revealAnon)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg text-muted/60 hover:text-white transition-all"
                            >
                                {revealAnon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(project.anon_key || '', 'anon')}
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all active:scale-95"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                        <span className="text-[10px] text-[#3ECF8E]/80 font-medium">Podés incluirla en NEXT_PUBLIC_ variables de entorno</span>
                    </div>
                </div>

                {/* Service Key */}
                <div className="p-6 bg-white/[0.02] border border-white/5 border-l-[#ef4444]/40 border-l-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted">Service Key</span>
                        </div>
                        <span className="text-[10px] bg-[#ef4444]/10 text-[#ef4444] px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-[#ef4444]/20">Server Only</span>
                    </div>
                    <p className="text-xs text-muted/60 mb-4">Solo para el servidor — nunca en el frontend.</p>
                    <div className="flex gap-2">
                        <div className="relative flex-1 group">
                            <input 
                                readOnly 
                                type={revealService ? "text" : "password"}
                                value={project.service_key || 'mb_sk_••••••••••'}
                                className="w-full bg-black/40 border border-white/5 rounded-xl pl-4 pr-12 py-3 text-sm font-mono text-white/80 focus:outline-none"
                            />
                            <button 
                                onClick={() => setRevealService(!revealService)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg text-muted/60 hover:text-white transition-all"
                            >
                                {revealService ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(project.service_key || '', 'service')}
                            className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all active:scale-95"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="mt-4 p-3 bg-[#ef4444]/5 border border-[#ef4444]/10 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                        <span className="text-[10px] text-[#ef4444] font-black uppercase tracking-widest leading-none">⚠️ Nunca expongas esta key en el código del cliente</span>
                    </div>
                </div>
            </div>

            {/* Environment Variables */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted">Variables de entorno</h2>
                    <button 
                         onClick={() => copyToClipboard(envSnippet, 'env')}
                         className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#3ECF8E] hover:text-white transition-all bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 px-3 py-1.5 rounded-lg active:scale-95"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar todo
                    </button>
                </div>
                <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden p-6 relative group">
                    <pre className="text-xs font-mono text-white/40 leading-relaxed">
                        <span className="text-muted/40"># .env.local</span>{'\n'}
                        <span className="text-accent">NEXT_PUBLIC_MATEBASE_URL</span>={projectUrl}{'\n'}
                        <span className="text-accent">NEXT_PUBLIC_MATEBASE_ANON_KEY</span>={project.anon_key}{'\n'}
                        <span className="text-[#ef4444]/80">MATEBASE_SERVICE_KEY</span>={project.service_key}
                    </pre>
                </div>
            </div>

            {/* Quick Start Tabs */}
            <div className="space-y-6">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted text-center pt-10">Quick Start</h2>
                
                {/* Tabs Selector */}
                <div className="flex items-center justify-center p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit mx-auto">
                    {[
                        { id: 'js', label: 'JavaScript' },
                        { id: 'rn', label: 'React Native' },
                        { id: 'flutter', label: 'Flutter' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                activeTab === tab.id 
                                    ? "bg-accent text-background shadow-[0_0_20px_rgba(55,255,208,0.2)]" 
                                    : "text-muted hover:text-white"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-[#050505] border border-white/5 rounded-3xl overflow-hidden">
                    <div className="px-6 py-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                         <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                         </div>
                         <Terminal className="w-4 h-4 text-white/20" />
                    </div>
                    <div className="p-8">
                        {activeTab === 'js' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <CodeBlock 
                                    command="npm install matecitodb" 
                                    onCopy={() => copyToClipboard('npm install matecitodb', 'js-install')} 
                                />
                                <div className="space-y-3">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted/60">lib/db.ts</p>
                                    <pre className="text-xs font-mono text-white/70 bg-black/40 p-5 rounded-2xl border border-white/5 leading-relaxed">
{`import { createClient } from 'matecitodb'

export const db = createClient(
  process.env.NEXT_PUBLIC_MATEBASE_URL!,
  { anonKey: process.env.NEXT_PUBLIC_MATEBASE_ANON_KEY! }
)

// Listar datos
const { data, total } = await db.from('posts').eq('activo', true).get()`}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rn' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <CodeBlock 
                                    command="npm install matecitodb-rn" 
                                    onCopy={() => copyToClipboard('npm install matecitodb-rn', 'rn-install')} 
                                />
                                <div className="space-y-3">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted/60">App.js</p>
                                    <pre className="text-xs font-mono text-white/70 bg-black/40 p-5 rounded-2xl border border-white/5 leading-relaxed">
{`import { createClient } from 'matecitodb-rn'

const db = createClient('${projectUrl}', {
  anonKey: '${project.anon_key}'
})

await db.auth.initialize() // llamar al inicio de la app
const { data } = await db.from('posts').get()`}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {activeTab === 'flutter' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <CodeBlock 
                                    command="flutter pub add matecitodb_flutter" 
                                    onCopy={() => copyToClipboard('flutter pub add matecitodb_flutter', 'flutter-install')} 
                                />
                                <div className="space-y-3">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted/60">main.dart</p>
                                    <pre className="text-xs font-mono text-white/70 bg-black/40 p-5 rounded-2xl border border-white/5 leading-relaxed">
{`import 'package:matecitodb_flutter/matecitodb.dart';

final db = MatecitoDB.createClient(
  '${projectUrl}',
  anonKey: '${project.anon_key}',
);

await db.auth.initialize();
final result = await db.from('posts').get();`}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-20 border-t border-white/5">
                <div className="p-8 bg-[#EF4444]/[0.02] border border-[#EF4444]/20 border-dashed rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#EF4444]">Zona de peligro</h3>
                        <p className="text-xs text-muted/60 mt-1">Si comprometiste tus claves, regeneralas para invalidar las actuales.</p>
                    </div>
                    <button 
                        onClick={async () => {
                            if (window.confirm('¿Regenerar las keys? Las keys actuales dejarán de funcionar inmediatamente.')) {
                                const handleRegen = async () => {
                                    // Obtenemos el token actual del usuario para autorizar el update en PB Central
                                    const pb = (await import('@/lib/pocketbase')).default
                                    const token = pb.authStore.token

                                    const res = await fetch('/api/projects/regenerate-keys', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            projectId: project.id,
                                            subdomain: project.subdomain,
                                            token: token
                                        })
                                    })

                                    const data = await res.json()
                                    if (!data.success) throw new Error(data.error)
                                    
                                    // Hack: un refresco de página forzado asegura que todo el dashboard (Contexto, etc) 
                                    // se sincronice con las nuevas keys del DB sin lógica compleja de mutación manual.
                                    window.location.reload()
                                    return data
                                }

                                toast.promise(
                                    handleRegen(),
                                    {
                                        loading: 'Regenerando keys...',
                                        success: 'Keys regeneradas correctamente. Recargando...',
                                        error: (err) => `Error: ${err.message}`,
                                    }
                                )
                            }
                        }}
                        className="flex items-center gap-2 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white transition-all px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Regenerar API Keys
                    </button>
                </div>
            </div>
        </div>
    )
}

function CodeBlock({ command, onCopy }: { command: string, onCopy: () => void }) {
    return (
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 group">
            <ChevronRight className="w-4 h-4 text-accent" />
            <code className="text-xs font-mono text-white/80 flex-1">{command}</code>
            <button 
                onClick={onCopy}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-xl transition-all"
            >
                <Copy className="w-3.5 h-3.5 text-muted" />
            </button>
        </div>
    )
}
