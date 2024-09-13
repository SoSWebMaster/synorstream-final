import React, { useState, useRef, useEffect } from "react";
import {
   PlayIcon,
   PauseIcon,
   ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "../../store/index.tsx";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useDownloader from "react-use-downloader";
import useAxios from "../../services/axiosConfig/axiosConfig.ts";
import SocialShare from "./SocialShare.tsx";
import SongInfo from "./SongInfo.tsx";
import { endPoints } from "../../services/constants/endPoint.ts";
import { toast } from "react-toastify";
import {
   faCirclePlus,
   faMusic,
   faDownload,
   faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
   // updateAllSongs,
   // updateFirstSongId,
   updateCurrentSongId,
   updateIsPlaying,
   updateCurrentDuration,
   updateCurrentSong,
   updateIsLoading,
} from "../../store/music-store.ts";
import AltSongs from "./AltSongs.tsx";
import SimilarSongs from "./SimilarSongs.tsx";
import PlaylistPopUp from "../dashboad/browse/popUp.tsx";
import { useLocation } from "react-router-dom";
// @ts-ignore
import { throttle } from "lodash";

const formatTime = (time: number) => {
   const minutes = Math.floor(time / 60);
   const seconds = Math.floor(time % 60);
   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const SongItem: React.FC<{
   song: any;
   isPlaying: boolean;
   onPlay: (audio: any) => void;
   onPause: () => void;
}> = ({ song, isPlaying, onPlay, onPause }) => {
   const [isLoading, setIsLoading] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const [openModal, setOpenModal] = useState(false);
   const [DBStatus, setDBStatus] = useState("");
   const cateElRef = useRef<HTMLSpanElement>(null);
   const audioRef = useRef<HTMLAudioElement | null>(null);
   // const descriptionRef = useRef<HTMLSpanElement>(null);
   const { single_page } = useAppSelector(
      (state) => state.music
   );
   const { success } = useAppSelector((state) => state.auth);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   // const [songId, setSOngId] = useState<number | null>(null);
   const open = Boolean(anchorEl);
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const navigate = useNavigate();
   const { download } = useDownloader();
   const [toggleSimSongs, setToggleSimSongs] = useState<boolean | null>(null);
   const [isAltAccordionActive, setIsAltAccordionActive] = useState(false);
   const [toggleAltSongs, setToggleAltSongs] = useState<boolean | null>(null);
   const [hasPlayed30Seconds, setHasPlayed30Seconds] = useState(false);
   const dispatch = useAppDispatch();

   const setOpenModalState = () => {
      setOpenModal(true);
   };
   const setCloseModalState = () => {
      setOpenModal(false);
   };

   const {
      id,
      audio,
      thumb,
      name,
      artis_name,
      flt_name,
      alt_yes_n: altSong,
   } = song;

   const hasAltSongs = altSong === 1 ? true : false;
   const axiosInstance = useAxios();
   const location = useLocation();
   const pathname = location.pathname;

   // Split pathname and extract segment
   const pathSegments = pathname.split("/"); // Splits at '/'
   const pageName = pathSegments[1]; 

   const containerClassName = pageName === 'playlist' || pageName === 'favourites'
    ? 'flex items-center justify-between ml-4' // No max-width applied
    : 'flex items-center max-w-[350px] justify-between ml-4'; // Max-width applied

   useEffect(() => {
      const updateTime = throttle(() => {
         if (audioRef.current) {
            const time = Math.floor(audioRef.current.currentTime);
            setCurrentTime(time);
            dispatch(updateCurrentDuration(time));
            console.log("time", time);
            const targetTime = 30;
            if (time === targetTime && !hasPlayed30Seconds) {
               setHasPlayed30Seconds(true);
               addToHistory();
            }
         }
      }, 1000);

      const handleLoadedMetadata = () => {
         if (audioRef.current) {
            const newDuration = audioRef.current.duration;
            setDuration(newDuration);
         }
      };

      if (isPlaying) {
         if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = audio; // Update the src
            audioRef.current.currentTime = 0;
         } else {
            audioRef.current = new Audio(audio);
         }

        //  const currentAudio = audioRef.current;
         dispatch(updateCurrentSong(song)); // Update the Redux state with the current song
         dispatch(updateCurrentSongId(song.id)); // Update the current song ID
         dispatch(updateIsPlaying(true));
         dispatch(updateIsLoading(true));
         setIsLoading(true);


         audioRef.current.oncanplaythrough = () => {
            setIsLoading(false);
            dispatch(updateIsLoading(false));
            audioRef.current && audioRef.current.play().then(() => {
               onPlay(audioRef.current);
            });
         };

         audioRef.current.onerror = () => {
            setIsLoading(false);
            dispatch(updateIsLoading(false));
         };

         audioRef.current.ontimeupdate = updateTime;
         audioRef.current.onloadedmetadata = handleLoadedMetadata;
      } else {
         if (audioRef.current) {
            dispatch(updateIsPlaying(false));
            audioRef.current.ontimeupdate = null;
            setCurrentTime(0);
            onPause();
         }
      }

      return () => {
         if (audioRef.current) {
            audioRef.current.pause();
            // audioRef.current.src = ""; // Clean up src
            audioRef.current.ontimeupdate = null;
            audioRef.current.onloadedmetadata = null;
         }
      };
   }, [isPlaying]);

   console.log("Has Played ", hasPlayed30Seconds);

//    useEffect(() => {
//       if (currentSongId === id) {
//          // Play the song if the currentSongId matches this song's id
//          if (audioRef.current) {
//             audioRef.current.play().then(() => onPlay(audioRef.current));
//          } else {
//             audioRef.current = new Audio(audio);
//             const currentAudio = audioRef.current;
//             currentAudio.play().then(() => onPlay(currentAudio));
//          }
//          dispatch(updateIsPlaying(true));
//       } else {
//          // Pause the song if the currentSongId does not match this song's id
//          if (audioRef.current) {
//             audioRef.current.pause();
//             dispatch(updateIsPlaying(false));
//             onPause();
//          }
//       }
//    }, [currentSongId]);

   const options = ["Favorites", "Playlist"];

   const handleClose = async (type: string | number, id: number | string) => {
      if (type === "Favorites") {
         try {
            const response = await axiosInstance?.post(endPoints?.add_to_fav2, {
               id: id,
               type: "favor",
            });
            if (response?.data?.res) {
               setDBStatus(response?.data?.message);
               toast.success(`${response?.data?.message}`);
            }
            setAnchorEl(null);
         } catch (e) {
            toast.error("Something went wrong");
         }
      } else if (type === "Playlist") {
         setOpenModalState();
      }
      setAnchorEl(null);
   };

   const downloadFIle = (url: any, id: any, name: any) => {
      if (success) {
         // setSOngId(id);
         const fileName = url?.split("/")?.pop();
         if (!fileName) {
            toast.error("File could not be determined.");
            console.error("File name could not be determined.");
            return;
         }
         if (url?.includes(".mp3")) {
            name = name + ".mp3";
         } else if (url?.includes(".wav")) {
            name = name + ".wav";
         }
         download(url, name);
         toast.info("Downloading Started...");

         saveDownloadHistory(id);
      } else {
         navigate("/pricing");
      }
   };
   const saveDownloadHistory = async (songId: number) => {
      try {
         const response = await axiosInstance.post(endPoints?.download, {
            id: songId,
         });
         if (response?.data?.result) {
            //   toast.success(`${response?.data?.message}`);
         }
      } catch (error) {
         console.log(error);
         toast.error(`Something Went wrong`);
      }
   };

   const addToHistory = async () => {
      try {
         await axiosInstance.post("/add_to_history", { songid: id });
         console.log("API call successful");
      } catch (error) {
         console.error("Error during API call", error);
      }
   };

   return (
      <div className="border-2 border-white p-4 rounded-md">
         <div className="flex items-center gap-6">
            <img
               className="w-16 h-16 object-cover rounded-md"
               src={thumb}
               alt={name}
               loading="lazy"
            />

            <div className="flex items-center w-[50px]  justify-center p-2 gap-4 ">
               {isLoading ? (
                  <div className="w-4 h-4 border-4 border-t-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
               ) : isPlaying ? (
                  <PauseIcon
                     className="w-6 h-6 text-white cursor-pointer"
                     onClick={() => onPause()}
                  />
               ) : (
                  <PlayIcon
                     className="w-6 h-6 text-white cursor-pointer"
                     onClick={() => onPlay(audioRef.current)}
                  />
               )}
            </div>

            <div className="flex flex-col flex-grow w-full max-w-[350px]">
               <h3 className="text-xl text-white truncate">{name}</h3>
               <span
                  className="text-white/50 text-sm truncate"
                  dangerouslySetInnerHTML={{ __html: artis_name }}
               />
            </div>
            {/* {hasAltSongs && ( */}
            <button
               className={`flex-shrink-0 p-2 rounded-full bg-primary-blue/40 transition-opacity duration-300 ${
                  hasAltSongs ? "opacity-100" : "opacity-0"
               }`}
               onClick={() => setToggleAltSongs((state) => !state)}
            >
               <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-300${
                     isAltAccordionActive ? " rotate-180" : ""
                  }`}
               />
            </button>
            {/* )} */}
            <div className={containerClassName}>
               <p className={`text-white/70 !hidden md:!flex items-center`}>
                  <span
                     className={`mr-2 grow ellipsis ellipsis-2 flex justify-start`}
                     ref={cateElRef}
                  >
                     {Array.isArray(flt_name) ? (
                        Array.from(new Set(flt_name)).join(", ")
                     ) : (
                        <span>{flt_name}</span>
                     )}
                  </span>
                  <FontAwesomeIcon
                     icon={faCirclePlus}
                     className=" text-xl cursor-pointer "
                     onClick={() => {
                        if (!cateElRef.current) return;
                        cateElRef.current.classList.toggle("full-line");
                     }}
                  />
               </p>
               <div className="ml-3 flex items-center gap-2">
                  <span className="text-white/70">
                     {formatTime(currentTime)}
                  </span>
                  <span className="text-white/70">/</span>
                  <span className="text-white/70">{formatTime(duration)}</span>
               </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
               <SocialShare url={audio} />
               <SongInfo songId={id} />
               <button onClick={() => setToggleSimSongs((prev) => !prev)}>
                  <FontAwesomeIcon
                     icon={faMusic}
                     className="text-white text-xl"
                  />
               </button>
               <FontAwesomeIcon
                  icon={faDownload}
                  onClick={() => downloadFIle(audio, id, name)} // Assuming downloadFIle is defined
                  className="text-white text-xl cursor-pointer"
               />
               {success && single_page !== "favourites" && (
                  <>
                     <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        // className="text-white"
                     >
                        <MoreVertIcon className="text-white" />
                     </IconButton>
                     <Menu
                        id="long-menu"
                        MenuListProps={{
                           "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                     >
                        {options.map((option) => (
                           <MenuItem
                              key={option}
                              onClick={() => handleClose(option, id)}
                              className="text-xs"
                           >
                              <span className="mr-1">
                                 {option === "Favorites" &&
                                    DBStatus === "Added" && (
                                       <FontAwesomeIcon
                                          icon={faCheck}
                                          className="mr-1 cursor-pointer"
                                       />
                                    )}
                              </span>
                              {option}
                           </MenuItem>
                        ))}
                     </Menu>
                  </>
               )}
            </div>
         </div>
         {hasAltSongs && (
            <AltSongs
               id={id}
               artis_name={artis_name}
               thumb={thumb}
               toggle={toggleAltSongs}
               isAccordionActive={setIsAltAccordionActive}
            />
         )}
         <SimilarSongs
            id={id}
            artis_name={artis_name}
            thumb={thumb}
            toggle={toggleSimSongs}
            isAccordionActive={setIsAltAccordionActive}
            name={name}
         />

         {openModal && (
            <PlaylistPopUp
               open={openModal}
               setOpenModalState={setOpenModalState}
               setCloseModalState={setCloseModalState}
               songId={id}
            />
         )}
      </div>
   );
};

export default SongItem;
