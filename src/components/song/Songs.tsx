// import { useState, useEffect, useCallback } from "react";
// import SongItem from "./SongItem";
// import {
//    updateAllSongs,
//    updateFirstSongId,
//    updateCurrentSongId,
//    updateIsPlaying,
//    updateCurrentDuration,
//    updateCurrentSong,
//    updateAudioRef,
// } from "../../store/music-store";
// import { callStack } from "../../util/util";
// import { useAppDispatch, useAppSelector } from "../../store";
// import { SongInterface } from "./songTypes";
// import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
// import { endPoints } from "../../services/constants/endPoint";
// import { CircularProgress } from "@mui/material";
// const perPage = 8;

// interface SongsProps {
//    className?: string;
// }

// export default function Songs({ className }: SongsProps) {
//    const [songs, setSongs] = useState<SongInterface[]>([]);
//    const [isLoading, setIsLoading] = useState(false);
//    const [isLoading2, setIsLoading2] = useState(false);
//    const [hasError, setHasError] = useState(false);
//    const [currentPage, setCurrentPage] = useState(1);
//    const [currentCount, setCurrentCount] = useState(0);
//    const {
//       songType,
//       filterCategories,
//       search,
//       single_page,
//       playListFilter,
//       isPlaying,
//    } = useAppSelector((state) => state.music);
//    const { success } = useAppSelector((state) => state.auth);
//    const dispatch = useAppDispatch();

//    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
//       null
//    );
//    const [currentPlayingSongId, setCurrentPlayingSongId] = useState<
//       number | null
//    >(null);

//    const [anotherId, setAnotherID] = useState<number | null>(null);

//    useEffect(() => {
//       //@ts-ignore
//       setCurrentAudio(songs[0]?.audio);
//       //@ts-ignore
//       setCurrentPlayingSongId(songs[0]?.id);
//       //@ts-ignore
//       setAnotherID(songs[0]?.id);
//       dispatch(updateAudioRef(songs[0]?.audio));
//    }, []);

//    const handlePlay = (audio: any, songId: any) => {
//       if (currentAudio && currentAudio !== audio) {
//          currentAudio.pause();
//          setCurrentPlayingSongId(null);
//       }

//       setCurrentAudio(audio);
//       setCurrentPlayingSongId(songId);
//       setAnotherID(songId);
//       dispatch(updateAudioRef(audio));
//    };

//    const handlePause = () => {
//       if (currentAudio) {
//          currentAudio.pause();
//          setCurrentPlayingSongId(null);
//          // setCurrentAudio(null);
//          // dispatch(updateAudioRef(null))
//       }
//    };

//    const fetchSongs = useCallback(async () => {
//       setHasError(false);
//       setIsLoading(true);
//       try {
//          const response = await axiosInstance.post(
//             endPoints?.fetch_music_json,
//             {
//                post: songType,
//                page: currentPage,
//                single_page: "staging2.syncorstream.com",
//                categories: filterCategories,
//                per_page: perPage,
//                user: 155,
//                search,
//                source: "react",
//             }
//          );
//          const result = response;
//          const records = result?.data?.records;

//          if (typeof result.data.count === "number")
//             setCurrentCount(result.data.count);

//          if (Array.isArray(records)) {
//             if (currentPage === 1) {
//                setSongs(records);
//             } else if (currentPage > 1) {
//                setSongs((state) => [...state, ...records]);
//             }
//          } else {
//             setSongs([]);
//          }

//          setIsLoading(false);
//       } catch (e) {
//          console.error("unable to fetch songs!!!");
//          setHasError(true);
//          setIsLoading(false);
//       }
//    }, [
//       setSongs,
//       setIsLoading,
//       currentPage,
//       songType,
//       filterCategories,
//       search,
//       playListFilter,
//    ]);

//    const loadMoreSongs = useCallback(async () => {
//       setIsLoading2(true);
//       try {
//          const response = await axiosInstance.post(
//             endPoints?.fetch_music_json,
//             {
//                post: songType,
//                page: currentPage + 1,
//                single_page: "staging2.syncorstream.com",
//                categories: filterCategories.toString(),
//                per_page: perPage,
//                user: 155,
//                source: "react",
//             }
//          );

//          const result = response;
//          const records = result?.data?.records;

//          if (typeof result.data.count === "number")
//             setCurrentCount(result.data.count);

//          if (records) {
//             setIsLoading2(false);
//             // console.log( records )
//             setSongs((state) => [...state, ...records]);
//             setCurrentPage((state) => ++state);
//          }
//          setIsLoading2(false);
//       } catch (e) {
//          setIsLoading2(false);
//          console.error("unable to fetch new songs!!!");
//       }
//    }, [currentPage, songType, filterCategories, search]);

//    useEffect(() => {
//       callStack.empty();
//       fetchSongs();
//    }, [
//       songType,
//       filterCategories,
//       search,
//       success,
//       single_page,
//       playListFilter,
//    ]);

//    useEffect(() => {
//       setCurrentPage(1);
//    }, [songType, filterCategories]);

//    let allSongs = {};
//    let firstSongId: number | string | null = null;

//    const items = songs.map((song, i) => {
//       if (i === 0) firstSongId = song.id;
//       allSongs = { ...allSongs, [song.id]: song };
//       return (
//          <SongItem
//             key={song.id}
//             song={song}
//             isPlaying={song.id === currentPlayingSongId}
//             onPlay={(audio) => handlePlay(audio, song.id)}
//             onPause={handlePause}
//          />
//       );
//    });

//    useEffect(() => {
//       if (!isPlaying) {
//          handlePause();
//       } else {
//          handlePlay(currentAudio, anotherId);
//       }
//    }, [isPlaying]);

//    useEffect(() => {
//       dispatch(updateAllSongs(allSongs));
//       if (typeof firstSongId === "number")
//          dispatch(updateFirstSongId(firstSongId));
//    }, [songs]);

//    useEffect(() => {
//       setCurrentPage(1);

//       dispatch(updateCurrentSongId(null));
//       dispatch(updateFirstSongId(null));
//       dispatch(updateCurrentSong(null));
//       dispatch(updateCurrentDuration(null));
//       dispatch(updateIsPlaying(false));
//    }, [filterCategories, search, songType]);

//    return (
//       <div className={`${className ? className + " " : ""}`}>
//          <div>
//             {!isLoading && !hasError && items}
//             {!isLoading && !hasError && items.length === 0 && (
//                <p>Song not found</p>
//             )}
//             {!isLoading &&
//                !hasError &&
//                items.length > 0 &&
//                perPage * currentPage < currentCount && (
//                   <div className="text-center">
//                      <button
//                         className="bg-[#0816bf] px-4 py-1 rounded-full font-semibold text-base mt-4"
//                         onClick={() => loadMoreSongs()}
//                      >
//                         LOAD MORE{" "}
//                         {isLoading2 && (
//                            <CircularProgress color="primary" size={20} />
//                         )}
//                      </button>
//                   </div>
//                )}
//             {isLoading && <CircularProgress color="warning" size={40} />}
//             {!isLoading && hasError && (
//                <p>Something went wrong please try again.</p>
//             )}
//          </div>
//       </div>
//    );
// }
//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import SongItem from "./SongItem";
import {
   updateAllSongs,
   //   updateFirstSongId,
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
         // Stop any currently playing song before starting a new one
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

   useEffect(() => {
      if (!isPlaying) {
         handlePauseSong();
      }
   }, []);

   useEffect(() => {
      // updateAudioRef(new Audio(songs[0]?.audio));
      dispatch(updateCurrentSong(songs[0]))
      console.log('in useeffect')
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
                     onPlay={() => handlePlaySong(song)} // Pass handlePlaySong to SongItem
                     onPause={handlePauseSong} // Pass handlePauseSong to SongItem
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
