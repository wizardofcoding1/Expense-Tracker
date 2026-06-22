import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddMemberModal = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [memberName, setMemberName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, {
      type: 'name',
      value: memberName
    });
    setMemberName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-150">
      <div className="glass-panel p-6 rounded-3xl w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-zinc-200">Add Member</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
              Member's Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-primary/20 text-xs cursor-pointer"
          >
            Add Member to Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
