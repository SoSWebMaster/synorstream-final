// @ts-nocheck
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "./newPlayer.css";
import {
   updateAllSongs,
   updateIsLoading,
} from "../../store/music-store";
import { useAppDispatch,useAppSelector } from "../../store";
import { useCallback, useEffect, useRef, useState } from "react";
import { SongInterface } from "../song/songTypes";
import SongItem2 from "./songItem2";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { CircularProgress } from "@mui/material";
const NewPlayer = () => {
   const dispatch = useAppDispatch();
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const { songType, filterCategories, search, isLoading } = useAppSelector(
      (state: any) => state.music
   );
   const swiperRef = useRef(null);
   const perPage = 4;

   useEffect(() => {
      fetchSongs();
   }, [songType, filterCategories, search]);
   const fetchSongs = useCallback(async () => {
      try {
         const response = await axiosInstance.post(
            endPoints?.fetch_unique_music_json,
            {
               post: songType,
               page: 1,
               single_page: "staging2.syncorstream.com",
               categories: filterCategories,
               per_page: perPage,
               user: 155,
               search,
            }
         );
         const records = response?.data?.records;
         if (records) {
            dispatch(updateIsLoading(true));
            setSongs(records);
         }
         // console.log( records );
      } catch (e) {
         console.error("unable to fetch songs!!!",e);
      }
   }, [setSongs, songType, filterCategories, search, isLoading]);

   let firstSongId: number | string | null = null;
   let allSongs = {};
   const items = songs.map((song, i) => {
      // saving first song ID because the way we saving all songs in a object with number as a key
      // because of that it will automatically reorderd song object and we get all songs in sequence
      // but we don't want that, what we want is the first song ID.
      if (i === 0) firstSongId = song.id;

      allSongs = { ...allSongs, [song.id]: song };
      return (
         <SwiperSlide>
            <SongItem2 key={song.id} {...song} swiperRef={swiperRef} />
         </SwiperSlide>
      );
   });

   useEffect(() => {
      // console.log( allSongs );
      dispatch(updateAllSongs(allSongs));

      // first song to be active by default because it need by the bottom music player
      // if (typeof firstSongId === "number")
      //    dispatch(updateFirstSongId(firstSongId));
   }, [songs]);

   return (
      <>
         {songs?.length>0 ? (
            <Swiper
            loop={true}
            ref={swiperRef}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            speed={700}
            spaceBetween={100}
            pagination={{
               clickable: true,
               el: `swiper-container swiper-container-testClass`,
               bulletClass: `swiper-pagination-bullet swiper-pagination-testClass`,
            }}
            coverflowEffect={{
               rotate: 1,
               stretch: 390,
               depth: 150,
               modifier: 1,
               slideShadows: true,
            }}
            modules={[EffectCoverflow, Pagination]}
            initialSlide={3}
            className="rounded-3xl "
    
         >
            {items}
         </Swiper>
         ): <p className={`text-center ${!isLoading ? '!hidden' : '!block'} `}><CircularProgress size={40} /></p> }
       
         
      </>
   );
};

export default NewPlayer;
