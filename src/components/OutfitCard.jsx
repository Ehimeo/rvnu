import { useState, useEffect } from 'react'
import { Heart, Shuffle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import MannequinDisplay from './MannequinDisplay'
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

export default function OutfitCard({ outfit, saved, onSave, onShuffle }) {
  const [expanded, setExpanded] = useState(true)
  const [aiName, setAiName] = useState(null)
  const [aiTip, setAiTip] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const pieceKey = outfit?.pieces?.map(p => p.id).join(',') ?? ''

  useEffect(() => {
    if (!outfit?.pieces?.length) return
    setAiName(null)
    setAiTip(null)
    setAiLoading(true)

    const controller = new AbortController()

    fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        pieces: outfit.pieces.map(p => ({ name: p.name, type: p.type, colors: p.colors })),
        tempCategory: outfit.context?.tempCategory,
        condition: outfit.context?.condition,
        occasion: outfit.occasion,
        gender: outfit.context?.gender,
      }),
    })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.name) setAiName(data.name)
        if (data?.tip) setAiTip(data.tip)
      })
      .catch(() => {})
      .finally(() => setAiLoading(false))

    return () => controller.abort()
  }, [pieceKey]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!outfit?.pieces?.length) return null

  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Category label */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
              {outfit.label}
            </p>

            {/* AI outfit name */}
            {aiLoading && !aiName && (
              <div className="h-6 w-36 rounded bg-muted animate-pulse mb-1" />
            )}
            {aiName && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                <h3 className="text-base font-bold leading-tight">{aiName}</h3>
              </div>
            )}
            {!aiName && !aiLoading && (
              <h3 className="text-base font-semibold leading-tight">{outfit.label}</h3>
            )}

            {/* Tip or description */}
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              {aiTip ?? outfit.description}
            </p>
          </div>

          <div className="flex gap-0.5 shrink-0">
            {onShuffle && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={onShuffle}
                title="Try a different combination"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8', saved && 'text-red-500')}
              onClick={onSave}
              title={saved ? 'Saved' : 'Save outfit'}
            >
              <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpanded(e => !e)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="flex gap-3 items-start">
            {/* Mannequin */}
            <div className="shrink-0 flex items-center justify-center rounded-xl bg-muted/30 py-1">
              <MannequinDisplay
                pieces={outfit.pieces}
                gender={outfit.context?.gender}
              />
            </div>

            {/* Piece list */}
            <div className="flex-1 min-w-0 space-y-1.5 pt-1">
              {outfit.pieces.map(piece => (
                <PieceRow key={piece.id} piece={piece} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            <Badge variant="secondary" className="capitalize text-xs">{outfit.occasion}</Badge>
            <div className="flex gap-1 ml-auto flex-wrap">
              {[...new Set(outfit.pieces.flatMap(p => p.colors ?? []))].slice(0, 6).map(color => (
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
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
      <span className="text-lg leading-none">{TYPE_ICONS[piece.type] ?? '👔'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{piece.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{piece.type}</p>
      </div>
      <div className="flex gap-1 shrink-0">
        {piece.colors?.slice(0, 2).map(c => <ColorDot key={c} color={c} />)}
      </div>
    </div>
  )
}

function ColorDot({ color }) {
  const hex = COLOR_SWATCHES[color] ?? '#ccc'
  return (
    <div
      className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
      style={{ backgroundColor: hex }}
      title={color}
    />
  )
}
