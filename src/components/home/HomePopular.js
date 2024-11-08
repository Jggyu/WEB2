import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons';
import MovieGrid from '../common/MovieGrid';
import MovieInfiniteScroll from '../common/MovieInfiniteScroll';
import './HomePopular.css';

const HomePopular = () => {
  const [currentView, setCurrentView] = useState('grid');
  const apiKey = localStorage.getItem('TMDb-Key') || '';

  const setView = (view) => {
    setCurrentView(view);
    if (view === 'grid') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className="popular-container">
      <div className="view-toggle">
        <button 
          className={currentView === 'grid' ? 'active' : ''}
          onClick={() => setView('grid')}
        >
          <FontAwesomeIcon icon={faTh} />
        </button>
        <button 
          className={currentView === 'list' ? 'active' : ''}
          onClick={() => setView('list')}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {currentView === 'grid' ? (
        <MovieGrid 
          fetchUrl={`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`}
        />
      ) : (
        <MovieInfiniteScroll 
          genreCode="0"
          apiKey={apiKey}
        />
      )}
    </div>
  );
};

export default HomePopular;