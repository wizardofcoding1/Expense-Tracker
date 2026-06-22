import React from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

const GroupHeader = ({ selectedGroup, onAddMemberClick, onDeleteGroupClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/60 pb-5">
      <div>
        <h3 className="text-lg font-bold text-zinc-200 capitalize">{selectedGroup.name}</h3>
        <p className="text-xs text-zinc-550 mt-0.5">{selectedGroup.description || 'Shared Expense Group'}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAddMemberClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xxs font-semibold bg-zinc-900/40 hover:bg-zinc-800/40 text-zinc-200 border border-zinc-800 transition-all active:scale-[0.98] cursor-pointer"
        >
          <UserPlus size={14} /> Add Member
        </button>
        <button
          onClick={onDeleteGroupClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xxs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Trash2 size={14} /> Delete Group
        </button>
      </div>
    </div>
  );
};

export default GroupHeader;
