import { CanonicalAdvisoryRequest, CanonicalAdvisoryResponse, LanguageCode } from '../../types';
import { LocationService } from './LocationService';
import { WeatherService } from './WeatherService';
import { FarmerService } from './FarmerService';
import { findPlantingRule, SUPPORTED_CROPS } from '../data/planting-rules';

export class AdvisoryService {
  /**
   * CANONICAL ADVISORY ENGINE
   * Deterministic, channel-agnostic agronomic recommendation generator.
   */
  public static async generatePlantingRecommendation(
    request: CanonicalAdvisoryRequest
  ): Promise<CanonicalAdvisoryResponse> {
    // 1. Resolve farmer profile if supplied
    let farmer = request.farmerId ? FarmerService.getFarmerById(request.farmerId) : null;
    if (!farmer && request.channelUserId) {
      farmer = FarmerService.findByIdentity(request.channelUserId);
    }

    // 2. Resolve ward location & Natural Region
    const wardId = request.wardId || (farmer ? farmer.wardId : 'ward_makoni_12');
    const ward = LocationService.resolveWard(wardId) || LocationService.getDefaultWard();

    // 3. Resolve crop
    const cropId = request.cropId || (farmer ? farmer.primaryCropId : 'crop_maize');
    const crop = SUPPORTED_CROPS.find(c => c.id === cropId) || SUPPORTED_CROPS[0];

    // 4. Resolve current timing / month (1-12)
    // Default to November if in off-season to provide actionable planting guidance
    const currentMonth = request.month || 11; // 11 = November (peak planting window in Zimbabwe)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[currentMonth - 1];

    // 5. Query agronomic rules table by (Crop, Natural Region)
    const rule = findPlantingRule(crop.id, ward.naturalRegion);

    // 6. Ground with ward-level weather
    const weather = await WeatherService.getForecastForWard(ward);

    // 7. Calculate season status and urgency
    const isOptimalWindow = rule ? rule.recommendedMonths.includes(currentMonth) : false;
    const seasonStatus = isOptimalWindow
      ? 'optimal_planting'
      : (currentMonth === 10 ? 'preparation_phase' : (currentMonth === 1 ? 'late_planting' : 'growing_phase'));

    const urgency = isOptimalWindow ? 'high' : 'medium';

    // 8. Build canonical recommendation
    const adviceId = `adv_${ward.naturalRegion}_${crop.id}_${Date.now()}`;

    // Format localized texts ensuring hard limits:
    // USSD limit is 182 chars
    // SMS limit is 160 chars
    const ussdEn = rule?.ussdEn || `ZimSmart: Reg ${ward.naturalRegion} ${crop.name}. Plant certified seed now. Basal: Compound D 300kg/ha. Soil: ${ward.soilType.slice(0, 25)}`;
    const ussdSn = rule?.ussdSn || `ZimSmart: Dunhu ${ward.naturalRegion} ${crop.name}. Dyara mbeu yakakodzera nhasi. Isa Compound D 300kg/ha.`;
    const ussdNr = rule?.ussdNr || `ZimSmart: Isigaba ${ward.naturalRegion} ${crop.name}. Hlanyela inhlanyelo efaneleyo. Faka Compound D 300kg/ha.`;

    const smsEn = rule?.smsEn || `ZimSmart: Reg ${ward.naturalRegion} advice for ${crop.name}. Recommended variety for ${ward.districtName}: ${rule?.recommendedVariety || 'Certified seed'}. Basal Compound D.`;
    const smsSn = rule?.smsSn || `ZimSmart: Zano reDunhu ${ward.naturalRegion} pa${crop.name}. Mbeu inokurudzirwa mu${ward.districtName}: ${rule?.recommendedVariety || 'Yakatenderwa'}.`;
    const smsNr = rule?.smsNr || `ZimSmart: Isiluleko seSigaba ${ward.naturalRegion} se${crop.name}. Inhlanyelo ye${ward.districtName}: ${rule?.recommendedVariety || 'Efaneleyo'}.`;

    const response: CanonicalAdvisoryResponse = {
      adviceId,
      farmerId: farmer ? farmer.id : undefined,
      crop: {
        id: crop.id,
        name: crop.name
      },
      location: {
        wardName: ward.name,
        districtName: ward.districtName,
        provinceName: ward.provinceName,
        naturalRegion: ward.naturalRegion,
        gpsCentroid: {
          latitude: ward.latitude,
          longitude: ward.longitude
        }
      },
      timing: {
        seasonStatus,
        monthName,
        urgency
      },
      agronomicRecommendation: {
        summary: rule?.adviceSummaryEn || `Optimal planting guidance for ${crop.name} in Natural Region ${ward.naturalRegion}.`,
        recommendedVariety: rule?.recommendedVariety || 'SC403 (Short Season) or SC513',
        plantingWindow: `${rule?.recommendedMonths.map(m => monthNames[m - 1]).join(' - ')}`,
        spacing: rule?.spacing || '90cm x 25cm',
        fertilizerBasal: rule?.fertilizerBasal || 'Compound D @ 300 kg/ha',
        expectedRainfallBand: rule?.expectedRainfallBand || ward.averageAnnualRainfallMm
      },
      weatherGrounding: {
        currentCondition: weather.condition,
        forecastNext3Days: `${weather.rainfallProbability24h}% chance of rain (${weather.rainfallAmountMm24h}mm)`,
        actionableWeatherAdvice: weather.actionableAgronomicAdvice.fertilizerAction
      },
      localizedTranslations: {
        en: {
          summary: rule?.adviceSummaryEn || 'Optimal planting advice',
          actionText: `Plant ${rule?.recommendedVariety || 'recommended variety'} in ${ward.districtName} (Natural Region ${ward.naturalRegion}). ${weather.actionableAgronomicAdvice.fertilizerAction}`,
          ussdText: ussdEn.slice(0, 182),
          smsText: smsEn.slice(0, 160)
        },
        sn: {
          summary: rule?.adviceSummarySn || 'Zano rekudyara',
          actionText: rule?.adviceSummarySn || 'Dyara mbeu yakakodzera',
          ussdText: ussdSn.slice(0, 182),
          smsText: smsSn.slice(0, 160)
        },
        nr: {
          summary: rule?.adviceSummaryNr || 'Isiluleko sokuhlanyela',
          actionText: rule?.adviceSummaryNr || 'Hlanyela inhlanyelo efaneleyo',
          ussdText: ussdNr.slice(0, 182),
          smsText: smsNr.slice(0, 160)
        }
      },
      generatedAt: new Date().toISOString()
    };

    return response;
  }
}
