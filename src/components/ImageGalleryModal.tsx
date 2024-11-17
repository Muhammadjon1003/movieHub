import React, { useState } from 'react';

interface ImageGalleryModalProps {
    images: string[];
    isOpen: boolean;
    initialIndex: number;
    onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ 
    images, 
    isOpen, 
    initialIndex, 
    onClose 
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    if (!isOpen) return null;

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="relative max-w-7xl mx-auto px-4"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-4 text-white hover:text-primary"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative">
                    <img
                        src={images[currentIndex]}
                        alt={`Gallery image ${currentIndex + 1}`}
                        className="max-h-[80vh] mx-auto"
                    />

                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary"
                    >
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary"
                    >
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="text-center text-white mt-4">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default ImageGalleryModal; 