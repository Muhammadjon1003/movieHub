export interface Review {
    id?: string;
    userId: string;
    userEmail: string;
    mediaId: number;
    mediaType: 'movie' | 'tv';
    mediaTitle: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
} 