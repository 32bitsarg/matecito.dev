'use client'

import { useState } from 'react'
import { ChevronDown, Plus, Check, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkspaceSelectorProps {
    workspaces: any[]
    current: any
    onSelect: (ws: any) => void
    onRefresh: () => void
}

export default function WorkspaceSelector({ workspaces, current, onSelect, onRefresh }: WorkspaceSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-2 rounded-lg bg-sidebar border border-border px-3 py-2 text-xs font-bold text-white transition-all hover:border-accent/40 focus:outline-none group shadow-sm"
            >
                <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center shrink-0">
                    <LayoutGrid className="w-3 h-3 text-accent" />
                </div>
                <span className="truncate flex-1 text-left">{current?.name || 'Workspace'}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform text-muted opacity-60 group-hover:opacity-100", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl border border-border bg-sidebar p-1 shadow-2xl animate-in fade-in zoom-in duration-150 ring-1 ring-black/50">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {workspaces.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => {
                                        onSelect(ws)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                                        current?.id === ws.id ? "bg-accent/10 border border-accent/20" : "hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <span className={cn(current?.id === ws.id ? "text-accent font-bold" : "text-muted hover:text-white")}>
                                        {ws.name}
                                    </span>
                                    {current?.id === ws.id && <Check className="w-3.5 h-3.5 text-accent" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-1 border-t border-border pt-1">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    window.dispatchEvent(new CustomEvent('open-create-workspace-modal'))
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-accent font-bold hover:bg-accent/5 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Nuevo Workspace
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
