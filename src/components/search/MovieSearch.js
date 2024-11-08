// src/components/search/MovieSearch.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes, faUndo } from '@fortawesome/free-solid-svg-icons';

const MovieSearch = ({ onChangeOptions }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdowns = {
    originalLanguage: {
      label: '장르',
      options: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family']
    },
    translationLanguage: {
      label: '평점',
      options: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하']
    },
    sorting: {
      label: '언어',
      options: ['언어 (전체)', '영어', '한국어']
    }
  };

  const defaultOptions = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)'
  };

  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const selectOption = (key, option) => {
    const newOptions = {
      ...selectedOptions,
      [key]: option
    };
    setSelectedOptions(newOptions);
    setActiveDropdown(null);
    onChangeOptions(newOptions);
  };

  const clearOptions = () => {
    setSelectedOptions(defaultOptions);
    onChangeOptions(defaultOptions);
  };

  const hasChanges = Object.keys(selectedOptions).some(
    key => selectedOptions[key] !== defaultOptions[key]
  );

  return (
    <div className="w-full">
      {/* Title and Clear Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-white font-semibold">
          필터 설정
        </h2>
        {hasChanges && (
          <button
            onClick={clearOptions}
            className="flex items-center space-x-2 text-gray-400 hover:text-white
            transition-colors"
          >
            <FontAwesomeIcon icon={faUndo} />
            <span className="text-sm">초기화</span>
          </button>
        )}
      </div>

      {/* Dropdowns Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(dropdowns).map(([key, { label, options }]) => (
          <div key={key} className="relative">
            {/* Dropdown Button */}
            <button
              onClick={() => toggleDropdown(key)}
              className="w-full bg-gray-800 text-left px-4 py-3 rounded-lg
              text-white hover:bg-gray-700 transition-colors relative
              focus:outline-none focus:ring-2 focus:ring-netflix-red"
            >
              <span className="block text-sm text-gray-400">
                {label}
              </span>
              <div className="flex justify-between items-center">
                <span className="block mt-1">
                  {selectedOptions[key]}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`transition-transform duration-200 
                  ${activeDropdown === key ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {activeDropdown === key && (
              <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg
                shadow-lg py-2 max-h-60 overflow-y-auto scrollbar-thin
                scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => selectOption(key, option)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-700
                    transition-colors ${
                      selectedOptions[key] === option 
                        ? 'text-netflix-red'
                        : 'text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Filters Tags */}
      {hasChanges && (
        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(selectedOptions).map(([key, value]) => {
            if (value === defaultOptions[key]) return null;
            return (
              <div
                key={key}
                className="bg-netflix-red/20 text-netflix-red px-3 py-1 
                rounded-full text-sm flex items-center space-x-2"
              >
                <span>{value}</span>
                <button
                  onClick={() => selectOption(key, defaultOptions[key])}
                  className="hover:text-white transition-colors"
                  aria-label="필터 제거"
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieSearch;