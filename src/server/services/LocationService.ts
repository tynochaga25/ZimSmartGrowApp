import { ZIMBABWE_PROVINCES, findWardById, getAllWards } from '../data/zimbabwe-geography';
import { WardLocation, Province, District, NaturalRegion } from '../../types';

export class LocationService {
  public static getProvinces(): Province[] {
    return ZIMBABWE_PROVINCES;
  }

  public static getDistrictsByProvince(provinceId: string): District[] {
    const prov = ZIMBABWE_PROVINCES.find(p => p.id === provinceId);
    return prov ? prov.districts : [];
  }

  public static getWardsByDistrict(districtId: string): WardLocation[] {
    for (const prov of ZIMBABWE_PROVINCES) {
      const dist = prov.districts.find(d => d.id === districtId);
      if (dist) return dist.wards;
    }
    return [];
  }

  public static resolveWard(wardId: string): WardLocation | null {
    const ward = findWardById(wardId);
    return ward || null;
  }

  public static getDefaultWard(): WardLocation {
    const all = getAllWards();
    return all[0]; // Makoni Ward 12
  }

  public static getNaturalRegionInfo(region: NaturalRegion): {
    name: string;
    annualRainfall: string;
    farmingSystem: string;
    description: string;
  } {
    switch (region) {
      case 'I':
        return {
          name: 'Natural Region I (Specialized & Diversified)',
          annualRainfall: '> 1,050 mm / year',
          farmingSystem: 'Afforestation, tea, coffee, macadamia, high-value horticulture, seed production',
          description: 'High altitude Eastern Highlands; rain in all months with cool temperatures.'
        };
      case 'IIa':
        return {
          name: 'Natural Region IIa (Intensive Crop Farming)',
          annualRainfall: '750 - 1,000 mm / year',
          farmingSystem: 'Intensive commercial & smallholder maize, Virginia tobacco, soya beans, wheat',
          description: 'High rainfall reliably distributed during summer; the food basket of Zimbabwe.'
        };
      case 'IIb':
        return {
          name: 'Natural Region IIb (Intensive with Dry Spell Risk)',
          annualRainfall: '700 - 850 mm / year',
          farmingSystem: 'Maize, tobacco, groundnuts, beef finishing',
          description: 'Subject to periodic mid-season dry spells; moisture conservation advised.'
        };
      case 'III':
        return {
          name: 'Natural Region III (Semi-Intensive Farming)',
          annualRainfall: '650 - 800 mm / year',
          farmingSystem: 'Medium maturity maize, cotton, sorghum, groundnuts, livestock',
          description: 'High summer temperatures with erratic rainfall; Pfumvudza conservation agriculture recommended.'
        };
      case 'IV':
        return {
          name: 'Natural Region IV (Semi-Extensive Farming)',
          annualRainfall: '450 - 650 mm / year',
          farmingSystem: 'Drought-resistant crops (sorghum, millet), short-season maize (SC403), cattle breeding',
          description: 'Low, erratic rainfall; severe mid-season droughts. Small grains strongly advised.'
        };
      case 'V':
        return {
          name: 'Natural Region V (Extensive / Arid Farming)',
          annualRainfall: '< 450 mm / year',
          farmingSystem: 'Extensive cattle ranching, game farming, irrigated sugarcane/wheat, small grains',
          description: 'Very low, erratic rainfall in hot Zambezi and Limpopo basins. High drought risk.'
        };
    }
  }
}
