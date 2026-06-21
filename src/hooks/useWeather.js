import { useState, useEffect, useCallback } from 'react'
import { fetchWeather, getWeatherMeta, getTempCategory, getWindLabel } from '../utils/weatherUtils'

export function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (lat == null || lon == null) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeather(lat, lon)
      const cur = data.current
      const meta = getWeatherMeta(cur.weather_code)
      setWeather({
        tempC: Math.round(cur.temperature_2m),
        feelsLike: Math.round(cur.apparent_temperature),
        humidity: cur.relative_humidity_2m,
        windKph: Math.round(cur.wind_speed_10m),
        windLabel: getWindLabel(cur.wind_speed_10m),
        precipitation: cur.precipitation,
        code: cur.weather_code,
        label: meta.label,
        icon: meta.icon,
        condition: meta.condition,
        tempCategory: getTempCategory(cur.temperature_2m),
        hourly: data.hourly,
        daily: data.daily,
        timezone: data.timezone,
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [lat, lon])

  useEffect(() => { load() }, [load])

  return { weather, loading, error, refresh: load }
}
