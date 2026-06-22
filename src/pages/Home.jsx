import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, MapPin, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import OutfitCard from '../components/OutfitCard'
import { useWeather } from '../hooks/useWeather'
import { generateLibraryOutfits } from '../utils/outfitEngine'
import { cn } from '../utils/cn'

const BANNER_CLASSES = {
  sunny:  'gradient-sunny',
  cloudy: 'gradient-sky',
  rainy:  'gradient-rain',
  stormy: 'gradient-rain',
  snowy:  'gradient-cold',
}

const OCCASION_CHIPS = [
  { value: 'casual', label: 'Casual' },
  { value: 'work',   label: 'Work' },
  { value: 'party',  label: 'Night Out' },
  { value: 'gym',    label: 'Gym' },
]

export default function Home({ profile, saved, onSave }) {
  const navigate = useNavigate()
  const { weather, loading: wLoading, refresh } = useWeather(profile?.lat, profile?.lon)
  const [occasion, setOccasion] = useState(profile?.occasion ?? 'casual')
  const [outfits, setOutfits] = useState([])

  useEffect(() => {
    if (!weather) return
    const results = generateLibraryOutfits(weather, profile, occasion, 6)
    setOutfits(results)
  }, [weather, occasion, profile])

  const bannerClass = BANNER_CLASSES[weather?.condition] ?? 'gradient-sky'

  return (
    <div className="pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Good day,</p>
          <h1 className="text-xl font-bold leading-tight">{profile?.name || 'Style Mate'}</h1>
        </div>
        <button
          onClick={() => navigate('/profiles')}
          className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
        >
          {profile?.name?.[0]?.toUpperCase() ?? '?'}
        </button>
      </div>

      {/* Weather banner */}
      {!profile?.lat ? (
        <div className={cn('rounded-2xl p-5 gradient-sky text-foreground')}>
          <p className="font-semibold text-sm mb-1">No location set</p>
          <p className="text-xs opacity-70 mb-3">Add your city to get live weather-based outfit suggestions.</p>
          <Button size="sm" variant="secondary" onClick={() => navigate('/profiles')} className="text-xs h-8 rounded-xl">
            <MapPin className="h-3.5 w-3.5 mr-1" /> Add location
          </Button>
        </div>
      ) : (
        <div className={cn('rounded-2xl p-5 relative overflow-hidden', bannerClass)}>
          {wLoading && (
            <div className="absolute inset-0 bg-white/30 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 animate-spin opacity-60" />
            </div>
          )}
          {weather && (
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{weather.tempC}°</span>
                  <span className="text-2xl">{weather.icon}</span>
                </div>
                <p className="font-semibold mt-0.5">{weather.label}</p>
                <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                  <MapPin className="h-3 w-3" />
                  <span>{profile.location || 'Your location'}</span>
                </div>
              </div>
              <div className="text-right text-xs opacity-70 space-y-0.5">
                <p>Feels {weather.feelsLike}°</p>
                <p>{weather.windLabel}</p>
                <Badge variant="secondary" className="text-[10px] mt-1 capitalize">{weather.tempCategory}</Badge>
              </div>
            </div>
          )}
          <button onClick={refresh} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Occasion chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {OCCASION_CHIPS.map(c => (
          <button
            key={c.value}
            onClick={() => setOccasion(c.value)}
            className={cn(
              'shrink-0 px-4 h-8 rounded-full text-xs font-semibold border transition-all',
              occasion === c.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground border-border hover:border-primary/50'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Outfit suggestions */}
      {!weather && !wLoading && profile?.lat && (
        <p className="text-sm text-muted-foreground text-center py-4">Fetching weather…</p>
      )}

      {!weather && !profile?.lat && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Today's Picks</h2>
          {generateLibraryOutfits({ tempCategory: 'mild', condition: 'cloudy' }, profile, occasion, 4).map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              saved={saved?.some(s => s.id === outfit.id)}
              onSave={() => onSave(outfit)}
            />
          ))}
        </div>
      )}

      {outfits.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Today's Picks</h2>
            <button onClick={() => navigate('/generate')} className="text-xs text-primary font-medium flex items-center gap-0.5">
              More <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
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
