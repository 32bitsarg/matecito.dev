'use client'

import { useProject } from '@/contexts/ProjectContext'
import { 
    Rocket, 
    Database, 
    Settings, 
    ShieldCheck, 
    Copy, 
    ExternalLink, 
    Activity, 
    Cpu, 
    Globe,
    ChevronRight,
    Terminal,
    Code2,
    Users,
    Folder,
    Lock,
    Server,
    Shield,
    ShieldAlert
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProjectOverview() {
    const { collections, loading, error, fetchCollections } = useProject()
    const { workspaceSlug, projectSlug } = useParams()
    const baseUrl = `/dashboard/${workspaceSlug}/${projectSlug}`
    const projectUrl = `${projectSlug}.matecito.dev`

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copiado al portapapeles')
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                        <span>Workspace</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>Project</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
                        {projectSlug}
                        <span className="text-accent">.matebase</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent/5 border border-accent/10">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-black text-accent uppercase tracking-widest">Instance Online</span>
                    </div>
                    <a 
                        href={`https://${projectUrl}`} 
                        target="_blank" 
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-white transition-all shadow-sm"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Infrastructure Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InfrastructureCard 
                    label="Endpoint URL" 
                    value={`https://${projectUrl}`} 
                    icon={Globe} 
                    onAction={() => copyToClipboard(`https://${projectUrl}`)}
                    color="text-blue-400"
                />
                <InfrastructureCard 
                    label="Cloud Engine" 
                    value="v0.36.7-stable" 
                    icon={Cpu} 
                    color="text-purple-400"
                />
                <InfrastructureCard 
                    label="Active Subscriptions" 
                    value="Realtime" 
                    icon={Activity} 
                    color="text-accent"
                />
                <InfrastructureCard 
                    label="Auto Backups" 
                    value="Enabled" 
                    icon={ShieldCheck} 
                    color="text-green-400"
                />
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Growth & Tools */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* BaaS Modules Quick Access */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted">Core Modules</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <ModuleCard 
                                href={`${baseUrl}/auth`}
                                title="Auth & Identity"
                                count="Users"
                                description="Manage app users, roles and OAuth2 providers."
                                icon={Users}
                                color="text-indigo-400"
                                delay="delay-75"
                            />
                            <ModuleCard 
                                href={`${baseUrl}/storage`}
                                title="Storage Gallery"
                                count="Files"
                                description="Unified asset management with auto-thumbnails."
                                icon={Folder}
                                color="text-orange-400"
                                delay="delay-100"
                            />
                            <ModuleCard 
                                href={`${baseUrl}/security`}
                                title="API Security"
                                count="Rules"
                                description="Configure list, view and write permissions."
                                icon={Lock}
                                color="text-red-400"
                                delay="delay-150"
                            />
                            <ModuleCard 
                                href={`${baseUrl}/logs`}
                                title="Live Operations"
                                count="Logs"
                                description="Real-time request stream and error tracking."
                                icon={Server}
                                color="text-accent"
                                delay="delay-200"
                            />
                        </div>
                    </section>

                    {/* Sequence Explorer Preview */}
                    <section className="bg-card/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                        <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted">Sequence Explorer</h3>
                            <Link href={`${baseUrl}/schema`} className="text-[10px] text-accent font-black hover:underline uppercase tracking-tighter">Edit Schema</Link>
                        </div>
                        <div className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="p-6 animate-pulse h-20 bg-white/[0.01]" />
                                ))
                            ) : error ? (
                                <div className="p-20 text-center space-y-4">
                                    <ShieldAlert className="w-12 h-12 mx-auto text-red-500/50" />
                                    <p className="text-sm font-bold text-red-400">Error de conexión</p>
                                    <p className="text-[10px] text-muted/60 uppercase font-mono max-w-xs mx-auto">{error}</p>
                                    <button 
                                        onClick={() => fetchCollections()}
                                        className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-accent hover:bg-accent/10 transition-all"
                                    >
                                        Reintentar Conexión
                                    </button>
                                </div>
                            ) : collections.length > 0 ? (
                                collections.slice(0, 5).map(col => (
                                    <Link 
                                        key={col.id} 
                                        href={`${baseUrl}/${col.name}`}
                                        className="flex items-center justify-between p-6 hover:bg-white/[0.04] transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent/30 transition-all shadow-inner">
                                                <Database className="w-5 h-5 text-muted group-hover:text-accent" />
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-white group-hover:text-accent transition-colors">{col.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-[10px] text-muted/50 font-mono font-black uppercase tracking-widest">
                                                        {col.type === 'auth' ? 'Auth / Identity' : 'Data Sequence'}
                                                    </p>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <p className="text-[10px] text-muted/30 font-mono italic">
                                                        {col.fields.length} fields defined
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {col.listRule === "" && <div className="p-1 px-2 rounded-md bg-red-500/10 text-red-500 text-[8px] font-black uppercase">Public</div>}
                                            <ChevronRight className="w-5 h-5 text-muted opacity-0 group-hover:opacity-100 transition-all translate-x-1" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-20 text-center space-y-6 opacity-30">
                                    <Database className="w-12 h-12 mx-auto" />
                                    <p className="text-xs font-black uppercase tracking-widest">No sequences initialised</p>
                                    <Link href={`${baseUrl}/schema`} className="inline-block px-8 py-3 bg-accent text-background text-[10px] font-black uppercase rounded-2xl tracking-[0.2em]">Create First Sequence</Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Integration & Status */}
                <div className="space-y-8">
                    {/* API Status */}
                    <div className="bg-card/20 border border-white/5 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all">
                             <Shield size={160} />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted relative z-10">Security Center</h3>
                        <div className="flex items-start gap-4 p-5 rounded-3xl bg-black/40 border border-white/5 relative z-10">
                            <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                            <div>
                                <p className="text-sm font-black text-white leading-none mb-1.5 uppercase tracking-tight">SSL Active</p>
                                <p className="text-[10px] text-muted/50 leading-relaxed font-mono">Auto-provisioned certificates are active for endpoint safety.</p>
                            </div>
                        </div>
                        <Link 
                            href={`${baseUrl}/security`}
                            className="block w-full text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-white hover:bg-white/10 transition-all"
                        >
                            Audit API Rules
                        </Link>
                    </div>

                    {/* Developer Shortcuts */}
                    <div className="space-y-4 px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-40">Developer SDK</h3>
                        <Link href={`${baseUrl}/api`} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group">
                             <div className="flex items-center gap-3">
                                 <Code2 className="w-4 h-4 text-accent" />
                                 <span className="text-xs font-bold text-white uppercase tracking-tight">API Explorer</span>
                             </div>
                             <ExternalLink className="w-3 h-3 text-muted group-hover:text-white transition-colors" />
                        </Link>
                    </div>

                    <div className="p-10 rounded-[2.5rem] border-2 border-dashed border-white/5 bg-accent/[0.02] flex flex-col items-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-3xl bg-accent/20 flex items-center justify-center shadow-lg shadow-accent/10">
                            <Rocket className="w-7 h-7 text-accent" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase tracking-tight">Deploying Apps?</p>
                            <p className="text-[10px] text-muted font-mono leading-relaxed">Check our docs to integrate Matebase in 3 minutes.</p>
                        </div>
                        <Link href="/docs" className="text-[10px] font-black text-accent hover:underline decoration-accent/30 uppercase tracking-widest">Read SDK Guide</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfrastructureCard({ label, value, icon: Icon, onAction, color }: any) {
    return (
        <div className="bg-card/20 border border-white/5 p-6 rounded-3xl flex flex-col gap-4 relative group hover:bg-white/[0.02] transition-all cursor-default">
            <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-lg bg-white/5", color)}>
                    <Icon className="w-4 h-4" />
                </div>
                {onAction && (
                    <button onClick={onAction} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-xl transition-all text-muted hover:text-white">
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
            <div>
                <p className="text-[9px] uppercase font-black tracking-widest text-muted/40 mb-1">{label}</p>
                <p className="text-sm font-black text-white truncate">{value}</p>
            </div>
        </div>
    )
}

function ModuleCard({ href, title, description, icon: Icon, color, delay, count }: any) {
    return (
        <Link href={href} className={cn("flex gap-5 p-6 rounded-[2rem] border border-white/5 bg-card/10 hover:bg-card/40 hover:border-accent/20 transition-all group animate-in slide-in-from-bottom-5 duration-700", delay)}>
            <div className={cn("w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-inner group-hover:shadow-accent/5", "bg-white/5 border border-white/5 group-hover:border-accent/20")}>
                <Icon className={cn("w-7 h-7", color)} />
            </div>
            <div className="space-y-1.5 py-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-black text-white text-base group-hover:text-accent transition-colors">{title}</h4>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] font-black text-muted/40 uppercase">{count}</span>
                </div>
                <p className="text-[11px] text-muted/60 leading-relaxed font-medium transition-colors group-hover:text-muted/80">{description}</p>
            </div>
        </Link>
    )
}
