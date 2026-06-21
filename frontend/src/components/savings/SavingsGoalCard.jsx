import React from 'react';
import { Calendar, Edit3, Trash2, Coins } from 'lucide-react';

const SavingsGoalCard = ({ goal, onEdit, onDelete, onContribute }) => {
  const current = Number(goal.current_amount || 0);
  const target = Number(goal.target_amount);
  const pct = Math.min((current / target) * 100, 100);
  const isCompleted = current >= target;

  return (
    <div 
      className="glass-panel p-6 rounded-3xl flex flex-col justify-between hover:border-zinc-700/60 transition-all relative overflow-hidden group shadow-sm"
    >
      {/* Visual completion accent */}
      {isCompleted && (
        <div className="absolute top-0 right-0 h-10 w-20 bg-emerald-500/15 border-b border-l border-emerald-500/20 rounded-bl-3xl flex items-center justify-center">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Achieved</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Title & Actions */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-200 truncate max-w-[160px]" title={goal.name}>
              {goal.name}
            </h4>
            <p className="text-xxs text-zinc-550 flex items-center gap-1">
              <Calendar size={12} className="text-zinc-550" />
              Target Date: {new Date(goal.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(goal)}
              className="p-1 text-zinc-500 hover:text-primary transition-colors hover:bg-zinc-800/40 rounded-md cursor-pointer"
              title="Edit Goal"
            >
              <Edit3 size={14} />
            </button>
            <button 
              onClick={() => onDelete(goal.id)}
              className="p-1 text-zinc-500 hover:text-rose-600 transition-colors hover:bg-zinc-800/40 rounded-md cursor-pointer"
              title="Delete Goal"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Progress values */}
        <div className="flex justify-between items-baseline text-xs font-semibold">
          <span className="text-2xl font-black text-zinc-200">₹{current.toLocaleString('en-IN')}</span>
          <span className="text-zinc-500 font-medium">of ₹{target.toLocaleString('en-IN')}</span>
        </div>

        {/* Progress slider */}
        <div className="space-y-1">
          <div className="h-2.5 w-full rounded-full bg-zinc-800/80 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
              style={{ width: `${pct}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xxs text-zinc-550 font-medium">
            <span>{pct.toFixed(0)}% saved</span>
            <span>{(target - current) > 0 ? `₹${Math.ceil(target - current).toLocaleString('en-IN')} left` : 'Goal met!'}</span>
          </div>
        </div>
      </div>

      {/* Contribute button */}
      <button
        onClick={() => onContribute(goal)}
        disabled={isCompleted}
        className={`
          w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer
          ${isCompleted 
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default' 
            : 'bg-zinc-900/40 hover:bg-zinc-800/40 text-zinc-200 border border-zinc-800/60'
          }
        `}
      >
        <Coins size={14} />
        {isCompleted ? 'Target Fulfilled' : 'Deposit Funds'}
      </button>
    </div>
  );
};

export default SavingsGoalCard;
