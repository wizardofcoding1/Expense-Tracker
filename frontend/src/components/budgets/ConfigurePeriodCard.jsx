import React from 'react';
import CustomSelect from '../CustomSelect';

const ConfigurePeriodCard = ({ month, setMonth, year, setYear, monthsList }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-sm">
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Configure Period</h4>
        <p className="text-xxs text-zinc-550">Select reporting period for limits configuration</p>
      </div>
      <div className="flex gap-3 mt-4">
        <CustomSelect
          value={month}
          onChange={(val) => setMonth(Number(val))}
          options={monthsList.map((mName, idx) => ({ label: mName, value: idx + 1 }))}
          buttonClassName="px-3 py-2 text-xs text-zinc-200"
          className="flex-1"
        />
        <CustomSelect
          value={year}
          onChange={(val) => setYear(Number(val))}
          options={[year - 2, year - 1, year, year + 1].map(y => ({ label: String(y), value: y }))}
          buttonClassName="px-3 py-2 text-xs text-zinc-200"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ConfigurePeriodCard;
