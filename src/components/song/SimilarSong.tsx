import React, { useState, useRef, useEffect, useCallback } from "react";
import { SongInterface } from "./songTypes.ts";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { updateIsPlaying, updateCurrentSongId } from "../../store/music-store.ts";
import { useAppDispatch, useAppSelector } from "../../store/index.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "./SocialShare.tsx";
import SongInfo from "./SongInfo.tsx";
import { convertSecondToMinutesAndSecond } from "../../util/util.ts";
import WaveSurfer from "wavesurfer.js";
// @ts-ignore
import download from "downloadjs/download.min.js";

// In-memory cache for audio data
const audioCache: Map<string, string> = new Map();

interface SimilarSongProps extends SongInterface {
   nextSongFn: CallableFunction;
}

const SimilarSong: React.FC<SimilarSongProps> = ({ id, name, artis_name, flt_name, thumb, audio, nextSongFn }) => {
   const [isSongLoaded, setIsSongLoaded] = useState(false);
   const [waveInstance, setWaveInstance] = useState<WaveSurfer | null>(null);
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const { currentSongId, isPlaying, currentDuration } = useAppSelector(state => state.music);
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement | null>(null);
   const isActive = id === currentSongId;

   // Function to fetch and cache audio data
   const fetchAndCacheAudio = useCallback(async () => {
      if (audioCache.has(audio)) {
         return audioCache.get(audio);
      }

      const response = await fetch(audio);
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audioCache.set(audio, audioUrl);
      return audioUrl;
   }, [audio]);

   useEffect(() => {
      const loadAudio = async () => {
         const audioUrl = await fetchAndCacheAudio();

         // Create and configure WaveSurfer instance
         const wavesurfer = WaveSurfer.create({
            container: `#waveform-${id}`,
            url: audioUrl,
            height: 40,
            progressColor: "rgb(8, 22, 191)",
            waveColor: "rgba(255, 255, 255, 1)",
            fillParent: true,
         });

         setWaveInstance(wavesurfer);

         wavesurfer.on("ready", () => {
            setSongDuration(wavesurfer.getDuration());
            setIsSongLoaded(true);
         });

         return () => {
            wavesurfer.destroy();
         };
      };

      loadAudio();
   }, [fetchAndCacheAudio, audio, id]);

   useEffect(() => {
      if (waveInstance) {
         if (isActive && isPlaying) {
            waveInstance.play();
         } else {
            waveInstance.pause();
         }
      }
   }, [isActive, isPlaying, waveInstance]);

   return (
      <div>
         <div className="grid grid-cols-[40px_auto_1fr_auto] md:grid-cols-[55px_auto_1fr_1fr_120px_1fr_auto] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
            <img className="w-full aspect-square" src={thumb} alt="Thumbnail" />
            <div>
               {(!isPlaying || !isActive) && isSongLoaded && (
                  <PlayIcon
                     className="w-5 h-5 cursor-pointer"
                     onClick={() => {
                        if (waveInstance) waveInstance.play();
                        dispatch(updateCurrentSongId(id));
                        dispatch(updateIsPlaying(true));
                     }}
                  />
               )}
               {isActive && isPlaying && (
                  <PauseIcon
                     className="w-5 h-5 cursor-pointer"
                     onClick={() => {
                        if (waveInstance) waveInstance.pause();
                        dispatch(updateIsPlaying(false));
                     }}
                  />
               )}
               {!isSongLoaded && <div className="w-5 song-loading-spinner" />}
            </div>
            <div className="flex items-start text-sm md:text-lg">
               <div className="flex-grow">
                  <span className="mb-1 ellipsis md:mb-0">{name}</span>
                  <span className="block ellipsis text-white/50" dangerouslySetInnerHTML={{ __html: artis_name }}></span>
               </div>
            </div>
            <p className="text-white/70 !hidden md:!flex items-start">
               <span
                  className="mr-2 grow ellipsis ellipsis-2"
                  ref={cateElRef}
               >
                  {Array.isArray(flt_name) && flt_name.join(", ")}
               </span>
               <FontAwesomeIcon
                  icon={faCirclePlus}
                  className="w-8 text-xl cursor-pointer shrink-0"
                  onClick={() => {
                     if (cateElRef.current) {
                        cateElRef.current.classList.toggle("full-line");
                     }
                  }}
               />
            </p>
            <p className="text-center text-white/50 !hidden md:!block">
               {!isActive && songDuration && '00:00'}
               {currentDuration && isActive && convertSecondToMinutesAndSecond(currentDuration)}
               {songDuration && ' / '}
               {songDuration && convertSecondToMinutesAndSecond(songDuration)}
            </p>
            <div
               id={`waveform-${id}`}
               className="waveform-container !hidden md:!block"
            />
            <div className="grid grid-cols-2 gap-3 text-base text-right md:block md:text-xl text-white/50 md:space-x-4">
               <FontAwesomeIcon
                  icon={faDownload}
                  className="opacity-0 !hidden md:!inline-block"
               />
               <SocialShare url={audio} />
               <SongInfo songId={id} />
               <button
                  className="inline-block"
                  onClick={() => download(audio, name)}
               >
                  <FontAwesomeIcon
                     icon={faDownload}
                  />
               </button>
            </div>
         </div>
      </div>
   );
};

export default SimilarSong;
