import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollectionDetails } from '../services/movieService';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Star } from 'lucide-react';

const CollectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [collection, setCollection] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollection = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await getCollectionDetails(parseInt(id));
                setCollection(data);
            } catch (error) {
                console.error('Error fetching collection:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [id]);

    if (loading || !collection) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            {/* Background Image */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${collection.backdrop_path})` }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

            <NavBar />

            <main className="relative z-10 container mx-auto px-4 py-8 mt-24">
                <div className="max-w-7xl mx-auto">
                    {/* Collection Header */}
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        <div className="flex-shrink-0">
                            <img
                                src={collection.poster_path}
                                alt={collection.name}
                                className="w-[300px] rounded-lg shadow-lg"
                            />
                        </div>

                        <div className="flex-grow">
                            <h1 className="text-4xl font-bold text-white mb-4">{collection.name}</h1>
                            {collection.overview && (
                                <p className="text-lg text-gray-300 mb-6">{collection.overview}</p>
                            )}
                            <div className="text-gray-400">
                                {collection.parts.length} Movies in Collection
                            </div>
                        </div>
                    </div>

                    {/* Movies Grid */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Movies in Collection</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {collection.parts
                                .sort((a: any, b: any) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
                                .map((movie: any) => (
                                    <Link 
                                        key={movie.id}
                                        to={`/movie/${movie.id}`}
                                        className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 
                                            transition-colors group"
                                    >
                                        <div className="aspect-[2/3] overflow-hidden">
                                            <img 
                                                src={movie.poster_path}
                                                alt={movie.title}
                                                className="w-full h-full object-cover group-hover:scale-105 
                                                    transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-white font-semibold group-hover:text-primary 
                                                transition-colors">
                                                {movie.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                                <span>
                                                    {new Date(movie.release_date).getFullYear()}
                                                </span>
                                                <div className="flex items-center">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                                    <span>{movie.vote_average.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CollectionPage; 