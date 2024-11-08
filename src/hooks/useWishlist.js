import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('movieWishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const saveWishlist = (newWishlist) => {
    localStorage.setItem('movieWishlist', JSON.stringify(newWishlist));
    setWishlist(newWishlist);
  };

  const toggleWishlist = (movie) => {
    const currentWishlist = [...wishlist];
    const index = currentWishlist.findIndex(item => item.id === movie.id);

    if (index === -1) {
      saveWishlist([...currentWishlist, movie]);
    } else {
      saveWishlist(currentWishlist.filter(item => item.id !== movie.id));
    }
  };

  const isInWishlist = (movieId) => {
    return wishlist.some(item => item.id === movieId);
  };

  return {
    wishlist,
    toggleWishlist,
    isInWishlist
  };
};