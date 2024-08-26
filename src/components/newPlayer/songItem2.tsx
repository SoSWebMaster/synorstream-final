import { useState } from "react";
import { SongInterface2 } from "../song/songTypes.ts";
import {
   PlayIcon,
   PauseIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
} from "@heroicons/react/20/solid";
// import {
//    useAppDispatch,
// } from "../../store/music-store.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "../song/SocialShare.tsx";
import SongInfo from "../song/SongInfo.tsx";
import useSound from "use-sound";
import { Link } from "react-router-dom";
export default function SongItem2({
   id,
   name,
   artis_name,
   thumb,
   audio,
   swiperRef,
}: SongInterface2) {
   const [play, { stop }] = useSound(audio);
   const [isActive, setIsActive] = useState(false);
 
   // const dispatch = useAppDispatch();
   // useEffect(() => {
   //    if (currentSongId === id) {
   //       setIsActive(true);
   //    } else if (currentSongId !== id) {
   //       setIsActive(false);
   //    }
   // }, [currentSongId]);

   const handleNext = () => {


      if (swiperRef && swiperRef.current && swiperRef.current?.swiper) {
         swiperRef.current?.swiper?.slideNext();
      }

   };

   const handlePrev = () => {
      if (swiperRef && swiperRef.current && swiperRef.current?.swiper) {
         setIsActive(false);
         swiperRef.current?.swiper.slidePrev();

      }

   };

   return (
      <div className="">
         <div className="grid grid-cols-[175px_auto_1fr_auto]   gap-x-4   md:p-3  !border-none">
            <div className="">
               <img className="w-full " src={thumb} />
            </div>

            <div className="relative items-center text-sm md:text-lg top-5">
               <div className="h-full ">
                  <span className="mb-1 ellipsis md:mb-0">Song Name</span>
                  <span className="mb-1 ellipsis md:mb-0 text-[#CCCCCC] !text-[18px]">
                     {name}
                  </span>
                  <span
                     className="block ellipsis text-white/50"
                     // @ts-ignore
                     dangerouslySetInnerHTML={{ __html: artis_name }}
                  ></span>
                  <div className="flex items-center justify-center h-[90px] ">
                     <div className=" !flex !items-center  !justify-center relative w-[42px] h-[42px] bg-black rounded-full">
                        <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient ">
                           <ChevronLeftIcon
                              className="w-8 h-8 cursor-pointer"
                              onClick={() => {
                                 // dispatch(updateCurrentSongId(id));
                                 stop();
                                 handlePrev();
                              }}
                           />
                        </div>
                     </div>
                     <div className=" !flex !items-center  !justify-center relative w-[60px] h-[60px] bg-black rounded-full mx-8">
                        <div className="!flex !items-center !justify-center h-12 rounded-full w-12 bg-button-gradient ">
                           { !isActive && (
                              <PlayIcon
                                 className="cursor-pointer w-7 h-7"
                                 onClick={() => {

                                    play()
                                    setIsActive(true);
                                 }}
                              />
                           )}
                           {isActive && (
                              <PauseIcon
                                 className="cursor-pointer w-7 h-7"
                                 onClick={() => {
                                    stop();
                                    setIsActive(false);
                                 }}
                              />
                           )}
                        </div>
                     </div>

                     <div className=" !flex !items-center  !justify-center relative w-[42px] h-[42px] bg-black rounded-full">
                        <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient ">
                           <ChevronRightIcon
                              className="w-8 h-8 cursor-pointer"
                              onClick={() => {
                                 // dispatch(updateCurrentSongId(id));
                                 setIsActive(false);
                                 stop();
                                 handleNext();
                              }}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="!flex !flex-col !pr-5  md:text-xl text-white/30 space-y-5">
               <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient ">
                  <SocialShare url={audio} />
               </div>

               <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient ">
                  <SongInfo songId={id} />
               </div>

               <div className="!flex !items-center !justify-center h-8 rounded-full w-8 bg-button-gradient ">
                  <a className="inline-block cursor-pointer" >
                     <Link to='/pricing'> <FontAwesomeIcon icon={faDownload} /></Link>
                
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
