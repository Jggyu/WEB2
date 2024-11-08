import React, { useState } from 'react';
import './MovieSearch.css';

const MovieSearch = ({ onChangeOptions }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdowns = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어']
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

  return (
    <div className="dropdown-container">
      <span>선호하는 설정을 선택하세요</span>

      {Object.entries(dropdowns).map(([key, options]) => (
        <div key={key} className="custom-select">
          <div 
            className={`select-selected ${activeDropdown === key ? 'select-arrow-active' : ''}`}
            onClick={() => toggleDropdown(key)}
          >
            {selectedOptions[key]}
          </div>

          {activeDropdown === key && (
            <div className="select-items">
              {options.map(option => (
                <div 
                  key={option}
                  onClick={() => selectOption(key, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button className="clear-options" onClick={clearOptions}>
        초기화
      </button>
    </div>
  );
};

export default MovieSearch;