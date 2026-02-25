import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { useState, useRef, useEffect } from 'react';

// Custom inner select for pagination
function PaginationSelect({ value, onChange, options, isDark }: {
  value: number;
  onChange: (value: number) => void;
  options: number[];
  isDark: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

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
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 rounded-lg border text-sm min-w-[70px] text-right
          flex items-center justify-between gap-2
          ${isDark
            ? 'bg-[#0D1B1A] border-gray-700 text-white focus:border-emerald-500'
            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#0AA1DD]'
          }
        `}
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden custom-scrollbar
          ${isDark
            ? 'bg-[#0D1B1A] border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-900'
          }
        `}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`
                w-full px-3 py-2 text-right transition-all hover:opacity-80 font-cairo-semibold
                ${option === value
                  ? isDark
                    ? 'bg-emerald-600/30 text-emerald-400'
                    : 'bg-[#0AA1DD]/30 text-[#0AA1DD]'
                  : isDark
                    ? 'hover:bg-[#1A2C2B]'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  isDark?: boolean;
}

export function PaginationWithControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isDark = false,
}: PaginationProps) {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-xl ${
      isDark ? 'bg-[#1A2C2B]' : 'bg-white shadow-md'
    }`}>
      {/* Items per page selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <span className={`text-sm whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            عرض
          </span>
          <PaginationSelect
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            options={[10, 20, 50, 100]}
            isDark={isDark}
          />
          <span className={`text-sm whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            لكل صفحة
          </span>
        </div>
      )}

      {/* Page info */}
      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {totalItems > 0 ? (
          <span>
            عرض {startItem} إلى {endItem} من أصل {totalItems}
          </span>
        ) : (
          <span>لا توجد عناصر</span>
        )}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className={cn(
            "p-2 rounded-lg transition-all flex items-center gap-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isDark
              ? "hover:bg-emerald-600/20 text-emerald-500 disabled:hover:bg-transparent disabled:text-gray-600"
              : "hover:bg-[#0AA1DD]/10 text-[#0AA1DD] disabled:hover:bg-transparent disabled:text-gray-400"
          )}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="w-5 h-5" />
          <span className="hidden sm:inline">السابق</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={typeof page !== 'number'}
              className={cn(
                "min-w-[40px] h-10 rounded-lg font-medium transition-all text-sm",
                typeof page !== 'number'
                  ? "cursor-default pointer-events-none"
                  : currentPage === page
                  ? isDark
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-[#0AA1DD] text-white shadow-lg shadow-[#0AA1DD]/30"
                  : isDark
                  ? "bg-[#0D1B1A] text-gray-300 hover:bg-emerald-600/20"
                  : "bg-gray-100 text-gray-700 hover:bg-[#0AA1DD]/10"
              )}
            >
              {typeof page === 'string' ? (
                <MoreHorizontal className="w-4 h-4 mx-auto" />
              ) : (
                page
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={cn(
            "p-2 rounded-lg transition-all flex items-center gap-1",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isDark
              ? "hover:bg-emerald-600/20 text-emerald-500 disabled:hover:bg-transparent disabled:text-gray-600"
              : "hover:bg-[#0AA1DD]/10 text-[#0AA1DD] disabled:hover:bg-transparent disabled:text-gray-400"
          )}
          aria-label="الصفحة التالية"
        >
          <span className="hidden sm:inline">التالي</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Re-export the UI components for convenience
export { Pagination } from '../ui/pagination';
export const PaginationControls = PaginationWithControls;
