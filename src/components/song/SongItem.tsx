import React, { useCallback, useRef, useState, useEffect } from "react";
import {
   playSong,
   pauseSong,
   updateTotalDuration,
   updateCurrentDuration,
} from "../../store/updated-music-store";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faCirclePlus,
   faMusic,
   faCheck,
   faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import useAxios from "../../services/axiosConfig/axiosConfig";
import SocialShare from "./SocialShare";
import { endPoints } from "../../services/constants/endPoint";
import { IconButton } from "@mui/material";
import useDownloader from "react-use-downloader";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SongInfo from "./SongInfo";
import SimilarSongs from "./SimilarSongs";
import AltSongs from "./AltSongs";
import PlaylistPopUp from "../dashboad/browse/popUp";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface SongItemProps {
   song: any;
}

const SongItem: React.FC<SongItemProps> = ({ song }) => {
   const {
      currentSongId,
      isPlaying,
      currentSongRef,
      currentDuration,
      totalDuration,
   } = useAppSelector((state) => state.updatedMusicStore);
   const dispatch = useAppDispatch();
   const isCurrentSongPlaying = currentSongId === song.id && isPlaying;

   const handlePlay = useCallback(() => {
      dispatch(playSong(song)); // Centralized play logic
   }, [dispatch, song]);

   const handlePause = useCallback(() => {
      dispatch(pauseSong());
   }, [dispatch]);
   const { download } = useDownloader();

   const hasAltSongs = song.alt_yes_n === 1 ? true : false;
   const axiosInstance = useAxios();
   const location = useLocation();
   const pathname = location.pathname;

   const { single_page } = useAppSelector((state) => state.music);
   const { success } = useAppSelector((state) => state.auth);

   const [toggleSimSongs, setToggleSimSongs] = useState<boolean | null>(null);
   const [isAltAccordionActive, setIsAltAccordionActive] = useState(false);
   const [toggleAltSongs, setToggleAltSongs] = useState<boolean | null>(null);
   const [DBStatus, setDBStatus] = useState("");
   const [userTier, setUserTier] = useState<any>("");
   const [openModal, setOpenModal] = useState(false);
   const navigate = useNavigate();

   // Split pathname and extract segment
   const pathSegments = pathname.split("/"); // Splits at '/'
   const pageName = pathSegments[1];

   const containerClassName =
      pageName === "playlist" || pageName === "favourites"
         ? "flex items-center justify-between ml-4" // No max-width applied
         : "flex items-center max-w-[350px] justify-between ml-4"; // Max-width applied

   const cateElRef = useRef<HTMLSpanElement>(null);

   useEffect(() => {
      if (currentSongRef) {
         // Update total duration when metadata is loaded
         currentSongRef.addEventListener("loadedmetadata", () => {
            dispatch(updateTotalDuration(currentSongRef.duration));
         });

         // Update current time as the song progresses
         currentSongRef.addEventListener("timeupdate", () => {
            dispatch(updateCurrentDuration(currentSongRef.currentTime));
         });

         return () => {
            // Cleanup event listeners on unmount
            currentSongRef.removeEventListener("loadedmetadata", () => {});
            currentSongRef.removeEventListener("timeupdate", () => {});
         };
      }
   }, [currentSongRef, dispatch]);

   useEffect(() => {
      let tier = localStorage.getItem("currentPlan");
      setUserTier(tier);
   }, []);

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

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

   const options = ["Favorites", "Playlist"];

   const downloadFIle = (url: any, id: any, name: any) => {
      if (success) {
         // setSOngId(id);
         console.log(url)
         console.log("in true");
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
         console.log("in false");
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

   const setOpenModalState = () => {
      setOpenModal(true);
   };
   const setCloseModalState = () => {
      setOpenModal(false);
   };

   console.log(currentDuration);

   const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
         .toString()
         .padStart(2, "0");
      return `${minutes}:${seconds}`;
   };

   return (
      <div className="song-item flex flex-col  gap-6 p-4 border-2 border-white">
         <div className="flex items-center gap-6">
            <img
               src={song.thumb}
               alt={song.name}
               className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex items-center flex-grow gap-4 ">
               <div className="flex items-center justify-center">
                  {isCurrentSongPlaying ? (
                     <PauseIcon
                        className="w-6 h-6 text-white cursor-pointer"
                        onClick={handlePause}
                     />
                  ) : (
                     <PlayIcon
                        className="w-6 h-6 text-white cursor-pointer"
                        onClick={handlePlay}
                     />
                  )}
               </div>
               <div className="flex flex-col">
                  <h3 className="text-xl font-semibold truncate">
                     {song.name}
                  </h3>
                  <p
                     className="text-white/50 text-md truncate"
                     dangerouslySetInnerHTML={{ __html: song.artis_name }}
                  />
               </div>
            </div>
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
            <div className={containerClassName}>
               <p className={`text-white/70 !hidden md:!flex items-center`}>
                  <span
                     className={`mr-2 grow ellipsis ellipsis-2 flex justify-start`}
                     ref={cateElRef}
                  >
                     {Array.isArray(song?.flt_name) ? (
                        Array.from(new Set(song?.flt_name)).join(", ")
                     ) : (
                        <span>{song?.flt_name}</span>
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
               {isCurrentSongPlaying && (
                  <div className="ml-3 flex items-center gap-2">
                     <span className="text-white/70">
                        {formatTime(currentDuration)}
                     </span>
                     <span className="text-white/70">/</span>
                     <span className="text-white/70">
                        {formatTime(totalDuration)}
                     </span>
                  </div>
               )}
            </div>
            <div className="flex items-center gap-3 ml-4">
               <SocialShare url={song.audio} />
               <SongInfo songId={song.id} />
               {/* {userTier !== "1" && ( */}{" "}
               <button onClick={() => setToggleSimSongs((prev) => !prev)}>
                  {" "}
                  <FontAwesomeIcon
                     icon={faMusic}
                     className="text-white text-xl"
                  />
               </button>
               {/* // )} */}
               {userTier !== "1" && (
                  <FontAwesomeIcon
                     icon={faDownload}
                     onClick={() =>
                        downloadFIle(song.audmp, song.id, song.name)
                     } // Assuming downloadFIle is defined
                     className="text-white text-xl cursor-pointer"
                  />
               )}
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
                              onClick={() => handleClose(option, song.id)}
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
            </div>{" "}
         </div>

         {hasAltSongs && (
            <AltSongs
               id={song.id}
               artis_name={song.artis_name}
               thumb={song.thumb}
               toggle={toggleAltSongs}
               isAccordionActive={setIsAltAccordionActive}
            />
         )}
         {toggleSimSongs && (
            <SimilarSongs
               id={song.id}
               artis_name={song.artis_name}
               thumb={song.thumb}
               toggle={toggleSimSongs}
               isAccordionActive={setIsAltAccordionActive}
               name={song.name}
            />
         )}

         {openModal && (
            <PlaylistPopUp
               open={openModal}
               setOpenModalState={setOpenModalState}
               setCloseModalState={setCloseModalState}
               songId={song.id}
            />
         )}
      </div>
   );
};

export default SongItem;
