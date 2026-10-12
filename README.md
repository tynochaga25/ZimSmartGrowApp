# ZimSmart Grow — Investor-Ready AgriTech Platform MVP

> **AI-Powered Farming Intelligence for Every Smallholder Farmer in Zimbabwe**

ZimSmart Grow is a full-stack, data-driven agricultural intelligence web application engineered specifically for the Zimbabwean smallholder farming ecosystem. It bridges the critical agronomic knowledge and market access gap through computer vision disease diagnosis, hyper-local meteorological planting windows, and direct commercial offtaker integration.

---

## 🌾 Demo Access & Credentials (Investor & Partner Evaluation)

The platform includes **1-click instant demo access** on the `/signin` screen, the navigation user menu, and the `⌘K` Command Palette:

| Role | Demo Persona | Credentials / Auth Method | Primary Workspace |
|---|---|---|---|
| **Smallholder Farmer** | Tendai Moyo (Chinhoyi, Makonde District, 3.5 ha) | Mobile: `077 234 5678` <br> OTP Code: `123456` | `/dashboard` |
| **Commodity Buyer / Offtaker** | Farai Chitepo (National Foods Holdings Ltd) | Email: `f.chitepo@nationalfoods.co.zw` <br> Pass: `password123` | `/market` |
| **Executive / Impact Admin** | Rudo Nyathi (ZimSmart Growth Lead) | Email: `rudo.nyathi@zimsmartgrow.co.zw` <br> Pass: `password123` | `/admin` |

---

## 🚀 Key Features & Mapping to the Business Plan

### 1. AI Crop Disease Diagnosis (`/diagnose` — Section 3.1)
- **Computer Vision Diagnostics**: Identifies destructive regional crop diseases (Late Blight in Tomatoes, Fall Armyworm in White Maize, Tobacco Mosaic Virus in Flue-Cured Virginia) with confidence ratings (87%–94%).
- **Staged Diagnostic Sequence**: Simulates 3-stage visual inspection (`Uploading image…` → `Analyzing cellular symptoms with computer vision…` → `Matching against regional African disease library…`).
- **Instant Treatment Protocols**: Actionable, step-by-step agronomic treatment steps using locally available agro-chemicals and bio-fungicides.
- **Sample Specimen Gallery**: 3 verified field sample photographs included so live investor demos never stall.

### 2. Direct Offtaker Marketplace (`/market` — Section 3.2)
- **Verified Purchase Orders**: Forward contracts from major Zimbabwean food processors and buyers:
  - **National Foods Holdings Ltd**: 50 tonnes Grade A White Maize @ US$320/t
  - **Cairns Foods Processing**: 25 tonnes Roma Tomatoes @ US$19.50/crate
  - **Grain Marketing Board (GMB)**: 120 tonnes Soya Beans @ US$585/t
  - **Northern Tobacco Auction**: 15 tonnes Flue-Cured Virginia @ US$4.25/kg
  - **FreshMark / OK Zimbabwe**: 8 tonnes weekly Horticulture @ US$0.48/kg
- **Harvest Batch Creation**: Smallholders can list upcoming harvests with crop type, quantity, harvest date, and asking price.
- **Contract Fulfillment Modal**: Instant binding order dispatch with calculated gross payout.

### 3. Farmer Telemetry Dashboard (`/dashboard`)
- **Hyper-Local 5-Day Weather**: Temperature highs/lows, precipitation probabilities, and animated weather states.
- **Planting & Spraying Advisory**: Dynamic alerts warning against foliar spraying ahead of afternoon rains.
- **Live Spot Price Sparklines**: 7-day price trend curves for Maize, Tobacco, Tomatoes, and Soya Beans using Recharts.
- **Crop Cycle Tracking**: Visual growth percentage bars and phenological stages (`Vegetative`, `Flowering`, `Maturity`).

### 4. Executive Impact & DaaS Analytics (`/admin` — Section 13)
- **Cohort Velocity**: 12-month registered smallholders vs. Monthly Active Users (MAU) area chart.
- **Commercial Revenue Breakdown**: Donut chart detailing Freemium subscriptions (35%), Market offtake fees (28%), Data-as-a-Service subscriptions (24%), and Agro-dealer listing fees (13%).
- **Provincial Distribution**: Real geo-tagged breakdown across Mashonaland West, Mashonaland East, Manicaland, Midlands, Masvingo, and Matabeleland.
- **Tangible DaaS CSV Export**: One-click generation and browser download of anonymized agronomic surveillance data.

### 5. Pre-Seed Investment Opportunity (`/get-involved` — Section 14)
- **Pre-Seed Target**: **US$112,000** for 10 regional cluster hubs, USSD offline pipelines, and onboarding 25,000 farmers in year one.
- **Strategic Triad**: Pillars for Funding Partners, Technical Partners, and Mentorship/Offtake networks.
- **Interactive Contact Form**: Direct inquiry routing with anti-bot honeypot protection.

---

## 🛠 Tech Stack & Architecture

- **Core**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS theme variables, Poppins & Inter typography
- **State & Persistence**: Zustand with `persist` middleware storing session tokens to `zimsmart.auth` in `localStorage`
- **Routing**: `react-router-dom` v6 with lazy-loaded code-splitting and skeleton Suspense fallbacks
- **Visualizations**: `recharts` responsive area, line, and pie charts
- **Animations**: `motion/react` (Framer Motion) micro-interactions, modal transitions, and OTP auto-advancing inputs
- **Icons**: `lucide-react` with 1.5px consistent stroke
- **Global Affordances**:
  - `⌘K` / `Ctrl+K` Command Palette for quick view jumps and actions
  - Auto-dismissing Toast notification engine
  - Dark mode support with persistent state

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# 3. Build for production
npm run build
```
