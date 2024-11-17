import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { addReview } from '../../services/reviewService';

interface ReviewFormProps {
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
    onReviewSubmitted?: () => void;
    onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
    mediaId, 
    mediaType, 
    mediaTitle, 
    onReviewSubmitted,
    onCancel 
}) => {
    const [rating, setRating] = useState(7);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to submit a review');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await addReview({
                userId: user.uid,
                userEmail: user.email || 'Anonymous',
                mediaId,
                mediaType,
                mediaTitle,
                rating,
                comment
            });
            
            setComment('');
            setRating(7);
            onReviewSubmitted?.();
        } catch (err) {
            setError('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-dark-lighter p-6 rounded-lg border border-gray-700">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (1-10)
                </label>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                    {[...Array(10)].map((_, index) => {
                        const value = index + 1;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setRating(value)}
                                className={`w-10 h-10 rounded-lg ${
                                    value <= rating 
                                        ? 'bg-primary text-white' 
                                        : 'bg-gray-700 text-gray-300'
                                } hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center font-medium`}
                            >
                                {value}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-1 text-sm text-gray-400">
                    {rating <= 3 && 'Poor'}
                    {rating > 3 && rating <= 5 && 'Average'}
                    {rating > 5 && rating <= 7 && 'Good'}
                    {rating > 7 && rating <= 9 && 'Great'}
                    {rating === 10 && 'Masterpiece'}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                        text-white px-4 py-2 focus:outline-none focus:border-primary"
                    placeholder="Share your thoughts about this title..."
                    required
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white font-medium
                            hover:bg-gray-600 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-primary text-white font-medium
                        hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm; 