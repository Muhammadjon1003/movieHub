import React from 'react';
import { Link } from 'react-router-dom';

// Genre data
const MOVIE_GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

const TV_GENRES = [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
    { id: 37, name: "Western" }
];

interface GenresModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GenresModal: React.FC<GenresModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="absolute top-[calc(100%+0.5rem)] left-0 w-[600px] bg-dark-lighter rounded-lg 
                shadow-xl border border-gray-700 p-6 z-[9999]"
        >
            <div className="grid grid-cols-2 gap-8">
                {/* Movies Section */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        Movie Genres
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {MOVIE_GENRES.map(genre => (
                            <Link
                                key={genre.id}
                                to={`/movies/genre/${genre.id}`}
                                className="text-gray-300 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-md transition-all duration-200"
                                onClick={onClose}
                            >
                                {genre.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* TV Shows Section */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        TV Show Genres
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {TV_GENRES.map(genre => (
                            <Link
                                key={genre.id}
                                to={`/tv-shows/genre/${genre.id}`}
                                className="text-gray-300 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-md transition-all duration-200"
                                onClick={onClose}
                            >
                                {genre.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenresModal; 