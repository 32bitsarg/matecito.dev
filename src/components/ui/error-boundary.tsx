'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--error-soft)' }}>
            <AlertTriangle className="w-7 h-7" style={{ color: 'var(--error)' }} />
          </div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--fg-primary)' }}>
            Algo salió mal
          </h3>
          <p className="text-xs max-w-sm mb-4" style={{ color: 'var(--fg-tertiary)' }}>
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reintentar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
