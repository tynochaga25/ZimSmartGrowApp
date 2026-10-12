import { FarmerProfile, ChannelType, LanguageCode } from '../../types';
import { findWardById, getAllWards } from '../data/zimbabwe-geography';
import { SUPPORTED_CROPS } from '../data/planting-rules';

// In-memory farmer store (seeded with realistic demographic profiles)
const farmersMap = new Map<string, FarmerProfile>();
// Lookup index by MSISDN, WhatsApp ID, or device ID
const identityIndex = new Map<string, string>(); // identifier -> farmerId

function seedInitialFarmers() {
  const initial: FarmerProfile[] = [
    {
      id: 'farmer_001',
      fullName: 'Sekuru Tendai Mudzviti',
      preferredLanguage: 'sn',
      primaryCropId: 'crop_maize',
      primaryCropName: 'Maize (Chibage)',
      farmSizeHectares: 2.5,
      wardId: 'ward_makoni_12',
      wardName: 'Ward 12 (Nyazura)',
      districtName: 'Makoni',
      provinceName: 'Manicaland',
      naturalRegion: 'IIb',
      latitude: -18.712,
      longitude: 32.181,
      preferredChannel: 'ussd',
      channelIdentities: {
        msisdn: '+263772111222',
        whatsappId: '+263772111222',
        pwaDeviceId: 'pwa_tendai_01'
      },
      createdAt: '2026-09-01T08:00:00Z',
      updatedAt: '2026-09-24T06:00:00Z'
    },
    {
      id: 'farmer_002',
      fullName: 'Mai Ruvimbo Chidzero',
      preferredLanguage: 'en',
      primaryCropId: 'crop_tobacco',
      primaryCropName: 'Virginia Tobacco (Fodya)',
      farmSizeHectares: 4.0,
      wardId: 'ward_mazowe_05',
      wardName: 'Ward 5 (Concession / Glendale)',
      districtName: 'Mazowe',
      provinceName: 'Mashonaland Central',
      naturalRegion: 'IIa',
      latitude: -17.511,
      longitude: 30.985,
      preferredChannel: 'whatsapp',
      channelIdentities: {
        msisdn: '+263712333444',
        whatsappId: '+263712333444',
        pwaDeviceId: 'pwa_ruvimbo_02'
      },
      createdAt: '2026-09-05T09:30:00Z',
      updatedAt: '2026-09-24T06:00:00Z'
    },
    {
      id: 'farmer_003',
      fullName: 'Baba Sipho Moyo',
      preferredLanguage: 'nr',
      primaryCropId: 'crop_sorghum',
      primaryCropName: 'Sorghum (Amabele)',
      farmSizeHectares: 3.0,
      wardId: 'ward_lupane_05',
      wardName: 'Ward 5 (Gwayi Valley)',
      districtName: 'Lupane',
      provinceName: 'Matabeleland North',
      naturalRegion: 'IV',
      latitude: -18.924,
      longitude: 27.761,
      preferredChannel: 'sms',
      channelIdentities: {
        msisdn: '+263773555666',
        whatsappId: '+263773555666'
      },
      createdAt: '2026-09-10T11:15:00Z',
      updatedAt: '2026-09-24T06:00:00Z'
    }
  ];

  for (const f of initial) {
    farmersMap.set(f.id, f);
    if (f.channelIdentities.msisdn) {
      identityIndex.set(normalizePhone(f.channelIdentities.msisdn), f.id);
    }
    if (f.channelIdentities.whatsappId) {
      identityIndex.set(normalizePhone(f.channelIdentities.whatsappId), f.id);
    }
    if (f.channelIdentities.pwaDeviceId) {
      identityIndex.set(f.channelIdentities.pwaDeviceId, f.id);
    }
  }
}

seedInitialFarmers();

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('263')) return `+${digits}`;
  if (digits.startsWith('0')) return `+263${digits.substring(1)}`;
  return `+263${digits}`;
}

export interface RegisterFarmerInput {
  fullName: string;
  msisdn?: string;
  whatsappId?: string;
  pwaDeviceId?: string;
  wardId: string;
  primaryCropId: string;
  farmSizeHectares?: number;
  preferredLanguage?: LanguageCode;
  preferredChannel?: ChannelType;
}

export class FarmerService {
  public static getAllFarmers(): FarmerProfile[] {
    return Array.from(farmersMap.values());
  }

  public static getFarmerById(id: string): FarmerProfile | null {
    return farmersMap.get(id) || null;
  }

  public static findByIdentity(identifier: string): FarmerProfile | null {
    if (!identifier) return null;
    const norm = identifier.startsWith('+') || identifier.startsWith('0') || identifier.startsWith('263')
      ? normalizePhone(identifier)
      : identifier;

    const farmerId = identityIndex.get(norm) || identityIndex.get(identifier);
    if (farmerId) {
      return farmersMap.get(farmerId) || null;
    }
    return null;
  }

  public static registerFarmer(input: RegisterFarmerInput): FarmerProfile {
    // 1. Resolve ward to GPS centroid & Natural Region
    const ward = findWardById(input.wardId) || getAllWards()[0];

    // 2. Resolve crop
    const crop = SUPPORTED_CROPS.find(c => c.id === input.primaryCropId) || SUPPORTED_CROPS[0];

    // Check if phone already registered to avoid duplication
    if (input.msisdn) {
      const existing = this.findByIdentity(input.msisdn);
      if (existing) {
        // Link new channel identities
        if (input.whatsappId) existing.channelIdentities.whatsappId = input.whatsappId;
        if (input.pwaDeviceId) existing.channelIdentities.pwaDeviceId = input.pwaDeviceId;
        existing.wardId = ward.id;
        existing.wardName = ward.name;
        existing.naturalRegion = ward.naturalRegion;
        existing.primaryCropId = crop.id;
        existing.primaryCropName = crop.name;
        existing.updatedAt = new Date().toISOString();
        return existing;
      }
    }

    const newId = `farmer_${Date.now()}`;
    const normalizedMsisdn = input.msisdn ? normalizePhone(input.msisdn) : undefined;
    const normalizedWhatsApp = input.whatsappId ? normalizePhone(input.whatsappId) : undefined;

    const farmer: FarmerProfile = {
      id: newId,
      fullName: input.fullName.trim(),
      preferredLanguage: input.preferredLanguage || 'en',
      primaryCropId: crop.id,
      primaryCropName: crop.name,
      farmSizeHectares: input.farmSizeHectares || 1.0,
      wardId: ward.id,
      wardName: ward.name,
      districtName: ward.districtName,
      provinceName: ward.provinceName,
      naturalRegion: ward.naturalRegion,
      latitude: ward.latitude,
      longitude: ward.longitude,
      preferredChannel: input.preferredChannel || (input.msisdn ? 'ussd' : 'web_pwa'),
      channelIdentities: {
        msisdn: normalizedMsisdn,
        whatsappId: normalizedWhatsApp,
        pwaDeviceId: input.pwaDeviceId
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    farmersMap.set(newId, farmer);

    if (normalizedMsisdn) identityIndex.set(normalizedMsisdn, newId);
    if (normalizedWhatsApp) identityIndex.set(normalizedWhatsApp, newId);
    if (input.pwaDeviceId) identityIndex.set(input.pwaDeviceId, newId);

    return farmer;
  }

  public static linkChannelIdentity(farmerId: string, channel: ChannelType, identifier: string): boolean {
    const farmer = farmersMap.get(farmerId);
    if (!farmer) return false;

    if (channel === 'ussd' || channel === 'sms') {
      const norm = normalizePhone(identifier);
      farmer.channelIdentities.msisdn = norm;
      identityIndex.set(norm, farmerId);
    } else if (channel === 'whatsapp') {
      const norm = normalizePhone(identifier);
      farmer.channelIdentities.whatsappId = norm;
      identityIndex.set(norm, farmerId);
    } else if (channel === 'web_pwa') {
      farmer.channelIdentities.pwaDeviceId = identifier;
      identityIndex.set(identifier, farmerId);
    }

    farmer.updatedAt = new Date().toISOString();
    return true;
  }
}
