import { useState, useCallback } from 'react'
import { loadProfile, saveProfile, defaultProfile } from '../data/store'

export function useProfile() {
  const [profile, setProfileState] = useState(() => loadProfile())

  const setProfile = useCallback((data) => {
    const next = { ...defaultProfile, ...data }
    setProfileState(next)
    saveProfile(next)
  }, [])

  return { profile, setProfile }
}
