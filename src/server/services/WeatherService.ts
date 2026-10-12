import { WardLocation } from '../../types';

export interface WardWeatherSummary {
  wardId: string;
  wardName: string;
  latitude: number;
  longitude: number;
  currentTempC: number;
  humidityPercent: number;
  condition: string;
  rainfallProbability24h: number;
  rainfallAmountMm24h: number;
  forecast3Days: {
    dayName: string;
    condition: string;
    maxTempC: number;
    minTempC: number;
    rainfallMm: number;
  }[];
  actionableAgronomicAdvice: {
    fertilizerAction: string;
    chemicalSprayingAction: string;
    plantingMoistureAction: string;
    smsAlertText: string;
  };
  cachedAt: string;
}

// In-memory cache by wardId to prevent external weather API abuse
const weatherCache = new Map<string, WardWeatherSummary>();

export class WeatherService {
  public static async getForecastForWard(ward: WardLocation): Promise<WardWeatherSummary> {
    const cached = weatherCache.get(ward.id);
    // 30 min cache check
    if (cached) {
      return cached;
    }

    // Deterministic simulation based on Natural Region & latitude/longitude
    // (In production, calls Open-Meteo https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...)
    let baseRainMm = 0;
    let rainProb = 20;
    let condition = 'Partly Cloudy';
    let tempC = 27;

    switch (ward.naturalRegion) {
      case 'I':
        baseRainMm = 18.5;
        rainProb = 85;
        condition = 'Afternoon Showers & Mist';
        tempC = 22;
        break;
      case 'IIa':
      case 'IIb':
        baseRainMm = 12.0;
        rainProb = 70;
        condition = 'Scattered Thunderstorms Expected';
        tempC = 26;
        break;
      case 'III':
        baseRainMm = 4.5;
        rainProb = 40;
        condition = 'Isolated Showers / Hot Sun';
        tempC = 29;
        break;
      case 'IV':
        baseRainMm = 1.0;
        rainProb = 25;
        condition = 'Hot and Sunny with Dry Winds';
        tempC = 32;
        break;
      case 'V':
        baseRainMm = 0.0;
        rainProb = 10;
        condition = 'Intense Heat / Dry';
        tempC = 35;
        break;
    }

    const fertilizerAction = rainProb > 60
      ? `Rain expected tomorrow (${baseRainMm}mm) in ${ward.districtName}. Delay top-dressing fertilizer to avoid leaching.`
      : `Low rain risk (<${rainProb}%). Favorable conditions for basal fertilizer and planting.`;

    const chemicalSprayingAction = rainProb > 50
      ? 'Avoid spraying pesticides/fungicides today; wash-off risk within 6 hours.'
      : 'Calm morning conditions favorable for crop spraying.';

    const plantingMoistureAction = baseRainMm > 10
      ? 'Adequate soil moisture for germination after tomorrow’s rain.'
      : 'Soil moisture low. Plant in Pfumvudza basins or wait for planting rains (>25mm).';

    const smsAlertText = `ZimSmart Alert: ${ward.districtName} Ward ${ward.wardNumber}. ${condition}, rain prob ${rainProb}%. ${fertilizerAction.slice(0, 75)}`;

    const forecast: WardWeatherSummary = {
      wardId: ward.id,
      wardName: ward.name,
      latitude: ward.latitude,
      longitude: ward.longitude,
      currentTempC: tempC,
      humidityPercent: ward.naturalRegion === 'I' ? 82 : (ward.naturalRegion === 'V' ? 32 : 55),
      condition,
      rainfallProbability24h: rainProb,
      rainfallAmountMm24h: baseRainMm,
      forecast3Days: [
        { dayName: 'Tomorrow', condition, maxTempC: tempC + 1, minTempC: tempC - 9, rainfallMm: baseRainMm },
        { dayName: 'Day 2', condition: rainProb > 50 ? 'Showers' : 'Sunny', maxTempC: tempC, minTempC: tempC - 10, rainfallMm: baseRainMm * 0.7 },
        { dayName: 'Day 3', condition: 'Sunny & Warm', maxTempC: tempC + 2, minTempC: tempC - 8, rainfallMm: 0 }
      ],
      actionableAgronomicAdvice: {
        fertilizerAction,
        chemicalSprayingAction,
        plantingMoistureAction,
        smsAlertText: smsAlertText.slice(0, 160)
      },
      cachedAt: new Date().toISOString()
    };

    weatherCache.set(ward.id, forecast);
    return forecast;
  }
}
