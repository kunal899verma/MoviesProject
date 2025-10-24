'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMovies, setQuery } from '@/store/slices/moviesSlice';
import { logout } from '@/store/slices/authSlice';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { toast } from 'react-hot-toast';

// Lazy load heavy components
const MovieCard = lazy(() => import('@/components/movies/MovieCard').then(module => ({ default: module.MovieCard })));
const MoviesPagination = lazy(() => import('@/components/movies/MoviesPagination').then(module => ({ default: module.MoviesPagination })));
const SearchBar = lazy(() => import('@/components/movies/SearchBar').then(module => ({ default: module.SearchBar })));
const EmptyState = lazy(() => import('@/components/movies/EmptyState').then(module => ({ default: module.EmptyState })));

export default function MoviesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { movies, pagination, isLoading, query } = useAppSelector((state) => state.movies);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch movies if user is authenticated
    if (user) {
      dispatch(fetchMovies(query));
    }
  }, [dispatch, query.page, query.search, query.year, query.limit, user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleSearch = (search: string) => {
    dispatch(setQuery({ ...query, search, page: 1 }));
  };

  const handleYearFilter = (year: number | undefined) => {
    dispatch(setQuery({ ...query, year, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setQuery({ ...query, page }));
  };

  if (isLoading && movies.length === 0) {
    return <LoadingScreen />;
  }

  // Show empty state if no movies and no search/filter applied
  if (movies.length === 0 && !query.search && !query.year) {
    return (
      <div className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
        <div className="container mx-auto px-5 py-8 max-w-container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-heading-2 text-white m-0">My movies</h1>
              <button 
                className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => router.push('/movies/create')}
                aria-label="Add a new movie"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            <PrimaryButton
              onClick={handleLogout}
              variant="logout"
              icon={<LogOut className="w-4 h-4" />}
              iconPosition="right"
              className="self-start sm:self-auto"
            >
              Logout
            </PrimaryButton>
          </div>

          <EmptyState onAddMovie={() => router.push('/movies/create')} />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
      <div className="container mx-auto px-5 py-8 max-w-container">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-heading-2 text-white m-0">My movies</h1>
            <button 
              className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => router.push('/movies/create')}
              aria-label="Add a new movie"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
          <PrimaryButton
            onClick={handleLogout}
            variant="logout"
            icon={<LogOut className="w-4 h-4" />}
            iconPosition="right"
            className="self-start sm:self-auto"
          >
            Logout
          </PrimaryButton>
        </header>

        {/* Search and Filter */}
        <section className="mb-8" aria-label="Search and filter movies">
          <Suspense fallback={<div className="h-12 bg-input rounded-lg animate-pulse" />}>
            <SearchBar
              onSearch={handleSearch}
              onYearFilter={handleYearFilter}
              currentSearch={query.search || ''}
              currentYear={query.year}
            />
          </Suspense>
        </section>

        {/* Add Movie Button */}
        <section className="mb-8" aria-label="Add new movie">
          <PrimaryButton
            onClick={() => router.push('/movies/create')}
            variant="login"
            size="login"
            icon={<Plus className="w-5 h-5" />}
            iconPosition="left"
          >
            Add a new movie
          </PrimaryButton>
        </section>

        {/* Movies Grid */}
        <section aria-label="Movies list">
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              {query.search || query.year 
                ? 'No movies found matching your criteria.' 
                : 'No movies found.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" role="grid" aria-label="Movies grid">
              {movies.map((movie) => (
                <Suspense key={movie._id} fallback={<div className="h-96 bg-card rounded-lg animate-pulse" />}>
                  <MovieCard
                    movie={movie}
                    onEdit={() => router.push(`/movies/${movie._id}/edit`)}
                  />
                </Suspense>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Suspense fallback={<div className="h-12 bg-card rounded-lg animate-pulse" />}>
                <MoviesPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            )}
          </>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-card border border-card-border p-6 rounded-lg">
                <div className="animate-spin border-2 border-white/20 border-t-white rounded-full w-8 h-8 mb-4 mx-auto" />
                <p className="text-white">Loading movies...</p>
            </div>
          </div>
        )}
        </section>
      </div>
    </main>
  );
}
