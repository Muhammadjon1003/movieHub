export interface WatchlistItem {
    id: string;
    userId: string;
    mediaId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    posterPath: string;
    status: 'plan_to_watch' | 'watching' | 'completed';
    addedAt: Date;
    updatedAt: Date;
} 