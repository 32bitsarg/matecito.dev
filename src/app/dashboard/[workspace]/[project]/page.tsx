'use client'

import { useProject } from '@/contexts/ProjectContext'
import { Database, Settings, Activity, Globe, Users, Folder, Code2, Copy, ChevronRight, ArrowUpRight, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProjectOverview() {
    const { collections, loading, project, fetchStats, projectId } = useProject()
    const [stats, setStats] = useState<any>(null)
    const { workspace, project: projectSlug } = useParams()
    const base = `/dashboard/${workspace}/${projectSlug}`

    useEffect(() => {
        if (!projectId) return
        fetchStats().then(setStats).catch(console.error)
    }, [projectId])

    const copy = (text?: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success('Copiado')
    }

    const projectUrl = `https://${project?.subdomain ?? projectSlug}.matecito.dev`

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">

            {/* Header */}
            <div className="flex items-end justify-between pb-6 border-b border-slate-200">
                <div>
                    <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                        <span>{workspace}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>Overview</span>
                    </p>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {project?.name || projectSlug}
                    </h1>
                </div>
                <Link href={`${base}/settings`}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition-colors">
                    <Settings className="w-4 h-4" />
                    Configuración
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Usuarios" value={stats?.users_count ?? '—'} icon={Users} color="text-blue-600" bg="bg-blue-50" href={`${base}/auth`} />
                <StatCard label="Colecciones" value={stats?.collections_count ?? collections.length} icon={Database} color="text-violet-600" bg="bg-violet-50" href={`${base}/schema`} />
                <StatCard label="Registros" value={stats?.records_count ?? '—'} icon={BarChart3} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="DB Size" value={stats?.db_size ?? '—'} icon={Activity} color="text-amber-600" bg="bg-amber-50" />
            </div>

            {/* Quick links */}
            <div className="grid md:grid-cols-3 gap-4">
                <QuickCard icon={Globe} label="URL del Proyecto" value={projectUrl} onCopy={() => copy(projectUrl)} />
                <QuickCard icon={Code2} label="Anon Key" value={project?.anon_key ? '••••••••••••••••' : 'Cargando...'} onCopy={() => copy(project?.anon_key)} tag="Client" tagColor="text-emerald-600 bg-emerald-50 border-emerald-200" />
                <QuickCard icon={Code2} label="Service Key" value="••••••••••••••••" onCopy={() => toast.error('No copies esta key en el frontend 🚨')} tag="Secret" tagColor="text-red-600 bg-red-50 border-red-200" />
            </div>

            {/* Collections */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700">Colecciones</h3>
                    <Link href={`${base}/schema`} className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                        Gestionar <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-slate-400">Cargando...</div>
                ) : collections.length === 0 ? (
                    <div className="p-12 text-center">
                        <Database className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Sin colecciones. <Link href={`${base}/schema`} className="text-violet-600 hover:underline">Crear una</Link></p>
                    </div>
                ) : (
                    collections.map(col => (
                        <div key={col.name} className="flex items-center gap-4 px-6 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                                <Database className="w-3.5 h-3.5 text-violet-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-800 font-mono flex-1">{col.name}</span>
                            <span className="text-xs text-slate-400">{col.records_count ?? 0} registros</span>
                            <span className="text-xs text-slate-300">{col.fields?.length ?? 0} campos</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color, bg, href }: any) {
    const content = (
        <div className={cn(
            "bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm transition-all",
            href && "hover:border-violet-300 hover:shadow-md cursor-pointer"
        )}>
            <div>
                <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                <p className={cn("text-2xl font-extrabold", color)}>{value}</p>
            </div>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
            </div>
        </div>
    )
    return href ? <Link href={href}>{content}</Link> : content
}

function QuickCard({ icon: Icon, label, value, onCopy, tag, tagColor }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600">{label}</span>
                </div>
                {tag && (
                    <span className={cn("text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border", tagColor)}>
                        {tag}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2">
                <code className="text-xs text-slate-600 font-mono flex-1 truncate bg-slate-50 px-3 py-2 rounded-lg">
                    {value}
                </code>
                <button onClick={onCopy}
                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                    <Copy className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}
