import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Movie } from '../types/movie';
import { getSidebarRandomMovies } from '../services/movieService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RandomMoviesSwiper: React.FC = () => {
    const [randomMovies, setRandomMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchRandomMovies = async () => {
            const movies = await getSidebarRandomMovies(4);
            setRandomMovies(movies);
        };
        fetchRandomMovies();
    }, []);

    return (
        <div className="h-[500px]">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                pagination={{
                    clickable: true,
                    el: '.swiper-pagination'
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                loop={true}
                className="h-full"
            >
                {randomMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <Link to={`/movie/${movie.id}`} className="block relative h-full group">
                            <img 
                                src={movie.poster_path || undefined}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 z-10 bg-black/60 px-2 py-1 rounded-md
                                flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-white font-semibold">
                                    {movie.vote_average?.toFixed(1)}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4
                                transform transition-transform duration-300 group-hover:translate-y-0">
                                <h3 className="text-lg font-bold text-white text-center">
                                    {movie.title}
                                </h3>
                                <p className="text-sm text-gray-300 text-center mt-1">
                                    {new Date(movie.release_date).getFullYear()}
                                </p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
                <div className="swiper-pagination"></div>
            </Swiper>
        </div>
    );
};

export default RandomMoviesSwiper; 