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
   updateAllSongs,
   updateAudioRef,
   updateCurrentSong,
} from "../../../store/updated-music-store";
import { useEffect, useState } from "react";
import { SongInterface } from "../../song/songTypes";
import SongItem from "../../song/SongItem";
import axiosInstance from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import DashboardComponent2 from "..";
import Player from "../../player/Player";

const perPage = 8;

const SinglePlayList2 = () => {
   const { user } = useAppSelector((state) => state.auth);
   const {
      songType,
      filterCategories,
      // search,
      playLists = [],
   } = useAppSelector((state) => state.music);

   const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [fetchingSong, setFetchingSong] = useState(false);
   const axios = axiosInstance();

   const dispatch = useAppDispatch();

   // Fetch songs whenever selectedPlaylist changes
   useEffect(() => {
      if (selectedPlaylist) {
         fetchSongs();
      }
   }, [selectedPlaylist]);

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
            search: '',
            page_name: selectedPlaylist, // Use selectedPlaylist here
         });

         const mappedArray = response?.data?.records.map((record: any) => ({
            id: record.id,
            audio: record.audio,
            thumb: record.thumb,
            name: record.name,
            artis_name: record.artis_name,
            flt_name: record.flt_name,
            audmp: record.audio,
            audio_wav: record.audwa,
         }));
         setSongs(mappedArray);

         dispatch(
            updateAllSongs(
               mappedArray.reduce(
                  (acc: any, song: any) => ({ ...acc, [song.id]: song }),
                  {}
               )
            )
         );
         setFetchingSong(false);
      } catch (e) {
         console.error("Unable to fetch songs!!!", e);
         setFetchingSong(false);
      }
   };

   const handleChange = (event: SelectChangeEvent<string>) => {
      const playlistName = event.target.value;
      setSelectedPlaylist(playlistName);
   };

   let allSongs = {};
   let firstSongId: number | string | null = null;

   const items = songs.map((song, i) => {
      if (i === 0) firstSongId = song.id;
      allSongs = { ...allSongs, [song.id]: song };
      return <SongItem key={song.id} song={song} />;
   });

   useEffect(() => {
      if (songs.length > 0) {
         updateAudioRef(new Audio(songs[0]?.audio));
         dispatch(updateCurrentSong(songs[0]));
      }
   }, [songs]);

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
                              color: "white",
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
                              color: "white",
                           },
                        }}
                        value={selectedPlaylist} // Controlled value
                        onChange={handleChange}
                        label="Playlists"
                     >
                        {playLists.length > 0 &&
                           playLists.map((item, index) => (
                              <MenuItem
                                 key={`${index} + ${item?.id}`} // Ensure uniqueness
                                 value={item?.id} // Set playlist ID or unique identifier
                              >
                                 {item?.name}
                              </MenuItem>
                           ))}
                     </Select>
                  </FormControl>
               </Box>
               {fetchingSong ? (
                  <CircularProgress
                     color="warning"
                     size={40}
                     className="ml-4"
                  />
               ) : songs?.length > 0 ? (
                  items
               ) : (
                  <div>No Songs Found.</div>
               )}
            </div>
            <Player />
         </DashboardComponent2>
      </>
   );
};

export default SinglePlayList2;
