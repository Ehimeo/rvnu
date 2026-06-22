import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, MapPin, Check } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import Mannequin from '../components/mannequin/Mannequin'
import { DEFAULT_PROFILE, GENDERS, MALE_BUILDS, FEMALE_BUILDS, CHILD_BUILDS, STYLE_PREFS, OCCASIONS, upsertProfile, saveActiveProfileId, markOnboarded } from '../data/store'
import { geocodeCity } from '../utils/weatherUtils'
import { cn } from '../utils/cn'

const TOTAL = 5

function buildOptions(gender) {
  if (gender === 'women') return FEMALE_BUILDS
  if (gender === 'children') return CHILD_BUILDS
  return MALE_BUILDS
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ ...DEFAULT_PROFILE, id: crypto.randomUUID(), name: '', gender: 'men', build: 'average', stylePrefs: ['casual'], occasion: 'casual', location: '', lat: null, lon: null })
  const [cityInput, setCityInput] = useState('')
  const [cityError, setCityError] = useState('')
  const [cityLoading, setCityLoading] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleGeocode = async () => {
    if (!cityInput.trim()) { set('location', ''); set('lat', null); set('lon', null); next(); return }
    setCityLoading(true)
    setCityError('')
    try {
      const { lat, lon, name, country } = await geocodeCity(cityInput)
      set('location', `${name}, ${country}`)
      set('lat', lat)
      set('lon', lon)
      next()
    } catch {
      setCityError('City not found. Try a different name.')
    } finally {
      setCityLoading(false)
    }
  }

  const next = () => setStep(s => Math.min(s + 1, TOTAL))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const finish = () => {
    upsertProfile(form)
    saveActiveProfileId(form.id)
    markOnboarded()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      {step > 0 && step < TOTAL && (
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / (TOTAL - 1)) * 100}%` }} />
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 py-6">

        {/* Step 0 – Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
            <div className="gradient-primary h-24 w-24 rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-5xl">✨</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">StyleMate</h1>
              <p className="text-muted-foreground leading-relaxed">Your personal outfit assistant. Dress great every day — guided by weather, your style, and the occasion.</p>
            </div>
            <Button className="w-full gradient-primary text-white font-semibold h-12 rounded-xl mt-2 border-0" onClick={next}>
              Get Started <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 1 – Name + Gender */}
        {step === 1 && (
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Who are we styling?</h2>
              <p className="text-sm text-muted-foreground mt-1">Set up your first profile — you can add more later.</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <input
                className="w-full h-11 rounded-xl border border-border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="e.g. Alex"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {GENDERS.map(g => (
                  <button
                    key={g.value}
                    onClick={() => { set('gender', g.value); set('build', buildOptions(g.value)[1]?.value ?? buildOptions(g.value)[0].value) }}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                      form.gender === g.value
                        ? 'border-primary bg-secondary'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <span className="text-xs font-semibold">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <Button variant="ghost" onClick={back} className="h-11 px-4"><ChevronLeft className="h-4 w-4" /></Button>
              <Button className="flex-1 h-11 rounded-xl gradient-primary text-white border-0 font-semibold" onClick={next} disabled={!form.name.trim()}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 – Body Build with mannequin preview */}
        {step === 2 && (
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your body type</h2>
              <p className="text-sm text-muted-foreground mt-1">Helps us suggest the most flattering fits.</p>
            </div>

            <div className="flex gap-4 items-start">
              {/* Mannequin preview */}
              <div className="shrink-0 flex items-center justify-center w-28 h-52 rounded-2xl bg-muted/40">
                <Mannequin gender={form.gender} build={form.build} width={90} height={200} />
              </div>

              {/* Build options */}
              <div className="flex-1 space-y-2">
                {buildOptions(form.gender).map(b => (
                  <button
                    key={b.value}
                    onClick={() => set('build', b.value)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl border-2 transition-all',
                      form.build === b.value
                        ? 'border-primary bg-secondary'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <p className="text-sm font-semibold">{b.label}</p>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <Button variant="ghost" onClick={back} className="h-11 px-4"><ChevronLeft className="h-4 w-4" /></Button>
              <Button className="flex-1 h-11 rounded-xl gradient-primary text-white border-0 font-semibold" onClick={next}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 3 – Style Preferences */}
        {step === 3 && (
          <div className="flex-1 flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your style</h2>
              <p className="text-sm text-muted-foreground mt-1">Pick all that feel like you.</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {STYLE_PREFS.map(s => {
                const active = form.stylePrefs.includes(s.value)
                return (
                  <button
                    key={s.value}
                    onClick={() => set('stylePrefs', active ? form.stylePrefs.filter(x => x !== s.value) : [...form.stylePrefs, s.value])}
                    className={cn(
                      'flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all',
                      active ? 'border-primary bg-secondary' : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-sm font-semibold">{s.label}</span>
                    {active && <Check className="h-4 w-4 text-primary ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-auto flex gap-3">
              <Button variant="ghost" onClick={back} className="h-11 px-4"><ChevronLeft className="h-4 w-4" /></Button>
              <Button className="flex-1 h-11 rounded-xl gradient-primary text-white border-0 font-semibold" onClick={next} disabled={!form.stylePrefs.length}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 4 – Location */}
        {step === 4 && (
          <div className="flex-1 flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Where are you?</h2>
              <p className="text-sm text-muted-foreground mt-1">We use this to fetch your local weather.</p>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full h-11 rounded-xl border border-border bg-card pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="City or town name"
                  value={cityInput}
                  onChange={e => { setCityInput(e.target.value); setCityError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleGeocode()}
                />
              </div>
              <Button variant="outline" onClick={handleGeocode} disabled={cityLoading} className="h-11 px-4 rounded-xl">
                {cityLoading ? '…' : 'Find'}
              </Button>
            </div>

            {cityError && <p className="text-sm text-destructive">{cityError}</p>}
            {form.location && (
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Check className="h-4 w-4" /> {form.location}
              </div>
            )}

            <p className="text-xs text-muted-foreground">Location is stored only on your device. Skip if you prefer.</p>

            <div className="mt-auto flex gap-3">
              <Button variant="ghost" onClick={back} className="h-11 px-4"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" onClick={finish} className="h-11 px-4 rounded-xl">Skip</Button>
              <Button className="flex-1 h-11 rounded-xl gradient-primary text-white border-0 font-semibold" onClick={form.location ? finish : handleGeocode}>
                {form.location ? 'Done' : 'Confirm'}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
