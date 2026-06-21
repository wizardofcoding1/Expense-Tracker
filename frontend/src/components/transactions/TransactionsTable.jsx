import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const TransactionsTable = ({
  loading,
  filtered,
  onEdit,
  onDelete
}) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-zinc-550 text-xs">Loading logs...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/10 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filtered.map(item => (
                <tr key={item.id + item.type} className="hover:bg-zinc-900/10 transition-colors">
                  <td className="px-6 py-3.5 text-zinc-400 font-medium">
                    {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-zinc-200 font-semibold truncate max-w-[200px]" title={item.description}>
                    {item.description || 'No Description'}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider bg-zinc-800/60 text-zinc-400 border border-zinc-700/20">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider border ${
                      item.type === 'income' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' 
                        : 'bg-rose-500/10 text-rose-600 border-rose-500/10'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`px-6 py-3.5 text-right font-extrabold ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-600'}`}>
                    {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-zinc-500 hover:text-primary transition-colors hover:bg-zinc-800/40 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id, item.type)}
                        className="p-1.5 text-zinc-500 hover:text-rose-600 transition-colors hover:bg-zinc-800/40 rounded-lg cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-zinc-550">
          No transactions matching filters. Log some transactions to populate ledger.
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
