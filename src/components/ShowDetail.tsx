"use client";
import {
  getPopularShows,
  getShow,
  getShowCredits,
  getShowImages,
  getShowVideos,
} from "@/queries/queries";
import { useEffect, useState } from "react";
import Container from "./ui/Container";
import {
  CreditsType,
  ImageType,
  MovieType,
  ShowDetailType,
  VideoType,
} from "@/types/common";
import dayjs from "dayjs";
import formatTime from "@/utils/formatTime";
import RateStar from "./ui/RateStar";
import { FaArrowTrendUp } from "react-icons/fa6";
import Link from "next/link";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaRegImages } from "react-icons/fa";
import Image from "next/image";
import PersonPlaceholder from "../../public/images/personPlaceholder.png";
import Slider from "react-slick";
import { imagesSettings } from "@/utils/slider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Trailer from "./Trailer";
import Videos from "./Videos";
import Cast from "./Cast";

const ShowDetail = ({ id }: { id: number }) => {
  const URL_IMAGE = process.env.NEXT_PUBLIC_URL_IMAGE;

  const [show, setShow] = useState<ShowDetailType>();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [images, setImages] = useState<ImageType>();
  const [credits, setCredits] = useState<CreditsType>();

  const [popularShows, setPopularShows] = useState<MovieType[]>([]);

  const fetchShow = async () => {
    const res = await getShow(id);
    setShow(res);
  };

  const fetchVideos = async () => {
    const res = await getShowVideos(id);
    setVideos(res);
  };
  const fetchImages = async () => {
    const res = await getShowImages(id);
    setImages(res);
  };

  const fetchCredits = async () => {
    const res = await getShowCredits(id);
    setCredits(res);
  };

  const fetchPopularShows = async () => {
    const res = await getPopularShows();
    setPopularShows(res);
  };

  useEffect(() => {
    fetchShow();
    fetchVideos();
    fetchImages();
    fetchCredits();
    fetchPopularShows();
  }, []);

  if (show && videos && images) {
    return (
      <Container>
        <div className="grid grid-cols-8 lg:grid-cols-12">
          <div className="col-span-8 sm:col-span-full flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-5xl">{show.name}</h1>
              <div className="text-lightGray text-sm py-3">
                <div className="flex gap-2">
                  <p>{dayjs(show.first_air_date).format("YYYY")}</p> -{" "}
                  <p>{dayjs(show.last_air_date).format("YYYY")}</p>
                  <p>{formatTime(show.episode_run_time[0])}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex gap-8">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="uppercase text-lightGray">Rating</div>
                <RateStar averageRate={show.vote_average} outOfTen />
              </div>
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="uppercase text-lightGray">Popularity</div>
                <div className="flex items-center gap-2">
                  <div className="border border-secondary rounded-full p-1">
                    <FaArrowTrendUp className="text-secondary size-4" />
                  </div>
                  <div>{show.popularity}</div>
                </div>
              </div>
            </div>
          </div>
          <img
            className="hidden sm:block sm:col-span-2 lg:col-span-3"
            src={`${URL_IMAGE + show.poster_path}`}
            alt={show.name}
          />
          <Trailer
            videos={videos}
            backupImage={show.backdrop_path}
            imageAlt={show.name}
          />
          <div className="flex lg:flex-col col-span-full lg:col-span-2 gap-2">
            <Link
              href="#show-videos"
              className="w-1/2 lg:w-auto lg:h-1/2 bg-darkGray flex justify-center items-center hover:bg-mediumGray"
            >
              <div className="py-3 flex lg:flex-col items-center gap-4 text-sm lg:text-base">
                <MdOutlineVideoLibrary className="text-secondary size-6" />
                <div> {videos.length} VIDEOS</div>
              </div>
            </Link>
            <Link
              href="#show-images"
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
            {show.genres.map((item) => (
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
              {show.overview}
            </div>
            <div className="hidden sm:block justify-center col-span-4 row-span-6 lg:row-span-5 relative">
              <div className="sticky pl-10 lg:pl-6 top-16 flex flex-col items-center">
                <h3 className="text-2xl pb-4">Most popular</h3>
                <div className="flex flex-col gap-4">
                  {popularShows.slice(0, 4)?.map((item) => {
                    if (item.id == id) return;
                    return (
                      <Link
                        href={`/shows/${item.id}`}
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
                          <RateStar averageRate={show.vote_average} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-span-8 lg:hidden flex items-center pt-4 gap-4 border-b border-lightGray pb-3">
              <RateStar averageRate={show.vote_average} outOfTen />
              <div className="flex items-center gap-2">
                <FaArrowTrendUp className="text-secondary size-4" />
                <div>{show.popularity}</div>
              </div>
            </div>
            {show.created_by[0]?.id && (
              <div className="col-span-8 border-b border-lightGray py-3">
                <div className="flex gap-2">
                  <p className="font-bold">Director</p>
                  <Link href={`/person/${show.created_by[0].id}`}>
                    {show.created_by[0].name}
                  </Link>
                </div>
              </div>
            )}
            <Cast credits={credits!} imageAlt={show.name} />
            <div className="col-span-8">
              <p className="w-full font-bold text-2xl pt-3">Cast</p>
              <div className="w-full border-b border-lightGray py-3 grid grid-cols-8 gap-3">
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
                        alt={show.name}
                      />
                    ) : (
                      <Image
                        className="size-72 object-cover object-top sm:object-center lg:object-top"
                        src={PersonPlaceholder}
                        alt={show.name}
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
                alt={show.name}
              />
            );
          })}
        </Slider>
      </Container>
    );
  }
};

export default ShowDetail;
