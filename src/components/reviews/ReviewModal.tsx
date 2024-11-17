import React from 'react';
import ReviewForm from './ReviewForm';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
    onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    mediaId,
    mediaType,
    mediaTitle,
    onReviewSubmitted
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div 
                    className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
                    onClick={onClose}
                ></div>

                <div className="inline-block w-full max-w-xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-lighter rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">
                            Write a Review
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

                    <ReviewForm
                        mediaId={mediaId}
                        mediaType={mediaType}
                        mediaTitle={mediaTitle}
                        onReviewSubmitted={() => {
                            onReviewSubmitted();
                            onClose();
                        }}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewModal; 