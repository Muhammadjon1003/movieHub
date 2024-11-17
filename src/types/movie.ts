export interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    genre_ids?: number[];
    genres?: Array<{
        id: number;
        name: string;
    }>;
    popularity?: number;
}

export interface MovieDetails extends MediaItem {
    belongs_to_collection?: {
        id: number;
        name: string;
        poster_path: string | null;
        backdrop_path: string | null;
    };
    tagline?: string;
    number_of_episodes?: number;
    credits?: {
        cast: Array<{
            id: number;
            name: string;
            character: string;
            profile_path: string | null;
        }>;
        crew: Array<{
            id: number;
            name: string;
            job: string;
            profile_path: string | null;
        }>;
    };
    videos?: {
        results: Array<{
            id: string;
            key: string;
            name: string;
            site: string;
            type: string;
        }>;
    };
    images?: {
        backdrops: Array<{
            file_path: string;
            width: number;
            height: number;
        }>;
    };
    similar?: {
        results: MediaItem[];
    };
    recommendations?: {
        results: MediaItem[];
    };
}

export interface Movie extends MediaItem {
    title: string;
    release_date: string;
}

export interface TVShow extends MediaItem {
    name: string;
    first_air_date: string;
}

export interface Credits {
    cast: Array<{
        id: number;
        name: string;
        character: string;
        profile_path: string | null;
    }>;
    crew: Array<{
        id: number;
        name: string;
        job: string;
        profile_path: string | null;
    }>;
}

export interface Person {
    id: number;
    name: string;
    profile_path: string | null;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
    known_for_department: string;
}

export interface PersonMovieCredits {
    cast: Array<{
        id: number;
        title: string;
        poster_path: string | null;
        character: string;
        release_date: string;
    }>;
    crew: Array<{
        id: number;
        title: string;
        poster_path: string | null;
        job: string;
        release_date: string;
    }>;
}

export interface RecommendedItem {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    mediaType: 'movie' | 'tv';
    popularity?: number;
} 