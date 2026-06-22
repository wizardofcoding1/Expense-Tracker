import React from 'react';
import { Shield } from 'lucide-react';

const SecurityOverview = ({ sessionsLoading, sessions }) => {
  return (
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
  );
};

export default SecurityOverview;
