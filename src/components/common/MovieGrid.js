// src/components/common/MovieGrid.js
import React, { useState, useEffect, useRef } from 'react';
import { useWishlist } from '../../hooks/useWishlist';

const MovieGrid = ({ fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [moviesPerPage, setMoviesPerPage] = useState(20);
  const gridContainerRef = useRef(null);
  
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchMovies();
    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, []);

  const fetchMovies = async () => {
    try {
      const totalMoviesNeeded = 120;
      const numberOfPages = Math.ceil(totalMoviesNeeded / 20);
      let allMovies = [];

      for (let page = 1; page <= numberOfPages; page++) {
        const response = await fetch(`${fetchUrl}&page=${page}`);
        const data = await response.json();
        allMovies = [...allMovies, ...data.results];
      }

      setMovies(allMovies.slice(0, totalMoviesNeeded));
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const calculateLayout = () => {
    if (gridContainerRef.current) {
      const container = gridContainerRef.current;
      const containerWidth = container.offsetWidth;
      const movieCardWidth = window.innerWidth <= 768 ? 120 : 200;
      const horizontalGap = window.innerWidth <= 768 ? 10 : 20;
      
      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor((window.innerHeight - container.offsetTop) / 
        (window.innerWidth <= 768 ? 180 : 300));
      
      setRowSize(newRowSize);
      setMoviesPerPage(newRowSize * maxRows);
    }
  };

  const getVisibleMovies = () => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const paginatedMovies = movies.slice(startIndex, endIndex);

    return paginatedMovies.reduce((resultArray, item, index) => {
      const groupIndex = Math.floor(index / rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  };

  const getTotalPages = () => Math.ceil(movies.length / moviesPerPage);

  return (
    <div 
      className="min-h-[calc(100vh-200px)] mt-8 mb-10 px-4"
      ref={gridContainerRef}
    >
      <div className="flex flex-col items-center">
        {/* Movie Grid */}
        {getVisibleMovies().map((movieGroup, groupIndex) => (
          <div 
            key={groupIndex}
            className="flex justify-center w-full mb-5 flex-wrap gap-4"
          >
            {movieGroup.map(movie => (
              <div
                key={movie.id}
                className="relative group cursor-pointer transition-transform duration-300 
                hover:scale-105 md:w-[200px] w-[120px]"
                onClick={() => toggleWishlist(movie)}
              >
                {/* Movie Poster */}
                <div className="aspect-[2/3] overflow-hidden rounded-lg">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Wishlist Indicator */}
                {isInWishlist(movie.id) && (
                  <div className="absolute top-2 right-2 bg-netflix-red/50 
                  shadow-lg shadow-netflix-red/30 rounded-full p-1 text-white">
                    👍
                  </div>
                )}

                {/* Movie Title */}
                <h3 className="mt-2 text-sm text-center text-gray-200 truncate px-2">
                  {movie.title}
                </h3>

                {/* Hover Info */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100
                transition-opacity duration-300 flex items-center justify-center p-4 rounded-lg">
                  <p className="text-xs text-center text-white">
                    {movie.overview?.slice(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Pagination */}
        {getTotalPages() > 1 && (
          <div className="flex items-center gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700
              disabled:opacity-50 disabled:cursor-not-allowed transition"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </button>
            
            <span className="text-gray-300">
              {currentPage} / {getTotalPages()}
            </span>
            
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700
              disabled:opacity-50 disabled:cursor-not-allowed transition"
              onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
              disabled={currentPage === getTotalPages()}
            >
              다음
            </button>
          </div>
        )}

        {/* Empty State */}
        {movies.length === 0 && (
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-gray-500 text-lg">
              영화를 불러오는 중입니다...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieGrid;