import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[4%] py-5
        transition-colors duration-300 ${isScrolled ? 'bg-netflix-black' : 'bg-transparent'}`}
      >
        <div className="flex items-center">
          <div className="h-8 mr-6">
            <Link to="/" />
          </div>
          
          <nav className="hidden md:flex space-x-5">
            <Link to="/" className="text-gray-200 hover:text-gray-300 transition">
              홈
            </Link>
            <Link to="/popular" className="text-gray-200 hover:text-gray-300 transition">
              대세 콘텐츠
            </Link>
            <Link to="/wishlist" className="text-gray-200 hover:text-gray-300 transition">
              내가 찜한 리스트
            </Link>
            <Link to="/search" className="text-gray-200 hover:text-gray-300 transition">
              찾아보기
            </Link>
          </nav>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 w-64 h-full bg-netflix-black z-50 transform
        transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        md:hidden`}
      >
        <div className="pt-20 px-4 space-y-4">
          <Link 
            to="/" 
            className="block text-gray-200 hover:text-white py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            홈
          </Link>
          <Link 
            to="/popular" 
            className="block text-gray-200 hover:text-white py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            대세 콘텐츠
          </Link>
          <Link 
            to="/wishlist" 
            className="block text-gray-200 hover:text-white py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            내가 찜한 리스트
          </Link>
          <Link 
            to="/search" 
            className="block text-gray-200 hover:text-white py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            찾아보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;