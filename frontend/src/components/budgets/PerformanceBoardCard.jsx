import React from 'react';
import { Info } from 'lucide-react';

const PerformanceBoardCard = ({ compareData }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Info size={16} className="text-zinc-400" />
        <h4 className="text-sm font-bold text-zinc-200 m-0">Performance Board</h4>
      </div>
      <p className="text-xxs text-zinc-550 mb-4">Comparing spent totals against baseline limits</p>

      <div className="space-y-3">
        {compareData.length > 0 ? (
          compareData.map((item, idx) => {
            const spent = Number(item.spent_amount);
            const limit = Number(item.budget_limit);
            const diff = Number(item.difference);
            const isOver = diff > 0;

            return (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/10 border border-zinc-850 text-xxs">
                <div className="space-y-0.5">
                  <p className="font-bold text-zinc-400 capitalize">{item.category}</p>
                  <p className="text-zinc-500">
                    Limit: ₹{limit.toFixed(0)} • Spent: ₹{spent.toFixed(0)}
                  </p>
                </div>
                <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-emerald-500'}`}>
                  {isOver ? `+₹${diff.toFixed(0)}` : `-₹${Math.abs(diff).toFixed(0)}`}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-zinc-550 text-xxs">
            No comparisons compiled yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceBoardCard;
