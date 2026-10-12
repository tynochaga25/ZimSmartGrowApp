import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, UploadCloud, RefreshCw, Smartphone, Leaf } from 'lucide-react';
import { DiagnosticResponse } from '../types';

export const DiseaseDiagnostics: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('crop_maize');
  const [symptomText, setSymptomText] = useState('Ragged holes in leaf whorls with sawdust-like frass droppings');
  const [diagnosis, setDiagnosis] = useState<DiagnosticResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleCases = [
    {
      title: 'Fall Armyworm (Maize)',
      crop: 'crop_maize',
      symptoms: 'Ragged holes in leaf whorls with sawdust-like frass droppings'
    },
    {
      title: 'Maize Streak Virus',
      crop: 'crop_maize',
      symptoms: 'Continuous yellow chlorotic streaks along veins and stunted growth'
    },
    {
      title: 'Tobacco Brown Spot',
      crop: 'crop_tobacco',
      symptoms: 'Concentric brown rings on lower leaves with yellow halo'
    }
  ];

  const runDiagnosis = async (symptoms: string, cropId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/diagnostics/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropId,
          channel: 'web_pwa',
          symptomsObserved: symptoms
        })
      });
      const data = await res.json();
      setDiagnosis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl font-extrabold text-white">AI Crop Doctor: Vision & Diagnostics Contract</h1>
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Phase 3 API Contract Specification
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Fulfills the Phase 1 architectural obligation: Strict API contracts and data models for image-based disease diagnostics, ready for the ML vision model swap-in.
            </p>
          </div>
        </div>

        {/* Sample presets */}
        <div className="mt-6 pt-6 border-t border-stone-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">Test Presets:</span>
          {sampleCases.map((c, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedCrop(c.crop);
                setSymptomText(c.symptoms);
                runDiagnosis(c.symptoms, c.crop);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 font-medium transition"
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Request Payload</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-stone-400 block mb-1">CROP TYPE</label>
                <select
                  value={selectedCrop}
                  onChange={e => setSelectedCrop(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-medium"
                >
                  <option value="crop_maize">Maize (Chibage)</option>
                  <option value="crop_tobacco">Virginia Tobacco (Fodya)</option>
                  <option value="crop_sorghum">Sorghum (Mapfunde)</option>
                  <option value="crop_groundnuts">Groundnuts (Nzungu)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-stone-400 block mb-1">OBSERVED SYMPTOMS / PEST TRAITS</label>
                <textarea
                  value={symptomText}
                  onChange={e => setSymptomText(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="Describe damage patterns, leaf spots, or insect larvae..."
                />
              </div>

              <div className="p-4 border-2 border-dashed border-stone-800 rounded-xl text-center">
                <UploadCloud className="w-6 h-6 text-stone-500 mx-auto mb-1" />
                <span className="text-xs text-stone-400 block font-medium">WhatsApp / Mobile Image Upload Dropzone</span>
                <span className="text-[10px] text-stone-600 font-mono block">Supports JPEG/PNG up to 10MB</span>
              </div>

              <button
                onClick={() => runDiagnosis(symptomText, selectedCrop)}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Execute Diagnostic Engine</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          {diagnosis ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">DIAGNOSTIC OUTCOME</span>
                  <h2 className="text-lg font-bold text-white">{diagnosis.suspectedCondition}</h2>
                  <span className="text-xs text-stone-400">{diagnosis.cropName}</span>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {diagnosis.confidencePercentage}% Confidence
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-1 uppercase font-mono">
                    Severity: <span className="text-amber-400 font-bold">{diagnosis.severity}</span>
                  </span>
                </div>
              </div>

              {/* Identified Symptoms */}
              <div>
                <span className="text-[11px] font-mono text-stone-400 uppercase block mb-2">Identified Morphological Markers:</span>
                <div className="flex flex-wrap gap-2">
                  {diagnosis.symptomsIdentified.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-300">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prescriptions: Organic vs Chemical */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase block mb-1">🌿 ORGANIC REMEDY (LOW COST)</span>
                  <p className="text-xs text-stone-300 leading-relaxed">{diagnosis.organicTreatment}</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[11px] font-mono text-blue-400 uppercase block mb-1">🧪 REGISTERED CHEMICAL CONTROL</span>
                  <p className="text-xs text-stone-300 leading-relaxed">{diagnosis.chemicalTreatment}</p>
                </div>
              </div>

              {/* SMS Fallback string for feature phone */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Feature-Phone SMS Summary Fallback:</span>
                  </span>
                  <span className="text-emerald-400">{diagnosis.smsSummary.length} / 160 chars</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-800 text-stone-200 text-xs font-mono">
                  {diagnosis.smsSummary}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-stone-800 rounded-2xl text-stone-500 font-mono text-xs">
              Select a test preset or enter symptoms to execute the diagnostic contract.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
