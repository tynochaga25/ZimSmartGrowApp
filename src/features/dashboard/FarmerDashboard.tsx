import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sun,
  CloudRain,
  Cloud,
  CloudLightning,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ScanLine,
  Store,
  FilePlus2,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import {
  MOCK_WEATHER_FORECAST,
  PLANTING_ADVISORY,
  MOCK_MARKET_PRICES,
  MOCK_FARMER_CROPS,
  MOCK_ALERTS,
  MarketPricePoint,
} from '../../data/mockData';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Active crop price selection
  const [selectedCropId, setSelectedCropId] = useState<string>('maize');

  const activeMarketPrice =
    MOCK_MARKET_PRICES.find((p) => p.cropId === selectedCropId) || MOCK_MARKET_PRICES[0];

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'rain':
        return <CloudRain className="w-5 h-5 text-trust-blue" />;
      case 'storm':
        return <CloudLightning className="w-5 h-5 text-amber-500" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-neutral-400" />;
      default:
        return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Greeting & Location Chip Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold font-heading text-charcoal dark:text-white">
            Welcome back, {user?.name || 'Tendai Moyo'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5">
            <span>Agronomic telemetry for</span>
            <span className="font-semibold text-charcoal dark:text-gray-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-grow-600" />
              {user?.district || 'Makonde District'}, {user?.province || 'Mashonaland West'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-grow-50 dark:bg-grow-950/60 border border-grow-200 dark:border-grow-900 text-xs font-medium text-grow-800 dark:text-grow-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-grow-600" />
            <span className="font-mono tabular-nums">{user?.farmSize || 3.5} ha</span> Field Registered
          </div>
          <Link
            to="/diagnose"
            className="px-3.5 py-1.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5" />
            Scan Crop
          </Link>
        </div>
      </div>

      {/* Quick Action Touch Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/diagnose"
          className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border shadow-xs hover:border-grow-500 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-grow-100 dark:bg-grow-950/80 text-grow-700 dark:text-grow-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-charcoal dark:text-white font-heading">
                Diagnose a Crop
              </div>
              <div className="text-xs text-neutral-500">Scan for Late Blight or Armyworm</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-grow-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/market"
          className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border shadow-xs hover:border-trust-blue hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-trust-blue flex items-center justify-center group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-charcoal dark:text-white font-heading">
                Check Offtaker Market
              </div>
              <div className="text-xs text-neutral-500">National Foods & Cairns contracts</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-trust-blue group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/market?tab=create"
          className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border shadow-xs hover:border-amber-harvest hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-charcoal dark:text-white font-heading">
                List Harvest for Sale
              </div>
              <div className="text-xs text-neutral-500">Post batch quantity & ask price</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-amber-harvest group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Main Grid: Weather + Market Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weather & Planting Advisory Widget (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal dark:text-white flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                Hyper-Local Weather Forecast
              </h3>
              <p className="text-xs text-neutral-500">Makonde Cluster Meteorological Sensor Station</p>
            </div>
            <span className="text-xs font-mono text-neutral-400">Next update: 2h</span>
          </div>

          {/* 5-Day Strip */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
            {MOCK_WEATHER_FORECAST.map((w, idx) => (
              <div
                key={w.day}
                className={`p-3 rounded-xl border transition-all ${
                  idx === 0
                    ? 'border-grow-300 dark:border-grow-800 bg-grow-50/50 dark:bg-grow-950/30'
                    : 'border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface'
                }`}
              >
                <div className="text-xs font-semibold text-charcoal dark:text-white mb-1.5">{w.day}</div>
                <div className="my-2 flex justify-center">{getWeatherIcon(w.condition)}</div>
                <div className="text-xs font-bold font-mono text-charcoal dark:text-white tabular-nums">
                  {w.tempMax}° / <span className="text-neutral-400 font-normal">{w.tempMin}°</span>
                </div>
                <div className="mt-2 text-[10px] text-trust-blue font-medium flex items-center justify-center gap-0.5">
                  <CloudRain className="w-2.5 h-2.5" />
                  <span className="tabular-nums">{w.rainProbability}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Prominent Planting Advisory Callout */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {PLANTING_ADVISORY.title}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                {PLANTING_ADVISORY.status}
              </span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed">
              {PLANTING_ADVISORY.message}
            </p>
          </div>
        </div>

        {/* Market Prices & 7-Day Sparkline Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
                Live Commodity Prices
              </h3>
              <p className="text-xs text-neutral-500">Mbare & GMB Spot Auction Rates</p>
            </div>
            <Link to="/market" className="text-xs text-grow-700 dark:text-grow-400 hover:underline font-medium">
              View All →
            </Link>
          </div>

          {/* Crop Switcher Tabs */}
          <div className="flex p-1 bg-neutral-100 dark:bg-dark-surface rounded-xl overflow-x-auto text-xs">
            {MOCK_MARKET_PRICES.map((crop) => (
              <button
                key={crop.cropId}
                onClick={() => setSelectedCropId(crop.cropId)}
                className={`flex-1 py-1.5 px-2.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCropId === crop.cropId
                    ? 'bg-white dark:bg-dark-card text-grow-700 dark:text-grow-400 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-charcoal'
                }`}
              >
                {crop.cropName.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Price Big Metric Display with tabular numbers */}
          <div className="pt-2 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold font-mono text-charcoal dark:text-white tabular-nums">
                US${activeMarketPrice.currentPrice.toFixed(2)}
              </div>
              <div className="text-xs text-neutral-500">{activeMarketPrice.unit}</div>
            </div>

            <div
              className={`flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded-lg tabular-nums ${
                activeMarketPrice.changePercent >= 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400'
              }`}
            >
              {activeMarketPrice.changePercent >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {activeMarketPrice.changePercent >= 0 ? '+' : ''}
                {activeMarketPrice.changePercent.toFixed(2)}% (7d)
              </span>
            </div>
          </div>

          {/* 7-Day Sparkline Chart */}
          <div className="h-36 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeMarketPrice.history7d}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2 bg-neutral-900 text-white text-[11px] rounded-lg font-mono shadow-lg">
                          US${Number(payload[0].value).toFixed(2)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#2E7D32"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-100 dark:border-dark-border pt-2">
            <span>Aggregated from Harare Mbare Musika & Chinhoyi Silo</span>
            <span className="font-mono">Oct 2026 Spot</span>
          </div>
        </div>
      </div>

      {/* Second Row: My Crops Cycle + High-Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Crops Widget (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
                Active Crop Production Cycles
              </h3>
              <p className="text-xs text-neutral-500">Tracked farm parcels in Makonde</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-grow-700 dark:text-grow-400 hover:underline font-medium cursor-pointer"
            >
              Manage Plots →
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_FARMER_CROPS.map((crop) => (
              <div
                key={crop.id}
                className="p-4 rounded-xl border border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-charcoal dark:text-white flex items-center gap-2">
                      <span>{crop.name}</span>
                      <span className="text-[11px] font-normal text-neutral-500">({crop.variety})</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      <span className="font-mono tabular-nums">{crop.areaHectares} ha</span> · Planted {crop.plantingDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        crop.healthStatus === 'Excellent'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : crop.healthStatus === 'Attention Needed'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {crop.healthStatus}
                    </span>
                    <span className="text-xs font-semibold text-charcoal dark:text-gray-200 font-mono">
                      {crop.stage}
                    </span>
                  </div>
                </div>

                {/* Growth Cycle Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Cycle Progress:</span>
                    <span className="font-mono font-semibold text-charcoal dark:text-white tabular-nums">
                      {crop.progressPercent}% · Est. Harvest {crop.expectedHarvest}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        crop.healthStatus === 'Attention Needed' ? 'bg-amber-500' : 'bg-grow-600'
                      }`}
                      style={{ width: `${crop.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Advisories Widget (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
                Agronomic Alerts
              </h3>
              <p className="text-xs text-neutral-500">Live surveillance in your radius</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-grow-700 bg-grow-50 dark:bg-grow-950 px-2 py-0.5 rounded font-semibold">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl border border-neutral-100 dark:border-dark-border bg-neutral-50/50 dark:bg-dark-surface space-y-2 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'high' ? (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : alert.severity === 'medium' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-trust-blue shrink-0" />
                    )}
                    <h4 className="text-xs font-semibold text-charcoal dark:text-white leading-tight">
                      {alert.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {alert.message}
                </p>
                {alert.actionUrl && (
                  <div className="pt-1 flex justify-end">
                    <Link
                      to={alert.actionUrl}
                      className="text-xs font-semibold text-grow-700 dark:text-grow-400 hover:underline flex items-center gap-1"
                    >
                      View Details →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
