import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Sparkles, AlertTriangle, Shirt } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import WeatherCard from '../components/WeatherCard'
import OutfitCard from '../components/OutfitCard'
import ForecastStrip from '../components/ForecastStrip'
import GeoPermissionBanner from '../components/GeoPermissionBanner'
import MemberSwitcher from '../components/MemberSwitcher'
import { useWeather } from '../hooks/useWeather'
import { generateOutfits, getOutfitTip } from '../utils/outfitEngine'
import { getSeason } from '../utils/weatherUtils'
import { loadGeoDismissed, saveGeoDismissed } from '../data/store'

export default function Dashboard({ profile, setProfile, wardrobe }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState({})
  const [seeds, setSeeds] = useState({})
  const [activeMemberId, setActiveMemberId] = useState(null)
  const [geoDismissed, setGeoDismissed] = useState(() => loadGeoDismissed())

  const lat = profile?.lat ?? null
  const lon = profile?.lon ?? null
  const locationName = profile?.location || null

  const { weather, loading, error, refresh } = useWeather(lat, lon)

  // Filter wardrobe to the active member
  const memberWardrobe = wardrobe.filter(item =>
    activeMemberId === null ? !item.memberId : item.memberId === activeMemberId
  )

  const activeMember = activeMemberId
    ? profile?.members?.find(m => m.id === activeMemberId)
    : null

  const activeProfile = activeMember
    ? { ...profile, gender: activeMember.gender, ageGroup: activeMember.ageGroup, name: activeMember.name }
    : profile

  const outfits = weather && memberWardrobe.length
    ? generateOutfits(memberWardrobe, weather, activeProfile, seeds)
    : []

  const tips = weather
    ? getOutfitTip(weather.tempC, weather.condition, weather.hourly)
    : []

  const season = getSeason(new Date().getMonth() + 1)
  const noProfile = !profile
  const noLocation = profile && !profile.lat && !profile.lon
  const noWardrobe = memberWardrobe.length === 0
  const showGeoBanner = profile && noLocation && !geoDismissed

  function handleShuffle(outfitId) {
    setSeeds(s => ({ ...s, [outfitId]: ((s[outfitId] ?? 0) + 1) }))
  }

  function handleGeoLocation({ lat, lon, name }) {
    if (setProfile) {
      setProfile({ ...profile, lat, lon, location: name })
    }
    setGeoDismissed(true)
    saveGeoDismissed()
  }

  function dismissGeoBanner() {
    setGeoDismissed(true)
    saveGeoDismissed()
  }

  if (noProfile) {
    return (
      <EmptyState
        icon={<Sparkles className="h-10 w-10 text-primary" />}
        title="Welcome to Asstitude"
        subtitle="Your personal weather-aware outfit assistant."
        action={<Button onClick={() => navigate('/profile')} size="lg" className="w-full">Set up your profile</Button>}
      />
    )
  }

  const displayName = activeMember?.name || profile.name || 'there'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {greeting()}, {displayName} 👋
          </h1>
          <p className="text-xs text-muted-foreground capitalize">
            {season} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Family member switcher */}
      <MemberSwitcher
        profile={profile}
        activeMemberId={activeMemberId}
        onSwitch={setActiveMemberId}
      />

      {/* Geolocation banner */}
      {showGeoBanner && (
        <GeoPermissionBanner onLocation={handleGeoLocation} onDismiss={dismissGeoBanner} />
      )}

      {/* Location missing (after dismissing banner) */}
      {noLocation && geoDismissed && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">No location set</p>
              <p className="text-xs text-amber-600">Add your city in Profile to get weather outfits.</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/profile')} className="border-amber-300 text-amber-700 hover:bg-amber-100">
              Fix
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Weather */}
      {lat && lon && (
        <>
          {loading && (
            <div className="h-36 rounded-2xl bg-muted animate-pulse" />
          )}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">Could not load weather. Check your connection.</p>
                <Button size="sm" variant="outline" onClick={refresh} className="ml-auto">Retry</Button>
              </CardContent>
            </Card>
          )}
          {weather && !loading && (
            <>
              <WeatherCard weather={weather} locationName={locationName} onRefresh={refresh} loading={loading} />
              <ForecastStrip daily={weather.daily} timezone={weather.timezone} />
            </>
          )}
        </>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="space-y-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-accent/60 text-sm text-accent-foreground">
              <span className="shrink-0">💡</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wardrobe empty */}
      {noWardrobe && lat && lon && (
        <EmptyState
          icon={<Shirt className="h-10 w-10 text-muted-foreground" />}
          title={activeMember ? `${activeMember.name}'s wardrobe is empty` : 'Wardrobe is empty'}
          subtitle="Add clothes to get personalised outfit suggestions."
          action={<Button onClick={() => navigate('/wardrobe')} className="w-full">Add clothes</Button>}
        />
      )}

      {/* Outfits */}
      {outfits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Outfit Suggestions</h2>
          {outfits.map(outfit => (
            <OutfitCard
              key={outfit.id + (seeds[outfit.id] ?? 0)}
              outfit={outfit}
              saved={!!saved[outfit.id]}
              onSave={() => setSaved(s => ({ ...s, [outfit.id]: !s[outfit.id] }))}
              onShuffle={() => handleShuffle(outfit.id)}
            />
          ))}
        </div>
      )}

      {lat && lon && !loading && !error && weather && outfits.length === 0 && !noWardrobe && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          Not enough tagged items to build an outfit yet.
          <br />
          <Button variant="link" onClick={() => navigate('/wardrobe')} className="mt-1">
            Update your wardrobe
          </Button>
        </div>
      )}
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 gap-4">
      {icon}
      <div>
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
