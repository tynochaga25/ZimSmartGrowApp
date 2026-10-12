import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';
import { toast } from '../../store/toastStore';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await mockApi.requestPasswordReset(email);
      setStep('code');
      toast.success(`Reset code sent to ${email}`, 'Code Dispatched');
    } catch {
      toast.error('Failed to dispatch code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      toast.error('Please enter valid 4-digit code (use 1234)');
      return;
    }
    setStep('newPassword');
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep('success');
    toast.success('Your password has been successfully reset', 'Password Updated');
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={handleClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl z-10"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-dark-border mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-grow-100 dark:bg-grow-950 text-grow-700 dark:text-grow-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-charcoal dark:text-gray-100">Reset Account Password</h3>
          </div>
          <button onClick={handleClose} className="p-1 text-neutral-400 hover:text-neutral-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'email' && (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enter your registered partner or buyer email address. We'll send a temporary reset authorization code.
            </p>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Work Email Address
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Sending code…' : 'Send Recovery Code'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enter the recovery code sent to <span className="font-semibold text-charcoal dark:text-white">{email}</span>. (Demo hint: enter <span className="font-mono font-bold text-grow-600">1234</span>)
            </p>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Recovery Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="1234"
                className="w-full px-3 py-2 text-sm font-mono text-center tracking-widest rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 'newPassword' && (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Create a new secure password for your account.
            </p>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Update Password
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-charcoal dark:text-white">Password Updated Successfully</h4>
            <p className="text-xs text-neutral-500">
              You can now sign in using your new credentials.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 w-full py-2 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
