import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  MapPin, 
  CloudRain, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  User, 
  ArrowRight, 
  RefreshCw,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CanonicalAdvisoryResponse, FarmerProfile, CommodityMarketPrice, NaturalRegion } from '../types';

export const FarmerPwaDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('farmer_001');
  const [advisory, setAdvisory] = useState<CanonicalAdvisoryResponse | null>(null);
  const [marketPrices, setMarketPrices] = useState<CommodityMarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLang, setActiveLang] = useState<'en' | 'sn' | 'nr'>('sn');

  // Load farmers and initial advisory
  useEffect(() => {
    fetch('/api/v1/farmers')
      .then(res => res.json())
      .then(data => {
        setFarmers(data);
        if (data.length > 0) {
          setSelectedFarmerId(data[0].id);
        }
      })
      .catch(console.error);

    fetch('/api/v1/market/prices')
      .then(res => res.json())
      .then(data => setMarketPrices(data))
      .catch(console.error);
  }, []);

  // Fetch planting advice whenever selected farmer or language changes
  useEffect(() => {
    if (!selectedFarmerId) return;
    setIsLoading(true);

    fetch(`/api/v1/advisory/planting?farmerId=${selectedFarmerId}&lang=${activeLang}`)
      .then(res => res.json())
      .then(data => {
        setAdvisory(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [selectedFarmerId, activeLang]);

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  const getRegionBadgeColor = (region?: NaturalRegion) => {
    switch (region) {
      case 'I': return 'bg-blue-900/60 text-blue-200 border-blue-700';
      case 'IIa': return 'bg-emerald-900/60 text-emerald-200 border-emerald-700';
      case 'IIb': return 'bg-teal-900/60 text-teal-200 border-teal-700';
      case 'III': return 'bg-amber-900/60 text-amber-200 border-amber-700';
      case 'IV': return 'bg-orange-900/60 text-orange-200 border-orange-700';
      case 'V': return 'bg-rose-900/60 text-rose-200 border-rose-700';
      default: return 'bg-stone-800 text-stone-200 border-stone-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Omnichannel Proof Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h1 className="text-xl font-extrabold text-white">Tier 3 Channel: Progressive Web App (PWA)</h1>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                API Consumer: GET /api/v1/advisory/planting
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Zero Logic Duplication: This web interface consumes the exact same Core Advisory API and data model that powers the USSD and SMS channels.
            </p>
          </div>

          {/* Farmer Switcher & Language Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
              <User className="w-3.5 h-3.5 text-stone-400 ml-1.5" />
              <select
                value={selectedFarmerId}
                onChange={e => setSelectedFarmerId(e.target.value)}
                className="bg-transparent text-xs text-stone-200 focus:outline-none font-medium pr-2"
              >
                {farmers.map(f => (
                  <option key={f.id} value={f.id} className="bg-stone-900 text-stone-200">
                    {f.fullName} ({f.districtName} - {f.naturalRegion})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setActiveLang('sn')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLang === 'sn' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Shona
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLang === 'en' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('nr')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeLang === 'nr' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Ndebele
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Profile Card & Agro-Ecological Region */}
      {selectedFarmer && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400 font-bold font-mono">
              {selectedFarmer.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono block">REGISTERED FARMER</span>
              <span className="text-sm font-bold text-white block">{selectedFarmer.fullName}</span>
              <span className="text-xs text-stone-400 font-mono">{selectedFarmer.channelIdentities.msisdn}</span>
            </div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-blue-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono block">WARD CENTROID</span>
              <span className="text-sm font-bold text-white block">{selectedFarmer.wardName}</span>
              <span className="text-xs text-stone-400">{selectedFarmer.districtName}, {selectedFarmer.provinceName}</span>
            </div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono block">PRIMARY CROP</span>
              <span className="text-sm font-bold text-white block">{selectedFarmer.primaryCropName}</span>
              <span className="text-xs text-stone-400 font-mono">{selectedFarmer.farmSizeHectares || 2.5} Hectares</span>
            </div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-mono block">AGRO-ECOLOGICAL ZONE</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border font-mono ${getRegionBadgeColor(selectedFarmer.naturalRegion)}`}>
                  Natural Region {selectedFarmer.naturalRegion}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                {selectedFarmer.latitude.toFixed(3)}°, {selectedFarmer.longitude.toFixed(3)}°
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Grid: Planting Recommendation & Weather/Market Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Planting Advisory (Core Feature 2.3) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Hyper-Local Planting Recommendation</h2>
                  <p className="text-xs text-stone-400">Driven by Natural Region agro-ecology and ward centroid</p>
                </div>
              </div>

              {advisory && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {advisory.timing.seasonStatus.replace('_', ' ')}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-stone-400 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mb-2" />
                Calculating agronomic rules for Natural Region...
              </div>
            ) : advisory ? (
              <div className="space-y-6">
                {/* Localized Summary Box */}
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                    ACTIONABLE DIRECTIVE ({activeLang.toUpperCase()})
                  </span>
                  <p className="text-sm font-semibold text-emerald-100 leading-relaxed">
                    {advisory.localizedTranslations[activeLang]?.actionText || advisory.agronomicRecommendation.summary}
                  </p>
                </div>

                {/* 4 Agronomic Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[11px] text-stone-500 font-mono uppercase block mb-1">RECOMMENDED HYBRID VARIETY</span>
                    <span className="text-base font-bold text-white block">{advisory.agronomicRecommendation.recommendedVariety}</span>
                    <span className="text-xs text-stone-400 mt-1 block">Certified Seed Co / Kutsaga standard</span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[11px] text-stone-500 font-mono uppercase block mb-1">SPACING & POPULATION</span>
                    <span className="text-base font-bold text-white block">{advisory.agronomicRecommendation.spacing}</span>
                    <span className="text-xs text-stone-400 mt-1 block">Optimized for regional moisture profile</span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[11px] text-stone-500 font-mono uppercase block mb-1">BASAL FERTILIZER REGIME</span>
                    <span className="text-base font-bold text-white block">{advisory.agronomicRecommendation.fertilizerBasal}</span>
                    <span className="text-xs text-stone-400 mt-1 block">Place 5cm to the side and 5cm below seed</span>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[11px] text-stone-500 font-mono uppercase block mb-1">EXPECTED REGIONAL RAINFALL</span>
                    <span className="text-base font-bold text-white block">{advisory.agronomicRecommendation.expectedRainfallBand}</span>
                    <span className="text-xs text-stone-400 mt-1 block">Natural Region {advisory.location.naturalRegion} annual average</span>
                  </div>
                </div>

                {/* USSD Parity Guarantee Callout */}
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3 text-xs">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-300 font-semibold block">Omnichannel Parity Verification</span>
                    <span className="text-stone-400">
                      When this farmer dials <code className="text-emerald-400 font-mono">*384*263#</code> on a 2G feature phone, the USSD adapter delivers this exact message:
                    </span>
                    <div className="mt-1.5 p-2 rounded bg-stone-900 text-[#86efac] font-mono text-[11px] border border-stone-800">
                      {advisory.localizedTranslations[activeLang]?.ussdText}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Daily Weather Alert & Market Prices (Core 2.2 & 2.4) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weather Alert Card */}
          {advisory && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Daily Ward Weather Alert</h3>
                    <span className="text-[11px] text-stone-400 font-mono">{advisory.location.wardName}</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Cached (Open-Meteo)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 mb-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">Current Forecast:</span>
                  <span className="text-white font-semibold">{advisory.weatherGrounding.currentCondition}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">Next 72 Hours:</span>
                  <span className="text-emerald-400 font-mono">{advisory.weatherGrounding.forecastNext3Days}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
                <span className="font-bold block mb-0.5 text-amber-300">Actionable Agronomic Impact:</span>
                {advisory.weatherGrounding.actionableWeatherAdvice}
              </div>
            </div>
          )}

          {/* Commodity Market Prices (Mbare Musika / AMA / ZMX) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Zimbabwe Commodity Prices</h3>
                  <p className="text-[11px] text-stone-400">Mbare Musika • ZMX • GMB Depots</p>
                </div>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">Live Feeds</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {marketPrices.slice(0, 5).map(price => (
                <div key={price.id} className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-white font-bold block">{price.cropName}</span>
                    <span className="text-[10px] text-stone-400">{price.marketName} ({price.unit})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">${price.priceUsd.toFixed(2)} USD</span>
                    <span className="text-[10px] text-stone-400">ZiG {price.priceZig.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
