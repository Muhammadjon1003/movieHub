import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchMovies, searchTVShows } from '../services/movieService';
import { MediaItem } from '../types/movie';

interface SearchResult extends MediaItem {
    mediaType: string;
    title: string;
    release_date: string;
    popularity?: number;
}

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        try {
            const [movieResults, tvResults] = await Promise.all([
                searchMovies(searchQuery),
                searchTVShows(searchQuery)
            ]);

            // Combine and mark results with their type
            const combinedResults = [
                ...movieResults.map(movie => ({ ...movie, mediaType: 'movie' })),
                ...tvResults.map(show => ({ ...show, mediaType: 'tv' }))
            ].sort((a, b) => b.popularity - a.popularity).slice(0, 8);

            setResults(combinedResults);
            setIsOpen(true);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResultClick = (result: any) => {
        setIsOpen(false);
        setQuery('');
        navigate(`/${result.mediaType}/${result.id}`);
    };

    const sortResults = (results: SearchResult[]) => {
        return [...results].sort((a, b) => {
            const popA = a.popularity || 0;
            const popB = b.popularity || 0;
            return popB - popA;
        });
    };

    return (
        <div ref={searchRef} className="relative max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search movies and TV shows..."
                    className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 pr-12
                        rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-dark-lighter rounded-lg shadow-xl border border-gray-700 
                    overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400">
                            Searching...
                        </div>
                    ) : (
                        <div className="max-h-[400px] overflow-y-auto">
                            {sortResults(results).map((result) => (
                                <div
                                    key={`${result.mediaType}-${result.id}`}
                                    onClick={() => handleResultClick(result)}
                                    className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer
                                        transition-colors"
                                >
                                    {result.poster_path ? (
                                        <img
                                            src={result.poster_path}
                                            alt={result.title || result.name}
                                            className="w-12 h-18 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-18 bg-white/10 rounded flex items-center 
                                            justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <div className="flex-grow">
                                        <h4 className="text-white font-medium">
                                            {result.title || result.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span className="capitalize">{result.mediaType}</span>
                                            <span>•</span>
                                            <span>
                                                {new Date(
                                                    result.release_date || result.first_air_date
                                                ).getFullYear()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar; 