'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import pb from '@/lib/pocketbase'
import PocketBase, { BaseAuthStore } from 'pocketbase'
import { 
    Database, 
    Settings, 
    Plus, 
    Folder, 
    LayoutDashboard, 
    Code2, 
    Server,
    ShieldCheck,
    Cpu,
    ArrowLeft,
    Activity,
    Key,
    History,
    Zap,
    ChevronDown,
    ChevronUp,
    Lock,
    Shield,
    Users,
    ActivitySquare
} from 'lucide-react'
import WorkspaceSelector from '@/components/workspace-selector'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { ProjectService } from '@/services/pocketbase.service'
import { Collection } from '@/lib/types'

export default function Sidebar() {
    const pathname = usePathname()
    const params = useParams()
    const { workspaces, currentWorkspace, selectWorkspace, projects, refreshWorkspaces } = useWorkspace()

    const workspaceSlugFromParams = params?.workspaceSlug as string
    const projectSlug = params?.projectSlug as string
    const workspaceSlug = workspaceSlugFromParams || currentWorkspace?.slug

    const [projectMetadata, setProjectMetadata] = useState<any>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const fetchProjectContext = async () => {
            if (!projectSlug) {
                setProjectMetadata(null)
                return
            }

            try {
                const res = await pb.collection('projects').getFirstListItem(`subdomain = "${projectSlug}"`, {
                    expand: 'workspace',
                })
                setProjectMetadata(res)
            } catch (err) {
                console.error('Sidebar Context Error:', err)
            }
        }

        fetchProjectContext()
    }, [projectSlug])

    if (!mounted) return null

    const isProjectContext = !!projectSlug

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0a0a0a] border-r border-border/50 text-foreground h-screen sticky top-0 z-50 overflow-hidden">
            
            {/* Header Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {isProjectContext ? (
                    <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
                        {/* 1. Context Navigation Bar */}
                        <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                            <Link 
                                href="/dashboard"
                                className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-black text-muted uppercase tracking-[0.2em] hover:text-accent transition-all group"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                {currentWorkspace?.name || 'Workspace'}
                            </Link>
                        </div>

                        {/* 2. Project Branding */}
                        <div className="px-6 py-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                            <div className="flex items-center justify-between mb-1.5">
                                <h1 className="text-sm font-black truncate text-white uppercase tracking-wider">
                                    {projectMetadata?.name || projectSlug}
                                </h1>
                                <div className={cn(
                                    "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter",
                                    projectMetadata?.status === 'active' 
                                        ? "bg-accent/10 text-accent border border-accent/20" 
                                        : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                )}>
                                    {projectMetadata?.status || 'Active'}
                                </div>
                            </div>
                            <div className="text-[10px] text-muted font-mono truncate lowercase opacity-40 flex items-center gap-1.5">
                                <Zap className="w-2.5 h-2.5 text-accent" />
                                {projectSlug}.matecito.dev
                            </div>
                        </div>

                        {/* 3. Reorganized Navigation Actions */}
                        <nav className="flex-1 px-3 py-6 space-y-7 overflow-y-auto custom-scrollbar pb-10">
                            
                            {/* TOP LEVEL: OVERVIEW */}
                            <div className="space-y-1">
                                <SidebarLink 
                                    href={`/dashboard/${workspaceSlug}/${projectSlug}`} 
                                    active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}`}
                                    icon={LayoutDashboard}
                                    label="Overview"
                                />
                                <SidebarLink 
                                    href={`/dashboard/${workspaceSlug}/${projectSlug}/connect`} 
                                    active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/connect`}
                                    icon={Zap}
                                    label="Connect"
                                />
                            </div>

                            {/* CATEGORY: DATA MANAGEMENT */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] uppercase font-black text-muted tracking-[0.2em] opacity-40">Data Management</span>
                                </div>
                                <div className="space-y-0.5">
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/schema`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/schema`}
                                        icon={Database}
                                        label="Data Schema"
                                    />
                                     <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/security`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/security`}
                                        icon={Lock}
                                        label="API Rules"
                                    />
                                </div>
                            </div>

                            {/* CATEGORY: AUTH & IDENTITY */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] uppercase font-black text-muted tracking-[0.2em] opacity-40">Auth & Identity</span>
                                </div>
                                <div className="space-y-0.5">
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/auth`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/auth`}
                                        icon={Users}
                                        label="Users Management"
                                    />
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/auth/providers`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/auth/providers`}
                                        icon={Key}
                                        label="OAuth2 Providers"
                                    />
                                </div>
                            </div>

                            {/* CATEGORY: ASSETS */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] uppercase font-black text-muted tracking-[0.2em] opacity-40">Assets</span>
                                </div>
                                <div className="space-y-0.5">
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/storage`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/storage`}
                                        icon={Folder}
                                        label="Storage Gallery"
                                    />
                                </div>
                            </div>

                            {/* CATEGORY: ENGINEERING TOOLS */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] uppercase font-black text-muted tracking-[0.2em] opacity-40">System Tools</span>
                                </div>
                                <div className="space-y-0.5">
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/api`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/api`}
                                        icon={Code2}
                                        label="API Explorer"
                                    />
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/logs`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/logs`}
                                        icon={ActivitySquare}
                                        label="Live Logs"
                                    />
                                </div>
                            </div>

                            {/* CATEGORY: OPERATIONS */}
                            <div className="space-y-1">
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] uppercase font-black text-muted tracking-[0.2em] opacity-40">Operations</span>
                                </div>
                                <div className="space-y-0.5">
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/backups`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/backups`}
                                        icon={History}
                                        label="Backups"
                                    />
                                    <SidebarLink 
                                        href={`/dashboard/${workspaceSlug}/${projectSlug}/settings`} 
                                        active={pathname === `/dashboard/${workspaceSlug}/${projectSlug}/settings`}
                                        icon={Settings}
                                        label="Settings"
                                    />
                                </div>
                            </div>

                        </nav>
                    </div>
                ) : (
                    /* GLOBAL WORKSPACE CONTEXT */
                    <div className="flex-1 flex flex-col animate-in fade-in duration-500 p-4 space-y-6">
                        {/* Selector */}
                        <div className="mb-4">
                            <WorkspaceSelector
                                workspaces={workspaces}
                                current={currentWorkspace}
                                onSelect={selectWorkspace}
                                onRefresh={refreshWorkspaces}
                            />
                        </div>

                        {/* Projects list */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                           <div className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center justify-between">
                               <span>Projects</span>
                               <button 
                                   onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                                   className="p-1 hover:bg-accent/10 hover:text-accent rounded transition-all active:scale-90"
                               >
                                   <Plus className="w-4 h-4" />
                               </button>
                           </div>
                           <nav className="space-y-0.5">
                               {projects.length > 0 ? (
                                   projects.map((p) => (
                                       <Link
                                            key={p.id}
                                            href={`/dashboard/${workspaceSlug}/${p.subdomain}`}
                                            className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                                       >
                                           <div className="flex items-center gap-3 truncate">
                                               <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                   <Folder className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                                               </div>
                                               <span className="text-xs font-bold truncate group-hover:text-white transition-colors">{p.name}</span>
                                           </div>
                                           <div className={cn(
                                               "w-1.5 h-1.5 rounded-full shrink-0",
                                               p.status === 'active' ? "bg-accent/40 group-hover:bg-accent" : "bg-yellow-500/40"
                                           )} />
                                       </Link>
                                   ))
                               ) : (
                                    <div className="px-3 py-10 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-white/[0.01]">
                                         <p className="text-[10px] text-muted italic mb-4 font-mono">Clean Slate</p>
                                         <button 
                                            onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                                            className="text-[10px] bg-accent/10 text-accent font-black px-4 py-2 rounded-xl border border-accent/20 uppercase tracking-[0.2em] hover:bg-accent hover:text-background transition-all"
                                        >
                                            Create Project
                                        </button>
                                    </div>
                                )}
                           </nav>
                        </div>
                    </div>
                )}
            </div>

        </aside>
    )
}

function SidebarLink({ href, active, icon: Icon, label, disabled = false }: any) {
    if (disabled) {
        return (
            <div className="flex items-center gap-3 px-3 py-2 text-xs text-muted/20 cursor-not-allowed select-none">
                <Icon className="w-4 h-4 shrink-0 opacity-20" />
                <span className="font-medium tracking-tight">{label}</span>
                <span className="ml-auto text-[7px] border border-white/5 px-1 rounded-sm opacity-30 font-black">COMING</span>
            </div>
        )
    }

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all group relative overflow-hidden",
                active 
                    ? "text-accent bg-accent/5 font-black border border-accent/20 shadow-[0_4px_20px_rgba(55,255,208,0.02)]" 
                    : "text-muted hover:text-white hover:bg-white/[0.02] border border-transparent font-bold"
            )}
        >
            <Icon className={cn(
                "w-4 h-4 shrink-0 transition-all",
                active ? "opacity-100 scale-110" : "opacity-40 group-hover:opacity-80"
            )} />
            <span className="truncate tracking-tight whitespace-nowrap">{label}</span>
            
            {active && (
                <div className="absolute right-3 w-1 h-1 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]" />
            )}
        </Link>
    )
}
