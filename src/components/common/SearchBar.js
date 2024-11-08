import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faTimes, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ 
  onSearch, 
  placeholder = "영화, 배우, 감독을 검색하세요",
  autoFocus = false,
  debounceTime = 500  // ms
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      setIsLoading(true);
      debounceRef.current = setTimeout(() => {
        onSearch(query);
        setIsLoading(false);
      }, debounceTime);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceTime, onSearch]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white pl-12 pr-12 py-3 rounded-lg
        placeholder-gray-400 focus:outline-none focus:ring-2 
        focus:ring-netflix-red transition-all"
      />

      {/* Clear/Loading Button */}
      {(query || isLoading) && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2
          text-gray-400 hover:text-white transition-colors"
          aria-label="검색어 지우기"
        >
          {isLoading ? (
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="animate-spin" 
            />
          ) : (
            <FontAwesomeIcon icon={faTimes} />
          )}
        </button>
      )}
    </div>
  );
};