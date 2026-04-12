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
                className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-all hover:border-[var(--border-hover)] focus:outline-none group"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--fg-primary)',
                }}
            >
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--accent-soft)' }}>
                    <LayoutGrid className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                </div>
                <span className="truncate flex-1 text-left">{current?.name || 'Workspace'}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform opacity-60 group-hover:opacity-100", isOpen && "rotate-180")}
                    style={{ color: 'var(--fg-tertiary)' }} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-2 z-40 rounded-xl border p-1 shadow-lg animate-slide-up"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border)',
                        }}>
                        <div className="max-h-60 overflow-y-auto">
                            {workspaces.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => {
                                        onSelect(ws)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                                        current?.id === ws.id ? "font-medium" : "hover:bg-[var(--bg-secondary)]"
                                    )}
                                    style={current?.id === ws.id ? {
                                        backgroundColor: 'var(--accent-soft)',
                                        color: 'var(--accent)',
                                    } : { color: 'var(--fg-secondary)' }}
                                >
                                    <span className="truncate">{ws.name}</span>
                                    {current?.id === ws.id && <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-1 border-t pt-1" style={{ borderColor: 'var(--border)' }}>
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    window.dispatchEvent(new CustomEvent('open-create-workspace-modal'))
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-[var(--bg-secondary)]"
                                style={{ color: 'var(--accent)' }}
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
