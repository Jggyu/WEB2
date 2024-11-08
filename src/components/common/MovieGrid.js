// src/components/common/MovieGrid.js
import React from 'react';
import { useWishlist } from '../../hooks/useWishlist';

const MovieGrid = ({ movies }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!movies.length) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        해당하는 영화가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
      lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map(movie => (
        <div
          key={movie.id}
          className="relative group cursor-pointer transition-all duration-300 
          hover:scale-105"
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

          {/* Wishlist Indicator */}
          {isInWishlist(movie.id) && (
            <div className="absolute top-2 right-2 bg-netflix-red/50 p-1.5
            rounded-full shadow-lg shadow-netflix-red/30 text-white z-20">
              👍
            </div>
          )}

          {/* Movie Info Overlay */}
          <div className="absolute inset-0 bg-black/80 opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 
            rounded-lg p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-3">
                {movie.overview}
              </p>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">
                  ★ {movie.vote_average.toFixed(1)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(movie);
                  }}
                  className="text-white hover:text-netflix-red transition-colors"
                >
                  {isInWishlist(movie.id) ? '찜해제' : '찜하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;