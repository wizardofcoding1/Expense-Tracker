import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  X
} from 'lucide-react';

// Import Modular Components
import LedgerFilters from '../components/transactions/LedgerFilters';
import TransactionsTable from '../components/transactions/TransactionsTable';
import TransactionFormModal from '../components/transactions/TransactionFormModal';

const Transactions = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [combined, setCombined] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search and Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, income, expense
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [selectedTag, setSelectedTag] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const tagsSet = new Set();
    combined.forEach(item => {
      const desc = item.description || '';
      const hashtags = desc.match(/#[a-zA-Z0-9_-]+/g) || [];
      hashtags.forEach(tag => tagsSet.add(tag));
    });
    setAvailableTags(Array.from(tagsSet));
  }, [combined]);

  // Modals States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form States (for Single Add/Edit)
  const [formType, setFormType] = useState('expense'); // expense, income
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];
  const expenseCategories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Entertainment', 'Travel', 'Health', 'Other'];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [expensesRes, incomesRes] = await Promise.all([
        API.get('/expenses'),
        API.get('/incomes')
      ]);

      let expData = [];
      let incData = [];

      if (expensesRes.data.success) {
        expData = expensesRes.data.data.map(item => ({ ...item, type: 'expense' }));
        setExpenses(expData);
      }
      if (incomesRes.data.success) {
        incData = incomesRes.data.data.map(item => ({ 
          ...item, 
          type: 'income',
          category: item.source // Map 'source' from DB to 'category' for local uniformity
        }));
        setIncomes(incData);
      }

      const combinedData = [...expData, ...incData];
      // Sort desc by date
      combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCombined(combinedData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    const handleOfflineSyncCompleted = () => {
      fetchTransactions();
    };

    window.addEventListener('offline-sync-completed', handleOfflineSyncCompleted);
    return () => {
      window.removeEventListener('offline-sync-completed', handleOfflineSyncCompleted);
    };
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...combined];

    // 1. Search Filter
    if (search.trim() !== '') {
      result = result.filter(item => 
        (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. Type Filter
    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    // 4. Date Range Filter
    if (startDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate >= startDate;
      });
    }
    if (endDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate <= endDate;
      });
    }

    // 5. Amount Range Filter
    if (minAmount !== '') {
      result = result.filter(item => Number(item.amount) >= Number(minAmount));
    }
    if (maxAmount !== '') {
      result = result.filter(item => Number(item.amount) <= Number(maxAmount));
    }

    // 6. Hashtag Filter
    if (selectedTag !== 'all') {
      result = result.filter(item => 
        (item.description || '').toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    // 7. Sort Logic
    if (sortOrder === 'date-desc') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'date-asc') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'amount-desc') {
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortOrder === 'amount-asc') {
      result.sort((a, b) => Number(a.amount) - Number(b.amount));
    } else if (sortOrder === 'desc-asc') {
      result.sort((a, b) => (a.description || '').localeCompare(b.description || ''));
    } else if (sortOrder === 'desc-desc') {
      result.sort((a, b) => (b.description || '').localeCompare(a.description || ''));
    }

    setFiltered(result);
  }, [combined, search, typeFilter, categoryFilter, startDate, endDate, minAmount, maxAmount, selectedTag, sortOrder]);

  // Handle open Add Modal
  const openAddModal = (type) => {
    setFormType(type);
    setFormData({
      id: '',
      amount: '',
      category: type === 'income' ? 'Salary' : 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  // Handle open Edit Modal
  const openEditModal = (item) => {
    setFormType(item.type);
    setFormData({
      id: item.id,
      amount: item.amount,
      category: item.category,
      description: item.description || '',
      date: new Date(item.date).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  // Save Transaction (Add/Edit)
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a positive amount.');
      return;
    }

    // Prevent logging future-dated entries
    if (new Date(formData.date) > new Date()) {
      setError('Transaction date cannot be in the future.');
      return;
    }

    // Map 'category' field on frontend to 'source' on backend for incomes
    const payload = formType === 'income' ? {
      amount: Number(formData.amount),
      source: formData.category, // Map category -> source
      description: formData.description,
      date: formData.date
    } : {
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date
    };

    try {
      if (showEditModal) {
        // Edit Transaction
        const endpoint = formType === 'expense' ? `/expenses/${formData.id}` : `/incomes/${formData.id}`;
        const res = await API.put(endpoint, payload);
        if (res.data.success) {
          showNotification('Transaction updated successfully.');
          setShowEditModal(false);
        }
      } else {
        // Add Transaction
        const endpoint = formType === 'expense' ? '/expenses' : '/incomes';
        const res = await API.post(endpoint, payload);
        if (res.data.success) {
          showNotification('Transaction added successfully.');
          setShowAddModal(false);
        }
      }
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save transaction.');
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const endpoint = type === 'expense' ? `/expenses/${id}` : `/incomes/${id}`;
      const res = await API.delete(endpoint);
      if (res.data.success) {
        showNotification('Transaction deleted successfully.');
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction.');
    }
  };

  const showNotification = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearch('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setMinAmount('');
    setMaxAmount('');
    setSelectedTag('all');
    setSortOrder('date-desc');
  };

  // Unique categories for filtering
  const allCategories = Array.from(new Set(combined.map(item => item.category?.toLowerCase())));

  return (
    <div className="space-y-6">
      {/* Title & Top buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 m-0">Ledger Sheet</h2>
          <p className="text-xs text-zinc-550">Review and configure details of all logged transactions</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => openAddModal('expense')} 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-455 text-white transition-all shadow-md shadow-rose-950/20 active:scale-[0.98] cursor-pointer"
          >
            <TrendingDown size={14} /> Add Expense
          </button>
          <button 
            onClick={() => openAddModal('income')} 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-455 text-white transition-all shadow-md shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
          >
            <TrendingUp size={14} /> Add Income
          </button>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="cursor-pointer"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex justify-between items-center animate-fade-in">
          <span className="flex items-center gap-2"><Check size={18} /> {success}</span>
          <button onClick={() => setSuccess('')} className="cursor-pointer"><X size={16} /></button>
        </div>
      )}

      {/* Filters Area */}
      <LedgerFilters 
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
        maxAmount={maxAmount}
        setMaxAmount={setMaxAmount}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        availableTags={availableTags}
        allCategories={allCategories}
        onReset={resetFilters}
      />

      {/* Table Ledger Panel */}
      <TransactionsTable 
        loading={loading}
        filtered={filtered}
        onEdit={openEditModal}
        onDelete={handleDeleteTransaction}
      />

      {/* Add / Edit Modal */}
      <TransactionFormModal 
        isOpen={showAddModal || showEditModal}
        isEdit={showEditModal}
        formType={formType}
        formData={formData}
        setFormData={setFormData}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); }}
        onSubmit={handleSaveTransaction}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
      />

    </div>
  );
};

export default Transactions;
