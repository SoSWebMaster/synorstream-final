//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import SongItem from "./SongItem";
import {
   updateAllSongs,
   updateCurrentSongId,
   updateCurrentSong,
   stopCurrentSong,
   updateAudioRef,
   updateIsPlaying,
} from "../../store/updated-music-store";
import { useAppDispatch, useAppSelector } from "../../store";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { CircularProgress } from "@mui/material";
import useAudioPlayer from "../../hooks/use-audio";
import { prevSong } from "../../store/music-store";

const perPage = 8;

interface SongsProps {
   className?: string;
}

export default function Songs({ className }: SongsProps) {
   const [songs, setSongs] = useState<any[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [isMoreLoading, setIsMoreLoading] = useState(false);
   const [hasError, setHasError] = useState(false);
   const [hasMoreSongs, setHasMoreSongs] = useState(false);
   const { play, pause } = useAudioPlayer();

   const {
      currentSongRef,
      currentSongId,
      isPlaying,
      filterCategories,
      search,
   } = useAppSelector((state) => state.updatedMusicStore);

   const dispatch = useAppDispatch();
   const fetchSongs = useCallback(async () => {
      try {
         if (hasMoreSongs) {
            setIsMoreLoading(true);
         } else {
            setIsLoading(true);
         }
         const response = await axiosInstance.post(endPoints.fetch_music_json, {
            post: 0,
            page: currentPage,
            single_page: "staging2.syncorstream.com",
            categories: filterCategories,
            per_page: perPage,
            user: 155,
            search: search,
            source: "react",
         });

         const { records, count } = response.data;

         console.log(records)

         setSongs((prevSongs) => [...prevSongs, ...records]); // Spread and add new records

         const totalSongs = records.length + prevSongs?.length ;
         console.log("totalsongs", totalSongs);

         if (records.length > perPage || totalSongs <= count) {
            setHasMoreSongs(true);
         }

         dispatch(
            updateAllSongs(
               records.reduce((acc, song) => ({ ...acc, [song.id]: song }), {})
            )
         );
      } catch (error) {
         setHasError(true);
      } finally {
         setIsLoading(false);
         setHasError(false);
         setIsMoreLoading(false);
      }
   }, [dispatch, filterCategories, currentPage, search]);

   useEffect(() => {
      fetchSongs();
   }, [currentPage]);

   const loadMoreSongs = () => {
      if (!isLoading && hasMoreSongs) {
         setCurrentPage((prevPage) => prevPage + 1);
      }
   };

   const handlePlay = useCallback(
      (song) => {
         play(song);
      },
      [play]
   );

   const handlePause = useCallback(() => {
      pause();
   }, [pause]);

   useEffect(() => {
      dispatch(updateCurrentSong(songs[0]));
   }, [songs]);

   return (
      <div className={className || ""}>
         {isLoading && (
            <div className="flex w-full items-center justify-center">
               <CircularProgress color="warning" size={40} />
            </div>
         )}
         {hasError && <p>Something went wrong, please try again.</p>}

         {songs.length > 0 && (
            <>
               {songs.map((song, index) => (
                  <SongItem key={index} song={song} />
               ))}

               {hasMoreSongs && (
                  <div className="text-center">
                     <button
                        className="bg-[#0816bf] px-4 py-1 rounded-full font-semibold text-base mt-4"
                        onClick={loadMoreSongs}
                     >
                        {isMoreLoading ? "Loading..." : "LOAD MORE"}
                     </button>
                  </div>
               )}
            </>
         )}
      </div>
   );
}
