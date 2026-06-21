import React from 'react';
import { UserPlus } from 'lucide-react';

const GroupHeader = ({ selectedGroup, onAddMemberClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/60 pb-5">
      <div>
        <h3 className="text-lg font-bold text-zinc-200 capitalize">{selectedGroup.name}</h3>
        <p className="text-xs text-zinc-550 mt-0.5">{selectedGroup.description || 'Shared Expense Group'}</p>
      </div>
      <button
        onClick={onAddMemberClick}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xxs font-semibold bg-zinc-900/40 hover:bg-zinc-800/40 text-zinc-200 border border-zinc-800 transition-all self-start sm:self-auto active:scale-[0.98] cursor-pointer"
      >
        <UserPlus size={14} /> Add Member
      </button>
    </div>
  );
};

export default GroupHeader;
