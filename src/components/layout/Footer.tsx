import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-dark-border mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-grow-700 dark:text-grow-400 font-bold text-base">
              <div className="w-6 h-6 rounded-md bg-grow-600 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-heading text-charcoal dark:text-white">
                ZimSmart <span className="text-grow-600 dark:text-grow-400">Grow</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              AI-powered agricultural intelligence for every smallholder farmer in Zimbabwe. Connecting diagnostics, hyper-local weather, and guaranteed offtake markets.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-grow-600" />
              <span>Secured with 256-bit encryption</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200 mb-3 font-heading">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li><Link to="/diagnose" className="hover:text-grow-600 transition-colors">AI Crop Disease Diagnosis</Link></li>
              <li><Link to="/market" className="hover:text-grow-600 transition-colors">Direct Offtaker Marketplace</Link></li>
              <li><Link to="/dashboard" className="hover:text-grow-600 transition-colors">Hyper-local Weather & Advisories</Link></li>
              <li><Link to="/admin" className="hover:text-grow-600 transition-colors">Data-as-a-Service (DaaS) Engine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200 mb-3 font-heading">
              Ecosystem & Pilot
            </h4>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li><Link to="/get-involved" className="hover:text-grow-600 transition-colors">Pre-Seed Funding Ask ($112k)</Link></li>
              <li><Link to="/get-involved#partners" className="hover:text-grow-600 transition-colors">Agro-Dealer & Buyer Network</Link></li>
              <li><Link to="/signin" className="hover:text-grow-600 transition-colors">Farmer USSD / Mobile Sign In</Link></li>
              <li><Link to="/profile" className="hover:text-grow-600 transition-colors">Account & Farm Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal dark:text-gray-200 mb-3 font-heading">
              Liaison & Field Office
            </h4>
            <div className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-grow-600 shrink-0" />
                <span>Harare Agricultural Innovation Hub, Zimbabwe</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-grow-600 shrink-0" />
                <span className="font-mono tabular-nums">+263 (0242) 789 123 / +263 77 100 2000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-grow-600 shrink-0" />
                <span>contact@zimsmartgrow.co.zw</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} ZimSmart Grow (Pvt) Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Built for Smallholder Empowerment in Zimbabwe</span>
            <span>·</span>
            <span>Mashonaland West Pilot Phase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
