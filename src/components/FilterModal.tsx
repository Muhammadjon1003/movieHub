import React from 'react';
import { Link } from 'react-router-dom';

interface FilterSection {
    title: string;
    icon: React.ReactNode;
    options: { id: number | string; name: string }[];
    baseUrl: string;
}

interface FilterModalProps {
    sections: FilterSection[];
    onClose: () => void;
    isOpen: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({ sections, onClose, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal Content */}
                <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-dark-lighter rounded-lg shadow-xl z-[101]">
                    <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white">Browse</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        {sections.map((section, index) => (
                            <div key={section.title} className={index > 0 ? 'mt-8' : ''}>
                                <div className="flex items-center gap-2 mb-4">
                                    {section.icon}
                                    <h4 className="text-white font-medium">{section.title}</h4>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {section.options.map((option) => (
                                        <Link
                                            key={option.id}
                                            to={`${section.baseUrl}/${option.id}`}
                                            onClick={onClose}
                                            className="px-4 py-2 bg-dark rounded-lg text-gray-300 text-sm
                                                hover:bg-primary hover:text-white transition-colors duration-200"
                                        >
                                            {option.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal; 