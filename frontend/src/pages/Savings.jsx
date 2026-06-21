import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { 
  Target, 
  Plus, 
  Check, 
  X
} from 'lucide-react';

// Import Modular Components
import SavingsGoalCard from '../components/savings/SavingsGoalCard';
import SavingsGoalModal from '../components/savings/SavingsGoalModal';
import ContributeModal from '../components/savings/ContributeModal';

const Savings = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  const [contributionAmount, setContributionAmount] = useState('');
  const [activeGoal, setActiveGoal] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await API.get('/savings-goals');
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch savings goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      targetAmount: '',
      currentAmount: '0',
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] // default 1 year from now
    });
    setShowAddModal(true);
  };

  const openEditModal = (goal) => {
    setFormData({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount || 0,
      deadline: new Date(goal.deadline).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const openContributeModal = (goal) => {
    setActiveGoal(goal);
    setContributionAmount('');
    setShowContributeModal(true);
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Goal name is required.');
      return;
    }
    if (Number(formData.targetAmount) <= 0) {
      setError('Target amount must be a positive number.');
      return;
    }

    try {
      if (showEditModal) {
        // Edit Goal
        const payload = {
          name: formData.name,
          targetAmount: Number(formData.targetAmount),
          currentAmount: Number(formData.currentAmount),
          deadline: formData.deadline
        };
        const res = await API.put(`/savings-goals/${formData.id}`, payload);
        if (res.data.success) {
          showNotification('Savings goal updated successfully.');
          setShowEditModal(false);
        }
      } else {
        // Add Goal
        const payload = {
          name: formData.name,
          targetAmount: Number(formData.targetAmount),
          deadline: formData.deadline
        };
        const res = await API.post('/savings-goals', payload);
        if (res.data.success) {
          showNotification('Savings goal created successfully.');
          setShowAddModal(false);
        }
      }
      fetchGoals();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save goal.');
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!contributionAmount || Number(contributionAmount) <= 0) {
      setError('Please enter a positive contribution amount.');
      return;
    }

    try {
      const res = await API.put(`/savings-goals/${activeGoal.id}/contribute`, {
        amount: Number(contributionAmount)
      });
      if (res.data.success) {
        showNotification(`Deposited ₹${Number(contributionAmount).toFixed(2)} to ${activeGoal.name}.`);
        setShowContributeModal(false);
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to record contribution.');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this savings goal?')) return;
    try {
      const res = await API.delete(`/savings-goals/${id}`);
      if (res.data.success) {
        showNotification('Savings goal deleted successfully.');
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete goal.');
    }
  };

  const showNotification = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 m-0">Savings Vault</h2>
          <p className="text-xs text-zinc-550">Track targets and accumulate wealth for future goals</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:bg-blue-550 text-white transition-all shadow-md shadow-primary/20 active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} /> Create Goal
        </button>
      </div>

      {/* Action Statuses */}
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

      {/* Goals Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-zinc-550 text-xs">Accessing vault...</p>
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map(goal => (
            <SavingsGoalCard 
              key={goal.id}
              goal={goal}
              onEdit={openEditModal}
              onDelete={handleDeleteGoal}
              onContribute={openContributeModal}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 text-center rounded-3xl max-w-md mx-auto space-y-4 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-primary mx-auto border border-zinc-800">
            <Target size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-zinc-200">No Savings Goals Set</h4>
            <p className="text-xs text-zinc-550">Plan ahead for vacations, emergencies, or major investments</p>
          </div>
          <button 
            onClick={openAddModal} 
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:bg-blue-550 text-white transition-all shadow-md shadow-primary/20 active:scale-[0.98] cursor-pointer"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <SavingsGoalModal 
        isOpen={showAddModal || showEditModal}
        isEdit={showEditModal}
        formData={formData}
        setFormData={setFormData}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); }}
        onSubmit={handleSaveGoal}
      />

      {/* Contribute Funds Modal */}
      <ContributeModal 
        isOpen={showContributeModal}
        activeGoal={activeGoal}
        contributionAmount={contributionAmount}
        setContributionAmount={setContributionAmount}
        onClose={() => setShowContributeModal(false)}
        onSubmit={handleContribute}
      />
    </div>
  );
};

export default Savings;
