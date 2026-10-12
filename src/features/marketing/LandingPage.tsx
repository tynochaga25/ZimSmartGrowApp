import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sprout,
  ScanLine,
  TrendingUp,
  CloudRain,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Store,
  BarChart3,
  Smartphone,
  Layers,
} from 'lucide-react';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

export const LandingPage: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Snap Leaf Image or Dial USSD',
      desc: 'Farmers photograph infected crops on smartphones or request offline advisories through 2G SMS/USSD codes.',
      icon: <Smartphone className="w-5 h-5 text-grow-600" />,
    },
    {
      step: '02',
      title: 'Instant AI Computer Vision Diagnosis',
      desc: 'Regional machine vision models identify pests like Fall Armyworm or Late Blight within 3 seconds with 90%+ confidence.',
      icon: <ScanLine className="w-5 h-5 text-amber-500" />,
    },
    {
      step: '03',
      title: 'Actionable Treatment & Planting Windows',
      desc: 'Receive local agro-dealer recommendations, dosage steps, and micro-climate rain advisories to protect yields.',
      icon: <CloudRain className="w-5 h-5 text-trust-blue" />,
    },
    {
      step: '04',
      title: 'Direct Linkage to Commercial Offtakers',
      desc: 'Connect directly with certified buyers like National Foods and Cairns Foods, bypassing extractive middlemen.',
      icon: <Store className="w-5 h-5 text-grow-700" />,
    },
    {
      step: '05',
      title: 'Guaranteed Weighbridge Payout',
      desc: 'Fast digital settlement via EcoCash USD or RTGS within 48 hours of warehouse drop-off and quality grading.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-grow-100 dark:bg-grow-950/80 border border-grow-200 dark:border-grow-900 text-xs font-semibold text-grow-800 dark:text-grow-300">
                <span className="w-2 h-2 rounded-full bg-grow-600" />
                Agritech Innovation for Zimbabwe & Southern Africa
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-charcoal dark:text-white tracking-tight leading-[1.15] text-balance">
                AI-Powered Farming Intelligence for Every Smallholder Farmer in Zimbabwe
              </h1>

              <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl text-pretty">
                Bridging the agronomic knowledge gap and connecting rural producers directly to verified industrial commodity buyers. Diagnose diseases in seconds, optimize harvest timing, and eliminate post-harvest losses.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/signup"
                  className="px-6 py-3.5 bg-grow-600 hover:bg-grow-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signin"
                  className="px-6 py-3.5 bg-white dark:bg-dark-card hover:bg-neutral-50 dark:hover:bg-dark-surface border border-neutral-300 dark:border-dark-border text-charcoal dark:text-neutral-200 text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Sign In to Account
                </Link>
                <Link
                  to="/get-involved"
                  className="px-4 py-3.5 text-xs font-semibold text-grow-700 dark:text-grow-400 hover:underline flex items-center gap-1"
                >
                  Investor Deck ($112k Ask) →
                </Link>
              </div>

              <div className="pt-4 border-t border-neutral-200/60 dark:border-dark-border flex flex-wrap items-center gap-6 text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-grow-600" />
                  <span>Works on low-cost smartphones & USSD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-grow-600" />
                  <span>Zero subscription fees for basic diagnosis</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-dark-border group">
                <img
                  src="/src/assets/images/hero_farmer_harvest_1791811870356.jpg"
                  alt="Smallholder farmer inspecting healthy maize crop with smartphone in Zimbabwe"
                  className="w-full h-auto aspect-16/10 sm:aspect-4/3 object-cover group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Floating telemetry callout */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border border-white/20 shadow-lg text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-charcoal dark:text-white flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-grow-600" /> Field Cluster #4 (Chinhoyi)
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 font-bold tabular-nums">94.2% Health Score</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                    Maize Stage: Vegetative V6 · Moisture optimal for urea application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metric Banner (Animated Counters strictly from business plan) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-grow-900 via-grow-800 to-grow-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
                <AnimatedCounter value={3} suffix="M+" />
              </div>
              <div className="text-xs sm:text-sm text-grow-100 font-medium mt-1">Smallholder Farmers</div>
              <div className="text-[11px] text-grow-200/70 mt-0.5">Target addressable market in Zimbabwe</div>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-5xl font-extrabold font-heading text-amber-harvest">
                <AnimatedCounter value={30} prefix="+" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-grow-100 font-medium mt-1">Potential Yield Increase</div>
              <div className="text-[11px] text-grow-200/70 mt-0.5">Driven by early disease intervention</div>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-5xl font-extrabold font-heading text-emerald-300">
                <AnimatedCounter value={40} prefix="-" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-grow-100 font-medium mt-1">Post-Harvest Loss Reduction</div>
              <div className="text-[11px] text-grow-200/70 mt-0.5">Through direct warehouse offtake</div>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
                <AnimatedCounter value={420} prefix="US$" suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-grow-100 font-medium mt-1">Farmer Income Uplift</div>
              <div className="text-[11px] text-grow-200/70 mt-0.5">Average seasonal household gain</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: 3 Core Pillars */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal dark:text-white">
            Three Integrated Engines for Smallholder Transformation
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Engineered specifically for Zimbabwean agricultural conditions, crop varieties, and logistics corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400 flex items-center justify-center">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal dark:text-white">
                AI Crop Disease Diagnosis
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Computer vision models trained on African pathology databases identify Late Blight, Fall Armyworm, and Tobacco Mosaic Virus with 90%+ confidence. Delivers immediate localized remedy protocols.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-100 dark:border-dark-border mt-6">
              <Link
                to="/diagnose"
                className="text-xs font-semibold text-grow-700 dark:text-grow-400 hover:text-grow-800 flex items-center gap-1.5"
              >
                Try Disease Scanner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-trust-blue flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal dark:text-white">
                Guaranteed Market Offtake
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Direct aggregation connecting organized farmer clusters with verified industrial buyers like National Foods, Cairns, and GMB. Eliminates exploitative middlemen with transparent weighbridge pricing.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-100 dark:border-dark-border mt-6">
              <Link
                to="/market"
                className="text-xs font-semibold text-trust-blue hover:underline flex items-center gap-1.5"
              >
                Browse Buyer Requests <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal dark:text-white">
                Data-as-a-Service (DaaS)
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Aggregated, anonymized agronomic telemetry providing real-time yield forecasts, disease spread tracking, and smallholder credit scoring for NGOs, microfinance banks, and seed distributors.
              </p>
            </div>
            <div className="pt-6 border-t border-neutral-100 dark:border-dark-border mt-6">
              <Link
                to="/admin"
                className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1.5"
              >
                Inspect Ecosystem Analytics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* "How It Works" 5-Step Timeline */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold text-grow-700 dark:text-grow-400 uppercase tracking-wider mb-1">
            End-to-End Smallholder Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal dark:text-white">
            From Field Problem to Banked Harvest in 5 Steps
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-dark-border -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-grow-700 dark:text-grow-400 bg-grow-50 dark:bg-dark-surface px-2 py-0.5 rounded-md">
                      {item.step}
                    </span>
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-dark-surface">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold font-heading text-charcoal dark:text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Ecosystem Partners Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-dark-surface border border-neutral-200/80 dark:border-dark-border text-center">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-6">
            Aligned with Zimbabwean Agricultural Ecosystem & Commercial Offtakers
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all">
            <div className="text-sm font-bold tracking-tight font-heading text-neutral-600 dark:text-neutral-300">
              NATIONAL FOODS
            </div>
            <div className="text-sm font-bold tracking-tight font-heading text-neutral-600 dark:text-neutral-300">
              CAIRNS FOODS
            </div>
            <div className="text-sm font-bold tracking-tight font-heading text-neutral-600 dark:text-neutral-300">
              GMB ZIMBABWE
            </div>
            <div className="text-sm font-bold tracking-tight font-heading text-neutral-600 dark:text-neutral-300">
              AGRITEX EXTENSION
            </div>
            <div className="text-sm font-bold tracking-tight font-heading text-neutral-600 dark:text-neutral-300">
              TIMB TOBACCO BOARD
            </div>
            <div className="text-sm font-bold tracking-tight font-heading text-neutral-600 dark:text-neutral-300">
              ECOCASH USD
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Seed Ask Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-grow-200 dark:border-grow-900 bg-grow-50/70 dark:bg-grow-950/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-grow-700 dark:text-grow-400">
              Pre-Seed Pilot Investment
            </div>
            <h3 className="text-2xl font-bold font-heading text-charcoal dark:text-white">
              US$112,000 Funding Opportunity for Series-A Readiness
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We are raising US$112,000 to deploy 10 regional smallholder cluster hubs across Mashonaland West, calibrate offline USSD pipelines, and onboard 25,000 farmers in year one.
            </p>
          </div>
          <Link
            to="/get-involved"
            className="px-6 py-3 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            Review Pre-Seed Ask & Deck <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
