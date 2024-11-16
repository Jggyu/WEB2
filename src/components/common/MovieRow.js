// src/components/common/MovieRow.js
import React, { useState, useRef, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const MovieRow = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const sliderRef = useRef(null);
  const sliderWindowRef = useRef(null);
  
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchMovies();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchUrl]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      setMovies(data.results);
      setTimeout(calculateMaxScroll, 0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const calculateMaxScroll = () => {
    if (sliderRef.current && sliderWindowRef.current) {
      setMaxScroll(
        Math.max(0, sliderRef.current.scrollWidth - sliderWindowRef.current.clientWidth)
      );
    }
  };

  const handleResize = () => {
    calculateMaxScroll();
    setScrollAmount(prev => Math.min(prev, maxScroll));
  };

  const slide = (direction) => {
    const slideAmount = sliderWindowRef.current?.clientWidth * 0.8 || 0;
    const newScroll = direction === 'left' 
      ? Math.max(0, scrollAmount - slideAmount)
      : Math.min(maxScroll, scrollAmount + slideAmount);
    setScrollAmount(newScroll);
  };

  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-white px-4">
        {title}
      </h2>
      
      <div 
        className="relative group"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        {/* Scroll Buttons */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 
          bg-black/50 text-white h-full px-4 opacity-0 transition-opacity
          duration-300 hover:bg-black/80 disabled:opacity-0
          ${showButtons && scrollAmount > 0 ? 'group-hover:opacity-100' : ''}`}
          onClick={() => slide('left')}
          disabled={scrollAmount <= 0}
        >
          ❮
        </button>

        {/* Movies Slider */}
        <div className="overflow-hidden px-4" ref={sliderWindowRef}>
          <div 
            className="flex transition-transform duration-300 ease-out gap-2"
            ref={sliderRef}
            style={{ transform: `translateX(-${scrollAmount}px)` }}
          >
            {movies.map(movie => (
              <div 
                key={movie.id}
                className="flex-none w-[200px] md:w-[240px] relative group/card"
              >
                {/* Movie Card */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden 
                  transition-transform duration-300 group-hover/card:scale-105">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Title (visible on mobile) */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 
                    bg-gradient-to-t from-black to-transparent md:hidden">
                    <h3 className="text-sm text-white truncate">
                      {movie.title}
                    </h3>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 
                    group-hover/card:opacity-100 transition-opacity duration-300 
                    p-4 flex flex-col justify-between invisible 
                    group-hover/card:visible">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-yellow-400 text-sm">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                        <span className="text-gray-300 text-sm">
                          {movie.release_date?.slice(0, 4)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-3">
                        {movie.overview}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button className="w-full bg-white text-black py-2 rounded-md
                        hover:bg-gray-200 transition-colors flex items-center 
                        justify-center space-x-2">
                        <FontAwesomeIcon icon={faPlay} />
                        <span>재생</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(movie);
                        }}
                        className={`w-full py-2 rounded-md transition-colors 
                        flex items-center justify-center space-x-2
                        ${isInWishlist(movie.id)
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-netflix-red text-white hover:bg-red-700'
                        }`}
                      >
                        <FontAwesomeIcon 
                          icon={isInWishlist(movie.id) ? faTimes : faPlus} 
                        />
                        <span>
                          {isInWishlist(movie.id) ? '찜 해제' : '찜하기'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title (visible on desktop) */}
                <h3 className="mt-2 text-sm text-center text-gray-200 truncate 
                  px-2 hidden md:block">
                  {movie.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scroll Button */}
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 
          bg-black/50 text-white h-full px-4 opacity-0 transition-opacity
          duration-300 hover:bg-black/80 disabled:opacity-0
          ${showButtons && scrollAmount < maxScroll ? 'group-hover:opacity-100' : ''}`}
          onClick={() => slide('right')}
          disabled={scrollAmount >= maxScroll}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default MovieRow;