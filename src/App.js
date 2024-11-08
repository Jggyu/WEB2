import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HomeMain from './components/home/HomeMain';
import HomePopular from './components/home/HomePopular';
import HomeSearch from './components/home/HomeSearch';
import HomeWishlist from './components/home/HomeWishlist';
import SignIn from './components/auth/SignIn';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <HomeMain />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/popular" 
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <HomePopular />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/search" 
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <HomeSearch />
                </>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <HomeWishlist />
                </>
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;