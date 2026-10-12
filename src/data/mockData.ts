export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'farmer' | 'buyer' | 'partner' | 'admin';
  organization?: string;
  province?: string;
  district?: string;
  farmSize?: number; // hectares
  crops?: string[];
  avatar?: string;
  joinedDate: string;
}

export interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: 'sunny' | 'rain' | 'cloudy' | 'storm';
  rainProbability: number;
  humidity: number;
  icon: string;
}

export interface MarketPricePoint {
  cropId: string;
  cropName: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  history7d: { day: string; price: number }[];
}

export interface FarmerCrop {
  id: string;
  name: string;
  variety: string;
  areaHectares: number;
  stage: 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvesting';
  progressPercent: number;
  plantingDate: string;
  expectedHarvest: string;
  healthStatus: 'Excellent' | 'Good' | 'Attention Needed';
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  category: 'pest' | 'market' | 'weather' | 'input';
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
  actionUrl?: string;
}

export interface BuyerRequest {
  id: string;
  buyerName: string;
  buyerLogo?: string;
  buyerType: 'Offtaker' | 'Food Processor' | 'Commodity Trader' | 'Retail Supermarket';
  crop: string;
  quantityNeeded: string;
  quantityNumeric: number;
  unit: string;
  offeredPrice: number;
  location: string;
  logisticsNote: string;
  deadline: string;
  verified: boolean;
}

export interface FarmerListing {
  id: string;
  crop: string;
  quantity: number;
  unit: string;
  expectedHarvestDate: string;
  askingPrice: number;
  province: string;
  status: 'Active' | 'Offer Received' | 'Sold';
  createdAt: string;
  offersCount: number;
}

export interface DiagnosisRecord {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  date: string;
  imageUrl: string;
  severity: 'High' | 'Medium' | 'Low';
  treatmentSummary: string;
  treatments: string[];
}

export const ZIM_PROVINCES = [
  'Mashonaland West',
  'Mashonaland East',
  'Mashonaland Central',
  'Manicaland',
  'Masvingo',
  'Midlands',
  'Matabeleland North',
  'Matabeleland South',
  'Harare',
  'Bulawayo',
] as const;

export const CROPS_CATALOG = [
  'White Maize',
  'Virginia Tobacco',
  'Roma Tomatoes',
  'Groundnuts',
  'Soya Beans',
  'Cotton',
  'Horticulture (Cabbage & Onion)',
  'Sunflower',
  'Sorghum',
];

export const DEMO_USERS: Record<string, UserProfile> = {
  farmer: {
    id: 'usr_farmer_01',
    name: 'Tendai Moyo',
    phone: '+263 77 234 5678',
    role: 'farmer',
    province: 'Mashonaland West',
    district: 'Makonde District (Chinhoyi)',
    farmSize: 3.5,
    crops: ['White Maize', 'Roma Tomatoes', 'Virginia Tobacco'],
    joinedDate: '2025-11-14',
  },
  buyer: {
    id: 'usr_buyer_01',
    name: 'Farai Chitepo',
    email: 'f.chitepo@nationalfoods.co.zw',
    organization: 'National Foods Holdings Ltd',
    role: 'buyer',
    province: 'Harare',
    joinedDate: '2025-10-02',
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Rudo Nyathi',
    email: 'rudo.nyathi@zimsmartgrow.co.zw',
    organization: 'ZimSmart Grow Impact Team',
    role: 'admin',
    province: 'Harare',
    joinedDate: '2025-08-01',
  },
};

export const MOCK_WEATHER_FORECAST: WeatherDay[] = [
  { day: 'Today', date: 'Mon, 12 Oct', tempMax: 29, tempMin: 16, condition: 'sunny', rainProbability: 10, humidity: 48, icon: 'sun' },
  { day: 'Tue', date: '13 Oct', tempMax: 31, tempMin: 18, condition: 'sunny', rainProbability: 15, humidity: 45, icon: 'sun' },
  { day: 'Wed', date: '14 Oct', tempMax: 27, tempMin: 17, condition: 'cloudy', rainProbability: 35, humidity: 62, icon: 'cloud' },
  { day: 'Thu', date: '15 Oct', tempMax: 24, tempMin: 15, condition: 'rain', rainProbability: 75, humidity: 82, icon: 'cloud-rain' },
  { day: 'Fri', date: '16 Oct', tempMax: 26, tempMin: 14, condition: 'rain', rainProbability: 60, humidity: 74, icon: 'cloud-lightning' },
];

export const PLANTING_ADVISORY = {
  title: 'Top-Dressing & Spraying Window Alert',
  status: 'Action Recommended',
  message: 'Dry conditions through Wednesday make it ideal for foliar nutrition and early weed management. Prepare drainage ahead of significant rainfall (75% probability) forecast for Thursday afternoon across Mashonaland.',
  urgency: 'Medium',
};

export const MOCK_MARKET_PRICES: MarketPricePoint[] = [
  {
    cropId: 'maize',
    cropName: 'White Maize (Grade A)',
    unit: 'US$ / Tonne',
    currentPrice: 320,
    previousPrice: 307,
    changePercent: 4.23,
    trend: 'up',
    history7d: [
      { day: 'Day 1', price: 305 },
      { day: 'Day 2', price: 307 },
      { day: 'Day 3', price: 310 },
      { day: 'Day 4', price: 308 },
      { day: 'Day 5', price: 315 },
      { day: 'Day 6', price: 318 },
      { day: 'Day 7', price: 320 },
    ],
  },
  {
    cropId: 'tobacco',
    cropName: 'Flue-Cured Virginia Tobacco',
    unit: 'US$ / Kg',
    currentPrice: 4.15,
    previousPrice: 4.08,
    changePercent: 1.72,
    trend: 'up',
    history7d: [
      { day: 'Day 1', price: 4.02 },
      { day: 'Day 2', price: 4.05 },
      { day: 'Day 3', price: 4.08 },
      { day: 'Day 4', price: 4.10 },
      { day: 'Day 5', price: 4.07 },
      { day: 'Day 6', price: 4.12 },
      { day: 'Day 7', price: 4.15 },
    ],
  },
  {
    cropId: 'tomatoes',
    cropName: 'Roma Tomatoes (Standard Crate)',
    unit: 'US$ / 20kg Crate',
    currentPrice: 18.5,
    previousPrice: 18.9,
    changePercent: -2.12,
    trend: 'down',
    history7d: [
      { day: 'Day 1', price: 19.5 },
      { day: 'Day 2', price: 19.2 },
      { day: 'Day 3', price: 19.0 },
      { day: 'Day 4', price: 18.8 },
      { day: 'Day 5', price: 18.9 },
      { day: 'Day 6', price: 18.6 },
      { day: 'Day 7', price: 18.5 },
    ],
  },
  {
    cropId: 'soyabeans',
    cropName: 'Soya Beans (Commercial)',
    unit: 'US$ / Tonne',
    currentPrice: 585,
    previousPrice: 578,
    changePercent: 1.21,
    trend: 'up',
    history7d: [
      { day: 'Day 1', price: 575 },
      { day: 'Day 2', price: 578 },
      { day: 'Day 3', price: 576 },
      { day: 'Day 4', price: 580 },
      { day: 'Day 5', price: 582 },
      { day: 'Day 6', price: 583 },
      { day: 'Day 7', price: 585 },
    ],
  },
];

export const MOCK_FARMER_CROPS: FarmerCrop[] = [
  {
    id: 'fc-1',
    name: 'White Maize',
    variety: 'SC 719 Highland Hybrid',
    areaHectares: 2.0,
    stage: 'Vegetative',
    progressPercent: 42,
    plantingDate: '2026-09-01',
    expectedHarvest: '2026-12-15',
    healthStatus: 'Excellent',
  },
  {
    id: 'fc-2',
    name: 'Roma Tomatoes',
    variety: 'Nandi F1 High Yield',
    areaHectares: 0.8,
    stage: 'Flowering',
    progressPercent: 64,
    plantingDate: '2026-08-15',
    expectedHarvest: '2026-10-24',
    healthStatus: 'Attention Needed',
  },
  {
    id: 'fc-3',
    name: 'Virginia Tobacco',
    variety: 'Kutsaga T66',
    areaHectares: 0.7,
    stage: 'Maturity',
    progressPercent: 88,
    plantingDate: '2026-07-20',
    expectedHarvest: '2026-10-30',
    healthStatus: 'Good',
  },
];

export const MOCK_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    title: 'High Fall Armyworm Risk Detected',
    message: 'Agrometeorological scouting in Makonde & Chinhoyi clusters indicates pest emergence threshold crossed on young maize.',
    category: 'pest',
    severity: 'high',
    timestamp: '2 hours ago',
    actionUrl: '/diagnose',
  },
  {
    id: 'alt-2',
    title: 'Offtaker Demand: National Foods Purchasing White Maize',
    message: 'National Foods opened purchasing orders for Grade A White Maize at US$320/Tonne with farm-gate collection in Mashonaland West.',
    category: 'market',
    severity: 'medium',
    timestamp: '5 hours ago',
    actionUrl: '/market',
  },
  {
    id: 'alt-3',
    title: 'Fertilizer Price Discount at Agro-Dealer',
    message: 'Farm & City Centre Chinhoyi announced a 5% discount on Ammonium Nitrate (AN) for registered ZimSmart Grow farmers.',
    category: 'input',
    severity: 'info',
    timestamp: '1 day ago',
  },
];

export const MOCK_BUYER_REQUESTS: BuyerRequest[] = [
  {
    id: 'br-1',
    buyerName: 'National Foods Holdings Ltd',
    buyerType: 'Food Processor',
    crop: 'White Maize (Grade A)',
    quantityNeeded: '50 tonnes',
    quantityNumeric: 50,
    unit: 'tonne',
    offeredPrice: 320,
    location: 'Chinhoyi Depot or Farm Gate Pick-up',
    logisticsNote: 'Buyer arranges truck collection for batches > 10 tonnes. Payment via Bank Transfer / EcoCash USD within 48h of weighbridge certification.',
    deadline: '2026-11-15',
    verified: true,
  },
  {
    id: 'br-2',
    buyerName: 'Cairns Foods Processing',
    buyerType: 'Food Processor',
    crop: 'Roma Tomatoes (First Grade)',
    quantityNeeded: '25 tonnes (1,250 crates)',
    quantityNumeric: 25,
    unit: 'tonne',
    offeredPrice: 19.5,
    location: 'Marondera Cannery & Harare Distribution',
    logisticsNote: 'Must meet sugar-brix standards for paste processing. Clean sanitized plastic crates provided upon contract signing.',
    deadline: '2026-10-28',
    verified: true,
  },
  {
    id: 'br-3',
    buyerName: 'Grain Marketing Board (GMB)',
    buyerType: 'Offtaker',
    crop: 'Soya Beans (Commercial)',
    quantityNeeded: '120 tonnes',
    quantityNumeric: 120,
    unit: 'tonne',
    offeredPrice: 585,
    location: 'Banket & Norton Grain Silos',
    logisticsNote: 'Moisture content strictly <= 11.5%. Direct delivery to silo bins with instant grain receipt issuance.',
    deadline: '2026-11-30',
    verified: true,
  },
  {
    id: 'br-4',
    buyerName: 'Northern Tobacco Auction',
    buyerType: 'Commodity Trader',
    crop: 'Flue-Cured Virginia Tobacco',
    quantityNeeded: '15 tonnes',
    quantityNumeric: 15,
    unit: 'tonne',
    offeredPrice: 4.25,
    location: 'Harare Boka Floors',
    logisticsNote: 'Baled according to TIMB grading guidelines. Guaranteed prompt floor settlement within 24 hours.',
    deadline: '2026-11-10',
    verified: true,
  },
  {
    id: 'br-5',
    buyerName: 'FreshMark / OK Zimbabwe Supermarkets',
    buyerType: 'Retail Supermarket',
    crop: 'Horticulture (Cabbage & Onions)',
    quantityNeeded: '8 tonnes weekly',
    quantityNumeric: 8,
    unit: 'tonne',
    offeredPrice: 0.48,
    location: 'Harare Graniteside Packhouse',
    logisticsNote: 'Weekly recurring purchase agreement. Direct refrigerated transport support for vetted clusters.',
    deadline: '2026-12-01',
    verified: true,
  },
];

export const INITIAL_FARMER_LISTINGS: FarmerListing[] = [
  {
    id: 'fl-1',
    crop: 'White Maize (Grade A)',
    quantity: 5,
    unit: 'Tonnes',
    expectedHarvestDate: '2026-10-28',
    askingPrice: 325,
    province: 'Mashonaland West',
    status: 'Active',
    createdAt: '2026-10-08',
    offersCount: 2,
  },
  {
    id: 'fl-2',
    crop: 'Roma Tomatoes',
    quantity: 120,
    unit: 'Crates (20kg)',
    expectedHarvestDate: '2026-10-18',
    askingPrice: 19.5,
    province: 'Mashonaland West',
    status: 'Offer Received',
    createdAt: '2026-10-10',
    offersCount: 3,
  },
  {
    id: 'fl-3',
    crop: 'Flue-Cured Virginia',
    quantity: 1.5,
    unit: 'Tonnes',
    expectedHarvestDate: '2026-11-04',
    askingPrice: 4.3,
    province: 'Mashonaland West',
    status: 'Active',
    createdAt: '2026-10-11',
    offersCount: 0,
  },
];

export const SAMPLE_DIAGNOSES = [
  {
    id: 'sample-tomato',
    crop: 'Roma Tomatoes',
    disease: 'Late Blight (Phytophthora infestans)',
    confidence: 87.4,
    imageUrl: '/src/assets/images/crop_tomato_blight_1791811897974.jpg',
    severity: 'High' as const,
    treatmentSummary: 'Late blight is a fast-spreading water mold disease capable of devastating whole tomato patches in 7-10 days under humid conditions (Section 3.1). Immediate targeted intervention halts spore propagation.',
    treatments: [
      'Apply copper-based protectant fungicide (e.g. Copper Oxychloride 50 WP) or systemic Mancozeb spray immediately.',
      'Remove and safely destroy severely infected lower leaves and stems. Do not compost infected plant debris.',
      'Switch strictly to furrow or drip irrigation to keep foliage dry. Avoid overhead sprinkler watering.',
      'Ensure 60cm row spacing to maximize airflow and sunlight penetration across the canopy.',
    ],
  },
  {
    id: 'sample-maize',
    crop: 'White Maize',
    disease: 'Fall Armyworm (Spodoptera frugiperda)',
    confidence: 93.1,
    imageUrl: '/src/assets/images/crop_maize_armyworm_1791811911635.jpg',
    severity: 'High' as const,
    treatmentSummary: 'Characteristic window-pane feeding holes and sawdust-like frass in the whorl. If untreated, larvae burrow into the growing point causing dead heart in young stalks.',
    treatments: [
      'Apply registered bio-rational or chemical insecticide (e.g., Emamectin benzoate 5% SG or Chlorantraniliprole) targeted into the plant funnel/whorl.',
      'Introduce fine dry sand mixed with wood ash directly into whorls for physical larval eradication in small plots.',
      'Scout 20 consecutive plants in 5 field locations twice weekly during vegetative stage.',
      'Coordinate spray timing with neighboring farmers to avoid cross-field migration.',
    ],
  },
  {
    id: 'sample-tobacco',
    crop: 'Virginia Tobacco',
    disease: 'Tobacco Mosaic Virus (TMV)',
    confidence: 91.5,
    imageUrl: '/src/assets/images/crop_tobacco_leaf_1791811923531.jpg',
    severity: 'Medium' as const,
    treatmentSummary: 'Distinct light/dark green mosaic mottle with leaf puckering. TMV is mechanically transmitted and highly stable; rapid biosecurity prevents crop-wide spread.',
    treatments: [
      'Rogue and burn infected plants immediately to prevent sap transmission through field labor handling.',
      'Enforce strict handwashing with milk solution or soap (trisodium phosphate) before handling healthy plants.',
      'Disinfect pruning knives and harvesting shears in 10% bleach between rows.',
      'Avoid planting nightshade family crops (tomatoes, peppers, potatoes) in adjacent borders.',
    ],
  },
];

export const ADMIN_MONTHLY_GROWTH = [
  { month: 'Nov 25', registered: 1200, active: 850, diagnoses: 1900 },
  { month: 'Dec 25', registered: 2400, active: 1800, diagnoses: 4100 },
  { month: 'Jan 26', registered: 4100, active: 3100, diagnoses: 7600 },
  { month: 'Feb 26', registered: 6500, active: 5200, diagnoses: 12800 },
  { month: 'Mar 26', registered: 8900, active: 7100, diagnoses: 18400 },
  { month: 'Apr 26', registered: 11400, active: 9200, diagnoses: 23900 },
  { month: 'May 26', registered: 13800, active: 11100, diagnoses: 29800 },
  { month: 'Jun 26', registered: 15600, active: 12400, diagnoses: 34100 },
  { month: 'Jul 26', registered: 17200, active: 13800, diagnoses: 39500 },
  { month: 'Aug 26', registered: 19100, active: 15300, diagnoses: 45200 },
  { month: 'Sep 26', registered: 21400, active: 17100, diagnoses: 51800 },
  { month: 'Oct 26', registered: 24000, active: 19200, diagnoses: 58600 },
];

export const REVENUE_STREAMS = [
  { name: 'Freemium & Premium Subscriptions', value: 35, amount: '$42,000', color: '#2E7D32' },
  { name: 'Market Offtake Transaction Fees (1.5-2.5%)', value: 28, amount: '$33,600', color: '#FFA000' },
  { name: 'Data-as-a-Service (NGOs & Banks)', value: 24, amount: '$28,800', color: '#1565C0' },
  { name: 'Agro-Dealer Listings & Referrals', value: 13, amount: '$15,600', color: '#81C784' },
];

export const PROVINCIAL_DISTRIBUTION = [
  { province: 'Mashonaland West', farmers: 7440, share: '31.0%', yieldGrowth: '+34%' },
  { province: 'Mashonaland East', farmers: 5280, share: '22.0%', yieldGrowth: '+31%' },
  { province: 'Manicaland', farmers: 4320, share: '18.0%', yieldGrowth: '+29%' },
  { province: 'Midlands', farmers: 3360, share: '14.0%', yieldGrowth: '+28%' },
  { province: 'Masvingo', farmers: 2160, share: '9.0%', yieldGrowth: '+33%' },
  { province: 'Matabeleland North & South', farmers: 1440, share: '6.0%', yieldGrowth: '+26%' },
];
