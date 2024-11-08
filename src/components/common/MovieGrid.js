import React, { useState, useEffect, useRef } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import './MovieGrid.css';

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
      const containerHeight = window.innerHeight - container.offsetTop;
      const movieCardWidth = window.innerWidth <= 768 ? 90 : 200;
      const movieCardHeight = window.innerWidth <= 768 ? 150 : 220;
      const horizontalGap = window.innerWidth <= 768 ? 10 : 15;
      const verticalGap = -10;

      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      const maxRows = Math.floor(containerHeight / (movieCardHeight + verticalGap));
      
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

  const getTotalPages = () => {
    return Math.ceil(movies.length / moviesPerPage);
  };

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className="grid-container">
        {getVisibleMovies().map((movieGroup, groupIndex) => (
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

      {getTotalPages() > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>{currentPage} / {getTotalPages()}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(getTotalPages(), prev + 1))}
            disabled={currentPage === getTotalPages()}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;