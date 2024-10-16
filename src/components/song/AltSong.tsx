import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";

interface AltSongProps {
   id: number | string;
   name: string;
   artis_name: string;
   thumb: string;
   audio: string;
   isAltPlaying: boolean;
   onPlayPause: () => void;
   isPlaying: boolean;
}

const AltSong: React.FC<AltSongProps> = ({
   id,
   name,
   // artis_name,
   // thumb,
   audio,
   isAltPlaying,
   onPlayPause,
   isPlaying,
}) => {
   const waveformRef = useRef<HTMLDivElement | null>(null);
   const waveSurferRef = useRef<WaveSurfer | null>(null);
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (waveformRef.current) {
         const wavesurfer = WaveSurfer.create({
            container: `#waveform-${id}`,
            url: audio,
            height: 40,
            progressColor: "rgb(8, 22, 191)",
            waveColor: "rgba(255, 255, 255, 1)",
            fillParent: true,
         });

         waveSurferRef.current = wavesurfer;

         wavesurfer.on("ready", () => {
            setLoading(false);
         });

         wavesurfer.on("loading", () => {
            setLoading(true);
         });

         wavesurfer.load(audio);

         return () => {
            if (waveSurferRef.current) {
               waveSurferRef.current.destroy();
               waveSurferRef.current = null;
            }
         };
      }
   }, [audio, id]);

   useEffect(() => {
      if (isAltPlaying) {
         audioRef.current?.play();
         if (waveSurferRef.current) {
            waveSurferRef.current.play();
         }
      } else {
         audioRef.current?.pause();
         if (waveSurferRef.current) {
            waveSurferRef.current.pause();
         }
      }
   }, [isAltPlaying]);

   useEffect(() => {
      if (isPlaying) {
         audioRef.current?.pause();
         if (waveSurferRef.current) {
            waveSurferRef.current.pause();
         }
      }
   }, [isPlaying]);

   return (
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
         <div>
            <button onClick={onPlayPause}>
               {loading ? (
                  <div className="w-4 h-4 border-4 border-t-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
               ) : isAltPlaying ? (
                  <PauseIcon className="w-5 h-5 cursor-pointer" />
               ) : (
                  <PlayIcon className="w-5 h-5 cursor-pointer" />
               )}
            </button>
         </div>
         <p className="ellipsis">{name}</p>
         <div className="relative">
            {loading && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-4 border-t-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
               </div>
            )}
            <div
               id={`waveform-${id}`}
               className="waveform-container"
               ref={waveformRef}
            />
         </div>
         <audio ref={audioRef} src={audio} preload="auto" />
      </div>
   );
};

export default AltSong;
