import React from 'react';
import { X } from 'lucide-react';

const CreateGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
  newGroupName,
  setNewGroupName,
  newGroupDesc,
  setNewGroupDesc
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-150">
      <div className="glass-panel p-6 rounded-3xl w-full max-w-md animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-zinc-200">Create Expense Group</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ski Trip 2026"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Group Description
            </label>
            <input
              type="text"
              placeholder="e.g. Shared costs for our winter cabin trip"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-primary/20 cursor-pointer"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
