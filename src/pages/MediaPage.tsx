import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Movie, TVShow, MediaItem } from '../types/movie';
import MovieCard from '../components/MovieCard';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface MediaPageProps {
    title: string;
    subtitle?: string;
    fetchMedia: (page: number) => Promise<{
        results: Movie[] | TVShow[];
        total_pages: number;
    }>;
    type: 'movie' | 'tv';
    itemsPerPage?: number;
}

// Add these genre maps
const MOVIE_GENRES: { [key: number]: string } = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const TV_GENRES: { [key: number]: string } = {
    10759: "Action & Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    10762: "Kids", 9648: "Mystery", 10763: "News", 10764: "Reality",
    10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk",
    10768: "War & Politics", 37: "Western"
};

const MediaPage: React.FC<MediaPageProps> = ({
    title,
    subtitle,
    fetchMedia,
    type,
    itemsPerPage = 20
}) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const { genreId } = useParams<{ genreId: string }>();
    const genreMap = type === 'movie' ? MOVIE_GENRES : TV_GENRES;
    const genreName = genreId ? genreMap[Number(genreId)] : '';

    // Update the title if it's a genre page
    const pageTitle = genreId ? `${genreName} ${type === 'movie' ? 'Movies' : 'TV Shows'}` : title;
    const pageSubtitle = genreId ? `Browse ${genreName} ${type === 'movie' ? 'Movies' : 'TV Shows'}` : subtitle;

    useEffect(() => {
        setCurrentPage(1);
        setMedia([]);
    }, [location.pathname]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchMedia(currentPage);
                const filteredResults = response.results.filter((item: any) => !item.adult);
                setMedia(filteredResults);
                setTotalPages(Math.min(response.total_pages, 500));
            } catch (error) {
                console.error('Error fetching content:', error);
                setError('Failed to load content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [fetchMedia, currentPage, location.pathname]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <NavBar />
            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{pageTitle}</h1>
                            {pageSubtitle && (
                                <p className="text-gray-400 mt-2">{pageSubtitle}</p>
                            )}
                        </div>
                        <div className="text-gray-400">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-center py-8">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Grid Layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {media.map(item => (
                                    <MovieCard 
                                        key={item.id} 
                                        media={item} 
                                        type={type}
                                    />
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

                                <div className="flex space-x-2">
                                    {renderPagination().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center
                                                    ${page === currentPage 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-dark-lighter text-white hover:bg-primary/20'
                                                    } transition-colors duration-200`}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400">
                                                {page}
                                            </span>
                                        )
                                    ))}
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

export default MediaPage; 