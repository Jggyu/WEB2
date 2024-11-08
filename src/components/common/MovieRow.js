// src/components/common/MovieRow.js
import React, { useState, useRef, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';

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
    const amount = sliderWindowRef.current?.clientWidth * 0.8 || 0;
    const newScroll = direction === 'left' 
      ? Math.max(0, scrollAmount - amount)
      : Math.min(maxScroll, scrollAmount + amount);
    setScrollAmount(newScroll);
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-left ml-8 mb-4">
        {title}
      </h2>
      
      <div 
        className="relative group"
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        {/* Left Button */}
        <button
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-4 
          transition-opacity duration-300 hover:bg-black/80
          ${!showButtons || scrollAmount <= 0 ? 'opacity-0' : 'opacity-100'}`}
          onClick={() => slide('left')}
          disabled={scrollAmount <= 0}
        >
          ❮
        </button>

        {/* Movie Slider */}
        <div className="overflow-hidden mx-8" ref={sliderWindowRef}>
          <div 
            className="flex transition-transform duration-300 ease-out"
            ref={sliderRef}
            style={{ transform: `translateX(-${scrollAmount}px)` }}
          >
            {movies.map(movie => (
              <div 
                key={movie.id}
                className="flex-none w-[200px] mr-2 relative transition-transform duration-300 
                hover:scale-105 cursor-pointer"
                onClick={() => toggleWishlist(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-md"
                />
                
                {isInWishlist(movie.id) && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full">
                    👍
                  </div>
                )}
                
                <div className="text-sm mt-2 text-center text-gray-200 truncate">
                  {movie.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-4
          transition-opacity duration-300 hover:bg-black/80
          ${!showButtons || scrollAmount >= maxScroll ? 'opacity-0' : 'opacity-100'}`}
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