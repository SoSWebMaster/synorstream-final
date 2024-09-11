import { useState, useEffect, useCallback } from "react";
import SongItem from "./SongItem";
import {
   updateAllSongs,
   updateFirstSongId,
   updateCurrentSongId,
   updateIsPlaying,
   updateCurrentDuration,
   updateCurrentSong,
} from "../../store/music-store";
import { callStack } from "../../util/util";
import { useAppDispatch, useAppSelector } from "../../store";
import { SongInterface } from "./songTypes";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { CircularProgress } from "@mui/material";
const perPage = 8;

interface SongsProps {
   className?: string;
}

export default function Songs({ className }: SongsProps) {
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isLoading2, setIsLoading2] = useState(false);
   const [hasError, setHasError] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [currentCount, setCurrentCount] = useState(0);
   const {
      songType,
      filterCategories,
      search,
      single_page,
      playListFilter,
      isPlaying,
   } = useAppSelector((state) => state.music);
   const { success } = useAppSelector((state) => state.auth);
   const dispatch = useAppDispatch();

   const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
      null
   );
   const [currentPlayingSongId, setCurrentPlayingSongId] = useState<
      number | null
   >(null);

   const handlePlay = (audio: HTMLAudioElement, songId: any) => {
      if (currentAudio && currentAudio !== audio) {
         currentAudio.pause();
         setCurrentPlayingSongId(null);
      }

      setCurrentAudio(audio);
      setCurrentPlayingSongId(songId);
   };

   const handlePause = () => {
      if (currentAudio) {
         currentAudio.pause();
         setCurrentPlayingSongId(null);
      }
   };

   console.log("Current audio", currentAudio);

   const fetchSongs = useCallback(async () => {
      setHasError(false);
      setIsLoading(true);
      try {
         const response = await axiosInstance.post(
            endPoints?.fetch_music_json,
            {
               post: songType,
               page: currentPage,
               single_page: "staging2.syncorstream.com",
               categories: filterCategories,
               per_page: perPage,
               user: 155,
               search,
               source: "react",
            }
         );
         const result = response;
         const records = result?.data?.records;

         if (typeof result.data.count === "number")
            setCurrentCount(result.data.count);

         if (Array.isArray(records)) {
            if (currentPage === 1) {
               setSongs(records);
            } else if (currentPage > 1) {
               setSongs((state) => [...state, ...records]);
            }
         } else {
            setSongs([]);
         }

         setIsLoading(false);
      } catch (e) {
         console.error("unable to fetch songs!!!");
         setHasError(true);
         setIsLoading(false);
      }
   }, [
      setSongs,
      setIsLoading,
      currentPage,
      songType,
      filterCategories,
      search,
      playListFilter,
   ]);

   const loadMoreSongs = useCallback(async () => {
      setIsLoading2(true);
      try {
         const response = await axiosInstance.post(
            endPoints?.fetch_music_json,
            {
               post: songType,
               page: currentPage + 1,
               single_page: "staging2.syncorstream.com",
               categories: filterCategories.toString(),
               per_page: perPage,
               user: 155,
               source: "react",
            }
         );

         const result = response;
         const records = result?.data?.records;

         if (typeof result.data.count === "number")
            setCurrentCount(result.data.count);

         if (records) {
            setIsLoading2(false);
            // console.log( records )
            setSongs((state) => [...state, ...records]);
            setCurrentPage((state) => ++state);
         }
         setIsLoading2(false);
      } catch (e) {
         setIsLoading2(false);
         console.error("unable to fetch new songs!!!");
      }
   }, [currentPage, songType, filterCategories, search]);

   useEffect(() => {
      callStack.empty();
      fetchSongs();
   }, [
      songType,
      filterCategories,
      search,
      success,
      single_page,
      playListFilter,
   ]);

   useEffect(() => {
      setCurrentPage(1);
   }, [songType, filterCategories]);

   let allSongs = {};
   let firstSongId: number | string | null = null;

   const items = songs.map((song, i) => {
      if (i === 0) firstSongId = song.id;
      console.log("FirstSongID", firstSongId);
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

   useEffect(() => {
      if (!isPlaying) {
         handlePause();
      }else{
         currentAudio?.play()
      }
   }, [isPlaying]);

   console.log("isPlaying redux", isPlaying);

   useEffect(() => {
      // console.log( allSongs );
      dispatch(updateAllSongs(allSongs));

      // first song to be active by default because it need by the bottom music player
      if (typeof firstSongId === "number")
         dispatch(updateFirstSongId(firstSongId));
   }, [songs]);

   // reset
   useEffect(() => {
      setCurrentPage(1);

      dispatch(updateCurrentSongId(null));
      dispatch(updateFirstSongId(null));
      dispatch(updateCurrentSong(null));
      dispatch(updateCurrentDuration(null));
      dispatch(updateIsPlaying(false));
   }, [filterCategories, search, songType]);

   return (
      <div className={`${className ? className + " " : ""}`}>
         <div>
            {!isLoading && !hasError && items}
            {!isLoading && !hasError && items.length === 0 && (
               <p>Song not found</p>
            )}
            {!isLoading &&
               !hasError &&
               items.length > 0 &&
               perPage * currentPage < currentCount && (
                  <div className="text-center">
                     <button
                        className="bg-[#0816bf] px-4 py-1 rounded-full font-semibold text-base mt-4"
                        onClick={() => loadMoreSongs()}
                     >
                        LOAD MORE{" "}
                        {isLoading2 && (
                           <CircularProgress color="primary" size={20} />
                        )}
                     </button>
                  </div>
               )}
            {isLoading && <CircularProgress color="warning" size={40} />}
            {!isLoading && hasError && (
               <p>Something went wrong please try again.</p>
            )}
         </div>
      </div>
   );
}
