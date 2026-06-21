import React from 'react';
import { Plus } from 'lucide-react';

const GroupsList = ({
  groups,
  selectedGroup,
  onSelectGroup,
  onCreateClick,
  loading
}) => {
  return (
    <div className="glass-panel p-5 rounded-3xl space-y-4 h-fit shadow-sm">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-zinc-200">My Groups</h4>
        <button 
          onClick={onCreateClick}
          className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : groups.length > 0 ? (
        <div className="flex flex-col gap-2">
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => onSelectGroup(g)}
              className={`
                w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer
                ${selectedGroup?.id === g.id 
                  ? 'bg-primary/10 border-primary/40 text-zinc-100' 
                  : 'bg-zinc-900/10 border-zinc-850 hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              <p className="font-bold text-xs capitalize truncate">{g.name}</p>
              <p className="text-[10px] text-zinc-550 truncate mt-0.5">{g.description || 'No Description'}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-550 text-xs leading-normal">
          You are not a member of any expense groups. Click plus to create one!
        </div>
      )}
    </div>
  );
};

export default GroupsList;
