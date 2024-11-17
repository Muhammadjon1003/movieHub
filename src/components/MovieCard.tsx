import React from 'react';
import { Link } from 'react-router-dom';
import { MediaItem, Movie, TVShow } from '../types/movie';

interface MovieCardProps {
    media: MediaItem;
    type: 'movie' | 'tv';
}

const MovieCard: React.FC<MovieCardProps> = ({ media, type }) => {
    const title = type === 'movie' ? (media as Movie).title : (media as TVShow).name;
    const date = type === 'movie' 
        ? (media as Movie).release_date 
        : (media as TVShow).first_air_date;

    const fallbackImage = 'https://via.placeholder.com/300x450?text=No+Image';
    
    return (
        <Link 
            to={`/${type}/${media.id}`} 
            className="relative group/card bg-dark-lighter rounded-lg overflow-hidden
                transform transition-transform duration-300 hover:scale-105"
        >
            <div className="relative">
                <img 
                    src={media.poster_path || fallbackImage}
                    alt={title}
                    className="w-full h-[300px] object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = fallbackImage;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent 
                    opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-gray-300 text-sm line-clamp-3">
                            {media.overview}
                        </p>
                    </div>
                </div>
            </div>
            <div className="absolute top-2 right-2 z-10 bg-black/60 px-2 py-1 rounded-md
                flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white font-semibold">
                    {media.vote_average?.toFixed(1)}
                </span>
            </div>
            <div className="p-4 bg-dark-lighter">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
                <span className="text-primary text-sm">
                    {new Date(date).toLocaleDateString()}
                </span>
            </div>
        </Link>
    );
};

export default MovieCard; 