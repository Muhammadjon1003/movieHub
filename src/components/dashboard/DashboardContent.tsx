import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import WatchList from '../watchlist/WatchList';
import { getUserViewStats } from '../../services/viewsService';
import { getUserReviewCount } from '../../services/reviewService';
import { getFavoriteCount } from '../../services/favoriteService';
import { getWatchlistStatusCounts } from '../../services/watchlistService';

interface DashboardContentProps {
    userId: string;
}

interface ViewStats {
    totalViews: number;
    movieViews: number;
    tvViews: number;
}

interface WatchlistCounts {
    planToWatch: number;
    watching: number;
    completed: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ userId }) => {
    const user = auth.currentUser;
    const [viewStats, setViewStats] = useState<ViewStats>({
        totalViews: 0,
        movieViews: 0,
        tvViews: 0
    });
    const [reviewCount, setReviewCount] = useState(0);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [watchlistCounts, setWatchlistCounts] = useState<WatchlistCounts>({
        planToWatch: 0,
        watching: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [stats, reviews, favorites, watchlist] = await Promise.all([
                    getUserViewStats(userId),
                    getUserReviewCount(userId),
                    getFavoriteCount(userId),
                    getWatchlistStatusCounts(userId)
                ]);
                setViewStats(stats);
                setReviewCount(reviews);
                setFavoriteCount(favorites);
                setWatchlistCounts(watchlist);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-medium">{user?.displayName || 'User'}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Views */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/20 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/20 rounded-lg">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Views</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : viewStats.totalViews}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Movie Views */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-6 border border-blue-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Movie Views</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : viewStats.movieViews}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TV Show Views */}
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">TV Show Views</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : viewStats.tvViews}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Reviews Count */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-6 border border-green-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Reviews Written</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : reviewCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Favorites Count */}
                <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-xl p-6 border border-red-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-red-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Favorites</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : favoriteCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Plan to Watch Card */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-xl p-6 border border-yellow-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Plan to Watch</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : watchlistCounts.planToWatch}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Watching Card */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl p-6 border border-blue-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Watching</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : watchlistCounts.watching}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Completed Card */}
                <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl p-6 border border-green-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Completed</p>
                            <p className="text-2xl font-bold text-white">
                                {loading ? '...' : watchlistCounts.completed}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Watchlist Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">My Watchlist</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm font-medium">
                            Plan to Watch ({watchlistCounts.planToWatch})
                        </button>
                        <button className="px-4 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-medium">
                            Watching ({watchlistCounts.watching})
                        </button>
                        <button className="px-4 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium">
                            Completed ({watchlistCounts.completed})
                        </button>
                    </div>
                </div>
                <WatchList userId={userId} />
            </div>
        </div>
    );
};

export default DashboardContent; 