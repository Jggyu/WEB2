import React, { useState } from 'react';
import MovieSearch from '../search/MovieSearch';
import MovieInfiniteScroll from '../common/MovieInfiniteScroll';
import './HomeSearch.css';

const HomeSearch = () => {
  const apiKey = localStorage.getItem('TMDb-Key') || '';
  const [searchOptions, setSearchOptions] = useState({
    genreId: '28',
    ageId: -1,
    sortId: 'all'
  });

  const genreCode = {
    '장르 (전체)': 0,
    'Action': 28,
    'Adventure': 12,
    'Comedy': 35,
    'Crime': 80,
    'Family': 10751
  };

  const sortingCode = {
    '언어 (전체)': 'all',
    '영어': 'en',
    '한국어': 'ko'
  };

  const ageCode = {
    '평점 (전체)': -1,
    '9~10': 9,
    '8~9': 8,
    '7~8': 7,
    '6~7': 6,
    '5~6': 5,
    '4~5': 4,
    '4점 이하': -2
  };

  const handleOptionsChange = (options) => {
    setSearchOptions({
      genreId: `${genreCode[options.originalLanguage]}`,
      ageId: ageCode[options.translationLanguage],
      sortId: sortingCode[options.sorting]
    });
  };

  return (
    <div className="container-search">
      <div className="container-search-bar">
        <MovieSearch onChangeOptions={handleOptionsChange} />
      </div>

      <div className="content-search">
        <MovieInfiniteScroll
          genreCode={searchOptions.genreId}
          apiKey={apiKey}
          sortingOrder={searchOptions.sortId}
          voteAverage={searchOptions.ageId}
        />
      </div>
    </div>
  );
};

export default HomeSearch;