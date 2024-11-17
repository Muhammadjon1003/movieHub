import React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import DashboardContent from '../components/dashboard/DashboardContent';
import ProfileContent from '../components/dashboard/ProfileContent';

const UserDashboard: React.FC = () => {
    const { userId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = auth.currentUser;
    
    // Check if user is viewing their own dashboard
    const isOwnDashboard = currentUser?.uid === userId;

    const isActivePath = (path: string) => {
        return location.pathname.endsWith(path);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!isOwnDashboard) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-400">You don't have permission to view this dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark flex">
            {/* Sidebar */}
            <div className="w-64 bg-dark-lighter border-r border-gray-800 flex flex-col">
                <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Account</h2>
                        <button
                            onClick={() => navigate('/')}
                            className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm
                                hover:bg-primary/20 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                                />
                            </svg>
                            Home
                        </button>
                    </div>
                    <nav className="space-y-2">
                        <Link
                            to={`/user/${userId}/dashboard`}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
                                ${isActivePath('dashboard') 
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                                />
                            </svg>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to={`/user/${userId}/profile`}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200
                                ${isActivePath('profile') 
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                />
                            </svg>
                            <span>Profile</span>
                        </Link>
                    </nav>
                </div>

                {/* Sign Out Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                            text-red-400 hover:bg-red-400/10 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                            />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {isActivePath('dashboard') && <DashboardContent userId={userId as string} />}
                    {isActivePath('profile') && <ProfileContent />}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 