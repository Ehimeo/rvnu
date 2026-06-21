import { Droplets, Wind, Thermometer, RefreshCw } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { cn } from '../utils/cn'

const GRADIENT_MAP = {
  sunny: 'gradient-warm',
  cloudy: 'bg-gradient-to-br from-slate-100 to-blue-50',
  rainy: 'gradient-rainy',
  stormy: 'bg-gradient-to-br from-slate-200 to-slate-300',
  snowy: 'bg-gradient-to-br from-blue-50 to-slate-100',
}

export default function WeatherCard({ weather, locationName, onRefresh, loading }) {
  if (!weather) return null

  const gradient = GRADIENT_MAP[weather.condition] ?? 'gradient-warm'

  return (
    <Card className={cn('overflow-hidden border-0 shadow-lg', gradient)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {locationName ?? 'Your location'}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-light">{weather.tempC}°</span>
              <span className="text-2xl mb-2">{weather.icon}</span>
            </div>
            <p className="text-sm font-medium text-foreground/80 mt-1">{weather.label}</p>
            <p className="text-xs text-muted-foreground">Feels like {weather.feelsLike}°C</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
            className="mt-1 text-foreground/60 hover:text-foreground"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </Button>
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-black/5">
          <StatPill icon={<Droplets className="h-3.5 w-3.5" />} label={`${weather.humidity}%`} title="Humidity" />
          <StatPill icon={<Wind className="h-3.5 w-3.5" />} label={`${weather.windKph} km/h`} title="Wind" />
          <StatPill icon={<Thermometer className="h-3.5 w-3.5" />} label={weather.tempCategory} title="Feels" />
        </div>
      </CardContent>
    </Card>
  )
}

function StatPill({ icon, label, title }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-foreground/70">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  )
}
