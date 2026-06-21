import { useState } from 'react'
import { Heart, RefreshCw, ChevronDown, ChevronUp, Shirt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '../utils/cn'

const TYPE_ICONS = {
  shirt: '👕', blouse: '👚', top: '👕', sweater: '🧥', hoodie: '🧥',
  trousers: '👖', jeans: '👖', skirt: '👗', shorts: '🩳', leggings: '🩱',
  dress: '👗', jumpsuit: '🧥',
  jacket: '🧥', coat: '🧥', raincoat: '🌂', cardigan: '🧥',
  shoes: '👟', boots: '👢', trainers: '👟', sandals: '👡', heels: '👠',
  accessory: '✨', scarf: '🧣', hat: '🎩', belt: '👔', bag: '👜',
}

const COLOR_SWATCHES = {
  black: '#1a1a1a', white: '#f5f5f5', grey: '#9ca3af', navy: '#1e3a5f',
  beige: '#d4b896', brown: '#92400e', red: '#dc2626', pink: '#ec4899',
  orange: '#f97316', yellow: '#eab308', green: '#16a34a', blue: '#2563eb',
  purple: '#7c3aed', cream: '#fffbeb', khaki: '#a16207', olive: '#65a30d',
  burgundy: '#881337', teal: '#0f766e', coral: '#fb7185',
}

export default function OutfitCard({ outfit, saved, onSave, onDislike }) {
  const [expanded, setExpanded] = useState(true)

  if (!outfit?.pieces?.length) return null

  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{outfit.label}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', saved && 'text-red-500')}
              onClick={onSave}
              title={saved ? 'Saved' : 'Save outfit'}
            >
              <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(e => !e)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{outfit.description}</p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2">
            {outfit.pieces.map(piece => (
              <PieceRow key={piece.id} piece={piece} />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
            <Badge variant="secondary" className="capitalize">{outfit.occasion}</Badge>
            <div className="flex gap-1 ml-auto flex-wrap">
              {[...new Set(outfit.pieces.flatMap(p => p.colors ?? []))].slice(0, 5).map(color => (
                <ColorDot key={color} color={color} />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function PieceRow({ piece }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
      <span className="text-xl">{TYPE_ICONS[piece.type] ?? '👔'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{piece.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{piece.type}</p>
      </div>
      <div className="flex gap-1">
        {piece.colors?.slice(0, 3).map(c => <ColorDot key={c} color={c} />)}
      </div>
    </div>
  )
}

function ColorDot({ color }) {
  const hex = COLOR_SWATCHES[color] ?? '#ccc'
  return (
    <div
      className="h-4 w-4 rounded-full border border-black/10 shrink-0"
      style={{ backgroundColor: hex }}
      title={color}
    />
  )
}
