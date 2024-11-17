import React from 'react';

export const Badge = ({ 
    children,
    variant = 'default',
    className = '' 
}: { 
    children: React.ReactNode;
    variant?: 'default' | 'secondary' | 'outline';
    className?: string;
}) => {
    const variants = {
        default: 'bg-primary text-white',
        secondary: 'bg-gray-700 text-gray-200',
        outline: 'border border-gray-700 text-gray-200'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full 
            text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}; 