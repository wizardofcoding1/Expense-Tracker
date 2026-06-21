import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ActiveBudgetsCard = ({ budgetStatus }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-bold text-zinc-200 mb-1">Active Budgets</h4>
          <p className="text-xxs text-zinc-550">Monthly budget thresholds progress</p>
        </div>
        <Link to="/budgets" className="text-primary hover:underline text-xs font-semibold flex items-center gap-1">
          Configure <ChevronRight size={14} />
        </Link>
      </div>

      <div className="space-y-4">
        {budgetStatus.length > 0 ? (
          budgetStatus.map(b => {
            const spent = Number(b.spent_amount);
            const limit = Number(b.limit_amount);
            const pct = Math.min((spent / limit) * 100, 100);
            const isExceeded = spent > limit;
            
            return (
              <div key={b.id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-400 capitalize">{b.category}</span>
                  <span className="text-zinc-400">
                    <strong className={isExceeded ? 'text-rose-600' : 'text-zinc-200'}>
                      ₹{spent.toFixed(0)}
                    </strong>{' '}
                    / ₹{limit.toFixed(0)}
                  </span>
                </div>
                {/* Progress Bar Container */}
                <div className="h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isExceeded ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-zinc-550 text-xs">
            No active budgets defined. Go to Budgets to set limits.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveBudgetsCard;
