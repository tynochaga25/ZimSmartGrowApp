import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  UserCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { mockApi } from '../../lib/mockApi';
import { toast } from '../../store/toastStore';
import { OtpInput } from '../../components/auth/OtpInput';
import { ForgotPasswordModal } from '../../components/auth/ForgotPasswordModal';

export const SignInPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectPath = searchParams.get('redirect') || null;

  const { login, loginAsDemo, isAuthenticated, user } = useAuthStore();

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (user.role === 'farmer') {
        navigate('/dashboard', { replace: true });
      } else if (user.role === 'buyer') {
        navigate('/market', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, redirectPath]);

  const [authTab, setAuthTab] = useState<'farmer' | 'partner'>('farmer');

  // Farmer phone state
  const [phoneNumber, setPhoneNumber] = useState('077 234 5678');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Partner email/pass state
  const [email, setEmail] = useState('f.chitepo@nationalfoods.co.zw');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common UI states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeCard, setShakeCard] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Timer for OTP countdown
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const triggerShake = (msg: string) => {
    setErrorMessage(msg);
    setShakeCard(true);
    setTimeout(() => setShakeCard(false), 500);
  };

  const handleSendFarmerOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      triggerShake('Please enter a valid mobile number (+263 7X XXX XXXX)');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = phoneNumber.startsWith('+263') ? phoneNumber : `+263 ${phoneNumber.trim()}`;
      await mockApi.sendOtp(fullPhone);
      setOtpSent(true);
      setCountdown(60);
      toast.info('6-digit code sent to ' + fullPhone, 'SMS Dispatched');
    } catch (err: any) {
      triggerShake(err.message || 'Failed to dispatch code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFarmerOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpValue;
    if (code.length !== 6) {
      triggerShake('Please enter full 6-digit code');
      return;
    }

    setErrorMessage('');
    setLoading(true);
    try {
      const fullPhone = phoneNumber.startsWith('+263') ? phoneNumber : `+263 ${phoneNumber.trim()}`;
      const res = await mockApi.verifyOtp(fullPhone, code);
      login(res.user, res.token);
      toast.success(`Welcome back, ${res.user.name}!`, 'Farmer Authenticated');
      navigate(redirectPath || '/dashboard');
    } catch (err: any) {
      triggerShake(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      triggerShake('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await mockApi.loginWithEmail(email, password);
      login(res.user, res.token);
      toast.success(`Welcome back, ${res.user.name}!`, 'Session Initialized');
      if (res.user.role === 'buyer') {
        navigate(redirectPath || '/market');
      } else {
        navigate(redirectPath || '/admin');
      }
    } catch (err: any) {
      triggerShake(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: 'farmer' | 'buyer' | 'admin') => {
    loginAsDemo(role);
    if (role === 'farmer') {
      toast.success('Logged in as Tendai Moyo (Chinhoyi Farmer)', 'Demo Active');
      navigate(redirectPath || '/dashboard');
    } else if (role === 'buyer') {
      toast.success('Logged in as Farai Chitepo (National Foods Buyer)', 'Demo Active');
      navigate(redirectPath || '/market');
    } else {
      toast.success('Logged in as Rudo Nyathi (ZimSmart Admin)', 'Demo Active');
      navigate(redirectPath || '/admin');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Immersive Brand Panel with authentic image & duotone overlay */}
        <div className="hidden lg:flex lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl flex-col justify-between p-8 text-white">
          <img
            src="/src/assets/images/auth_farming_sunrise_1791811886757.jpg"
            alt="Zimbabwe agricultural sunrise landscape"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-grow-950/95 via-grow-900/80 to-grow-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-radial from-transparent to-black/40" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sprout className="w-5 h-5 text-grow-200" />
              </div>
              <span className="font-heading">ZimSmart Grow</span>
            </Link>
            <p className="text-xs text-grow-100/90 mt-2 font-medium">
              Empowering 3 Million Smallholder Farmers in Zimbabwe
            </p>
          </div>

          <div className="relative z-10 space-y-4 my-auto py-8">
            <h2 className="text-2xl font-bold font-heading leading-tight text-white text-balance">
              Closing the Agronomic Knowledge & Market Yield Gap
            </h2>
            <p className="text-xs text-grow-100/90 leading-relaxed">
              Real-time computer vision disease diagnosis, hyper-local meteorological planting windows, and verified direct off-taker contracts.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-grow-50">
                <CheckCircle2 className="w-4 h-4 text-amber-harvest shrink-0" />
                <span>+30% Potential Smallholder Yield Uplift</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-grow-50">
                <CheckCircle2 className="w-4 h-4 text-amber-harvest shrink-0" />
                <span>-40% Reduction in Post-Harvest Losses</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-grow-50">
                <CheckCircle2 className="w-4 h-4 text-amber-harvest shrink-0" />
                <span>US$112,000 Pre-Seed Pilot Infrastructure</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-grow-200">
            <span>Harare · Chinhoyi · Marondera</span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-grow-300" /> AES-256
            </span>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div
            animate={shakeCard ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="text-center sm:text-left mb-6">
              <h1 className="text-2xl font-bold text-charcoal dark:text-white font-heading">
                Sign in to your account
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Access your farm telemetry, disease scanner, or buyer contracts
              </p>
            </div>

            {/* Tabbed interface: Farmer (Phone + OTP) | Partner (Email + Pass) */}
            <div className="relative flex p-1 bg-neutral-100 dark:bg-dark-surface rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('farmer');
                  setErrorMessage('');
                }}
                className={`relative flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authTab === 'farmer'
                    ? 'bg-white dark:bg-dark-card text-grow-700 dark:text-grow-400 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-charcoal'
                }`}
              >
                Smallholder Farmer (Phone + OTP)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('partner');
                  setErrorMessage('');
                }}
                className={`relative flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authTab === 'partner'
                    ? 'bg-white dark:bg-dark-card text-grow-700 dark:text-grow-400 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-charcoal'
                }`}
              >
                Buyer & Partner (Email + Pass)
              </button>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Tab 1: Farmer Phone + OTP */}
            {authTab === 'farmer' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendFarmerOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Mobile Phone Number (EcoCash / NetOne / Telecel)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 font-mono text-xs font-semibold text-neutral-500 border-r border-neutral-300 dark:border-dark-border pr-2 flex items-center gap-1">
                          🇿🇼 +263
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="077 234 5678"
                          className="w-full pl-22 pr-3 py-2.5 text-sm font-mono rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600 dark:focus:border-grow-500 focus:ring-2 focus:ring-grow-500/20"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        We send a 6-digit one-time PIN via SMS or USSD session.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 dark:bg-grow-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching SMS…
                        </>
                      ) : (
                        <>
                          Send Verification Code <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">
                        Enter the 6-digit code sent to <span className="font-semibold text-charcoal dark:text-white font-mono">{phoneNumber}</span>
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue('123456');
                            handleVerifyFarmerOtp('123456');
                          }}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-grow-100 dark:bg-grow-950/70 text-grow-800 dark:text-grow-300 hover:bg-grow-200 font-medium cursor-pointer border border-grow-200 dark:border-grow-900"
                        >
                          Demo code: <span className="font-mono font-bold">123456</span> (Click to auto-fill)
                        </button>
                      </div>
                    </div>

                    <OtpInput
                      value={otpValue}
                      onChange={setOtpValue}
                      onComplete={(val) => handleVerifyFarmerOtp(val)}
                      disabled={loading}
                    />

                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpValue('');
                        }}
                        className="hover:text-charcoal hover:underline cursor-pointer"
                      >
                        Change number
                      </button>
                      <div>
                        {countdown > 0 ? (
                          <span>Resend in {countdown}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendFarmerOtp}
                            className="text-grow-600 font-semibold hover:underline cursor-pointer"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVerifyFarmerOtp()}
                      disabled={loading || otpValue.length !== 6}
                      className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Verifying…
                        </>
                      ) : (
                        <>Verify & Enter Dashboard</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Partner / Buyer Email + Password */}
            {authTab === 'partner' && (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Organization Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="buyer@nationalfoods.co.zw"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600 dark:focus:border-grow-500 focus:ring-2 focus:ring-grow-500/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] text-grow-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600 dark:focus:border-grow-500 focus:ring-2 focus:ring-grow-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-grow-600 rounded border-neutral-300 focus:ring-grow-500 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                    Remember this device for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 dark:bg-grow-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials…
                    </>
                  ) : (
                    <>
                      Sign In to Platform <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Access (CRITICAL FOR INVESTORS) */}
            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-dark-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-grow-600" /> Explore a Demo Account
                </span>
                <span className="text-[10px] text-grow-600 font-medium">1-Click Live Test</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('farmer')}
                  className="p-2.5 rounded-xl border border-grow-200 dark:border-grow-900 bg-grow-50/50 dark:bg-grow-950/40 hover:bg-grow-100 dark:hover:bg-grow-950 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-grow-800 dark:text-grow-300">
                    Demo Farmer
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">Tendai Moyo (Chinhoyi)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('buyer')}
                  className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-trust-blue dark:text-blue-400">
                    Demo Buyer
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">National Foods Ltd</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    Demo Admin
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">Rudo Nyathi (Executive)</div>
                </button>
              </div>
            </div>

            {/* Bottom link to Sign Up */}
            <div className="mt-6 text-center text-xs text-neutral-500">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-grow-600 font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
    </div>
  );
};
