const K = {
  PROFILES:  'stylemate_profiles',
  ACTIVE_ID: 'stylemate_active_profile',
  WARDROBE:  'stylemate_wardrobe',
  SAVED:     'stylemate_saved',
  ONBOARDED: 'stylemate_onboarded',
  CALENDAR:  'stylemate_calendar_events',
}

// ── PROFILE ───────────────────────────────────────────────────────────────────

export const DEFAULT_PROFILE = {
  id: null,
  name: '',
  gender: 'men',
  build: 'average',
  ageGroup: 'adult',
  stylePrefs: ['casual'],
  occasion: 'casual',
  preferredColors: [],
  location: '',
  lat: null,
  lon: null,
  usesCatalogue: true,
  avatar: null,
}

function parseJSON(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}

export function loadProfiles() {
  return parseJSON(localStorage.getItem(K.PROFILES), [])
}

export function saveProfiles(profiles) {
  localStorage.setItem(K.PROFILES, JSON.stringify(profiles))
}

export function loadActiveProfileId() {
  return localStorage.getItem(K.ACTIVE_ID) ?? null
}

export function saveActiveProfileId(id) {
  if (id) localStorage.setItem(K.ACTIVE_ID, id)
  else localStorage.removeItem(K.ACTIVE_ID)
}

export function loadActiveProfile() {
  const profiles = loadProfiles()
  if (!profiles.length) return null
  const activeId = loadActiveProfileId()
  return profiles.find(p => p.id === activeId) ?? profiles[0]
}

export function upsertProfile(profile) {
  const profiles = loadProfiles()
  const idx = profiles.findIndex(p => p.id === profile.id)
  if (idx >= 0) profiles[idx] = profile
  else profiles.push(profile)
  saveProfiles(profiles)
}

export function deleteProfile(id) {
  const profiles = loadProfiles().filter(p => p.id !== id)
  saveProfiles(profiles)
  if (loadActiveProfileId() === id) {
    saveActiveProfileId(profiles[0]?.id ?? null)
  }
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────

export function isOnboarded() {
  return localStorage.getItem(K.ONBOARDED) === '1'
}

export function markOnboarded() {
  localStorage.setItem(K.ONBOARDED, '1')
}

// ── WARDROBE ──────────────────────────────────────────────────────────────────

export function loadWardrobe() {
  return parseJSON(localStorage.getItem(K.WARDROBE), [])
}

export function saveWardrobe(items) {
  localStorage.setItem(K.WARDROBE, JSON.stringify(items))
}

// ── SAVED OUTFITS ─────────────────────────────────────────────────────────────

export function loadSaved() {
  return parseJSON(localStorage.getItem(K.SAVED), [])
}

export function saveSaved(items) {
  localStorage.setItem(K.SAVED, JSON.stringify(items))
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

export const GENDERS = [
  { value: 'men',      label: 'Man',   icon: '👨' },
  { value: 'women',    label: 'Woman', icon: '👩' },
  { value: 'children', label: 'Child', icon: '🧒' },
]

export const MALE_BUILDS = [
  { value: 'slim',      label: 'Slim',      desc: 'Lean and narrow' },
  { value: 'average',   label: 'Average',   desc: 'Standard proportions' },
  { value: 'athletic',  label: 'Athletic',  desc: 'Broad shoulders, V-taper' },
  { value: 'broad',     label: 'Broad',     desc: 'Wide and sturdy frame' },
  { value: 'plus-size', label: 'Plus Size', desc: 'Fuller, relaxed frame' },
]

export const FEMALE_BUILDS = [
  { value: 'petite',    label: 'Petite',    desc: 'Smaller, slim frame' },
  { value: 'slim',      label: 'Slim',      desc: 'Lean and toned' },
  { value: 'curvy',     label: 'Curvy',     desc: 'Defined waist, fuller hips' },
  { value: 'athletic',  label: 'Athletic',  desc: 'Muscular and toned' },
  { value: 'plus-size', label: 'Plus Size', desc: 'Fuller, rounded frame' },
]

export const CHILD_BUILDS = [
  { value: 'slim',     label: 'Slim',    desc: 'Lean and light' },
  { value: 'average',  label: 'Average', desc: 'Typical proportions' },
  { value: 'athletic', label: 'Athletic',desc: 'Active and sturdy' },
]

export const STYLE_PREFS = [
  { value: 'casual',       label: 'Casual',       icon: '👕' },
  { value: 'smart-casual', label: 'Smart Casual', icon: '🧥' },
  { value: 'formal',       label: 'Formal',       icon: '👔' },
  { value: 'streetwear',   label: 'Streetwear',   icon: '🧢' },
  { value: 'sporty',       label: 'Sporty',       icon: '🏃' },
  { value: 'classic',      label: 'Classic',      icon: '🎩' },
  { value: 'modest',       label: 'Modest',       icon: '🧣' },
  { value: 'trendy',       label: 'Trendy',       icon: '✨' },
]

export const OCCASIONS = [
  { value: 'casual',     label: 'Casual' },
  { value: 'work',       label: 'Work' },
  { value: 'school',     label: 'School' },
  { value: 'church',     label: 'Church' },
  { value: 'party',      label: 'Party' },
  { value: 'date-night', label: 'Date Night' },
  { value: 'gym',        label: 'Gym' },
  { value: 'travel',     label: 'Travel' },
  { value: 'wedding',    label: 'Wedding' },
  { value: 'outdoor',    label: 'Outdoor' },
]

export const COLORS = [
  'black','white','grey','navy','beige','brown',
  'red','pink','orange','yellow','green','blue','purple',
  'cream','khaki','olive','burgundy','teal','coral',
]

export const CLOTHING_TYPES = [
  'tshirt','polo','dress-shirt','blouse','hoodie','sweater','cardigan','tank',
  'jeans','chinos','joggers','shorts','skirt','trousers','leggings',
  'casual-dress','work-dress','summer-dress','jumpsuit',
  'denim-jacket','bomber','raincoat','puffer','wool-coat','blazer',
  'trainers','boots','loafers','sandals','heels','formal-shoes',
  'scarf','hat','belt','watch','bag',
]

// ── CALENDAR EVENTS ───────────────────────────────────────────────────────────

export function loadCalendarEvents() {
  return parseJSON(localStorage.getItem(K.CALENDAR), [])
}

export function saveCalendarEvents(events) {
  localStorage.setItem(K.CALENDAR, JSON.stringify(events))
}

// ── LEGACY COMPATIBILITY ──────────────────────────────────────────────────────

// Legacy compatibility
export const defaultProfile = DEFAULT_PROFILE

export function loadProfile() {
  return loadActiveProfile()
}

export function saveProfile(profile) {
  upsertProfile(profile)
}
