import { useState } from 'react'
import { Plus, Trash2, Check, MapPin } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import Mannequin from '../components/mannequin/Mannequin'
import { DEFAULT_PROFILE, GENDERS, MALE_BUILDS, FEMALE_BUILDS, CHILD_BUILDS, STYLE_PREFS, upsertProfile, deleteProfile, saveActiveProfileId, loadActiveProfileId } from '../data/store'
import { geocodeCity } from '../utils/weatherUtils'
import { cn } from '../utils/cn'

function buildOptions(gender) {
  if (gender === 'women') return FEMALE_BUILDS
  if (gender === 'children') return CHILD_BUILDS
  return MALE_BUILDS
}

function ProfileForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...DEFAULT_PROFILE, id: crypto.randomUUID(), ...initial })
  const [cityInput, setCityInput] = useState(initial?.location ?? '')
  const [cityError, setCityError] = useState('')
  const [cityLoading, setCityLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleGeocode = async () => {
    if (!cityInput.trim()) { set('location',''); set('lat',null); set('lon',null); return }
    setCityLoading(true); setCityError('')
    try {
      const { lat, lon, name, country } = await geocodeCity(cityInput)
      set('location', `${name}, ${country}`); set('lat', lat); set('lon', lon)
    } catch { setCityError('City not found.') }
    finally { setCityLoading(false) }
  }

  return (
    <div className="space-y-4 py-2">
      {/* Name */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Name</label>
        <input className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          value={form.name} onChange={e => set('name', e.target.value)} placeholder="Profile name" />
      </div>

      {/* Gender */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Gender</label>
        <div className="flex gap-2">
          {GENDERS.map(g => (
            <button key={g.value} onClick={() => { set('gender', g.value); set('build', buildOptions(g.value)[1]?.value ?? buildOptions(g.value)[0].value) }}
              className={cn('flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all', form.gender===g.value ? 'border-primary bg-secondary' : 'border-border bg-card')}>
              {g.icon} {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Build + mannequin preview */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Body Type</label>
        <div className="flex gap-3">
          <div className="shrink-0 w-20 h-40 rounded-xl bg-muted/40 flex items-center justify-center">
            <Mannequin gender={form.gender} build={form.build} width={70} height={160} />
          </div>
          <div className="flex-1 space-y-1.5">
            {buildOptions(form.gender).map(b => (
              <button key={b.value} onClick={() => set('build', b.value)}
                className={cn('w-full text-left px-3 py-2 rounded-lg border transition-all text-xs', form.build===b.value ? 'border-primary bg-secondary font-semibold' : 'border-border bg-card')}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Style prefs */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Style</label>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_PREFS.map(s => {
            const active = form.stylePrefs?.includes(s.value)
            return (
              <button key={s.value} onClick={() => set('stylePrefs', active ? (form.stylePrefs??[]).filter(x=>x!==s.value) : [...(form.stylePrefs??[]), s.value])}
                className={cn('px-3 h-7 rounded-full text-xs border transition-all', active ? 'bg-primary text-white border-primary' : 'bg-card border-border')}>
                {s.icon} {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Location</label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input className="w-full h-10 rounded-xl border border-border bg-card pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={cityInput} onChange={e => { setCityInput(e.target.value); setCityError('') }}
              onKeyDown={e => e.key==='Enter' && handleGeocode()} placeholder="City name" />
          </div>
          <Button variant="outline" onClick={handleGeocode} disabled={cityLoading} className="h-10 px-3 rounded-xl text-xs">
            {cityLoading ? '…' : 'Find'}
          </Button>
        </div>
        {cityError && <p className="text-xs text-destructive mt-1">{cityError}</p>}
        {form.location && <p className="text-xs text-primary mt-1 flex items-center gap-1"><Check className="h-3 w-3" />{form.location}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1 h-10 rounded-xl">Cancel</Button>
        <Button className="flex-1 h-10 rounded-xl gradient-primary text-white border-0 font-semibold"
          onClick={() => { upsertProfile(form); onSave(form) }} disabled={!form.name.trim()}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default function Profiles({ profiles, activeProfileId, onSwitch, onProfilesChange }) {
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const handleSave = (profile) => {
    setEditing(null)
    setAdding(false)
    onProfilesChange()
  }

  const handleDelete = (id) => {
    deleteProfile(id)
    onProfilesChange()
  }

  const handleSwitch = (id) => {
    saveActiveProfileId(id)
    onSwitch(id)
  }

  if (adding) {
    return (
      <div className="pb-6">
        <div className="pt-2 mb-4">
          <h1 className="text-2xl font-bold tracking-tight">New Profile</h1>
        </div>
        <ProfileForm onSave={handleSave} onCancel={() => setAdding(false)} />
      </div>
    )
  }

  if (editing) {
    return (
      <div className="pb-6">
        <div className="pt-2 mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
        </div>
        <ProfileForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      </div>
    )
  }

  return (
    <div className="pb-6 space-y-4">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Switch between family members</p>
        </div>
        <Button onClick={() => setAdding(true)} className="h-9 rounded-xl gradient-primary text-white border-0 gap-1.5 text-sm">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {profiles.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No profiles yet. Add one to get started.</p>
      )}

      <div className="space-y-3">
        {profiles.map(p => {
          const isActive = p.id === activeProfileId
          return (
            <Card key={p.id} className={cn('overflow-hidden transition-all cursor-pointer', isActive && 'ring-2 ring-primary')} onClick={() => handleSwitch(p.id)}>
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-4">
                  <div className="shrink-0">
                    <Mannequin gender={p.gender} build={p.build} width={56} height={140} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{p.name}</p>
                      {isActive && <Badge variant="secondary" className="text-[10px] text-primary">Active</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{p.gender} · {p.build}</p>
                    {p.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />{p.location}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(p.stylePrefs ?? []).slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button onClick={e => { e.stopPropagation(); setEditing(p) }}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg bg-muted/60">Edit</button>
                    {!isActive && (
                      <button onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                        className="text-xs text-destructive hover:text-destructive/80 px-2 py-1 rounded-lg bg-muted/60">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
