import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Users,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ADMIN_MONTHLY_GROWTH,
  REVENUE_STREAMS,
  PROVINCIAL_DISTRIBUTION,
} from '../../data/mockData';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { mockApi } from '../../lib/mockApi';
import { toast } from '../../store/toastStore';

export const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '12m'>('12m');
  const [activeMetricLegend, setActiveMetricLegend] = useState<'all' | 'registered' | 'active'>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic filter for date range
  const chartData =
    dateRange === '7d'
      ? ADMIN_MONTHLY_GROWTH.slice(-3)
      : dateRange === '30d'
      ? ADMIN_MONTHLY_GROWTH.slice(-6)
      : ADMIN_MONTHLY_GROWTH;

  const handleDownloadCsv = () => {
    setIsExporting(true);
    setTimeout(() => {
      mockApi.exportAnonymizedDataCsv();
      setIsExporting(false);
      toast.success(
        'Anonymized agronomic dataset (CSV) downloaded for DaaS analysis.',
        'Data-as-a-Service Export'
      );
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-grow-700 dark:text-grow-400 mb-1">
            <BarChart3 className="w-4 h-4" /> Section 13 Executive Growth & DaaS Intelligence Console
          </div>
          <h1 className="text-2xl font-bold font-heading text-charcoal dark:text-white">
            Ecosystem Metrics & Impact Telemetry
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time tracking of smallholder onboarding velocity, revenue streams, and provincial yield transformations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Date range selector */}
          <div className="flex p-0.5 rounded-xl bg-neutral-100 dark:bg-dark-surface border border-neutral-200 dark:border-dark-border text-xs">
            {(['7d', '30d', '12m'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  dateRange === range
                    ? 'bg-white dark:bg-dark-card text-grow-700 dark:text-grow-400 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-charcoal'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Tangible DaaS Export Action */}
          <button
            onClick={handleDownloadCsv}
            disabled={isExporting}
            className="px-4 py-2 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Generating CSV…' : 'Export Anonymized Data (CSV)'}
          </button>
        </div>
      </div>

      {/* 4-Up Grid of Large Impact KPIs with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Avg. Smallholder Yield Uplift</span>
            <span className="p-1.5 rounded-lg bg-grow-50 dark:bg-grow-950 text-grow-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-charcoal dark:text-white tabular-nums">
            <AnimatedCounter value={32.4} prefix="+" suffix="%" decimals={1} />
          </div>
          <div className="text-[11px] text-neutral-400">
            Across 24,000 enrolled farmers (Section 13.2)
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Post-Harvest Loss Reduction</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            <AnimatedCounter value={38.5} prefix="-" suffix="%" decimals={1} />
          </div>
          <div className="text-[11px] text-neutral-400">
            Via direct forward contract deliveries
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Average Household Income Uplift</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-trust-blue">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-trust-blue dark:text-blue-400 tabular-nums">
            <AnimatedCounter value={420} prefix="US$" suffix="+" />
          </div>
          <div className="text-[11px] text-neutral-400">
            Net incremental income per crop cycle
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>AI Diagnostic Accuracy Rate</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-harvest">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-harvest dark:text-amber-400 tabular-nums">
            <AnimatedCounter value={94.2} suffix="%" decimals={1} />
          </div>
          <div className="text-[11px] text-neutral-400">
            Verified across 58,600 field scans
          </div>
        </div>
      </div>

      {/* Main Charts: User Analytics & Revenue Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* User Analytics Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
                Farmer Onboarding & Active Users
              </h3>
              <p className="text-xs text-neutral-500">Registered Farmers vs. Monthly Active Users (MAU)</p>
            </div>

            {/* Legend Filter Toggle */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveMetricLegend('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer ${
                  activeMetricLegend === 'all' ? 'bg-grow-100 text-grow-800 font-semibold' : 'text-neutral-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveMetricLegend('registered')}
                className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer ${
                  activeMetricLegend === 'registered' ? 'bg-grow-600 text-white font-semibold' : 'text-neutral-500'
                }`}
              >
                Registered
              </button>
              <button
                onClick={() => setActiveMetricLegend('active')}
                className={`px-2.5 py-1 rounded-md text-[11px] cursor-pointer ${
                  activeMetricLegend === 'active' ? 'bg-trust-blue text-white font-semibold' : 'text-neutral-500'
                }`}
              >
                Active MAU
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 bg-neutral-900 text-white text-xs rounded-xl shadow-xl space-y-1">
                          <div className="font-semibold text-neutral-300">{label}</div>
                          {payload.map((entry: any) => (
                            <div key={entry.name} className="flex justify-between gap-4 font-mono">
                              <span style={{ color: entry.color }}>{entry.name}:</span>
                              <span className="font-bold tabular-nums">
                                {Number(entry.value).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {(activeMetricLegend === 'all' || activeMetricLegend === 'registered') && (
                  <Area
                    type="monotone"
                    name="Registered Farmers"
                    dataKey="registered"
                    stroke="#2E7D32"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#regGrad)"
                  />
                )}
                {(activeMetricLegend === 'all' || activeMetricLegend === 'active') && (
                  <Area
                    type="monotone"
                    name="Active Monthly Users"
                    dataKey="active"
                    stroke="#1565C0"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#actGrad)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-dark-border flex items-center justify-between text-xs text-neutral-500">
            <span>24,000 Enrolled Farmers</span>
            <span className="font-mono">80.0% MAU Retention Rate</span>
          </div>
        </div>

        {/* Revenue Analytics Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
              Revenue Model Breakdown
            </h3>
            <p className="text-xs text-neutral-500">Commercial Stream Allocations (Section 13.3)</p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REVENUE_STREAMS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {REVENUE_STREAMS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 bg-neutral-900 text-white text-xs rounded-xl font-mono shadow-xl">
                          <div className="font-semibold">{data.name}</div>
                          <div className="text-emerald-400 font-bold mt-0.5">
                            {data.value}% ({data.amount})
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold font-mono text-charcoal dark:text-white tabular-nums">
                US$120K
              </span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                Annual ARR
              </span>
            </div>
          </div>

          {/* Revenue Legend List with Values and Percentages */}
          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-dark-border">
            {REVENUE_STREAMS.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate max-w-[220px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">{item.name}</span>
                </div>
                <div className="font-mono font-semibold text-charcoal dark:text-white tabular-nums">
                  {item.value}% <span className="text-neutral-400 font-normal">({item.amount})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Provincial Breakdown Table */}
      <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold font-heading text-charcoal dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-grow-600" />
              Regional Provincial Farmer Distribution & Impact
            </h3>
            <p className="text-xs text-neutral-500">6 Core Zimbabwean Agricultural Provinces</p>
          </div>
          <span className="text-xs text-grow-700 font-mono font-semibold">100% Geo-Tagged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-dark-border text-neutral-400 font-medium">
                <th className="pb-3">Province</th>
                <th className="pb-3">Enrolled Farmers</th>
                <th className="pb-3">National Share</th>
                <th className="pb-3">Yield Growth Delta</th>
                <th className="pb-3 text-right">Pilot Hub Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-dark-border text-charcoal dark:text-neutral-200">
              {PROVINCIAL_DISTRIBUTION.map((row) => (
                <tr key={row.province} className="hover:bg-neutral-50/50 dark:hover:bg-dark-surface/50">
                  <td className="py-3 font-semibold text-charcoal dark:text-white">{row.province}</td>
                  <td className="py-3 font-mono tabular-nums font-medium">
                    {row.farmers.toLocaleString()} farmers
                  </td>
                  <td className="py-3 font-mono tabular-nums text-neutral-500">{row.share}</td>
                  <td className="py-3 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                    {row.yieldGrowth}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-grow-50 text-grow-700 dark:bg-grow-950 dark:text-grow-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-grow-600" />
                      Operational Hub
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
