import axios from 'axios';
import { Movie, TVShow, Credits, Person, PersonMovieCredits, MediaItem } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const BACKDROP_BASE_URL = import.meta.env.VITE_TMDB_BACKDROP_BASE_URL;

const mapMovieData = (movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
    overview: movie.overview,
    genre_ids: movie.genre_ids,
    release_date: movie.release_date,
    vote_average: movie.vote_average
});

export const getRandomMovies = async (count: number = 10): Promise<Movie[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/movie`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    page: Math.floor(Math.random() * 10) + 1,
                    include_adult: false
                }
            }
        );

        // First get the basic movie data
        const movies = response.data.results.slice(0, count);
        
        // Then fetch detailed info for each movie to get collection data
        const detailedMovies = await Promise.all(
            movies.map(async (movie: any) => {
                const detailResponse = await axios.get(
                    `${BASE_URL}/movie/${movie.id}`,
                    {
                        params: {
                            api_key: API_KEY,
                            language: 'en-US',
                        }
                    }
                );
                
                return {
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
                    backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : '',
                    overview: movie.overview,
                    genre_ids: movie.genre_ids,
                    belongs_to_collection: detailResponse.data.belongs_to_collection
                };
            })
        );

        return detailedMovies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

export const getMediaReviews = async (mediaId: number, mediaType: 'movie' | 'tv') => {
    try {
        // Fetch first 2 pages to get more reviews
        const responses = await Promise.all([1, 2].map(page => 
            axios.get(
                `${BASE_URL}/${mediaType}/${mediaId}/reviews`,
                {
                    params: {
                        api_key: API_KEY,
                        language: 'en-US',
                        page: page
                    }
                }
            )
        ));

        // Combine results from both pages
        const allReviews = responses.flatMap(response => response.data.results);
        
        // Return first review if exists
        return allReviews.length > 0 ? [allReviews[0]] : [];

    } catch (error) {
        console.error(`Error fetching ${mediaType} reviews:`, error);
        return [];
    }
};

export const isMovie = (media: MediaItem): media is Movie => {
    return 'title' in media;
};

export const isTVShow = (media: MediaItem): media is TVShow => {
    return 'name' in media;
};

export const getRandomTV = async (count: number = 10): Promise<TVShow[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/tv`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    page: Math.floor(Math.random() * 10) + 1,
                }
            }
        );

        return response.data.results
            .slice(0, count)
            .map((show: any) => ({
                id: show.id,
                name: show.name,
                poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : '',
                backdrop_path: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : '',
                overview: show.overview,
                genre_ids: show.genre_ids
            }));
    } catch (error) {
        console.error('Error fetching TV shows:', error);
        return [];
    }
};

export const getTVReviews = async (tvId: number) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tv/${tvId}/reviews`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: 1
                }
            }
        );
        return response.data.results;
    } catch (error) {
        console.error('Error fetching TV reviews:', error);
        return [];
    }
};

export const getMovieVideos = async (movieId: number) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/${movieId}/videos`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            }
        );
        // Filter for official trailers
        return response.data.results.filter(
            (video: any) => 
                video.type.toLowerCase() === 'trailer' && 
                video.site.toLowerCase() === 'youtube'
        )[0] || null;
    } catch (error) {
        console.error('Error fetching movie videos:', error);
        return null;
    }
};

export const getTVVideos = async (tvId: number) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tv/${tvId}/videos`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            }
        );
        // Filter for official trailers
        return response.data.results.filter(
            (video: any) => 
                video.type.toLowerCase() === 'trailer' && 
                video.site.toLowerCase() === 'youtube'
        )[0] || null;
    } catch (error) {
        console.error('Error fetching TV videos:', error);
        return null;
    }
};

export const getMovieCollection = async (collectionId: number) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/collection/${collectionId}`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching collection:', error);
        return null;
    }
};

export const getMovieCredits = async (movieId: number): Promise<Credits | null> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/${movieId}/credits`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            }
        );
        
        return {
            cast: response.data.cast.map((member: any) => ({
                id: member.id,
                name: member.name,
                character: member.character,
                profile_path: member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : null,
                order: member.order
            })),
            crew: response.data.crew.map((member: any) => ({
                id: member.id,
                name: member.name,
                job: member.job,
                department: member.department,
                profile_path: member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : null
            }))
        };
    } catch (error) {
        console.error('Error fetching movie credits:', error);
        return null;
    }
};

export const getTVCredits = async (tvId: number): Promise<Credits | null> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tv/${tvId}/credits`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            }
        );
        
        return {
            cast: response.data.cast.map((member: any) => ({
                id: member.id,
                name: member.name,
                character: member.character,
                profile_path: member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : null,
                order: member.order
            })),
            crew: response.data.crew.map((member: any) => ({
                id: member.id,
                name: member.name,
                job: member.job,
                department: member.department,
                profile_path: member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : null
            }))
        };
    } catch (error) {
        console.error('Error fetching TV credits:', error);
        return null;
    }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/search/movie`,
            {
                params: {
                    api_key: API_KEY,
                    query,
                    language: 'en-US',
                    page: 1,
                    include_adult: false
                }
            }
        );
        
        return response.data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            release_date: movie.release_date,
            overview: movie.overview
        }));
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

export const searchTVShows = async (query: string): Promise<TVShow[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/search/tv`,
            {
                params: {
                    api_key: API_KEY,
                    query,
                    language: 'en-US',
                    page: 1
                }
            }
        );
        
        return response.data.results.map((show: any) => ({
            id: show.id,
            name: show.name,
            poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
            first_air_date: show.first_air_date,
            overview: show.overview
        }));
    } catch (error) {
        console.error('Error searching TV shows:', error);
        return [];
    }
};

export const searchPeople = async (query: string): Promise<Person[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/search/person`,
            {
                params: {
                    api_key: API_KEY,
                    query,
                    language: 'en-US',
                    page: 1
                }
            }
        );
        
        return response.data.results.map((person: any) => ({
            id: person.id,
            name: person.name,
            profile_path: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null,
            known_for_department: person.known_for_department
        }));
    } catch (error) {
        console.error('Error searching people:', error);
        return [];
    }
};

export const getPersonMovieCredits = async (personId: number): Promise<PersonMovieCredits | null> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/person/${personId}/movie_credits`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US'
                }
            }
        );
        
        return {
            cast: response.data.cast.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                character: movie.character,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                release_date: movie.release_date
            })),
            crew: response.data.crew.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                job: movie.job,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                release_date: movie.release_date
            }))
        };
    } catch (error) {
        console.error('Error fetching person movie credits:', error);
        return null;
    }
};

export const getLatestMovies = async (page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/now_playing`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: page,
                    include_adult: false
                }
            }
        );

        return {
            results: response.data.results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
                backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : '',
                overview: movie.overview,
                genre_ids: movie.genre_ids,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching latest movies:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getPopularMovies = async (page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/popular`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: page,
                    include_adult: false
                }
            }
        );

        return {
            results: response.data.results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
                overview: movie.overview,
                genre_ids: movie.genre_ids,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getSidebarRandomMovies = async (count: number = 4): Promise<Movie[]> => {
    try {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const response = await axios.get(
            `${BASE_URL}/discover/movie`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    sort_by: 'popularity.desc',
                    page: randomPage,
                    include_adult: false,
                    'vote_count.gte': 100,
                    'vote_average.gte': 6
                }
            }
        );

        // Get random movies from the results
        const allMovies = response.data.results.filter((movie: any) => !movie.adult);
        const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
            backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : '',
            overview: movie.overview,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            genre_ids: movie.genre_ids,
            belongs_to_collection: null
        }));
    } catch (error) {
        console.error('Error fetching random movies for sidebar:', error);
        return [];
    }
};

export const getTopRatedMovies = async (page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/movie/top_rated`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: page,
                    include_adult: false
                }
            }
        );

        return {
            results: response.data.results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
                overview: movie.overview,
                genre_ids: movie.genre_ids,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getNewTVShows = async (page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tv/on_the_air`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: page,
                    include_adult: false
                }
            }
        );

        return {
            results: response.data.results.map((show: any) => ({
                id: show.id,
                name: show.name,
                poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : '',
                backdrop_path: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : '',
                overview: show.overview,
                genre_ids: show.genre_ids,
                first_air_date: show.first_air_date,
                vote_average: show.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching new TV shows:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getPopularTVShows = async (page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tv/popular`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: page,
                    include_adult: false
                }
            }
        );

        return {
            results: response.data.results.map((show: any) => ({
                id: show.id,
                name: show.name,
                poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
                backdrop_path: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : null,
                overview: show.overview,
                genre_ids: show.genre_ids,
                first_air_date: show.first_air_date,
                vote_average: show.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching popular TV shows:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getTopRatedTVShows = async (page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/tv/top_rated`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: page,
                    include_adult: false
                }
            }
        );

        return {
            results: response.data.results.map((show: any) => ({
                id: show.id,
                name: show.name,
                poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
                backdrop_path: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : null,
                overview: show.overview,
                genre_ids: show.genre_ids,
                first_air_date: show.first_air_date,
                vote_average: show.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching top rated TV shows:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getMoviesByGenre = async (genreId: number, page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/movie`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    with_genres: genreId,
                    page: page,
                    include_adult: false,
                    sort_by: 'popularity.desc'
                }
            }
        );

        return {
            results: response.data.results.map(mapMovieData),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getTVShowsByGenre = async (genreId: number, page: number = 1) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/tv`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    with_genres: genreId,
                    page: page,
                    include_adult: false,
                    sort_by: 'popularity.desc'
                }
            }
        );

        return {
            results: response.data.results.map(mapTVShowData),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching TV shows by genre:', error);
        return { results: [], total_pages: 0 };
    }
};

interface MovieResponse {
    results: Movie[];
    total_pages: number;
}

interface TVResponse {
    results: TVShow[];
    total_pages: number;
}

export const getMoviesByYear = async (year: number, page: number = 1): Promise<MovieResponse> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/movie`,
            {
                params: {
                    api_key: API_KEY,
                    primary_release_year: year,
                    page,
                    language: 'en-US',
                    sort_by: 'popularity.desc'
                }
            }
        );

        return {
            results: response.data.results.map(mapMovieData),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching movies by year:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getTVShowsByYear = async (year: number, page: number = 1): Promise<TVResponse> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/tv`,
            {
                params: {
                    api_key: API_KEY,
                    first_air_date_year: year,
                    page,
                    language: 'en-US',
                    sort_by: 'popularity.desc'
                }
            }
        );

        return {
            results: response.data.results.map(mapTVShowData),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching TV shows by year:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getMoviesByCountry = async (countryCode: string, page: number = 1): Promise<MovieResponse> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/movie`,
            {
                params: {
                    api_key: API_KEY,
                    with_origin_country: countryCode,
                    page,
                    language: 'en-US',
                    sort_by: 'popularity.desc'
                }
            }
        );

        return {
            results: response.data.results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
                overview: movie.overview,
                release_date: movie.release_date,
                vote_average: movie.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching movies by country:', error);
        return { results: [], total_pages: 0 };
    }
};

export const getTVShowsByCountry = async (countryCode: string, page: number = 1): Promise<TVResponse> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/discover/tv`,
            {
                params: {
                    api_key: API_KEY,
                    with_origin_country: countryCode,
                    page,
                    language: 'en-US',
                    sort_by: 'popularity.desc'
                }
            }
        );

        return {
            results: response.data.results.map((show: any) => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
                backdrop_path: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : null,
                overview: show.overview,
                first_air_date: show.first_air_date,
                vote_average: show.vote_average
            })),
            total_pages: response.data.total_pages
        };
    } catch (error) {
        console.error('Error fetching TV shows by country:', error);
        return { results: [], total_pages: 0 };
    }
};

const mapTVShowData = (show: any) => ({
    id: show.id,
    name: show.name,
    poster_path: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null,
    backdrop_path: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : null,
    overview: show.overview,
    genre_ids: show.genre_ids,
    first_air_date: show.first_air_date,
    vote_average: show.vote_average
});

export const getMediaDetails = async (id: number, mediaType: 'movie' | 'tv') => {
    try {
        const response = await axios.get(
            `${BASE_URL}/${mediaType}/${id}`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    append_to_response: 'videos,images,credits,recommendations,reviews,similar'
                }
            }
        );

        const data = response.data;

        // Normalize the data structure
        return {
            ...data,
            title: mediaType === 'movie' ? data.title : data.name,
            release_date: mediaType === 'movie' ? data.release_date : data.first_air_date,
            poster_path: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null,
            backdrop_path: data.backdrop_path ? `${BACKDROP_BASE_URL}${data.backdrop_path}` : null,
            credits: {
                cast: data.credits?.cast?.map((member: any) => ({
                    ...member,
                    profile_path: member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : null
                })) || [],
                crew: data.credits?.crew?.map((member: any) => ({
                    ...member,
                    profile_path: member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : null
                })) || []
            },
            recommendations: {
                ...data.recommendations,
                results: data.recommendations?.results?.map((item: any) => ({
                    ...item,
                    title: mediaType === 'movie' ? item.title : item.name,
                    release_date: mediaType === 'movie' ? item.release_date : item.first_air_date,
                    poster_path: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
                })) || []
            },
            // ... other normalizations
        };
    } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
        return null;
    }
};

export const getPersonDetails = async (personId: number) => {
    try {
        const [personResponse, creditsResponse] = await Promise.all([
            axios.get(`${BASE_URL}/person/${personId}`, {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            }),
            axios.get(`${BASE_URL}/person/${personId}/combined_credits`, {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                }
            })
        ]);

        const person = personResponse.data;
        const credits = creditsResponse.data;

        return {
            ...person,
            profile_path: person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null,
            cast: credits.cast.map((credit: any) => ({
                ...credit,
                poster_path: credit.poster_path ? `${IMAGE_BASE_URL}${credit.poster_path}` : null,
                title: credit.title || credit.name, // Handle both movies and TV shows
                media_type: credit.media_type
            })),
            crew: credits.crew.map((credit: any) => ({
                ...credit,
                poster_path: credit.poster_path ? `${IMAGE_BASE_URL}${credit.poster_path}` : null,
                title: credit.title || credit.name,
                media_type: credit.media_type
            }))
        };
    } catch (error) {
        console.error('Error fetching person details:', error);
        return null;
    }
};

export const getCollectionDetails = async (collectionId: number) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/collection/${collectionId}`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US'
                }
            }
        );

        const data = response.data;
        return {
            ...data,
            poster_path: data.poster_path ? `${IMAGE_BASE_URL}${data.poster_path}` : null,
            backdrop_path: data.backdrop_path ? `${BACKDROP_BASE_URL}${data.backdrop_path}` : null,
            parts: data.parts.map((movie: any) => ({
                ...movie,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                backdrop_path: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
            }))
        };
    } catch (error) {
        console.error('Error fetching collection details:', error);
        return null;
    }
};

export const getTMDBReviews = async (mediaId: number, mediaType: 'movie' | 'tv') => {
    try {
        const response = await axios.get(
            `${BASE_URL}/${mediaType}/${mediaId}/reviews`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: 1
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching TMDB reviews:', error);
        return { results: [] };
    }
};

export const getRecommendations = async (mediaId: number, mediaType: 'movie' | 'tv'): Promise<RecommendedItem[]> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/${mediaType}/${mediaId}/recommendations`,
            {
                params: {
                    api_key: API_KEY,
                    language: 'en-US',
                    page: 1
                }
            }
        );
        
        return response.data.results.map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            vote_average: item.vote_average,
            release_date: item.release_date,
            first_air_date: item.first_air_date,
            mediaType
        }));
    } catch (error) {
        console.error(`Error fetching ${mediaType} recommendations:`, error);
        return [];
    }
};

interface RecommendedItem {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    mediaType: 'movie' | 'tv';
} 