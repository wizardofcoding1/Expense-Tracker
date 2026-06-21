import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { 
  CheckCircle, 
  X
} from 'lucide-react';

// Import Modular Components
import ConfigurePeriodCard from '../components/budgets/ConfigurePeriodCard';
import AllocatedSummaryCard from '../components/budgets/AllocatedSummaryCard';
import LimitsProgressList from '../components/budgets/LimitsProgressList';
import LimitSetupCard from '../components/budgets/LimitSetupCard';
import PerformanceBoardCard from '../components/budgets/PerformanceBoardCard';

const Budgets = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1); // 1-12
  const [year, setYear] = useState(currentDate.getFullYear());

  const [budgetStatus, setBudgetStatus] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formCategory, setFormCategory] = useState('Food');
  const [limitAmount, setLimitAmount] = useState('');

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const categories = [
    'Food', 'Rent', 'Utilities', 'Shopping', 'Entertainment', 'Travel', 'Health', 'Other'
  ];

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch budget status
      const statusRes = await API.get(`/budgets/status?month=${month}&year=${year}`);
      if (statusRes.data.success) {
        setBudgetStatus(statusRes.data.data);
      }

      // 2. Fetch budget comparison
      const compareRes = await API.get(`/budgets/compare?spentMonth=${month}&spentYear=${year}`);
      if (compareRes.data.success) {
        setCompareData(compareRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch budget details.');
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

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!limitAmount || Number(limitAmount) <= 0) {
      setError('Please enter a positive limit amount.');
      return;
    }

    try {
      const payload = {
        category: formCategory,
        limitAmount: Number(limitAmount),
        month,
        year
      };

      const res = await API.post('/budgets', payload);
      if (res.data.success) {
        setSuccess(`Budget for ${formCategory} set to ₹${Number(limitAmount).toFixed(2)}.`);
        setLimitAmount('');
        fetchData();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to configure budget.');
    }
  };

  const totalBudgetLimit = budgetStatus.reduce((sum, b) => sum + Number(b.limit_amount), 0);
  const totalBudgetSpent = budgetStatus.reduce((sum, b) => sum + Number(b.spent_amount), 0);
  const totalBudgetRemaining = totalBudgetLimit - totalBudgetSpent;
  const totalPct = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 m-0">Category Limits</h2>
        <p className="text-xs text-zinc-550">Set and review monthly spending limits to prevent budget overflows</p>
      </div>

      {/* Date Select & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ConfigurePeriodCard 
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          monthsList={monthsList}
        />

        <AllocatedSummaryCard 
          totalBudgetLimit={totalBudgetLimit}
          totalBudgetSpent={totalBudgetSpent}
          totalBudgetRemaining={totalBudgetRemaining}
          totalPct={totalPct}
        />
      </div>

      {/* Status banners */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="cursor-pointer"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex justify-between items-center animate-fade-in">
          <span className="flex items-center gap-2"><CheckCircle size={18} /> {success}</span>
          <button onClick={() => setSuccess('')} className="cursor-pointer"><X size={16} /></button>
        </div>
      )}

      {/* Main split: Left side List, Right side form & comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LimitsProgressList 
          loading={loading}
          budgetStatus={budgetStatus}
        />

        {/* Set Budget Form & Comparison Panel */}
        <div className="space-y-6">
          <LimitSetupCard 
            formCategory={formCategory}
            setFormCategory={setFormCategory}
            limitAmount={limitAmount}
            setLimitAmount={setLimitAmount}
            categories={categories}
            onSubmit={handleSetBudget}
          />

          <PerformanceBoardCard 
            compareData={compareData}
          />
        </div>
      </div>
    </div>
  );
};

export default Budgets;
