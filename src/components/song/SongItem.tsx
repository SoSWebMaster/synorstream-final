import React, { useRef, useState, useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useAppSelector } from "../../store";
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
import FormatSelectionModal from "./FormatSelectionModal";
import { useAudio } from "../../context/AudioContext";

interface SongItemProps {
   song: any;
}

const SongItem: React.FC<SongItemProps> = ({ song }) => {
   const {
      currentSongId,
      isPlaying,
      currentDuration,
      totalDuration,
      currentSong,
      isLoading,
   } = useAppSelector((state) => state.updatedMusicStore);
   const { playSong, pauseSong } = useAudio();
   const isCurrentSongPlaying = currentSongId === song.id && isPlaying;

   const { download } = useDownloader();
   
   
   
   const hasAltSongs = song.alt_yes_n === 1 ? true : false;
   const axiosInstance = useAxios();
   const location = useLocation();
   const pathname = location.pathname;
   const isSpecialRoute = location.pathname === '/favourites'; 
   const toggleFullLine = () => {
      setIsFullLine(!isFullLine);
   };
   const { single_page } = useAppSelector((state) => state.music);
   const { success } = useAppSelector((state) => state.auth);

   const [toggleSimSongs, setToggleSimSongs] = useState<boolean | null>(null);
   const [isAltAccordionActive, setIsAltAccordionActive] = useState(false);
   const [toggleAltSongs, setToggleAltSongs] = useState<boolean | null>(null);
   const [DBStatus, setDBStatus] = useState("");
   const [userTier, setUserTier] = useState<any>("");
   const [openModal, setOpenModal] = useState(false);
   const [isFullLine, setIsFullLine] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
   const [selectedSongId, setSelectedSongId] = useState(null);

   const handlePlayPause = () => {
      if (currentSong?.id === song.id && isPlaying) {
         pauseSong();
      } else {
         playSong(song);
      }
   };

   const truncateText = (text: any, maxLength: any) => {
      if (text.length > maxLength) {
         return text.substring(0, maxLength) + "...";
      }
      return text;
   };
   

   const fltName = Array.isArray(song?.flt_name)
      ? Array.from(new Set(song?.flt_name)).join(", ")
      : song?.flt_name || "";

   const navigate = useNavigate();

   const pathSegments = pathname.split("/");
   const pageName = pathSegments[1];
   const containerFullClassName = `song-item flex flex-col lg:flex-row p-4 border border-white flex-wrap mr-1 ${
      isSpecialRoute ? 'md:w-[600px] lg:w-[1000px] mr-2' : 'w-full lg:w-auto'
    }`;

   const containerClassName =
      pageName === "playlist" || pageName === "favourites"
         ? "flex gap-10 items-center  "
         : "flex gap-1 items-center max-w-full md:max-w-[450px]";
   const nameContainer =
      pageName === "playlist" || pageName === "favourites"
         ? "flex items-center min-w-[300px] gap-4  "
         : "flex items-center flex-grow gap-4";

   const buttonVisibility =
      pageName === "playlist" || pageName === "favourites"
         ? `flex-shrink-0 p-2 rounded-full bg-primary-blue/40 transition-opacity duration-300 ${hasAltSongs ? "hidden" : "hidden"
         }`
         : `flex-shrink-0 p-2 rounded-full bg-primary-blue/40 transition-opacity duration-300 ${hasAltSongs ? "opacity-100" : "opacity-0"
         }`;

   const cateElRef = useRef<HTMLSpanElement>(null);

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
      console.log("SDdddd",type)
      if (type === "Add To Favorites") {
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
      } else if (type === "Add To Playlist") {
         setOpenModalState();
      }
      setAnchorEl(null);
   };

   const options = ["Add To Favorites", "Add To Playlist"];

   const handleDownloadFile = (url: any, id: any, name: any) => {
      if (success) {
         if (userTier === "2") {
            const fileName = url?.includes(".mp3") ? name + ".mp3" : name;
            toast.info("Downloading MP3...");
            download(url, fileName);
            saveDownloadHistory(id);
         } else if (userTier === "3") {
            setSelectedSongId(id);
            setModalOpen(true);
         }
      } else {
         navigate("/pricing");
      }
   };

   const handleModalConfirm = (format: string) => {
      setModalOpen(false);

      const url = format === "mp3" ? song.audmp : song.audwa;
      const fileName = song.name + `.${format}`;

      if (url) {
         toast.info(`Downloading ${format.toUpperCase()}...`);
         download(url, fileName);
         saveDownloadHistory(selectedSongId);
      } else {
         toast.error(`${format.toUpperCase()} format not available.`);
      }
   };

   const saveDownloadHistory = async (songId: any) => {
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

   const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
         .toString()
         .padStart(2, "0");
      return `${minutes}:${seconds}`;
   };

   return (
<>
{/* w-full lg:w-auto */}
      <div className={containerFullClassName}> 
   <div className="flex flex-col lg:flex-row items-center gap-16 w-full  "> 
      <div className="flex gap-4 w-full  min-w-0"> 
         <img
            src={song.thumb}
            alt={song.name}
            className="w-16 h-16 object-cover rounded-md"
         />
         <div className={nameContainer}>
            <div className="flex items-center justify-center">
               <div onClick={handlePlayPause} className="cursor-pointer">
                  {isLoading && currentSong?.id === song.id ? (
                     <div className="w-4 h-4 border-4 border-t-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : currentSong?.id === song.id && isPlaying ? (
                     <PauseIcon className="w-6 h-6 text-white cursor-pointer" />
                  ) : (
                     <PlayIcon className="w-6 h-6 text-white cursor-pointer" />
                  )}
               </div>
            </div>
            <div className="flex flex-col min-w-0">
               <h3 className="text-xl font-semibold truncate">
                  {song.name}
               </h3>
               <p
                  className="text-white/50 text-md truncate"
                  dangerouslySetInnerHTML={{ __html: song.artis_name }}
               />
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between w-full  min-w-0"> {/* Added `min-w-0` here */}
         <button
            className={buttonVisibility}
            onClick={() => setToggleAltSongs((state) => !state)}
         >
            <ChevronDownIcon
               className={`w-5 h-5 transition-transform duration-300 ${isAltAccordionActive ? "rotate-180" : ""}`}
            />
         </button>

         <div className={containerClassName}>
            <p className="text-white/70 hidden md:flex items-center "> 
               <span className="flex justify-start isSpecialRoute" ref={cateElRef}>
                  {isFullLine ? fltName : truncateText(fltName, 40)}
               </span>
               <FontAwesomeIcon
                  icon={faCirclePlus}
                  className="text-xl cursor-pointer ml-2"
                  onClick={toggleFullLine}
               />
            </p>

            <div className={`ml-3 flex items-center gap-2 ${isCurrentSongPlaying ? 'opacity-100' : 'opacity-0'}`}>
               <span className="text-white/70">{formatTime(currentDuration)}</span>
               <span className="text-white/70">/</span>
               <span className="text-white/70">{formatTime(totalDuration)}</span>
            </div>
         </div>
      </div>

      <div className="flex items-center gap-3 w-full lg:w-auto"> {/* Ensure flex items wrap */}
         <SocialShare url={song.audio} />
         <SongInfo songId={song.id} />

         <button onClick={() => setToggleSimSongs((prev) => !prev)}>
            <FontAwesomeIcon icon={faMusic} className="text-white text-xl" />
         </button>

         {userTier !== "1" && (
            <FontAwesomeIcon
               icon={faDownload}
               onClick={() => handleDownloadFile(song.audmp, song.id, song.name)}
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
                           {option === "Favorites" && DBStatus === "Added" && (
                              <FontAwesomeIcon icon={faCheck} className="mr-1 cursor-pointer" />
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

   {modalOpen && (
      <FormatSelectionModal
         open={modalOpen}
         onClose={() => setModalOpen(false)}
         onConfirm={handleModalConfirm}
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


</>

   );
};

export default SongItem;
