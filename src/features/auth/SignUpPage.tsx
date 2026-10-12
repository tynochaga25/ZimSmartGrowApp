import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Store,
  Building2,
  TrendingUp,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  RefreshCw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuthStore, UserRole } from '../../store/authStore';
import { ZIM_PROVINCES, CROPS_CATALOG } from '../../data/mockData';
import { mockApi } from '../../lib/mockApi';
import { toast } from '../../store/toastStore';
import { OtpInput } from '../../components/auth/OtpInput';
import { TermsModal } from '../../components/auth/TermsModal';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = success celebration

  // Step 1: Role
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');

  // Step 2: Account Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('077 345 6789');
  const [province, setProvince] = useState<string>(ZIM_PROVINCES[0]);
  const [district, setDistrict] = useState('Makonde District');
  const [farmSize, setFarmSize] = useState<number>(2.5);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['White Maize', 'Roma Tomatoes']);

  // Partner/Buyer fields
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Terms agreement
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Step 3: Verification
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let s = 1;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s; // 1 to 4
  };

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter((c) => c !== crop));
      }
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    if (selectedRole === 'farmer') {
      if (!phone.trim()) {
        setErrorMsg('Please enter your mobile phone number');
        return;
      }
    } else {
      if (!email.trim() || !organization.trim()) {
        setErrorMsg('Please complete work email and organization name');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
    }

    if (!termsAgreed) {
      setErrorMsg('Please review and agree to the Terms of Service and Privacy Policy');
      return;
    }

    setStep(3);
  };

  const handleStep3Complete = async (codeOverride?: string) => {
    const code = codeOverride || otpValue;
    if (selectedRole === 'farmer' && code.length !== 6) {
      setErrorMsg('Please enter 6-digit verification code');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const fullPhone = phone.startsWith('+263') ? phone : `+263 ${phone.trim()}`;
      const res = await mockApi.registerUser({
        role: selectedRole,
        name,
        phone: fullPhone,
        email: selectedRole !== 'farmer' ? email : undefined,
        organization: selectedRole !== 'farmer' ? organization : undefined,
        province,
        district,
        farmSize,
        crops: selectedCrops,
      });

      login(res.user, res.token);
      setStep(4);

      // Auto redirect after 1.8s
      setTimeout(() => {
        if (selectedRole === 'farmer') {
          navigate('/dashboard');
        } else if (selectedRole === 'buyer') {
          navigate('/market');
        } else {
          navigate('/admin');
        }
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-center">
      {/* Wizard Step Progress Bar */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-sm mx-auto mb-2 text-xs font-medium">
            <span className={step >= 1 ? 'text-grow-700 dark:text-grow-400 font-semibold' : 'text-neutral-400'}>
              1. Choose Role
            </span>
            <span className={step >= 2 ? 'text-grow-700 dark:text-grow-400 font-semibold' : 'text-neutral-400'}>
              2. Account Details
            </span>
            <span className={step >= 3 ? 'text-grow-700 dark:text-grow-400 font-semibold' : 'text-neutral-400'}>
              3. Verification
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 dark:bg-dark-border rounded-full overflow-hidden max-w-sm mx-auto">
            <div
              className="h-full bg-grow-600 transition-all duration-300"
              style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Choose Your Role */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="text-center max-w-md mx-auto mb-8">
            <h1 className="text-2xl font-bold text-charcoal dark:text-white font-heading">
              Join the ZimSmart Grow Network
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Select your primary ecosystem role to customize your diagnostic and market tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            {/* Card 1: Farmer */}
            <div
              onClick={() => setSelectedRole('farmer')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'farmer'
                  ? 'border-grow-600 bg-grow-50/60 dark:bg-grow-950/40 shadow-xs'
                  : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-grow-100 dark:bg-grow-900/60 text-grow-700 dark:text-grow-300">
                  <Sprout className="w-5 h-5" />
                </div>
                {selectedRole === 'farmer' && (
                  <div className="w-5 h-5 rounded-full bg-grow-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-charcoal dark:text-white mt-3 font-heading">
                Smallholder Farmer
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Diagnose crop diseases, receive hyper-local weather alerts, and sell directly to verified food processors.
              </p>
            </div>

            {/* Card 2: Buyer / Offtaker */}
            <div
              onClick={() => setSelectedRole('buyer')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'buyer'
                  ? 'border-trust-blue bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                  : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-trust-blue">
                  <Store className="w-5 h-5" />
                </div>
                {selectedRole === 'buyer' && (
                  <div className="w-5 h-5 rounded-full bg-trust-blue text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-charcoal dark:text-white mt-3 font-heading">
                Buyer / Food Offtaker
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Post purchase orders and source aggregated maize, tomatoes, soya, or tobacco directly from Zimbabwean farmer clusters.
              </p>
            </div>

            {/* Card 3: Partner / Agribusiness */}
            <div
              onClick={() => setSelectedRole('partner')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'partner'
                  ? 'border-amber-harvest bg-amber-50/60 dark:bg-amber-950/40 shadow-xs'
                  : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700">
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedRole === 'partner' && (
                  <div className="w-5 h-5 rounded-full bg-amber-harvest text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-charcoal dark:text-white mt-3 font-heading">
                Agribusiness & Input Dealer
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                List certified seeds, bio-fungicides, fertilizers, and offer trade credit to smallholder communities.
              </p>
            </div>

            {/* Card 4: Investor / Admin */}
            <div
              onClick={() => setSelectedRole('admin')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedRole === 'admin'
                  ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 shadow-xs'
                  : 'border-neutral-200 dark:border-dark-border hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                {selectedRole === 'admin' && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-charcoal dark:text-white mt-3 font-heading">
                Investor & Impact Evaluator
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Inspect live cohort KPIs, US$112,000 pre-seed runway allocations, and export Data-as-a-Service metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border">
            <Link to="/signin" className="text-xs text-neutral-500 hover:text-charcoal hover:underline">
              Already have an account? Sign in
            </Link>
            <button
              onClick={handleStep1Next}
              className="px-6 py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: Account Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-charcoal dark:text-white font-heading">
                {selectedRole === 'farmer' ? 'Smallholder Farmer Registration' : 'Organization & Account Setup'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Role: <span className="font-semibold capitalize text-grow-700 dark:text-grow-400">{selectedRole}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-neutral-500 hover:text-charcoal flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs text-red-700 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleStep2Next} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name / Contact Person *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tendai Moyo"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>

            {selectedRole === 'farmer' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Mobile Number (EcoCash / NetOne) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2 text-xs font-mono text-neutral-500 border-r border-neutral-300 dark:border-dark-border pr-1.5">
                        🇿🇼 +263
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="077 345 6789"
                        className="w-full pl-21 pr-3 py-2 text-xs font-mono rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Province *
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    >
                      {ZIM_PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      District / Area
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Makonde (Chinhoyi)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Farm Size (Hectares)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={farmSize}
                      onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Primary Crops Cultivated (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CROPS_CATALOG.map((crop) => {
                      const isSelected = selectedCrops.includes(crop);
                      return (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => toggleCrop(crop)}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-grow-600 bg-grow-100 dark:bg-grow-950 text-grow-800 dark:text-grow-300 font-semibold'
                              : 'border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                          }`}
                        >
                          {crop} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Organization / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. National Foods Ltd"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.co.zw"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    />
                    {password && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className={`h-1 flex-1 rounded-full ${getPasswordStrength() >= 1 ? 'bg-red-500' : 'bg-neutral-200'}`} />
                        <div className={`h-1 flex-1 rounded-full ${getPasswordStrength() >= 2 ? 'bg-amber-500' : 'bg-neutral-200'}`} />
                        <div className={`h-1 flex-1 rounded-full ${getPasswordStrength() >= 3 ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                        <div className={`h-1 flex-1 rounded-full ${getPasswordStrength() >= 4 ? 'bg-emerald-600' : 'bg-neutral-200'}`} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Terms of Service Checkbox */}
            <div className="pt-2 flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-grow-600 rounded border-neutral-300 focus:ring-grow-500 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-neutral-600 dark:text-neutral-400">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setIsTermsModalOpen(true)}
                  className="text-grow-700 dark:text-grow-400 font-semibold underline hover:text-grow-800"
                >
                  Terms of Service & Data Privacy Policy
                </button>{' '}
                for agricultural advisory and market facilitation in Zimbabwe.
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-dark-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-neutral-500 hover:text-charcoal cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                Continue to Verification <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STEP 3: Verification */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl max-w-lg mx-auto w-full"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-charcoal dark:text-white font-heading">
              {selectedRole === 'farmer' ? 'Verify Mobile Number' : 'Verify Organization Account'}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {selectedRole === 'farmer'
                ? `Enter the 6-digit verification code dispatched to ${phone}`
                : `A confirmation token has been generated for ${email}`}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 text-xs text-red-700 dark:text-red-300 text-center">
              {errorMsg}
            </div>
          )}

          {selectedRole === 'farmer' ? (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setOtpValue('123456');
                    handleStep3Complete('123456');
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-grow-100 dark:bg-grow-950 text-grow-800 dark:text-grow-300 hover:bg-grow-200 font-medium cursor-pointer border border-grow-200 dark:border-grow-900"
                >
                  Demo hint: <span className="font-mono font-bold">123456</span> (Click to auto-complete)
                </button>
              </div>

              <OtpInput
                value={otpValue}
                onChange={setOtpValue}
                onComplete={(val) => handleStep3Complete(val)}
                disabled={loading}
              />

              <div className="text-center text-xs text-neutral-400">
                Did not receive SMS? Resend available in 45s
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 text-xs text-neutral-500 hover:text-charcoal cursor-pointer"
                >
                  Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => handleStep3Complete()}
                  disabled={loading || otpValue.length !== 6}
                  className="flex-1 py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Complete Setup'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-dark-surface border border-neutral-100 dark:border-dark-border text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <p>
                  Organization verification link dispatched to <span className="font-semibold text-charcoal dark:text-white">{email}</span>.
                </p>
                <p className="mt-2 text-neutral-400 text-[11px]">
                  For investor preview and pilot demonstration purposes, you may activate immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleStep3Complete('verified')}
                disabled={loading}
                className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm & Activate Account'}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* STEP 4: Success Celebration */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-8 shadow-2xl text-center max-w-md mx-auto w-full space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-grow-100 dark:bg-grow-900/60 text-grow-600 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold font-heading text-charcoal dark:text-white">
            Welcome to ZimSmart Grow, {name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Your {selectedRole} account is active and connected to the Zimbabwean agronomic intelligence grid.
          </p>

          <div className="text-left p-3.5 bg-neutral-50 dark:bg-dark-surface rounded-2xl border border-neutral-100 dark:border-dark-border space-y-2 text-xs">
            <div className="font-semibold text-charcoal dark:text-white text-[11px] uppercase tracking-wider">
              Onboarding Checklist:
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Check className="w-3.5 h-3.5 text-grow-600" /> Farm cluster profile initialized ({province})
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Check className="w-3.5 h-3.5 text-grow-600" /> AI Diagnostic engine calibrated
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Check className="w-3.5 h-3.5 text-grow-600" /> Offtake order feed synchronized
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-grow-700 font-medium">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Redirecting to your workspace…</span>
          </div>
        </motion.div>
      )}

      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </div>
  );
};
