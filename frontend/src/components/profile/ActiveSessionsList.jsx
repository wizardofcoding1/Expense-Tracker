import React from 'react';
import { Laptop, Smartphone, Tablet, Globe, Trash2 } from 'lucide-react';

const ActiveSessionsList = ({
  sessions,
  sessionsLoading,
  sessionsError,
  handleRevokeSession
}) => {
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

  return (
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
  );
};

export default ActiveSessionsList;
