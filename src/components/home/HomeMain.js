import React, { useState, useEffect } from 'react';
import Banner from '../common/Banner';
import MovieRow from '../common/MovieRow';
import { movieService } from '../../services/movieService';
import './HomeMain.css';

const HomeMain = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const apiKey = localStorage.getItem('TMDb-Key');

  useEffect(() => {
    loadFeaturedMovie();
    initializeScrollListener();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const loadFeaturedMovie = async () => {
    try {
      const movie = await movieService.getFeaturedMovie(apiKey);
      setFeaturedMovie(movie);
    } catch (error) {
      console.error('Error loading featured movie:', error);
    }
  };

  const handleScroll = () => {
    const header = document.querySelector('.app-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  const initializeScrollListener = () => {
    window.addEventListener('scroll', handleScroll);
  };

  const getUrls = () => ({
    popularMovies: movieService.getPopularMovies(apiKey),
    newReleases: movieService.getNewReleases(apiKey),
    actionMovies: movieService.getMoviesByGenre(apiKey, '28')
  });

  return (
    <div className="home">
      {featuredMovie && <Banner movie={featuredMovie} />}
      
      <MovieRow 
        title="인기 콘텐츠" 
        fetchUrl={`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`}
      />
      
      <MovieRow 
        title="최신 개봉작" 
        fetchUrl={`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR`}
      />
      
      <MovieRow 
        title="액션 영화" 
        fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=ko-KR`}
      />
    </div>
  );
};

export default HomeMain;