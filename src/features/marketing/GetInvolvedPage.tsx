import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  HandHeart,
  DollarSign,
  Cpu,
  GraduationCap,
  Send,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { toast } from '../../store/toastStore';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';

export const GetInvolvedPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [areaOfInterest, setAreaOfInterest] = useState('Investment');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent discard for bots

    if (!name || !email || !message) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success(
        'Thank you! Your inquiry has been routed to our founding team in Harare.',
        'Message Transmitted'
      );
    }, 850);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-grow-100 dark:bg-grow-950 text-xs font-semibold text-grow-800 dark:text-grow-300">
          <HandHeart className="w-4 h-4" /> Strategic Partnerships & Pre-Seed Round
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal dark:text-white">
          Join Us in Transforming Smallholder Agriculture
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          ZimSmart Grow is partnering with angel investors, impact funds, agribusiness processors, and agronomy researchers to scale across Zimbabwe.
        </p>
      </div>

      {/* Prominent Funding Ask Card: US$112,000 */}
      <div className="bg-gradient-to-br from-grow-900 via-grow-800 to-grow-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-harvest font-bold">
              Pre-Seed Pilot Round Target
            </span>
            <div className="text-4xl sm:text-6xl font-extrabold font-mono text-white tabular-nums">
              US$112,000
            </div>
            <p className="text-xs sm:text-sm text-grow-100/90 leading-relaxed max-w-lg">
              12-month runway funding to scale from 10 pilot cluster hubs to 25,000 active smallholder farmers in Mashonaland West and Manicaland, establishing verified offtake pipelines with National Foods and Cairns.
            </p>

            {/* Allocation Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-mono font-bold text-amber-harvest">US$42,000</div>
                <div className="text-[11px] text-grow-200">Cluster Hubs</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-mono font-bold text-emerald-300">US$35,000</div>
                <div className="text-[11px] text-grow-200">AI & USSD Infra</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-mono font-bold text-white">US$20,000</div>
                <div className="text-[11px] text-grow-200">Farmer Onboarding</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="font-mono font-bold text-white">US$15,000</div>
                <div className="text-[11px] text-grow-200">Operations & Legal</div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-amber-harvest">
              Investor Key Milestones
            </h3>
            <div className="space-y-3 text-xs text-grow-50">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>25,000 smallholders actively diagnosed per season</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>US$1.2M in gross offtake contract value brokered</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Unit economics validated for Series-A institutional round</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Columns: Funding, Technical, Mentorship */}
      <div id="partners" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
            1. Funding Partners
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Seeking catalytic pre-seed capital from impact funds, climate-smart agritech angels, and development finance institutions.
          </p>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-grow-600" /> SAFE notes / Equity allocations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-grow-600" /> Quarterly impact audit reporting
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-grow-600" /> Direct access to DaaS intelligence
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-trust-blue flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
            2. Technical Partners
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Collaborating on satellite agrometeorology, machine vision disease datasets, and telecommunications SMS/USSD integrations.
          </p>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-trust-blue" /> Econet / NetOne USSD gateway integration
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-trust-blue" /> University of Zimbabwe Crop Science collab
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-trust-blue" /> Hyper-local soil sensor pilots
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
            3. Offtake & Mentorship
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Partnering with food processors, agricultural boards (TIMB, GMB), and pan-African agritech operators.
          </p>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Commercial offtake forward contracts
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Input supplier affiliate discount programs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Regional SADC expansion roadmap
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Inquiry Form */}
      <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-8 sm:p-10 shadow-xs max-w-2xl mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold font-heading text-charcoal dark:text-white">
            Get in Touch with our Founders
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Request our investor memorandum, financial model, or schedule a field visit to our Makonde cluster hub.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal dark:text-white">
              Thank You for Reaching Out
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Our growth and partnership lead will review your submission and respond within 24 business hours.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setMessage('');
              }}
              className="mt-2 px-4 py-2 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot field (hidden from legitimate users) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_url_check"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tendai Chikore"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@fund.com"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Organization / Entity
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. AgriVentures Africa"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Area of Interest
                </label>
                <select
                  value={areaOfInterest}
                  onChange={(e) => setAreaOfInterest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                >
                  <option value="Investment">Pre-Seed Investment ($112k)</option>
                  <option value="Offtake">Commercial Crop Offtake / Purchasing</option>
                  <option value="Technical">Technical / AI / Telco Integration</option>
                  <option value="Mentorship">Advisory / Mentorship</option>
                  <option value="Media">Media / Agritech Research</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your Message / Proposal *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your investment thesis, offtake volume requirements, or technical collaboration proposal..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                'Transmitting Message…'
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Partnership Inquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
