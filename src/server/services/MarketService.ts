import { LATEST_MARKET_PRICES } from '../data/market-prices';
import { CommodityMarketPrice } from '../../types';

export class MarketService {
  public static getAllPrices(): CommodityMarketPrice[] {
    return LATEST_MARKET_PRICES;
  }

  public static getPricesByCrop(cropId: string): CommodityMarketPrice[] {
    return LATEST_MARKET_PRICES.filter(p => p.cropId === cropId);
  }

  public static getMarketPriceSummarySms(cropId?: string): string {
    const prices = cropId ? this.getPricesByCrop(cropId) : LATEST_MARKET_PRICES;
    if (prices.length === 0) {
      return 'ZimSmart Mkt: No active price feed for selected crop.';
    }

    const first = prices[0];
    const second = prices[1];
    let msg = `ZimSmart Mkt: ${first.cropName.split(' ')[0]} @ ${first.marketName.split(' ')[0]}: $${first.priceUsd}/${first.unit}`;
    if (second) {
      msg += ` | ${second.cropName.split(' ')[0]}: $${second.priceUsd}/${second.unit}`;
    }
    return msg.slice(0, 160);
  }
}
