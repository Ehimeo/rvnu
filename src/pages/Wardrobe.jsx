import { useState } from 'react'
import { Plus, Trash2, Search, Filter, X, Check, Users } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { CLOTHING_TYPES, WEATHER_TAGS, OCCASIONS, COLORS } from '../data/store'
import { cn } from '../utils/cn'

const GENDER_AVATAR = { woman: '👩', man: '👨', girl: '👧', boy: '👦' }

const TYPE_ICONS = {
  shirt: '👕', blouse: '👚', top: '👕', sweater: '🧥', hoodie: '🧥',
  trousers: '👖', jeans: '👖', skirt: '👗', shorts: '🩳', leggings: '🩱',
  dress: '👗', jumpsuit: '🧥',
  jacket: '🧥', coat: '🧥', raincoat: '🌂', cardigan: '🧥',
  shoes: '👟', boots: '👢', trainers: '👟', sandals: '👡', heels: '👠',
  accessory: '✨', scarf: '🧣', hat: '🎩', belt: '👔', bag: '👜',
}

const COLOR_HEX = {
  black: '#1a1a1a', white: '#f5f5f5', grey: '#9ca3af', navy: '#1e3a5f',
  beige: '#d4b896', brown: '#92400e', red: '#dc2626', pink: '#ec4899',
  orange: '#f97316', yellow: '#eab308', green: '#16a34a', blue: '#2563eb',
  purple: '#7c3aed', cream: '#fffbeb', khaki: '#a16207', olive: '#65a30d',
  burgundy: '#881337', teal: '#0f766e', coral: '#fb7185',
}

const empty = { name: '', type: '', colors: [], weatherTags: [], occasions: [], memberId: null }

export default function Wardrobe({ wardrobe, addItem, removeItem, profile }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(empty)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterMember, setFilterMember] = useState('all')

  const members = profile?.members ?? []

  const filtered = wardrobe.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || item.type === filterType
    const matchMember = filterMember === 'all'
      || (filterMember === 'me' ? !item.memberId : item.memberId === filterMember)
    return matchSearch && matchType && matchMember
  })

  function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.type) return
    addItem({ ...form, name: form.name.trim() })
    setForm(empty)
    setAdding(false)
  }

  function toggleArr(field, val) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">My Wardrobe</h1>
          <p className="text-xs text-muted-foreground">{wardrobe.length} items</p>
        </div>
        <Button onClick={() => setAdding(a => !a)} size="sm" className="gap-1.5">
          {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {adding ? 'Cancel' : 'Add item'}
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <Card className="border-primary/30 shadow-sm">
          <CardContent className="p-4">
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name *</label>
                <Input
                  placeholder="e.g. Navy blue blazer"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoFocus
                />
              </div>

              {members.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Belongs to</label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, memberId: null }))}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all',
                        !form.memberId ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:border-primary/50'
                      )}
                    >
                      🧑 Me
                    </button>
                    {members.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, memberId: m.id }))}
                        className={cn(
                          'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all',
                          form.memberId === m.id ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:border-primary/50'
                        )}
                      >
                        {GENDER_AVATAR[m.gender] ?? '🧑'} {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type *</label>
                <Select value={form.type} onValueChange={val => setForm(f => ({ ...f, type: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLOTHING_TYPES.map(t => (
                      <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Colours</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleArr('colors', c)}
                      className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all',
                        form.colors.includes(c)
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: COLOR_HEX[c] ?? '#ccc' }}
                      />
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Weather</label>
                <div className="flex flex-wrap gap-1.5">
                  {WEATHER_TAGS.map(tag => (
                    <TagChip key={tag} label={tag} active={form.weatherTags.includes(tag)} onClick={() => toggleArr('weatherTags', tag)} />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Occasions</label>
                <div className="flex flex-wrap gap-1.5">
                  {OCCASIONS.map(occ => (
                    <TagChip key={occ} label={occ} active={form.occasions.includes(occ)} onClick={() => toggleArr('occasions', occ)} />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!form.name.trim() || !form.type}>
                <Check className="h-4 w-4 mr-1" /> Add to wardrobe
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search & filter */}
      {wardrobe.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clothes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-36">
                <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {[...new Set(wardrobe.map(i => i.type))].sort().map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {members.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[{ id: 'all', label: 'Everyone', icon: '👗' }, { id: 'me', label: 'Me', icon: '🧑' }, ...members.map(m => ({ id: m.id, label: m.name, icon: GENDER_AVATAR[m.gender] ?? '🧑' }))].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilterMember(opt.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs whitespace-nowrap border transition-all shrink-0',
                    filterMember === opt.id ? 'bg-primary text-primary-foreground border-primary font-medium' : 'border-border hover:border-primary/40'
                  )}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Item list */}
      {filtered.length === 0 && wardrobe.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">👚</p>
          <p className="font-medium">Your wardrobe is empty</p>
          <p className="text-sm mt-1">Add your first item above to get started.</p>
        </div>
      )}

      {filtered.length === 0 && wardrobe.length > 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">No items match your search.</div>
      )}

      <div className="space-y-2">
        {filtered.map(item => (
          <WardrobeItem key={item.id} item={item} members={members} onRemove={() => removeItem(item.id)} />
        ))}
      </div>
    </div>
  )
}

function WardrobeItem({ item, members, onRemove }) {
  const owner = item.memberId ? members.find(m => m.id === item.memberId) : null
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:border-primary/30 transition-colors">
      <span className="text-2xl shrink-0">{TYPE_ICONS[item.type] ?? '👔'}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-sm truncate">{item.name}</p>
          {owner && (
            <span className="text-xs shrink-0">{GENDER_AVATAR[owner.gender] ?? '🧑'}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
          {item.colors?.slice(0, 3).map(c => (
            <span
              key={c}
              className="h-3 w-3 rounded-full border border-black/10 inline-block"
              style={{ backgroundColor: COLOR_HEX[c] ?? '#ccc' }}
              title={c}
            />
          ))}
          {item.weatherTags?.map(t => (
            <Badge key={t} variant="secondary" className="text-xs py-0 px-1.5 h-4 capitalize">{t}</Badge>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

function TagChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-2.5 py-1 rounded-full text-xs border transition-all capitalize',
        active
          ? 'border-primary bg-primary text-primary-foreground font-medium'
          : 'border-border hover:border-primary/50 text-foreground'
      )}
    >
      {label}
    </button>
  )
}
