import { useState } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import { Button } from './ui/button'
import { geocodeCity } from '../utils/weatherUtils'

export default function GeoPermissionBanner({ onLocation, onDismiss }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function requestGeo() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported. Enter your city in Profile.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        onLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'Current location' })
        setLoading(false)
      },
      () => {
        setError('Permission denied. Enter your city in Profile.')
        setLoading(false)
      },
      { timeout: 8000 }
    )
  }

  return (
    <div className="relative rounded-2xl border border-blue-200 bg-blue-50 p-4">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-blue-400 hover:text-blue-600"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="mt-0.5 h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <MapPin className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900">Enable location for live weather</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Asstitude needs your city to recommend the right outfit for today.
          </p>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          <Button
            size="sm"
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={requestGeo}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <MapPin className="h-3.5 w-3.5 mr-1.5" />}
            Use my location
          </Button>
        </div>
      </div>
    </div>
  )
}
