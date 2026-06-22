import { Heart } from 'lucide-react'
import OutfitCard from '../components/OutfitCard'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'

export default function Saved({ saved, onSave }) {
  const navigate = useNavigate()

  return (
    <div className="pb-6 space-y-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Saved Outfits</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{saved.length} outfit{saved.length !== 1 ? 's' : ''} saved</p>
      </div>

      {saved.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">Nothing saved yet</p>
            <p className="text-sm text-muted-foreground mt-1">Tap the heart on any outfit to save it here.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/generate')} className="h-10 rounded-xl">
            Find outfits
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {saved.map(outfit => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            saved
            onSave={() => onSave(outfit)}
          />
        ))}
      </div>
    </div>
  )
}
