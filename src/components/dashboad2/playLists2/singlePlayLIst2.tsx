import {
   Box,
   CircularProgress,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
   SelectChangeEvent,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../store";
import {
   updatePlayListFilter,
   updateFirstSongId,
   updateCurrentDuration,
   updateCurrentSong,
   updateCurrentSongId,
   updateIsPlaying
} from "../../../store/music-store";
import { useEffect, useState } from "react";
import { SongInterface } from "../../song/songTypes";
import SongItem from "../../song/SongItem";
import axiosInstance from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import DashboardComponent2 from "..";
import { useParams } from "react-router-dom";
import Player from "../../player/Player";

const perPage = 8;

const SinglePlayList2 = () => {
   const { id } = useParams();
   const { user } = useAppSelector((state) => state.auth);
   const {
      songType,
      filterCategories,
      search,
      playLists = [],
      isPlaying
   } = useAppSelector((state) => state.music);

   const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [fetchingSong, setFetchingSong] = useState(false);
   const axios = axiosInstance();

   const dispatch = useAppDispatch();
   const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
      null
   );
   const [currentPlayingSongId, setCurrentPlayingSongId] = useState<
      number | null
   >(null);

   const [anotherId, setAnotherID] = useState<
      number | null
   >(null);

   const handlePlay = (audio: any, songId: any) => {
      console.log('first')
      if (currentAudio && currentAudio !== audio) {
         currentAudio.pause();
         setCurrentPlayingSongId(null);
      }

      setCurrentAudio(audio);
      setCurrentPlayingSongId(songId);
      setAnotherID(songId)
      // dispatch(updateAudioRef(audio))
   };

   const handlePause = () => {
      if (currentAudio) {
         currentAudio.pause();
         setCurrentPlayingSongId(null);
         // setCurrentAudio(null);
         // dispatch(updateAudioRef(null))
      }
   };

   useEffect(() => {
      fetchSongs();
   }, [selectedPlaylist]); // Fetch songs whenever the selected playlist changes

   const fetchSongs = async () => {
      setFetchingSong(true);
      try {
         const response = await axios.post(endPoints?.fetch_data2, {
            post: songType,
            page: 1,
            single_page: "playlist",
            categories: filterCategories.split(","),
            per_page: perPage,
            user: user?.id,
            search,
            page_name: id,
         });
         let mappedArray = response?.data?.records.map((record: any) => ({
            id: record.id,
            audio: record.audio,
            thumb: record.thumb,
            name: record.name,
            artis_name: record.artis_name,
            flt_name: record.flt_name,
         }));
         setSongs(mappedArray);
         setFetchingSong(false);
      } catch (e) {
         console.error("Unable to fetch songs!!!", e);
         setFetchingSong(false);
      }
   };

   const handleChange = (event: SelectChangeEvent<string>) => {
      const playlistName = event.target.value;
      setSelectedPlaylist(playlistName);
      dispatch(updatePlayListFilter(playlistName));
   };

   let allSongs = {};
   let firstSongId: number | string | null = null;

   // const items = songs.map((song, i) => {
   //    if (i === 0) firstSongId = song.id;
   //    console.log("FirstSongID", firstSongId);
   //    allSongs = { ...allSongs, [song.id]: song };
   //    return (
   //       <SongItem
   //          key={song.id}
   //          song={song}
   //          isPlaying={song.id === currentPlayingSongId}
   //          onPlay={(audio) => handlePlay(audio, song.id)}
   //          onPause={handlePause}
   //       />
   //    );
   // });

   useEffect(() => {
      dispatch(updateCurrentSongId(null));
      dispatch(updateFirstSongId(null));
      dispatch(updateCurrentSong(null));
      dispatch(updateCurrentDuration(null));
      dispatch(updateIsPlaying(false));
   }, []);

   useEffect(() => {
      // first song to be active by default because it need by the bottom music player
      if (typeof firstSongId === "number")
         dispatch(updateFirstSongId(firstSongId));
   }, [songs]);

   console.log('pllaylists in redux', playLists)

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
         handlePause()
      } else {
         // if (currentAudio) {
         handlePlay(currentAudio, anotherId)
         // }
         // currentAudio?.play()
      }
      // currentAudio?.play()

   }, [isPlaying]);

   return (
      <>
         <DashboardComponent2>
            <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg">
               <div className="px-16 py-12 text-white">
                  <h1 className="text-[48px] font-medium">Playlists</h1>
                  <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                     <p className="text-[20px] text-justify">
                        Discover your next favorite jam with our curated
                        playlists! Dive into handpicked tracks that suit every
                        mood and moment. Explore, save, and share your
                        personalized playlists effortlessly. Let the music
                        journey begin and elevate your vibe!
                     </p>
                  </div>
               </div>
               <Box
                  sx={{ width: "100%" }}
                  className="!flex !justify-end !my-10"
               >
                  <FormControl className="!w-1/2 !flex !justify-end">
                     <InputLabel
                        sx={{
                           color: "white",
                           "&.Mui-focused": {
                              color: "white", // Change label color to white when focused
                           },
                        }}
                     >
                        Playlists
                     </InputLabel>
                     <Select
                        sx={{
                           color: "white",
                           "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FB8A2E",
                           },
                           "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FB8A2E",
                           },
                           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FB8A2E",
                           },
                           "& .MuiSvgIcon-root": {
                              color: "white", // Change chevron color to white
                           },
                        }}
                        value={selectedPlaylist} // Controlled value
                        onChange={handleChange}
                        label="Playlists"
                     >
                        {playLists.length > 0 &&
                           playLists.map((item, index) => (
                              <MenuItem
                                 key={`${index} + ${item?.name}`}
                                 value={item?.name} // Set value for MenuItem
                              >
                                 {item?.name}
                              </MenuItem>
                           ))}
                     </Select>
                  </FormControl>
               </Box>
               {/* <div className="w-6/6"> */}
                  {fetchingSong ? (
                     <CircularProgress
                        color="warning"
                        size={40}
                        className="ml-4"
                     />
                  ) : songs?.length > 0 ? (
                     items
                  ) : (
                     <div>No Songs Found..</div>
                  )}
               {/* </div> */}
            </div>
            <Player />
         </DashboardComponent2>
      </>
   );
};

export default SinglePlayList2;
