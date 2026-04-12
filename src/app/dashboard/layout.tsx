'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

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
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <div className="max-w-6xl mx-auto p-5 lg:p-6 animate-fade-in">
              {children}
            </div>
          </ErrorBoundary>
        </main>
      </div>
      <CommandPalette />
      <DashboardModals />
    </div>
  )
}
