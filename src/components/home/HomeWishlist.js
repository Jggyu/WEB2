// src/components/home/HomeWishlist.js
import React, { useState, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faSort, faFilter } from '@fortawesome/free-solid-svg-icons';

const HomeWishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [sortedWishlist, setSortedWishlist] = useState([]);
  const [sortType, setSortType] = useState('date-desc');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    sortWishlist(sortType);
  }, [wishlist, sortType]);

  const sortWishlist = (type) => {
    let sorted = [...wishlist];
    switch (type) {
      case 'date-asc':
        sorted.reverse();
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'rating-asc':
        sorted.sort((a, b) => a.vote_average - b.vote_average);
        break;
      default: // date-desc
        // 이미 최신순으로 정렬되어 있음
        break;
    }
    
    // 필터 적용
    if (filterType !== 'all') {
      sorted = sorted.filter(movie => {
        if (filterType === 'high-rated') return movie.vote_average >= 8;
        if (filterType === 'recent') {
          const movieDate = new Date(movie.release_date);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return movieDate >= sixMonthsAgo;
        }
        return true;
      });
    }
    
    setSortedWishlist(sorted);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-16 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start 
        md:items-center space-y-4 md:space-y-0 mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            내가 찜한 콘텐츠
          </h1>
          <span className="bg-netflix-red text-white px-3 py-1 rounded-full text-sm">
            {wishlist.length}
          </span>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-gray-800 
            hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span>{showFilters ? '필터 숨기기' : '필터 보기'}</span>
          </button>
        </div>
      </div>

      {/* Filters & Sorting Section */}
      <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 
          md:space-x-4 bg-gray-900 p-4 rounded-lg">
          {/* Sort Options */}
          <div className="relative w-full md:w-48">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md 
              appearance-none cursor-pointer hover:bg-gray-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-netflix-red"
            >
              <option value="date-desc">최신순</option>
              <option value="date-asc">오래된순</option>
              <option value="title-asc">제목 (가나다)</option>
              <option value="title-desc">제목 (가나다 역순)</option>
              <option value="rating-desc">평점 높은순</option>
              <option value="rating-asc">평점 낮은순</option>
            </select>
            <FontAwesomeIcon 
              icon={faSort} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
              pointer-events-none text-gray-400"
            />
          </div>

          {/* Filter Options */}
          <div className="relative w-full md:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md 
              appearance-none cursor-pointer hover:bg-gray-700 transition-colors
              focus:outline-none focus:ring-2 focus:ring-netflix-red"
            >
              <option value="all">모든 콘텐츠</option>
              <option value="high-rated">평점 8점 이상</option>
              <option value="recent">최근 6개월</option>
            </select>
            <FontAwesomeIcon 
              icon={faFilter} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
              pointer-events-none text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] 
          space-y-4 text-gray-400">
          <FontAwesomeIcon icon={faHeart} className="text-5xl" />
          <p className="text-xl">아직 찜한 콘텐츠가 없습니다</p>
          <p className="text-sm text-gray-500">
            마음에 드는 콘텐츠를 찜해보세요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
          lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {sortedWishlist.map(movie => (
            <div
              key={movie.id}
              className="relative group cursor-pointer transition-transform 
              duration-300 hover:scale-105"
            >
              {/* Movie Poster */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Movie Info Overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300 
                rounded-lg flex flex-col justify-between p-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    {movie.title}
                  </h3>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {movie.overview}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(movie);
                    }}
                    className="text-netflix-red hover:text-red-700 
                    transition-colors"
                    aria-label="찜하기 취소"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default HomeWishlist;