import React from 'react';
import { MediaItem } from '../types/movie';
import RandomMoviesSwiper from './RandomMoviesSwiper';

interface SidebarProps {
    movie: MediaItem | null;
}

const Sidebar: React.FC<SidebarProps> = ({ movie }) => {
    if (!movie) return null;

    return (
        <div className="w-[350px] bg-dark-lighter rounded-lg overflow-hidden">
            <RandomMoviesSwiper />
        </div>
    );
};

export default Sidebar; 