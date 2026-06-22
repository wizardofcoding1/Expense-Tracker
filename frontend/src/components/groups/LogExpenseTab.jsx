import React from 'react';
import { PlusCircle, CreditCard } from 'lucide-react';

const LogExpenseTab = ({
  expenseAmount,
  setExpenseAmount,
  expenseDesc,
  setExpenseDesc,
  splitType,
  setSplitType,
  customSplits,
  setCustomSplits,
  members,
  onSubmit,
  expenseDate,
  setExpenseDate,
  paidBy,
  setPaidBy
}) => {
  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            Cost (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-555">
              ₹
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="glass-input w-full pl-7 pr-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200 [color-scheme:light]"
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
          Paid By
        </label>
        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
          required
        >
          <option value="" disabled className="bg-obsidian-900 text-zinc-500">Select Payer</option>
          {members.map(m => (
            <option key={m.id} value={m.id} className="bg-obsidian-900 text-zinc-250">
              {m.firstName} {m.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <input
          type="text"
          placeholder="e.g. Group Dinner at Bella"
          value={expenseDesc}
          onChange={(e) => setExpenseDesc(e.target.value)}
          className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
          required
        />
      </div>

      <div>
        <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
          Expense Split Method
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input 
              type="radio" 
              name="splitType" 
              checked={splitType === 'equal'} 
              onChange={() => setSplitType('equal')}
              className="accent-primary" 
            />
            Split Equally
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input 
              type="radio" 
              name="splitType" 
              checked={splitType === 'custom'} 
              onChange={() => setSplitType('custom')}
              className="accent-primary" 
            />
            Custom Split
          </label>
        </div>
      </div>

      {/* Render custom splits configuration inputs if custom selected */}
      {splitType === 'custom' && (
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3">
          <p className="text-[10px] text-zinc-500 font-semibold mb-1 flex items-center gap-1">
            <CreditCard size={12} className="text-zinc-500" /> Assign individual share amounts
          </p>
          <div className="space-y-3.5">
            {members.map(member => (
              <div key={member.id} className="flex justify-between items-center gap-4">
                <span className="text-xs text-zinc-400 font-semibold truncate max-w-[150px]">
                  {member.firstName} {member.lastName}
                </span>
                <div className="relative w-32">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xxs">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={customSplits[member.id] || ''}
                    onChange={(e) => setCustomSplits({
                      ...customSplits,
                      [member.id]: e.target.value
                    })}
                    className="glass-input w-full pl-6 pr-3 py-1.5 rounded-lg text-xs text-zinc-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-primary hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-primary/20 text-xs flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusCircle size={16} /> Log Expense
      </button>
    </form>
  );
};

export default LogExpenseTab;
