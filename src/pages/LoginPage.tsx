import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '../assets/icons/GoogleIcon';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            setError('Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold text-white text-center mb-8">Login</h1>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-lg bg-dark-lighter border border-gray-600 
                                text-white px-4 py-2 focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-lg bg-dark-lighter border border-gray-600 
                                text-white px-4 py-2 focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 rounded-lg bg-primary text-white font-medium
                            hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-dark text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 font-medium
                            hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50
                            flex items-center justify-center gap-2"
                    >
                        <GoogleIcon />
                        Sign in with Google
                    </button>

                    <p className="text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:text-primary/90">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage; 