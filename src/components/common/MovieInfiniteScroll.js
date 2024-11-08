import React, { useState, useEffect, useRef } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import './MovieInfiniteScroll.css';

const MovieInfiniteScroll = ({ genreCode, apiKey, sortingOrder = 'all', voteAverage = 100 }) => {
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

      const response = await fetch(`${url}?api_key=${apiKey}&language=ko-KR&page=${currentPage}&with_genres=${genreCode}`);
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
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowTopButton(scrollTop > 300);
  };

  const handleResize = () => {
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = window.innerWidth <= 768 ? 100 : 300;
      const horizontalGap = window.innerWidth <= 768 ? 10 : 15;
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
    <div className="movie-grid" ref={gridContainerRef}>
      <div className="grid-container">
        {getVisibleMovieGroups().map((movieGroup, groupIndex) => (
          <div 
            key={groupIndex}
            className={`movie-row ${movieGroup.length === rowSize ? 'full' : ''}`}
          >
            {movieGroup.map(movie => (
              <div 
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlist(movie)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-title">{movie.title}</div>
                {isInWishlist(movie.id) && (
                  <div className="wishlist-indicator">👍</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="loading-trigger" ref={loadingTriggerRef}>
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            Loading...
          </div>
        )}
      </div>

      {showTopButton && (
        <button className="top-button" onClick={scrollToTop}>
          Top
        </button>
      )}
    </div>
  );
};

export default MovieInfiniteScroll;