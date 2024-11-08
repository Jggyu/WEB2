const NoResults = ({ 
    icon, 
    title, 
    message, 
    action 
  }) => {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FontAwesomeIcon 
          icon={icon} 
          className="text-5xl text-gray-500 mb-4" 
        />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-center max-w-md mb-6">
          {message}
        </p>
        {action && (
          <div className="flex space-x-4">
            {typeof action === 'function' ? action() : action}
          </div>
        )}
      </div>
    );
  };
  
  export { SearchBar, SearchResults, NoResults };