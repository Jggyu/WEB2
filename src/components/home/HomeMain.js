// src/components/home/HomeMain.js
import React, { useState, useEffect } from 'react';
import Banner from '../common/Banner';
import MovieRow from '../common/MovieRow';
import { movieService } from '../../services/movieService';

const HomeMain = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      const movie = await movieService.getFeaturedMovie(apiKey);
      setFeaturedMovie(movie);
    } catch (error) {
      console.error('Error loading featured movie:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-netflix-black">
        <div className="space-y-3">
          <div className="flex space-x-2 justify-center">
            <div className="w-4 h-4 bg-netflix-red rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-netflix-red rounded-full animate-bounce delay-100" />
            <div className="w-4 h-4 bg-netflix-red rounded-full animate-bounce delay-200" />
          </div>
          <p className="text-gray-400">콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Banner Section */}
      <section className="relative w-full">
        {featuredMovie && <Banner movie={featuredMovie} />}
      </section>

      {/* Movie Rows Section */}
      <section className="relative z-10 px-4 -mt-16 space-y-8 md:space-y-12">
        {/* Popular Movies */}
        <div className="movie-section">
          <MovieRow 
            title="인기 콘텐츠" 
            fetchUrl={`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`}
          />
        </div>

        {/* New Releases */}
        <div className="movie-section">
          <MovieRow 
            title="최신 개봉작" 
            fetchUrl={`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR`}
          />
        </div>

        {/* Action Movies */}
        <div className="movie-section">
          <MovieRow 
            title="액션 영화" 
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&language=ko-KR`}
          />
        </div>

        {/* Comedy Movies */}
        <div className="movie-section">
          <MovieRow 
            title="코미디 영화" 
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&language=ko-KR`}
          />
        </div>

        {/* Horror Movies */}
        <div className="movie-section">
          <MovieRow 
            title="공포 영화" 
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&language=ko-KR`}
          />
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-netflix-red hover:bg-red-700 text-white 
        w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform 
        hover:scale-110 flex items-center justify-center z-50 
        opacity-0 hover:opacity-100 focus:opacity-100
        md:opacity-100"
        aria-label="맨 위로 스크롤"
      >
        ↑
      </button>

      {/* Bottom Gradient */}
      <div className="h-20 bg-gradient-to-t from-netflix-black to-transparent" />
    </div>
  );
};

export default HomeMain;