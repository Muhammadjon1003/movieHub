import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Movie, MediaItem, TVShow } from '../types/movie';
import MovieCard from './MovieCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MoviesSectionProps {
    title: string;
    subtitle: string;
    fetchMovies: (count: number) => Promise<{ 
        results: Movie[] | TVShow[];
        total_pages?: number;
    }>;
    movieCount?: number;
    onMovieSelect?: (media: MediaItem) => void;
    onMoviesLoaded?: (media: MediaItem[]) => void;
    type: 'movie' | 'tv';
    linkTo: string;
}

const MoviesSection: React.FC<MoviesSectionProps> = ({ 
    title, 
    subtitle, 
    fetchMovies, 
    movieCount = 10,
    onMovieSelect,
    onMoviesLoaded,
    type,
    linkTo
}) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadMovies = async () => {
            try {
                setLoading(true);
                const response = await fetchMovies(movieCount);
                
                if (!mounted) return;

                if (response && response.results) {
                    setMovies(response.results);
                    
                    if (response.results.length > 0) {
                        onMovieSelect?.(response.results[0]);
                        onMoviesLoaded?.(response.results);
                    }
                }
            } catch (error) {
                console.error('Error loading movies:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadMovies();

        return () => {
            mounted = false;
        };
    }, [fetchMovies, movieCount]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 relative">
            <div className="px-8 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold text-white">{title}</h2>
                        <span className="text-sm font-normal text-gray-400">{subtitle}</span>
                    </div>
                    <Link 
                        to={linkTo}
                        className="text-primary hover:text-primary/80 transition-colors duration-300 
                            flex items-center gap-2"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="px-8">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={4}
                    navigation={true}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    loop={movies.length > 4}
                    className="movie-swiper"
                    onSlideChange={(swiper) => {
                        const newMovie = movies[swiper.realIndex];
                        if (newMovie) {
                            onMovieSelect?.(newMovie);
                        }
                    }}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 10 },
                        640: { slidesPerView: 2, spaceBetween: 15 },
                        768: { slidesPerView: 3, spaceBetween: 15 },
                        1024: { slidesPerView: 4, spaceBetween: 20 }
                    }}
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id}>
                            <MovieCard media={movie} type={type} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default MoviesSection; 