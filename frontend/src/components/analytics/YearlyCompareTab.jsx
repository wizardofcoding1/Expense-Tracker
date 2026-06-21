import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, Info, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const YearlyCompareTab = ({
  yearA,
  setYearA,
  yearB,
  setYearB,
  yearlyType,
  setYearlyType,
  yearlyChartType,
  setYearlyChartType,
  yearlyCompData,
  hasYearlyConflict,
  currentDate,
  tooltipStyle
}) => {

  const renderYearlyChart = () => {
    if (yearlyChartType === 'bar') {
      return (
        <BarChart data={yearlyCompData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey={yearA} name={`Year ${yearA}`} fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey={yearB} name={`Year ${yearB}`} fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    } else if (yearlyChartType === 'area') {
      return (
        <AreaChart data={yearlyCompData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey={yearA} name={`Year ${yearA}`} stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
          <Area type="monotone" dataKey={yearB} name={`Year ${yearB}`} stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} />
        </AreaChart>
      );
    } else {
      return (
        <LineChart data={yearlyCompData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey={yearA} name={`Year ${yearA}`} stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb' }} />
          <Line type="monotone" dataKey={yearB} name={`Year ${yearB}`} stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed' }} />
        </LineChart>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Bar */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-wrap gap-6 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Calendar size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Year-Over-Year Progression Settings</h4>
            <p className="text-xxs text-zinc-555">Track month-by-month changes between financial years</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
            <span>Year A:</span>
            <select 
              value={yearA} 
              onChange={(e) => setYearA(Number(e.target.value))}
              className="glass-input px-2.5 py-1.5 rounded-lg text-xxs font-bold text-zinc-200"
            >
              {[currentDate.getFullYear() - 3, currentDate.getFullYear() - 2, currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map(y => (
                <option key={y} value={y} className="bg-obsidian-900">{y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
            <span>Year B:</span>
            <select 
              value={yearB} 
              onChange={(e) => setYearB(Number(e.target.value))}
              className="glass-input px-2.5 py-1.5 rounded-lg text-xxs font-bold text-zinc-200"
            >
              {[currentDate.getFullYear() - 3, currentDate.getFullYear() - 2, currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map(y => (
                <option key={y} value={y} className="bg-obsidian-900">{y}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xxs font-semibold">
            <button 
              onClick={() => setYearlyType('expense')} 
              className={`px-3 py-1 rounded-md transition-all ${yearlyType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-zinc-400'}`}
            >
              Expenses
            </button>
            <button 
              onClick={() => setYearlyType('income')} 
              className={`px-3 py-1 rounded-md transition-all ${yearlyType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400'}`}
            >
              Incomes
            </button>
          </div>
        </div>
      </div>

      {hasYearlyConflict ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[350px] border-rose-500/20 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50/10 flex items-center justify-center text-rose-500 mb-4 animate-pulse">
            <Info size={32} />
          </div>
          <h4 className="text-base font-bold text-zinc-150">Duplicate Years Selected</h4>
          <p className="text-xs text-zinc-550 max-w-md mt-2 leading-relaxed">
            You have selected duplicate years for comparison. Please select two distinct years in the dropdowns above to analyze month-over-month volume progression.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl min-h-[380px] lg:col-span-2 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-200 m-0">Monthly Volume Trends</h4>
                <p className="text-xxs text-zinc-550 mt-1">Comparing month-by-month totals: Year {yearA} vs Year {yearB}</p>
              </div>

              {/* Chart Type Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">View:</span>
                <select
                  value={yearlyChartType}
                  onChange={(e) => setYearlyChartType(e.target.value)}
                  className="glass-input px-2.5 py-1 rounded-lg text-xxs font-bold text-zinc-250"
                >
                  <option value="line" className="bg-obsidian-900">Line</option>
                  <option value="bar" className="bg-obsidian-900">Bar</option>
                  <option value="area" className="bg-obsidian-900">Area</option>
                </select>
              </div>
            </div>

            <div className="flex-1 min-h-[280px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                {renderYearlyChart()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Stats Summary Card */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-zinc-200 m-0">Yearly Ledger Totals</h4>
              <p className="text-xxs text-zinc-550 mt-1">Aggregated overall volume for each year</p>
            </div>

            <div className="space-y-4 my-auto">
              {/* Year A Stats */}
              <div className="p-4 bg-zinc-950/20 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">Year {yearA} Total</span>
                  <h3 className="text-xl font-bold text-zinc-150 m-0 mt-0.5">
                    ₹{yearlyCompData.reduce((sum, item) => sum + item[yearA], 0).toLocaleString()}
                  </h3>
                </div>
                <span className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Wallet size={16} />
                </span>
              </div>

              {/* Year B Stats */}
              <div className="p-4 bg-zinc-950/20 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">Year {yearB} Total</span>
                  <h3 className="text-xl font-bold text-zinc-150 m-0 mt-0.5">
                    ₹{yearlyCompData.reduce((sum, item) => sum + item[yearB], 0).toLocaleString()}
                  </h3>
                </div>
                <span className="p-2 bg-accent-purple/10 text-accent-purple rounded-lg">
                  <Wallet size={16} />
                </span>
              </div>
            </div>

            {/* Net YoY variance indicator */}
            {(() => {
              const totalA = yearlyCompData.reduce((sum, i) => sum + i[yearA], 0);
              const totalB = yearlyCompData.reduce((sum, i) => sum + i[yearB], 0);
              const diff = totalA - totalB;
              const pct = totalB > 0 ? (diff / totalB) * 100 : (totalA > 0 ? 100 : 0);
              
              const isIncrease = diff > 0;
              const isIncType = yearlyType === 'income';
              const showSuccess = (isIncrease && isIncType) || (!isIncrease && !isIncType);

              return (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                  showSuccess 
                    ? 'bg-emerald-50/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-50/10 border-rose-500/20 text-rose-400'
                }`}>
                  {isIncrease ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 m-0">Year-Over-Year Change</p>
                    <h4 className="text-xs font-bold m-0 mt-0.5">
                      {isIncrease ? 'Increased' : 'Decreased'} by {Math.abs(pct).toFixed(1)}% (₹{Math.abs(diff).toLocaleString()})
                    </h4>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyCompareTab;
