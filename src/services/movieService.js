import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

export const movieService = {
  getFeaturedMovie: async (apiKey) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: apiKey,
          language: 'ko-KR'
        }
      });
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      throw error;
    }
  },

  getPopularMovies: async (apiKey, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: apiKey,
          language: 'ko-KR',
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getNewReleases: async (apiKey, page = 2) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: apiKey,
          language: 'ko-KR',
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new releases:', error);
      throw error;
    }
  },

  getMoviesByGenre: async (apiKey, genre, page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: apiKey,
          with_genres: genre,
          language: 'ko-KR',
          page
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  }
};