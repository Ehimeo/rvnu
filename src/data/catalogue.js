// StyleMate Built-in Clothing Catalogue
// 70+ common, affordable, everyday items

export const CATALOGUE = [
  // ── MEN'S TOPS ────────────────────────────────────────────────
  { id:'c_m_tee_white',  name:'White Crew-Neck T-Shirt',  type:'tshirt',      gender:['men'],      colors:['white'],  formality:'casual',       occasions:['casual','weekend','gym'],           seasons:['spring','summer'],         weatherTags:['warm','hot'] },
  { id:'c_m_tee_black',  name:'Black Essential T-Shirt',  type:'tshirt',      gender:['men'],      colors:['black'],  formality:'casual',       occasions:['casual','weekend','gym'],           seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },
  { id:'c_m_tee_navy',   name:'Navy Graphic T-Shirt',     type:'tshirt',      gender:['men'],      colors:['navy'],   formality:'casual',       occasions:['casual','weekend'],                 seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_m_polo_white', name:'White Polo Shirt',         type:'polo',        gender:['men'],      colors:['white'],  formality:'smart-casual', occasions:['casual','work','weekend'],          seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_m_polo_navy',  name:'Navy Polo Shirt',          type:'polo',        gender:['men'],      colors:['navy'],   formality:'smart-casual', occasions:['casual','work','weekend'],          seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_m_shirt_white',name:'White Dress Shirt',        type:'dress-shirt', gender:['men'],      colors:['white'],  formality:'formal',       occasions:['work','church','wedding','party'],  seasons:['all'],                     weatherTags:['all'] },
  { id:'c_m_shirt_blue', name:'Light Blue Oxford Shirt',  type:'dress-shirt', gender:['men'],      colors:['blue'],   formality:'smart-casual', occasions:['work','casual','weekend'],          seasons:['spring','summer','autumn'], weatherTags:['mild','warm'] },
  { id:'c_m_hoodie_grey',name:'Grey Essential Hoodie',    type:'hoodie',      gender:['men'],      colors:['grey'],   formality:'casual',       occasions:['casual','weekend','gym'],           seasons:['autumn','winter','spring'], weatherTags:['cold','cool','mild'] },
  { id:'c_m_hoodie_blk', name:'Black Zip-Up Hoodie',     type:'hoodie',      gender:['men'],      colors:['black'],  formality:'casual',       occasions:['casual','weekend','gym'],           seasons:['autumn','winter','spring'], weatherTags:['cold','cool','mild'] },
  { id:'c_m_sweat_cream',name:'Cream Knit Sweater',       type:'sweater',     gender:['men'],      colors:['cream'],  formality:'smart-casual', occasions:['casual','work','weekend'],          seasons:['autumn','winter'],         weatherTags:['cold','cool'] },
  { id:'c_m_sweat_navy', name:'Navy Wool Jumper',         type:'sweater',     gender:['men'],      colors:['navy'],   formality:'smart-casual', occasions:['casual','work','weekend'],          seasons:['autumn','winter'],         weatherTags:['cold','cool'] },
  { id:'c_m_tank_white', name:'White Muscle Vest',        type:'tank',        gender:['men'],      colors:['white'],  formality:'casual',       occasions:['gym','casual','beach'],             seasons:['summer'],                  weatherTags:['hot'] },

  // ── MEN'S BOTTOMS ─────────────────────────────────────────────
  { id:'c_m_jeans_blue', name:'Blue Slim-Fit Jeans',     type:'jeans',   gender:['men'], colors:['blue'],  formality:'casual',       occasions:['casual','weekend'],               seasons:['all'],                     weatherTags:['all'] },
  { id:'c_m_jeans_blk',  name:'Black Skinny Jeans',      type:'jeans',   gender:['men'], colors:['black'], formality:'casual',       occasions:['casual','weekend','party'],        seasons:['all'],                     weatherTags:['all'] },
  { id:'c_m_chino_beige',name:'Beige Chino Trousers',    type:'chinos',  gender:['men'], colors:['beige'], formality:'smart-casual', occasions:['work','casual','weekend'],         seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },
  { id:'c_m_chino_navy', name:'Navy Chino Trousers',     type:'chinos',  gender:['men'], colors:['navy'],  formality:'smart-casual', occasions:['work','casual','weekend'],         seasons:['spring','summer','autumn'], weatherTags:['mild','warm'] },
  { id:'c_m_jogger_grey',name:'Grey Joggers',            type:'joggers', gender:['men'], colors:['grey'],  formality:'casual',       occasions:['casual','gym','weekend'],          seasons:['all'],                     weatherTags:['all'] },
  { id:'c_m_shorts_navy',name:'Navy Swim Shorts',        type:'shorts',  gender:['men'], colors:['navy'],  formality:'casual',       occasions:['casual','weekend','beach'],        seasons:['summer'],                  weatherTags:['hot','warm'] },
  { id:'c_m_trouser_blk',name:'Black Formal Trousers',   type:'trousers',gender:['men'], colors:['black'], formality:'formal',       occasions:['work','church','wedding','party'], seasons:['all'],                     weatherTags:['all'] },
  { id:'c_m_trouser_gry',name:'Charcoal Slim Trousers',  type:'trousers',gender:['men'], colors:['grey'],  formality:'formal',       occasions:['work','church','meeting'],         seasons:['all'],                     weatherTags:['all'] },

  // ── MEN'S OUTERWEAR ───────────────────────────────────────────
  { id:'c_m_denim_j',    name:'Classic Denim Jacket',    type:'denim-jacket', gender:['men'], colors:['blue'],  formality:'casual',       occasions:['casual','weekend','travel'],       seasons:['spring','autumn'],         weatherTags:['cool','mild'] },
  { id:'c_m_bomber_blk', name:'Black Bomber Jacket',     type:'bomber',       gender:['men'], colors:['black'], formality:'casual',       occasions:['casual','weekend','party'],        seasons:['spring','autumn'],         weatherTags:['cool','mild'] },
  { id:'c_m_rain_navy',  name:'Navy Raincoat',           type:'raincoat',     gender:['men'], colors:['navy'],  formality:'casual',       occasions:['casual','work','travel'],          seasons:['autumn','spring','winter'], weatherTags:['rainy','cold','cool'] },
  { id:'c_m_puffer_blk', name:'Black Puffer Jacket',     type:'puffer',       gender:['men'], colors:['black'], formality:'casual',       occasions:['casual','outdoor','travel'],       seasons:['winter','autumn'],         weatherTags:['cold','freezing'] },
  { id:'c_m_blazer_navy',name:'Navy Smart Blazer',       type:'blazer',       gender:['men'], colors:['navy'],  formality:'smart-casual', occasions:['work','church','wedding','party'], seasons:['all'],                     weatherTags:['mild','cool','cold'] },
  { id:'c_m_blazer_grey',name:'Grey Suit Blazer',        type:'blazer',       gender:['men'], colors:['grey'],  formality:'formal',       occasions:['work','church','wedding'],         seasons:['all'],                     weatherTags:['mild','cool','cold'] },
  { id:'c_m_coat_camel', name:'Camel Wool Overcoat',     type:'wool-coat',    gender:['men'], colors:['beige'], formality:'smart-casual', occasions:['work','casual','church'],          seasons:['autumn','winter'],         weatherTags:['cold','cool'] },

  // ── MEN'S SHOES ───────────────────────────────────────────────
  { id:'c_m_train_white',name:'White Leather Trainers',  type:'trainers',     gender:['men'], colors:['white'], formality:'casual',       occasions:['casual','gym','weekend'],          seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },
  { id:'c_m_train_blk',  name:'Black Classic Trainers',  type:'trainers',     gender:['men'], colors:['black'], formality:'casual',       occasions:['casual','gym','weekend'],          seasons:['all'],                     weatherTags:['all'] },
  { id:'c_m_boots_brn',  name:'Brown Chelsea Boots',     type:'boots',        gender:['men'], colors:['brown'], formality:'smart-casual', occasions:['casual','work','weekend'],         seasons:['autumn','winter','spring'], weatherTags:['cool','cold','mild'] },
  { id:'c_m_loafer_brn', name:'Brown Leather Loafers',   type:'loafers',      gender:['men'], colors:['brown'], formality:'smart-casual', occasions:['work','casual','church'],          seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },
  { id:'c_m_formal_blk', name:'Black Oxford Shoes',      type:'formal-shoes', gender:['men'], colors:['black'], formality:'formal',       occasions:['work','church','wedding'],         seasons:['all'],                     weatherTags:['all'] },

  // ── WOMEN'S TOPS ──────────────────────────────────────────────
  { id:'c_w_blouse_wht', name:'White Linen Blouse',      type:'blouse',  gender:['women'], colors:['white'], formality:'smart-casual', occasions:['work','casual','church'],          seasons:['spring','summer'],         weatherTags:['warm','hot','mild'] },
  { id:'c_w_blouse_blk', name:'Black Silk Blouse',       type:'blouse',  gender:['women'], colors:['black'], formality:'smart-casual', occasions:['work','party','date-night'],       seasons:['all'],                     weatherTags:['all'] },
  { id:'c_w_tee_white',  name:'White Fitted T-Shirt',    type:'tshirt',  gender:['women'], colors:['white'], formality:'casual',       occasions:['casual','weekend','gym'],          seasons:['spring','summer'],         weatherTags:['warm','hot'] },
  { id:'c_w_tee_stripe', name:'Striped Breton Top',      type:'tshirt',  gender:['women'], colors:['navy'],  formality:'casual',       occasions:['casual','weekend','travel'],       seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_w_tank_nude',  name:'Nude Ribbed Tank Top',    type:'tank',    gender:['women'], colors:['beige'], formality:'casual',       occasions:['casual','gym','beach'],            seasons:['summer'],                  weatherTags:['hot','warm'] },
  { id:'c_w_cardi_beige',name:'Beige Knit Cardigan',     type:'cardigan',gender:['women'], colors:['beige'], formality:'smart-casual', occasions:['casual','work','church'],          seasons:['spring','autumn','winter'], weatherTags:['cool','mild','cold'] },
  { id:'c_w_sweat_cream',name:'Cream Oversized Sweater', type:'sweater', gender:['women'], colors:['cream'], formality:'casual',       occasions:['casual','weekend'],                seasons:['autumn','winter'],         weatherTags:['cold','cool'] },
  { id:'c_w_sweat_pink', name:'Blush Pink Jumper',       type:'sweater', gender:['women'], colors:['pink'],  formality:'casual',       occasions:['casual','weekend'],                seasons:['autumn','winter','spring'], weatherTags:['cool','cold'] },

  // ── WOMEN'S BOTTOMS ───────────────────────────────────────────
  { id:'c_w_jeans_blue', name:'Blue Straight-Leg Jeans', type:'jeans',    gender:['women'], colors:['blue'],  formality:'casual',       occasions:['casual','weekend'],               seasons:['all'],                     weatherTags:['all'] },
  { id:'c_w_jeans_blk',  name:'Black High-Rise Jeans',   type:'jeans',    gender:['women'], colors:['black'], formality:'casual',       occasions:['casual','weekend','party'],        seasons:['all'],                     weatherTags:['all'] },
  { id:'c_w_skirt_blk',  name:'Black Midi Skirt',        type:'skirt',    gender:['women'], colors:['black'], formality:'smart-casual', occasions:['work','church','casual'],          seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },
  { id:'c_w_skirt_flrl', name:'Floral Wrap Skirt',       type:'skirt',    gender:['women'], colors:['pink'],  formality:'casual',       occasions:['casual','weekend','holiday'],      seasons:['spring','summer'],         weatherTags:['warm','hot'] },
  { id:'c_w_trouser_blk',name:'Black Wide-Leg Trousers', type:'trousers', gender:['women'], colors:['black'], formality:'formal',       occasions:['work','church','meeting'],         seasons:['all'],                     weatherTags:['all'] },
  { id:'c_w_legging_blk',name:'Black Leggings',          type:'leggings', gender:['women'], colors:['black'], formality:'casual',       occasions:['casual','gym','weekend'],          seasons:['all'],                     weatherTags:['all'] },
  { id:'c_w_shorts_wht', name:'White Linen Shorts',      type:'shorts',   gender:['women'], colors:['white'], formality:'casual',       occasions:['casual','weekend','beach'],        seasons:['summer'],                  weatherTags:['hot','warm'] },
  { id:'c_w_chino_beige',name:'Beige Wide Chinos',       type:'chinos',   gender:['women'], colors:['beige'], formality:'smart-casual', occasions:['work','casual'],                  seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },

  // ── WOMEN'S DRESSES ───────────────────────────────────────────
  { id:'c_w_dress_sun',  name:'White Sundress',          type:'summer-dress', gender:['women'], colors:['white'], formality:'casual',       occasions:['casual','weekend','holiday'],      seasons:['summer'],         weatherTags:['hot','warm'] },
  { id:'c_w_dress_wk',   name:'Black Shift Dress',       type:'work-dress',   gender:['women'], colors:['black'], formality:'formal',       occasions:['work','meeting','church','party'], seasons:['all'],            weatherTags:['all'] },
  { id:'c_w_dress_flrl', name:'Floral Wrap Dress',       type:'summer-dress', gender:['women'], colors:['pink'],  formality:'casual',       occasions:['casual','weekend','date-night'],   seasons:['spring','summer'], weatherTags:['warm','hot'] },
  { id:'c_w_dress_navy', name:'Navy Midi Dress',         type:'work-dress',   gender:['women'], colors:['navy'],  formality:'smart-casual', occasions:['work','church','casual'],          seasons:['all'],            weatherTags:['all'] },
  { id:'c_w_dress_knt',  name:'Beige Knit Dress',        type:'casual-dress', gender:['women'], colors:['beige'], formality:'casual',       occasions:['casual','weekend'],               seasons:['autumn','winter'], weatherTags:['cool','cold'] },

  // ── WOMEN'S OUTERWEAR ─────────────────────────────────────────
  { id:'c_w_denim_j',    name:'Light Denim Jacket',      type:'denim-jacket', gender:['women'], colors:['blue'],  formality:'casual',       occasions:['casual','weekend','travel'],  seasons:['spring','autumn'],  weatherTags:['cool','mild'] },
  { id:'c_w_blazer_wht', name:'White Linen Blazer',      type:'blazer',       gender:['women'], colors:['white'], formality:'smart-casual', occasions:['work','casual','meeting'],    seasons:['spring','summer'], weatherTags:['warm','mild'] },
  { id:'c_w_blazer_blk', name:'Black Power Blazer',      type:'blazer',       gender:['women'], colors:['black'], formality:'formal',       occasions:['work','meeting','party'],     seasons:['all'],             weatherTags:['all'] },
  { id:'c_w_rain_blush', name:'Blush Pink Raincoat',     type:'raincoat',     gender:['women'], colors:['pink'],  formality:'casual',       occasions:['casual','work','travel'],     seasons:['autumn','spring'], weatherTags:['rainy','cool'] },
  { id:'c_w_puffer_crm', name:'Cream Puffer Jacket',     type:'puffer',       gender:['women'], colors:['cream'], formality:'casual',       occasions:['casual','outdoor','travel'],  seasons:['winter'],          weatherTags:['cold','freezing'] },
  { id:'c_w_coat_camel', name:'Camel Wool Coat',         type:'wool-coat',    gender:['women'], colors:['brown'], formality:'smart-casual', occasions:['work','casual','church'],     seasons:['autumn','winter'], weatherTags:['cold','cool'] },

  // ── WOMEN'S SHOES ─────────────────────────────────────────────
  { id:'c_w_train_wht',  name:'White Leather Trainers',  type:'trainers',     gender:['women'], colors:['white'], formality:'casual',       occasions:['casual','gym','weekend'],     seasons:['spring','summer','autumn'], weatherTags:['warm','mild'] },
  { id:'c_w_boots_blk',  name:'Black Ankle Boots',       type:'boots',        gender:['women'], colors:['black'], formality:'smart-casual', occasions:['casual','work','weekend'],    seasons:['autumn','winter','spring'], weatherTags:['cool','cold','mild'] },
  { id:'c_w_sandal_nde', name:'Nude Strappy Sandals',    type:'sandals',      gender:['women'], colors:['beige'], formality:'casual',       occasions:['casual','holiday','date-night'], seasons:['summer'],         weatherTags:['hot','warm'] },
  { id:'c_w_loafer_blk', name:'Black Leather Loafers',   type:'loafers',      gender:['women'], colors:['black'], formality:'smart-casual', occasions:['work','casual','church'],     seasons:['all'],             weatherTags:['all'] },
  { id:'c_w_heel_blk',   name:'Black Block Heels',       type:'heels',        gender:['women'], colors:['black'], formality:'formal',       occasions:['work','party','date-night','wedding'], seasons:['all'], weatherTags:['all'] },

  // ── CHILDREN ──────────────────────────────────────────────────
  { id:'c_k_tee_white',  name:'White School T-Shirt',    type:'tshirt',       gender:['children'], colors:['white'], formality:'casual', occasions:['school','casual','weekend'],  seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_k_tee_grey',   name:'Grey Kids T-Shirt',       type:'tshirt',       gender:['children'], colors:['grey'],  formality:'casual', occasions:['school','casual','weekend'],  seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_k_jeans_blue', name:'Blue Kids Jeans',         type:'jeans',        gender:['children'], colors:['blue'],  formality:'casual', occasions:['school','casual','weekend'],  seasons:['all'],                     weatherTags:['all'] },
  { id:'c_k_jogger_blk', name:'Black Kids Joggers',      type:'joggers',      gender:['children'], colors:['black'], formality:'casual', occasions:['school','casual','gym'],      seasons:['all'],                     weatherTags:['all'] },
  { id:'c_k_hoodie_gry', name:'Grey Kids Hoodie',        type:'hoodie',       gender:['children'], colors:['grey'],  formality:'casual', occasions:['school','casual','weekend'],  seasons:['autumn','winter','spring'], weatherTags:['cold','cool','mild'] },
  { id:'c_k_dress_pink', name:'Pink Summer Dress',       type:'summer-dress', gender:['children'], colors:['pink'],  formality:'casual', occasions:['casual','weekend','party'],   seasons:['spring','summer'],         weatherTags:['warm','hot'] },
  { id:'c_k_skirt_blue', name:'Blue Pleated Skirt',      type:'skirt',        gender:['children'], colors:['blue'],  formality:'casual', occasions:['school','casual'],            seasons:['spring','summer'],         weatherTags:['warm','mild'] },
  { id:'c_k_shorts_navy',name:'Navy Kids Shorts',        type:'shorts',       gender:['children'], colors:['navy'],  formality:'casual', occasions:['casual','gym','weekend'],     seasons:['summer'],                  weatherTags:['hot','warm'] },
  { id:'c_k_train_wht',  name:'White Kids Trainers',     type:'trainers',     gender:['children'], colors:['white'], formality:'casual', occasions:['school','casual','gym'],      seasons:['all'],                     weatherTags:['all'] },
  { id:'c_k_boots_blk',  name:'Black School Shoes',      type:'boots',        gender:['children'], colors:['black'], formality:'casual', occasions:['school'],                     seasons:['all'],                     weatherTags:['all'] },
  { id:'c_k_rain_yell',  name:'Yellow Kids Raincoat',    type:'raincoat',     gender:['children'], colors:['yellow'],formality:'casual', occasions:['school','casual'],            seasons:['autumn','spring','winter'], weatherTags:['rainy','cold','cool'] },
  { id:'c_k_puffer_red', name:'Red Kids Puffer Jacket',  type:'puffer',       gender:['children'], colors:['red'],   formality:'casual', occasions:['casual','outdoor'],           seasons:['winter'],                  weatherTags:['cold','freezing'] },

  // ── ACCESSORIES (unisex) ──────────────────────────────────────
  { id:'c_acc_scarf_gry',name:'Grey Knit Scarf',         type:'scarf',  gender:['men','women'],           colors:['grey'],  formality:'casual',       occasions:['casual','work','travel'],  seasons:['autumn','winter'],  weatherTags:['cold','cool'] },
  { id:'c_acc_scarf_nvy',name:'Navy Wool Scarf',         type:'scarf',  gender:['men','women'],           colors:['navy'],  formality:'smart-casual', occasions:['work','casual'],           seasons:['winter'],           weatherTags:['cold','freezing'] },
  { id:'c_acc_hat_blk',  name:'Black Baseball Cap',      type:'hat',    gender:['men','women','children'],colors:['black'], formality:'casual',       occasions:['casual','gym','outdoor'],  seasons:['spring','summer'],  weatherTags:['warm','hot'] },
  { id:'c_acc_belt_brn', name:'Brown Leather Belt',      type:'belt',   gender:['men'],                   colors:['brown'], formality:'smart-casual', occasions:['work','casual'],           seasons:['all'],              weatherTags:['all'] },
  { id:'c_acc_watch_blk',name:'Black Minimalist Watch',  type:'watch',  gender:['men','women'],           colors:['black'], formality:'smart-casual', occasions:['work','casual','church'],  seasons:['all'],              weatherTags:['all'] },
  { id:'c_acc_bag_tote', name:'Beige Canvas Tote Bag',   type:'bag',    gender:['women'],                 colors:['beige'], formality:'casual',       occasions:['casual','work','weekend'], seasons:['spring','summer'],  weatherTags:['warm','mild'] },
]

export const CATALOGUE_BY_ID = Object.fromEntries(CATALOGUE.map(i => [i.id, i]))
