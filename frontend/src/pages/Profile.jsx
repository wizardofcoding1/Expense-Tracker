import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  UserCircle,
  Laptop,
  Smartphone,
  Tablet,
  Trash2,
  Globe
} from 'lucide-react';
import bgImage from '../assets/Gemini_Generated_Image_lua8zilua8zilua8.png';
import CustomSelect from '../components/CustomSelect';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'security'
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male'
  });

  const formatDateForInput = (dateVal) => {
    if (!dateVal) return '';
    try {
      if (typeof dateVal === 'string') {
        return dateVal.split('T')[0];
      }
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        dateOfBirth: formatDateForInput(user.dateOfBirth || user.date_of_birth),
        gender: user.gender || 'male'
      });
    }
  }, [user, isEditing]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await updateUserProfile(profileData);
      if (res.success) {
        setSuccess('Profile updated successfully.');
        setIsEditing(false);
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while updating profile.');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' }
  ];
  
  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active Sessions state
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState('');

  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError('');
    try {
      const res = await API.get('/auth/sessions');
      if (res.data.success) {
        setSessions(res.data.data);
      } else {
        setSessionsError(res.data.message || 'Failed to fetch sessions.');
      }
    } catch (err) {
      console.error('Fetch sessions error:', err);
      setSessionsError(err.response?.data?.message || 'An error occurred while fetching sessions.');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      const res = await API.delete(`/auth/sessions/${sessionId}`);
      if (res.data.success) {
        fetchSessions();
      } else {
        setSessionsError(res.data.message || 'Failed to revoke session.');
      }
    } catch (err) {
      console.error('Revoke session error:', err);
      setSessionsError(err.response?.data?.message || 'An error occurred while revoking session.');
    }
  };

  useEffect(() => {
    if (activeTab === 'security') {
      fetchSessions();
    }
  }, [activeTab]);

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (res.data.success) {
        setSuccess('Your password has been changed successfully.');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Update cached offline credentials hash
        try {
          const offlineCredsRaw = localStorage.getItem('offline_credentials');
          if (offlineCredsRaw) {
            const offlineCreds = JSON.parse(offlineCredsRaw);
            const msgBuffer = new TextEncoder().encode(newPassword);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            offlineCreds.hash = hashHex;
            localStorage.setItem('offline_credentials', JSON.stringify(offlineCreds));
          }
        } catch (offlineHashErr) {
          console.error('Failed to update offline credentials cache:', offlineHashErr);
        }
      } else {
        setError(res.data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while changing password.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatLastActive = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
  };

  const capitalize = (str) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div 
      className="rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold m-0" style={{ color: '#3d352b' }}>Account Settings</h2>
        <p className="text-xs mt-1" style={{ color: '#8c6c3f' }}>Manage your profile details and security credentials</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200/60 gap-6">
        <button
          onClick={() => {
            setActiveTab('general');
            setError('');
            setSuccess('');
          }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'general'
              ? 'border-[#b39262] text-[#8c6c3f]'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          General Profile
        </button>
        <button
          onClick={() => {
            setActiveTab('security');
            setError('');
            setSuccess('');
          }}
          className={`pb-3 text-sm font-bold border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#b39262] text-[#8c6c3f]'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          Security & Active Sessions
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Account Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="gold-panel p-6 rounded-3xl flex flex-col items-center text-center">
              {/* User Initial Avatar */}
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#b39262] to-[#8c6c3f] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-[#8c6c3f]/25 mb-4 border-4 border-white">
                {(user?.firstName || user?.first_name || 'U').charAt(0).toUpperCase()}
                {(user?.lastName || user?.last_name || '').charAt(0).toUpperCase()}
              </div>
              
              <h3 className="text-lg font-bold m-0" style={{ color: '#3d352b' }}>
                {user ? `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || 'User' : 'Guest User'}
              </h3>
              <p className="text-xs mt-1" style={{ color: '#8c6c3f' }}>{user?.email || 'guest@fintrack.local'}</p>
              
              <span className="mt-4 px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider bg-[#b39262]/10 text-[#8c6c3f] border border-[#b39262]/20">
                Active Account
              </span>
            </div>
          </div>

          {/* Right Column: Personal Information Detail Sheet */}
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
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Security Overview Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="gold-panel p-6 rounded-3xl flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-[#8c6c3f]/10 border border-[#b39262]/20 flex items-center justify-center text-[#8c6c3f] shadow-md shadow-[#8c6c3f]/5 mb-4">
                <Shield size={36} />
              </div>
              <h3 className="text-lg font-bold m-0" style={{ color: '#3d352b' }}>Security Overview</h3>
              <p className="text-xs mt-1" style={{ color: '#8c6c3f' }}>Monitor active login sessions and keep your credentials secure.</p>
              
              <span className="mt-4 px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider bg-[#b39262]/10 text-[#8c6c3f] border border-[#b39262]/20">
                {sessionsLoading ? 'Loading...' : `${sessions.length} Active ${sessions.length === 1 ? 'Session' : 'Sessions'}`}
              </span>
            </div>

            <div className="gold-panel p-6 rounded-3xl">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: '#3d352b' }}>
                <Shield size={16} className="text-[#8c6c3f]" /> Security Tips
              </h4>
              <div className="space-y-4 text-xs leading-relaxed" style={{ color: '#8c6c3f' }}>
                <p>
                  <strong style={{ color: '#3d352b' }}>Update Passwords:</strong> Change your password periodically and avoid reusing passwords across multiple sites.
                </p>
                <p>
                  <strong style={{ color: '#3d352b' }}>Revoke Unfamiliar Devices:</strong> If you see a device or location you don't recognize, click <strong style={{ color: '#3d352b' }}>Revoke</strong> to sign it out immediately.
                </p>
                <p>
                  <strong style={{ color: '#3d352b' }}>Session Expiration:</strong> Inactive sessions are cleaned up automatically after 7 days.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Update Password AND Active Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Update Password */}
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

            {/* Active Sessions */}
            <div className="gold-panel p-6 md:p-8 rounded-3xl">
              <div>
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#3d352b' }}>
                  <Laptop size={18} className="text-[#8c6c3f]" /> Active Sessions
                </h4>
                <p className="text-xs mb-6" style={{ color: '#8c6c3f' }}>
                  These are the devices and browsers currently logged into your account.
                </p>
              </div>

              {sessionsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#b39262] border-t-transparent"></div>
                </div>
              ) : sessionsError ? (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                  {sessionsError}
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-xs font-medium" style={{ color: '#8c6c3f' }}>
                  No active sessions found.
                </div>
              ) : (
                <div className="divide-y divide-stone-200/60 border-t border-stone-200/60">
                  {sessions.map((session) => (
                    <div key={session.id} className="py-4 flex justify-between items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-stone-100 border border-stone-200 text-[#8c6c3f] flex items-center justify-center">
                          {session.device_name === 'Mobile' ? (
                            <Smartphone size={16} />
                          ) : session.device_name === 'Tablet' ? (
                            <Tablet size={16} />
                          ) : (
                            <Laptop size={16} />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold" style={{ color: '#3d352b' }}>
                              {session.browser} on {session.os}
                            </span>
                            {session.is_current ? (
                              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                Current Session
                              </span>
                            ) : (
                              <span className="bg-[#b39262]/10 text-[#8c6c3f] border border-[#b39262]/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] flex flex-wrap gap-x-2 gap-y-0.5 font-medium" style={{ color: '#8c6c3f' }}>
                            <span className="flex items-center gap-0.5"><Globe size={10} style={{ color: '#b39262' }} /> {session.ip_address}</span>
                            <span>•</span>
                            <span>Last active: {formatLastActive(session.last_active)}</span>
                          </div>
                        </div>
                      </div>

                      {!session.is_current && (
                        <button
                          onClick={() => handleRevokeSession(session.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 hover:text-red-600 transition-all duration-200 flex items-center gap-1 text-[10px] font-semibold cursor-pointer active:scale-95"
                        >
                          <Trash2 size={12} />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
