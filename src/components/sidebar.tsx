'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import {
    Database, Settings, Plus, Folder, LayoutDashboard,
    Code2, ArrowLeft, Users, Shield, Terminal, LogOut, ChevronDown, FlaskConical,
    Table2, UserCircle, Mail, Webhook
} from 'lucide-react'
import WorkspaceSelector from '@/components/workspace-selector'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/contexts/WorkspaceContext'

export default function Sidebar() {
    const pathname = usePathname()
    const params = useParams()
    const { workspaces, currentWorkspace, setCurrentWorkspace, projects, refreshWorkspaces, user, logout } = useWorkspace()

    const workspaceSlug = (params?.workspace as string) || currentWorkspace?.slug
    const projectSlug = params?.project as string
    const [mounted, setMounted] = useState(false)
    const projectMetadata = projects.find(p => p.subdomain === projectSlug) ?? null

    useEffect(() => { setMounted(true) }, [])
    if (!mounted) return null

    const isProjectContext = !!projectSlug
    const base = `/dashboard/${workspaceSlug}/${projectSlug}`

    const handleLogout = async () => {
        await logout?.()
    }

    return (
        <aside className="w-60 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 z-50">

            {/* Logo/Brand */}
            <div className="h-14 flex items-center px-5 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
                        <Database className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight text-sm">matecitodb</span>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {isProjectContext ? (
                    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                        {/* Back + Project name */}
                        <div className="px-4 py-3 border-b border-slate-100">
                            <Link href="/dashboard"
                                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-600 transition-colors mb-3 group">
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                                Todos los proyectos
                            </Link>
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 truncate">{workspaceSlug}</p>
                                    <h2 className="text-sm font-bold text-slate-900 truncate">
                                        {projectMetadata?.name || projectSlug}
                                    </h2>
                                </div>
                                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md shrink-0 ml-2">
                                    Live
                                </span>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto pb-20">
                            <div className="space-y-0.5">
                                <SidebarLink href={base} active={pathname === base}
                                    icon={LayoutDashboard} label="Resumen" />
                            </div>

                            <NavSection label="Datos">
                                <SidebarLink href={`${base}/data`} active={pathname.startsWith(`${base}/data`)}
                                    icon={Table2} label="Registros" />
                                <SidebarLink href={`${base}/schema`} active={pathname.startsWith(`${base}/schema`)}
                                    icon={Database} label="Esquema" />
                                <SidebarLink href={`${base}/api`} active={pathname.startsWith(`${base}/api`)}
                                    icon={Code2} label="API Explorer" />
                                <SidebarLink href={`${base}/sql`} active={pathname.startsWith(`${base}/sql`)}
                                    icon={FlaskConical} label="SQL Editor" />
                            </NavSection>

                            <NavSection label="Usuarios">
                                <SidebarLink href={`${base}/auth`} active={pathname.startsWith(`${base}/auth`)}
                                    icon={Users} label="Usuarios" />
                            </NavSection>

                            <NavSection label="Archivos">
                                <SidebarLink href={`${base}/storage`} active={pathname.startsWith(`${base}/storage`)}
                                    icon={Folder} label="Storage" />
                                <SidebarLink href={`${base}/emails`} active={pathname.startsWith(`${base}/emails`)}
                                    icon={Mail} label="Emails" />
                            </NavSection>

                            <NavSection label="Proyecto">
                                <SidebarLink href={`${base}/logs`} active={pathname.startsWith(`${base}/logs`)}
                                    icon={Terminal} label="Logs" />
                                <SidebarLink href={`${base}/webhooks`} active={pathname.startsWith(`${base}/webhooks`)}
                                    icon={Webhook} label="Webhooks" />
                                <SidebarLink href={`${base}/security`} active={pathname.startsWith(`${base}/security`)}
                                    icon={Shield} label="Permisos" />
                                <SidebarLink href={`${base}/connect`} active={pathname.startsWith(`${base}/connect`)}
                                    icon={Code2} label="Conexión & Keys" />
                                <SidebarLink href={`${base}/settings`} active={pathname.startsWith(`${base}/settings`)}
                                    icon={Settings} label="Configuración" />
                            </NavSection>
                        </nav>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
                        <WorkspaceSelector
                            workspaces={workspaces}
                            current={currentWorkspace}
                            onSelect={setCurrentWorkspace}
                            onRefresh={refreshWorkspaces}
                        />
                        {/* Workspace links */}
                        <div className="px-1 mb-3 space-y-0.5">
                            <Link href={`/dashboard/${workspaceSlug}/members`}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all outline-none",
                                    pathname === `/dashboard/${workspaceSlug}/members`
                                        ? "bg-violet-50 text-violet-700 font-semibold"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}>
                                <Users className={cn("w-4 h-4 shrink-0", pathname === `/dashboard/${workspaceSlug}/members` ? "text-violet-600" : "text-slate-400")} />
                                <span className="truncate">Equipo</span>
                            </Link>

                            <Link href={`/dashboard/${workspaceSlug}/settings`}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all outline-none",
                                    pathname === `/dashboard/${workspaceSlug}/settings`
                                        ? "bg-violet-50 text-violet-700 font-semibold"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}>
                                <Settings className={cn("w-4 h-4 shrink-0", pathname === `/dashboard/${workspaceSlug}/settings` ? "text-violet-600" : "text-slate-400")} />
                                <span className="truncate">Configuración</span>
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="flex items-center justify-between px-1 mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proyectos</span>
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                                    className="p-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-all">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <nav className="space-y-0.5">
                                {projects.length > 0 ? (
                                    projects.map(p => (
                                        <Link key={p.id}
                                            href={`/dashboard/${workspaceSlug}/${p.subdomain}`}
                                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-all group">
                                            <div className="flex items-center gap-2.5 truncate">
                                                <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-200 transition-colors">
                                                    <Database className="w-3 h-3 text-violet-600" />
                                                </div>
                                                <span className="truncate">{p.name}</span>
                                            </div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="px-3 py-8 flex flex-col items-center text-center gap-3">
                                        <p className="text-xs text-slate-400 italic">Sin proyectos aún</p>
                                        <button
                                            onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                                            className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                                            + Crear proyecto
                                        </button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer: user */}
            {user && (
                <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-2">
                    <Link href="/dashboard/profile" className="flex items-center gap-2 min-w-0 flex-1 group">
                        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-[10px] font-bold shrink-0 group-hover:bg-violet-200 transition-colors">
                            {(user.name || user.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-violet-700 transition-colors">{user.name || user.email}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                    </Link>
                    <button onClick={handleLogout}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                        title="Cerrar sesión">
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </aside>
    )
}

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-0.5">
            <p className="px-3 mb-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            {children}
        </div>
    )
}

function SidebarLink({ href, active, icon: Icon, label }: {
    href: string; active: boolean; icon: any; label: string
}) {
    return (
        <Link href={href} className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
            active
                ? "bg-violet-50 text-violet-700 font-semibold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        )}>
            <Icon className={cn("w-4 h-4 shrink-0", active ? "text-violet-600" : "text-slate-400")} />
            <span className="truncate">{label}</span>
            {active && <div className="ml-auto w-1 h-4 rounded-full bg-violet-500" />}
        </Link>
    )
}
