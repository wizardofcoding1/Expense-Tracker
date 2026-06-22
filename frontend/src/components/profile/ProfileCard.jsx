import React from 'react';

const ProfileCard = ({ user }) => {
  return (
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
      </div>
    </div>
  );
};

export default ProfileCard;
