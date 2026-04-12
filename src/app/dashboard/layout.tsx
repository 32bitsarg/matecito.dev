'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, clearToken } from '@/lib/api'
import { ActivityBar } from '@/components/layout/activity-bar'
import { TopBar } from '@/components/layout/top-bar'
import { CommandPalette } from '@/components/layout/command-palette'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import NewProjectModal from '@/components/new-project-modal'
import CreateWorkspaceModal from '@/components/create-workspace-modal'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { Loader2 } from 'lucide-react'

function DashboardModals() {
  const { currentWorkspace, refreshWorkspaces } = useWorkspace()

  return (
    <>
      <NewProjectModal
        currentWorkspaceId={currentWorkspace?.id}
        onCreated={() => {
          if (currentWorkspace?.id) refreshWorkspaces()
        }}
      />
      <CreateWorkspaceModal />
    </>
  )
}

function isProjectPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] !== 'dashboard' || parts.length < 3) return false
  const workspaceOnlyRoutes = new Set(['settings', 'members'])
  if (parts.length === 3 && workspaceOnlyRoutes.has(parts[2])) return false
  return true
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const inProject = isProjectPath(pathname)

  useEffect(() => {
    ;(async () => {
      if (!isAuthenticated()) {
        clearToken()
        router.replace('/login')
        return
      }
      setChecking(false)
    })()
  }, [router])

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)' }}>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <ErrorBoundary>
            {inProject ? (
              // Project view: no outer padding — ProjectNav + page content handle their own spacing
              children
            ) : (
              <div className="px-6 py-5 animate-fade-in">
                {children}
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
      <DashboardModals />
    </div>
  )
}
