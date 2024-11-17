import { db } from '../config/firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { WatchlistEntry } from '../components/watchlist/WatchlistModal';

export const addToWatchlist = async (
    userId: string, 
    mediaId: number, 
    mediaType: 'movie' | 'tv',
    mediaTitle: string,
    posterPath: string,
    data: WatchlistEntry
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
            ...data,
            updatedAt: new Date(),
            addedAt: new Date()
        }, { merge: true });
    } catch (error) {
        console.error('Error adding to watchlist:', error);
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

export const checkIsInWatchlist = async (userId: string, mediaId: number) => {
    const docId = `${userId}_${mediaId}`;
    const watchlistRef = doc(db, 'watchlist', docId);

    try {
        const docSnap = await getDoc(watchlistRef);
        return docSnap.exists();
    } catch (error) {
        console.error('Error checking watchlist status:', error);
        return false;
    }
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

export const getWatchlistStatusCounts = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'watchlist'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        
        const counts = {
            planToWatch: 0,
            watching: 0,
            completed: 0
        };

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            switch (data.status) {
                case 'plan_to_watch':
                    counts.planToWatch++;
                    break;
                case 'watching':
                    counts.watching++;
                    break;
                case 'completed':
                    counts.completed++;
                    break;
            }
        });

        return counts;
    } catch (error) {
        console.error('Error getting watchlist counts:', error);
        return {
            planToWatch: 0,
            watching: 0,
            completed: 0
        };
    }
}; 