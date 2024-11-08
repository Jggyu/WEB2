// src/components/common/Banner.js
import React from 'react';

const Banner = ({ movie }) => {
  if (!movie) return null;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div 
      className="relative h-[60vh] mt-[50px] bg-cover bg-center text-white flex items-end"
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="w-full px-12 py-16 bg-gradient-to-t from-black/80 to-transparent">
        <h1 className="text-5xl font-bold mb-2 md:max-w-2xl">
          {movie.title}
        </h1>
        
        <p className="text-base max-w-xl mb-4 text-left">
          {movie.overview}
        </p>
        
        <div className="flex gap-4">
          <button className="bg-white text-black px-8 py-2 rounded-md hover:bg-gray-200 transition">
            재생
          </button>
          
          <button className="bg-gray-500/70 text-white px-8 py-2 rounded-md hover:bg-gray-500/90 transition">
            상세 정보
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;