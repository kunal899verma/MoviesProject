'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { CustomInput } from '@/components/ui/CustomInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { debounce } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (search: string) => void;
  onYearFilter: (year: number | undefined) => void;
  currentSearch: string;
  currentYear?: number;
}

export function SearchBar({ onSearch, onYearFilter, currentSearch, currentYear }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isYearPopupOpen, setIsYearPopupOpen] = useState(false);
  const yearPopupRef = useRef<HTMLDivElement>(null);

  const currentYearValue = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYearValue - 1887 }, (_, i) => currentYearValue - i);

  const debouncedSearch = debounce((value: string) => {
    onSearch(value);
  }, 300) as (value: string) => void;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    onYearFilter(year);
    setIsYearPopupOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const clearYear = () => {
    setSelectedYear(undefined);
    onYearFilter(undefined);
    setIsYearPopupOpen(false);
  };

  const toggleYearPopup = () => {
    setIsYearPopupOpen(!isYearPopupOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearPopupRef.current && !yearPopupRef.current.contains(event.target as Node)) {
        setIsYearPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:gap-6 sm:items-center">
      {/* Search Input */}
      <CustomInput
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        variant="search"
        showClearButton={!!searchTerm}
        onClear={clearSearch}
        searchIcon={true}
      />

      {/* Year Filter */}
      <div className="relative w-full sm:w-48" ref={yearPopupRef}>
        <button
          onClick={toggleYearPopup}
          className={`year-filter-button ${!selectedYear ? 'placeholder' : ''}`}
        >
          {selectedYear ? selectedYear : 'Filter by year'}
        </button>
        <ChevronDown className={`year-dropdown-icon ${isYearPopupOpen ? 'open' : ''}`} />
        
        {isYearPopupOpen && (
          <div className="year-popup">
            {/* Years List - Scrollable */}
            <div className="year-popup-scrollable">
              {yearOptions.map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`year-popup-item ${selectedYear === year ? 'selected' : ''}`}
                >
                  {year}
                </div>
              ))}
            </div>
            
            {/* Clear Filter Button - Fixed at Bottom */}
            <div
              onClick={clearYear}
              className="year-popup-clear"
            >
              Clear Filter
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
