import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({ defaultValue, children, className = '' }: { 
    defaultValue: string; 
    children: React.ReactNode;
    className?: string;
}) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className = '' }: { 
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`flex space-x-2 border-b border-gray-700 mb-6 ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger = ({ value, children, className = '' }: { 
    value: string; 
    children: React.ReactNode;
    className?: string;
}) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative
                ${isActive 
                    ? 'text-white border-b-2 border-primary' 
                    : 'text-gray-400 hover:text-white'}
                ${className}`}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ value, children, className = '' }: { 
    value: string; 
    children: React.ReactNode;
    className?: string;
}) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    if (context.activeTab !== value) return null;

    return <div className={className}>{children}</div>;
}; 