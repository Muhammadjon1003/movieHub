import React, { useState, useEffect, useCallback } from 'react';
import { getMediaReviews } from '../../services/reviewService';
import { getTMDBReviews } from '../../services/movieService';
import { Review } from '../../types/review';

interface ReviewListProps {
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
}

interface TMDBReview {
    id: string;
    author: string;
    content: string;
    created_at: string;
    author_details: {
        rating: number | null;
    };
}

const ReviewList: React.FC<ReviewListProps> = ({ mediaId, mediaType}) => {
    const [firebaseReviews, setFirebaseReviews] = useState<Review[]>([]);
    const [tmdbReviews, setTmdbReviews] = useState<TMDBReview[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const [firebaseData, tmdbData] = await Promise.all([
                getMediaReviews(mediaId, mediaType),
                getTMDBReviews(mediaId, mediaType)
            ]);

            setFirebaseReviews(firebaseData);
            setTmdbReviews(tmdbData.results || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [mediaId, mediaType]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const allReviews = [
        ...firebaseReviews.map(review => ({
            id: review.id,
            author: review.userEmail,
            content: review.comment,
            rating: review.rating,
            created_at: review.createdAt,
            isFirebase: true
        })),
        ...tmdbReviews.map(review => ({
            id: review.id,
            author: review.author,
            content: review.content,
            rating: review.author_details?.rating || 0,
            created_at: review.created_at,
            isFirebase: false
        }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return (
        <div className="space-y-6">
            {allReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    No reviews yet. Be the first to review!
                </div>
            ) : (
                allReviews.map((review) => (
                    <div key={`${review.isFirebase ? 'fb' : 'tmdb'}-${review.id}`} 
                         className="bg-dark-lighter rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <div className={`w-8 h-8 rounded-full ${
                                    review.isFirebase ? 'bg-primary' : 'bg-blue-500'
                                } flex items-center justify-center text-white`}>
                                    {review.author[0].toUpperCase()}
                                </div>
                                <span className="text-gray-300">{review.author}</span>
                                {!review.isFirebase && (
                                    <span className="text-xs text-gray-500">(TMDB)</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="text-primary font-bold text-lg">{review.rating}</span>
                                <span className="text-gray-400">/10</span>
                            </div>
                        </div>
                        <p className="text-white">{review.content}</p>
                        <div className="mt-2 text-sm text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList; 