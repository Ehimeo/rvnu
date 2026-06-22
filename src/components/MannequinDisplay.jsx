const COLOR_MAP = {
  black: '#1a1a1a', white: '#f0f0f0', grey: '#9ca3af', navy: '#1e3a5f',
  beige: '#d4b896', brown: '#92400e', red: '#dc2626', pink: '#ec4899',
  orange: '#f97316', yellow: '#eab308', green: '#16a34a', blue: '#2563eb',
  purple: '#7c3aed', cream: '#fffbeb', khaki: '#a16207', olive: '#65a30d',
  burgundy: '#881337', teal: '#0f766e', coral: '#fb7185',
}

const SKIN = '#e8c5a0'
const HAIR_M = '#2c1810'
const HAIR_F = '#4a2c20'
const STROKE = { stroke: 'rgba(0,0,0,0.13)', strokeWidth: '1', strokeLinejoin: 'round' }

function pieceColor(piece, fallback = '#c8b8a2') {
  return COLOR_MAP[piece?.colors?.[0]] ?? fallback
}

const isFem = g => g === 'woman' || g === 'girl'

export default function MannequinDisplay({ pieces = [], gender = 'all' }) {
  const fem = isFem(gender)

  const top    = pieces.find(p => ['shirt','blouse','top','sweater','hoodie'].includes(p.type))
  const bottom = pieces.find(p => ['trousers','jeans','skirt','shorts','leggings'].includes(p.type))
  const dress  = pieces.find(p => ['dress','jumpsuit'].includes(p.type))
  const outer  = pieces.find(p => ['jacket','coat','raincoat','cardigan'].includes(p.type))
  const shoes  = pieces.find(p => ['shoes','boots','trainers','sandals','heels'].includes(p.type))
  const scarf  = pieces.find(p => p.type === 'scarf')

  const topC   = pieceColor(top)
  const botC   = pieceColor(bottom, '#4b5563')
  const dressC = pieceColor(dress, '#d4b4c8')
  const outC   = pieceColor(outer, '#374151')
  const shoeC  = pieceColor(shoes, '#1a1a1a')
  const scarfC = pieceColor(scarf, '#b91c1c')

  // Coordinate system: viewBox 0 0 180 400
  const torso = fem
    ? '36,90 144,90 128,205 146,215 34,215 52,205'
    : '30,90 150,90 138,215 42,215'

  const lArm = fem ? '36,90 18,92 14,190 32,190' : '30,90 12,92 8,192 28,192'
  const rArm = fem ? '144,90 162,92 166,190 148,190' : '150,90 168,92 172,192 152,192'

  const lLeg = fem ? '44,215 86,215 84,355 42,355' : '42,215 88,215 86,355 40,355'
  const rLeg = fem ? '94,215 136,215 138,355 96,355' : '92,215 138,215 140,355 94,355'

  // Outerwear is slightly wider than top
  const outerTorso = fem
    ? '28,88 152,88 134,205 152,215 28,215 46,205'
    : '22,88 158,88 144,215 36,215'
  const outerLArm = fem ? '28,88 10,90 6,200 26,200' : '22,88 4,90 0,202 22,202'
  const outerRArm = fem ? '152,88 170,90 174,200 154,200' : '158,88 176,90 180,202 158,202'

  const isSkirtBottom = bottom && ['skirt','shorts'].includes(bottom.type)

  return (
    <svg viewBox="0 0 180 400" width="110" height="245" xmlns="http://www.w3.org/2000/svg" aria-label="Outfit mannequin">

      {/* === BASE SKIN === */}
      {!dress && <polygon points={lLeg} fill={SKIN} />}
      {!dress && <polygon points={rLeg} fill={SKIN} />}
      <polygon points={torso} fill={SKIN} />
      <polygon points={lArm} fill={SKIN} />
      <polygon points={rArm} fill={SKIN} />

      {/* === BOTTOM CLOTHING === */}
      {!dress && bottom && (
        isSkirtBottom
          ? <polygon points="32,215 148,215 160,355 20,355" fill={botC} {...STROKE} />
          : <>
              <polygon points={lLeg} fill={botC} {...STROKE} />
              <polygon points={rLeg} fill={botC} {...STROKE} />
            </>
      )}

      {/* === TOP CLOTHING === */}
      {!dress && top && (
        <>
          <polygon points={torso} fill={topC} {...STROKE} />
          <polygon points={lArm} fill={topC} {...STROKE} />
          <polygon points={rArm} fill={topC} {...STROKE} />
        </>
      )}

      {/* === DRESS === */}
      {dress && (
        <>
          <polygon
            points={fem
              ? '36,90 144,90 128,205 158,355 22,355 52,205'
              : '30,90 150,90 158,355 22,355'}
            fill={dressC} {...STROKE}
          />
          <polygon points={lArm} fill={dressC} {...STROKE} />
          <polygon points={rArm} fill={dressC} {...STROKE} />
        </>
      )}

      {/* === OUTERWEAR === */}
      {outer && (
        <>
          <polygon points={outerTorso} fill={outC} opacity="0.88" {...STROKE} />
          <polygon points={outerLArm} fill={outC} opacity="0.88" {...STROKE} />
          <polygon points={outerRArm} fill={outC} opacity="0.88" {...STROKE} />
          {/* Lapel hint */}
          <polygon points="83,90 90,118 87,215 80,215 84,118 77,90" fill="rgba(255,255,255,0.1)" />
          <polygon points="97,90 90,118 93,215 100,215 96,118 103,90" fill="rgba(255,255,255,0.1)" />
        </>
      )}

      {/* === SHOES === */}
      {shoes && (
        <>
          <ellipse cx="63" cy="358" rx="24" ry="9" fill={shoeC} />
          <ellipse cx="117" cy="360" rx="24" ry="9" fill={shoeC} />
        </>
      )}

      {/* === SCARF (at neck, above outerwear) === */}
      {scarf && (
        <ellipse cx="90" cy="79" rx="20" ry="11" fill={scarfC} opacity="0.9" />
      )}

      {/* === HEAD (always rendered last / on top) === */}
      {/* Hair back */}
      {fem
        ? <ellipse cx="90" cy="24" rx="30" ry="26" fill={HAIR_F} />
        : <ellipse cx="90" cy="22" rx="30" ry="19" fill={HAIR_M} />
      }
      {/* Long feminine side strands (behind face) */}
      {fem && (
        <>
          <path d="M 62,36 C 56,60 54,90 58,118" stroke={HAIR_F} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M 118,36 C 124,60 126,90 122,118" stroke={HAIR_F} strokeWidth="9" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Neck */}
      <rect x="78" y="63" width="24" height="29" fill={SKIN} rx="3" />
      {/* Face */}
      <circle cx="90" cy="38" r="26" fill={SKIN} />
      {/* Eyes */}
      <circle cx="82" cy="34" r="3.5" fill="#2c1810" />
      <circle cx="98" cy="34" r="3.5" fill="#2c1810" />
      <circle cx="83.2" cy="32.8" r="1.2" fill="white" opacity="0.7" />
      <circle cx="99.2" cy="32.8" r="1.2" fill="white" opacity="0.7" />
      {/* Eyebrows */}
      <path d="M 76,27 Q 82,24 87,26" stroke="#2c1810" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 93,26 Q 98,24 104,27" stroke="#2c1810" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Nose (subtle) */}
      <path d="M 90,37 C 88,41 87,43 88,44 Q 90,45 92,44 C 93,43 92,41 90,37" fill="rgba(0,0,0,0.08)" />
      {/* Mouth */}
      {fem
        ? <path d="M 83,48 Q 90,52 97,48 Q 90,55 83,48 Z" fill="#c0717a" />
        : <path d="M 84,49 Q 90,52 96,49" stroke="#9a6656" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      }
    </svg>
  )
}
