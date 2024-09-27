"use client";
import { useEffect, useState } from "react";
import Container from "./ui/Container";
import {
  getMovie,
  getMovieCredits,
  getMovieImages,
  getMovieVideos,
  getPopularMovies,
} from "@/queries/queries";
import dayjs from "dayjs";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import Slider from "react-slick";
import { imagesSettings } from "@/utils/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  CreditsType,
  ImageType,
  MovieDetailType,
  MovieType,
  VideoType,
} from "@/types/common";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaRegImages } from "react-icons/fa6";
import formatTime from "@/utils/formatTime";
import PersonPlaceholder from "../../public/images/personPlaceholder.png";
import Image from "next/image";
import RateStar from "./ui/RateStar";
import Trailer from "./Trailer";
import Videos from "./Videos";

const MovieDetail = ({ id }: { id: number }) => {
  const URL_IMAGE = process.env.NEXT_PUBLIC_URL_IMAGE;

  const [movie, setMovie] = useState<MovieDetailType>();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [images, setImages] = useState<ImageType>();
  const [credits, setCredits] = useState<CreditsType>();
  const [popularMovies, setPopularMovies] = useState<MovieType[]>([]);

  const fetchMovie = async () => {
    const res = await getMovie(id);
    setMovie(res);
  };

  const fetchVideos = async () => {
    const res = await getMovieVideos(id);
    setVideos(res);
  };

  const fetchImages = async () => {
    const res = await getMovieImages(id);
    setImages(res);
  };

  const fetchCredits = async () => {
    const res = await getMovieCredits(id);
    setCredits(res);
  };

  const fetchPopularMovies = async () => {
    const res = await getPopularMovies();
    setPopularMovies(res);
  };

  useEffect(() => {
    fetchMovie();
    fetchVideos();
    fetchImages();
    fetchCredits();
    fetchPopularMovies();
  }, []);
  if (movie && videos && images) {
    const trailer = videos.filter(
      (video) => video.type === "Trailer" && video.name.includes("Trailer")
    );
    const director = credits?.crew.filter(
      (person) => person.job === "Director"
    );
    const writer = credits?.crew.filter(
      (person) => person.department === "Writing"
    );
    return (
      <Container>
        <div className="grid grid-cols-8 lg:grid-cols-12">
          <div className="col-span-8 sm:col-span-full flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-5xl">{movie.title}</h1>
              <div className="text-lightGray text-sm py-3">
                <p className="text-lightGray">
                  Original title: {movie.original_title}
                </p>
                <div className="flex gap-2">
                  <p>{dayjs(movie.release_date).format("YYYY")}</p> -
                  <p>{formatTime(movie.runtime)}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex gap-8">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="uppercase text-lightGray">Rating</div>
                <RateStar averageRate={movie.vote_average} outOfTen />
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="uppercase text-lightGray">Popularity</div>
                <div className="flex items-center gap-2">
                  <div className="border border-secondary rounded-full p-1">
                    <FaArrowTrendUp className="text-secondary size-4" />
                  </div>
                  <div>{movie.popularity}</div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="hidden sm:block sm:col-span-2 lg:col-span-3"
            src={`${URL_IMAGE + movie.poster_path}`}
            alt={movie.title}
          />
          <Trailer
            videos={videos}
            backupImage={movie.backdrop_path}
            imageAlt={movie.title}
          />
          <div className="flex lg:flex-col col-span-full lg:col-span-2 gap-2">
            <Link
              href="#movie-videos"
              className="w-1/2 lg:w-auto lg:h-1/2 bg-darkGray flex justify-center items-center hover:bg-mediumGray"
            >
              <div className="py-3 flex lg:flex-col items-center gap-4 text-sm lg:text-base">
                <MdOutlineVideoLibrary className="text-secondary size-6" />
                <div> {videos.length} VIDEOS</div>
              </div>
            </Link>
            <Link
              href="#movie-images"
              className="w-1/2 lg:w-auto lg:h-1/2 bg-darkGray flex justify-center items-center hover:bg-mediumGray"
            >
              <div className="py-3 flex lg:flex-col items-center gap-4 text-sm lg:text-base">
                <FaRegImages className="text-secondary size-6" />
                {images.backdrops.length
                  ? images.backdrops.length
                  : images.posters.length
                  ? images.posters.length
                  : images.logos.length && images.logos.length}{" "}
                PHOTOS
              </div>
            </Link>
          </div>
          <div className="col-span-full flex py-6 gap-4 max-sm:w-full max-sm:overflow-hidden max-sm:overflow-x-scroll">
            {movie.genres.map((item) => (
              <div
                className="rounded-full border border-secondary/50 w-min px-5 py-1 hover:bg-secondary hover:text-primary whitespace-nowrap"
                key={item.id}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="col-span-full grid grid-cols-8 sm:grid-cols-12 ">
            <div className="col-span-8 border-b border-lightGray pb-3">
              {movie.overview}
            </div>
            <div className="hidden sm:block justify-center col-span-4 row-span-6 lg:row-span-5 relative">
              <div className="sticky pl-10 lg:pl-6 top-16 flex flex-col items-center">
                <h3 className="text-2xl pb-4">Most popular</h3>
                <div className="flex flex-col gap-4">
                  {popularMovies.slice(0, 4)?.map((item) => {
                    if (item.id == id) return;
                    return (
                      <Link
                        href={`/movies/${item.id}`}
                        className="flex items-center gap-4"
                        key={item.id}
                      >
                        <img
                          className="sm:size-24 lg:size-32 rounded-full object-cover"
                          src={`${URL_IMAGE + item.backdrop_path}`}
                          alt={item.title}
                        />
                        <div className="flex flex-col gap-2">
                          <p>{item.title}</p>
                          <RateStar averageRate={movie.vote_average} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-span-8 lg:hidden flex items-center pt-4 gap-4 border-b border-lightGray pb-3">
              <RateStar averageRate={movie.vote_average} outOfTen />
              <div className="flex items-center gap-2">
                <FaArrowTrendUp className="text-secondary size-4" />
                <div>{movie.popularity}</div>
              </div>
            </div>
            {director && (
              <div className="col-span-8 border-b border-lightGray py-3">
                <div className="flex gap-2">
                  <p className="font-bold">Director</p>
                  <Link href={`/person/${director[0].id}`}>
                    {director[0].name}
                  </Link>
                </div>
              </div>
            )}
            <div className="col-span-8 border-b border-lightGray py-3">
              <div className="flex gap-2">
                <p className="font-bold">Writer</p>
                <div className="flex gap-3">
                  <div>
                    {writer?.slice(0, 2).map((person) => (
                      <span key={person.id}>
                        <Link href={`/person/${person.id}`}>
                          {person.name}{" "}
                        </Link>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-8">
              <p className="font-bold text-2xl pt-3">Cast</p>
            </div>
            <div className="col-span-8 border-b border-lightGray py-3 grid grid-cols-8 gap-3">
              {credits?.cast.slice(0, 8).map((person) => (
                <Link
                  key={person.id}
                  className="col-span-4 lg:col-span-2"
                  href={`/person/${person.id}`}
                >
                  {person.profile_path ? (
                    <img
                      className="size-72 object-cover object-top sm:object-center lg:object-top"
                      src={`${URL_IMAGE + person.profile_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <Image
                      className="size-72 object-cover object-top sm:object-center lg:object-top"
                      src={PersonPlaceholder}
                      alt={movie.title}
                    />
                  )}
                  <div className="font-bold pt-3">{person.name}</div>
                  <div className="text-lightGray font-light pb-3">
                    {person.character}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Videos videos={videos} />
        </div>
        <h2 id="movie-images" className="text-2xl col-span-full py-10">
          Images
        </h2>
        <Slider {...imagesSettings}>
          {images.backdrops.map((image) => {
            return (
              <img
                key={image.file_path}
                src={`${URL_IMAGE + image.file_path}`}
                alt={movie.title}
              />
            );
          })}
        </Slider>
      </Container>
    );
  }
};

export default MovieDetail;
