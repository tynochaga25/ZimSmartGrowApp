import { AfricasTalkingUssdPayload, AfricasTalkingUssdResponse, LanguageCode, FarmerProfile } from '../../types';
import { FarmerService, RegisterFarmerInput } from './FarmerService';
import { AdvisoryService } from './AdvisoryService';
import { WeatherService } from './WeatherService';
import { MarketService } from './MarketService';
import { ZIMBABWE_PROVINCES, getAllWards, findWardById } from '../data/zimbabwe-geography';
import { SUPPORTED_CROPS } from '../data/planting-rules';

interface SessionState {
  sessionId: string;
  phoneNumber: string;
  language: LanguageCode;
  step: string;
  tempData: Partial<RegisterFarmerInput> & {
    provinceId?: string;
    districtId?: string;
  };
  lastActive: number;
}

// In-memory session store (acts as Redis session cache for prototype)
const sessions = new Map<string, SessionState>();

export class UssdAdapter {
  /**
   * Main Africa's Talking Webhook Handler
   */
  public static async handleWebhook(payload: AfricasTalkingUssdPayload): Promise<AfricasTalkingUssdResponse> {
    const { sessionId, phoneNumber, text } = payload;

    // Check if session exists or initialize
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        phoneNumber,
        language: 'en',
        step: 'INIT',
        tempData: {},
        lastActive: Date.now()
      };
      sessions.set(sessionId, session);
    }
    session.lastActive = Date.now();

    // Check if farmer is already registered in DB
    const existingFarmer = FarmerService.findByIdentity(phoneNumber);
    if (existingFarmer) {
      session.language = existingFarmer.preferredLanguage;
    }

    // Africa's Talking accumulates user inputs in `text`, delimited by `*`
    // e.g. "" -> "1" -> "1*2" -> "1*2*1"
    const inputs = text ? text.split('*') : [];
    const latestInput = inputs.length > 0 ? inputs[inputs.length - 1].trim() : '';

    try {
      if (!existingFarmer) {
        return await this.handleOnboardingFlow(session, inputs, latestInput);
      } else {
        return await this.handleRegisteredMenuFlow(session, existingFarmer, inputs, latestInput);
      }
    } catch (err: unknown) {
      console.error('USSD processing error:', err);
      return 'END ZimSmart service temporarily unavailable. Please retry shortly.';
    }
  }

  /**
   * Onboarding flow for unregistered MSISDN
   */
  private static async handleOnboardingFlow(
    session: SessionState,
    inputs: string[],
    latestInput: string
  ): Promise<AfricasTalkingUssdResponse> {
    const inputCount = inputs.length;

    // Step 0: Language Selection
    if (inputCount === 0 || inputs[0] === '') {
      return this.formatCon(
        'Welcome to ZimSmart Grow!\nSarudza mutauro / Choose language / Khetha ulimi:\n1. Shona\n2. English\n3. Ndebele'
      );
    }

    // Step 1: Process Language selection -> Ask for Full Name
    if (inputCount === 1) {
      const langChoice = inputs[0];
      if (langChoice === '1') session.language = 'sn';
      else if (langChoice === '2') session.language = 'en';
      else if (langChoice === '3') session.language = 'nr';
      else {
        return this.formatCon('Invalid choice. Select language:\n1. Shona\n2. English\n3. Ndebele');
      }

      const prompt = session.language === 'sn'
        ? 'Pindai zita renyu rizere (Semuenzaniso: Tendai Mudzviti):'
        : (session.language === 'nr' ? 'Faka ibizo lakho elipheleleyo (Isibonelo: Sipho Moyo):' : 'Enter your full name (e.g. John Moyo):');
      return this.formatCon(prompt);
    }

    // Step 2: Process Name -> Select Province
    if (inputCount === 2) {
      const name = inputs[1].trim();
      if (!name || name.length < 2) {
        return this.formatCon('Please enter valid name:');
      }
      session.tempData.fullName = name;

      let menu = 'Select Province:\n';
      ZIMBABWE_PROVINCES.slice(0, 8).forEach((p, idx) => {
        menu += `${idx + 1}. ${p.name.replace('Mashonaland', 'Mash').replace('Matabeleland', 'Mat')}\n`;
      });
      return this.formatCon(menu.trim());
    }

    // Step 3: Process Province -> Select District
    if (inputCount === 3) {
      const provIndex = parseInt(inputs[2], 10) - 1;
      const province = ZIMBABWE_PROVINCES[provIndex];
      if (!province) {
        return this.formatCon('Invalid province. Select 1-8:\n1. Manicaland\n2. Mash Central\n3. Mash East\n4. Mash West\n5. Midlands\n6. Masvingo\n7. Mat North\n8. Mat South');
      }
      session.tempData.provinceId = province.id;

      let menu = `${province.name.split(' ')[0]} District:\n`;
      province.districts.slice(0, 5).forEach((d, idx) => {
        menu += `${idx + 1}. ${d.name.split(' ')[0]}\n`;
      });
      return this.formatCon(menu.trim());
    }

    // Step 4: Process District -> Select Ward
    if (inputCount === 4) {
      const prov = ZIMBABWE_PROVINCES.find(p => p.id === session.tempData.provinceId);
      const distIndex = parseInt(inputs[3], 10) - 1;
      const district = prov?.districts[distIndex];
      if (!district) {
        return this.formatCon('Invalid district. Try again.');
      }
      session.tempData.districtId = district.id;

      let menu = `${district.name.split(' ')[0]} Ward:\n`;
      district.wards.slice(0, 4).forEach((w, idx) => {
        menu += `${idx + 1}. ${w.name.slice(0, 18)} (Reg ${w.naturalRegion})\n`;
      });
      return this.formatCon(menu.trim());
    }

    // Step 5: Process Ward -> Select Crop
    if (inputCount === 5) {
      const prov = ZIMBABWE_PROVINCES.find(p => p.id === session.tempData.provinceId);
      const dist = prov?.districts.find(d => d.id === session.tempData.districtId);
      const wardIndex = parseInt(inputs[4], 10) - 1;
      const ward = dist?.wards[wardIndex] || dist?.wards[0];
      if (!ward) {
        return this.formatCon('Invalid ward choice. Try again.');
      }
      session.tempData.wardId = ward.id;

      let menu = 'Select Primary Crop:\n';
      SUPPORTED_CROPS.slice(0, 5).forEach((c, idx) => {
        const shortName = c.name.split(' ')[0];
        menu += `${idx + 1}. ${shortName}\n`;
      });
      return this.formatCon(menu.trim());
    }

    // Step 6: Process Crop -> Complete Registration
    if (inputCount === 6) {
      const cropIndex = parseInt(inputs[5], 10) - 1;
      const crop = SUPPORTED_CROPS[cropIndex] || SUPPORTED_CROPS[0];
      session.tempData.primaryCropId = crop.id;

      // Register farmer in Core FarmerService
      const farmer = FarmerService.registerFarmer({
        fullName: session.tempData.fullName || 'Farmer',
        msisdn: session.phoneNumber,
        wardId: session.tempData.wardId || 'ward_makoni_12',
        primaryCropId: crop.id,
        preferredLanguage: session.language,
        preferredChannel: 'ussd'
      });

      const ward = findWardById(farmer.wardId);
      const regAck = session.language === 'sn'
        ? `Zvakanaka ${farmer.fullName.split(' ')[0]}!\nWanyoreswa mu${ward?.districtName} (Dunhu ${ward?.naturalRegion}).\nDial *384*263# chero nguva.`
        : (session.language === 'nr'
          ? `Kuhle ${farmer.fullName.split(' ')[0]}!\nUbhaliswe e${ward?.districtName} (Isigaba ${ward?.naturalRegion}).\nShaya *384*263#.`
          : `Success ${farmer.fullName.split(' ')[0]}!\nRegistered in ${ward?.districtName} (Natural Region ${ward?.naturalRegion}). Dial *384*263# anytime.`);

      return this.formatEnd(regAck);
    }

    return this.formatEnd('Session ended. Dial *384*263# to retry.');
  }

  /**
   * Menu flow for registered farmers
   */
  private static async handleRegisteredMenuFlow(
    session: SessionState,
    farmer: FarmerProfile,
    inputs: string[],
    latestInput: string
  ): Promise<AfricasTalkingUssdResponse> {
    const inputCount = inputs.length;
    const ward = findWardById(farmer.wardId) || getAllWards()[0];

    // Main menu (dialed *384*263#)
    if (inputCount === 0 || inputs[0] === '') {
      const firstName = farmer.fullName.split(' ')[0];
      const menu = session.language === 'sn'
        ? `ZimSmart (${firstName})\n${ward.districtName} W${ward.wardNumber} (Dunhu ${ward.naturalRegion})\n1. Zano rekudyara\n2. Mamiriro ekunze\n3. Mitengo yezvirimwa\n4. Shandura mbeu`
        : (session.language === 'nr'
          ? `ZimSmart (${firstName})\n${ward.districtName} W${ward.wardNumber} (Isigaba ${ward.naturalRegion})\n1. Isiluleko sokuhlanyela\n2. Izulu lomumo womkhathi\n3. Intengo yezilimo\n4. Guqula isilimo`
          : `ZimSmart (${firstName})\n${ward.districtName} W${ward.wardNumber} (Reg ${ward.naturalRegion})\n1. Planting Advisory\n2. Daily Weather\n3. Market Prices\n4. Change Crop`);
      return this.formatCon(menu);
    }

    const choice = inputs[0].trim();

    // OPTION 1: Planting Advisory (calls channel-agnostic AdvisoryService)
    if (choice === '1') {
      const advice = await AdvisoryService.generatePlantingRecommendation({
        channel: 'ussd',
        channelUserId: session.phoneNumber,
        farmerId: farmer.id,
        cropId: farmer.primaryCropId,
        wardId: farmer.wardId,
        requestedLanguage: session.language
      });

      const localized = advice.localizedTranslations[session.language] || advice.localizedTranslations.en;
      return this.formatEnd(localized.ussdText);
    }

    // OPTION 2: Daily Weather
    if (choice === '2') {
      const weather = await WeatherService.getForecastForWard(ward);
      const text = `${ward.districtName} W${ward.wardNumber}: ${weather.condition}, ${weather.currentTempC}C. Rain prob ${weather.rainfallProbability24h}% (${weather.rainfallAmountMm24h}mm). ${weather.actionableAgronomicAdvice.fertilizerAction}`;
      return this.formatEnd(text.slice(0, 182));
    }

    // OPTION 3: Market Prices
    if (choice === '3') {
      const priceSummary = MarketService.getMarketPriceSummarySms(farmer.primaryCropId);
      return this.formatEnd(priceSummary.slice(0, 182));
    }

    // OPTION 4: Change Crop
    if (choice === '4') {
      if (inputCount === 1) {
        let menu = 'Select new crop:\n';
        SUPPORTED_CROPS.slice(0, 4).forEach((c, idx) => {
          menu += `${idx + 1}. ${c.name.split(' ')[0]}\n`;
        });
        return this.formatCon(menu.trim());
      } else {
        const cropIdx = parseInt(inputs[1], 10) - 1;
        const newCrop = SUPPORTED_CROPS[cropIdx] || SUPPORTED_CROPS[0];
        farmer.primaryCropId = newCrop.id;
        farmer.primaryCropName = newCrop.name;
        return this.formatEnd(`ZimSmart: Primary crop updated to ${newCrop.name.split(' ')[0]}.`);
      }
    }

    return this.formatEnd('Invalid option. Dial *384*263# to start again.');
  }

  private static formatCon(message: string): AfricasTalkingUssdResponse {
    // Strictly enforce 182 chars limit
    const truncated = message.length > 178 ? message.substring(0, 175) + '...' : message;
    return `CON ${truncated}`;
  }

  private static formatEnd(message: string): AfricasTalkingUssdResponse {
    // Strictly enforce 182 chars limit
    const truncated = message.length > 178 ? message.substring(0, 175) + '...' : message;
    return `END ${truncated}`;
  }
}
