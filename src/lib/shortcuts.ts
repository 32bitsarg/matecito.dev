/**
 * Keyboard shortcuts hook
 * Usage: useKeyboardShortcut('k', handler, { metaKey: true })
 */

import { useEffect } from 'react'

interface ShortcutOptions {
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  preventDefault?: boolean
}

export function useKeyboardShortcut(key: string, callback: () => void, options: ShortcutOptions = {}) {
  const { metaKey = false, ctrlKey = false, shiftKey = false, preventDefault = true } = options

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return
      if (metaKey && !e.metaKey) return
      if (ctrlKey && !e.ctrlKey) return
      if (shiftKey && !e.shiftKey) return

      // Don't trigger when typing in inputs
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return

      if (preventDefault) e.preventDefault()
      callback()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, metaKey, ctrlKey, shiftKey, preventDefault])
}

/**
 * Global keyboard shortcuts registry
 */

type ShortcutHandler = { key: string; handler: () => void; options: ShortcutOptions; label: string }
const shortcuts = new Map<string, ShortcutHandler>()

export function registerShortcut(id: string, key: string, handler: () => void, options: ShortcutOptions, label: string) {
  shortcuts.set(id, { key, handler, options, label })
  return () => shortcuts.delete(id)
}

export function getRegisteredShortcuts() {
  return Array.from(shortcuts.values())
}
