import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import MoviePage from './pages/MoviePage';
import MediaPage from './pages/MediaPage';
import PersonPage from './pages/PersonPage';
import CollectionPage from './pages/CollectionPage';
import { 
    getLatestMovies, 
    getPopularMovies, 
    getTopRatedMovies,
    getNewTVShows,
    getPopularTVShows,
    getTopRatedTVShows,
    getMoviesByGenre,
    getTVShowsByGenre,
    getMoviesByCountry,
    getTVShowsByCountry,
    getMoviesByYear,
    getTVShowsByYear
} from './services/movieService';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MoviesPage from './pages/MoviesPage';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <ErrorBoundary>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        
                        {/* Single Movie/TV Show Pages */}
                        <Route path="/movie/:id" element={<MoviePage />} />
                        <Route path="/tv/:id" element={<MoviePage />} />

                        {/* Genre Pages */}
                        <Route path="/movie/genre/:genreId" element={
                            <MediaPage 
                                title="Movies by Genre"
                                fetchMedia={(page) => {
                                    const genreId = window.location.pathname.split('/').pop();
                                    return getMoviesByGenre(Number(genreId), page);
                                }}
                                type="movie"
                            />
                        } />
                        <Route path="/tv/genre/:genreId" element={
                            <MediaPage 
                                title="TV Shows by Genre"
                                fetchMedia={(page) => {
                                    const genreId = window.location.pathname.split('/').pop();
                                    return getTVShowsByGenre(Number(genreId), page);
                                }}
                                type="tv"
                            />
                        } />

                        {/* Country Pages */}
                        <Route path="/movie/country/:countryCode" element={
                            <MediaPage 
                                title="Movies by Country"
                                fetchMedia={(page) => {
                                    const countryCode = window.location.pathname.split('/').pop();
                                    return getMoviesByCountry(countryCode || '', page);
                                }}
                                type="movie"
                            />
                        } />
                        <Route path="/tv/country/:countryCode" element={
                            <MediaPage 
                                title="TV Shows by Country"
                                fetchMedia={(page) => {
                                    const countryCode = window.location.pathname.split('/').pop();
                                    return getTVShowsByCountry(countryCode || '', page);
                                }}
                                type="tv"
                            />
                        } />

                        {/* Category Pages */}
                        <Route path="/movies/latest" element={
                            <MediaPage 
                                title="Latest Movies"
                                subtitle="New Releases"
                                fetchMedia={getLatestMovies}
                                type="movie"
                            />
                        } />
                        <Route path="/movies/popular" element={
                            <MediaPage 
                                title="Popular Movies"
                                subtitle="Trending Worldwide"
                                fetchMedia={getPopularMovies}
                                type="movie"
                            />
                        } />
                        <Route path="/movies/top-rated" element={
                            <MediaPage 
                                title="Top Rated Movies"
                                subtitle="All Time Favorites"
                                fetchMedia={getTopRatedMovies}
                                type="movie"
                            />
                        } />

                        {/* TV Show Routes */}
                        <Route path="/tv-shows/latest" element={
                            <MediaPage 
                                title="Latest TV Shows"
                                subtitle="New Episodes"
                                fetchMedia={getNewTVShows}
                                type="tv"
                            />
                        } />
                        <Route path="/tv-shows/popular" element={
                            <MediaPage 
                                title="Popular TV Shows"
                                subtitle="Trending Series"
                                fetchMedia={getPopularTVShows}
                                type="tv"
                            />
                        } />
                        <Route path="/tv-shows/top-rated" element={
                            <MediaPage 
                                title="Top Rated TV Shows"
                                subtitle="Must Watch Series"
                                fetchMedia={getTopRatedTVShows}
                                type="tv"
                            />
                        } />

                        {/* Year Routes */}
                        <Route path="/movies/year/:year" element={
                            <MediaPage 
                                title="Movies by Year"
                                fetchMedia={(page) => {
                                    const year = window.location.pathname.split('/').pop();
                                    return getMoviesByYear(Number(year), page);
                                }}
                                type="movie"
                            />
                        } />
                        <Route path="/tv-shows/year/:year" element={
                            <MediaPage 
                                title="TV Shows by Year"
                                fetchMedia={(page) => {
                                    const year = window.location.pathname.split('/').pop();
                                    return getTVShowsByYear(Number(year), page);
                                }}
                                type="tv"
                            />
                        } />

                        {/* Person Route */}
                        <Route path="/person/:id" element={<PersonPage />} />

                        {/* Collection Route */}
                        <Route path="/collection/:id" element={<CollectionPage />} />

                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/movies" element={<MoviesPage />} />
                        <Route path="/user/:userId/dashboard" element={<UserDashboard />} />
                        <Route path="/user/:userId/profile" element={<UserDashboard />} />

                        {/* Add these new routes for countries */}
                        <Route path="/movies/country/:countryCode" element={
                            <MediaPage 
                                title="Movies by Country"
                                fetchMedia={(page) => {
                                    const countryCode = window.location.pathname.split('/').pop();
                                    return getMoviesByCountry(countryCode || '', page);
                                }}
                                type="movie"
                            />
                        } />
                        <Route path="/tv-shows/country/:countryCode" element={
                            <MediaPage 
                                title="TV Shows by Country"
                                fetchMedia={(page) => {
                                    const countryCode = window.location.pathname.split('/').pop();
                                    return getTVShowsByCountry(countryCode || '', page);
                                }}
                                type="tv"
                            />
                        } />
                    </Routes>
                </ErrorBoundary>
            </Router>
        </AuthProvider>
    );
};

export default App;
