import React, { useState, useRef } from 'react';
import { auth } from '../../config/firebase';
import { updateProfile, } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface ExtendedProfile {
    username: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other' | '';
    bio: string;
    location: string;
    website: string;
    favoriteGenres: string[];
    socialLinks: {
        twitter: string;
        instagram: string;
        facebook: string;
    };
}

const ProfileContent: React.FC = () => {
    const user = auth.currentUser;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.photoURL || '');
console.log(avatarFile);
    const [profile, setProfile] = useState<ExtendedProfile>({
        username: user?.displayName || '',
        dateOfBirth: '',
        gender: '',
        bio: '',
        location: '',
        website: '',
        favoriteGenres: [],
        socialLinks: {
            twitter: '',
            instagram: '',
            facebook: ''
        }
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                setAvatarPreview(base64String);
                setAvatarFile(null);

                if (user) {
                    try {
                        await setDoc(doc(db, 'userProfiles', user.uid), {
                            ...profile,
                            avatar: base64String
                        }, { merge: true });

                        await updateProfile(user, { 
                            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}&background=646cff&color=fff`
                        });
                    } catch (err) {
                        console.error('Error updating avatar:', err);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    React.useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                const profileDoc = await getDoc(doc(db, 'userProfiles', user.uid));
                if (profileDoc.exists()) {
                    const data = profileDoc.data();
                    setProfile(prev => ({ ...prev, ...data }));
                    setAvatarPreview(data.avatar || user.photoURL || '');
                }
            }
        };
        loadProfile();
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await setDoc(doc(db, 'userProfiles', user.uid), profile, { merge: true });

            if (profile.username !== user.displayName) {
                await updateProfile(user, { displayName: profile.username });
            }

            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

            <div className="bg-dark-lighter rounded-lg p-6 shadow-lg">
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-8">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-2xl text-white">
                                        {profile.username[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                                    flex items-center justify-center text-white text-sm font-medium
                                    transition-opacity duration-200 rounded-full"
                            >
                                Change Photo
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                JPG, GIF or PNG. Max size of 2MB.
                            </p>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                value={profile.username}
                                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                                className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                    text-white px-4 py-2 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                    text-gray-400 px-4 py-2 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={profile.dateOfBirth}
                                onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                    text-white px-4 py-2 focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Gender
                            </label>
                            <select
                                value={profile.gender}
                                onChange={(e) => setProfile(prev => ({ 
                                    ...prev, 
                                    gender: e.target.value as ExtendedProfile['gender']
                                }))}
                                className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                    text-white px-4 py-2 focus:outline-none focus:border-primary"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Bio
                        </label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                text-white px-4 py-2 focus:outline-none focus:border-primary"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Location & Website */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Location
                            </label>
                            <input
                                type="text"
                                value={profile.location}
                                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                                className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                    text-white px-4 py-2 focus:outline-none focus:border-primary"
                                placeholder="City, Country"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Website
                            </label>
                            <input
                                type="url"
                                value={profile.website}
                                onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                                className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                    text-white px-4 py-2 focus:outline-none focus:border-primary"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Twitter
                                </label>
                                <input
                                    type="text"
                                    value={profile.socialLinks.twitter}
                                    onChange={(e) => setProfile(prev => ({ 
                                        ...prev, 
                                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                                    }))}
                                    className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                        text-white px-4 py-2 focus:outline-none focus:border-primary"
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Instagram
                                </label>
                                <input
                                    type="text"
                                    value={profile.socialLinks.instagram}
                                    onChange={(e) => setProfile(prev => ({ 
                                        ...prev, 
                                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                                    }))}
                                    className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                        text-white px-4 py-2 focus:outline-none focus:border-primary"
                                    placeholder="username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Facebook
                                </label>
                                <input
                                    type="text"
                                    value={profile.socialLinks.facebook}
                                    onChange={(e) => setProfile(prev => ({ 
                                        ...prev, 
                                        socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                                    }))}
                                    className="mt-1 block w-full rounded-lg bg-dark border border-gray-600 
                                        text-white px-4 py-2 focus:outline-none focus:border-primary"
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    {success && (
                        <div className="text-green-500 text-sm">{success}</div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-lg font-medium
                                hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileContent; 