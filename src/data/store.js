const KEYS = {
  PROFILE: 'asstitude_profile',
  WARDROBE: 'asstitude_wardrobe',
  DISMISSED_GEO: 'asstitude_geo_dismissed',
}

export const defaultProfile = {
  name: '',
  gender: 'woman',
  ageGroup: 'adult',
  location: '',
  lat: null,
  lon: null,
  defaultOccasion: 'casual',
  preferredColors: [],
  modestyLevel: 'standard',
  styleNotes: '',
  members: [],
}

export function loadGeoDismissed() {
  return localStorage.getItem(KEYS.DISMISSED_GEO) === '1'
}

export function saveGeoDismissed() {
  localStorage.setItem(KEYS.DISMISSED_GEO, '1')
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE)
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : null
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
}

export function loadWardrobe() {
  try {
    const raw = localStorage.getItem(KEYS.WARDROBE)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveWardrobe(wardrobe) {
  localStorage.setItem(KEYS.WARDROBE, JSON.stringify(wardrobe))
}

export const CLOTHING_TYPES = [
  'shirt', 'blouse', 'top', 'sweater', 'hoodie',
  'trousers', 'jeans', 'skirt', 'shorts', 'leggings',
  'dress', 'jumpsuit',
  'jacket', 'coat', 'raincoat', 'cardigan',
  'shoes', 'boots', 'trainers', 'sandals', 'heels',
  'accessory', 'scarf', 'hat', 'belt', 'bag',
]

export const WEATHER_TAGS = ['warm', 'cold', 'rainy', 'sunny', 'all']

export const OCCASIONS = ['casual', 'work', 'school', 'church', 'party', 'travel']

export const COLORS = [
  'black', 'white', 'grey', 'navy', 'beige', 'brown',
  'red', 'pink', 'orange', 'yellow', 'green', 'blue', 'purple',
  'cream', 'khaki', 'olive', 'burgundy', 'teal', 'coral',
]

export const GENDER_OPTIONS = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'girl', label: 'Girl (child)' },
  { value: 'boy', label: 'Boy (child)' },
]

export const AGE_GROUPS = [
  { value: 'adult', label: 'Adult' },
  { value: 'teen', label: 'Teen' },
  { value: 'child', label: 'Child' },
]
