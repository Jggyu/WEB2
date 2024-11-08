import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-netflix-black">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              죄송합니다. 오류가 발생했습니다.
            </h2>
            <p className="text-gray-400 mb-6">
              페이지를 새로고침하거나 나중에 다시 시도해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}