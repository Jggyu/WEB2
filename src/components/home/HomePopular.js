// src/components/home/HomePopular.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars, faFilter } from '@fortawesome/free-solid-svg-icons';
import MovieGrid from '../common/MovieGrid';
import MovieInfiniteScroll from '../common/MovieInfiniteScroll';

const HomePopular = () => {
  const [currentView, setCurrentView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const apiKey = localStorage.getItem('TMDb-Key') || '';

  // 스크롤 위치 저장
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('popularScrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }
    
    const handleScroll = () => {
      sessionStorage.setItem('popularScrollPosition', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setView = (view) => {
    setCurrentView(view);
    if (view === 'grid') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const genres = [
    { id: 'all', name: '전체' },
    { id: '28', name: '액션' },
    { id: '35', name: '코미디' },
    { id: '27', name: '공포' },
    { id: '10749', name: '로맨스' },
    { id: '878', name: 'SF' },
  ];

  const years = [
    { id: 'all', name: '전체' },
    { id: '2024', name: '2024' },
    { id: '2023', name: '2023' },
    { id: '2022', name: '2022' },
    { id: '2021', name: '2021' },
  ];

  return (
    <div className="min-h-screen bg-netflix-black pt-16 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center 
        space-y-4 md:space-y-0 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          대세 콘텐츠
        </h1>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          {/* Filter Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 
            text-white px-4 py-2 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>필터</span>
          </button>

          {/* View Toggle Buttons */}
          <div className="flex space-x-2 ml-auto md:ml-0">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-colors ${
                currentView === 'grid'
                  ? 'bg-netflix-red text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-label="그리드 보기"
            >
              <FontAwesomeIcon icon={faTh} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                currentView === 'list'
                  ? 'bg-netflix-red text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-label="리스트 보기"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Genre Filter */}
          <div className="relative group w-full md:w-48">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md 
              appearance-none cursor-pointer hover:bg-gray-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-netflix-red"
            >
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
              pointer-events-none text-gray-400">
              ▼
            </div>
          </div>

          {/* Year Filter */}
          <div className="relative group w-full md:w-48">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md 
              appearance-none cursor-pointer hover:bg-gray-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-netflix-red"
            >
              {years.map(year => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
              pointer-events-none text-gray-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="transition-all duration-300">
        {currentView === 'grid' ? (
          <MovieGrid 
            fetchUrl={`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR${
              selectedGenre !== 'all' ? `&with_genres=${selectedGenre}` : ''
            }${
              selectedYear !== 'all' ? `&year=${selectedYear}` : ''
            }`}
          />
        ) : (
          <MovieInfiniteScroll 
            genreCode={selectedGenre}
            apiKey={apiKey}
            year={selectedYear}
          />
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

export default HomePopular;