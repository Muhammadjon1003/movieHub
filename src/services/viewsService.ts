import { db } from '../config/firebase';
import { doc, increment, updateDoc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const VIEW_COOLDOWN_MINUTES = 30; // Minimum minutes between counting views

export const incrementPageView = async (userId: string, mediaId: string, mediaType: 'movie' | 'tv') => {
    try {
        const viewsRef = doc(db, 'userViews', userId);
        const viewsDoc = await getDoc(viewsRef);
        const now = Timestamp.now();

        if (!viewsDoc.exists()) {
            // Create initial document if it doesn't exist
            await setDoc(viewsRef, {
                totalViews: 1,
                mediaViews: {
                    [mediaId]: {
                        count: 1,
                        type: mediaType,
                        lastViewed: now,
                        firstViewed: now
                    }
                }
            });
            return;
        }

        const data = viewsDoc.data();
        const mediaViews = data.mediaViews || {};
        const mediaView = mediaViews[mediaId];

        // Check if this media has been viewed before
        if (!mediaView) {
            // First time viewing this media
            await updateDoc(viewsRef, {
                totalViews: increment(1),
                [`mediaViews.${mediaId}`]: {
                    count: 1,
                    type: mediaType,
                    lastViewed: now,
                    firstViewed: now
                }
            });
            return;
        }

        // Check if enough time has passed since last view
        const lastViewed = mediaView.lastViewed.toDate();
        const minutesSinceLastView = (now.toDate().getTime() - lastViewed.getTime()) / (1000 * 60);

        if (minutesSinceLastView >= VIEW_COOLDOWN_MINUTES) {
            // Increment view count and update last viewed time
            await updateDoc(viewsRef, {
                totalViews: increment(1),
                [`mediaViews.${mediaId}.count`]: increment(1),
                [`mediaViews.${mediaId}.lastViewed`]: now
            });
        }
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
};

export const getUserViewStats = async (userId: string) => {
    try {
        const viewsRef = doc(db, 'userViews', userId);
        const viewsDoc = await getDoc(viewsRef);

        if (!viewsDoc.exists()) {
            return {
                totalViews: 0,
                movieViews: 0,
                tvViews: 0,
                uniqueMovies: 0,
                uniqueTVShows: 0,
                recentlyViewed: []
            };
        }

        const data = viewsDoc.data();
        const mediaViews = data.mediaViews || {};

        const stats = Object.values(mediaViews).reduce((acc: any, view: any) => {
            if (view.type === 'movie') {
                acc.movieViews += view.count;
                acc.uniqueMovies++;
            } else {
                acc.tvViews += view.count;
                acc.uniqueTVShows++;
            }
            return acc;
        }, { 
            movieViews: 0, 
            tvViews: 0,
            uniqueMovies: 0,
            uniqueTVShows: 0
        });

        // Get recently viewed items (last 5)
        const recentlyViewed = Object.entries(mediaViews)
            .map(([id, view]: [string, any]) => ({
                id,
                ...view,
                lastViewed: view.lastViewed.toDate()
            }))
            .sort((a, b) => b.lastViewed.getTime() - a.lastViewed.getTime())
            .slice(0, 5);

        return {
            totalViews: data.totalViews || 0,
            ...stats,
            recentlyViewed
        };
    } catch (error) {
        console.error('Error getting view stats:', error);
        return {
            totalViews: 0,
            movieViews: 0,
            tvViews: 0,
            uniqueMovies: 0,
            uniqueTVShows: 0,
            recentlyViewed: []
        };
    }
}; 