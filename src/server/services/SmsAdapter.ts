import { InboundSmsPayload } from '../../types';
import { FarmerService } from './FarmerService';
import { AdvisoryService } from './AdvisoryService';
import { WeatherService } from './WeatherService';
import { MarketService } from './MarketService';
import { findWardById, getAllWards } from '../data/zimbabwe-geography';

export class SmsAdapter {
  /**
   * Process inbound keyword SMS
   * Commands: PLANT, WEATHER, PRICE, REG, HELP
   */
  public static async handleInboundSms(payload: InboundSmsPayload): Promise<string> {
    const rawText = (payload.text || '').trim().toUpperCase();
    const phone = payload.from;

    const farmer = FarmerService.findByIdentity(phone);
    const ward = farmer ? (findWardById(farmer.wardId) || getAllWards()[0]) : getAllWards()[0];

    // Command: PLANT [CROP]
    if (rawText.startsWith('PLANT')) {
      const advice = await AdvisoryService.generatePlantingRecommendation({
        channel: 'sms',
        channelUserId: phone,
        farmerId: farmer?.id,
        cropId: farmer?.primaryCropId || 'crop_maize',
        wardId: ward.id,
        requestedLanguage: farmer?.preferredLanguage || 'en'
      });

      const lang = farmer?.preferredLanguage || 'en';
      const localized = advice.localizedTranslations[lang] || advice.localizedTranslations.en;
      return localized.smsText.slice(0, 160);
    }

    // Command: WEATHER
    if (rawText.startsWith('WEATHER') || rawText.startsWith('KUNZE') || rawText.startsWith('IZULU')) {
      const weather = await WeatherService.getForecastForWard(ward);
      return weather.actionableAgronomicAdvice.smsAlertText.slice(0, 160);
    }

    // Command: PRICE [CROP]
    if (rawText.startsWith('PRICE') || rawText.startsWith('MUTENGO') || rawText.startsWith('INTENGO')) {
      return MarketService.getMarketPriceSummarySms(farmer?.primaryCropId).slice(0, 160);
    }

    // Command: HELP
    return 'ZimSmart SMS: Reply with PLANT (planting advice), WEATHER (daily forecast), or PRICE (market prices). Dial *384*263# for menu.'.slice(0, 160);
  }
}
