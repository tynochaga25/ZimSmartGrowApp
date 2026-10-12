import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl z-10"
      >
        <div className="p-4 border-b border-neutral-100 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-charcoal dark:text-gray-100">Terms of Service & Data Privacy</h3>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <div>
            <h4 className="font-semibold text-charcoal dark:text-gray-100 mb-1">1. Agronomic Advisory & AI Diagnostics</h4>
            <p>
              ZimSmart Grow provides AI-driven crop disease diagnostics and meteorological planting advisories as decision-support tools. Recommendations are based on machine vision models trained on regional pathology data. Farmers should exercise reasonable field discretion and consult AGRITEX extension officers when in doubt.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-charcoal dark:text-gray-100 mb-1">2. Market Linkages & Transparent Trading</h4>
            <p>
              Listing prices and offtake agreements facilitated through the platform represent binding commercial indications between registered smallholders and accredited buyers (e.g., National Foods, Cairns, GMB). ZimSmart Grow levies a standardized platform facilitation fee of 1.5%–2.5% strictly upon successful weighbridge verification.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-charcoal dark:text-gray-100 mb-1">3. Smallholder Data Sovereignty & Anonymization</h4>
            <p>
              Smallholder farm coordinates and personal identities are strictly encrypted. Anonymized regional yield indicators and disease surveillance records may be aggregated for public agronomic research and Data-as-a-Service (DaaS) subscriptions to improve national food security.
            </p>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-dark-surface rounded-xl border border-neutral-100 dark:border-dark-border flex items-center gap-2 text-[11px] text-grow-800 dark:text-grow-300">
            <ShieldCheck className="w-4 h-4 text-grow-600 shrink-0" />
            <span>Compliant with Zimbabwean Cyber and Data Protection Act & international agribusiness standards.</span>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 dark:border-dark-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </motion.div>
    </div>
  );
};
