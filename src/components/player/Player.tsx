import { useEffect, useState } from "react";
import {
   updateIsPlaying,
   updateCurrentSongId,
   updateCurrentSong,
   nextSong,
   prevSong,
   updateCurrentVolume,
} from "../../store/music-store";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "../../store";
import WaveForm from "../waveform/waveForm";
import { convertSecondToMinutesAndSecond } from "../../util/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faForwardStep,
   faBackwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import WaveSurfer from "wavesurfer.js";

function PlayerContent() {
   const {
      firstSongId,
      currentSongId,
      currentSong,
      allSongs,
      isPlaying,
      currentDuration,
      currentVolume,
      isLoading,
      currentSongRef
   } = useAppSelector((state) => state.music);
   const [isSongLoaded, setIsSongLoaded] = useState(false);
   const [waveInstance, setWaveInstance] = useState<null | WaveSurfer>(null);
   const [songDuration, setSongDuration] = useState<null | number>(null);
   const dispatch = useAppDispatch();
   useEffect(() => {
      if (!firstSongId || currentSongId) return;

      const firstSong = allSongs[firstSongId];

      if (!firstSong) return;

      dispatch(updateCurrentSong(firstSong));
   }, [currentSongId, firstSongId, currentVolume]);
   // @ts-ignore
   function rangeInputHandler(e: React.FormEvent<HTMLInputElement>) {
      // let timeout: number;

      // @ts-ignore
      return (e) => {
         const value = +e.currentTarget.value / 100;

         // clearTimeout(timeout);
         dispatch(updateCurrentVolume(value));
         // timeout = setTimeout(() => {
         //    dispatch(updateCurrentVolume(value));
         // }, 100);
      };
   }

   console.log('currentSong ref in player',currentSongRef)

   if (!currentSong) return <></>;6

   return (
      <div className="fixed bottom-0 left-0 right-0 z-50 text-white bg-black">
         <div className="flex items-center gap-10 p-3 py-4 gap-x-2 2xl:px-20 md:px-10 ">
            <div className="flex  flex-1  justify-center items-center gap-10">
               <div className=" flex justify-center  ">
                  <img
                     className=" md:w-20 aspect-square"
                     src={currentSong.thumb}
                  />
               </div>
               <div className="">
                  <p className="!hidden md:!block">
                     <span className="ellipsis text-[18px]">
                        {currentSong.name}
                     </span>
                     <span
                        className="block ellipsis text-white/50 text-[14px]"
                        dangerouslySetInnerHTML={{
                           __html: currentSong.artis_name,
                        }}
                     ></span>
                  </p>
               </div>

               <div className="  ">
                  <div className="flex justify-center pb-1 text-center">
                     <div className="mr-5">
                        <FontAwesomeIcon
                           icon={faBackwardStep}
                           className="cursor-pointer"
                           onClick={() => {
                              dispatch(prevSong());
                              // dispatch (updateCurrentVolume(1))
                           }}
                        />
                     </div>
                     <div className="mt-[2px] mr-5">
                        {!isPlaying && (
                           <PlayIcon
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => {
                                 if (!isSongLoaded) return;

                                 if (!currentSongId)
                                    dispatch(
                                       updateCurrentSongId(currentSong.id)
                                    );

                                 if (waveInstance) waveInstance.play();
                                 currentSongRef?.play()

                                 dispatch(updateIsPlaying(true));
                              }}
                           />
                        )}
                        {isPlaying && (
                           <PauseIcon
                              className="w-5 h-5 cursor-pointer"
                              onClick={() => {
                                 if (waveInstance) waveInstance.pause();
                                 currentSongRef?.pause()
                                 dispatch(updateIsPlaying(false));
                              }}
                           />
                        )}
                     </div>
                     <div>
                        <FontAwesomeIcon
                           icon={faForwardStep}
                           className="cursor-pointer"
                           onClick={() => {
                              dispatch(nextSong());
                              // dispatch (updateCurrentVolume(1))
                           }}
                        />
                     </div>
                  </div>
                  <div className="!hidden md:!block">
                     <input
                        // @ts-ignore
                        onChange={rangeInputHandler()}
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="100"
                        className="outline-none "
                     />
                  </div>
               </div>
               <div className="  ">
                  <p className="text-center text-white/50 !hidden md:!block">
                     {/* { console.log(currentDuration)} */}
                     {currentDuration &&
                        convertSecondToMinutesAndSecond(currentDuration)}
                     {!currentDuration && "00:00"}
                     {songDuration && " / "}
                     {songDuration &&
                        convertSecondToMinutesAndSecond(songDuration)}
                  </p>
               </div>
            </div>
            <div className="flex flex-1 items-start justify-start ">
               <div className=" !w-[70%]  ">
                  <WaveForm
                     songId={currentSong.id}
                     audioUrl={currentSong.audio}
                     play={isPlaying}
                     isActive={true}
                     setDuration={setSongDuration}
                     afterSongLoaded={() => setIsSongLoaded(true)}
                     getInstance={setWaveInstance}
                     mute={true}
                     updateTime={false}
                     nextSongOnFinish={false}
                  />
               </div>
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
