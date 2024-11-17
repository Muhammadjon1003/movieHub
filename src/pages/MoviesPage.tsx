import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { getLatestMovies } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const MoviesPage: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await getLatestMovies(currentPage);
                setMovies(response.results);
                setTotalPages(Math.min(response.total_pages, 500));
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <NavBar />
            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Latest Movies</h1>
                        <div className="text-gray-400">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {movies.map(movie => (
                                    <MovieCard key={movie.id} media={movie} type="movie" />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-12 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-dark-lighter text-white disabled:opacity-50 
                                        hover:bg-primary/20 transition-colors duration-200"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                <div className="flex space-x-2">
                                    {[...Array(5)].map((_, index) => {
                                        const pageNum = currentPage - 2 + index;
                                        if (pageNum > 0 && pageNum <= totalPages) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center
                                                        ${pageNum === currentPage 
                                                            ? 'bg-primary text-white' 
                                                            : 'bg-dark-lighter text-white hover:bg-primary/20'
                                                        } transition-colors duration-200`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-dark-lighter text-white disabled:opacity-50 
                                        hover:bg-primary/20 transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MoviesPage; 