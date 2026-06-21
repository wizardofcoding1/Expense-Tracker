import React from 'react';

const ExpensesLedgerTab = ({ expenses }) => {
  return (
    <div className="space-y-4 animate-fade-in">
      {expenses.length > 0 ? (
        <div className="space-y-3">
          {expenses.map((exp) => (
            <div key={exp.id} className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/10 border border-zinc-850">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-200 capitalize">{exp.description}</p>
                <p className="text-[10px] text-zinc-550">
                  Paid by: {exp.payer_first_name} {exp.payer_last_name} • {new Date(exp.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs font-black text-zinc-250">₹{Number(exp.amount).toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-550 text-xs">
          No group expenses logged yet.
        </div>
      )}
    </div>
  );
};

export default ExpensesLedgerTab;
