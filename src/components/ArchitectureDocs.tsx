import React, { useState } from 'react';
import { 
  FileText, 
  Database, 
  Terminal, 
  GitFork, 
  Share2, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'diagram' | 'contracts' | 'ussd_tree' | 'schema' | 'testing'>('diagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sqlSchema = `-- ========================================================
-- ZIMSMART GROW: PRODUCTION POSTGRESQL + POSTGIS SCHEMA
-- National Coverage: 10 Provinces, Natural Regions I - V
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. ADMINISTRATIVE & AGRO-ECOLOGICAL HIERARCHY
CREATE TABLE provinces (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    id VARCHAR(50) PRIMARY KEY,
    province_id VARCHAR(50) NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(province_id, name)
);

CREATE TABLE wards (
    id VARCHAR(50) PRIMARY KEY,
    district_id VARCHAR(50) NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    ward_number INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    natural_region VARCHAR(10) NOT NULL CHECK (natural_region IN ('I', 'IIa', 'IIb', 'III', 'IV', 'V')),
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    geom GEOMETRY(Point, 4326),
    altitude_meters INT,
    average_annual_rainfall_mm VARCHAR(50),
    soil_type TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wards_district ON wards(district_id);
CREATE INDEX idx_wards_region ON wards(natural_region);
CREATE INDEX idx_wards_geom ON wards USING GIST(geom);

-- 2. CROPS & HYBRID VARIETIES
CREATE TABLE crops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(150),
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crop_varieties (
    id VARCHAR(50) PRIMARY KEY,
    crop_id VARCHAR(50) NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    maturity_days INT NOT NULL,
    suitable_natural_regions TEXT[] NOT NULL,
    drought_tolerance VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. FARMER IDENTITY & MULTI-CHANNEL LINKING (One Farmer -> Many Channels)
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'sn' CHECK (preferred_language IN ('en', 'sn', 'nr')),
    primary_crop_id VARCHAR(50) REFERENCES crops(id),
    farm_size_hectares DECIMAL(5, 2) DEFAULT 1.0,
    ward_id VARCHAR(50) NOT NULL REFERENCES wards(id),
    preferred_channel VARCHAR(20) NOT NULL DEFAULT 'ussd' CHECK (preferred_channel IN ('ussd', 'sms', 'whatsapp', 'web_pwa', 'mobile_app')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmer_channel_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('ussd', 'sms', 'whatsapp', 'web_pwa', 'mobile_app')),
    identifier VARCHAR(100) NOT NULL, -- E.164 MSISDN e.g. +263772111222 or PWA Device UUID
    is_primary BOOLEAN DEFAULT TRUE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel, identifier)
);

CREATE INDEX idx_farmer_channels_lookup ON farmer_channel_identities(identifier);
CREATE INDEX idx_farmers_ward ON farmers(ward_id);

-- 4. CHANNEL-AGNOSTIC AGRONOMIC RULES ENGINE
CREATE TABLE planting_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id VARCHAR(50) NOT NULL REFERENCES crops(id),
    natural_region VARCHAR(10) NOT NULL CHECK (natural_region IN ('I', 'IIa', 'IIb', 'III', 'IV', 'V')),
    recommended_months INT[] NOT NULL, -- e.g. ARRAY[10, 11, 12]
    recommended_variety_text VARCHAR(150) NOT NULL,
    spacing_text VARCHAR(100) NOT NULL,
    fertilizer_basal_text TEXT NOT NULL,
    expected_rainfall_band VARCHAR(50) NOT NULL,
    advice_payload JSONB NOT NULL, -- Contains localized strings (en, sn, nr, pre-computed ussdText <=182, smsText <=160)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_planting_rules_lookup ON planting_rules(crop_id, natural_region);

-- 5. WEATHER CACHE & AGRO-METEOROLOGICAL ALERTS
CREATE TABLE weather_cache (
    ward_id VARCHAR(50) PRIMARY KEY REFERENCES wards(id),
    temperature_c DECIMAL(4, 1) NOT NULL,
    humidity_percent INT NOT NULL,
    condition_text VARCHAR(100) NOT NULL,
    rainfall_probability_24h INT NOT NULL,
    rainfall_amount_mm_24h DECIMAL(5, 1) NOT NULL,
    actionable_fertilizer_advice TEXT NOT NULL,
    cached_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL
);

-- 6. COMMODITY MARKET PRICES (Mbare Musika, ZMX, GMB)
CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id VARCHAR(50) NOT NULL REFERENCES crops(id),
    market_name VARCHAR(100) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id),
    variety_or_grade VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_usd DECIMAL(10, 2) NOT NULL,
    price_zig DECIMAL(12, 2) NOT NULL,
    trend VARCHAR(10) DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
    reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_market_prices_crop ON market_prices(crop_id, reported_at DESC);

-- 7. USSD SESSIONS (Fast Redis backing, PostgreSQL persistent mirror)
CREATE TABLE ussd_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    phone_number VARCHAR(50) NOT NULL,
    current_step VARCHAR(50) NOT NULL,
    language VARCHAR(5) DEFAULT 'sn',
    accumulated_text TEXT,
    temp_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDIT LOG & ADVISORY DISPATCH
CREATE TABLE advisory_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id),
    channel VARCHAR(20) NOT NULL,
    channel_user_id VARCHAR(100) NOT NULL,
    crop_id VARCHAR(50) NOT NULL,
    ward_id VARCHAR(50) NOT NULL,
    response_length INT NOT NULL,
    dispatched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_farmer ON advisory_audit_logs(farmer_id);
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-extrabold text-white">Engineering Architecture & Technical Specification</h1>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Omnichannel Core Design Document
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Production-ready technical blueprint, channel contracts, USSD state machine, PostgreSQL schemas, and test harnesses.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-stone-800">
          {[
            { id: 'diagram', label: '1. Architecture Diagram (Mermaid)', icon: GitFork },
            { id: 'contracts', label: '2. Channel Contracts & Worked Examples', icon: Share2 },
            { id: 'ussd_tree', label: '3. USSD Menu Tree (Text Flow)', icon: Layers },
            { id: 'schema', label: '4. Database Schema (PostgreSQL DDL)', icon: Database },
            { id: 'testing', label: '5. Setup, Ngrok & Curl Harness', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeSection === tab.id
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-stone-950 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE DIAGRAM */}
      {activeSection === 'diagram' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-white">ZimSmart Grow Omnichannel Architecture</h2>
              <p className="text-xs text-stone-400">Channel Adapters → Canonical Core Advisory API → Domain Services → Persistence</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Zero Logic Duplication
            </span>
          </div>

          {/* Interactive Visual Block Diagram */}
          <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 space-y-8">
            {/* Layer 1: Client Channels */}
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase block mb-3">1. CLIENT ACCESS LAYER (ZIMBABWEAN FARMERS & EXTENSION AGENTS)</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-stone-900 border border-emerald-500/30 text-center">
                  <span className="text-xs font-bold text-emerald-400 block">USSD (*384*263#)</span>
                  <span className="text-[10px] text-stone-400">Basic 2G Feature Phone (~60% smallholders)</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-blue-500/30 text-center">
                  <span className="text-xs font-bold text-blue-400 block">SMS (Shortcode 384)</span>
                  <span className="text-[10px] text-stone-400">2-Way Keyword & Daily Alerts</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-teal-500/30 text-center">
                  <span className="text-xs font-bold text-teal-400 block">WhatsApp Bot</span>
                  <span className="text-[10px] text-stone-400">Interactive Rich Cards & Photos</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30 text-center">
                  <span className="text-xs font-bold text-amber-400 block">Progressive Web App</span>
                  <span className="text-[10px] text-stone-400">Offline-first, Extension Officers</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-purple-500/30 text-center">
                  <span className="text-xs font-bold text-purple-400 block">Mobile App (Android)</span>
                  <span className="text-[10px] text-stone-400">Offline SQLite, Camera & GPS</span>
                </div>
              </div>
            </div>

            {/* Layer 2: Thin Channel Adapters */}
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase block mb-3">2. THIN CHANNEL ADAPTER LAYER (TRANSLATORS ONLY - NO BUSINESS LOGIC)</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                  <span className="text-emerald-300 font-bold block">UssdAdapter</span>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Converts Africa's Talking POST payload to CanonicalAdvisoryRequest; formats response into strict ≤182 char CON/END strings.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                  <span className="text-blue-300 font-bold block">SmsAdapter & WhatsAppAdapter</span>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Parses keywords (PLANT, WEATHER); generates single 160-char SMS or Meta Cloud API interactive JSON button templates.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                  <span className="text-amber-300 font-bold block">REST & PWA Adapter</span>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Serves JSON payload with HTTP caching, ETag, and service worker offline manifests.
                  </p>
                </div>
              </div>
            </div>

            {/* Layer 3: Core Domain Services */}
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase block mb-3">3. CORE DOMAIN SERVICES (CHANNEL-AGNOSTIC ENGINE)</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-bold">
                  AdvisoryService
                  <span className="text-[9px] text-stone-400 block font-normal mt-0.5">Rules Engine</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold">
                  FarmerService
                  <span className="text-[9px] text-stone-400 block font-normal mt-0.5">1-to-N Identity</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold">
                  LocationService
                  <span className="text-[9px] text-stone-400 block font-normal mt-0.5">Natural Region I-V</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold">
                  WeatherService
                  <span className="text-[9px] text-stone-400 block font-normal mt-0.5">Ward Forecast</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-white font-bold">
                  MarketService
                  <span className="text-[9px] text-stone-400 block font-normal mt-0.5">Mbare / ZMX</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-dashed border-stone-700 text-purple-300 font-bold">
                  ML Advisory (Phase 2+)
                  <span className="text-[9px] text-stone-400 block font-normal mt-0.5">FastAPI Python</span>
                </div>
              </div>
            </div>

            {/* Layer 4: Persistence & Gateways */}
            <div>
              <span className="text-[11px] font-mono text-stone-500 uppercase block mb-3">4. PERSISTENCE & EXTERNAL GATEWAYS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono">
                  <span className="text-white font-bold block mb-1">Database & Session Cache</span>
                  <p className="text-[11px] text-stone-400">
                    • PostgreSQL 16 + PostGIS for spatial ward centroids & Natural Region boundary resolution.<br />
                    • Redis for 20-second USSD session state machines, Open-Meteo weather caching & rate limiting.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono">
                  <span className="text-white font-bold block mb-1">External Integrations</span>
                  <p className="text-[11px] text-stone-400">
                    • Africa's Talking USSD/SMS Zimbabwe Telco Gateway (*384#)<br />
                    • Meta WhatsApp Business Cloud API<br />
                    • Open-Meteo High-Resolution Ward Weather API
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CHANNEL CONTRACTS */}
      {activeSection === 'contracts' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-white">Channel Contract Specification</h2>
              <p className="text-xs text-stone-400">Canonical Request & Response schemas with worked examples per channel</p>
            </div>
            <button
              onClick={() => copyCode(JSON.stringify(sampleCanonicalContract, null, 2), 'canonical')}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
            >
              {copiedKey === 'canonical' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Schema</span>
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-stone-300 uppercase">
              1. The Canonical Response Object (Produced by Core AdvisoryService)
            </h3>
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-[300px]">
              <pre>{JSON.stringify(sampleCanonicalContract, null, 2)}</pre>
            </div>
          </div>

          {/* 4 Channel Translations */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h3 className="text-xs font-mono font-bold text-stone-300 uppercase">
              2. Worked Channel Outputs Generated from the SAME Core Response Above
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-emerald-400 font-bold">A. USSD CON String (142 chars ≤ 182)</span>
                  <span className="text-[10px] text-stone-500">Plain Text</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 text-[#86efac] border border-stone-800">
                  CON ZimSmart: Reg IIb Maize. Plant SC513 medium hybrid. Basal: Compound D 300kg/ha. Dig Pfumvudza basins to trap moisture. Rain: 700mm.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-400 font-bold">B. Outbound SMS (152 chars ≤ 160)</span>
                  <span className="text-[10px] text-stone-500">GSM 7-bit</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 text-stone-200 border border-stone-800">
                  ZimSmart: Plant SC513 maize in Reg IIb. Basal Compound D 300kg/ha. Use Pfumvudza mulch to survive dry spells. Expected rain: 650-750mm.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-teal-400 font-bold">C. WhatsApp Interactive Card</span>
                  <span className="text-[10px] text-stone-500">Meta Cloud API JSON</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 text-stone-300 border border-stone-800 text-[10px] overflow-x-auto max-h-[120px]">
                  <pre>{`{
  "messaging_product": "whatsapp",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "*Planting Advice (Makoni W12)*\\nVariety: SC513\\nFertilizer: Compound D 300kg/ha" },
    "action": { "buttons": [{ "reply": { "id": "weather", "title": "Weather Alert" } }] }
  }
}`}</pre>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-amber-400 font-bold">D. Web PWA / Mobile REST</span>
                  <span className="text-[10px] text-stone-500">HTTP/2 JSON</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 text-stone-300 border border-stone-800 text-[10px]">
                  GET /api/v1/advisory/planting?farmerId=farmer_001<br />
                  Returns full CanonicalAdvisoryResponse with GPS coordinates, forecast & full translations.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: USSD MENU TREE */}
      {activeSection === 'ussd_tree' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-white">USSD Menu State Machine & Screen Flows</h2>
              <p className="text-xs text-stone-400">Designed for 20-second session timeouts, character limits (≤182), and graceful recovery</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              *384*263# Menu Map
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`=================================================================================
ZIMSMART GROW: USSD NAVIGATION TREE (*384*263#)
=================================================================================

[ENTRY POINT] Farmer dials *384*263#
  │
  ├─► [CHECK IDENTIFIER] Query PostgreSQL / Redis: Is MSISDN registered?
  │
  ├─► IF NOT REGISTERED (Onboarding Flow):
  │     │
  │     ├─► SCREEN 0: Language Selection (88 chars ≤ 182)
  │     │   CON Welcome to ZimSmart Grow!
  │     │   Sarudza mutauro / Choose language / Khetha ulimi:
  │     │   1. Shona
  │     │   2. English
  │     │   3. Ndebele
  │     │
  │     ├─► SCREEN 1: Full Name Input (59 chars ≤ 182)
  │     │   CON Pindai zita renyu rizere (Semuenzaniso: Tendai Mudzviti):
  │     │
  │     ├─► SCREEN 2: Province Selection (145 chars ≤ 182)
  │     │   CON Select Province:
  │     │   1. Manicaland
  │     │   2. Mash Central
  │     │   3. Mash East
  │     │   4. Mash West
  │     │   5. Midlands
  │     │   6. Masvingo
  │     │   7. Mat North
  │     │   8. Mat South
  │     │
  │     ├─► SCREEN 3: District Selection (filtered by Province) (65 chars ≤ 182)
  │     │   CON Manicaland District:
  │     │   1. Makoni
  │     │   2. Nyanga
  │     │   3. Buhera
  │     │   4. Mutare
  │     │
  │     ├─► SCREEN 4: Ward Selection (Auto-resolves Natural Region I-V) (112 chars ≤ 182)
  │     │   CON Makoni Ward:
  │     │   1. Ward 12 (Nyazura) (Reg IIb)
  │     │   2. Ward 25 (Headlands) (Reg IIa)
  │     │   3. Ward 3 (Tsungwesi) (Reg III)
  │     │
  │     ├─► SCREEN 5: Primary Crop Selection (82 chars ≤ 182)
  │     │   CON Select Primary Crop:
  │     │   1. Maize
  │     │   2. Sorghum
  │     │   3. Tobacco
  │     │   4. Cotton
  │     │   5. Groundnuts
  │     │
  │     └─► SCREEN 6: Registration Acknowledgment (128 chars ≤ 182)
  │         END Zvakanaka Tendai!
  │         Wanyoreswa muMakoni (Dunhu IIb).
  │         Dial *384*263# chero nguva kuti uwane zano rekudyara nemitengo.
  │
  └─► IF ALREADY REGISTERED (Main Advisory Menu):
        │
        ├─► MAIN MENU SCREEN (118 chars ≤ 182)
        │   CON ZimSmart (Tendai)
        │   Makoni W12 (Dunhu IIb)
        │   1. Zano rekudyara (Planting Advice)
        │   2. Mamiriro ekunze (Daily Weather)
        │   3. Mitengo yezvirimwa (Market Prices)
        │   4. Shandura mbeu (Change Crop)
        │
        ├─► [1] PLANTING RECOMMENDATION (142 chars ≤ 182)
        │   END ZimSmart: Reg IIb Maize. Plant SC513 medium hybrid.
        │   Basal: Compound D 300kg/ha. Dig Pfumvudza basins to trap moisture.
        │   Rain: 700mm.
        │
        ├─► [2] DAILY WEATHER ALERT (145 chars ≤ 182)
        │   END Makoni W12: Scattered Thunderstorms, 26C.
        │   70% rain (12mm) tomorrow.
        │   ACTION: Delay top-dressing fertilizer to prevent leaching.
        │
        ├─► [3] MARKET PRICES (140 chars ≤ 182)
        │   END Mkt: Maize $335/t (GMB), $14.50/50kg (Mbare).
        │   Tobacco $3.85/kg. Sorghum $360/t (ZMX).
        │   Groundnuts $18/20L. Prices live today.
        │
        └─► [4] CHANGE CROP
            CON Select new crop:
            1. Maize  2. Sorghum  3. Tobacco  4. Cotton
            └─► END ZimSmart: Primary crop updated successfully.`}
          </div>
        </div>
      )}

      {/* SECTION 4: DATABASE SCHEMA */}
      {activeSection === 'schema' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-white">PostgreSQL + PostGIS DDL Schema</h2>
              <p className="text-xs text-stone-400">Optimized tables and spatial indexes for 100,000+ farmers across Zimbabwe</p>
            </div>
            <button
              onClick={() => copyCode(sqlSchema, 'schema')}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
            >
              {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy SQL Script</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-[500px]">
            <pre>{sqlSchema}</pre>
          </div>
        </div>
      )}

      {/* SECTION 5: SETUP & TESTING */}
      {activeSection === 'testing' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-white">Setup, Ngrok & Live Gateway Test Harness</h2>
              <p className="text-xs text-stone-400">Step-by-step instructions to wire Africa's Talking sandbox to this running prototype</p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-stone-300 leading-relaxed">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <span className="font-bold text-white block">Step 1: Start Server Locally</span>
              <p className="text-stone-400">The server runs on port 3000 handling both Express API routes and Vite frontend:</p>
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 font-mono text-emerald-400">
                npm run dev
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <span className="font-bold text-white block">Step 2: Expose via Ngrok</span>
              <p className="text-stone-400">In a separate terminal, expose port 3000 to the public web:</p>
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 font-mono text-emerald-400">
                ngrok http 3000
              </div>
              <p className="text-stone-400">
                Copy the forwarding URL, e.g.: <code className="text-emerald-300">https://abc1234.ngrok-free.app</code>
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <span className="font-bold text-white block">Step 3: Register Callback on Africa's Talking Sandbox</span>
              <p className="text-stone-400">
                1. Log into your Africa's Talking Dashboard &gt; USSD &gt; Service Codes.<br />
                2. Set the <b>Callback URL</b> to:
              </p>
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 font-mono text-emerald-400">
                https://abc1234.ngrok-free.app/api/v1/ussd/africastalking
              </div>
              <p className="text-stone-400">3. Launch the Africa's Talking Web Simulator and dial *384*263#.</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
              <span className="font-bold text-white block">Step 4: Immediate Curl Verification Command</span>
              <p className="text-stone-400">You can also test the live webhook directly via terminal without waiting for an ngrok tunnel:</p>
              <div className="p-2.5 rounded bg-stone-900 border border-stone-800 font-mono text-emerald-400 overflow-x-auto">
{`# Test Registered Farmer (Sekuru Tendai) Requesting Planting Advice
curl -X POST http://localhost:3000/api/v1/ussd/africastalking \\
  -H "Content-Type: application/json" \\
  -d '{"sessionId":"test_101","phoneNumber":"+263772111222","text":"1","serviceCode":"*384*263#"}'

# Expected output:
# END ZimSmart: Reg IIb Maize. Plant SC513 medium hybrid. Basal: Compound D 300kg/ha. Dig Pfumvudza basins to trap moisture. Rain: 700mm.`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const sampleCanonicalContract = {
  adviceId: "adv_IIb_crop_maize_1727189000",
  farmerId: "farmer_001",
  crop: {
    id: "crop_maize",
    name: "Maize (Chibage / Umbila)"
  },
  location: {
    wardName: "Ward 12 (Nyazura)",
    districtName: "Makoni",
    provinceName: "Manicaland",
    naturalRegion: "IIb",
    gpsCentroid: {
      latitude: -18.712,
      longitude: 32.181
    }
  },
  timing: {
    seasonStatus: "optimal_planting",
    monthName: "November",
    urgency: "high"
  },
  agronomicRecommendation: {
    summary: "Medium rainfall with dry spell risk. Plant medium maturity SC513. Practice moisture conservation (pfumvudza/pot-holing).",
    recommendedVariety: "SC513 or SC529 (Medium Maturity, 125-135 days)",
    plantingWindow: "November - January",
    spacing: "90cm between rows, 28cm in-row (39,000 plants/ha)",
    fertilizerBasal: "Compound D @ 250-300 kg/ha at planting",
    expectedRainfallBand: "650mm - 800mm"
  },
  weatherGrounding: {
    currentCondition: "Scattered Thunderstorms Expected",
    forecastNext3Days: "70% chance of rain (12mm)",
    actionableWeatherAdvice: "Rain expected tomorrow (12mm) in Makoni. Delay top-dressing fertilizer to avoid leaching."
  },
  localizedTranslations: {
    en: {
      ussdText: "ZimSmart: Reg IIb Maize. Plant SC513 medium hybrid. Basal: Compound D 300kg/ha. Dig Pfumvudza basins to trap moisture. Rain: 700mm.",
      smsText: "ZimSmart: Plant SC513 maize in Reg IIb. Basal Compound D 300kg/ha. Use Pfumvudza mulch to survive dry spells. Expected rain: 650-750mm."
    },
    sn: {
      ussdText: "ZimSmart: Chibage Dunhu IIb. Dyara SC513. Isa Compound D 300kg/ha. Chera makomba ePfumvudza kudzivirira kusanaya. Mvura: 700mm.",
      smsText: "ZimSmart: Dyara SC513 muDunhu IIb. Compound D 300kg/ha. Shandisa huswa/pfumvudza kuchengeta hunyoro pakusanaya kwemvura. Mvura: 700mm."
    },
    nr: {
      ussdText: "ZimSmart: Umbila Isigaba IIb. Hlanyela SC513. Faka Compound D 300kg/ha. Gciba imigodi ye-Intwasa ukugcina umswakama. Izulu: 700mm.",
      smsText: "ZimSmart: Hlanyela SC513 esigabeni IIb. Compound D 300kg/ha. Faka utshani be-Intwasa ukulondoloza umswakama wesomiso. Izulu: 700mm."
    }
  },
  generatedAt: "2026-09-24T07:15:00.000Z"
};
