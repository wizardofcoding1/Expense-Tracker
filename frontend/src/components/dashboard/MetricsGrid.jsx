import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const MetricsGrid = ({ summary, remainingTotalBudget, totalBudgetLimit }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Net Savings */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <p className="text-xs text-zinc-550 font-semibold uppercase tracking-wider">Net Savings</p>
          <h3 className={`text-2xl font-bold ${summary.netSavings >= 0 ? 'text-emerald-500' : 'text-rose-600'}`}>
            ₹{summary.netSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${summary.netSavings >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-600'}`}>
          <Wallet size={20} />
        </div>
      </div>

      {/* Incomes */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <p className="text-xs text-zinc-550 font-semibold uppercase tracking-wider">Total Income</p>
          <h3 className="text-2xl font-bold text-emerald-500">
            ₹{summary.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <TrendingUp size={20} />
        </div>
      </div>

      {/* Expenses */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <p className="text-xs text-zinc-555 font-semibold uppercase tracking-wider">Total Expenses</p>
          <h3 className="text-2xl font-bold text-rose-600">
            ₹{summary.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="h-11 w-11 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
          <TrendingDown size={20} />
        </div>
      </div>

      {/* Remaining Budget */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <p className="text-xs text-zinc-550 font-semibold uppercase tracking-wider">Remaining Budget</p>
          <h3 className={`text-2xl font-bold ${remainingTotalBudget >= 0 ? 'text-blue-500' : 'text-rose-600'}`}>
            {totalBudgetLimit > 0 
              ? `₹${remainingTotalBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
              : '₹0.00'}
          </h3>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${remainingTotalBudget >= 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-600'}`}>
          <Wallet size={20} />
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;
