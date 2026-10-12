import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import { UssdAdapter } from './src/server/services/UssdAdapter';
import { SmsAdapter } from './src/server/services/SmsAdapter';
import { AdvisoryService } from './src/server/services/AdvisoryService';
import { FarmerService } from './src/server/services/FarmerService';
import { LocationService } from './src/server/services/LocationService';
import { WeatherService } from './src/server/services/WeatherService';
import { MarketService } from './src/server/services/MarketService';
import { WhatsAppAdapter } from './src/server/services/WhatsAppAdapter';
import { DiagnosticsService } from './src/server/services/DiagnosticsService';
import { SUPPORTED_CROPS } from './src/server/data/planting-rules';
import { ZIMBABWE_PROVINCES, getAllWards, findWardById } from './src/server/data/zimbabwe-geography';
import { AfricasTalkingUssdPayload, CanonicalAdvisoryRequest } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware for JSON and Africa's Talking URL-encoded webhooks
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for USSD and API traffic
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      platform: 'ZimSmart Grow Omnichannel Engine',
      version: '1.0.0-mvp',
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // 1. AFRICA'S TALKING USSD WEBHOOK ENDPOINT
  // ==========================================
  // Africa's Talking sends POST requests with application/x-www-form-urlencoded
  app.all('/api/v1/ussd/africastalking', async (req: Request, res: Response) => {
    try {
      const payload: AfricasTalkingUssdPayload = {
        sessionId: req.body.sessionId || (req.query.sessionId as string) || `sess_${Date.now()}`,
        serviceCode: req.body.serviceCode || (req.query.serviceCode as string) || '*384*263#',
        phoneNumber: req.body.phoneNumber || (req.query.phoneNumber as string) || '+263772111222',
        text: req.body.text !== undefined ? req.body.text : ((req.query.text as string) || ''),
        networkCode: req.body.networkCode || (req.query.networkCode as string)
      };

      const responseString = await UssdAdapter.handleWebhook(payload);

      // Africa's Talking requires plain text with header
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(responseString);
    } catch (err: unknown) {
      console.error('USSD Endpoint Error:', err);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send('END Service error. Please dial again shortly.');
    }
  });

  // ==========================================
  // 2. INBOUND SMS WEBHOOK
  // ==========================================
  app.post('/api/v1/sms/inbound', async (req: Request, res: Response) => {
    try {
      const reply = await SmsAdapter.handleInboundSms({
        from: req.body.from || '+263772111222',
        to: req.body.to || '384',
        text: req.body.text || ''
      });
      return res.json({ success: true, replyMessage: reply });
    } catch (err: unknown) {
      console.error('SMS Error:', err);
      return res.status(500).json({ error: 'SMS processing failed' });
    }
  });

  // ==========================================
  // 3. CORE CHANNEL-AGNOSTIC ADVISORY API
  // ==========================================
  app.get('/api/v1/advisory/planting', async (req: Request, res: Response) => {
    try {
      const advisoryRequest: CanonicalAdvisoryRequest = {
        farmerId: req.query.farmerId as string,
        channel: (req.query.channel as any) || 'web_pwa',
        channelUserId: (req.query.channelUserId as string) || (req.query.farmerId as string) || 'pwa_user',
        cropId: (req.query.cropId as string) || 'crop_maize',
        wardId: (req.query.wardId as string) || 'ward_makoni_12',
        month: req.query.month ? parseInt(req.query.month as string, 10) : 11,
        requestedLanguage: (req.query.lang as any) || 'en'
      };

      const advice = await AdvisoryService.generatePlantingRecommendation(advisoryRequest);
      return res.json(advice);
    } catch (err: unknown) {
      console.error('Advisory API Error:', err);
      return res.status(500).json({ error: 'Failed to generate advisory' });
    }
  });

  // ==========================================
  // 4. OMNICHANNEL FORMATTER & VERIFIER
  // Generates outputs for all 4 channels at once to prove zero logic duplication
  // ==========================================
  app.post('/api/v1/channels/preview', async (req: Request, res: Response) => {
    try {
      const advisoryRequest: CanonicalAdvisoryRequest = {
        channel: 'web_pwa',
        channelUserId: req.body.farmerId || '+263772111222',
        cropId: req.body.cropId || 'crop_maize',
        wardId: req.body.wardId || 'ward_makoni_12',
        month: req.body.month || 11,
        requestedLanguage: req.body.language || 'en'
      };

      const canonicalAdvice = await AdvisoryService.generatePlantingRecommendation(advisoryRequest);
      const lang = req.body.language || 'en';
      const loc = canonicalAdvice.localizedTranslations[lang as 'en' | 'sn' | 'nr'] || canonicalAdvice.localizedTranslations.en;

      // Format for each channel
      const ussdOutput = `CON ${loc.ussdText}`;
      const smsOutput = loc.smsText;
      const whatsappPayload = WhatsAppAdapter.formatInteractiveAdvisory(canonicalAdvice, req.body.farmerId || '+263772111222');

      return res.json({
        canonicalAdvice,
        channelRenderings: {
          ussd: {
            format: 'Africa\'s Talking CON/END plain text',
            characterCount: ussdOutput.length,
            limit: 182,
            isCompliant: ussdOutput.length <= 182,
            rawOutput: ussdOutput
          },
          sms: {
            format: 'GSM 03.38 7-bit / UTF-8 single SMS',
            characterCount: smsOutput.length,
            limit: 160,
            isCompliant: smsOutput.length <= 160,
            rawOutput: smsOutput
          },
          whatsapp: {
            format: 'Meta WhatsApp Business Cloud API JSON',
            payload: whatsappPayload
          },
          web_pwa: {
            format: 'REST JSON Object for React/PWA state store',
            data: canonicalAdvice
          }
        }
      });
    } catch (err: unknown) {
      console.error('Channel preview error:', err);
      return res.status(500).json({ error: 'Failed to generate channel preview' });
    }
  });

  // ==========================================
  // 5. FARMERS REGISTRATION & LOOKUP
  // ==========================================
  app.get('/api/v1/farmers', (req, res) => {
    res.json(FarmerService.getAllFarmers());
  });

  app.get('/api/v1/farmers/:id', (req, res) => {
    const farmer = FarmerService.getFarmerById(req.params.id) || FarmerService.findByIdentity(req.params.id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    res.json(farmer);
  });

  app.post('/api/v1/farmers', (req, res) => {
    try {
      const farmer = FarmerService.registerFarmer(req.body);
      res.status(201).json(farmer);
    } catch (err: unknown) {
      res.status(400).json({ error: 'Registration failed' });
    }
  });

  // ==========================================
  // 6. GEOGRAPHY & NATURAL REGIONS
  // ==========================================
  app.get('/api/v1/locations/provinces', (req, res) => {
    res.json(LocationService.getProvinces());
  });

  app.get('/api/v1/locations/wards', (req, res) => {
    res.json(getAllWards());
  });

  app.get('/api/v1/locations/wards/:id', (req, res) => {
    const ward = findWardById(req.params.id);
    if (!ward) return res.status(404).json({ error: 'Ward not found' });
    res.json({
      ...ward,
      regionInfo: LocationService.getNaturalRegionInfo(ward.naturalRegion)
    });
  });

  // Crops
  app.get('/api/v1/crops', (req, res) => {
    res.json(SUPPORTED_CROPS);
  });

  // ==========================================
  // 7. WEATHER & MARKET PRICES
  // ==========================================
  app.get('/api/v1/weather/forecast', async (req, res) => {
    const wardId = (req.query.wardId as string) || 'ward_makoni_12';
    const ward = findWardById(wardId) || getAllWards()[0];
    const forecast = await WeatherService.getForecastForWard(ward);
    res.json(forecast);
  });

  app.get('/api/v1/market/prices', (req, res) => {
    const cropId = req.query.cropId as string;
    const prices = cropId ? MarketService.getPricesByCrop(cropId) : MarketService.getAllPrices();
    res.json(prices);
  });

  // ==========================================
  // 8. PHASE 3 DISEASE DIAGNOSTICS CONTRACT
  // ==========================================
  app.post('/api/v1/diagnostics/diagnose', async (req, res) => {
    try {
      const result = await DiagnosticsService.diagnoseCrop({
        cropId: req.body.cropId || 'crop_maize',
        channel: req.body.channel || 'web_pwa',
        symptomsObserved: req.body.symptomsObserved,
        imageUrl: req.body.imageUrl,
        imageBase64: req.body.imageBase64
      });
      res.json(result);
    } catch (err: unknown) {
      res.status(500).json({ error: 'Diagnosis failed' });
    }
  });

  // ==========================================
  // VITE DEV SERVER OR STATIC HOSTING
  // ==========================================
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZimSmart Grow] Omnichannel Server running on http://0.0.0.0:${PORT}`);
    console.log(`[ZimSmart Grow] USSD Webhook: http://0.0.0.0:${PORT}/api/v1/ussd/africastalking`);
    console.log(`[ZimSmart Grow] Core Advisory API: http://0.0.0.0:${PORT}/api/v1/advisory/planting`);
  });
}

startServer().catch(err => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
