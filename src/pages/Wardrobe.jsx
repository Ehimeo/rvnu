import { useState } from 'react'
import { Plus, Trash2, Search, Check } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { CATALOGUE } from '../data/catalogue'
import { CLOTHING_TYPES, COLORS } from '../data/store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { cn } from '../utils/cn'

const COLOR_HEX = {
  black:'#1a1a1a', white:'#f5f5f5', grey:'#9ca3af', navy:'#1e3a5f',
  beige:'#d4b896', brown:'#92400e', red:'#dc2626', pink:'#ec4899',
  orange:'#f97316', yellow:'#eab308', green:'#16a34a', blue:'#2563eb',
  purple:'#7c3aed', cream:'#fffbeb', khaki:'#a16207', olive:'#65a30d',
  burgundy:'#881337', teal:'#0f766e', coral:'#fb7185',
}

const TYPE_ICONS = {
  tshirt:'👕', polo:'👕', 'dress-shirt':'👔', blouse:'👚', hoodie:'🧥', sweater:'🧥', cardigan:'🧥', tank:'🎽',
  jeans:'👖', chinos:'👖', joggers:'👖', shorts:'🩳', skirt:'👗', trousers:'👖', leggings:'🩱',
  'casual-dress':'👗', 'work-dress':'👗', 'summer-dress':'👗', jumpsuit:'🧥',
  'denim-jacket':'🧥', bomber:'🧥', raincoat:'🌂', puffer:'🧥', 'wool-coat':'🧥', blazer:'🧥',
  trainers:'👟', boots:'👢', loafers:'👞', sandals:'👡', heels:'👠', 'formal-shoes':'👞',
  scarf:'🧣', hat:'🎩', belt:'👔', watch:'⌚', bag:'👜',
}

function CatalogueBrowser({ profile, wardrobe, addItem, removeItem }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const gender = profile?.gender ?? 'men'

  const ownedIds = new Set(wardrobe.map(i => i.catalogueId).filter(Boolean))

  const items = CATALOGUE.filter(item => {
    const matchGender = item.gender.includes(gender) || item.gender.includes('all')
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || item.type === typeFilter
    return matchGender && matchSearch && matchType
  })

  const toggle = (item) => {
    if (ownedIds.has(item.id)) {
      const wardrobeItem = wardrobe.find(w => w.catalogueId === item.id)
      if (wardrobeItem) removeItem(wardrobeItem.id)
    } else {
      addItem({ catalogueId: item.id, name: item.name, type: item.type, colors: item.colors })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full h-10 rounded-xl border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Search catalogue…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 h-10 rounded-xl">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {[...new Set(CATALOGUE.filter(i => i.gender.includes(gender)).map(i => i.type))].sort().map(t => (
              <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">{items.length} items · tap to add to your wardrobe</p>

      <div className="space-y-2">
        {items.map(item => {
          const owned = ownedIds.has(item.id)
          return (
            <button
              key={item.id}
              onClick={() => toggle(item)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                owned ? 'border-primary bg-secondary/50' : 'border-border bg-card hover:border-primary/40'
              )}
            >
              <span className="text-xl shrink-0">{TYPE_ICONS[item.type] ?? '👔'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  {item.colors.map(c => (
                    <span key={c} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: COLOR_HEX[c] ?? '#ccc' }} />
                  ))}
                  <Badge variant="secondary" className="text-[10px] px-1.5 h-4 capitalize ml-auto">{item.formality}</Badge>
                </div>
              </div>
              <div className={cn('h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                owned ? 'border-primary bg-primary' : 'border-border')}>
                {owned && <Check className="h-3.5 w-3.5 text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MyItems({ wardrobe, addItem, removeItem }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', colors: [] })

  const handleAdd = () => {
    if (!form.name.trim() || !form.type) return
    addItem({ name: form.name.trim(), type: form.type, colors: form.colors })
    setForm({ name: '', type: '', colors: [] })
    setAdding(false)
  }

  const custom = wardrobe.filter(i => !i.catalogueId)

  return (
    <div className="space-y-3">
      <Button onClick={() => setAdding(a => !a)} variant="outline" className="w-full h-10 rounded-xl gap-2">
        <Plus className="h-4 w-4" /> Add custom item
      </Button>

      {adding && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <input className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Item name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {CLOTHING_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <div>
              <p className="text-xs font-medium mb-1.5">Colours</p>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x=>x!==c) : [...f.colors, c] }))}
                    className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all',
                      form.colors.includes(c) ? 'border-primary bg-secondary font-medium' : 'border-border')}>
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: COLOR_HEX[c] ?? '#ccc' }} />
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAdding(false)} className="flex-1 h-9 rounded-xl">Cancel</Button>
              <Button onClick={handleAdd} className="flex-1 h-9 rounded-xl gradient-primary text-white border-0" disabled={!form.name.trim() || !form.type}>Add</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {custom.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground text-center py-8">No custom items yet.<br />Add items that aren't in the catalogue.</p>
      )}

      <div className="space-y-2">
        {custom.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
            <span className="text-xl shrink-0">{TYPE_ICONS[item.type] ?? '👔'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                {item.colors?.map(c => (
                  <span key={c} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: COLOR_HEX[c] ?? '#ccc' }} />
                ))}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeItem(item.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Wardrobe({ wardrobe, addItem, removeItem, profile }) {
  const [tab, setTab] = useState('catalogue')
  const ownedCount = wardrobe.filter(i => i.catalogueId).length

  return (
    <div className="pb-6 space-y-4">
      <div className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight">Wardrobe</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{wardrobe.length} item{wardrobe.length !== 1 ? 's' : ''} owned</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1">
        <button onClick={() => setTab('catalogue')}
          className={cn('flex-1 py-2 text-sm font-semibold rounded-lg transition-all', tab === 'catalogue' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}>
          Catalogue
        </button>
        <button onClick={() => setTab('mine')}
          className={cn('flex-1 py-2 text-sm font-semibold rounded-lg transition-all', tab === 'mine' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}>
          Custom {wardrobe.filter(i=>!i.catalogueId).length > 0 ? `(${wardrobe.filter(i=>!i.catalogueId).length})` : ''}
        </button>
      </div>

      {tab === 'catalogue' && (
        <CatalogueBrowser profile={profile} wardrobe={wardrobe} addItem={addItem} removeItem={removeItem} />
      )}
      {tab === 'mine' && (
        <MyItems wardrobe={wardrobe} addItem={addItem} removeItem={removeItem} />
      )}
    </div>
  )
}
