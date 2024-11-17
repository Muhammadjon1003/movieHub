import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonDetails } from '../services/movieService';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const PersonPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [person, setPerson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerson = async () => {
            if (!id) return;
            setLoading(true);
            const data = await getPersonDetails(parseInt(id));
            setPerson(data);
            setLoading(false);
        };

        fetchPerson();
    }, [id]);

    if (loading || !person) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark">
            <NavBar />
            <main className="container mx-auto px-4 py-8 mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Image */}
                        <div className="flex-shrink-0 w-full md:w-1/3">
                            {person.profile_path ? (
                                <img
                                    src={person.profile_path}
                                    alt={person.name}
                                    className="w-full rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="w-full aspect-[2/3] bg-white/10 rounded-lg flex items-center justify-center">
                                    <span className="text-6xl font-bold text-white/20">
                                        {person.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Person Info */}
                        <div className="flex-grow">
                            <h1 className="text-4xl font-bold text-white mb-4">{person.name}</h1>
                            
                            {person.birthday && (
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-white">Birthday</h2>
                                    <p className="text-gray-300">
                                        {new Date(person.birthday).toLocaleDateString()}
                                        {person.deathday && ` - ${new Date(person.deathday).toLocaleDateString()}`}
                                    </p>
                                </div>
                            )}

                            {person.place_of_birth && (
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-white">Place of Birth</h2>
                                    <p className="text-gray-300">{person.place_of_birth}</p>
                                </div>
                            )}

                            {person.biography && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-white mb-2">Biography</h2>
                                    <p className="text-gray-300 leading-relaxed">{person.biography}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filmography */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Known For</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {person.cast
                                .sort((a: any, b: any) => b.popularity - a.popularity)
                                .slice(0, 12)
                                .map((credit: any) => (
                                    <Link
                                        key={credit.id}
                                        to={`/${credit.media_type}/${credit.id}`}
                                        className="group"
                                    >
                                        <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2">
                                            {credit.poster_path ? (
                                                <img
                                                    src={credit.poster_path}
                                                    alt={credit.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                                    <span className="text-white/20">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-white text-sm font-medium group-hover:text-primary transition-colors">
                                            {credit.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{credit.character}</p>
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

export default PersonPage; 