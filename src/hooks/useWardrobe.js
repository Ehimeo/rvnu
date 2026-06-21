import { useState, useCallback } from 'react'
import { loadWardrobe, saveWardrobe } from '../data/store'

export function useWardrobe() {
  const [wardrobe, setWardrobeState] = useState(() => loadWardrobe())

  const addItem = useCallback((item) => {
    setWardrobeState(prev => {
      const next = [...prev, { ...item, id: crypto.randomUUID(), addedAt: Date.now() }]
      saveWardrobe(next)
      return next
    })
  }, [])

  const removeItem = useCallback((id) => {
    setWardrobeState(prev => {
      const next = prev.filter(i => i.id !== id)
      saveWardrobe(next)
      return next
    })
  }, [])

  const updateItem = useCallback((id, changes) => {
    setWardrobeState(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...changes } : i)
      saveWardrobe(next)
      return next
    })
  }, [])

  return { wardrobe, addItem, removeItem, updateItem }
}
