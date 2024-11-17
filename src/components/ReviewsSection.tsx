import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import ReviewList from './reviews/ReviewList';
import ReviewModal from './reviews/ReviewModal';

interface ReviewsSectionProps {
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
    isReviewModalOpen: boolean;
    setIsReviewModalOpen: (open: boolean) => void;
    reviewListKey: number;
    setReviewListKey: (key: number) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    mediaId,
    mediaType,
    mediaTitle,
    isReviewModalOpen,
    setIsReviewModalOpen,
    reviewListKey,
    setReviewListKey
}) => {
    const navigate = useNavigate();

    const handleReviewClick = () => {
        if (!auth.currentUser) {
            navigate('/login');
            return;
        }
        setIsReviewModalOpen(true);
    };

    return (
        <section className="mt-12 bg-dark-lighter rounded-lg p-6">
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Reviews</h2>
                    <button
                        onClick={handleReviewClick}
                        className="px-6 py-2 rounded-lg bg-primary text-white font-medium
                            hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                            />
                        </svg>
                        Write a Review
                    </button>
                </div>
                
                <ReviewList 
                    key={reviewListKey}
                    mediaId={mediaId} 
                    mediaType={mediaType} 
                    mediaTitle={mediaTitle}
                />
            </div>

            {auth.currentUser && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    mediaId={mediaId}
                    mediaType={mediaType}
                    mediaTitle={mediaTitle}
                    onReviewSubmitted={() => {
                        setReviewListKey(prev => prev + 1);
                        setIsReviewModalOpen(false);
                    }}
                />
            )}
        </section>
    );
};

export default ReviewsSection; 