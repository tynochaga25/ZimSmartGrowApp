import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  X,
} from 'lucide-react';
import { SAMPLE_DIAGNOSES } from '../../data/mockData';
import { mockApi } from '../../lib/mockApi';
import { toast } from '../../store/toastStore';

export const DiagnosePage: React.FC = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_DIAGNOSES[0].imageUrl);
  const [selectedCropName, setSelectedCropName] = useState<string>('Roma Tomatoes');
  const [isDragOver, setIsDragOver] = useState(false);

  // Staged loading state
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [stageText, setStageText] = useState('');
  const [progress, setProgress] = useState(0);

  // Diagnosis results
  const [result, setResult] = useState<typeof SAMPLE_DIAGNOSES[0] | null>(null);

  // Diagnosis history
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([
    {
      id: 'hist-1',
      crop: 'Roma Tomatoes',
      disease: 'Late Blight (Phytophthora infestans)',
      confidence: 87.4,
      date: 'Today, 08:32 AM',
      severity: 'High',
    },
    {
      id: 'hist-2',
      crop: 'White Maize',
      disease: 'Fall Armyworm (Spodoptera frugiperda)',
      confidence: 93.1,
      date: 'Yesterday, 14:15 PM',
      severity: 'High',
    },
    {
      id: 'hist-3',
      crop: 'Virginia Tobacco',
      disease: 'Tobacco Mosaic Virus (TMV)',
      confidence: 91.5,
      date: '09 Oct 2026',
      severity: 'Medium',
    },
  ]);

  const handleSelectSample = (sample: typeof SAMPLE_DIAGNOSES[0]) => {
    setSelectedImage(sample.imageUrl);
    setSelectedCropName(sample.crop);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async () => {
    if (!selectedImage) return;

    setIsDiagnosing(true);
    setProgress(15);
    setStageText('Uploading field photograph…');

    const t1 = setTimeout(() => {
      setProgress(55);
      setStageText('Analyzing cellular symptoms with computer vision model…');
    }, 700);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStageText('Matching against regional African disease library (Section 3.1)…');
    }, 1400);

    try {
      const diagResult = await mockApi.diagnoseCrop(selectedImage, selectedCropName);
      setProgress(100);
      setStageText('Diagnosis confirmed!');

      setTimeout(() => {
        setResult(diagResult);
        setIsDiagnosing(false);
        toast.success(`Diagnosis complete: ${diagResult.disease}`, 'AI Analysis Complete');

        // Add to history
        setRecentDiagnoses((prev) => [
          {
            id: `hist_${Date.now()}`,
            crop: diagResult.crop,
            disease: diagResult.disease,
            confidence: diagResult.confidence,
            date: 'Just now',
            severity: diagResult.severity,
          },
          ...prev,
        ]);
      }, 500);
    } catch {
      setIsDiagnosing(false);
      toast.error('Diagnosis failed. Please check network.');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedImage(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-grow-700 dark:text-grow-400 mb-1">
          <ScanLine className="w-4 h-4" /> Section 3.1 Agronomic Intelligence Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal dark:text-white">
          AI Crop Disease Diagnosis
        </h1>
        <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
          Instantly detect fungal pathogens, bacterial leaf spots, and insect infestations from smallholder leaf photography using our calibrated computer vision model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Upload Zone & Sample Selector (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal dark:text-white uppercase tracking-wider">
                1. Upload or Select Sample
              </span>
              <span className="text-[11px] text-neutral-400">Supported: JPG, PNG, WEBP</span>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                isDragOver
                  ? 'border-grow-600 bg-grow-50/50 dark:bg-grow-950/30'
                  : 'border-neutral-300 dark:border-dark-border hover:border-grow-400 bg-neutral-50/40 dark:bg-dark-surface'
              }`}
            >
              {selectedImage ? (
                <div className="relative group">
                  <div className="relative rounded-xl overflow-hidden aspect-4/3 max-h-72 mx-auto shadow-md">
                    <img
                      src={selectedImage}
                      alt="Crop specimen preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Reticle / Crop frame viewfinder overlay */}
                    <div className="absolute inset-4 border border-white/50 rounded-lg pointer-events-none flex items-center justify-center">
                      <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
                      <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
                      <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
                      <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-grow-700 dark:text-grow-400 hover:underline cursor-pointer">
                      <span>Click to upload leaf photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-neutral-400 mt-1">or drag and drop field image here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selectable Samples Strip (Guarantees demos never fail) */}
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Or select verified sample specimen:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_DIAGNOSES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedImage === sample.imageUrl
                        ? 'border-grow-600 bg-grow-50 dark:bg-grow-950/60 shadow-xs ring-1 ring-grow-600'
                        : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300 bg-white dark:bg-dark-surface'
                    }`}
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden mb-1.5">
                      <img
                        src={sample.imageUrl}
                        alt={sample.crop}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-charcoal dark:text-white truncate">
                      {sample.crop}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {sample.disease.split('(')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnose Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunDiagnosis}
                disabled={!selectedImage || isDiagnosing}
                className="w-full py-3 bg-grow-600 hover:bg-grow-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ScanLine className="w-4 h-4" />
                {isDiagnosing ? 'Running AI Diagnostics…' : 'Run Computer Vision Diagnosis'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Diagnosis Results Card or Staged Loading (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatePresence mode="wait">
            {isDiagnosing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-8 shadow-xs text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400 mx-auto flex items-center justify-center animate-pulse">
                  <ScanLine className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-charcoal dark:text-white">
                    Processing Specimen
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-mono transition-all">
                    {stageText}
                  </p>
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-grow-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400">{progress}% Complete</div>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-5"
              >
                <div className="flex items-start justify-between gap-4 border-b border-neutral-100 dark:border-dark-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded">
                      Severity: {result.severity} Risk
                    </span>
                    <h3 className="text-lg font-bold font-heading text-charcoal dark:text-white mt-1">
                      {result.disease}
                    </h3>
                    <p className="text-xs text-neutral-500">Host Crop: {result.crop}</p>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-extrabold font-mono text-grow-700 dark:text-grow-400 tabular-nums">
                      {result.confidence}%
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                      Model Confidence
                    </div>
                  </div>
                </div>

                {/* Pathological summary */}
                <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-dark-surface p-3.5 rounded-xl border border-neutral-100 dark:border-dark-border">
                  {result.treatmentSummary}
                </div>

                {/* Actionable Treatment Protocol */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white">
                    Actionable Treatment Protocol:
                  </h4>
                  <div className="space-y-2">
                    {result.treatments.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400 font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => navigate('/market?filter=fungicides')}
                    className="w-full sm:flex-1 py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" /> Find Treatments at Local Agro-Dealer
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-4 py-2.5 border border-neutral-300 dark:border-dark-border hover:bg-neutral-50 dark:hover:bg-dark-surface text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Diagnose Another
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-8 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-dark-surface text-neutral-400 mx-auto flex items-center justify-center">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal dark:text-white">
                    No Active Diagnosis
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Select one of the verified sample leaves on the left, or upload a photo to generate an instant diagnosis and treatment plan.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Diagnosis History Strip */}
      <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-bold font-heading text-charcoal dark:text-white">
              Recent Field Diagnoses
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Synchronized with Makonde Cluster Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-dark-border text-neutral-400 font-medium">
                <th className="pb-2.5">Crop</th>
                <th className="pb-2.5">Pathological Diagnosis</th>
                <th className="pb-2.5">Confidence</th>
                <th className="pb-2.5">Risk Level</th>
                <th className="pb-2.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-dark-border text-charcoal dark:text-neutral-200">
              {recentDiagnoses.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-dark-surface/50">
                  <td className="py-2.5 font-semibold">{item.crop}</td>
                  <td className="py-2.5">{item.disease}</td>
                  <td className="py-2.5 font-mono tabular-nums text-grow-700 dark:text-grow-400 font-semibold">
                    {item.confidence}%
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.severity === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-neutral-400">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
