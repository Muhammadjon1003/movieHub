import React from 'react';

export const Avatar = ({ 
    children, 
    className = '' 
}: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`relative inline-block ${className}`}>
            {children}
        </div>
    );
};

export const AvatarImage = ({ 
    src, 
    alt,
    className = '' 
}: { 
    src: string;
    alt: string;
    className?: string;
}) => {
    return (
        <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover rounded-full ${className}`}
        />
    );
};

export const AvatarFallback = ({ 
    children,
    className = '' 
}: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`w-full h-full flex items-center justify-center 
            bg-gray-700 text-gray-200 rounded-full ${className}`}>
            {children}
        </div>
    );
}; 