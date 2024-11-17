import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';

interface WatchlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
    totalEpisodes?: number;
    onSubmit: (data: WatchlistEntry) => Promise<void>;
}

export interface WatchlistEntry {
    status: 'plan_to_watch' | 'watching' | 'completed';
    episodesWatched?: number;
    rating?: number;
    notes?: string;
}

const WatchlistModal: React.FC<WatchlistModalProps> = ({
    isOpen,
    onClose,
    mediaId,
    mediaType,
    mediaTitle,
    totalEpisodes,
    onSubmit
}) => {
    const [status, setStatus] = useState<WatchlistEntry['status']>('plan_to_watch');
    const [episodesWatched, setEpisodesWatched] = useState<number>(0);
    const [rating, setRating] = useState<number>(0);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'completed' && mediaType === 'tv' && totalEpisodes) {
            setEpisodesWatched(totalEpisodes);
        } else if (status === 'plan_to_watch') {
            setEpisodesWatched(0);
        }
    }, [status, mediaType, totalEpisodes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit({
                status,
                ...(mediaType === 'tv' && status !== 'plan_to_watch' && { episodesWatched }),
                ...(status === 'completed' && { rating }),
                ...(notes && { notes })
            });
            onClose();
        } catch (err) {
            setError('Failed to update watchlist');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
                    onClick={onClose}
                ></div>

                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-lighter rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">
                            Add to Watchlist
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Status Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Status
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['plan_to_watch', 'watching', 'completed'].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s as WatchlistEntry['status'])}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium
                                            ${status === s 
                                                ? 'bg-primary text-white' 
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            } transition-colors`}
                                    >
                                        {s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Episodes Watched (for TV Shows) */}
                        {mediaType === 'tv' && status !== 'plan_to_watch' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Episodes Watched
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={totalEpisodes || undefined}
                                    value={episodesWatched}
                                    onChange={(e) => setEpisodesWatched(Number(e.target.value))}
                                    className="w-full px-3 py-2 bg-dark border border-gray-600 rounded-lg text-white"
                                />
                                {totalEpisodes && (
                                    <p className="mt-1 text-sm text-gray-400">
                                        Total Episodes: {totalEpisodes}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Rating (only for completed) */}
                        {status === 'completed' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rating
                                </label>
                                <div className="flex items-center space-x-2 flex-wrap gap-2">
                                    {[...Array(10)].map((_, index) => {
                                        const value = index + 1;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setRating(value)}
                                                className={`w-8 h-8 rounded-lg ${
                                                    value <= rating 
                                                        ? 'bg-primary text-white' 
                                                        : 'bg-gray-700 text-gray-300'
                                                } hover:bg-primary/90 transition-colors`}
                                            >
                                                {value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Notes (optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-dark border border-gray-600 rounded-lg text-white"
                                placeholder="Add any notes..."
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add to Watchlist'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WatchlistModal; 