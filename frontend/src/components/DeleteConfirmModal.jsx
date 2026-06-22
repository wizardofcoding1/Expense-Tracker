import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  deleting = false
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-150">
      <div className="glass-panel p-6 rounded-3xl w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle size={20} />
            <h3 className="text-lg font-bold text-zinc-200">{title}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-550 hover:text-white cursor-pointer" disabled={deleting}>
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 bg-zinc-900/40 hover:bg-zinc-800/40 border border-zinc-800 text-zinc-300 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-rose-455 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 active:scale-[0.98] shadow-md shadow-red-950/20 cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmModal;
