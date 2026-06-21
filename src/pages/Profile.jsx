import { useState, useEffect } from 'react'
import { MapPin, Loader2, Save, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { GENDER_OPTIONS, AGE_GROUPS, OCCASIONS, COLORS, defaultProfile } from '../data/store'
import { geocodeCity } from '../utils/weatherUtils'
import { cn } from '../utils/cn'

const MODESTY_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'modest', label: 'Modest / Conservative' },
  { value: 'minimal', label: 'Minimal / Relaxed' },
]

export default function Profile({ profile, setProfile }) {
  const [form, setForm] = useState(profile ?? defaultProfile)
  const [cityInput, setCityInput] = useState(profile?.location ?? '')
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) setForm({ ...defaultProfile, ...profile })
  }, [profile])

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setSaved(false)
  }

  function toggleColor(c) {
    setForm(f => {
      const next = f.preferredColors?.includes(c)
        ? f.preferredColors.filter(x => x !== c)
        : [...(f.preferredColors ?? []), c]
      return { ...f, preferredColors: next }
    })
    setSaved(false)
  }

  async function detectLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation not available in your browser.')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude, location: 'Current location' }))
        setCityInput('Current location')
        setGeoLoading(false)
        setSaved(false)
      },
      () => {
        setGeoError('Could not get your location. Enter your city manually.')
        setGeoLoading(false)
      }
    )
  }

  async function geocode() {
    if (!cityInput.trim()) return
    setGeoLoading(true)
    setGeoError(null)
    try {
      const result = await geocodeCity(cityInput.trim())
      setForm(f => ({ ...f, lat: result.lat, lon: result.lon, location: `${result.name}, ${result.country}` }))
      setCityInput(`${result.name}, ${result.country}`)
      setSaved(false)
    } catch {
      setGeoError('City not found. Try a nearby city.')
    } finally {
      setGeoLoading(false)
    }
  }

  function handleSave() {
    setProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const locationSet = form.lat && form.lon

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">My Profile</h1>
        <p className="text-xs text-muted-foreground">Tell us about you so we can personalise your outfits.</p>
      </div>

      {/* Basic info */}
      <Section title="About you">
        <Field label="Your name (optional)">
          <Input
            placeholder="e.g. Amara"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gender">
            <Select value={form.gender} onValueChange={v => set('gender', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map(g => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Age group">
            <Select value={form.ageGroup} onValueChange={v => set('ageGroup', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map(a => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      {/* Location */}
      <Section title="Location">
        <p className="text-xs text-muted-foreground -mt-1 mb-3">Used to fetch your local weather. Never shared.</p>
        <div className="flex gap-2">
          <Input
            placeholder="Enter city, e.g. London"
            value={cityInput}
            onChange={e => { setCityInput(e.target.value); setSaved(false) }}
            onKeyDown={e => e.key === 'Enter' && geocode()}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={geocode} disabled={geoLoading || !cityInput.trim()}>
            {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" onClick={detectLocation} disabled={geoLoading}>
          {geoLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
          Use my current location
        </Button>
        {geoError && <p className="text-xs text-destructive mt-1">{geoError}</p>}
        {locationSet && (
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Location set: {form.location}
          </p>
        )}
      </Section>

      {/* Occasion */}
      <Section title="Default occasion">
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map(occ => (
            <button
              key={occ}
              onClick={() => set('defaultOccasion', occ)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border capitalize transition-all',
                form.defaultOccasion === occ
                  ? 'bg-primary text-primary-foreground border-primary font-medium'
                  : 'border-border hover:border-primary/40'
              )}
            >
              {occ}
            </button>
          ))}
        </div>
      </Section>

      {/* Modesty */}
      <Section title="Style preference">
        <div className="space-y-2">
          {MODESTY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => set('modestyLevel', opt.value)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all',
                form.modestyLevel === opt.value
                  ? 'border-primary bg-primary/5 font-medium text-primary'
                  : 'border-border hover:border-primary/30'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Preferred colours */}
      <Section title="Favourite colours">
        <p className="text-xs text-muted-foreground -mt-1 mb-3">Pick up to 5 colours you love wearing.</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => {
            const hex = COLOR_MAP[c]
            const active = form.preferredColors?.includes(c)
            return (
              <button
                key={c}
                onClick={() => toggleColor(c)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all',
                  active ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:border-primary/40'
                )}
              >
                <span className="h-3 w-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: hex }} />
                {c}
              </button>
            )
          })}
        </div>
        {form.preferredColors?.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">{form.preferredColors.length} selected</p>
        )}
      </Section>

      {/* Save */}
      <Button onClick={handleSave} size="lg" className="w-full gap-2">
        {saved ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5" />}
        {saved ? 'Profile saved!' : 'Save profile'}
      </Button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4 space-y-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

const COLOR_MAP = {
  black: '#1a1a1a', white: '#f5f5f5', grey: '#9ca3af', navy: '#1e3a5f',
  beige: '#d4b896', brown: '#92400e', red: '#dc2626', pink: '#ec4899',
  orange: '#f97316', yellow: '#eab308', green: '#16a34a', blue: '#2563eb',
  purple: '#7c3aed', cream: '#fffbeb', khaki: '#a16207', olive: '#65a30d',
  burgundy: '#881337', teal: '#0f766e', coral: '#fb7185',
}
