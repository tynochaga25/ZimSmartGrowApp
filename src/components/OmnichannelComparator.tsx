import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, ShieldCheck, Smartphone, MessageSquare, Send, Globe, AlertTriangle, Copy, Check } from 'lucide-react';
import { SUPPORTED_CROPS } from '../server/data/planting-rules';
import { getAllWards } from '../server/data/zimbabwe-geography';

interface ChannelRenderings {
  ussd: {
    format: string;
    characterCount: number;
    limit: number;
    isCompliant: boolean;
    rawOutput: string;
  };
  sms: {
    format: string;
    characterCount: number;
    limit: number;
    isCompliant: boolean;
    rawOutput: string;
  };
  whatsapp: {
    format: string;
    payload: any;
  };
  web_pwa: {
    format: string;
    data: any;
  };
}

export const OmnichannelComparator: React.FC = () => {
  const [selectedCropId, setSelectedCropId] = useState('crop_maize');
  const [selectedWardId, setSelectedWardId] = useState('ward_makoni_12');
  const [selectedMonth, setSelectedMonth] = useState(11);
  const [language, setLanguage] = useState<'en' | 'sn' | 'nr'>('sn');
  const [renderings, setRenderings] = useState<ChannelRenderings | null>(null);
  const [canonicalAdvice, setCanonicalAdvice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const wards = getAllWards();

  const fetchChannelPreview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/channels/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropId: selectedCropId,
          wardId: selectedWardId,
          month: selectedMonth,
          language
        })
      });
      const data = await res.json();
      setRenderings(data.channelRenderings);
      setCanonicalAdvice(data.canonicalAdvice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelPreview();
  }, [selectedCropId, selectedWardId, selectedMonth, language]);

  const copyToClipboard = (text: string, channelKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channelKey);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  const selectedWard = wards.find(w => w.id === selectedWardId) || wards[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-extrabold text-white">Omnichannel Transformation Comparator</h1>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                One Core Advisory Engine • 4 Channel Faces
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Test how a single canonical advisory calculation is translated simultaneously by thin adapters into USSD, SMS, WhatsApp, and Web JSON without duplicating domain logic.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Stateless & Deterministic Architecture</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800">
          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">SELECT CROP</label>
            <select
              value={selectedCropId}
              onChange={e => setSelectedCropId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {SUPPORTED_CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">WARD & NATURAL REGION</label>
            <select
              value={selectedWardId}
              onChange={e => setSelectedWardId(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              {wards.map(w => (
                <option key={w.id} value={w.id}>
                  {w.districtName} - {w.name} (Reg {w.naturalRegion})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">PLANTING MONTH</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value={10}>October (Early / Planting Prep)</option>
              <option value={11}>November (Optimal Planting Season)</option>
              <option value={12}>December (Mid-Season Planting)</option>
              <option value={1}>January (Late Planting / Short Cycle)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-stone-400 block mb-1">LANGUAGE</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="sn">Shona (ChiShona)</option>
              <option value="en">English</option>
              <option value="nr">Ndebele (IsiNdebele)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Natural Region Banner */}
      {canonicalAdvice && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
              Natural Region {canonicalAdvice.location.naturalRegion}
            </span>
            <span className="text-stone-300 font-bold">
              {canonicalAdvice.crop.name} • {canonicalAdvice.location.districtName} ({canonicalAdvice.location.provinceName})
            </span>
          </div>

          <div className="text-stone-400">
            Rainfall Band: <span className="text-white font-bold">{canonicalAdvice.agronomicRecommendation.expectedRainfallBand}</span> | 
            Centroid: <span className="text-emerald-400">{canonicalAdvice.location.gpsCentroid.latitude}°, {canonicalAdvice.location.gpsCentroid.longitude}°</span>
          </div>
        </div>
      )}

      {/* 4-Channel Grid */}
      {renderings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CHANNEL 1: USSD Screen (Tier 1) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tier 1: USSD Protocol Output</h3>
                    <span className="text-[10px] text-stone-500 font-mono">Africa's Talking Gateway Format</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    renderings.ussd.isCompliant
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-red-950 text-red-300 border-red-800'
                  }`}>
                    {renderings.ussd.characterCount} / {renderings.ussd.limit} chars
                  </span>
                  <button
                    onClick={() => copyToClipboard(renderings.ussd.rawOutput, 'ussd')}
                    className="p-1 text-stone-400 hover:text-white"
                    title="Copy"
                  >
                    {copiedChannel === 'ussd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Simulated Feature Phone LCD Screen */}
              <div className="p-4 rounded-xl bg-[#1f2b1d] border-2 border-stone-700 font-mono text-[#bbf7d0] text-xs leading-relaxed whitespace-pre-wrap shadow-inner min-h-[120px]">
                {renderings.ussd.rawOutput}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Delivery: GSM 2G USSD Session</span>
              <span className="text-emerald-400 font-mono">Cost: $0 to Farmer</span>
            </div>
          </div>

          {/* CHANNEL 2: SMS Broadcast / 2-Way (Tier 1) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center border border-blue-800">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tier 1: SMS Outbound / 2-Way</h3>
                    <span className="text-[10px] text-stone-500 font-mono">GSM 03.38 Standard 160 Chars</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    renderings.sms.isCompliant
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-red-950 text-red-300 border-red-800'
                  }`}>
                    {renderings.sms.characterCount} / {renderings.sms.limit} chars
                  </span>
                  <button
                    onClick={() => copyToClipboard(renderings.sms.rawOutput, 'sms')}
                    className="p-1 text-stone-400 hover:text-white"
                    title="Copy"
                  >
                    {copiedChannel === 'sms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Simulated SMS Bubble */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-mono leading-relaxed min-h-[120px]">
                <div className="text-[10px] text-stone-500 mb-1">FROM: ZimSmart (Shortcode 384)</div>
                {renderings.sms.rawOutput}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Delivery: Africa's Talking / Econet Bulk SMS</span>
              <span className="text-blue-400 font-mono">1 Single SMS Segment</span>
            </div>
          </div>

          {/* CHANNEL 3: WhatsApp Cloud API Interactive (Tier 2) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tier 2: WhatsApp Cloud API</h3>
                    <span className="text-[10px] text-stone-500 font-mono">Interactive Button Card JSON</span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(JSON.stringify(renderings.whatsapp.payload, null, 2), 'whatsapp')}
                  className="p-1 text-stone-400 hover:text-white"
                  title="Copy"
                >
                  {copiedChannel === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Simulated WhatsApp Chat Bubble */}
              <div className="p-4 rounded-xl bg-[#0b141a] border border-stone-800 text-stone-200 text-xs shadow-inner min-h-[180px] space-y-3 font-sans">
                <div className="text-emerald-400 font-bold text-xs">🌱 ZimSmart: {canonicalAdvice.crop.name} Advisory</div>
                <div className="text-[11px] leading-relaxed text-stone-300 whitespace-pre-line font-mono">
                  {renderings.whatsapp.payload.interactive.body.text}
                </div>
                <div className="pt-2 border-t border-stone-800 flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-[#1f2c34] text-emerald-400 text-[10px] border border-stone-700">
                    🌦️ 3-Day Forecast
                  </span>
                  <span className="px-2 py-1 rounded bg-[#1f2c34] text-emerald-400 text-[10px] border border-stone-700">
                    💰 Market Prices
                  </span>
                  <span className="px-2 py-1 rounded bg-[#1f2c34] text-emerald-400 text-[10px] border border-stone-700">
                    📸 Send Photo
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Delivery: Meta WhatsApp Business Cloud API</span>
              <span className="text-teal-400 font-mono">No BSP Markup</span>
            </div>
          </div>

          {/* CHANNEL 4: Web PWA & Mobile App REST API (Tier 3 & 4) */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tier 3 & 4: REST API (PWA / Mobile)</h3>
                    <span className="text-[10px] text-stone-500 font-mono">GET /api/v1/advisory/planting</span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(JSON.stringify(renderings.web_pwa.data, null, 2), 'pwa')}
                  className="p-1 text-stone-400 hover:text-white"
                  title="Copy"
                >
                  {copiedChannel === 'pwa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* JSON preview */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-emerald-300 font-mono text-[10px] leading-tight overflow-x-auto max-h-[180px]">
                <pre>{JSON.stringify(renderings.web_pwa.data, null, 2)}</pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Delivery: HTTP/2 JSON + IndexedDB Cache</span>
              <span className="text-amber-400 font-mono">Offline-First Capable</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
