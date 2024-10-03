//@ts-nocheck
import { useCallback, useEffect, useState } from "react";
import DashboardComponent2 from "..";
import Filter from "../../filter/Filter";
import axiosInstance from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import { SongInterface } from "../../song/songTypes";
import { useAppSelector, useAppDispatch } from "../../../store";
import SongItem from "../../song/SongItem";
import { CircularProgress } from "@mui/material";
import { updateAudioRef, updateAllSongs } from "../../../store/music-store";
import Player from "../../player/Player";
const perPage = 8;
const FavoritesComponent2 = () => {
   const axiosInstanceAuth = axiosInstance();
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [hasError, setHasError] = useState(false);
   const { songType, filterCategories, search, single_page, isPlaying } =
      useAppSelector((state) => state.updatedMusicStore);
   const { user } = useAppSelector((state) => state.auth);
   const dispatch = useAppDispatch();
   const [userTier, setUserTier] = useState<any>();

   const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
      null
   );
   const [currentPlayingSongId, setCurrentPlayingSongId] = useState<
      number | null
   >(null);

   const [anotherId, setAnotherID] = useState<number | null>(null);

   const handlePlay = (audio: any, songId: any) => {
      if (currentAudio && currentAudio !== audio) {
         currentAudio.pause();
         setCurrentPlayingSongId(null);
      }

      setCurrentAudio(audio);
      setCurrentPlayingSongId(songId);
      setAnotherID(songId);
      dispatch(updateAudioRef(audio));
   };

   const handlePause = () => {
      if (currentAudio) {
         currentAudio.pause();
         setCurrentPlayingSongId(null);
         // setCurrentAudio(null);
         dispatch(updateAudioRef(null));
      }
   };

   useEffect(() => {
      let tier = localStorage.getItem("currentPlan");

      setUserTier(tier);
   }, []);

   const returnTierAudio = (record: any) => {
      if (userTier === "1") {
         return record?.audio_aac;
      } else if (userTier === "2") {
         return record?.audio_mp3;
      } else if (userTier === "3") {
         return record?.audio_wav;
      }

      return null;
   };


   const fetchSongs = useCallback(
      async () => {
         // setHasError( false );
         setIsLoading(true);
         try {
            const response = await axiosInstanceAuth.post(
               endPoints?.fetch_data_favorites,
               {
                  post: songType,
                  page: currentPage,
                  single_page: "favorites",
                  categories: filterCategories
                     ? filterCategories.split(',').map(Number)
                     : [],
                  per_page: perPage,
                  user: user?.id,
                  search: search,
                  page_name: "favorites",
               }
            );
            const records = response?.data?.records;
            let mappedArray = records.map((record) => ({
               id: record.id,
               audio: record.audio_aac,
               thumb: record.thumb,
               name: record.name,
               artis_name: record.artis_name,
               flt_name: record.flt_name,
            }));
            setSongs(mappedArray);
            dispatch(
               updateAllSongs(
                  records.reduce(
                     (acc, song) => ({ ...acc, [song.id]: song }),
                     {}
                  )
               )
            );

            setIsLoading(false);
         } catch (e) {
            console.error("unable to fetch songs!!!");
            setHasError(true);
            setIsLoading(false);
         }
      }, [dispatch, filterCategories, currentPage, search]

   )
   let allSongs = {};


   useEffect(() => {
      fetchSongs();
   }, [fetchSongs]);

   const items = songs.map((song, i) => {
      allSongs = { ...allSongs, [song.id]: song };
      return (
         <SongItem
            key={song.id}
            song={song}
            isPlaying={song.id === currentPlayingSongId}
            onPlay={(audio) => handlePlay(audio, song.id)}
            onPause={handlePause}
         />
      );
   });

   // useEffect(() => {
   //    if (!isPlaying) {
   //       handlePause();
   //    } else {
   //       // if (currentAudio) {
   //       handlePlay(currentAudio, anotherId);
   //       // }
   //       // currentAudio?.play()
   //    }
   //    // currentAudio?.play()
   // }, [isPlaying]);

   return (
      <>
         <DashboardComponent2>
            <div className="flex min-h-screen gap-6 mb-20 text-white bg-black/50 md:p-5 !bg-[url('/static/images/Website-Background.png')] !h-full">
               <Filter className=" md:w-1/6 md:sticky md:top-0" />
               {isLoading ? (
                  <CircularProgress color="warning" size={40} />
               ) : songs?.length > 0 ? (

                  <div className="md:w-5/6">
                     {items}
                  </div>

               ) : (
                  <div>Songs Not Found</div>
               )}
            </div>
            <Player/>
         </DashboardComponent2>
      </>
   );
};

export default FavoritesComponent2;
