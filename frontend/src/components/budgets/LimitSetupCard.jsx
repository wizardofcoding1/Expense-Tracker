import React from 'react';
import CustomSelect from '../CustomSelect';

const LimitSetupCard = ({
  formCategory,
  setFormCategory,
  limitAmount,
  setLimitAmount,
  categories,
  onSubmit
}) => {
  const [isOther, setIsOther] = React.useState(false);

  React.useEffect(() => {
    const isPredef = categories.includes(formCategory) && formCategory !== 'Other';
    if (isPredef) {
      setIsOther(false);
    } else if (!isOther && formCategory) {
      setIsOther(true);
    }
  }, [formCategory, categories]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsOther(true);
      setFormCategory('');
    } else {
      setIsOther(false);
      setFormCategory(val);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl shadow-sm">
      <h4 className="text-sm font-bold text-zinc-200 mb-4">Limit Setup</h4>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xxs font-bold text-zinc-550 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <CustomSelect
            value={isOther ? 'Other' : formCategory}
            onChange={(val) => handleCategoryChange({ target: { value: val } })}
            options={categories.map(cat => ({ label: cat, value: cat }))}
          />
        </div>

        {isOther && (
          <div className="animate-in fade-in duration-200">
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Custom Category Name
            </label>
            <input
              type="text"
              value={formCategory === 'Other' ? '' : formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              placeholder="Enter custom category"
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            Limit Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-md shadow-primary/20 active:scale-[0.98] text-xs cursor-pointer"
        >
          Set Limit
        </button>
      </form>
    </div>
  );
};

export default LimitSetupCard;
