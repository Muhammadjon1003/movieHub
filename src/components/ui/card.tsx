import React from 'react';

export const Card = ({ 
    children, 
    className = '' 
}: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`bg-dark-lighter rounded-lg overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ 
    children, 
    className = '' 
}: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ 
    children, 
    className = '' 
}: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <h3 className={`text-xl font-semibold ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent = ({ 
    children, 
    className = '' 
}: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`p-6 pt-0 ${className}`}>
            {children}
        </div>
    );
}; 