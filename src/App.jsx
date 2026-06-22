import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Wardrobe from './pages/Wardrobe'
import Generate from './pages/Generate'
import Saved from './pages/Saved'
import Profiles from './pages/Profiles'
import Onboarding from './pages/Onboarding'
import { useWardrobe } from './hooks/useWardrobe'
import { useSaved } from './hooks/useSaved'
import { isOnboarded, loadProfiles, loadActiveProfile, loadActiveProfileId, saveActiveProfileId } from './data/store'

function AppShell() {
  const [profiles, setProfiles] = useState(() => loadProfiles())
  const [activeProfileId, setActiveProfileId] = useState(() => loadActiveProfileId())
  const profile = profiles.find(p => p.id === activeProfileId) ?? profiles[0] ?? null

  const { wardrobe, addItem, removeItem, updateItem } = useWardrobe()
  const { saved, toggle: toggleSave, isSaved } = useSaved()

  const refreshProfiles = useCallback(() => {
    const updated = loadProfiles()
    setProfiles(updated)
    setActiveProfileId(loadActiveProfileId())
  }, [])

  const handleSwitch = useCallback((id) => {
    saveActiveProfileId(id)
    setActiveProfileId(id)
  }, [])

  if (!isOnboarded() || !profile) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto px-4 pt-4 pb-24">
        <Routes>
          <Route path="/" element={
            <Home profile={profile} saved={saved} onSave={toggleSave} />
          } />
          <Route path="/wardrobe" element={
            <Wardrobe wardrobe={wardrobe} addItem={addItem} removeItem={removeItem} updateItem={updateItem} profile={profile} />
          } />
          <Route path="/generate" element={
            <Generate profile={profile} saved={saved} onSave={toggleSave} />
          } />
          <Route path="/saved" element={
            <Saved saved={saved} onSave={toggleSave} />
          } />
          <Route path="/profiles" element={
            <Profiles
              profiles={profiles}
              activeProfileId={activeProfileId}
              onSwitch={handleSwitch}
              onProfilesChange={refreshProfiles}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
