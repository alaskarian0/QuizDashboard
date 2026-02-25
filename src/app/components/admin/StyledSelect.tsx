import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface StyledSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  isDark?: boolean;
  disabled?: boolean;
}

export function StyledSelect({
  value,
  onChange,
  options,
  className = '',
  isDark = false,
  disabled = false,
}: StyledSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all text-right font-cairo-semibold
          flex items-center justify-between gap-2
          ${isDark
            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white focus:border-emerald-500'
            : 'bg-white border-gray-200 text-gray-900 focus:border-[#0AA1DD]'}
          ${isOpen ? (isDark ? 'border-emerald-500' : 'border-[#0AA1DD]') : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span>{selectedOption?.label || options[0]?.label}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </button>

      {isOpen && !disabled && (
        <div className={`
          absolute z-50 w-full mt-1 rounded-xl border-2 shadow-lg overflow-hidden custom-scrollbar
          ${isDark
            ? 'bg-[#0D1B1A] border-[#2a5a4d] text-white'
            : 'bg-white border-gray-200 text-gray-900'
          }
        `} style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-right transition-all hover:opacity-80 font-cairo-semibold
                ${option.value === value
                  ? isDark
                    ? 'bg-emerald-600/30 text-emerald-400'
                    : 'bg-[#0AA1DD]/30 text-[#0AA1DD]'
                  : isDark
                    ? 'hover:bg-[#1A2C2B]'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
