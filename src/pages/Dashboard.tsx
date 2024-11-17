import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import Carousel from '../components/Carousel';
import MoviesSection from '../components/MoviesSection';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
    getLatestMovies, 
    getPopularMovies, 
    getTopRatedMovies,
    getNewTVShows,
    getPopularTVShows,
    getTopRatedTVShows 
} from '../services/movieService';
import { MediaItem } from '../types/movie';
import PersonalizedRecommendations from '../components/recommendations/PersonalizedRecommendations';

interface ExtendedMediaItem extends MediaItem {
    sectionType?: string;
}

const Dashboard: React.FC = () => {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [allMedia, setAllMedia] = useState<ExtendedMediaItem[]>([]);
    console.log(allMedia);
    const handleMediaLoaded = (media: MediaItem[], sectionType: string) => {
        setAllMedia(prev => {
            const filteredPrev = prev.filter(item => item.sectionType !== sectionType);
            
            const newMedia = media.map(item => ({
                ...item,
                sectionType
            }));

            return [...filteredPrev, ...newMedia];
        });
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <NavBar />
            <main className="flex-grow pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="pt-24 pb-16">
                        <SearchBar />
                    </div>
                    <div className="mb-12">
                        <Carousel />
                    </div>
                    <div className="flex gap-8">
                        <div className="w-[calc(100%-350px)]">
                            <MoviesSection 
                                title="New Movies"
                                subtitle="Latest Releases"
                                fetchMovies={getLatestMovies}
                                onMovieSelect={setSelectedMedia}
                                onMoviesLoaded={(media) => handleMediaLoaded(media, 'new-movies')}
                                type="movie"
                                linkTo="/movies/latest"
                            />
                            <MoviesSection 
                                title="Popular Movies"
                                subtitle="Trending Worldwide"
                                fetchMovies={getPopularMovies}
                                onMovieSelect={setSelectedMedia}
                                onMoviesLoaded={(media) => handleMediaLoaded(media, 'popular-movies')}
                                type="movie"
                                linkTo="/movies/popular"
                            />
                            <MoviesSection 
                                title="Top Rated Movies"
                                subtitle="All Time Favorites"
                                fetchMovies={getTopRatedMovies}
                                onMovieSelect={setSelectedMedia}
                                onMoviesLoaded={(media) => handleMediaLoaded(media, 'top-rated-movies')}
                                type="movie"
                                linkTo="/movies/top-rated"
                            />
                            <MoviesSection 
                                title="New TV Shows"
                                subtitle="Latest Episodes"
                                fetchMovies={getNewTVShows}
                                onMovieSelect={setSelectedMedia}
                                onMoviesLoaded={(media) => handleMediaLoaded(media, 'new-tv')}
                                type="tv"
                                linkTo="/tv-shows/latest"
                            />
                            <MoviesSection 
                                title="Popular TV Shows"
                                subtitle="Trending Series"
                                fetchMovies={getPopularTVShows}
                                onMovieSelect={setSelectedMedia}
                                onMoviesLoaded={(media) => handleMediaLoaded(media, 'popular-tv')}
                                type="tv"
                                linkTo="/tv-shows/popular"
                            />
                            <MoviesSection 
                                title="Top Rated TV Shows"
                                subtitle="Must Watch Series"
                                fetchMovies={getTopRatedTVShows}
                                onMovieSelect={setSelectedMedia}
                                onMoviesLoaded={(media) => handleMediaLoaded(media, 'top-rated-tv')}
                                type="tv"
                                linkTo="/tv-shows/top-rated"
                            />
                        </div>
                        <div className="w-[350px] space-y-8">
                            <Sidebar movie={selectedMedia} />
                            <div className="bg-dark-lighter rounded-lg p-6">
                                <h2 className="text-xl font-bold text-white mb-4">
                                    Recommended For You
                                </h2>
                                <PersonalizedRecommendations />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard; 