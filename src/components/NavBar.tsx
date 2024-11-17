import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Filter data
const MOVIE_GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
];

const TV_GENRES = [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 10762, name: "Kids" },
    { id: 9648, name: "Mystery" },
    { id: 10763, name: "News" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 10766, name: "Soap" },
    { id: 10767, name: "Talk" },
    { id: 10768, name: "War & Politics" },
    { id: 37, name: "Western" }
];

const YEARS = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => ({ 
        id: new Date().getFullYear() - i,
        name: `${new Date().getFullYear() - i}`
    })
);

const COUNTRIES = [
    { id: 'US', name: 'United States' },
    { id: 'GB', name: 'United Kingdom' },
    { id: 'FR', name: 'France' },
    { id: 'DE', name: 'Germany' },
    { id: 'JP', name: 'Japan' },
    { id: 'KR', name: 'South Korea' },
    { id: 'IN', name: 'India' },
    { id: 'IT', name: 'Italy' },
    { id: 'ES', name: 'Spain' },
    { id: 'CN', name: 'China' }
];

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [openModals, setOpenModals] = useState<{
        genres: boolean;
        years: boolean;
        countries: boolean;
    }>({
        genres: false,
        years: false,
        countries: false
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

    // Close all modals when route changes
    useEffect(() => {
        setOpenModals({
            genres: false,
            years: false,
            countries: false
        });
    }, [location.pathname]);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user) {
                const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid));
                if (profileDoc.exists()) {
                    setUserProfile(profileDoc.data());
                }
            }
        };
        loadUserProfile();
    }, [user]);

    const isActiveRoute = (path: string) => location.pathname.startsWith(path);

    const toggleModal = (modalName: 'genres' | 'years' | 'countries') => {
        setOpenModals(prev => ({
            genres: false,
            years: false,
            countries: false,
            [modalName]: !prev[modalName]
        }));
    };

    const getFilterSections = (modalType: 'genres' | 'years' | 'countries') => {
        switch (modalType) {
            case 'genres':
                return [{
                    title: 'Movie Genres',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" 
                        />
                    </svg>,
                    options: MOVIE_GENRES,
                    baseUrl: '/movie/genre'
                }, {
                    title: 'TV Show Genres',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                        />
                    </svg>,
                    options: TV_GENRES,
                    baseUrl: '/tv/genre'
                }];
            case 'years':
                return [{
                    title: 'Movie Years',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                    </svg>,
                    options: YEARS,
                    baseUrl: '/movies/year'
                }, {
                    title: 'TV Show Years',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                    </svg>,
                    options: YEARS,
                    baseUrl: '/tv-shows/year'
                }];
            case 'countries':
                return [{
                    title: 'Movie Countries',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>,
                    options: COUNTRIES,
                    baseUrl: '/movies/country'
                }, {
                    title: 'TV Show Countries',
                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>,
                    options: COUNTRIES,
                    baseUrl: '/tv-shows/country'
                }];
            default:
                return [];
        }
    };

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        {/* Left side - Logo */}
                        <div className="w-1/4">
                            <Link to="/" className="text-2xl font-bold text-white">
                                MovieHub
                            </Link>
                        </div>
                        
                        {/* Center - Navigation Links */}
                        <div className="flex-1 flex items-center justify-center space-x-6">
                            <Link
                                to="/movies/latest"
                                className={`text-sm font-medium transition-colors duration-200
                                    ${isActiveRoute('/movies') 
                                        ? 'text-primary' 
                                        : 'text-gray-300 hover:text-white'}`}
                            >
                                Movies
                            </Link>
                            <Link
                                to="/tv-shows/latest"
                                className={`text-sm font-medium transition-colors duration-200
                                    ${isActiveRoute('/tv-shows') 
                                        ? 'text-primary' 
                                        : 'text-gray-300 hover:text-white'}`}
                            >
                                TV Shows
                            </Link>
                            
                            {/* Filter Buttons */}
                            <button
                                onClick={() => toggleModal('genres')}
                                className={`text-sm font-medium transition-colors duration-200
                                    ${openModals.genres 
                                        ? 'text-primary' 
                                        : 'text-gray-300 hover:text-white'}`}
                            >
                                Genres
                            </button>
                            <button
                                onClick={() => toggleModal('years')}
                                className={`text-sm font-medium transition-colors duration-200
                                    ${openModals.years 
                                        ? 'text-primary' 
                                        : 'text-gray-300 hover:text-white'}`}
                            >
                                Years
                            </button>
                            <button
                                onClick={() => toggleModal('countries')}
                                className={`text-sm font-medium transition-colors duration-200
                                    ${openModals.countries 
                                        ? 'text-primary' 
                                        : 'text-gray-300 hover:text-white'}`}
                            >
                                Countries
                            </button>
                        </div>

                        {/* Right side - Auth buttons or Avatar */}
                        <div className="w-1/4 flex justify-end">
                            {user ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center space-x-3 focus:outline-none"
                                    >
                                        <span className="text-gray-300 hidden sm:block">
                                            {userProfile?.username || user.displayName || user.email}
                                        </span>
                                        {userProfile?.avatar || user.photoURL ? (
                                            <img 
                                                src={userProfile?.avatar || user.photoURL}
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                                {(userProfile?.username?.[0] || user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                            </div>
                                        )}
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-dark-lighter border border-gray-700">
                                            <div className="py-1">
                                                <Link
                                                    to={`/user/${user.uid}/dashboard`}
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                                    onClick={() => setShowProfileMenu(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to={`/user/${user.uid}/profile`}
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                                    onClick={() => setShowProfileMenu(false)}
                                                >
                                                    Profile Settings
                                                </Link>
                                                <div className="border-t border-gray-700 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        handleSignOut();
                                                        setShowProfileMenu(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 rounded-lg text-white font-medium
                                            hover:bg-gray-800 transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 rounded-lg bg-primary text-white font-medium
                                            hover:bg-primary/90 transition-colors duration-200"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modals */}
            {(openModals.genres || openModals.years || openModals.countries) && (
                <div className="fixed inset-0 z-[999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/75 transition-opacity" 
                            onClick={() => setOpenModals({
                                genres: false,
                                years: false,
                                countries: false
                            })}
                        />

                        {/* Modal Content */}
                        <div className="relative bg-dark-lighter rounded-lg w-full max-w-4xl p-6 z-[1000]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Browse</h3>
                                <button
                                    onClick={() => setOpenModals({
                                        genres: false,
                                        years: false,
                                        countries: false
                                    })}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                {getFilterSections(
                                    openModals.genres ? 'genres' :
                                    openModals.years ? 'years' : 'countries'
                                ).map((section) => (
                                    <div key={section.title}>
                                        <div className="flex items-center gap-2 mb-4">
                                            {section.icon}
                                            <h4 className="text-lg font-medium text-white">{section.title}</h4>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {section.options.map((option) => (
                                                <Link
                                                    key={option.id}
                                                    to={`${section.baseUrl}/${option.id}`}
                                                    onClick={() => setOpenModals({
                                                        genres: false,
                                                        years: false,
                                                        countries: false
                                                    })}
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
            )}
        </>
    );
};

export default NavBar; 