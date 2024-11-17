import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '../assets/icons/GoogleIcon';

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: any) {
            if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Email already in use');
            } else {
                setError('Failed to create account');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            setError('Failed to sign up with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold text-white text-center mb-8">Sign Up</h1>
                
                <form onSubmit={handleSignUp} className="space-y-6">
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

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
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
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 font-medium
                            hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50
                            flex items-center justify-center gap-2"
                    >
                        <GoogleIcon />
                        Sign up with Google
                    </button>

                    <p className="text-center text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary/90">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage; 