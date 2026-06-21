import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RecentTransactionsCard = ({ recentTransactions }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-bold text-zinc-200 mb-1">Recent Transactions</h4>
          <p className="text-xxs text-zinc-550">Latest activity in this period</p>
        </div>
        <Link to="/transactions" className="text-primary hover:underline text-xs font-semibold flex items-center gap-1">
          View All <ChevronRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.map(item => (
            <div 
              key={item.id + item.type} 
              className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/20 border border-zinc-850"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-455'}`}>
                  {item.type === 'income' ? '+' : '-'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-zinc-200 truncate">{item.description || 'No Description'}</p>
                  <p className="text-xxs text-zinc-550 capitalize">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`text-sm font-extrabold flex-shrink-0 ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-600'}`}>
                {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-550 text-xs">
            No transactions found for this period.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
