/**
 * UI Kit — Minimal, professional components
 * Inspired by Linear, Vercel, Raycast design systems
 */

import { cn } from '@/lib/utils'
import { AlertTriangle, Plus, X, Loader2, Database, Check, ChevronDown } from 'lucide-react'
import { useState, useEffect, type ReactNode } from 'react'

/* ═══════════════════════════════════════════════════════════
   StatusBadge
   ═══════════════════════════════════════════════════════════ */

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export function StatusBadge({ status, label, dot = true }: { status: StatusType; label: string; dot?: boolean }) {
  const colors: Record<StatusType, { light: string; dark: string }> = {
    success: { light: 'text-emerald-700 bg-emerald-50', dark: 'dark:text-emerald-400 dark:bg-emerald-950/30' },
    warning: { light: 'text-amber-700 bg-amber-50', dark: 'dark:text-amber-400 dark:bg-amber-950/30' },
    error:   { light: 'text-red-700 bg-red-50', dark: 'dark:text-red-400 dark:bg-red-950/30' },
    info:    { light: 'text-blue-700 bg-blue-50', dark: 'dark:text-blue-400 dark:bg-blue-950/30' },
    neutral: { light: 'text-slate-600 bg-slate-100', dark: 'dark:text-slate-400 dark:bg-slate-800/50' },
  }
  const c = colors[status]

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium", c.light, c.dark)}>
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full",
          status === 'success' ? 'bg-emerald-500' :
          status === 'warning' ? 'bg-amber-500' :
          status === 'error' ? 'bg-red-500' :
          status === 'info' ? 'bg-blue-500' : 'bg-slate-400',
          status === 'success' && 'animate-pulse-dot'
        )} />
      )}
      {label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   EmptyState
   ═══════════════════════════════════════════════════════════ */

export function EmptyState({ icon, title, description, action, actionLabel }: {
  icon?: ReactNode
  title: string
  description?: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4 text-slate-400">
        {icon ?? <Database className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">{description}</p>}
      {action && actionLabel && (
        <button
          onClick={action}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-accent-fg text-xs font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ConfirmDialog
   ═══════════════════════════════════════════════════════════ */

export function ConfirmDialog({ open, title, description, confirmText = "Confirmar", onConfirm, onCancel, variant = "default" }: {
  open: boolean
  title: string
  description: string
  confirmText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'danger'
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute inset-0" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-modal)] animate-slide-up overflow-hidden">
        <div className="flex items-start gap-3 p-5">
          {variant === 'danger' && (
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--fg-primary)] mb-1">{title}</h3>
            <p className="text-xs text-[var(--fg-secondary)] leading-relaxed">{description}</p>
          </div>
          <button onClick={onCancel} className="p-1 rounded-md text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)] transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <button onClick={onCancel}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--fg-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--fg-primary)] transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className={cn("px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-colors",
              variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]')}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Skeleton
   ═══════════════════════════════════════════════════════════ */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[var(--bg-tertiary)]", className)} />
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-[var(--border)]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-2.5"><Skeleton className="h-4 w-full max-w-[120px]" /></td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <div className="flex-1"><Skeleton className="h-4 w-24 mb-1.5" /><Skeleton className="h-3 w-16" /></div>
      </div>
      <div className="flex gap-2"><Skeleton className="h-6 w-14 rounded-full" /><Skeleton className="h-6 w-14 rounded-full" /></div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MetricCard
   ═══════════════════════════════════════════════════════════ */

export function MetricCard({ label, value, icon, trend }: {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: { value: number; direction: 'up' | 'down' }
}) {
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--border-hover)] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-[var(--fg-tertiary)] uppercase tracking-wider">{label}</span>
        {icon && <div className="text-[var(--fg-tertiary)]">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[var(--fg-primary)] font-mono tracking-tight">{value}</span>
        {trend && (
          <span className={cn("text-[10px] font-medium mb-0.5",
            trend.direction === 'up' ? 'text-emerald-600' : 'text-red-500')}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Dropdown
   ═══════════════════════════════════════════════════════════ */

export function Dropdown({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative">
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[180px] bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-hover)] z-50 animate-slide-up overflow-hidden">
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ children, onClick, variant = 'default' }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'danger'
}) {
  return (
    <button onClick={onClick}
      className={cn("w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
        variant === 'danger'
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          : "text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--fg-primary)]")}>
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="border-t border-[var(--border)]" />
}

/* ═══════════════════════════════════════════════════════════
   CodeBlock
   ═══════════════════════════════════════════════════════════ */

export function CodeBlock({ value, onCopy }: { value: string; onCopy?: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-xs text-[var(--fg-secondary)] group">
      <span className="truncate flex-1">{value}</span>
      <button onClick={handleCopy}
        className="shrink-0 p-1 rounded text-[var(--fg-tertiary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] transition-colors opacity-0 group-hover:opacity-100">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <span className="text-[10px]">Copy</span>}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Button
   ═══════════════════════════════════════════════════════════ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export function Button({ children, variant = 'secondary', size = 'md', loading = false, disabled, onClick, className, ...props }: {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}) {
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-5 py-2.5 text-sm',
  }

  const variants: Record<ButtonVariant, string> = {
    primary:   'bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] font-semibold',
    secondary: 'bg-[var(--bg-primary)] text-[var(--fg-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]',
    ghost:     'text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]',
    danger:    'bg-red-600 text-white hover:bg-red-700 font-semibold',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn("inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed", sizes[size], variants[variant], className)}
      {...props as any}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════
   Tabs
   ═══════════════════════════════════════════════════════════ */

export function Tabs({ value, onChange, tabs }: {
  value: string
  onChange: (v: string) => void
  tabs: { id: string; label: string; icon?: ReactNode; badge?: string | number }[]
}) {
  return (
    <div className="flex items-center gap-0.5 border-b border-[var(--border)]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-[2px] transition-colors -mb-px",
            value === tab.id
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] hover:border-[var(--border)]"
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className="px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[10px] text-[var(--fg-tertiary)]">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  )
}
