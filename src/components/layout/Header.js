import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const removeKey = () => {
    localStorage.removeItem('TMDb-Key');
    navigate('/signin');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div id="container">
      <div className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <div className="logo">
            <Link to="/" />
          </div>
          <nav>
            <Link to="/">홈</Link>
            <Link to="/popular">대세 콘텐츠</Link>
            <Link to="/wishlist">내가 찜한 리스트</Link>
            <Link to="/search">찾아보기</Link>
          </nav>
        </div>

        <div className="header-right">
          {/* 추가 헤더 우측 컨텐츠 */}
        </div>
      </div>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav>
          <Link to="/" onClick={toggleMobileMenu}>홈</Link>
          <Link to="/popular" onClick={toggleMobileMenu}>대세 콘텐츠</Link>
          <Link to="/wishlist" onClick={toggleMobileMenu}>내가 찜한 리스트</Link>
          <Link to="/search" onClick={toggleMobileMenu}>찾아보기</Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;