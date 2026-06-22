import { getTempCategory } from './weatherUtils'

const OCCASION_WORDS = {
  casual: 'relaxed and comfortable',
  work: 'smart and professional',
  school: 'practical and neat',
  church: 'modest and respectful',
  party: 'stylish and fun',
  travel: 'comfortable and practical',
}

function matchesCondition(item, tempCategory, condition) {
  const warmSeasons = ['warm', 'hot', 'mild']
  const coldSeasons = ['cool', 'cold', 'freezing']

  if (item.weatherTags?.includes(condition)) return true
  if (item.weatherTags?.includes('all')) return true
  if (warmSeasons.includes(tempCategory) && item.weatherTags?.includes('warm')) return true
  if (coldSeasons.includes(tempCategory) && item.weatherTags?.includes('cold')) return true
  return false
}

function scoreItem(item, occasion, preferredColors, tempCategory, condition) {
  let score = 0
  if (matchesCondition(item, tempCategory, condition)) score += 3
  if (item.occasions?.includes(occasion)) score += 2
  if (item.occasions?.includes('casual')) score += 0.5
  if (preferredColors?.some(c => item.colors?.includes(c))) score += 1
  return score
}

function buildOutfit(wardrobe, tempCategory, condition, occasion, preferredColors, gender, seed = 0) {
  const byType = {}
  for (const item of wardrobe) {
    if (!byType[item.type]) byType[item.type] = []
    byType[item.type].push({
      ...item,
      score: scoreItem(item, occasion, preferredColors, tempCategory, condition),
    })
  }

  const pick = type => {
    const arr = (byType[type] ?? []).sort((a, b) => b.score - a.score)
    return arr.length ? arr[seed % arr.length] : null
  }

  const needsJacket = ['cold', 'freezing', 'cool'].includes(tempCategory) || condition === 'rainy'
  const needsRainwear = ['rainy', 'stormy'].includes(condition)

  const tops = ['top', 'shirt', 'blouse', 'sweater', 'hoodie']
  const bottoms = ['trousers', 'jeans', 'skirt', 'shorts', 'leggings']

  // Find best scoring top/bottom
  let topItem = null
  for (const t of tops) {
    const candidate = pick(t)
    if (candidate && candidate.score > (topItem?.score ?? -1)) topItem = candidate
  }
  let bottomItem = null
  for (const b of bottoms) {
    const candidate = pick(b)
    if (candidate && candidate.score > (bottomItem?.score ?? -1)) bottomItem = candidate
  }

  const dressPick = pick('dress')
  const outerwearPick = needsJacket ? (pick('jacket') ?? pick('coat')) : null
  const rainwearPick = needsRainwear ? pick('raincoat') ?? outerwearPick : null
  const shoesPick = pick('shoes') ?? pick('boots') ?? pick('trainers') ?? pick('sandals')
  const accessoryPick = pick('accessory') ?? pick('scarf') ?? pick('hat')

  const pieces = []

  if (dressPick && (!topItem || dressPick.score >= topItem.score)) {
    pieces.push(dressPick)
  } else {
    if (topItem) pieces.push(topItem)
    if (bottomItem) pieces.push(bottomItem)
  }

  if (rainwearPick && !pieces.includes(rainwearPick)) pieces.push(rainwearPick)
  else if (outerwearPick && !pieces.includes(outerwearPick)) pieces.push(outerwearPick)

  if (shoesPick) pieces.push(shoesPick)
  if (accessoryPick) pieces.push(accessoryPick)

  return pieces.filter(Boolean)
}

function describeOutfit(pieces, tempCategory, condition, occasion) {
  if (!pieces.length) return 'Add some clothes to your wardrobe to get personalised recommendations!'
  const names = pieces.map(p => p.name)
  const last = names.pop()
  const list = names.length ? `${names.join(', ')} and ${last}` : last
  const tempDesc = { freezing: 'very cold', cold: 'cold', cool: 'cool', mild: 'mild', warm: 'warm', hot: 'hot' }[tempCategory] ?? 'current'
  return `Perfect for ${OCCASION_WORDS[occasion] ?? occasion} vibes on a ${tempDesc}, ${condition === 'rainy' ? 'rainy' : condition} day — ${list}.`
}

export function generateOutfits(wardrobe, weather, profile, seeds = {}) {
  if (!wardrobe?.length) return []

  const { tempCategory, condition } = weather
  const occasion = profile?.defaultOccasion ?? 'casual'
  const preferredColors = profile?.preferredColors ?? []
  const gender = profile?.gender ?? 'all'

  const outfits = []

  const ctx = { tempCategory, condition, gender }

  // Primary outfit for current occasion
  const primaryPieces = buildOutfit(wardrobe, tempCategory, condition, occasion, preferredColors, gender, seeds.primary ?? 0)
  if (primaryPieces.length) {
    outfits.push({
      id: 'primary',
      label: "Today's Outfit",
      occasion,
      context: ctx,
      pieces: primaryPieces,
      description: describeOutfit(primaryPieces, tempCategory, condition, occasion),
    })
  }

  // Rain alternative if not already rainy
  if (condition !== 'rainy' && condition !== 'stormy') {
    const rainPieces = buildOutfit(wardrobe, tempCategory, 'rainy', occasion, preferredColors, gender, seeds.rain ?? 0)
    if (rainPieces.length) {
      outfits.push({
        id: 'rain',
        label: 'If It Rains',
        occasion,
        context: { ...ctx, condition: 'rainy' },
        pieces: rainPieces,
        description: describeOutfit(rainPieces, tempCategory, 'rainy', occasion),
      })
    }
  }

  // Evening/smart alternative
  const eveningOccasion = occasion === 'casual' ? 'work' : 'casual'
  const eveningPieces = buildOutfit(wardrobe, tempCategory, condition, eveningOccasion, preferredColors, gender, seeds.evening ?? 0)
  if (eveningPieces.length && JSON.stringify(eveningPieces.map(p => p.id)) !== JSON.stringify(primaryPieces.map(p => p.id))) {
    outfits.push({
      id: 'evening',
      label: occasion === 'casual' ? 'Smarter Option' : 'Casual Option',
      occasion: eveningOccasion,
      context: ctx,
      pieces: eveningPieces,
      description: describeOutfit(eveningPieces, tempCategory, condition, eveningOccasion),
    })
  }

  return outfits
}

export function getOutfitTip(tempC, condition, hourlyData) {
  const tips = []
  if (condition === 'rainy') tips.push('Grab an umbrella before you head out.')
  if (condition === 'stormy') tips.push('Stay indoors if possible — storms expected.')
  if (tempC < 5) tips.push('Layer up — it\'s freezing today.')
  if (tempC > 28) tips.push('Stay hydrated and wear light, breathable fabrics.')

  // Check if evening gets colder
  if (hourlyData) {
    const evening = hourlyData.temperature_2m?.slice(18, 22) ?? []
    const eveningMin = Math.min(...evening)
    if (eveningMin < tempC - 5) tips.push(`It cools to ${Math.round(eveningMin)}°C this evening — bring a jacket.`)
  }

  return tips
}
