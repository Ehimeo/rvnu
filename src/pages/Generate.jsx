import { useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '../components/ui/button'
import OutfitCard from '../components/OutfitCard'
import { useWeather } from '../hooks/useWeather'
import { generateLibraryOutfits } from '../utils/outfitEngine'
import { OCCASIONS } from '../data/store'
import { cn } from '../utils/cn'

export default function Generate({ profile, saved, onSave }) {
  const { weather } = useWeather(profile?.lat, profile?.lon)
  const [occasion, setOccasion] = useState(profile?.occasion ?? 'casual')
  const [outfits, setOutfits] = useState([])
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)

  const generate = () => {
    setLoading(true)
    const w = weather ?? { tempCategory: 'mild', condition: 'cloudy' }
    setTimeout(() => {
      const results = generateLibraryOutfits(w, profile, occasion, 8)
      setOutfits(results)
      setGenerated(true)
      setLoading(false)
    }, 600)
  }

  return (
    <div className="pb-6 space-y-5">
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Generate Outfits</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pick an occasion and get curated looks.</p>
      </div>

      {/* Occasion selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Occasion</p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map(o => (
            <button
              key={o.value}
              onClick={() => { setOccasion(o.value); setGenerated(false) }}
              className={cn(
                'px-4 h-8 rounded-full text-xs font-semibold border transition-all',
                occasion === o.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:border-primary/40'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <Button
        className="w-full h-12 rounded-2xl gradient-primary text-white border-0 font-semibold text-sm gap-2"
        onClick={generate}
        disabled={loading}
      >
        {loading ? (
          <><RotateCcw className="h-4 w-4 animate-spin" /> Finding outfits…</>
        ) : (
          <><Sparkles className="h-4 w-4" /> Generate Outfits</>
        )}
      </Button>

      {/* Results */}
      {generated && outfits.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No outfits found for this occasion. Try a different one.</p>
      )}

      {outfits.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{outfits.length} outfit{outfits.length !== 1 ? 's' : ''} for <span className="font-medium capitalize">{occasion}</span></p>
          {outfits.map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              saved={saved?.some(s => s.id === outfit.id)}
              onSave={() => onSave(outfit)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
