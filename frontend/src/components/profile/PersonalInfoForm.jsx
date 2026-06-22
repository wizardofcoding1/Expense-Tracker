import React from 'react';
import { UserCircle, XCircle, CheckCircle, Lock, Calendar } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const PersonalInfoForm = ({
  user,
  isEditing,
  setIsEditing,
  profileData,
  setProfileData,
  handleSaveProfile,
  loading,
  error,
  success,
  setError,
  setSuccess
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const capitalize = (str) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="lg:col-span-2">
      <div className="gold-panel p-6 md:p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-sm font-bold flex items-center gap-2 m-0" style={{ color: '#3d352b' }}>
              <UserCircle size={18} className="text-[#8c6c3f]" /> Personal Information
            </h4>
            <p className="text-[11px] mt-1 m-0" style={{ color: '#8c6c3f' }}>Details associated with your registered profile account.</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="gold-button px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02]"
            >
              Edit Profile
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                <XCircle size={16} /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="gold-input w-full px-4 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="gold-input w-full px-4 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="gold-input w-full px-4 py-2.5 rounded-xl text-xs bg-[#b39262]/5 border-[#b39262]/20 cursor-not-allowed opacity-80"
                    disabled
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400">
                    <Lock size={14} />
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Gender
                </label>
                <CustomSelect
                  value={profileData.gender}
                  onChange={(val) => setProfileData({ ...profileData, gender: val })}
                  options={genderOptions}
                  buttonClassName="gold-input w-full px-4 py-2.5 rounded-xl text-xs text-left"
                  dropdownClassName="border border-stone-200 bg-white/95 backdrop-blur-md rounded-xl shadow-lg mt-1"
                  optionClassName="text-stone-600 hover:text-stone-800 hover:bg-stone-50"
                  activeOptionClassName="bg-[#b39262]/10 text-[#8c6c3f] font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8c6c3f' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  max={todayStr}
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="gold-input w-full px-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200/60">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setSuccess('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-300 hover:bg-stone-50 text-stone-600 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="gold-button px-6 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="border-b border-stone-200/60 pb-3 flex flex-col gap-1 text-xs">
              <span className="font-medium uppercase tracking-wider text-[10px]" style={{ color: '#8c6c3f' }}>First Name</span>
              <span className="font-semibold text-sm" style={{ color: '#3d352b' }}>{user?.firstName || user?.first_name || 'N/A'}</span>
            </div>
            <div className="border-b border-stone-200/60 pb-3 flex flex-col gap-1 text-xs">
              <span className="font-medium uppercase tracking-wider text-[10px]" style={{ color: '#8c6c3f' }}>Last Name</span>
              <span className="font-semibold text-sm" style={{ color: '#3d352b' }}>{user?.lastName || user?.last_name || 'N/A'}</span>
            </div>
            <div className="border-b border-stone-200/60 pb-3 flex flex-col gap-1 text-xs">
              <span className="font-medium uppercase tracking-wider text-[10px]" style={{ color: '#8c6c3f' }}>Email Address</span>
              <span className="font-semibold text-sm" style={{ color: '#3d352b' }}>{user?.email || 'N/A'}</span>
            </div>
            <div className="border-b border-stone-200/60 pb-3 flex flex-col gap-1 text-xs">
              <span className="font-medium uppercase tracking-wider text-[10px]" style={{ color: '#8c6c3f' }}>Gender</span>
              <span className="font-semibold text-sm" style={{ color: '#3d352b' }}>{capitalize(user?.gender)}</span>
            </div>
            <div className="pb-3 flex flex-col gap-1 text-xs md:col-span-2">
              <span className="font-medium uppercase tracking-wider text-[10px]" style={{ color: '#8c6c3f' }}>Date of Birth</span>
              <span className="font-semibold text-sm flex items-center gap-1.5" style={{ color: '#3d352b' }}>
                <Calendar size={15} style={{ color: '#8c6c3f' }} />
                {formatDate(user?.dateOfBirth || user?.date_of_birth)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
