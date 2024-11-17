import React from 'react';

interface VideoModalProps {
    videoKey: string;
    isOpen: boolean;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoKey, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-5xl aspect-video"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white hover:text-primary"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default VideoModal; 