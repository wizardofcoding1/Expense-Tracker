import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  className = "", 
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  activeOptionClassName = ""
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find the selected option or default to the value
  const selectedOption = options.find(opt => opt.value === value) || { label: String(value), value };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${isOpen ? 'z-30' : 'z-0'} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-xl text-sm flex justify-between items-center cursor-pointer transition-all ${
          buttonClassName || 'glass-input text-zinc-200'
        }`}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown 
          size={16} 
          className={`text-zinc-500 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className={`absolute left-0 right-0 mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl shadow-lg animate-in fade-in slide-in-from-top-1 duration-100 border bg-white/95 backdrop-blur-md ${
          dropdownClassName || 'glass-panel border-zinc-800/20'
        }`}>
          <div className="py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer block ${
                  opt.value === value 
                    ? (activeOptionClassName || 'bg-primary/10 text-primary font-semibold') 
                    : (optionClassName || 'text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100/70')
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
