import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Calendar,
  ChevronRight,
  PlusCircle,
  X,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Modular Components
import MetricsGrid from '../components/dashboard/MetricsGrid';
import ExpenseBreakdownCard from '../components/dashboard/ExpenseBreakdownCard';
import RecentTransactionsCard from '../components/dashboard/RecentTransactionsCard';
import ActiveBudgetsCard from '../components/dashboard/ActiveBudgetsCard';
import QuickAddModal from '../components/dashboard/QuickAddModal';
import CustomSelect from '../components/CustomSelect';

const getLocalTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1); // 1-12
  const [year, setYear] = useState(currentDate.getFullYear());
  
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netSavings: 0 });
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // States for Quick Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formType, setFormType] = useState('expense'); // expense, income
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: getLocalTodayString()
  });
  const [errorModal, setErrorModal] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];
  const expenseCategories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Entertainment', 'Travel', 'Health', 'Other'];

  const openAddModal = (type) => {
    setFormType(type);
    setFormData({
      amount: '',
      category: type === 'income' ? 'Salary' : 'Food',
      description: '',
      date: getLocalTodayString()
    });
    setErrorModal('');
    setShowAddModal(true);
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setErrorModal('');
    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorModal('Please enter a positive amount.');
      return;
    }
    
    // Prevent future-dated logging
    if (formData.date > getLocalTodayString()) {
      setErrorModal('Transaction date cannot be in the future.');
      return;
    }

    const payload = formType === 'income' ? {
      amount: Number(formData.amount),
      source: formData.category,
      description: formData.description,
      date: formData.date
    } : {
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    };

    setSubmitting(true);
    try {
      const endpoint = formType === 'expense' ? '/expenses' : '/incomes';
      const res = await API.post(endpoint, payload);
      if (res.data.success) {
        setSuccessMsg(`Successfully logged quick ${formType}!`);
        setTimeout(() => setSuccessMsg(''), 4500);
        setShowAddModal(false);
        fetchData(); // refresh dashboard data
      }
    } catch (err) {
      console.error(err);
      setErrorModal(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch monthly summary
      const summaryRes = await API.get(`/analytics/summary?month=${month}&year=${year}`);
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }

      // 2. Fetch budget status
      const budgetStatusRes = await API.get(`/budgets/status?month=${month}&year=${year}`);
      if (budgetStatusRes.data.success) {
        setBudgetStatus(budgetStatusRes.data.data);
      }

      // 3. Fetch incomes and expenses for the recent transactions
      const [expensesRes, incomesRes] = await Promise.all([
        API.get('/expenses'),
        API.get('/incomes')
      ]);

      let combined = [];
      if (expensesRes.data.success) {
        combined = [...combined, ...expensesRes.data.data.map(e => ({ ...e, type: 'expense' }))];
      }
      if (incomesRes.data.success) {
        combined = [...combined, ...incomesRes.data.data.map(i => ({ 
          ...i, 
          type: 'income',
          category: i.source // Map backend 'source' field to 'category' property
        }))];
      }

      // Filter by selected month and year
      const filtered = combined.filter(item => {
        const itemDate = new Date(item.date);
        return (itemDate.getMonth() + 1) === Number(month) && itemDate.getFullYear() === Number(year);
      });

      // Sort by date desc
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(filtered.slice(0, 5));

      // Calculate category totals for chart
      const catMap = {};
      filtered.forEach(item => {
        if (item.type === 'expense') {
          const cat = item.category || 'Other';
          const normalizedCat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
          catMap[normalizedCat] = (catMap[normalizedCat] || 0) + Number(item.amount);
        }
      });

      const chartData = Object.keys(catMap).map(cat => ({
        name: cat,
        value: catMap[cat]
      }));
      setCategoryTotals(chartData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleOfflineSyncCompleted = () => {
      fetchData();
    };

    window.addEventListener('offline-sync-completed', handleOfflineSyncCompleted);
    return () => {
      window.removeEventListener('offline-sync-completed', handleOfflineSyncCompleted);
    };
  }, [month, year]);

  // Color palette for charts
  const COLORS = ['#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e', '#10b981', '#6366f1'];

  // Check for budget violations
  const exceededBudgets = budgetStatus.filter(b => Number(b.spent_amount) > Number(b.limit_amount));

  // Compute remaining budget from totals
  const totalBudgetLimit = budgetStatus.reduce((sum, b) => sum + Number(b.limit_amount), 0);
  const totalBudgetSpent = budgetStatus.reduce((sum, b) => sum + Number(b.spent_amount), 0);
  const remainingTotalBudget = totalBudgetLimit - totalBudgetSpent;

  return (
    <div className="space-y-6">
      {/* Title & Quick Add Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 m-0">Dashboard Overview</h2>
          <p className="text-xs text-zinc-550">Quick glance at your wealth tracking and budgets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Quick Add Expense  */}
          <button 
            onClick={() => openAddModal('expense')} 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-455 text-white transition-all shadow-md shadow-rose-950/20 active:scale-[0.98] cursor-pointer"
          >
            <TrendingDown size={14} /> Quick Add Expense
          </button>

          {/* Quick Add Income */}
          <button 
            onClick={() => openAddModal('income')} 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-455 text-white transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
          >
            <TrendingUp size={14} /> Quick Add Income
          </button>
          
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex justify-between items-center animate-fade-in">
          <span className="flex items-center gap-2"><Check size={18} /> {successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X size={16} /></button>
        </div>
      )}

      {/* Date filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 glass-panel rounded-2xl relative z-10">
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar size={18} className="text-primary" />
          <span className="text-sm font-semibold">Reporting Period:</span>
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={month}
            onChange={(val) => setMonth(Number(val))}
            options={monthsList.map((mName, idx) => ({ label: mName, value: idx + 1 }))}
            buttonClassName="px-3 py-2 text-sm text-zinc-200"
            className="min-w-[140px]"
          />
          <CustomSelect
            value={year}
            onChange={(val) => setYear(Number(val))}
            options={[year - 2, year - 1, year, year + 1].map(y => ({ label: String(y), value: y }))}
            buttonClassName="px-3 py-2 text-sm text-zinc-200"
            className="min-w-[100px]"
          />
        </div>
      </div>

      {/* Warnings panel */}
      {exceededBudgets.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl space-y-2 glass-panel-glow">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle size={18} className="text-red-400 animate-pulse" />
            Budget Exceeded Warning!
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1 text-zinc-300">
            {exceededBudgets.map(budget => {
              const over = Number(budget.spent_amount) - Number(budget.limit_amount);
              return (
                <li key={budget.id}>
                  You've spent <span className="text-red-400 font-bold">₹{Number(budget.spent_amount).toFixed(2)}</span> in{' '}
                  <span className="font-semibold text-zinc-100">{budget.category}</span>, exceeding your{' '}
                  <span className="font-semibold text-zinc-100">₹{Number(budget.limit_amount).toFixed(2)}</span> budget limit by{' '}
                  <span className="text-red-455 font-bold">₹{over.toFixed(2)}</span>.
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-zinc-400 text-sm">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Metrics grids */}
          <MetricsGrid 
            summary={summary} 
            remainingTotalBudget={remainingTotalBudget} 
            totalBudgetLimit={totalBudgetLimit} 
          />

          {/* Charts & Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area */}
            <ExpenseBreakdownCard 
              categoryTotals={categoryTotals} 
              COLORS={COLORS} 
            />

            {/* Quick Actions Panel */}
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-zinc-200 mb-1">Financial Navigator</h4>
                <p className="text-xxs text-zinc-550 mb-6">Quick shortcuts to manage finances</p>
              </div>

              <div className="space-y-3">
                <Link 
                  to="/transactions" 
                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <PlusCircle className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">Log Transaction</p>
                      <p className="text-xxs text-zinc-550">Record income or expenses</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  to="/budgets" 
                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <TrendingDown className="text-rose-450 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">Set Budgets</p>
                      <p className="text-xxs text-zinc-550">Review limits by category</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link 
                  to="/savings" 
                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-purple-400 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">Savings Target</p>
                      <p className="text-xxs text-zinc-550">Define and contribute to goals</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-xs text-zinc-450">“Beware of little expenses; a small leak will sink a great ship.”</p>
                <p className="text-xxs text-zinc-550 mt-1.5">— Benjamin Franklin</p>
              </div>
            </div>
          </div>

          {/* Recent transactions and Budget list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTransactionsCard recentTransactions={recentTransactions} />
            <ActiveBudgetsCard budgetStatus={budgetStatus} />
          </div>
        </>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal 
        showAddModal={showAddModal}
        formType={formType}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSaveTransaction}
        errorModal={errorModal}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        submitting={submitting}
      />
    </div>
  );
};

export default Dashboard;
