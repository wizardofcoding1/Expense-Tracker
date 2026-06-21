import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { 
  XCircle,
  CheckCircle,
  BarChart2,
  PieChart as PieIcon,
  Layers,
  Calendar
} from 'lucide-react';

// Modular Subcomponents
import OverviewTab from '../components/analytics/OverviewTab';
import MonthCompareTab from '../components/analytics/MonthCompareTab';
import YearlyCompareTab from '../components/analytics/YearlyCompareTab';
import InsightsTab from '../components/analytics/InsightsTab';

const Analytics = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [combined, setCombined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dashboard Sub-navigation Tabs
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tab 1: Overview state
  const [monthlyCashflow, setMonthlyCashflow] = useState([]);
  const [categoryTrend, setCategoryTrend] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [overviewChartType, setOverviewChartType] = useState('bar');
  
  // Date filters for CSV Export (Overview tab)
  const currentDate = new Date();
  const [exportMonth, setExportMonth] = useState(currentDate.getMonth() + 1);
  const [exportYear, setExportYear] = useState(currentDate.getFullYear());

  // Tab 2: Month Compare state
  const [compareMode, setCompareMode] = useState('2-month');
  const [compareType, setCompareType] = useState('expense');
  const [monthA, setMonthA] = useState('');
  const [monthB, setMonthB] = useState('');
  const [monthC, setMonthC] = useState('');
  const [compareChartType, setCompareChartType] = useState('bar');

  // Tab 3: Yearly Compare state
  const [yearA, setYearA] = useState(currentDate.getFullYear());
  const [yearB, setYearB] = useState(currentDate.getFullYear() - 1);
  const [yearlyType, setYearlyType] = useState('expense');
  const [yearlyChartType, setYearlyChartType] = useState('line');

  // Tab 4: Insights state
  const [insightPeriod, setInsightPeriod] = useState('');

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const expenseCategories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Entertainment', 'Travel', 'Health', 'Other'];
  const incomeSources = ['Salary', 'Business', 'Freelance', 'Investment', 'Gifts', 'Other'];

  const COLORS = [
    '#2563eb', // Blue
    '#7c3aed', // Purple
    '#059669', // Emerald
    '#db2777', // Pink
    '#f97316', // Orange
    '#0891b2', // Cyan
    '#eab308', // Yellow
    '#e11d48'  // Rose
  ];

  const tooltipStyle = {
    background: '#fff', 
    border: '1px solid rgba(148, 163, 184, 0.2)', 
    borderRadius: '8px', 
    color: '#0f172a',
    fontSize: '11px'
  };

  const hasCompareConflict = compareMode === '2-month' 
    ? (monthA === monthB)
    : (monthA === monthB || monthA === monthC || monthB === monthC);

  const hasYearlyConflict = yearA === yearB;

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [expensesRes, incomesRes] = await Promise.all([
        API.get('/expenses'),
        API.get('/incomes')
      ]);

      let expData = [];
      let incData = [];

      if (expensesRes.data.success) {
        expData = expensesRes.data.data.map(e => ({ ...e, type: 'expense' }));
        setExpenses(expData);
      }
      if (incomesRes.data.success) {
        incData = incomesRes.data.data.map(i => ({ 
          ...i, 
          type: 'income',
          category: i.source || 'Other'
        }));
        setIncomes(incData);
      }

      const combinedData = [...expData, ...incData];
      setCombined(combinedData);

      const cashflow = calculateMonthlyCashflow(incData, expData);
      setMonthlyCashflow(cashflow);

      const trend = calculateCategoryTrend(expData, selectedCategory);
      setCategoryTrend(trend);

      const dynamicMonths = getAvailablePeriods(combinedData);
      if (dynamicMonths.length > 0) {
        setMonthA(dynamicMonths[0].value);
        setInsightPeriod(dynamicMonths[0].value);
        if (dynamicMonths.length > 1) {
          setMonthB(dynamicMonths[1].value);
        } else {
          setMonthB(dynamicMonths[0].value);
        }
        if (dynamicMonths.length > 2) {
          setMonthC(dynamicMonths[2].value);
        } else {
          setMonthC(dynamicMonths[0].value);
        }
      } else {
        const fallback = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
        setMonthA(fallback);
        setMonthB(fallback);
        setMonthC(fallback);
        setInsightPeriod(fallback);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to fetch transaction logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      const trend = calculateCategoryTrend(expenses, selectedCategory);
      setCategoryTrend(trend);
    }
  }, [selectedCategory, expenses]);

  const getAvailablePeriods = (data = combined) => {
    const periodsSet = new Set();
    data.forEach(item => {
      if (item.date) {
        const d = new Date(item.date);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        periodsSet.add(`${y}-${m.toString().padStart(2, '0')}`);
      }
    });

    if (periodsSet.size === 0) {
      const now = new Date();
      for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periodsSet.add(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`);
      }
    }

    return Array.from(periodsSet).sort().reverse().map(str => {
      const [y, m] = str.split('-');
      return {
        value: str,
        label: `${monthsList[parseInt(m) - 1]} ${y}`
      };
    });
  };

  const calculateMonthlyCashflow = (inc, exp) => {
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mNum = d.getMonth();
      const yNum = d.getFullYear();
      const label = `${monthsList[mNum].slice(0, 3)} ${yNum.toString().slice(-2)}`;
      
      const totalInc = inc
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === mNum && itemDate.getFullYear() === yNum;
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const totalExp = exp
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === mNum && itemDate.getFullYear() === yNum;
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);

      data.push({
        name: label,
        Income: Number(totalInc.toFixed(0)),
        Expense: Number(totalExp.toFixed(0))
      });
    }
    return data;
  };

  const calculateCategoryTrend = (exp, category) => {
    const data = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mNum = d.getMonth();
      const yNum = d.getFullYear();
      const label = `${monthsList[mNum].slice(0, 3)} ${yNum.toString().slice(-2)}`;

      const total = exp
        .filter(item => {
          const itemDate = new Date(item.date);
          return itemDate.getMonth() === mNum && 
                 itemDate.getFullYear() === yNum && 
                 item.category?.toLowerCase() === category.toLowerCase();
        })
        .reduce((sum, item) => sum + Number(item.amount), 0);

      data.push({
        name: label,
        Spent: Number(total.toFixed(0))
      });
    }
    return data;
  };

  const handleExportCSV = () => {
    try {
      const filtered = combined.filter(item => {
        const itemDate = new Date(item.date);
        return (itemDate.getMonth() + 1) === Number(exportMonth) && itemDate.getFullYear() === Number(exportYear);
      });

      if (filtered.length === 0) {
        setError('No transactions found for the selected export period.');
        setTimeout(() => setError(''), 4000);
        return;
      }

      const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (INR)'];
      const rows = filtered.map(item => [
        new Date(item.date).toLocaleDateString(),
        `"${(item.description || '').replace(/"/g, '""')}"`,
        item.category,
        item.type.toUpperCase(),
        Number(item.amount).toFixed(2)
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `FINTRACK_Ledger_${monthsList[exportMonth - 1]}_${exportYear}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess('CSV ledger file downloaded successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setError('Failed to export CSV file.');
    }
  };

  const getComparisonData = () => {
    const list = compareType === 'expense' ? expenses : incomes;
    const categories = compareType === 'expense' ? expenseCategories : incomeSources;

    return categories.map(cat => {
      const valA = list.filter(item => {
        if (!item.date) return false;
        const d = new Date(item.date);
        const code = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        return code === monthA && item.category?.toLowerCase() === cat.toLowerCase();
      }).reduce((sum, i) => sum + Number(i.amount), 0);

      const valB = list.filter(item => {
        if (!item.date) return false;
        const d = new Date(item.date);
        const code = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        return code === monthB && item.category?.toLowerCase() === cat.toLowerCase();
      }).reduce((sum, i) => sum + Number(i.amount), 0);

      const valC = list.filter(item => {
        if (!item.date) return false;
        const d = new Date(item.date);
        const code = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        return code === monthC && item.category?.toLowerCase() === cat.toLowerCase();
      }).reduce((sum, i) => sum + Number(i.amount), 0);

      const diff = valA - valB;
      const pct = valB > 0 ? (diff / valB) * 100 : (valA > 0 ? 100 : 0);

      return {
        category: cat,
        MonthA: Number(valA.toFixed(0)),
        MonthB: Number(valB.toFixed(0)),
        MonthC: Number(valC.toFixed(0)),
        diff: Number(diff.toFixed(0)),
        pct: Number(pct.toFixed(1))
      };
    });
  };

  const getYearlyComparisonData = () => {
    const list = yearlyType === 'expense' ? expenses : incomes;
    return monthsList.map((mName, idx) => {
      const amtA = list.filter(item => {
        if (!item.date) return false;
        const d = new Date(item.date);
        return d.getFullYear() === yearA && d.getMonth() === idx;
      }).reduce((sum, i) => sum + Number(i.amount), 0);

      const amtB = list.filter(item => {
        if (!item.date) return false;
        const d = new Date(item.date);
        return d.getFullYear() === yearB && d.getMonth() === idx;
      }).reduce((sum, i) => sum + Number(i.amount), 0);

      return {
        name: mName.slice(0, 3),
        [yearA]: Number(amtA.toFixed(0)),
        [yearB]: Number(amtB.toFixed(0))
      };
    });
  };

  const getInsightsData = () => {
    const list = expenses.concat(incomes);
    const filtered = list.filter(item => {
      if (!item.date) return false;
      const d = new Date(item.date);
      const code = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      return code === insightPeriod;
    });

    const monthIncome = filtered.filter(i => i.type === 'income').reduce((sum, i) => sum + Number(i.amount), 0);
    const monthExpense = filtered.filter(i => i.type === 'expense').reduce((sum, i) => sum + Number(i.amount), 0);
    const netSavings = monthIncome - monthExpense;
    const savingsRate = monthIncome > 0 ? (netSavings / monthIncome) * 100 : 0;

    const expFiltered = filtered.filter(i => i.type === 'expense');
    const categoriesMap = {};
    expenseCategories.forEach(c => { categoriesMap[c] = 0; });
    
    expFiltered.forEach(item => {
      const cat = item.category || 'Other';
      categoriesMap[cat] = (categoriesMap[cat] || 0) + Number(item.amount);
    });

    const doughnutData = Object.keys(categoriesMap).map(cat => ({
      name: cat,
      value: Number(categoriesMap[cat].toFixed(0))
    })).filter(item => item.value > 0);

    let highestCat = 'N/A';
    let highestAmt = 0;
    doughnutData.forEach(item => {
      if (item.value > highestAmt) {
        highestAmt = item.value;
        highestCat = item.name;
      }
    });
    const highestPct = monthExpense > 0 ? (highestAmt / monthExpense) * 100 : 0;

    const [yStr, mStr] = insightPeriod.split('-');
    const yearNum = parseInt(yStr) || currentDate.getFullYear();
    const monthNum = parseInt(mStr) || (currentDate.getMonth() + 1);
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    const dailyBurnRate = monthExpense / daysInMonth;

    return {
      monthIncome,
      monthExpense,
      netSavings,
      savingsRate: Number(savingsRate.toFixed(1)),
      highestCat,
      highestAmt,
      highestPct: Number(highestPct.toFixed(1)),
      dailyBurnRate: Number(dailyBurnRate.toFixed(0)),
      transactionCount: filtered.length,
      doughnutData
    };
  };

  const dynamicPeriods = getAvailablePeriods();
  const comparisonData = getComparisonData();
  const yearlyCompData = getYearlyComparisonData();
  const insights = getInsightsData();

  const getPeriodLabel = (code) => {
    const found = dynamicPeriods.find(p => p.value === code);
    return found ? found.label : code;
  };

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 m-0">Advanced Financial Analytics</h2>
          <p className="text-xs text-zinc-550 mt-1">Deconstruct and compare financial trends, cashflows, and target metrics</p>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl self-start md:self-auto shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'overview' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart2 size={13} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('compare-months')}
            className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'compare-months' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers size={13} /> Month Compare
          </button>
          <button 
            onClick={() => setActiveTab('compare-years')}
            className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'compare-years' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar size={13} /> Yearly Compare
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'insights' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PieIcon size={13} /> Insights & KPIs
          </button>
        </div>
      </div>

      {/* Global Message Banners */}
      {(error || success) && (
        <div className="transition-all">
          {error && (
            <div className="p-4 rounded-xl bg-red-50/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <XCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle size={16} /> {success}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-zinc-500 text-xs">Compiling financial intelligence...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <OverviewTab 
              monthlyCashflow={monthlyCashflow}
              categoryTrend={categoryTrend}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              expenseCategories={expenseCategories}
              monthsList={monthsList}
              exportMonth={exportMonth}
              setExportMonth={setExportMonth}
              exportYear={exportYear}
              setExportYear={setExportYear}
              handleExportCSV={handleExportCSV}
              overviewChartType={overviewChartType}
              setOverviewChartType={setOverviewChartType}
              tooltipStyle={tooltipStyle}
            />
          )}

          {activeTab === 'compare-months' && (
            <MonthCompareTab 
              compareMode={compareMode}
              setCompareMode={setCompareMode}
              compareType={compareType}
              setCompareType={setCompareType}
              monthA={monthA}
              setMonthA={setMonthA}
              monthB={monthB}
              setMonthB={setMonthB}
              monthC={monthC}
              setMonthC={setMonthC}
              compareChartType={compareChartType}
              setCompareChartType={setCompareChartType}
              dynamicPeriods={dynamicPeriods}
              getPeriodLabel={getPeriodLabel}
              hasCompareConflict={hasCompareConflict}
              comparisonData={comparisonData}
              tooltipStyle={tooltipStyle}
            />
          )}

          {activeTab === 'compare-years' && (
            <YearlyCompareTab 
              yearA={yearA}
              setYearA={setYearA}
              yearB={yearB}
              setYearB={setYearB}
              yearlyType={yearlyType}
              setYearlyType={setYearlyType}
              yearlyChartType={yearlyChartType}
              setYearlyChartType={setYearlyChartType}
              yearlyCompData={yearlyCompData}
              hasYearlyConflict={hasYearlyConflict}
              currentDate={currentDate}
              tooltipStyle={tooltipStyle}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsTab 
              insightPeriod={insightPeriod}
              setInsightPeriod={setInsightPeriod}
              dynamicPeriods={dynamicPeriods}
              getPeriodLabel={getPeriodLabel}
              insights={insights}
              COLORS={COLORS}
              tooltipStyle={tooltipStyle}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
