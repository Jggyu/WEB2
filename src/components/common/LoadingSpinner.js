const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };
  
    return (
      <div className="flex items-center justify-center">
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="h-full w-full rounded-full border-4 border-gray-500
            border-t-netflix-red"></div>
        </div>
      </div>
    );
  };