import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

export const movieService = {
  // 기본 설정
  getConfig: (apiKey) => {
    return {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };
  },

  // 특징 영화 가져오기
  getFeaturedMovie: async (apiKey) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular`,
        {
          params: {
            api_key: apiKey,
            language: 'ko-KR',
          },
        }
      );
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
      throw error;
    }
  },

  // 인기 영화 목록
  getPopularMovies: async (apiKey, page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/popular`,
        {
          params: {
            api_key: apiKey,
            language: 'ko-KR',
            page,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // 영화 검색
  searchMovies: async (apiKey, query, page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie`,
        {
          params: {
            api_key: apiKey,
            query,
            language: 'ko-KR',
            page,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // 장르별 영화
  getMoviesByGenre: async (apiKey, genreId, page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/discover/movie`,
        {
          params: {
            api_key: apiKey,
            with_genres: genreId,
            language: 'ko-KR',
            page,
            sort_by: 'popularity.desc',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // 영화 상세 정보
  getMovieDetails: async (apiKey, movieId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${movieId}`,
        {
          params: {
            api_key: apiKey,
            language: 'ko-KR',
            append_to_response: 'videos,credits',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },
};