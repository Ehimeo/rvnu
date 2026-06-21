export const WMO_CODES = {
  0: { label: 'Clear sky', icon: '☀️', condition: 'sunny' },
  1: { label: 'Mainly clear', icon: '🌤️', condition: 'sunny' },
  2: { label: 'Partly cloudy', icon: '⛅', condition: 'cloudy' },
  3: { label: 'Overcast', icon: '☁️', condition: 'cloudy' },
  45: { label: 'Foggy', icon: '🌫️', condition: 'cloudy' },
  48: { label: 'Depositing rime fog', icon: '🌫️', condition: 'cloudy' },
  51: { label: 'Light drizzle', icon: '🌦️', condition: 'rainy' },
  53: { label: 'Moderate drizzle', icon: '🌧️', condition: 'rainy' },
  55: { label: 'Dense drizzle', icon: '🌧️', condition: 'rainy' },
  61: { label: 'Slight rain', icon: '🌦️', condition: 'rainy' },
  63: { label: 'Moderate rain', icon: '🌧️', condition: 'rainy' },
  65: { label: 'Heavy rain', icon: '🌧️', condition: 'rainy' },
  71: { label: 'Slight snow', icon: '🌨️', condition: 'snowy' },
  73: { label: 'Moderate snow', icon: '❄️', condition: 'snowy' },
  75: { label: 'Heavy snow', icon: '❄️', condition: 'snowy' },
  80: { label: 'Slight showers', icon: '🌦️', condition: 'rainy' },
  81: { label: 'Moderate showers', icon: '🌧️', condition: 'rainy' },
  82: { label: 'Violent showers', icon: '⛈️', condition: 'stormy' },
  95: { label: 'Thunderstorm', icon: '⛈️', condition: 'stormy' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️', condition: 'stormy' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️', condition: 'stormy' },
}

export function getWeatherMeta(code) {
  return WMO_CODES[code] ?? { label: 'Unknown', icon: '🌡️', condition: 'cloudy' }
}

export function getTempCategory(tempC) {
  if (tempC <= 5) return 'freezing'
  if (tempC <= 12) return 'cold'
  if (tempC <= 18) return 'cool'
  if (tempC <= 24) return 'mild'
  if (tempC <= 30) return 'warm'
  return 'hot'
}

export function getSeason(month) {
  if ([12, 1, 2].includes(month)) return 'winter'
  if ([3, 4, 5].includes(month)) return 'spring'
  if ([6, 7, 8].includes(month)) return 'summer'
  return 'autumn'
}

export function getWindLabel(windKph) {
  if (windKph < 10) return 'calm'
  if (windKph < 30) return 'breezy'
  if (windKph < 50) return 'windy'
  return 'very windy'
}

export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  return res.json()
}

export async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocode failed')
  const data = await res.json()
  if (!data.results?.length) throw new Error('City not found')
  return { lat: data.results[0].latitude, lon: data.results[0].longitude, name: data.results[0].name, country: data.results[0].country }
}
