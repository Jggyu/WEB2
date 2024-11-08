// src/components/common/MovieInfiniteScroll.js
import React, { useState, useEffect, useRef } from 'react';
import { useWishlist } from '../../hooks/useWishlist';

const MovieInfiniteScroll = ({ 
  genreCode, 
  apiKey, 
  sortingOrder = 'all', 
  voteAverage = 100 
}) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);
  
  const loadingTriggerRef = useRef(null);
  const gridContainerRef = useRef(null);
  
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchMovies();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.observe(loadingTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchMovies = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const url = genreCode === "0"
        ? 'https://api.themoviedb.org/3/movie/popular'
        : 'https://api.themoviedb.org/3/discover/movie';

      const response = await fetch(
        `${url}?api_key=${apiKey}&language=ko-KR&page=${currentPage}&with_genres=${genreCode}`
      );
      const data = await response.json();
      
      if (data.results.length > 0) {
        let newMovies = [...movies, ...data.results];

        if (sortingOrder !== 'all') {
          newMovies = newMovies.filter(movie => 
            movie.original_language === sortingOrder
          );
        }

        newMovies = newMovies.filter(movie => {
          if (voteAverage === -1) return true;
          if (voteAverage === -2) return movie.vote_average <= 4;
          return movie.vote_average >= voteAverage &&
            movie.vote_average < voteAverage + 1;
        });

        setMovies(newMovies);
        setCurrentPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    setShowTopButton(window.scrollY > 300);
  };

  const handleResize = () => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = window.innerWidth <= 768 ? 120 : 200;
      const horizontalGap = window.innerWidth <= 768 ? 8 : 16;
      setRowSize(Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getVisibleMovieGroups = () => {
    return movies.reduce((resultArray, item, index) => {
      const groupIndex = Math.floor(index / rowSize);
      if (!resultArray[groupIndex]) {
        resultArray[groupIndex] = [];
      }
      resultArray[groupIndex].push(item);
      return resultArray;
    }, []);
  };

  return (
    <div className="relative min-h-screen" ref={gridContainerRef}>
      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {movies.map(movie => (
          <div
            key={movie.id}
            className="relative group cursor-pointer transition-all duration-300
            hover:scale-105 hover:z-10"
            onClick={() => toggleWishlist(movie)}
          >
            {/* Movie Poster */}
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
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

            {/* Movie Title */}
            <h3 className="mt-2 text-sm text-center text-gray-200 truncate px-2">
              {movie.title}
            </h3>

            {/* Hover Info */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100
            transition-opacity duration-300 flex flex-col items-center justify-center p-4
            rounded-lg">
              <h4 className="text-sm font-semibold mb-2">{movie.title}</h4>
              <p className="text-xs text-gray-300 line-clamp-6 text-center">
                {movie.overview}
              </p>
              <div className="mt-2 text-xs text-yellow-400">
                ★ {movie.vote_average.toFixed(1)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Trigger & Indicator */}
      <div 
        ref={loadingTriggerRef}
        className="w-full h-20 flex items-center justify-center"
      >
        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-netflix-red hover:bg-red-700
          text-white w-12 h-12 rounded-full shadow-lg transition-all duration-300
          transform hover:scale-110 flex items-center justify-center z-50"
        >
          ↑
        </button>
      )}

      {/* Empty State */}
      {movies.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-gray-500 text-lg">
            해당하는 영화가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieInfiniteScroll;