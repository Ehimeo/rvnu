const BODY = '#C4B5A8'

const SWATCH = {
  black:'#1c1c1c', white:'#f0efed', grey:'#9ca3af', navy:'#1e3a5f',
  beige:'#d4b896', brown:'#92400e', red:'#dc2626', pink:'#f472b6',
  orange:'#f97316', yellow:'#fbbf24', green:'#16a34a', blue:'#3b82f6',
  purple:'#8b5cf6', cream:'#fef3c7', khaki:'#92733a', olive:'#6b7c21',
  burgundy:'#881337', teal:'#0d9488', coral:'#fb7185',
  nude:'#d4a090', blush:'#fecdd3', floral:'#e879a0',
}

const TOP_TYPES   = new Set(['tshirt','polo','dress-shirt','blouse','hoodie','sweater','cardigan','tank'])
const BOTTOM_TYPES = new Set(['jeans','chinos','joggers','shorts','skirt','trousers','leggings'])
const DRESS_TYPES  = new Set(['casual-dress','work-dress','summer-dress'])
const SUIT_TYPES   = new Set(['jumpsuit'])
const OUTER_TYPES  = new Set(['denim-jacket','bomber','raincoat','puffer','wool-coat','blazer'])
const SHOE_TYPES   = new Set(['trainers','boots','loafers','sandals','heels','formal-shoes'])

function col(piece) {
  return SWATCH[piece?.colors?.[0]] ?? '#8899aa'
}

// Each shape: torso, lArm, rArm, lLeg, rLeg, skirt polygon strings + shoe positions
const SHAPES = {
  men: {
    slim:       { torso:'44,83 156,83 152,142 142,190 140,245 60,245 58,190 48,142', lArm:'44,83 22,88 18,215 40,215', rArm:'156,83 178,88 182,215 160,215', lLeg:'60,245 97,245 93,492 56,492', rLeg:'103,245 140,245 144,492 107,492', skirt:'60,245 140,245 160,492 40,492', lShoeCx:74, rShoeCx:126, shoeCy:500 },
    average:    { torso:'38,83 162,83 158,142 148,190 146,245 54,245 52,190 42,142', lArm:'38,83 14,88 10,215 34,215', rArm:'162,83 186,88 190,215 166,215', lLeg:'54,245 97,245 93,492 50,492', rLeg:'103,245 146,245 150,492 107,492', skirt:'54,245 146,245 164,492 36,492', lShoeCx:73, rShoeCx:127, shoeCy:500 },
    athletic:   { torso:'24,83 176,83 170,142 152,190 150,245 50,245 48,190 30,142', lArm:'24,83 2,88 0,215 22,215', rArm:'176,83 198,88 200,215 178,215', lLeg:'50,245 97,245 93,492 46,492', rLeg:'103,245 150,245 154,492 107,492', skirt:'50,245 150,245 166,492 34,492', lShoeCx:71, rShoeCx:129, shoeCy:500 },
    broad:      { torso:'18,83 182,83 178,142 162,190 160,245 40,245 38,190 22,142', lArm:'18,83 0,88 0,215 16,215', rArm:'182,83 200,88 200,215 184,215', lLeg:'40,245 97,245 93,492 36,492', rLeg:'103,245 160,245 164,492 107,492', skirt:'40,245 160,245 176,492 24,492', lShoeCx:67, rShoeCx:133, shoeCy:500 },
    'plus-size':{ torso:'20,83 180,83 184,140 182,188 178,245 22,245 18,188 16,140', lArm:'20,83 0,88 0,215 16,215', rArm:'180,83 200,88 200,215 184,215', lLeg:'22,245 97,245 93,492 18,492', rLeg:'103,245 178,245 182,492 107,492', skirt:'22,245 178,245 194,492 6,492', lShoeCx:57, rShoeCx:143, shoeCy:500 },
  },
  women: {
    petite:     { torso:'52,83 148,83 146,142 138,190 142,245 58,245 62,190 54,142', lArm:'52,83 30,88 26,208 48,208', rArm:'148,83 170,88 174,208 152,208', lLeg:'58,245 96,245 92,484 54,484', rLeg:'104,245 142,245 146,484 108,484', skirt:'58,245 142,245 158,490 42,490', lShoeCx:73, rShoeCx:127, shoeCy:492 },
    slim:       { torso:'46,83 154,83 150,142 142,190 146,245 54,245 58,190 50,142', lArm:'46,83 24,88 20,215 42,215', rArm:'154,83 176,88 180,215 158,215', lLeg:'54,245 96,245 92,492 50,492', rLeg:'104,245 146,245 150,492 108,492', skirt:'54,245 146,245 162,492 38,492', lShoeCx:72, rShoeCx:128, shoeCy:500 },
    curvy:      { torso:'42,83 158,83 152,142 144,190 168,245 32,245 56,190 48,142', lArm:'42,83 20,88 16,215 38,215', rArm:'158,83 180,88 184,215 162,215', lLeg:'32,245 96,245 90,492 26,492', rLeg:'104,245 168,245 174,492 110,492', skirt:'32,245 168,245 186,492 14,492', lShoeCx:58, rShoeCx:142, shoeCy:500 },
    athletic:   { torso:'32,83 168,83 162,142 150,190 152,245 48,245 50,190 38,142', lArm:'32,83 8,88 4,215 28,215', rArm:'168,83 192,88 196,215 172,215', lLeg:'48,245 96,245 92,492 44,492', rLeg:'104,245 152,245 156,492 108,492', skirt:'48,245 152,245 168,492 32,492', lShoeCx:68, rShoeCx:132, shoeCy:500 },
    'plus-size':{ torso:'26,83 174,83 176,140 172,188 174,245 26,245 28,188 24,140', lArm:'26,83 2,88 0,215 22,215', rArm:'174,83 198,88 200,215 178,215', lLeg:'26,245 96,245 92,492 22,492', rLeg:'104,245 174,245 178,492 108,492', skirt:'26,245 174,245 190,492 10,492', lShoeCx:57, rShoeCx:143, shoeCy:500 },
  },
  children: {
    slim:       { torso:'52,82 148,82 146,122 138,158 142,205 58,205 62,158 54,122', lArm:'52,82 32,86 28,195 48,195', rArm:'148,82 168,86 172,195 152,195', lLeg:'58,205 96,205 92,430 54,430', rLeg:'104,205 142,205 146,430 108,430', skirt:'58,205 142,205 158,430 42,430', lShoeCx:73, rShoeCx:127, shoeCy:438 },
    average:    { torso:'46,82 154,82 152,122 144,158 148,205 52,205 56,158 48,122', lArm:'46,82 24,86 20,195 42,195', rArm:'154,82 176,86 180,195 158,195', lLeg:'52,205 96,205 92,430 48,430', rLeg:'104,205 148,205 152,430 108,430', skirt:'52,205 148,205 164,430 36,430', lShoeCx:70, rShoeCx:130, shoeCy:438 },
    athletic:   { torso:'40,82 160,82 158,122 148,158 150,205 50,205 52,158 42,122', lArm:'40,82 18,86 14,195 36,195', rArm:'160,82 182,86 186,195 164,195', lLeg:'50,205 96,205 92,430 46,430', rLeg:'104,205 150,205 154,430 108,430', skirt:'50,205 150,205 166,430 34,430', lShoeCx:68, rShoeCx:132, shoeCy:438 },
  },
}

function getShape(gender, build) {
  const g = gender === 'children' ? 'children' : gender === 'women' ? 'women' : 'men'
  const builds = SHAPES[g]
  return builds[build] ?? builds[Object.keys(builds)[1]] ?? Object.values(builds)[0]
}

function ClothingOverlays({ pieces, shape }) {
  const top   = pieces.find(p => TOP_TYPES.has(p.type))
  const btm   = pieces.find(p => BOTTOM_TYPES.has(p.type))
  const dress = pieces.find(p => DRESS_TYPES.has(p.type))
  const suit  = pieces.find(p => SUIT_TYPES.has(p.type))
  const outer = pieces.find(p => OUTER_TYPES.has(p.type))
  const shoe  = pieces.find(p => SHOE_TYPES.has(p.type))

  const isSkirt = btm?.type === 'skirt'

  return (
    <>
      {/* Full dress (torso + skirt, bare arms) */}
      {dress && !top && !btm && (
        <>
          <polygon points={shape.torso} fill={col(dress)} opacity="0.93" />
          <polygon points={shape.skirt} fill={col(dress)} opacity="0.93" />
        </>
      )}

      {/* Jumpsuit (torso + separate legs) */}
      {suit && !top && !btm && (
        <>
          <polygon points={shape.torso} fill={col(suit)} opacity="0.93" />
          <polygon points={shape.lArm}  fill={col(suit)} opacity="0.88" />
          <polygon points={shape.rArm}  fill={col(suit)} opacity="0.88" />
          <polygon points={shape.lLeg}  fill={col(suit)} opacity="0.93" />
          <polygon points={shape.rLeg}  fill={col(suit)} opacity="0.93" />
        </>
      )}

      {/* Top */}
      {top && (
        <>
          <polygon points={shape.torso} fill={col(top)} opacity="0.93" />
          <polygon points={shape.lArm}  fill={col(top)} opacity="0.88" />
          <polygon points={shape.rArm}  fill={col(top)} opacity="0.88" />
        </>
      )}

      {/* Bottom — skirt vs trousers */}
      {btm && isSkirt && (
        <polygon points={shape.skirt} fill={col(btm)} opacity="0.93" />
      )}
      {btm && !isSkirt && (
        <>
          <polygon points={shape.lLeg} fill={col(btm)} opacity="0.93" />
          <polygon points={shape.rLeg} fill={col(btm)} opacity="0.93" />
        </>
      )}

      {/* Outerwear — slightly wider via transform */}
      {outer && (
        <g transform="translate(100,165) scale(1.08) translate(-100,-165)">
          <polygon points={shape.torso} fill={col(outer)} opacity="0.90" />
          <polygon points={shape.lArm}  fill={col(outer)} opacity="0.86" />
          <polygon points={shape.rArm}  fill={col(outer)} opacity="0.86" />
        </g>
      )}

      {/* Shoes */}
      {shoe && (
        <>
          <ellipse cx={shape.lShoeCx} cy={shape.shoeCy} rx="23" ry="11" fill={col(shoe)} opacity="0.93" />
          <ellipse cx={shape.rShoeCx} cy={shape.shoeCy} rx="23" ry="11" fill={col(shoe)} opacity="0.93" />
        </>
      )}
    </>
  )
}

export default function Mannequin({ pieces = [], gender = 'men', build = 'average', width = 110, height = 290 }) {
  const shape = getShape(gender, build)
  const isChild = gender === 'children'
  const hCy = isChild ? 46 : 47
  const hR  = isChild ? 30 : 27
  const neck = isChild
    ? '92,76 108,76 110,82 90,82'
    : '90,74 110,74 112,83 88,83'

  return (
    <svg
      viewBox="0 0 200 520"
      width={width}
      height={height}
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Body base */}
      <circle cx="100" cy={hCy} r={hR}  fill={BODY} />
      <polygon points={neck}          fill={BODY} />
      <polygon points={shape.lArm}    fill={BODY} />
      <polygon points={shape.rArm}    fill={BODY} />
      <polygon points={shape.torso}   fill={BODY} />
      <polygon points={shape.lLeg}    fill={BODY} />
      <polygon points={shape.rLeg}    fill={BODY} />
      <ellipse cx={shape.lShoeCx} cy={shape.shoeCy} rx="22" ry="10" fill={BODY} />
      <ellipse cx={shape.rShoeCx} cy={shape.shoeCy} rx="22" ry="10" fill={BODY} />

      {/* Clothing overlays */}
      <ClothingOverlays pieces={pieces} shape={shape} />

      {/* Subtle edge highlight on torso */}
      <polygon points={shape.torso} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    </svg>
  )
}
