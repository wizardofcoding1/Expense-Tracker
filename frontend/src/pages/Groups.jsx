import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Check, 
  X
} from 'lucide-react';

// Import Modular Components
import GroupsList from '../components/groups/GroupsList';
import GroupHeader from '../components/groups/GroupHeader';
import BalancesTab from '../components/groups/BalancesTab';
import ExpensesLedgerTab from '../components/groups/ExpensesLedgerTab';
import LogExpenseTab from '../components/groups/LogExpenseTab';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import AddMemberModal from '../components/groups/AddMemberModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Groups = () => {
  const { user } = useAuth();
  
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Tabs State (expenses, balances, logExpense)
  const [activeTab, setActiveTab] = useState('balances');

  // Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Log Expense Form States
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [splitType, setSplitType] = useState('equal'); // equal, custom
  const [customSplits, setCustomSplits] = useState({}); // userId -> amount
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchGroups = async (selectFirst = false) => {
    setLoading(true);
    try {
      const res = await API.get('/groups');
      if (res.data.success) {
        setGroups(res.data.data);
        if (selectFirst && res.data.data.length > 0) {
          handleSelectGroup(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch groups.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGroup = async (group) => {
    setSelectedGroup(group);
    setDetailsLoading(true);
    setError('');
    setActiveTab('balances');
    setPaidBy(user?.id || '');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    try {
      // 1. Fetch group members.
      const balancesRes = await API.get(`/groups/${group.id}/balances`);
      if (balancesRes.data.success) {
        setBalances(balancesRes.data.data.balances || []);
        setSettlements(balancesRes.data.data.settlements || []);
        
        // Extract members list from balances
        const mbrList = balancesRes.data.data.balances.map(b => ({
          id: b.user_id,
          firstName: b.first_name,
          lastName: b.last_name,
          email: b.email
        }));
        setMembers(mbrList);

        // Prepopulate custom splits with 0
        const initialSplits = {};
        mbrList.forEach(m => {
          initialSplits[m.id] = '';
        });
        setCustomSplits(initialSplits);
      }

      // 2. Fetch group expenses
      const expensesRes = await API.get(`/groups/${group.id}/expenses`);
      if (expensesRes.data.success) {
        const sortedExp = expensesRes.data.data || [];
        sortedExp.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpenses(sortedExp);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch group details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(true);
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      setError('Group name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/groups', {
        name: newGroupName,
        description: newGroupDesc
      });
      if (res.data.success) {
        showNotification('Group created successfully.');
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupDesc('');
        fetchGroups();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create group.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (e, memberData) => {
    e.preventDefault();
    const { value } = memberData;
    if (!value.trim()) return;

    // Check if the user is already a member by name
    const alreadyMember = members.some(
      m => `${m.firstName} ${m.lastName}`.trim().toLowerCase() === value.trim().toLowerCase()
    );
    if (alreadyMember) {
      setError('Member is already in this group.');
      return;
    }

    try {
      const res = await API.post(`/groups/${selectedGroup.id}/members`, {
        name: value.trim()
      });
      if (res.data.success) {
        showNotification(`Member "${value.trim()}" added successfully.`);
        setShowAddMemberModal(false);
        handleSelectGroup(selectedGroup);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add member.');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    setDeleting(true);
    try {
      const res = await API.delete(`/groups/${selectedGroup.id}`);
      if (res.data.success) {
        showNotification('Group deleted successfully.');
        setSelectedGroup(null);
        setShowDeleteModal(false);
        fetchGroups(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete group.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogGroupExpense = async (e) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      setError('Amount must be positive.');
      return;
    }
    if (!expenseDesc.trim()) {
      setError('Description is required.');
      return;
    }

    let payloadSplits = [];
    if (splitType === 'custom') {
      let sumOfSplits = 0;
      payloadSplits = Object.keys(customSplits).map(userId => {
        const amt = Number(customSplits[userId] || 0);
        sumOfSplits += amt;
        return {
          userId: userId,
          owedAmount: amt
        };
      });

      if (Math.abs(sumOfSplits - Number(expenseAmount)) > 0.02) {
        setError(`Sum of splits (₹${sumOfSplits.toFixed(2)}) must equal total cost (₹${Number(expenseAmount).toFixed(2)}).`);
        return;
      }
    }

    try {
      const payload = {
        amount: Number(expenseAmount),
        description: expenseDesc,
        splitType,
        splits: splitType === 'custom' ? payloadSplits : undefined,
        date: expenseDate,
        paidBy: paidBy
      };

      const res = await API.post(`/groups/${selectedGroup.id}/expenses`, payload);
      if (res.data.success) {
        showNotification('Group expense logged successfully.');
        setExpenseAmount('');
        setExpenseDesc('');
        setSplitType('equal');
        setExpenseDate(new Date().toISOString().split('T')[0]);
        
        // Reset custom splits
        const resetSplits = {};
        members.forEach(m => {
          resetSplits[m.id] = '';
        });
        setCustomSplits(resetSplits);

        handleSelectGroup(selectedGroup);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to log expense.');
    }
  };

  const showNotification = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 m-0">Group Splitter</h2>
        <p className="text-xs text-zinc-550">Settle debts, split expenses, and share costs with friends</p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="cursor-pointer"><X size={16} /></button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex justify-between items-center animate-fade-in">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="cursor-pointer"><X size={16} /></button>
        </div>
      )}

      {/* Main Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Groups list */}
        <GroupsList 
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={handleSelectGroup}
          onCreateClick={() => setShowCreateModal(true)}
          loading={loading}
        />

        {/* Right Side: Group details workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedGroup ? (
            <div className="glass-panel p-6 rounded-3xl space-y-6 min-h-[400px] flex flex-col shadow-sm">
              {/* Group Workspace Header */}
              <GroupHeader 
                selectedGroup={selectedGroup}
                onAddMemberClick={() => setShowAddMemberModal(true)}
                onDeleteGroupClick={() => setShowDeleteModal(true)}
                deleting={deleting}
              />

              {/* Workspace Navigation tabs */}
              <div className="flex gap-2 border-b border-zinc-850 pb-3">
                <button
                  onClick={() => setActiveTab('balances')}
                  className={`
                    px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer
                    ${activeTab === 'balances' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-zinc-550 hover:text-zinc-300'
                    }
                  `}
                >
                  Balances & Settlement
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`
                    px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer
                    ${activeTab === 'expenses' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-zinc-555 hover:text-zinc-300'
                    }
                  `}
                >
                  Expenses Ledger
                </button>
                <button
                  onClick={() => setActiveTab('logExpense')}
                  className={`
                    px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer
                    ${activeTab === 'logExpense' 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-zinc-555 hover:text-zinc-300'
                    }
                  `}
                >
                  Log Shared Expense
                </button>
              </div>

              {/* Details Loading */}
              {detailsLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-zinc-550 text-xs">Accessing group ledger...</p>
                </div>
              ) : (
                <div className="flex-1">
                  {/* TAB 1: Balances & Settlement Plan */}
                  {activeTab === 'balances' && (
                    <BalancesTab 
                      balances={balances}
                      settlements={settlements}
                    />
                  )}

                  {/* TAB 2: Expenses Ledger */}
                  {activeTab === 'expenses' && (
                    <ExpensesLedgerTab 
                      expenses={expenses}
                    />
                  )}

                  {/* TAB 3: Log Shared Expense Form */}
                  {activeTab === 'logExpense' && (
                    <LogExpenseTab 
                      expenseAmount={expenseAmount}
                      setExpenseAmount={setExpenseAmount}
                      expenseDesc={expenseDesc}
                      setExpenseDesc={setExpenseDesc}
                      splitType={splitType}
                      setSplitType={setSplitType}
                      customSplits={customSplits}
                      setCustomSplits={setCustomSplits}
                      members={members}
                      onSubmit={handleLogGroupExpense}
                      expenseDate={expenseDate}
                      setExpenseDate={setExpenseDate}
                      paidBy={paidBy}
                      setPaidBy={setPaidBy}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-16 text-center rounded-3xl min-h-[400px] flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-primary border border-zinc-800">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-zinc-200">No Group Selected</h4>
                <p className="text-xs text-zinc-550">Choose a group on the sidebar to view details, splits, and bills</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        newGroupDesc={newGroupDesc}
        setNewGroupDesc={setNewGroupDesc}
        submitting={submitting}
      />

      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleAddMember}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteGroup}
        groupName={selectedGroup?.name || ''}
        deleting={deleting}
      />
    </div>
  );
};

export default Groups;
