import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { PieChart as PieIcon, Info, TrendingUp, Flame, TrendingUp as TrendUpIcon, Activity, Layers } from 'lucide-react';

const InsightsTab = ({
  insightPeriod,
  setInsightPeriod,
  dynamicPeriods,
  getPeriodLabel,
  insights,
  COLORS,
  tooltipStyle
}) => {
  return (
    <div className="space-y-6">
      {/* Option Selector Bar */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-wrap gap-6 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <PieIcon size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">Financial Insights & allocation</h4>
            <p className="text-xxs text-zinc-550">Review percentage distribution and monthly financial health indices</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xxs text-zinc-400 font-semibold uppercase">Select Period:</label>
          <select 
            value={insightPeriod} 
            onChange={(e) => setInsightPeriod(e.target.value)}
            className="glass-input px-2.5 py-1.5 rounded-lg text-xxs font-bold text-zinc-200"
          >
            {dynamicPeriods.map(p => (
              <option key={p.value} value={p.value} className="bg-obsidian-900">{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Savings Rate */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Savings Rate</span>
              <h3 className={`text-xl font-bold mt-1 ${insights.savingsRate >= 20 ? 'text-emerald-500' : insights.savingsRate > 0 ? 'text-blue-500' : 'text-rose-500'}`}>
                {insights.savingsRate}%
              </h3>
            </div>
            <span className={`p-2 rounded-lg text-xs ${insights.savingsRate > 0 ? 'bg-emerald-50/10 text-emerald-400' : 'bg-rose-50/10 text-rose-400'}`}>
              <TrendingUp size={16} />
            </span>
          </div>
          
          <div className="mt-4">
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${insights.savingsRate >= 20 ? 'bg-emerald-500' : insights.savingsRate > 0 ? 'bg-blue-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.max(0, Math.min(100, insights.savingsRate))}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-zinc-555 mt-1.5 block leading-none">
              {insights.savingsRate > 0 ? `Saved ₹${insights.netSavings.toLocaleString()} of total income` : 'Overspent income for the period'}
            </span>
          </div>
        </div>

        {/* Card 2: Daily Burn Rate */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Daily Burn Rate</span>
              <h3 className="text-xl font-bold text-zinc-150 mt-1">
                ₹{insights.dailyBurnRate.toLocaleString()} <span className="text-[10px] text-zinc-500 font-medium">/ day</span>
              </h3>
            </div>
            <span className="p-2 bg-rose-50/10 text-rose-400 rounded-lg text-xs">
              <Flame size={16} />
            </span>
          </div>
          
          <div className="mt-4">
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <span className="text-[9px] text-zinc-555 mt-1.5 block leading-none">
              Average spent per day in this billing cycle
            </span>
          </div>
        </div>

        {/* Card 3: Top Category */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Top Spending Category</span>
              <h3 className="text-xl font-bold text-zinc-150 mt-1">
                {insights.highestCat}
              </h3>
            </div>
            <span className="p-2 bg-accent-purple/10 text-accent-purple rounded-lg text-xs">
              <TrendUpIcon size={16} />
            </span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
              <span>Proportion:</span>
              <span>{insights.highestPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-accent-purple rounded-full" style={{ width: `${insights.highestPct}%` }}></div>
            </div>
            <span className="text-[9px] text-zinc-550 mt-1.5 block leading-none">
              ₹{insights.highestAmt.toLocaleString()} total spent
            </span>
          </div>
        </div>

        {/* Card 4: Transaction Volume */}
        <div className="glass-panel p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Activity Count</span>
              <h3 className="text-xl font-bold text-zinc-150 mt-1">
                {insights.transactionCount} <span className="text-[10px] text-zinc-500 font-medium">logs</span>
              </h3>
            </div>
            <span className="p-2 bg-blue-50/10 text-blue-400 rounded-lg text-xs">
              <Activity size={16} />
            </span>
          </div>
          
          <div className="mt-4">
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="text-[9px] text-zinc-555 mt-1.5 block leading-none">
              Total logs processed for this period
            </span>
          </div>
        </div>
      </div>

      {/* Doughnut Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl min-h-[380px] lg:col-span-2 flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-zinc-200 m-0">Category Allocation Share</h4>
            <p className="text-xxs text-zinc-550 mt-1">Percentage breakdown of total expenses for {getPeriodLabel(insightPeriod)}</p>
          </div>

          {insights.doughnutData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-500 text-xs gap-1.5">
              <Layers size={24} className="text-zinc-600" />
              No expenses logged for this month.
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
              <div className="relative w-full md:w-1/2 h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insights.doughnutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {insights.doughnutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Hollow Center Text */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Total Spent</span>
                  <span className="text-lg font-extrabold text-zinc-100">₹{insights.monthExpense.toLocaleString()}</span>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                {insights.doughnutData.map((item, index) => {
                  const pct = insights.monthExpense > 0 ? (item.value / insights.monthExpense) * 100 : 0;
                  return (
                    <div key={item.name} className="p-2.5 rounded-xl bg-zinc-950/5 border border-zinc-800 flex flex-col gap-1.5 transition-all hover:bg-zinc-950/10 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          <span className="font-bold text-zinc-150">{item.name}</span>
                        </div>
                        <div className="text-zinc-300 font-semibold">
                          <span>₹{item.value.toLocaleString()}</span>
                          <span className="text-[10px] text-zinc-500 ml-1.5 font-normal">({pct.toFixed(1)}%)</span>
                        </div>
                      </div>
                      {/* Allocation ratio indicators */}
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ 
                            backgroundColor: COLORS[index % COLORS.length],
                            width: `${pct}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Insight Highlights Sidebar Panel */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-zinc-200 m-0">Financial Summary</h4>
            <p className="text-xxs text-zinc-555 mt-1">Quick balances for {getPeriodLabel(insightPeriod)}</p>
          </div>

          <div className="space-y-3.5 my-auto">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-800">
              <span className="text-zinc-400 font-medium">Total Income</span>
              <span className="text-emerald-500 font-bold">₹{insights.monthIncome.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-800">
              <span className="text-zinc-400 font-medium">Total Expenses</span>
              <span className="text-rose-500 font-bold">₹{insights.monthExpense.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">Net Savings</span>
              <span className={`font-bold ${insights.netSavings >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {insights.netSavings >= 0 ? '+' : ''}₹{insights.netSavings.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-950/20 rounded-xl border border-zinc-800 flex gap-2">
            <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <span className="text-[10px] text-zinc-550 leading-relaxed">
              Maintaining a savings rate above 20% is recommended. Review budgets to control category overspends.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;
