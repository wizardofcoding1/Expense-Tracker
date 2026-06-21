import React from 'react';
import { Check } from 'lucide-react';

const BalancesTab = ({ balances, settlements }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members Balances */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Member Balances</h4>
          <div className="space-y-2">
            {balances.map((b) => {
              const bal = Number(b.net_balance);
              const isCreditor = bal > 0.01;
              const isDebtor = bal < -0.01;
              
              return (
                <div key={b.user_id} className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/10 border border-zinc-850">
                  <span className="text-xs text-zinc-300 font-semibold">{b.first_name} {b.last_name}</span>
                  <span className={`text-xs font-extrabold ${isCreditor ? 'text-emerald-500' : isDebtor ? 'text-rose-650' : 'text-zinc-500'}`}>
                    {isCreditor ? `Gets back ₹${bal.toFixed(2)}` : isDebtor ? `Owes ₹${Math.abs(bal).toFixed(2)}` : 'Settled'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settle Plan */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Settle-Up Plan</h4>
          {settlements.length > 0 ? (
            <div className="space-y-2">
              {settlements.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{s.fromName}</span>
                    <span className="text-zinc-500 text-xxs">pays</span>
                    <span className="text-zinc-300 font-medium">{s.toName}</span>
                  </div>
                  <p className="text-center font-black text-sm text-primary">₹{s.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center space-y-1 text-emerald-600 text-xs">
              <Check className="mx-auto text-emerald-500" size={18} />
              <p className="font-semibold">Everyone is completely settled!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalancesTab;
