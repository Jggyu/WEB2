// src/components/home/HomeWishlist.js
import React, { useState, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSort } from '@fortawesome/free-solid-svg-icons';

const HomeWishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('date-desc');

  useEffect(() => {
    filterAndSortWishlist();
  }, [wishlist, filterType, sortType]);

  const filterAndSortWishlist = () => {
    let filtered = [...wishlist];

    // 필터 적용
    switch (filterType) {
      case 'high-rated':
        filtered = filtered.filter(movie => movie.vote_average >= 8);
        break;
      case 'recent':
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        filtered = filtered.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate >= sixMonthsAgo;
        });
        break;
      default:
        break;
    }

    // 정렬 적용
    switch (sortType) {
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'rating-asc':
        filtered.sort((a, b) => a.vote_average - b.vote_average);
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        break;
      case 'date-desc':
      default:
        filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
    }

    setFilteredWishlist(filtered);
  };

  return (
    <div className="min-h-screen bg-netflix-black pt-16 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start 
        md:items-center space-y-4 md:space-y-0 mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            내가 찜한 콘텐츠
          </h1>
          <span className="bg-netflix-red text-white px-3 py-1 rounded-full text-sm">
            {filteredWishlist.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md 
            hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <option value="all">모든 콘텐츠</option>
            <option value="high-rated">평점 8점 이상</option>
            <option value="recent">최근 6개월</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md 
            hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <option value="date-desc">최신순</option>
            <option value="date-asc">오래된순</option>
            <option value="title-asc">제목 (가나다)</option>
            <option value="title-desc">제목 (가나다 역순)</option>
            <option value="rating-desc">평점 높은순</option>
            <option value="rating-asc">평점 낮은순</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {filteredWishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] 
          space-y-4 text-gray-400">
          <FontAwesomeIcon icon={faHeart} className="text-5xl" />
          <p className="text-xl">찜한 콘텐츠가 없습니다</p>
          <p className="text-sm text-gray-500">
            마음에 드는 콘텐츠를 찜해보세요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
          lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredWishlist.map(movie => (
            <div
              key={movie.id}
              className="relative group cursor-pointer transition-transform 
              duration-300 hover:scale-105"
            >
              {/* Movie Poster */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Movie Title */}
              <h3 className="mt-2 text-sm text-center text-gray-200 truncate px-2">
                {movie.title}
              </h3>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300 
                rounded-lg flex flex-col justify-between p-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {movie.overview}
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400 ml-2">
                      {movie.release_date?.slice(0, 4)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleWishlist(movie)}
                  className="mt-4 w-full bg-netflix-red text-white py-2 rounded-md
                  hover:bg-red-700 transition-colors"
                >
                  찜 해제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeWishlist;