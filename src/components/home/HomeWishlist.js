import React from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import MovieGrid from '../common/MovieGrid';
import './HomeWishlist.css';

const HomeWishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-container">
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          위시리스트가 비어 있습니다.
        </div>
      ) : (
        <MovieGrid movies={wishlist} />
      )}
    </div>
  );
};

export default HomeWishlist;