import { useState, useCallback } from 'react'
import { loadSaved, saveSaved } from '../data/store'

export function useSaved() {
  const [saved, setSaved] = useState(() => loadSaved())

  const toggle = useCallback((outfit) => {
    setSaved(prev => {
      const exists = prev.some(o => o.id === outfit.id)
      const next = exists
        ? prev.filter(o => o.id !== outfit.id)
        : [...prev, { ...outfit, savedAt: Date.now() }]
      saveSaved(next)
      return next
    })
  }, [])

  const isSaved = useCallback((id) => saved.some(o => o.id === id), [saved])

  const remove = useCallback((id) => {
    setSaved(prev => {
      const next = prev.filter(o => o.id !== id)
      saveSaved(next)
      return next
    })
  }, [])

  return { saved, toggle, isSaved, remove }
}
