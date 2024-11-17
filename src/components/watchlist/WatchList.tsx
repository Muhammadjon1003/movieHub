import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Star } from 'lucide-react';

interface WatchListProps {
    userId: string;
}

interface WatchlistItem {
    id: string;
    mediaId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath: string;
    status: 'plan_to_watch' | 'watching' | 'completed';
    addedAt: Date;
    episodesWatched?: number;
    totalEpisodes?: number;
    rating?: number;
}

const WatchList: React.FC<WatchListProps> = ({ userId }) => {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const watchlistRef = collection(db, 'watchlist');
                const q = query(watchlistRef, where('userId', '==', userId));
                const querySnapshot = await getDocs(q);
                
                const items: WatchlistItem[] = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() } as WatchlistItem);
                });
                
                setWatchlist(items);
            } catch (error) {
                console.error('Error fetching watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, [userId]);

    const filterByStatus = (status: WatchlistItem['status']) => {
        return watchlist.filter(item => item.status === status);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Plan to Watch Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-500 mb-4">Plan to Watch</h3>
                <div className="space-y-4 bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20 min-h-[400px]">
                    {filterByStatus('plan_to_watch').map((item) => (
                        <WatchlistCard key={item.id} item={item} />
                    ))}
                    {filterByStatus('plan_to_watch').length === 0 && (
                        <p className="text-gray-400 text-center py-4">No items in plan to watch</p>
                    )}
                </div>
            </div>

            {/* Watching Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-500 mb-4">Watching</h3>
                <div className="space-y-4 bg-blue-500/5 rounded-xl p-4 border border-blue-500/20 min-h-[400px]">
                    {filterByStatus('watching').map((item) => (
                        <WatchlistCard key={item.id} item={item} />
                    ))}
                    {filterByStatus('watching').length === 0 && (
                        <p className="text-gray-400 text-center py-4">No items currently watching</p>
                    )}
                </div>
            </div>

            {/* Completed Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-500 mb-4">Completed</h3>
                <div className="space-y-4 bg-green-500/5 rounded-xl p-4 border border-green-500/20 min-h-[400px]">
                    {filterByStatus('completed').map((item) => (
                        <WatchlistCard key={item.id} item={item} />
                    ))}
                    {filterByStatus('completed').length === 0 && (
                        <p className="text-gray-400 text-center py-4">No completed items</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Separate component for watchlist items
const WatchlistCard: React.FC<{ item: WatchlistItem }> = ({ item }) => {
    return (
        <div className="bg-dark-lighter rounded-lg overflow-hidden border border-gray-800 hover:border-primary transition-colors duration-300">
            <div className="flex gap-4 p-4">
                <img
                    src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                    alt={item.title}
                    className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="font-medium text-white text-sm mb-1">{item.title}</h3>
                        <span className="text-xs text-gray-400">
                            {item.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                    </div>
                    {item.mediaType === 'tv' && item.totalEpisodes && (
                        <div className="text-xs text-gray-400">
                            Episodes: {item.status === 'plan_to_watch' 
                                ? `0 / ${item.totalEpisodes}`
                                : item.status === 'completed'
                                ? `${item.totalEpisodes} / ${item.totalEpisodes}`
                                : `${item.episodesWatched || 0} / ${item.totalEpisodes}`
                            }
                        </div>
                    )}
                    {item.rating && (
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs">{item.rating}/10</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WatchList; 