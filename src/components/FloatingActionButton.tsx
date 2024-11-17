import React from 'react';
import { Play, Heart, BookmarkPlus, Share2 } from 'lucide-react';

interface FloatingActionButtonProps {
    onPlayTrailer: () => void;
    onToggleFavorite: () => void;
    onToggleWatchlist: () => void;
    onShare: () => void;
    isFavorite: boolean;
    isWatchlist: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPlayTrailer,
    onToggleFavorite,
    onToggleWatchlist,
    onShare,
    isFavorite,
    isWatchlist
}) => {
    return (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4">
            <button
                onClick={onPlayTrailer}
                className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center
                    hover:bg-primary/80 transition-colors shadow-lg"
            >
                <Play className="w-6 h-6" />
            </button>
            <button
                onClick={onToggleFavorite}
                className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center
                    hover:bg-primary/80 transition-colors shadow-lg"
            >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
                onClick={onToggleWatchlist}
                className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center
                    hover:bg-primary/80 transition-colors shadow-lg"
            >
                <BookmarkPlus className={`w-6 h-6 ${isWatchlist ? 'fill-current' : ''}`} />
            </button>
            <button
                onClick={onShare}
                className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center
                    hover:bg-primary/80 transition-colors shadow-lg"
            >
                <Share2 className="w-6 h-6" />
            </button>
        </div>
    );
};

export default FloatingActionButton; 