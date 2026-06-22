import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Wardrobe from './pages/Wardrobe'
import Profile from './pages/Profile'
import { useProfile } from './hooks/useProfile'
import { useWardrobe } from './hooks/useWardrobe'

export default function App() {
  const { profile, setProfile } = useProfile()
  const { wardrobe, addItem, removeItem, updateItem } = useWardrobe()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <main className="max-w-md mx-auto px-4 pt-6 pb-24">
          <Routes>
            <Route path="/" element={<Dashboard profile={profile} setProfile={setProfile} wardrobe={wardrobe} />} />
            <Route
              path="/wardrobe"
              element={<Wardrobe wardrobe={wardrobe} addItem={addItem} removeItem={removeItem} updateItem={updateItem} profile={profile} />}
            />
            <Route path="/profile" element={<Profile profile={profile} setProfile={setProfile} />} />
          </Routes>
        </main>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}
