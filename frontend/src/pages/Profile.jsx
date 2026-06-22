import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/client';
import bgImage from '../assets/Gemini_Generated_Image_lua8zilua8zilua8.png';

// Import modular sub-components
import ProfileCard from '../components/profile/ProfileCard';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import SecurityOverview from '../components/profile/SecurityOverview';
import PasswordForm from '../components/profile/PasswordForm';
import ActiveSessionsList from '../components/profile/ActiveSessionsList';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
  
  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      <div className="flex bg-[#b39262]/10 border border-[#b39262]/20 p-1.5 rounded-2xl w-fit shadow-inner">
        <button
          onClick={() => {
            setActiveTab('general');
            setError('');
            setSuccess('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'general'
              ? 'bg-[#b39262] text-white shadow-md'
              : 'text-[#8c6c3f] hover:bg-[#b39262]/5'
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#b39262] text-white shadow-md'
              : 'text-[#8c6c3f] hover:bg-[#b39262]/5'
          }`}
        >
          Security & Active Sessions
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Account Summary */}
          <ProfileCard user={user} />

          {/* Right Column: Personal Information Detail Sheet */}
          <PersonalInfoForm
            user={user}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            profileData={profileData}
            setProfileData={setProfileData}
            handleSaveProfile={handleSaveProfile}
            loading={loading}
            error={error}
            success={success}
            setError={setError}
            setSuccess={setSuccess}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Security Overview Card */}
          <SecurityOverview
            sessionsLoading={sessionsLoading}
            sessions={sessions}
          />

          {/* Right Column: Update Password AND Active Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Update Password */}
            <PasswordForm
              passwords={passwords}
              handlePasswordChange={handlePasswordChange}
              handleSubmit={handleSubmit}
              showCurrent={showCurrent}
              setShowCurrent={setShowCurrent}
              showNew={showNew}
              setShowNew={setShowNew}
              showConfirm={showConfirm}
              setShowConfirm={setShowConfirm}
              loading={loading}
              error={error}
              success={success}
            />

            {/* Active Sessions */}
            <ActiveSessionsList
              sessions={sessions}
              sessionsLoading={sessionsLoading}
              sessionsError={sessionsError}
              handleRevokeSession={handleRevokeSession}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
