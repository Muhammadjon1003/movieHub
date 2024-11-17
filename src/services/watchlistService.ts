import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface WatchlistEntry {
    userId: string;
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
    posterPath: string;
    status: 'plan_to_watch' | 'watching' | 'completed';
    progress?: number;
    totalEpisodes?: number;
    addedAt: Date;
}

export const addToWatchlist = async (
    userId: string,
    mediaId: number,
    mediaType: 'movie' | 'tv',
    mediaTitle: string,
    posterPath: string,
    status: WatchlistEntry['status'],
    totalEpisodes?: number
) => {
    const docId = `${userId}_${mediaId}`;
    const watchlistRef = doc(db, 'watchlist', docId);

    try {
        await setDoc(watchlistRef, {
            userId,
            mediaId,
            mediaType,
            mediaTitle,
            posterPath,
            status,
            progress: 0,
            totalEpisodes,
            addedAt: new Date()
        });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
    }
};

export const updateWatchlistStatus = async (
    userId: string,
    mediaId: number,
    status: WatchlistEntry['status'],
    progress?: number
) => {
    const docId = `${userId}_${mediaId}`;
    const watchlistRef = doc(db, 'watchlist', docId);

    try {
        await setDoc(watchlistRef, {
            status,
            progress,
            updatedAt: new Date()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating watchlist status:', error);
        throw error;
    }
};

export const removeFromWatchlist = async (userId: string, mediaId: number) => {
    const docId = `${userId}_${mediaId}`;
    const watchlistRef = doc(db, 'watchlist', docId);

    try {
        await deleteDoc(watchlistRef);
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw error;
    }
};

export const getWatchlistStatusCounts = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'watchlist'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.reduce((acc, doc) => {
            const status = doc.data().status;
            switch (status) {
                case 'plan_to_watch':
                    acc.planToWatch++;
                    break;
                case 'watching':
                    acc.watching++;
                    break;
                case 'completed':
                    acc.completed++;
                    break;
            }
            return acc;
        }, { planToWatch: 0, watching: 0, completed: 0 });
    } catch (error) {
        console.error('Error getting watchlist counts:', error);
        return { planToWatch: 0, watching: 0, completed: 0 };
    }
};

const watchlistStatusCache = new Map<string, boolean>();

export const checkIsInWatchlist = async (userId: string, mediaId: number): Promise<boolean> => {
    const cacheKey = `${userId}_${mediaId}`;
    
    if (watchlistStatusCache.has(cacheKey)) {
        return watchlistStatusCache.get(cacheKey) || false;
    }

    try {
        const watchlistRef = doc(db, 'watchlist', cacheKey);
        const docSnap = await getDoc(watchlistRef);
        const exists = docSnap.exists();
        
        watchlistStatusCache.set(cacheKey, exists);
        
        return exists;
    } catch (error) {
        console.error('Error checking watchlist status:', error);
        return false;
    }
};

export const clearWatchlistCache = (userId: string, mediaId: number) => {
    watchlistStatusCache.delete(`${userId}_${mediaId}`);
};

export const getWatchlistCount = async (userId: string): Promise<number> => {
    try {
        const q = query(
            collection(db, 'watchlist'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting watchlist count:', error);
        return 0;
    }
}; 