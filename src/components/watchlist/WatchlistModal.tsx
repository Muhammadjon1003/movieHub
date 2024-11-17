import React, { useState } from 'react';

interface WatchlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaId: number;
    mediaType: string;
    mediaTitle: string;
    totalEpisodes?: number;
    onSubmit: (data: WatchlistSubmitData) => Promise<void>;
}

interface WatchlistSubmitData {
    status: 'plan_to_watch' | 'watching' | 'completed';
    progress?: number;
}

const WatchlistModal: React.FC<WatchlistModalProps> = ({
    isOpen,
    onClose,
    mediaType,
    totalEpisodes,
    onSubmit
}) => {
    const [status, setStatus] = useState<'plan_to_watch' | 'watching' | 'completed'>('plan_to_watch');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit({
                status,
                progress: mediaType === 'tv' ? progress : undefined
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
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="fixed inset-0 bg-black/75" onClick={onClose} />
                
                <div className="relative bg-dark-lighter rounded-lg w-full max-w-md p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Add to Watchlist</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as typeof status)}
                                className="w-full bg-dark rounded-lg border border-gray-600 text-white px-4 py-2"
                            >
                                <option value="plan_to_watch">Plan to Watch</option>
                                <option value="watching">Watching</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {mediaType === 'tv' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Progress
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={0}
                                        max={totalEpisodes || undefined}
                                        value={progress}
                                        onChange={(e) => setProgress(Number(e.target.value))}
                                        className="w-20 bg-dark rounded-lg border border-gray-600 text-white px-4 py-2"
                                    />
                                    <span className="text-gray-400">
                                        / {totalEpisodes || '?'} episodes
                                    </span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
                                    transition-colors disabled:opacity-50"
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