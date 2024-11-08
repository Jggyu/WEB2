import { MovieCard } from './MovieCard';

const SearchResults = ({ 
  results, 
  isLoading, 
  error,
  onLoadMore,
  hasMore = false,
}) => {
  const loadingRef = useRef(null);

  useEffect(() => {
    if (!loadingRef.current || !onLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadingRef.current);

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [onLoadMore, hasMore, isLoading]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FontAwesomeIcon 
          icon={faExclamationCircle} 
          className="text-4xl mb-4" 
        />
        <p className="text-lg">검색 중 오류가 발생했습니다</p>
        <p className="text-sm mt-2">다시 시도해 주세요</p>
      </div>
    );
  }

  if (!results.length && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FontAwesomeIcon 
          icon={faSearch} 
          className="text-4xl mb-4" 
        />
        <p className="text-lg">검색 결과가 없습니다</p>
        <p className="text-sm mt-2">다른 검색어를 입력해 보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
        lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {results.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            layout="grid"
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-400">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="animate-spin" 
            />
            <span>검색 중...</span>
          </div>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && !isLoading && (
        <div ref={loadingRef} className="h-20" />
      )}
    </div>
  );
};