import React from 'react';
import { Lock, XCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const PasswordForm = ({
  passwords,
  handlePasswordChange,
  handleSubmit,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  loading,
  error,
  success
}) => {
  return (
    <div className="gold-panel p-6 md:p-8 rounded-3xl">
      <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#3d352b' }}>
        <Lock size={18} className="text-[#8c6c3f]" /> Update Password
      </h4>
      <p className="text-xs mb-6" style={{ color: '#8c6c3f' }}>Ensure your account is secure by using a strong, unique password.</p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <XCircle size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
            Current Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
              <Lock size={16} />
            </span>
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="gold-input w-full pl-10 pr-10 py-2.5 rounded-xl text-xs placeholder-stone-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#8c6c3f] cursor-pointer"
              style={{ color: '#b39262' }}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                <Lock size={16} />
              </span>
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Min 6 characters"
                className="gold-input w-full pl-10 pr-10 py-2.5 rounded-xl text-xs placeholder-stone-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#8c6c3f] cursor-pointer"
                style={{ color: '#b39262' }}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center" style={{ color: '#b39262' }}>
                <Lock size={16} />
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Re-type new password"
                className="gold-input w-full pl-10 pr-10 py-2.5 rounded-xl text-xs placeholder-stone-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-[#8c6c3f] cursor-pointer"
                style={{ color: '#b39262' }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={loading}
            className="gold-button font-semibold py-2.5 px-6 rounded-xl text-xs transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
