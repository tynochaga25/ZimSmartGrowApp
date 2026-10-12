/**
 * ZimSmart Grow - Core Omnichannel Types & Domain Contracts
 * Designed for low-bandwidth, channel-agnostic agricultural advisory in Zimbabwe
 */

export type NaturalRegion = 'I' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';

export type LanguageCode = 'en' | 'sn' | 'nr'; // English, Shona, Ndebele

export type ChannelType = 'ussd' | 'sms' | 'whatsapp' | 'web_pwa' | 'mobile_app';

export interface WardLocation {
  id: string;
  name: string;
  wardNumber: number;
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
  latitude: number;
  longitude: number;
  naturalRegion: NaturalRegion;
  altitudeMeters: number;
  averageAnnualRainfallMm: string;
  soilType: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
  provinceName: string;
  wards: WardLocation[];
}

export interface Province {
  id: string;
  name: string;
  code: string;
  districts: District[];
}

export interface Crop {
  id: string;
  name: string;
  scientificName: string;
  category: 'cereal' | 'cash_crop' | 'legume' | 'oilseed' | 'horticulture';
  commonVarieties: {
    code: string;
    name: string;
    maturityDays: number;
    suitableRegions: NaturalRegion[];
    droughtTolerance: 'High' | 'Medium' | 'Low';
  }[];
}

export interface FarmerProfile {
  id: string;
  nationalId?: string;
  fullName: string;
  preferredLanguage: LanguageCode;
  primaryCropId: string;
  primaryCropName: string;
  farmSizeHectares?: number;
  wardId: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  naturalRegion: NaturalRegion;
  latitude: number;
  longitude: number;
  preferredChannel: ChannelType;
  channelIdentities: {
    msisdn?: string;
    whatsappId?: string;
    pwaDeviceId?: string;
    mobileAppUuid?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * CANONICAL ADVISORY REQUEST
 * Any channel adapter translates its inbound input into this object
 */
export interface CanonicalAdvisoryRequest {
  farmerId?: string;
  channel: ChannelType;
  channelUserId: string; // e.g. MSISDN or WhatsApp ID
  cropId: string;
  wardId: string;
  month?: number; // 1-12 (defaults to current month)
  requestedLanguage?: LanguageCode;
  includeWeatherGrounding?: boolean;
}

/**
 * CANONICAL ADVISORY RESPONSE
 * The core domain response returned by AdvisoryService
 * All channel adapters receive this exact object and format it for their medium
 */
export interface CanonicalAdvisoryResponse {
  adviceId: string;
  farmerId?: string;
  crop: {
    id: string;
    name: string;
  };
  location: {
    wardName: string;
    districtName: string;
    provinceName: string;
    naturalRegion: NaturalRegion;
    gpsCentroid: {
      latitude: number;
      longitude: number;
    };
  };
  timing: {
    seasonStatus: 'optimal_planting' | 'late_planting' | 'preparation_phase' | 'growing_phase' | 'harvest_phase';
    monthName: string;
    urgency: 'low' | 'medium' | 'high';
  };
  agronomicRecommendation: {
    summary: string; // concise action sentence
    recommendedVariety: string;
    plantingWindow: string;
    spacing: string;
    fertilizerBasal: string;
    expectedRainfallBand: string;
  };
  weatherGrounding: {
    currentCondition: string;
    forecastNext3Days: string;
    actionableWeatherAdvice: string; // e.g., "Rain in 24h: Delay top-dressing"
  };
  localizedTranslations: Record<LanguageCode, {
    summary: string;
    actionText: string;
    ussdText: string; // <= 182 chars pre-calculated
    smsText: string;  // <= 160 chars pre-calculated
  }>;
  generatedAt: string;
}

/**
 * Africa's Talking USSD Webhook Payload
 */
export interface AfricasTalkingUssdPayload {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string; // e.g., "+263771234567"
  text: string;        // e.g. "" or "1*2*1"
  networkCode?: string;
}

/**
 * Africa's Talking USSD Webhook Response format
 * Must start with CON (continue) or END (terminate)
 */
export type AfricasTalkingUssdResponse = string;

/**
 * Inbound SMS Payload
 */
export interface InboundSmsPayload {
  from: string; // MSISDN
  to: string;   // Shortcode e.g. "384"
  text: string; // Keyword message e.g. "PLANT MAIZE 12"
  date?: string;
  id?: string;
}

/**
 * Commodity Market Price Record
 */
export interface CommodityMarketPrice {
  id: string;
  cropId: string;
  cropName: string;
  varietyOrGrade: string;
  marketName: string; // e.g. "Mbare Musika", "ZMX Bulawayo", "GMB Depot"
  districtName: string;
  provinceName: string;
  unit: string; // "50kg bag", "tonne", "crate", "kg"
  priceUsd: number;
  priceZig: number; // Zimbabwe Gold (local currency)
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

/**
 * Disease Diagnostics API Contract (Phase 3 ready)
 */
export interface DiagnosticRequest {
  farmerId?: string;
  cropId: string;
  channel: ChannelType;
  imageUrl?: string;
  imageBase64?: string;
  symptomsObserved?: string;
  wardId?: string;
}

export interface DiagnosticResponse {
  diagnosisId: string;
  cropName: string;
  suspectedCondition: string; // e.g. "Fall Armyworm (Spodoptera frugiperda)"
  confidencePercentage: number;
  severity: 'mild' | 'moderate' | 'severe';
  symptomsIdentified: string[];
  organicTreatment: string;
  chemicalTreatment: string;
  preventionAdvice: string;
  smsSummary: string; // concise representation <=160 chars
}
