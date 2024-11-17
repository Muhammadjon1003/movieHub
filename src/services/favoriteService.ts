import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const addToFavorites = async (userId: string, mediaId: number, mediaType: 'movie' | 'tv', mediaTitle: string, posterPath: string) => {
    const docId = `${userId}_${mediaId}`;
    const favoriteRef = doc(db, 'favorites', docId);

    try {
        await setDoc(favoriteRef, {
            userId,
            mediaId,
            mediaType,
            mediaTitle,
            posterPath,
            addedAt: new Date()
        }, { merge: true });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
    }
};

export const removeFromFavorites = async (userId: string, mediaId: number) => {
    const docId = `${userId}_${mediaId}`;
    const favoriteRef = doc(db, 'favorites', docId);

    try {
        await deleteDoc(favoriteRef);
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
};

export const getFavoriteCount = async (userId: string): Promise<number> => {
    try {
        const q = query(
            collection(db, 'favorites'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting favorite count:', error);
        return 0;
    }
};

const favoriteStatusCache = new Map<string, boolean>();

export const checkIsFavorite = async (userId: string, mediaId: number): Promise<boolean> => {
    const cacheKey = `${userId}_${mediaId}`;
    
    if (favoriteStatusCache.has(cacheKey)) {
        return favoriteStatusCache.get(cacheKey) || false;
    }

    try {
        const favoriteRef = doc(db, 'favorites', cacheKey);
        const docSnap = await getDoc(favoriteRef);
        const exists = docSnap.exists();
        
        favoriteStatusCache.set(cacheKey, exists);
        
        return exists;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
};

export const clearFavoriteCache = (userId: string, mediaId: number) => {
    favoriteStatusCache.delete(`${userId}_${mediaId}`);
}; 