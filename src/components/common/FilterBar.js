import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilter, 
  faSort, 
  faTimes,
  faChevronDown 
} from '@fortawesome/free-solid-svg-icons';

const FilterBar = ({ 
  filters, 
  sortOptions, 
  onFilterChange, 
  onSortChange,
  activeFilters = {},
  activeSort = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleFilterChange = (category, value) => {
    onFilterChange?.({ ...activeFilters, [category]: value });
    setActiveDropdown(null);
  };

  const handleSortChange = (value) => {
    onSortChange?.(value);
    setActiveDropdown(null);
  };

  const clearFilters = () => {
    onFilterChange?.({});
    onSortChange?.('');
  };

  const hasActiveFilters = Object.values(activeFilters).some(Boolean) || activeSort;

  return (
    <div className="relative mb-6">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center space-x-2 bg-gray-800 
        hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
      >
        <FontAwesomeIcon icon={faFilter} />
        <span>필터</span>
        {hasActiveFilters && (
          <span className="bg-netflix-red text-white text-xs px-2 py-1 rounded-full">
            !
          </span>
        )}
      </button>

      {/* Filter Bar */}
      <div className={`
        md:flex items-center space-y-4 md:space-y-0 md:space-x-4
        ${isOpen ? 'block' : 'hidden md:flex'}
        bg-gray-900 md:bg-transparent p-4 md:p-0 rounded-lg
        absolute md:relative w-full md:w-auto z-20 top-full mt-2 md:mt-0
      `}>
        {/* Filter Dropdowns */}
        {Object.entries(filters).map(([category, options]) => (
          <div key={category} className="relative">
            <button
              onClick={() => setActiveDropdown(
                activeDropdown === category ? null : category
              )}
              className="w-full md:w-48 bg-gray-800 text-left px-4 py-2 rounded-md
              hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <span className="block truncate">
                {activeFilters[category] || options.label}
              </span>
              <FontAwesomeIcon 
                icon={faChevronDown}
                className={`ml-2 transition-transform duration-200
                ${activeDropdown === category ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {activeDropdown === category && (
              <div className="absolute z-30 mt-2 w-full bg-gray-800 rounded-md
                shadow-lg py-1 max-h-60 overflow-auto">
                {options.values.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(category, option.value)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700
                    transition-colors ${
                      activeFilters[category] === option.value
                        ? 'text-netflix-red'
                        : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Sort Dropdown */}
        {sortOptions && (
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(
                activeDropdown === 'sort' ? null : 'sort'
              )}
              className="w-full md:w-48 bg-gray-800 text-left px-4 py-2 rounded-md
              hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              <span className="block truncate">
                {sortOptions.find(opt => opt.value === activeSort)?.label || 
                '정렬'}
              </span>
              <FontAwesomeIcon 
                icon={faSort}
                className="ml-2"
              />
            </button>

            {activeDropdown === 'sort' && (
              <div className="absolute z-30 mt-2 w-full bg-gray-800 rounded-md
                shadow-lg py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700
                    transition-colors ${
                      activeSort === option.value ? 'text-netflix-red' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-gray-400 hover:text-white
            transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
            <span>필터 초기화</span>
          </button>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export { Pagination, FilterBar };