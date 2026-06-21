import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const ExpenseBreakdownCard = ({ categoryTotals, COLORS }) => {
  return (
    <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col justify-between min-h-[350px] shadow-sm">
      <div>
        <h4 className="text-sm font-bold text-zinc-200 mb-1">Expense Breakdown</h4>
        <p className="text-xxs text-zinc-550 mb-6">Distribution of expenses across categories in this period</p>
      </div>
      
      <div className="flex-1 flex items-center justify-center min-h-[220px]">
        {categoryTotals.length > 0 ? (
          <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontSize: '11px'
                    }} 
                    formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-4">
              {categoryTotals.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-zinc-400 font-medium">{entry.name}:</span>
                  <span className="text-zinc-200 font-bold">₹{entry.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-xs">
            No expense data found for this period. Add expenses to generate metrics.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseBreakdownCard;
