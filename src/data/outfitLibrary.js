// StyleMate Outfit Library
// Curated combinations covering major weather, occasion & season scenarios

export const OUTFIT_LIBRARY = [
  // ── CASUAL SUMMER – MEN ───────────────────────────────────────
  { id:'ol_m_summer_casual_1', name:'Weekend Breeze',     gender:'men', season:'summer', occasion:'casual',  weatherTags:['warm','hot'],  itemIds:['c_m_tee_white','c_m_shorts_navy','c_m_train_white'], styleTip:'Keep it minimal — a white tee never fails.' },
  { id:'ol_m_summer_casual_2', name:'Sunny Stroll',       gender:'men', season:'summer', occasion:'casual',  weatherTags:['warm','hot'],  itemIds:['c_m_polo_white','c_m_chino_beige','c_m_train_white'], styleTip:'Polo + chinos is the effortless summer formula.' },
  { id:'ol_m_summer_casual_3', name:'Easy Sunday',        gender:'men', season:'summer', occasion:'weekend', weatherTags:['warm'],        itemIds:['c_m_tee_navy','c_m_jeans_blue','c_m_train_blk'], styleTip:'Classic combo that works every time.' },
  { id:'ol_m_summer_smart_1',  name:'Smart Summer',       gender:'men', season:'summer', occasion:'work',    weatherTags:['warm','mild'],  itemIds:['c_m_shirt_blue','c_m_chino_navy','c_m_loafer_brn'], styleTip:'Roll the sleeves for a relaxed office vibe.' },

  // ── CASUAL AUTUMN – MEN ───────────────────────────────────────
  { id:'ol_m_autumn_casual_1', name:'Golden Hour',        gender:'men', season:'autumn', occasion:'casual',  weatherTags:['cool','mild'],  itemIds:['c_m_sweat_cream','c_m_jeans_blue','c_m_boots_brn'], styleTip:'Layer a cream knit over a basic shirt for texture.' },
  { id:'ol_m_autumn_casual_2', name:'Weekend Explorer',   gender:'men', season:'autumn', occasion:'weekend', weatherTags:['cool','mild'],  itemIds:['c_m_hoodie_grey','c_m_jeans_blk','c_m_train_blk'], styleTip:'A dark hoodie with black jeans is effortlessly cool.' },
  { id:'ol_m_autumn_smart_1',  name:'Autumn Office',      gender:'men', season:'autumn', occasion:'work',    weatherTags:['cool','mild'],  itemIds:['c_m_shirt_white','c_m_blazer_navy','c_m_trouser_blk','c_m_formal_blk'], styleTip:'Navy blazer elevates a white shirt instantly.' },
  { id:'ol_m_autumn_casual_3', name:'City Walk',          gender:'men', season:'autumn', occasion:'casual',  weatherTags:['cool'],         itemIds:['c_m_sweat_navy','c_m_chino_beige','c_m_boots_brn','c_m_denim_j'], styleTip:'Denim jacket over a navy jumper = perfect layering.' },

  // ── RAINY DAY – MEN ───────────────────────────────────────────
  { id:'ol_m_rain_1',          name:'Rainy Ready',        gender:'men', season:'all',    occasion:'casual',  weatherTags:['rainy'],        itemIds:['c_m_hoodie_blk','c_m_jeans_blk','c_m_rain_navy','c_m_boots_brn'], styleTip:'Tuck jeans into boots to keep them dry.' },
  { id:'ol_m_rain_work_1',     name:'Rainy Office Day',   gender:'men', season:'all',    occasion:'work',    weatherTags:['rainy'],        itemIds:['c_m_shirt_blue','c_m_trouser_gry','c_m_rain_navy','c_m_formal_blk'], styleTip:'Pack a compact umbrella to complete the look.' },

  // ── WINTER – MEN ──────────────────────────────────────────────
  { id:'ol_m_winter_casual_1', name:'Cold Comfort',       gender:'men', season:'winter', occasion:'casual',  weatherTags:['cold','freezing'],itemIds:['c_m_sweat_navy','c_m_jeans_blk','c_m_puffer_blk','c_m_boots_brn'], styleTip:'Layer a puffer over a warm jumper for real warmth.' },
  { id:'ol_m_winter_smart_1',  name:'Winter Professional',gender:'men', season:'winter', occasion:'work',    weatherTags:['cold'],          itemIds:['c_m_shirt_white','c_m_blazer_grey','c_m_trouser_blk','c_m_coat_camel','c_m_formal_blk'], styleTip:'A camel overcoat is the ultimate winter office piece.' },

  // ── FORMAL – MEN ──────────────────────────────────────────────
  { id:'ol_m_formal_1',        name:'Sharp & Polished',   gender:'men', season:'all',    occasion:'church',  weatherTags:['all'],          itemIds:['c_m_shirt_white','c_m_blazer_navy','c_m_trouser_blk','c_m_formal_blk','c_m_acc_belt_brn'], styleTip:'Polish shoes the night before for a crisp finish.' },
  { id:'ol_m_party_1',         name:'Party Ready',        gender:'men', season:'all',    occasion:'party',   weatherTags:['mild','warm'],   itemIds:['c_m_shirt_blue','c_m_jeans_blk','c_m_train_white','c_m_bomber_blk'], styleTip:'Smart shirt + black jeans = versatile night-out look.' },

  // ── GYM/SPORT – MEN ──────────────────────────────────────────
  { id:'ol_m_gym_1',           name:'Gym Session',        gender:'men', season:'all',    occasion:'gym',     weatherTags:['all'],          itemIds:['c_m_tank_white','c_m_jogger_grey','c_m_train_blk'], styleTip:'Bright base layer helps with motivation.' },

  // ── CASUAL SUMMER – WOMEN ─────────────────────────────────────
  { id:'ol_w_summer_casual_1', name:'Sun-Kissed Ease',    gender:'women', season:'summer', occasion:'casual',  weatherTags:['hot','warm'],  itemIds:['c_w_dress_sun','c_w_sandal_nde'], styleTip:'Add a thin gold bracelet to elevate the look.' },
  { id:'ol_w_summer_casual_2', name:'Breezy Weekend',     gender:'women', season:'summer', occasion:'weekend', weatherTags:['warm','hot'],  itemIds:['c_w_tee_white','c_w_skirt_flrl','c_w_sandal_nde'], styleTip:'Tuck the tee in halfway for a relaxed silhouette.' },
  { id:'ol_w_summer_casual_3', name:'Holiday Vibes',      gender:'women', season:'summer', occasion:'casual',  weatherTags:['hot'],         itemIds:['c_w_dress_flrl','c_w_sandal_nde'], styleTip:'A floral wrap dress is the ultimate holiday piece.' },
  { id:'ol_w_summer_casual_4', name:'Fresh Start',        gender:'women', season:'summer', occasion:'casual',  weatherTags:['warm'],        itemIds:['c_w_blouse_wht','c_w_shorts_wht','c_w_train_wht'], styleTip:'All-white in summer is always a bold choice.' },

  // ── SMART CASUAL – WOMEN ──────────────────────────────────────
  { id:'ol_w_smart_1',         name:'Confident Classic',  gender:'women', season:'all',    occasion:'work',    weatherTags:['mild','warm'],  itemIds:['c_w_blouse_wht','c_w_trouser_blk','c_w_loafer_blk'], styleTip:'Tuck the blouse in to create a clean waistline.' },
  { id:'ol_w_smart_2',         name:'Office Chic',        gender:'women', season:'all',    occasion:'work',    weatherTags:['all'],          itemIds:['c_w_dress_wk','c_w_blazer_blk','c_w_heel_blk'], styleTip:'A blazer over a shift dress is boardroom-ready.' },
  { id:'ol_w_smart_3',         name:'Monday Power',       gender:'women', season:'all',    occasion:'meeting', weatherTags:['all'],          itemIds:['c_w_blouse_blk','c_w_trouser_blk','c_w_blazer_blk','c_w_loafer_blk'], styleTip:'A tonal all-black look commands authority.' },

  // ── AUTUMN – WOMEN ────────────────────────────────────────────
  { id:'ol_w_autumn_1',        name:'Golden Season',      gender:'women', season:'autumn', occasion:'casual',  weatherTags:['cool','mild'],  itemIds:['c_w_sweat_cream','c_w_jeans_blue','c_w_boots_blk'], styleTip:'Cream + blue denim + black boots = autumn perfection.' },
  { id:'ol_w_autumn_2',        name:'Cosy Weekend',       gender:'women', season:'autumn', occasion:'weekend', weatherTags:['cool'],         itemIds:['c_w_sweat_pink','c_w_legging_blk','c_w_boots_blk'], styleTip:'Soft pink against black creates a feminine balance.' },
  { id:'ol_w_autumn_3',        name:'Sunday Best',        gender:'women', season:'autumn', occasion:'church',  weatherTags:['cool','mild'],  itemIds:['c_w_dress_navy','c_w_cardi_beige','c_w_boots_blk'], styleTip:'A cardigan over a midi dress is polished and modest.' },

  // ── RAINY – WOMEN ─────────────────────────────────────────────
  { id:'ol_w_rain_1',          name:'Rainy Day Chic',     gender:'women', season:'all',    occasion:'casual',  weatherTags:['rainy'],        itemIds:['c_w_jeans_blk','c_w_sweat_cream','c_w_rain_blush','c_w_boots_blk'], styleTip:'A blush raincoat brightens up any grey day.' },
  { id:'ol_w_rain_work_1',     name:'Rainy Work Look',    gender:'women', season:'all',    occasion:'work',    weatherTags:['rainy'],        itemIds:['c_w_dress_wk','c_w_blazer_blk','c_w_rain_blush','c_w_loafer_blk'], styleTip:'Keep your work outfit protected under a smart mac.' },

  // ── WINTER – WOMEN ────────────────────────────────────────────
  { id:'ol_w_winter_1',        name:'Warm & Stylish',     gender:'women', season:'winter', occasion:'casual',  weatherTags:['cold','freezing'],itemIds:['c_w_sweat_cream','c_w_jeans_blk','c_w_coat_camel','c_w_boots_blk'], styleTip:'A camel coat over cream is the winter style code.' },
  { id:'ol_w_winter_2',        name:'Winter Office',      gender:'women', season:'winter', occasion:'work',    weatherTags:['cold'],          itemIds:['c_w_dress_navy','c_w_blazer_blk','c_w_coat_camel','c_w_boots_blk'], styleTip:'Layer a blazer under a coat for structured warmth.' },

  // ── DATE NIGHT – WOMEN ────────────────────────────────────────
  { id:'ol_w_date_1',          name:'Date Night Glam',    gender:'women', season:'all',    occasion:'date-night',weatherTags:['mild','warm'],  itemIds:['c_w_dress_flrl','c_w_heel_blk'], styleTip:'Keep accessories minimal — let the dress do the talking.' },
  { id:'ol_w_date_2',          name:'Night Out Smart',    gender:'women', season:'all',    occasion:'party',   weatherTags:['all'],           itemIds:['c_w_blouse_blk','c_w_jeans_blk','c_w_heel_blk','c_w_blazer_blk'], styleTip:'Tone on tone with varied textures is effortlessly chic.' },

  // ── GYM – WOMEN ───────────────────────────────────────────────
  { id:'ol_w_gym_1',           name:'Active Day',         gender:'women', season:'all',    occasion:'gym',     weatherTags:['all'],           itemIds:['c_w_tank_nude','c_w_legging_blk','c_w_train_wht'], styleTip:'A neutral base means it always matches.' },

  // ── CHILDREN – CASUAL ─────────────────────────────────────────
  { id:'ol_k_summer_1',        name:'Summer Fun',         gender:'children', season:'summer', occasion:'casual',  weatherTags:['warm','hot'],  itemIds:['c_k_tee_white','c_k_shorts_navy','c_k_train_wht'], styleTip:'Light layers are ideal for active kids.' },
  { id:'ol_k_summer_2',        name:'Sunny Dress Day',    gender:'children', season:'summer', occasion:'casual',  weatherTags:['warm','hot'],  itemIds:['c_k_dress_pink','c_k_train_wht'], styleTip:'A simple dress is easy to move and play in.' },
  { id:'ol_k_school_1',        name:'School Ready',       gender:'children', season:'all',    occasion:'school',  weatherTags:['mild','cool'], itemIds:['c_k_tee_grey','c_k_jeans_blue','c_k_train_wht'], styleTip:'Comfortable shoes are essential for long school days.' },
  { id:'ol_k_school_2',        name:'Smart School Day',   gender:'children', season:'all',    occasion:'school',  weatherTags:['mild'],        itemIds:['c_k_tee_white','c_k_jogger_blk','c_k_boots_blk'], styleTip:'Neat and practical — the ideal school formula.' },
  { id:'ol_k_autumn_1',        name:'Autumn Adventures',  gender:'children', season:'autumn', occasion:'casual',  weatherTags:['cool','mild'], itemIds:['c_k_hoodie_gry','c_k_jeans_blue','c_k_train_wht'], styleTip:'A hoodie is the perfect autumn layering piece.' },
  { id:'ol_k_rain_1',          name:'Rainy Day Ready',    gender:'children', season:'all',    occasion:'casual',  weatherTags:['rainy'],       itemIds:['c_k_tee_grey','c_k_jeans_blue','c_k_rain_yell','c_k_boots_blk'], styleTip:'Yellow raincoat = visible and cheerful in the rain.' },
  { id:'ol_k_winter_1',        name:'Winter Warmth',      gender:'children', season:'winter', occasion:'casual',  weatherTags:['cold','freezing'],itemIds:['c_k_hoodie_gry','c_k_jogger_blk','c_k_puffer_red','c_k_boots_blk'], styleTip:'Layers under a puffer keep kids warm on cold days.' },
  { id:'ol_k_party_1',         name:'Party Time',         gender:'children', season:'all',    occasion:'party',   weatherTags:['mild','warm'], itemIds:['c_k_dress_pink','c_k_train_wht'], styleTip:'A pink dress with white shoes is always party-perfect.' },
]

// Utility: get outfits filtered by criteria
export function filterOutfits({ gender, season, occasion, weatherTag, limit = 10 }) {
  return OUTFIT_LIBRARY.filter(o => {
    const gMatch = !gender || o.gender === gender || o.gender === 'all'
    const sMatch = !season || o.season === season || o.season === 'all'
    const oMatch = !occasion || o.occasion === occasion
    const wMatch = !weatherTag || o.weatherTags.includes(weatherTag) || o.weatherTags.includes('all')
    return gMatch && sMatch && oMatch && wMatch
  }).slice(0, limit)
}
