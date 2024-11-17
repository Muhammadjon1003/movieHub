import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Star } from 'lucide-react';
import { getRecommendations } from '../../services/movieService';
import { RecommendedItem } from '../../types/movie';

const PersonalizedRecommendations: React.FC = () => {
    const [recommendations, setRecommendations] = useState<RecommendedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!auth.currentUser) {
                setLoading(false);
                return;
            }

            try {
                // Get user's favorites
                const favoritesQuery = query(
                    collection(db, 'favorites'),
                    where('userId', '==', auth.currentUser.uid)
                );
                const favoritesSnapshot = await getDocs(favoritesQuery);
                const favorites = favoritesSnapshot.docs.map(doc => doc.data());

                // Get user's watchlist
                const watchlistQuery = query(
                    collection(db, 'watchlist'),
                    where('userId', '==', auth.currentUser.uid)
                );
                const watchlistSnapshot = await getDocs(watchlistQuery);
                const watchlist = watchlistSnapshot.docs.map(doc => doc.data());

                // Combine and deduplicate media IDs
                const mediaItems = [...favorites, ...watchlist];
                const uniqueMediaIds = Array.from(new Set(
                    mediaItems.map(item => ({ id: item.mediaId, type: item.mediaType }))
                ));

                // Get recommendations for each item
                const recommendationsPromises = uniqueMediaIds.map(({ id, type }) => 
                    getRecommendations(id, type)
                );

                const recommendationsResults = await Promise.all(recommendationsPromises);

                // Combine and shuffle recommendations
                const allRecommendations = recommendationsResults
                    .flat()
                    .filter(item => !!item.poster_path);

                // Shuffle and take first 3
                const shuffled = allRecommendations
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                setRecommendations(shuffled as RecommendedItem[]);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!auth.currentUser) {
        return (
            <div className="text-center py-4 text-gray-400">
                Sign in to get personalized recommendations
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className="text-center py-4 text-gray-400">
                Add items to your favorites or watchlist to get personalized recommendations
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {recommendations.map((item) => (
                <Link 
                    key={`${item.mediaType}-${item.id}`}
                    to={`/${item.mediaType}/${item.id}`}
                    className="flex gap-4 group"
                >
                    <div className="w-[100px] h-[150px] flex-shrink-0 overflow-hidden rounded-lg">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="flex-grow">
                        <h4 className="text-white font-semibold group-hover:text-primary transition-colors">
                            {item.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                            {new Date(item.release_date || item.first_air_date || '').getFullYear()}
                        </p>
                        <div className="flex items-center mt-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-gray-300 ml-1">
                                {item.vote_average.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default PersonalizedRecommendations; 