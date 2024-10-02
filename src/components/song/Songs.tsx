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

const perPage = 8;

interface SongsProps {
   className?: string;
}

export default function Songs({ className }: SongsProps) {
   const [songs, setSongs] = useState<any[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [hasError, setHasError] = useState(false);
   const [hasMoreSongs, setHasMoreSongs] = useState(true);
   const { play, pause } = useAudioPlayer()

   const { currentSongRef, currentSongId, isPlaying, filterCategories, search } =
      useAppSelector((state) => state.updatedMusicStore);
   const dispatch = useAppDispatch();
   const fetchSongs = useCallback(
      async (page = 1) => {
         setIsLoading(true);
         setHasError(false);
         // setSongs([])
         try {
            const response = await axiosInstance.post(
               endPoints.fetch_music_json,
               {
                  post: 0,
                  page: currentPage,
                  single_page: "staging2.syncorstream.com",
                  categories: filterCategories,
                  per_page: perPage,
                  user: 155,
                  search: search,
                  source: "react",
               }
            );

            const { records, count } = response.data;
            if (Array.isArray(records)) {
               setSongs((prevSongs) =>
                  page === 1 ? records : [...prevSongs, ...records]
               );

               if (
                  records.length < perPage ||
                  songs.length + records.length >= count
               ) {
                  setHasMoreSongs(false);
               }

               // Update the list of all songs in the Redux store
               dispatch(
                  updateAllSongs(
                     records.reduce(
                        (acc, song) => ({ ...acc, [song.id]: song }),
                        {}
                     )
                  )
               );

               // Set the first song ID
               //   if (page === 1 && records.length > 0) {
               //     dispatch(updateFirstSongId(records[0].id));
               //   }
            }
         } catch (error) {
            setHasError(true);
         } finally {
            setIsLoading(false);
         }
      },
      [dispatch, filterCategories, currentPage, search]
   );

   useEffect(() => {
      fetchSongs(1);
   }, [fetchSongs]);

   const loadMoreSongs = () => {
      if (!isLoading && hasMoreSongs) {
         setCurrentPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchSongs(nextPage);
            return nextPage;
         });
      }
   };

   const handlePlaySong = (song: any) => {
      if (currentSongRef && currentSongId !== song.id) {
         dispatch(stopCurrentSong());
      }

      const audioElement = currentSongRef || new Audio(song.audio);
      audioElement.src = song.audio;

      dispatch(updateAudioRef(audioElement)); // Update the global audio element reference
      dispatch(updateCurrentSongId(song.id)); // Set the current song ID in Redux
      dispatch(updateCurrentSong(song)); // Set the current song data in Redux
      dispatch(updateIsPlaying(true)); // Set the global play state to true

      audioElement.play();
   };

   const handlePauseSong = () => {
      if (currentSongRef) {
         currentSongRef.pause();
         dispatch(updateIsPlaying(false)); // Set the play state to false
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
      dispatch(updateCurrentSong(songs[0]))
   }, [songs]);

   return (
      <div className={className || ""}>
         {isLoading && currentPage === 1 && (
            <CircularProgress color="warning" size={40} />
         )}
         {hasError && <p>Something went wrong, please try again.</p>}

         {!isLoading && songs.length > 0 && (
            <>
               {songs.map((song) => (
                  <SongItem
                     key={song.id}
                     song={song}
                  />
               ))}

               {hasMoreSongs && (
                  <div className="text-center">
                     <button
                        className="bg-[#0816bf] px-4 py-1 rounded-full font-semibold text-base mt-4"
                        onClick={loadMoreSongs}
                     >
                        {isLoading ? "Loading..." : "LOAD MORE"}
                     </button>
                  </div>
               )}
            </>
         )}

         {!isLoading && songs.length === 0 && !hasError && (
            <p>No songs found.</p>
         )}
      </div>
   );
}
