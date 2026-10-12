import { CanonicalAdvisoryResponse } from '../../types';

export class WhatsAppAdapter {
  /**
   * Formats CanonicalAdvisoryResponse into Meta WhatsApp Business Cloud API interactive template payload
   */
  public static formatInteractiveAdvisory(
    advice: CanonicalAdvisoryResponse,
    recipientWhatsAppId: string
  ): Record<string, unknown> {
    const loc = advice.location;
    const agro = advice.agronomicRecommendation;
    const weather = advice.weatherGrounding;

    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientWhatsAppId,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: {
          type: 'text',
          text: `🌱 ZimSmart: ${advice.crop.name} Advisory`
        },
        body: {
          text: `*Location:* ${loc.wardName}, ${loc.districtName} (Natural Region ${loc.naturalRegion})\n` +
                `*Status:* ${advice.timing.seasonStatus.replace('_', ' ').toUpperCase()}\n\n` +
                `🎯 *Action:* ${agro.summary}\n` +
                `🌽 *Recommended Variety:* ${agro.recommendedVariety}\n` +
                `📐 *Spacing:* ${agro.spacing}\n` +
                `🧪 *Basal Fertilizer:* ${agro.fertilizerBasal}\n\n` +
                `🌦️ *Weather Alert:* ${weather.actionableWeatherAdvice}`
        },
        footer: {
          text: 'ZimSmart Grow • Hyper-local Agronomy'
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: `btn_weather_${loc.wardName}`,
                title: '🌦️ 3-Day Forecast'
              }
            },
            {
              type: 'reply',
              reply: {
                id: `btn_prices_${advice.crop.id}`,
                title: '💰 Market Prices'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'btn_diagnose',
                title: '📸 Send Photo'
              }
            }
          ]
        }
      }
    };
  }
}
