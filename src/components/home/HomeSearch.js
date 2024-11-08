// src/components/home/HomeSearch.js
import React, { useState, useEffect } from 'react';
import MovieSearch from '../search/MovieSearch';
import MovieInfiniteScroll from '../common/MovieInfiniteScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const HomeSearch = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    genreId: '28',
    ageId: -1,
    sortId: 'all'
  });
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const genreCode = {
    '장르 (전체)': 0,
    'Action': 28,
    'Adventure': 12,
    'Comedy': 35,
    'Crime': 80,
    'Family': 10751
  };

  const sortingCode = {
    '언어 (전체)': 'all',
    '영어': 'en',
    '한국어': 'ko'
  };

  const ageCode = {
    '평점 (전체)': -1,
    '9~10': 9,
    '8~9': 8,
    '7~8': 7,
    '6~7': 6,
    '5~6': 5,
    '4~5': 4,
    '4점 이하': -2
  };

  const handleOptionsChange = (options) => {
    setSearchOptions({
      genreId: `${genreCode[options.originalLanguage]}`,
      ageId: ageCode[options.translationLanguage],
      sortId: sortingCode[options.sorting]
    });
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-16 px-4 md:px-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start 
          md:items-center space-y-4 md:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            콘텐츠 검색
          </h1>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            {/* 필터 토글 버튼 (모바일) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 bg-gray-800 
              hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FontAwesomeIcon icon={showFilters ? faTimes : faFilter} />
              <span>{showFilters ? '필터 닫기' : '필터'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="영화 제목, 배우, 감독을 검색하세요"
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red
            transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2
              text-gray-400 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="bg-gray-900 rounded-lg p-4 md:p-6">
          <MovieSearch onChangeOptions={handleOptionsChange} />
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        {debouncedQuery ? (
          <MovieInfiniteScroll
            genreCode={searchOptions.genreId}
            apiKey={apiKey}
            sortingOrder={searchOptions.sortId}
            voteAverage={searchOptions.ageId}
            searchQuery={debouncedQuery}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] 
            text-gray-400 space-y-4">
            <FontAwesomeIcon icon={faSearch} className="text-5xl" />
            <p className="text-xl">검색어를 입력하세요</p>
            <p className="text-sm text-gray-500">
              영화 제목, 배우, 감독으로 검색할 수 있습니다
            </p>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-netflix-red hover:bg-red-700 
        text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300 
        transform hover:scale-110 flex items-center justify-center z-50
        opacity-0 hover:opacity-100 focus:opacity-100 md:opacity-100"
        aria-label="맨 위로 스크롤"
      >
        ↑
      </button>
    </div>
  );
};

export default HomeSearch;