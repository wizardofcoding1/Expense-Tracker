import React from 'react';
import { X, Coins } from 'lucide-react';

const ContributeModal = ({
  isOpen,
  activeGoal,
  contributionAmount,
  setContributionAmount,
  onClose,
  onSubmit
}) => {
  if (!isOpen || !activeGoal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-150">
      <div className="glass-panel p-6 rounded-3xl w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-primary">
            <Coins size={18} />
            <h3 className="text-lg font-bold text-zinc-200">Deposit Capital</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <p className="text-xxs text-zinc-400 mb-4 leading-normal">
          Contribute extra cash into <span className="font-bold text-zinc-400">{activeGoal.name}</span>. <br />
          Target: ₹{Number(activeGoal.target_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Saved: ₹{Number(activeGoal.current_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}).
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Deposit Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-550 text-xs">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="0.00"
                className="glass-input w-full pl-7 pr-4 py-2.5 rounded-xl text-sm text-zinc-200"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-455 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-emerald-950/20 text-xs cursor-pointer"
          >
            Record Contribution
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContributeModal;
