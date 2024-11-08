import React, { useState, useRef, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import './MovieRow.css';

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
      setMaxScroll(Math.max(0,
        sliderRef.current.scrollWidth - sliderWindowRef.current.clientWidth
      ));
    }
  };

  const handleResize = () => {
    calculateMaxScroll();
    setScrollAmount(prev => Math.min(prev, maxScroll));
  };

  const slide = (direction) => {
    const slideAmount = sliderWindowRef.current.clientWidth * 0.8;
    if (direction === 'left') {
      setScrollAmount(prev => Math.max(0, prev - slideAmount));
    } else {
      setScrollAmount(prev => Math.min(maxScroll, prev + slideAmount));
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (isScrolling) return;

    setIsScrolling(true);
    const direction = e.deltaY > 0 ? 'right' : 'left';
    slide(direction);

    setTimeout(() => setIsScrolling(false), 500);
  };

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const touchDiff = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(touchDiff) > minSwipeDistance) {
      const direction = touchDiff > 0 ? 'right' : 'left';
      slide(direction);
    }
  };

  const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  return (
    <div className="movie-row">
      <h2>{title}</h2>
      
      <div 
        className="slider-container"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <button 
          className={`slider-button left ${showButtons ? 'visible' : ''}`}
          onClick={() => slide('left')}
          disabled={scrollAmount <= 0}
        >
          &lt;
        </button>

        <div className="slider-window" ref={sliderWindowRef}>
          <div 
            className="movie-slider"
            ref={sliderRef}
            style={{
              transform: `translateX(-${scrollAmount}px)`
            }}
          >
            {movies.map(movie => (
              <div 
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlist(movie)}
              >
                <img 
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                />
                {isInWishlist(movie.id) && (
                  <div className="wishlist-indicator">👍</div>
                )}
                <div className="movie-title">{movie.title}</div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className={`slider-button right ${showButtons ? 'visible' : ''}`}
          onClick={() => slide('right')}
          disabled={scrollAmount >= maxScroll}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MovieRow;