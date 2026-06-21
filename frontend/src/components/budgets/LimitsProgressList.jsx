import React from 'react';
import { AlertCircle } from 'lucide-react';

const LimitsProgressList = ({ loading, budgetStatus }) => {
  return (
    <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6 shadow-sm">
      <div>
        <h4 className="text-sm font-bold text-zinc-200 m-0">Limits Progress</h4>
        <p className="text-xxs text-zinc-550">Real-time status of category targets</p>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : budgetStatus.length > 0 ? (
        <div className="space-y-5">
          {budgetStatus.map(b => {
            const spent = Number(b.spent_amount);
            const limit = Number(b.limit_amount);
            const pct = Math.min((spent / limit) * 100, 100);
            const remaining = Number(b.remaining_amount);
            const isOver = spent > limit;

            return (
              <div key={b.id} className="p-4 rounded-2xl bg-zinc-900/10 border border-zinc-850 hover:border-zinc-800 transition-all space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-300 capitalize">{b.category}</span>
                    {isOver && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/25 flex items-center gap-1">
                        <AlertCircle size={10} /> Over Limit
                      </span>
                    )}
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-zinc-400">Spent: </span>
                    <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-zinc-200'}`}>
                      ₹{spent.toFixed(2)}
                    </span>
                    <span className="text-zinc-500"> of ₹{limit.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress slider */}
                <div className="h-2.5 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-xxs text-zinc-500 font-medium">
                  <span>{pct.toFixed(0)}% utilization</span>
                  <span className={isOver ? 'text-rose-600 font-bold' : 'text-emerald-500 font-semibold'}>
                    {isOver ? `Exceeded by ₹${Math.abs(remaining).toFixed(2)}` : `₹${remaining.toFixed(2)} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-550 text-xs">
          No budgets declared for this month. Set budget limits in the configuration panel.
        </div>
      )}
    </div>
  );
};

export default LimitsProgressList;
