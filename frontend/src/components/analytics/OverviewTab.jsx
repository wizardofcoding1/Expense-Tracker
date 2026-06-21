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
import { Download } from 'lucide-react';

const OverviewTab = ({
  monthlyCashflow,
  categoryTrend,
  selectedCategory,
  setSelectedCategory,
  expenseCategories,
  monthsList,
  exportMonth,
  setExportMonth,
  exportYear,
  setExportYear,
  handleExportCSV,
  overviewChartType,
  setOverviewChartType,
  tooltipStyle
}) => {

  const renderOverviewChart = () => {
    if (overviewChartType === 'line') {
      return (
        <LineChart data={monthlyCashflow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="Income" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669' }} />
          <Line type="monotone" dataKey="Expense" stroke="#e11d48" strokeWidth={2.5} dot={{ fill: '#e11d48' }} />
        </LineChart>
      );
    } else if (overviewChartType === 'area') {
      return (
        <AreaChart data={monthlyCashflow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey="Income" stroke="#059669" fill="#059669" fillOpacity={0.15} />
          <Area type="monotone" dataKey="Expense" stroke="#e11d48" fill="#e11d48" fillOpacity={0.15} />
        </AreaChart>
      );
    } else {
      return (
        <BarChart data={monthlyCashflow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, '']} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="Income" fill="#059669" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expense" fill="#e11d48" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* CSV Export Panel */}
      <div className="glass-panel p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center shadow-sm">
        <div className="md:col-span-2">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Download size={14} className="text-primary" /> Download Spreadsheet Ledger
          </h4>
          <p className="text-xxs text-zinc-550 mt-1">Export transaction logs of the selected period as a CSV spreadsheet</p>
        </div>
        <div className="flex gap-2 justify-end">
          <select 
            value={exportMonth}
            onChange={(e) => setExportMonth(Number(e.target.value))}
            className="glass-input px-2.5 py-2 rounded-lg text-xs text-zinc-200"
          >
            {monthsList.map((mName, idx) => (
              <option key={mName} value={idx + 1} className="bg-obsidian-900">{mName}</option>
            ))}
          </select>
          <select 
            value={exportYear}
            onChange={(e) => setExportYear(Number(e.target.value))}
            className="glass-input px-2.5 py-2 rounded-lg text-xs text-zinc-200"
          >
            {[exportYear - 2, exportYear - 1, exportYear, exportYear + 1].map(y => (
              <option key={y} value={y} className="bg-obsidian-900">{y}</option>
            ))}
          </select>
          <button 
            onClick={handleExportCSV}
            className="px-4 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg text-xs transition-colors active:scale-[0.98]"
          >
            Export
          </button>
        </div>
      </div>

      {/* 6-Month Cashflow and Category Progression charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl min-h-[380px] flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-200 m-0">Monthly Cashflow</h4>
              <p className="text-xxs text-zinc-550 mt-1">Total Income vs Total Expense comparison (Last 6 Months)</p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">View:</span>
              <select
                value={overviewChartType}
                onChange={(e) => setOverviewChartType(e.target.value)}
                className="glass-input px-2.5 py-1 rounded-lg text-xxs font-bold text-zinc-250"
              >
                <option value="bar" className="bg-obsidian-900">Bar</option>
                <option value="line" className="bg-obsidian-900">Line</option>
                <option value="area" className="bg-obsidian-900">Area</option>
              </select>
            </div>
          </div>

          <div className="flex-1 min-h-[260px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              {renderOverviewChart()}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl min-h-[380px] flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-200 m-0">Category Progression Trend</h4>
              <p className="text-xxs text-zinc-550 mt-1">Verify Category trend movements across the last 6 months</p>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input px-2.5 py-1.5 rounded-lg text-xxs text-zinc-250 font-semibold"
            >
              {expenseCategories.map(cat => (
                <option key={cat} value={cat} className="bg-obsidian-900">{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-h-[260px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={categoryTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`₹${value}`, 'Spent']} />
                <Line 
                  type="monotone" 
                  dataKey="Spent" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  dot={{ fill: '#2563eb', strokeWidth: 1 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
