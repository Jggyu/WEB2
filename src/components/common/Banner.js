import React from 'react';
import './Banner.css';

const Banner = ({ movie }) => {
  if (!movie) return null;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div 
      className="banner"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="banner-content">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <div className="banner-buttons">
          <button className="play-btn title-btn">재생</button>
          <button className="info-btn title-btn">상세 정보</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;