import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, BookmarkPlus } from 'lucide-react';
import { getMediaDetails } from '../services/movieService';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ReviewList from '../components/reviews/ReviewList';
import ReviewModal from '../components/reviews/ReviewModal';
import { auth } from '../config/firebase';
import { incrementPageView } from '../services/viewsService';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../services/favoriteService';
import WatchlistModal from '../components/watchlist/WatchlistModal';
import { addToWatchlist, checkIsInWatchlist } from '../services/watchlistService';
import { MovieDetails } from '../types/movie';

// Import constants
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const MoviePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [media, setMedia] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewListKey, setReviewListKey] = useState(0);
    const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const navigate = useNavigate();

    const mediaType = location.pathname.startsWith('/movie') ? 'movie' : 'tv';

    useEffect(() => {
        const fetchMediaDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getMediaDetails(parseInt(id), mediaType);
                setMedia(data);
            } catch (error) {
                console.error('Error fetching media details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMediaDetails();

        if (auth.currentUser && id) {
            incrementPageView(auth.currentUser.uid, id.toString(), mediaType);
        }
    }, [id, mediaType]);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (auth.currentUser && id) {
                const status = await checkIsFavorite(auth.currentUser.uid, Number(id));
                setIsFavorite(status);
            }
        };

        checkFavoriteStatus();
    }, [id]);

    useEffect(() => {
        const checkWatchlistStatus = async () => {
            if (auth.currentUser && id) {
                const status = await checkIsInWatchlist(auth.currentUser.uid, Number(id));
                setIsInWatchlist(status);
            }
        };

        checkWatchlistStatus();
    }, [id]);

    const handleReviewClick = () => {
        if (!auth.currentUser) {
            // Redirect to login page if user is not authenticated
            navigate('/login');
            return;
        }
        setIsReviewModalOpen(true);
    };

    const handleFavoriteClick = async () => {
        if (!auth.currentUser || !media) return;

        // Optimistic update
        setIsFavorite(prev => !prev);

        try {
            if (!isFavorite) {
                await addToFavorites(
                    auth.currentUser.uid,
                    Number(id),
                    mediaType,
                    media.title || media.name || '',
                    media.poster_path || ''
                );
            } else {
                await removeFromFavorites(auth.currentUser.uid, Number(id));
            }
        } catch (error) {
            // Revert on error
            setIsFavorite(prev => !prev);
            console.error('Error updating favorites:', error);
        }
    };

    const handleWatchlistClick = () => {
        if (!auth.currentUser) {
            navigate('/login');
            return;
        }
        setIsWatchlistModalOpen(true);
    };

    if (loading || !media) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground relative flex flex-col">
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: media.backdrop_path 
                        ? `url(${BACKDROP_BASE_URL}${media.backdrop_path})`
                        : 'none' 
                }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

            <NavBar />
            
            <main className="relative z-10 flex-1">
                <div className="container mx-auto px-4 py-8 mt-24">
                <div className="max-w-7xl mx-auto">
                        {/* Movie Info Section */}
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={media.poster_path 
                                    ? `${IMAGE_BASE_URL}${media.poster_path}`
                                    : '/placeholder-poster.png'
                                }
                                alt={media.title || media.name}
                                className="w-[300px] rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-grow flex flex-col justify-end">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-5xl font-bold mb-3 text-white">{media.title}</h1>
                                        {media.tagline && (
                                            <p className="text-2xl text-gray-300 mb-6 italic">"{media.tagline}"</p>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={handleFavoriteClick}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl 
                                                ${isFavorite 
                                                    ? 'bg-red-500 hover:bg-red-600' 
                                                    : 'bg-white/10 hover:bg-white/20'
                                                } text-white transition-all duration-300 group`}
                                        >
                                            <Heart 
                                                className={`h-5 w-5 transition-all duration-300 
                                                    ${isFavorite 
                                                        ? "fill-white scale-110" 
                                                        : "group-hover:scale-110"}`} 
                                            />
                                            {isFavorite ? "Favorited" : "Add to Favorites"}
                                        </button>
                                        <button
                                            onClick={handleWatchlistClick}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl
                                                ${isInWatchlist 
                                                    ? 'bg-primary hover:bg-primary/90' 
                                                    : 'bg-white/10 hover:bg-white/20'
                                                } text-white transition-all duration-300 group`}
                                        >
                                            <BookmarkPlus 
                                                className={`h-5 w-5 transition-all duration-300
                                                    ${isInWatchlist 
                                                        ? "fill-white scale-110" 
                                                        : "group-hover:scale-110"}`}
                                            />
                                            {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                                        </button>
                                    </div>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-6">
                                    {media.vote_average && (
                                    <div className="flex items-center bg-black/20 px-3 py-1.5 rounded-full">
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
                                            <span className="text-white font-semibold">
                                                {media.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Genres */}
                                {media.genres && (
                                <div className="flex flex-wrap gap-2">
                                        {media.genres.map((genre: any) => (
                                        <Link 
                                            key={genre.id}
                                            to={`/${mediaType}/genre/${genre.id}`}
                                            className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm
                                                    font-medium hover:bg-white/20 transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                        ))}
                                </div>
                                )}

                                {/* Overview */}
                                {media.overview && (
                                <p className="text-lg text-white leading-relaxed max-w-3xl">
                                    {media.overview}
                                </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs and Sidebar Section */}
                    <div className="flex gap-8">
                        {/* Main Content - Tabs */}
                        <div className="w-[calc(100%-450px)]">
                            <Tabs defaultValue="cast" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                                    <TabsTrigger value="media">Media</TabsTrigger>
                                </TabsList>

                                <TabsContent value="cast">
                                    <div className="space-y-12">
                                        {/* Cast Section with smaller images */}
                                        <div>
                                            <h2 className="text-3xl font-bold mb-6 text-white">Cast</h2>
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {media.credits?.cast?.slice(0, 10).map((actor: any) => (
                                                    <Link 
                                                        key={actor.id}
                                                        to={`/person/${actor.id}`}
                                                        className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 
                                                            transition-colors group cursor-pointer"
                                                    >
                                                        <div className="aspect-[2/3] overflow-hidden relative">
                                                            {actor.profile_path ? (
                                                                <img 
                                                                    src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                                                                    alt={actor.name} 
                                                                    className="w-full h-full object-cover group-hover:scale-110 
                                                                        transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center">
                                                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                                                        <span className="text-xl font-bold text-white">
                                                                            {actor.name.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-2">
                                                            <h3 className="font-semibold text-white text-sm">{actor.name}</h3>
                                                            <p className="text-gray-300 text-xs mt-0.5">{actor.character}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Crew Section */}
                                        <div>
                                            <h2 className="text-3xl font-bold mb-6 text-white">Crew</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                {media.credits?.crew
                                                    ?.filter((member: any) => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(member.job))
                                                    .slice(0, 4)
                                                    .map((member: any) => (
                                                        <Link 
                                                            key={`${member.id}-${member.job}`}
                                                            to={`/person/${member.id}`}
                                                            className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 
                                                                transition-colors group cursor-pointer"
                                                        >
                                                            <div className="aspect-[2/3] overflow-hidden relative">
                                                                {member.profile_path ? (
                                                                    <img 
                                                                        src={member.profile_path} 
                                                                        alt={member.name} 
                                                                        className="w-full h-full object-cover group-hover:scale-110 
                                                                            transition-transform duration-300"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center">
                                                                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                                                            <span className="text-3xl font-bold text-white">
                                                                                {member.name.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-400">No Image</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-4">
                                                                <h3 className="font-semibold text-white text-lg">{member.name}</h3>
                                                                <p className="text-gray-300 text-sm mt-1">{member.job}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="media">
                                    <div className="space-y-12">
                                        {/* Trailers with bigger size */}
                                        {media.videos && media.videos.results && media.videos.results.length > 0 && (
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-6">Trailers & Videos</h3>
                                                <div className="space-y-6">
                                                    {media.videos.results
                                                        .filter(video => video.type === "Trailer" && video.site === "YouTube")
                                                        .slice(0, 2)
                                                        .map((trailer) => (
                                                            <div key={trailer.key} className="w-full aspect-video">
                                                                <iframe
                                                                    className="w-full h-full rounded-lg"
                                                                    src={`https://www.youtube.com/embed/${trailer.key}`}
                                                                    title={trailer.name}
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Images */}
                                        {media.images && media.images.backdrops && media.images.backdrops.length > 0 && (
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-4">Gallery</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {media.images.backdrops.slice(0, 6).map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={`${BACKDROP_BASE_URL}${image.file_path}`}
                                                            alt={`Gallery image ${index + 1}`}
                                                            className="w-full aspect-video object-cover rounded-lg hover:opacity-75 transition-opacity"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Sidebar */}
                        <div className="w-[450px] space-y-6">
                            {/* Reviews Card */}
                            <div className="bg-white/10 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                                    Reviews
                                    <button
                                        onClick={handleReviewClick}
                                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium
                                            hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                                            />
                                        </svg>
                                        Write Review
                                    </button>
                                </h3>
                                
                                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                    <ReviewList 
                                        key={reviewListKey}
                                        mediaId={Number(id)} 
                                        mediaType={mediaType} 
                                        mediaTitle={media?.title || media?.name || ''}
                                    />
                                </div>
                            </div>

                            {/* Collection Card */}
                            {media.belongs_to_collection && (
                                <div className="bg-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Part of Collection</h3>
                                    <Link 
                                        to={`/collection/${media.belongs_to_collection.id}`}
                                        className="relative group cursor-pointer block"
                                    >
                                        <div className="aspect-[16/9] overflow-hidden rounded-lg">
                                            <img 
                                                src={`${BACKDROP_BASE_URL}${media.belongs_to_collection.backdrop_path}`}
                                                alt={media.belongs_to_collection.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h4 className="text-lg font-semibold text-white mb-1">
                                                {media.belongs_to_collection.name}
                                            </h4>
                                            <div className="flex items-center text-sm text-gray-300">
                                                <span>View Complete Collection</span>
                                                <svg 
                                                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M9 5l7 7-7 7" 
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Similar Movies/Shows */}
                            {media.similar && media.similar.results && media.similar.results.length > 0 && (
                                <div className="bg-white/10 rounded-lg p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Similar {mediaType === 'movie' ? 'Movies' : 'Shows'}</h3>
                                    <div className="space-y-4">
                                        {media.similar.results.slice(0, 3).map((item) => (
                                            <Link 
                                                key={item.id}
                                                to={`/${mediaType}/${item.id}`}
                                                className="flex gap-4 group"
                                            >
                                                <div className="w-[100px] h-[150px] flex-shrink-0 overflow-hidden rounded-lg">
                                                    <img 
                                                        src={`${IMAGE_BASE_URL}${item.poster_path}`}
                                                        alt={item.title || item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="text-white font-semibold group-hover:text-primary transition-colors">
                                                        {item.title || item.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {(() => {
                                                            const date = item.release_date || item.first_air_date;
                                                            if (!date) return 'Release date unknown';
                                                            return new Date(date).getFullYear();
                                                        })()}
                                                    </p>
                                                    <div className="flex items-center mt-2">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm text-gray-300 ml-1">
                                                            {item.vote_average.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                        {/* Recommendations Section */}
                    {media.recommendations && media.recommendations.results && media.recommendations.results.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                Recommended {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {media.recommendations.results.slice(0, 6).map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/${mediaType}/${item.id}`}
                                        className="group"
                                    >
                                        <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                                            {item.poster_path ? (
                                                <img
                                                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                                                    alt={item.title || item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 
                                                        transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                                    <span className="text-white/20">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-white text-sm font-medium group-hover:text-primary 
                                            transition-colors line-clamp-1">
                                            {item.title || item.name}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="text-sm text-gray-400 ml-1">
                                                {item.vote_average.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-gray-400 ml-2">
                                                {(() => {
                                                    const date = item.release_date || item.first_air_date;
                                                    if (!date) return 'Release date unknown';
                                                    return new Date(date).getFullYear();
                                                })()}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </main>

            {/* Review Modal */}
            {auth.currentUser && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                            mediaId={Number(id)} 
                            mediaType={mediaType} 
                            mediaTitle={media?.title || media?.name || ''}
                    onReviewSubmitted={() => {
                        setReviewListKey(prev => prev + 1);
                        setIsReviewModalOpen(false);
                    }}
                />
            )}

            <WatchlistModal
                isOpen={isWatchlistModalOpen}
                onClose={() => setIsWatchlistModalOpen(false)}
                mediaId={Number(id)}
                mediaType={mediaType}
                mediaTitle={media?.title || media?.name || ''}
                totalEpisodes={mediaType === 'tv' ? media?.number_of_episodes : undefined}
                onSubmit={async (data) => {
                    if (!auth.currentUser) return;
                    
                    try {
                        await addToWatchlist(
                            auth.currentUser.uid,
                            Number(id),
                            mediaType,
                            media?.title || media?.name || '',
                            media?.poster_path || '',
                            data
                        );
                        setIsInWatchlist(true);
                        setIsWatchlistModalOpen(false);
                    } catch (error) {
                        console.error('Error updating watchlist:', error);
                    }
                }}
            />

            <Footer />
        </div>
    );
};

export default MoviePage; 