import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CustomSelect from '../CustomSelect';

const QuickAddModal = ({
  showAddModal,
  formType,
  formData,
  setFormData,
  onClose,
  onSubmit,
  errorModal,
  incomeCategories,
  expenseCategories,
  submitting
}) => {
  const [isOther, setIsOther] = React.useState(false);

  React.useEffect(() => {
    if (showAddModal) {
      const predefined = formType === 'income' ? incomeCategories : expenseCategories;
      const isPredef = predefined.includes(formData.category) && formData.category !== 'Other';
      if (isPredef) {
        setIsOther(false);
      } else if (!isOther && formData.category) {
        setIsOther(true);
      }
    }
  }, [showAddModal, formData.category, formType, incomeCategories, expenseCategories]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsOther(true);
      setFormData({ ...formData, category: '' });
    } else {
      setIsOther(false);
      setFormData({ ...formData, category: val });
    }
  };

  const todayStr = React.useMemo(() => {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }, []);

  if (!showAddModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel p-6 rounded-3xl w-full max-w-md animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-zinc-200">
            Quick Log {formType === 'income' ? 'Income' : 'Expense'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {errorModal && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {errorModal}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <CustomSelect
              value={isOther ? 'Other' : formData.category}
              onChange={(val) => handleCategoryChange({ target: { value: val } })}
              options={(formType === 'income' ? incomeCategories : expenseCategories).map(cat => ({ label: cat, value: cat }))}
            />
          </div>

          {isOther && (
            <div className="animate-in fade-in duration-200">
              <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Custom Category Name
              </label>
              <input
                type="text"
                value={formData.category === 'Other' ? '' : formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Enter custom category"
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Coffee, Taxi, Lunch, Freelance"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
            />
          </div>

          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200 [color-scheme:light]"
              required
              max={todayStr}
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
                Logging...
              </>
            ) : (
              'Log Transaction'
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default QuickAddModal;
