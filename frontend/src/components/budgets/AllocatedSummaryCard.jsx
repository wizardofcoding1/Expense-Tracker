import React from 'react';

const AllocatedSummaryCard = ({
  totalBudgetLimit,
  totalBudgetSpent,
  totalBudgetRemaining,
  totalPct
}) => {
  return (
    <div className="lg:col-span-2 glass-panel p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center shadow-sm">
      <div className="space-y-1">
        <p className="text-xxs text-zinc-550 font-semibold uppercase tracking-wider">Total Allocated</p>
        <h3 className="text-xl font-bold text-zinc-200">₹{totalBudgetLimit.toFixed(2)}</h3>
      </div>
      <div className="space-y-1">
        <p className="text-xxs text-zinc-550 font-semibold uppercase tracking-wider">Total Spent</p>
        <h3 className="text-xl font-bold text-rose-600">₹{totalBudgetSpent.toFixed(2)}</h3>
      </div>
      <div className="space-y-1">
        <p className="text-xxs text-zinc-550 font-semibold uppercase tracking-wider">Total Remaining</p>
        <h3 className={`text-xl font-bold ${totalBudgetRemaining >= 0 ? 'text-emerald-500' : 'text-rose-600'}`}>
          ₹{totalBudgetRemaining.toFixed(2)}
        </h3>
      </div>
      {/* Visual Monthly Progress bar */}
      <div className="col-span-1 sm:col-span-3 space-y-1.5 mt-2">
        <div className="flex justify-between text-xxs font-semibold text-zinc-400">
          <span>Overall Utilization</span>
          <span>{totalPct.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${totalPct > 100 ? 'bg-rose-500' : totalPct > 85 ? 'bg-amber-500' : 'bg-primary'}`}
            style={{ width: `${Math.min(totalPct, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AllocatedSummaryCard;
