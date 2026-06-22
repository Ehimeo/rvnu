import { getWeatherMeta } from '../utils/weatherUtils'
import { cn } from '../utils/cn'

export default function ForecastStrip({ daily, timezone }) {
  if (!daily?.time?.length) return null

  const days = daily.time.slice(0, 3).map((date, i) => {
    const meta = getWeatherMeta(daily.weather_code[i])
    const label = i === 0 ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' })
    return {
      label,
      icon: meta.icon,
      condition: meta.condition,
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      rain: Math.round(daily.precipitation_sum?.[i] ?? 0),
    }
  })

  return (
    <div className="grid grid-cols-3 gap-2">
      {days.map((day, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-center gap-1 p-3 rounded-2xl border text-center',
            i === 0 ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/50'
          )}
        >
          <p className={cn('text-xs font-semibold', i === 0 ? 'text-primary' : 'text-muted-foreground')}>
            {day.label}
          </p>
          <span className="text-2xl">{day.icon}</span>
          <p className="text-sm font-bold">{day.max}°</p>
          <p className="text-xs text-muted-foreground">{day.min}°</p>
          {day.rain > 0 && (
            <p className="text-xs text-blue-500">💧 {day.rain}mm</p>
          )}
        </div>
      ))}
    </div>
  )
}
