import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { Review } from '../types/review';

export const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const now = new Date();
        const reviewRef = await addDoc(collection(db, 'reviews'), {
            ...reviewData,
            createdAt: now,
            updatedAt: now
        });
        return reviewRef.id;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

export const updateReview = async (reviewId: string, reviewData: Partial<Review>) => {
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await updateDoc(reviewRef, {
            ...reviewData,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

export const deleteReview = async (reviewId: string) => {
    try {
        const reviewRef = doc(db, 'reviews', reviewId);
        await deleteDoc(reviewRef);
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

export const getUserReviews = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'reviews'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Review[];
    } catch (error) {
        console.error('Error getting user reviews:', error);
        throw error;
    }
};

export const getMediaReviews = async (mediaId: number, mediaType: 'movie' | 'tv') => {
    try {
        const q = query(
            collection(db, 'reviews'),
            where('mediaId', '==', mediaId),
            where('mediaType', '==', mediaType),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Review[];
    } catch (error: any) {
        if (error.code === 'failed-precondition') {
            console.log('Index creation link:', error.message);
        }
        console.error('Error getting media reviews:', error);
        throw error;
    }
};

export const getUserReviewCount = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'reviews'),
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting user review count:', error);
        return 0;
    }
}; 