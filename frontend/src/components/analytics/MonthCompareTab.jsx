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
import { Layers, Info, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MonthCompareTab = ({
  compareMode,
  setCompareMode,
  compareType,
  setCompareType,
  monthA,
  setMonthA,
  monthB,
  setMonthB,
  monthC,
  setMonthC,
  compareChartType,
  setCompareChartType,
  dynamicPeriods,
  getPeriodLabel,
  hasCompareConflict,
  comparisonData,
  tooltipStyle
}) => {

  // Helper to determine the direction of 3-month variance
  const getThreeMonthTrend = (a, b, c) => {
    if (c === b && b === a) return { text: 'Stable', color: 'text-zinc-500', icon: <Activity size={12} /> };
    if (c <= b && b <= a && a > c) return { text: 'Upward Trend', color: 'text-rose-500', icon: <ArrowUpRight size={12} /> };
    if (c >= b && b >= a && a < c) return { text: 'Downward Trend', color: 'text-emerald-500', icon: <ArrowDownRight size={12} /> };
    return { text: 'Fluctuating', color: 'text-blue-500', icon: <Activity size={12} /> };
  };

  const renderCompareChart = () => {
    if (compareChartType === 'line') {
      return (
        <LineChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="MonthA" name={getPeriodLabel(monthA)} stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb' }} />
          <Line type="monotone" dataKey="MonthB" name={getPeriodLabel(monthB)} stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed' }} />
          {compareMode === '3-month' && (
            <Line type="monotone" dataKey="MonthC" name={getPeriodLabel(monthC)} stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669' }} />
          )}
        </LineChart>
      );
    } else if (compareChartType === 'area') {
      return (
        <AreaChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey="MonthA" name={getPeriodLabel(monthA)} stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
          <Area type="monotone" dataKey="MonthB" name={getPeriodLabel(monthB)} stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} />
          {compareMode === '3-month' && (
            <Area type="monotone" dataKey="MonthC" name={getPeriodLabel(monthC)} stroke="#059669" fill="#059669" fillOpacity={0.15} />
          )}
        </AreaChart>
      );
    } else {
      return (
        <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="MonthA" name={getPeriodLabel(monthA)} fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar dataKey="MonthB" name={getPeriodLabel(monthB)} fill="#7c3aed" radius={[4, 4, 0, 0]} />
          {compareMode === '3-month' && (
            <Bar dataKey="MonthC" name={getPeriodLabel(monthC)} fill="#059669" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Bar */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Multi-Month Variance Parameters</h4>
              <p className="text-xxs text-zinc-550">Compare category allocations side-by-side</p>
            </div>
          </div>

          {/* Mode & Type Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xxs font-semibold">
              <button 
                onClick={() => setCompareMode('2-month')} 
                className={`px-3 py-1 rounded-md transition-all ${compareMode === '2-month' ? 'bg-primary text-white shadow-sm' : 'text-zinc-400'}`}
              >
                2 Months
              </button>
              <button 
                onClick={() => setCompareMode('3-month')} 
                className={`px-3 py-1 rounded-md transition-all ${compareMode === '3-month' ? 'bg-primary text-white shadow-sm' : 'text-zinc-400'}`}
              >
                3 Months
              </button>
            </div>

            <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xxs font-semibold">
              <button 
                onClick={() => setCompareType('expense')} 
                className={`px-3 py-1 rounded-md transition-all ${compareType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-zinc-400'}`}
              >
                Expenses
              </button>
              <button 
                onClick={() => setCompareType('income')} 
                className={`px-3 py-1 rounded-md transition-all ${compareType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-zinc-400'}`}
              >
                Incomes
              </button>
            </div>
          </div>
        </div>

        {/* Period Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xxs text-zinc-400 font-semibold uppercase">Month A (Latest Reference)</label>
            <select 
              value={monthA} 
              onChange={(e) => setMonthA(e.target.value)}
              className="glass-input w-full px-2.5 py-2 rounded-lg text-xs text-zinc-200"
            >
              {dynamicPeriods.map(p => (
                <option key={p.value} value={p.value} className="bg-obsidian-900">{p.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xxs text-zinc-400 font-semibold uppercase">Month B (Historical Base)</label>
            <select 
              value={monthB} 
              onChange={(e) => setMonthB(e.target.value)}
              className="glass-input w-full px-2.5 py-2 rounded-lg text-xs text-zinc-200"
            >
              {dynamicPeriods.map(p => (
                <option key={p.value} value={p.value} className="bg-obsidian-900">{p.label}</option>
              ))}
            </select>
          </div>

          {compareMode === '3-month' && (
            <div className="space-y-1">
              <label className="text-xxs text-zinc-400 font-semibold uppercase">Month C (Comparison Base)</label>
              <select 
                value={monthC} 
                onChange={(e) => setMonthC(e.target.value)}
                className="glass-input w-full px-2.5 py-2 rounded-lg text-xs text-zinc-200"
              >
                {dynamicPeriods.map(p => (
                  <option key={p.value} value={p.value} className="bg-obsidian-900">{p.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {hasCompareConflict ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[350px] border-rose-500/20 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50/10 flex items-center justify-center text-rose-500 mb-4 animate-pulse">
            <Info size={32} />
          </div>
          <h4 className="text-base font-bold text-zinc-150">Duplicate Months Selected</h4>
          <p className="text-xs text-zinc-550 max-w-md mt-2 leading-relaxed">
            You have selected duplicate periods for comparison. Please select distinct months in the dropdowns above to analyze variance and trends.
          </p>
        </div>
      ) : (
        <>
          {/* Comparison Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Chart */}
            <div className="glass-panel p-6 rounded-3xl min-h-[380px] lg:col-span-2 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 m-0">Category Breakdown Comparison</h4>
                  <p className="text-xxs text-zinc-550 mt-1">
                    {compareMode === '2-month' 
                      ? `Comparing ${getPeriodLabel(monthA)} vs ${getPeriodLabel(monthB)}` 
                      : `Comparing ${getPeriodLabel(monthA)} vs ${getPeriodLabel(monthB)} vs ${getPeriodLabel(monthC)}`
                    }
                  </p>
                </div>

                {/* Chart Type Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">View:</span>
                  <select
                    value={compareChartType}
                    onChange={(e) => setCompareChartType(e.target.value)}
                    className="glass-input px-2.5 py-1 rounded-lg text-xxs font-bold text-zinc-250"
                  >
                    <option value="bar" className="bg-obsidian-900">Bar</option>
                    <option value="line" className="bg-obsidian-900">Line</option>
                    <option value="area" className="bg-obsidian-900">Area</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 min-h-[280px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  {renderCompareChart()}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Short Stats Highlights Panel */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="text-sm font-bold text-zinc-200 m-0">Summed Period Totals</h4>
                <p className="text-xxs text-zinc-550 mt-1">Aggregated overall volume for comparison</p>
              </div>

              <div className="space-y-4 my-auto">
                <div className="p-3 bg-zinc-950/20 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">{getPeriodLabel(monthA)}</span>
                  <h3 className="text-lg font-bold text-zinc-150 m-0 mt-0.5">
                    ₹{comparisonData.reduce((sum, item) => sum + item.MonthA, 0).toLocaleString()}
                  </h3>
                </div>

                <div className="p-3 bg-zinc-950/20 border border-zinc-800 rounded-xl">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">{getPeriodLabel(monthB)}</span>
                  <h3 className="text-lg font-bold text-zinc-150 m-0 mt-0.5">
                    ₹{comparisonData.reduce((sum, item) => sum + item.MonthB, 0).toLocaleString()}
                  </h3>
                </div>

                {compareMode === '3-month' && (
                  <div className="p-3 bg-zinc-950/20 border border-zinc-800 rounded-xl">
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase">{getPeriodLabel(monthC)}</span>
                    <h3 className="text-lg font-bold text-zinc-150 m-0 mt-0.5">
                      ₹{comparisonData.reduce((sum, item) => sum + item.MonthC, 0).toLocaleString()}
                    </h3>
                  </div>
                )}
              </div>

              <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10 flex gap-2">
                <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-[10px] text-zinc-555 leading-relaxed">
                  Toggle categories above to change display metrics. Double check entries in transactions log if totals are unexpected.
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Comparison Table */}
          <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tabular Variance Reports</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-semibold text-[10px] uppercase">
                    <th className="px-6 py-3">Category / Source</th>
                    <th className="px-6 py-3">{getPeriodLabel(monthA)}</th>
                    <th className="px-6 py-3">{getPeriodLabel(monthB)}</th>
                    {compareMode === '3-month' && <th className="px-6 py-3">{getPeriodLabel(monthC)}</th>}
                    <th className="px-6 py-3">
                      {compareMode === '2-month' ? 'Variance (Abs)' : 'Variance Trend'}
                    </th>
                    <th className="px-6 py-3">
                      {compareMode === '2-month' ? 'Change (%)' : ''}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {comparisonData.map((row, idx) => {
                    const isInc = compareType === 'income';
                    const isDiffPositive = row.diff > 0;
                    
                    let badgeColor = 'text-zinc-500 bg-zinc-100';
                    let symbolSign = '';
                    if (row.diff !== 0) {
                      if (isInc) {
                        badgeColor = isDiffPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
                        symbolSign = isDiffPositive ? '+' : '';
                      } else {
                        badgeColor = isDiffPositive ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50';
                        symbolSign = isDiffPositive ? '+' : '';
                      }
                    }

                    const trend = getThreeMonthTrend(row.MonthA, row.MonthB, row.MonthC);

                    return (
                      <tr key={idx} className="hover:bg-zinc-900/5 transition-colors text-zinc-200">
                        <td className="px-6 py-4 font-bold text-zinc-100">{row.category}</td>
                        <td className="px-6 py-4 font-medium">₹{row.MonthA.toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium">₹{row.MonthB.toLocaleString()}</td>
                        {compareMode === '3-month' && (
                          <td className="px-6 py-4 font-medium">₹{row.MonthC.toLocaleString()}</td>
                        )}
                        
                        {compareMode === '2-month' ? (
                          <>
                            <td className={`px-6 py-4 font-bold ${row.diff > 0 ? 'text-rose-500' : row.diff < 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                              {row.diff > 0 ? '+' : ''}₹{row.diff.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                                {symbolSign}{row.percentage}%
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 font-bold ${trend.color}`}>
                                {trend.icon} {trend.text}
                              </span>
                            </td>
                            <td></td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthCompareTab;
