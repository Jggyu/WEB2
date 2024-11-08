// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout Components
import Header from './components/layout/Header';

// Page Components
import HomeMain from './components/home/HomeMain';
import HomePopular from './components/home/HomePopular';
import HomeSearch from './components/home/HomeSearch';
import HomeWishlist from './components/home/HomeWishlist';
import SignIn from './components/auth/SignIn';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// Layout Component with Header
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-netflix-black">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="font-sans text-white bg-netflix-black min-h-screen">
        <Routes>
          {/* Public Route */}
          <Route path="/signin" element={<SignIn />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomeMain />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/popular"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomePopular />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomeSearch />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomeWishlist />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to home */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

        {/* Global Loading Indicator */}
        <div id="loading-portal" />
        
        {/* Global Modal Portal */}
        <div id="modal-portal" />
      </div>
    </Router>
  );
};

export default App;