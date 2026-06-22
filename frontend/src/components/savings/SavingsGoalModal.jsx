import React from 'react';
import { X } from 'lucide-react';

const SavingsGoalModal = ({
  isOpen,
  isEdit,
  formData,
  setFormData,
  onClose,
  onSubmit,
  submitting
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-150">
      <div className="glass-panel p-6 rounded-3xl w-full max-w-md animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-zinc-200">
            {isEdit ? 'Edit Goal Details' : 'Create Savings Target'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xxs font-bold text-zinc-555 uppercase tracking-wider mb-1.5">
              Goal Title
            </label>
            <input
              type="text"
              placeholder="e.g. Vacation Fund"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xxs font-bold text-zinc-555 uppercase tracking-wider mb-1.5">
              Target Capital (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
            />
          </div>

          {isEdit && (
            <div>
              <label className="block text-xxs font-bold text-zinc-555 uppercase tracking-wider mb-1.5">
                Accumulated Capital (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xxs font-bold text-zinc-555 uppercase tracking-wider mb-1.5">
              Target Deadline Date
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200 [color-scheme:light]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 bg-primary hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving Goal...
              </>
            ) : (
              'Save Savings Target'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalModal;
