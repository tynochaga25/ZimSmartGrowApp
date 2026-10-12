import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  MapPin,
  Sprout,
  ShieldAlert,
  Bell,
  Save,
  LogOut,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ZIM_PROVINCES, CROPS_CATALOG } from '../../data/mockData';
import { toast } from '../../store/toastStore';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [province, setProvince] = useState(user?.province || 'Mashonaland West');
  const [district, setDistrict] = useState(user?.district || 'Makonde District');
  const [farmSize, setFarmSize] = useState(user?.farmSize || 2.5);
  const [organization, setOrganization] = useState(user?.organization || '');
  const [crops, setCrops] = useState<string[]>(user?.crops || ['White Maize', 'Roma Tomatoes']);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [pestWarnings, setPestWarnings] = useState(true);
  const [priceSurgeAlerts, setPriceSurgeAlerts] = useState(true);

  if (!user) return null;

  const toggleCrop = (c: string) => {
    if (crops.includes(c)) {
      if (crops.length > 1) setCrops(crops.filter((x) => x !== c));
    } else {
      setCrops([...crops, c]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      province,
      district,
      farmSize,
      organization: organization || undefined,
      crops,
    });
    toast.success('Your profile settings have been updated', 'Profile Saved');
  };

  const handleSignOutAll = () => {
    logout();
    toast.info('Revoked all active sessions and tokens', 'Signed Out');
    navigate('/signin');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-charcoal dark:text-white">
          Account & Agronomic Profile
        </h1>
        <p className="text-xs text-neutral-500">
          Manage your verified smallholder credentials, province cluster, and telemetry preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-grow-600" />
            <h3 className="text-sm font-semibold text-charcoal dark:text-white">Identity & Contact</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Role / Account Type</label>
              <input
                type="text"
                disabled
                value={user.role.toUpperCase()}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Mobile Phone (Primary OTP ID)</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  disabled
                  value={user.phone || 'N/A'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono"
                />
              </div>
            </div>

            {user.email && (
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-dark-border bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Farm & Regional Settings */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-grow-600" />
            <h3 className="text-sm font-semibold text-charcoal dark:text-white">Location & Farm Scale</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              >
                {ZIM_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">District / Agritex Ward</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">Farm Size (Hectares)</label>
              <input
                type="number"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-white outline-none focus:border-grow-600"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Cultivated Crops Catalog
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CROPS_CATALOG.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    crops.includes(crop)
                      ? 'border-grow-600 bg-grow-100 dark:bg-grow-950 text-grow-800 dark:text-grow-300 font-semibold'
                      : 'border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {crop} {crops.includes(crop) && '✓'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications & USSD Preferences */}
        <div className="bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-grow-600" />
            <h3 className="text-sm font-semibold text-charcoal dark:text-white">Alerts & Messaging Preferences</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface cursor-pointer">
              <div>
                <div className="font-semibold text-charcoal dark:text-white">SMS Fallback & USSD Push</div>
                <div className="text-neutral-500 text-[11px]">Receive weather alerts and pest thresholds when 3G/4G data is disconnected</div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-grow-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface cursor-pointer">
              <div>
                <div className="font-semibold text-charcoal dark:text-white">Fall Armyworm & Pest Surveillance</div>
                <div className="text-neutral-500 text-[11px]">Instant alerts when neighboring clusters report disease outbreaks</div>
              </div>
              <input
                type="checkbox"
                checked={pestWarnings}
                onChange={(e) => setPestWarnings(e.target.checked)}
                className="w-4 h-4 text-grow-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-grow-600 hover:bg-grow-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Danger Zone</h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
            Terminate all active browser sessions, clear stored authentication tokens, and revoke device authorization.
          </p>
          <button
            type="button"
            onClick={handleSignOutAll}
            className="px-4 py-2 border border-red-300 dark:border-red-800 hover:bg-red-100/60 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out of All Devices
          </button>
        </div>
      </form>
    </div>
  );
};
