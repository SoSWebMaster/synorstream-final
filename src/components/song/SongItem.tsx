// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { SongInterface } from "./songTypes.ts";
import { PlayIcon, PauseIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { updateIsPlaying, updateCurrentSongId, updateCurrentVolume } from "../../store/music-store.ts";
import WaveForm from "../waveform/waveForm.tsx";
import { useAppDispatch, useAppSelector } from "../../store/index.tsx";
import { convertSecondToMinutesAndSecond } from "../../util/util.ts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faMusic, faDownload, faCheck } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "./SocialShare.tsx";
import SongInfo from "./SongInfo.tsx";
import AltSongs from "./AltSongs.tsx";
import SimilarSongs from "./SimilarSongs.tsx";
import useStack from "../../hooks/use-stack.ts";
import WaveSurfer from "wavesurfer.js";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { toast } from "react-toastify";
import useAxios from "../../services/axiosConfig/axiosConfig.ts";
import { endPoints } from "../../services/constants/endPoint.ts";
import PlaylistPopUp from "../dashboad/browse/popUp.tsx";
import useDownloader from "react-use-downloader";
import { useNavigate } from "react-router-dom";

const options = [
   'Favorites',
   'Playlist',
];

export default function SongItem({ id, name, artis_name, flt_name, thumb, audio, alt_yes_n: altSong }: SongInterface) {
   const [openModal, setOpenModal] = useState(false);
   const [isSongLoaded, setIsSongLoaded] = useState(false);
   const [DBStatus, setDBStatus] = useState('');
   const [songDuration, setSongDuration] = useState<null | number>(null);
   const [waveInstance, setWaveInstance] = useState<null | WaveSurfer>(null);
   const [isActive, setIsActive] = useState(false);
   const [toggleAltSongs, setToggleAltSongs] = useState<boolean | null>(null);
   const [toggleSimSongs, setToggleSimSongs] = useState<boolean | null>(null);
   const [isAltAccordionActive, setIsAltAccordionActive] = useState(false);
   const { currentSongId, isPlaying, currentDuration, single_page } = useAppSelector(state => state.music);
   const { success } = useAppSelector(state => state.auth);
   const axiosInstance = useAxios();
   const [songId,setSOngId]=useState<number | null>(null);
   const navigate=useNavigate();
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
       setAnchorEl(event.currentTarget);
   };
   const {
    download,
  } = useDownloader();
   const setOpenModalState = () => {
       setOpenModal(true);
   }
   const setCloseModalState = () => {
       setOpenModal(false);
   }
   const handleClose = async (type: string | number, id: number | string) => {
       if (type === 'Favorites') {
           try {
               const response = await axiosInstance?.post(endPoints?.add_to_fav2, {
                   id: id,
                   type: 'favor',
               });
               if (response?.data?.res) {
                   setDBStatus(response?.data?.message)
                   toast.success(`${response?.data?.message}`);
               }
               setAnchorEl(null);
           } catch (e) {
               toast.error('Something went wrong');
           }
       }
       else if (type === 'Playlist') {
           setOpenModalState();
       }
       setAnchorEl(null);
   };
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement>(null);
   const hasAltSongs = altSong === 1 ? true : false;
   const [isCurrentStackLoaded, nextStackFnRef] = useStack();

   const afterSongLoaded = () => {
       setIsSongLoaded(true);

       if (typeof nextStackFnRef.current === "function") {
           nextStackFnRef.current();
       }
   };

   useEffect(() => {
       if (currentSongId === id) {
           setIsActive(true);
       } else if (currentSongId !== id) {
           setIsActive(false);
       }
   }, [currentSongId], afterSongLoaded);
   const downloadFIle = (url:any, id:any ) => {
    if(success){
       setSOngId(id);
       const fileName=url?.split('/')?.pop();
       if (!fileName) {
           toast.error('File could not be determined.');
           console.error('File name could not be determined.');
           return;
       }
       download(url, name)
       toast.info('Downloading Started...');

       saveDownloadHistory(id)
    }
    else{
       navigate('/pricing')
    }
 
  };
  const saveDownloadHistory=async(songId:number)=>{
    try{
       const response =await axiosInstance.post(endPoints?.download, {id:songId})
       if(response?.data?.result){
        //   toast.success(`${response?.data?.message}`);
       }
    }catch(error){
       console.log(error);
       toast.error(`Something Went wrong`);
    }

  }







   return (
       <div>
           <div className="grid grid-cols-[40px_auto_1fr_auto] md:grid-cols-[55px_auto_1fr_1fr_120px_1fr_auto] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border border-white">
               <img className="w-full aspect-square" src={thumb} />
               <div>
                   {(!isPlaying || !isActive) && isSongLoaded &&
                       <PlayIcon className="w-5 h-5 cursor-pointer"
                           onClick={() => {
                               if (!isSongLoaded) return

                               if (waveInstance) waveInstance.play()
                               waveInstance?.setVolume(1);
                               dispatch(updateCurrentVolume(1))
                               dispatch(updateIsPlaying(true));
                               dispatch(updateCurrentSongId(id));
                           }}
                       />
                   }
                   {(isActive && isPlaying) &&
                       <PauseIcon className="w-5 h-5 cursor-pointer"
                           onClick={() => {
                               if (waveInstance) waveInstance.pause()
                               dispatch(updateIsPlaying(false))
                           }}
                       />
                   }
                   {!isSongLoaded && <div className="w-4 song-loading-spinner" />}
               </div>
               <div className="flex items-start text-sm md:text-lg">
                   <div className="flex-grow">
                       <span className="mb-1 ellipsis md:mb-0">{name}</span>
                       <span className="block ellipsis text-white/50" dangerouslySetInnerHTML={{ __html: artis_name }}></span>
                   </div>
                   {hasAltSongs &&
                       <button
                           className="flex-shrink-0 p-2 rounded-full bg-primary-blue/40"
                           onClick={() => setToggleAltSongs(state => !state)}
                       >
                           <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300${isAltAccordionActive ? ' rotate-180' : ''}`} />
                       </button>
                   }
               </div>
               <p className={`text-white/70 !hidden md:!flex items-start `}>
                   <span
                       className={`mr-2 grow ellipsis ellipsis-2 flex justify-start `}
                       ref={cateElRef}
                   >
                       {Array.isArray(flt_name) ? Array.from(new Set(flt_name)).join(", ") : <span className="">{flt_name}</span>}                   </span>
                   <FontAwesomeIcon
                       icon={faCirclePlus}
                       className="w-8 text-xl cursor-pointer shrink-0"
                       onClick={() => {
                           if (!cateElRef.current) return
                           cateElRef.current.classList.toggle("full-line");
                       }}
                   />
               </p>
               <p className="text-center text-white/50 !hidden md:!block">
                   {(!isActive && songDuration) && '00:00'}
                   {(currentDuration && isActive) && convertSecondToMinutesAndSecond(currentDuration)}
                   {(songDuration) && ' / '}
                   {songDuration && convertSecondToMinutesAndSecond(songDuration)}
               </p>
               {isCurrentStackLoaded &&
                   <WaveForm
                       className="!hidden md:!block"
                       songId={id}
                       audioUrl={audio}
                       play={isPlaying}
                       isActive={isActive}
                       setDuration={setSongDuration}
                       afterSongLoaded={() => afterSongLoaded()}
                       getInstance={setWaveInstance}
                       updateCurrentSongOnActive={{
                           id,
                           name,
                           artis_name,
                           thumb,
                           audio
                       }}
                   />
               }
               <div className="grid grid-cols-2 gap-3 text-base text-right text-white md:block md:text-xl md:space-x-4 ">
                   <SocialShare url={audio} />
                   <SongInfo songId={id} />
                   <button
                       onClick={() => setToggleSimSongs(state => !state)}
                   >
                       <FontAwesomeIcon
                           className="cursor-pointer"
                           icon={faMusic}
                       />
                   </button>
                   <div className="inline-block cursor-pointer">
                  <FontAwesomeIcon
                     icon={faDownload}
                     onClick={()=>downloadFIle(audio,id)}
                  />
                  </div>
                  
                   {success && single_page !== 'favorites' && (
                       <>
                           <IconButton
                               aria-label="more"
                               id="long-button"
                               aria-controls={open ? 'long-menu' : undefined}
                               aria-expanded={open ? 'true' : undefined}
                               aria-haspopup="true"
                               onClick={handleClick}
                               className="!text-white"
                           >
                               <MoreVertIcon />
                           </IconButton>
                           <Menu
                               id="long-menu"
                               MenuListProps={{
                                   'aria-labelledby': 'long-button',
                               }}
                               anchorEl={anchorEl}
                               open={open}
                               onClose={handleClose}
                           >
                               {options.map((option) => (
                                   <MenuItem key={option} onClick={() => handleClose(option, id)} className="!text-[12px]">
                                       <span className="!w-[10px] mr-1">{option === 'Favorites' ? DBStatus === 'Added' && <FontAwesomeIcon
                                           icon={faCheck}
                                           className="mr-1 cursor-pointer"
                                           onClick={() => {
                                               if (!cateElRef.current) return
                                               cateElRef.current.classList.toggle("full-line");
                                           }}
                                       /> : ''}</span> {option}
                                   </MenuItem>
                               ))}
                           </Menu>
                       </>
                   )}
               </div>
           </div>
           {hasAltSongs &&
               <AltSongs
                   id={id}
                   artis_name={artis_name}
                   thumb={thumb}
                   toggle={toggleAltSongs}
                   isAccordionActive={setIsAltAccordionActive}
               />
           }
           <SimilarSongs id={id} name={name} toggle={toggleSimSongs} />

           {openModal && (
               <PlaylistPopUp open={openModal} setOpenModalState={setOpenModalState} setCloseModalState={setCloseModalState} songId={id} />
           )}
       </div>
   )
}
