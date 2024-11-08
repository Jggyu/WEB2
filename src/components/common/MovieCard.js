// src/components/common/MovieCard.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faPlay } from '@fortawesome/free-solid-svg-icons';

const MovieCard = ({ 
  movie, 
  isWishlist = false, 
  onWishlistToggle,
  onPlay,
  layout = 'grid' // 'grid' 또는 'list'
}) => {
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onWishlistToggle?.(movie);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlay?.(movie);
  };

  if (layout === 'list') {
    return (
      <div className="group relative bg-gray-900 rounded-lg overflow-hidden 
        hover:bg-gray-800 transition-all duration-300 w-full">
        <div className="flex items-center space-x-4 p-4">
          {/* Poster */}
          <div className="flex-shrink-0 w-24 h-36 md:w-32 md:h-48">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover rounded-md"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
            <div className="flex items-center space-x-4 mb-2">
              <span className="flex items-center text-yellow-400">
                <FontAwesomeIcon icon={faStar} className="mr-1" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm">
                {movie.release_date?.slice(0, 4)}
              </span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayClick}
                className="btn-primary flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlay} />
                <span>재생</span>
              </button>
              <button
                onClick={handleWishlistClick}
                className={`btn-secondary flex items-center space-x-2 ${
                  isWishlist ? 'text-netflix-red' : 'text-white'
                }`}
              >
                <FontAwesomeIcon icon={faHeart} />
                <span>{isWishlist ? '찜해제' : '찜하기'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-gray-900 rounded-lg overflow-hidden 
      hover:scale-105 transition-all duration-300">
      {/* Poster */}
      <div className="aspect-[2/3]">
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center 
        justify-center transition-all duration-300 ${
          isWishlist 
            ? 'bg-netflix-red text-white' 
            : 'bg-black/50 text-white hover:bg-netflix-red'
        }`}
      >
        <FontAwesomeIcon icon={faHeart} />
      </button>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
          <div className="flex items-center space-x-4 mb-2">
            <span className="flex items-center text-yellow-400">
              <FontAwesomeIcon icon={faStar} className="mr-1" />
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
              {movie.release_date?.slice(0, 4)}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-3">
            {movie.overview}
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={handlePlayClick}
          className="w-full bg-netflix-red text-white py-2 rounded-md
          hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <FontAwesomeIcon icon={faPlay} />
          <span>재생</span>
        </button>
      </div>
    </div>
  );
};