import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { getLatestMovies } from '../services/movieService';

const Carousel: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await getLatestMovies(5);
                if (response && response.results) {
                    setMovies(response.results);
                }
            } catch (error) {
                console.error('Error fetching movies for carousel:', error);
                setMovies([]);
            }
        };
        fetchMovies();

        // Add auto-slide functionality
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === (movies.length - 1) ? 0 : prevIndex + 1
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [movies.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === movies.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? movies.length - 1 : prevIndex - 1
        );
    };

    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <h2 className="text-3xl font-bold text-white mb-6">
                Premieres
                <span className="ml-2 text-sm font-normal text-gray-400">Featured Movies</span>
            </h2>
            <div className="relative w-full h-[600px] overflow-hidden rounded-xl">
                {/* Main Carousel */}
                <div className="relative w-full h-full">
                    {movies.map((movie, index) => {
                        let position = index - currentIndex;
                        if (position < 0) position += movies.length;
                        
                        return (
                            <Link
                                key={movie.id}
                                to={`/movie/${movie.id}`}
                                className={`absolute w-full h-full transition-all duration-500 ease-in-out transform
                                    ${position === 0 ? 'translate-x-0 opacity-100 z-10' : 
                                      position === 1 ? 'translate-x-full opacity-0' : 
                                      '-translate-x-full opacity-0'}`}
                            >
                                <img 
                                    src={movie.backdrop_path}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                
                                <div className={`absolute bottom-0 left-0 p-8 text-left transform transition-all duration-500
                                    ${position === 0 ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}`}>
                                    <h2 className="text-4xl font-bold text-white mb-4">{movie.title}</h2>
                                    <p className="text-gray-200 text-lg max-w-2xl line-clamp-3 mb-4">
                                        {movie.overview}
                                    </p>
                                    <span className="inline-block bg-primary text-white px-6 py-3 rounded-full 
                                        hover:bg-primary/80 transition-all duration-300 hover:scale-105">
                                        Watch Now
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 
                        rounded-full hover:bg-black/70 transition-all duration-300 z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 
                        rounded-full hover:bg-black/70 transition-all duration-300 z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                    {movies.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 
                                ${index === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel; 