import { useState, useRef, useEffect } from "react";
import { SongInterface2 } from "../song/songTypes.ts";
import {
   PlayIcon,
   PauseIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "../song/SocialShare.tsx";
import SongInfo from "../song/SongInfo.tsx";
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

export default function SongItem2({
   id,
   name,
   artis_name,
   thumb,
   audio,
   swiperRef,
}: SongInterface2) {
   const [isActive, setIsActive] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const audioRef = useRef(new Audio(audio));

   useEffect(() => {
      const handleCanPlay = () => {
         setIsLoading(false);
      };

      const handleError = () => {
         setIsLoading(false);
         console.error("Failed to load audio");
      };

      const currentAudio = audioRef.current;
      currentAudio.addEventListener("canplay", handleCanPlay);
      currentAudio.addEventListener("error", handleError);

      // Clean up event listeners on component unmount
      return () => {
         currentAudio.removeEventListener("canplay", handleCanPlay);
         currentAudio.removeEventListener("error", handleError);
      };
   }, [audio]);

   const handlePlay = () => {
      if (!isActive && !isLoading) {
         audioRef.current.play();
         setIsActive(true);
      }
   };

   const handlePause = () => {
      if (isActive) {
         audioRef.current.pause();
         setIsActive(false);
      }
   };

   const handleNext = () => {
      if (swiperRef && swiperRef.current && swiperRef.current?.swiper) {
         swiperRef.current?.swiper?.slideNext();
      }
   };

   const handlePrev = () => {
      if (swiperRef && swiperRef.current && swiperRef.current?.swiper) {
         setIsActive(false);
         audioRef.current.pause(); // Pause audio when moving to previous
         swiperRef.current?.swiper.slidePrev();
      }
   };

   return (
      <div>
         <div className="grid grid-cols-[175px_auto_1fr_auto] gap-x-4 md:p-3 !border-none">
            <div>
               <img className="w-full" src={thumb} alt={name} />
            </div>

            <div className="relative items-center text-sm md:text-lg top-5">
               <div className="h-full">
                  <span className="mb-1 ellipsis md:mb-0 text-[#CCCCCC] !text-[18px]">
                     {name}
                  </span>
                  <span
                     className="block ellipsis text-white/50"
                     dangerouslySetInnerHTML={{ __html: artis_name }}
                  ></span>
                  <div className="flex items-center justify-center h-[90px]">
                     {isLoading ? (
                        <div className="flex items-center justify-center w-full h-full">
                           <CircularProgress /> {/* MUI spinner */}
                        </div>
                     ) : (
                        <>
                           <div className="!flex !items-center !justify-center relative w-[42px] h-[42px] bg-black rounded-full">
                              <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient">
                                 <ChevronLeftIcon
                                    className="w-8 h-8 cursor-pointer"
                                    onClick={handlePrev}
                                 />
                              </div>
                           </div>
                           <div className="!flex !items-center !justify-center relative w-[60px] h-[60px] bg-black rounded-full mx-8">
                              <div className="!flex !items-center !justify-center h-12 rounded-full w-12 bg-button-gradient">
                                 {!isActive ? (
                                    <PlayIcon
                                       className="cursor-pointer w-7 h-7"
                                       onClick={handlePlay}
                                    />
                                 ) : (
                                    <PauseIcon
                                       className="cursor-pointer w-7 h-7"
                                       onClick={handlePause}
                                    />
                                 )}
                              </div>
                           </div>
                           <div className="!flex !items-center !justify-center relative w-[42px] h-[42px] bg-black rounded-full">
                              <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient">
                                 <ChevronRightIcon
                                    className="w-8 h-8 cursor-pointer"
                                    onClick={handleNext}
                                 />
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div className="!flex !flex-col !pr-5 md:text-xl text-white/30 space-y-5">
               <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient">
                  <SocialShare url={audio} />
               </div>
               <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient">
                  <SongInfo songId={id} />
               </div>
               <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient">
                  <Link to="/pricing">
                     <FontAwesomeIcon icon={faDownload} />
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
