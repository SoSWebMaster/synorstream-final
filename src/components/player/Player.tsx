import { useEffect} from "react";
import {
   nextSong,
   prevSong,
   updateCurrentVolume,
   playSong,
   pauseSong,
} from "../../store/updated-music-store";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faForwardStep,
   faBackwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import {
   updateCurrentDuration,
   updateTotalDuration,
} from "../../store/updated-music-store";

function PlayerContent() {
   const {
      currentSong,
      isPlaying,
      currentVolume,
      currentSongRef,
      currentDuration,
      totalDuration
   } = useAppSelector((state) => state.updatedMusicStore);

   const dispatch = useAppDispatch();

   console.log(currentDuration);
   useEffect(() => {
      if (!currentSongRef) return;
   }, [currentSongRef]);

   const handlePlayPause = () => {
      if (isPlaying) {
         dispatch(pauseSong());
      } else if (currentSong) {
         dispatch(playSong(currentSong));
      }
   };

   const handleNext = () => {
      dispatch(nextSong());
   };

   const handlePrev = () => {
      dispatch(prevSong());
   };

   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const volume = +e.target.value / 100;
      dispatch(updateCurrentVolume(volume));
   };


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

   const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
         .toString()
         .padStart(2, "0");
      return `${minutes}:${seconds}`;
   };

   return (
      <div className="fixed bottom-0 left-0 right-0 z-50 text-white bg-black">
         <div className="flex items-center gap-10 gap-x-2 ">
            <div className="flex flex-1 justify-center items-center gap-10">
               <div className="flex justify-center">
                  <img
                     className="md:w-20 aspect-square"
                     src={currentSong?.thumb}
                  />
               </div>
               <div>
                  <p className="!hidden md:!block">
                     <span className="ellipsis text-[18px]">
                        {currentSong?.name}
                     </span>
                     <span
                        className="block ellipsis text-white/50 text-[14px]"
                        dangerouslySetInnerHTML={{
                           __html: currentSong?.artis_name,
                        }}
                     ></span>
                  </p>
               </div>
               <div>
                
                  <div className="flex justify-center pb-1 text-center">
                     <div className="mr-5">
                        <FontAwesomeIcon
                           icon={faBackwardStep}
                           className="cursor-pointer"
                           onClick={handlePrev}
                        />
                     </div>
                     <div className="mt-[2px] mr-5">
                        {isPlaying ? (
                           <PauseIcon
                              className="w-5 h-5 cursor-pointer"
                              onClick={handlePlayPause}
                           />
                        ) : (
                           <PlayIcon
                              className="w-5 h-5 cursor-pointer"
                              onClick={handlePlayPause}
                           />
                        )}
                     </div>
                     <div>
                        <FontAwesomeIcon
                           icon={faForwardStep}
                           className="cursor-pointer"
                           onClick={handleNext}
                        />
                     </div>
                  </div>
                  <div className="!hidden md:!block">
                     <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue={currentVolume * 100}
                        onChange={handleVolumeChange}
                        className="outline-none"
                     />
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div>
                     <p className="text-center text-white/50 !hidden md:!block">
                        {formatTime(currentDuration)} / 
                        {formatTime(totalDuration)}
                     </p>
                  </div>
               </div>
            </div>
            <div className="flex flex-1 items-start justify-start">
               <div className="!w-[70%]"></div>
            </div>
         </div>
      </div>
   );
}

export default function Player() {
   const playerContainer = document.getElementById("global-music-player");

   if (!playerContainer) return <></>;

   return <>{createPortal(<PlayerContent />, playerContainer)}</>;
}
