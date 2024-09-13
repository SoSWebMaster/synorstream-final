import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SocialShare from "./SocialShare";
import SongInfo from "./SongInfo";
// @ts-ignore
import download from "downloadjs/download.min.js";
import { toast } from "react-toastify";
import { useAppSelector } from "../../store";
import { useNavigate } from "react-router-dom";
import useAxios from "../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../services/constants/endPoint";

interface SimilarSongProps {
   id: number | string;
   name: string;
   artis_name: string;
   thumb: string;
   audio: string;
   isAltPlaying: boolean;
   onPlayPause: () => void;
   isPlaying: boolean;
}

const SimilarSong: React.FC<SimilarSongProps> = ({
   id,
   name,
   artis_name,
   thumb,
   audio,
   isAltPlaying,
   onPlayPause,
   isPlaying,
}) => {
   const waveformRef = useRef<HTMLDivElement | null>(null);
   const waveSurferRef = useRef<WaveSurfer | null>(null);
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   // const [songId, setSOngId] = useState<number | null>(null);
   const { success } = useAppSelector((state) => state.auth);
   const navigate = useNavigate();
   const axiosInstance = useAxios();

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
   }, [audio]);

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
      <div className="flex items-center w-full gap-10">
         <img
            className="w-16 h-16 object-cover rounded-md"
            src={thumb}
            alt="Thumbnail"
         />
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
         <div className="flex flex-col flex-grow w-full max-w-[350px]">
            <h3 className="text-xl text-white truncate">{name}</h3>
            <span
               className="text-white/50 text-sm truncate"
               dangerouslySetInnerHTML={{ __html: artis_name }}
            />
         </div>
         {/* <div className="relative w-[45%]">
            {loading && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-4 border-t-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
               </div>
            )} */}
         <div
            id={`waveform-${id}`}
            className="waveform-container w-[45%]"
            ref={waveformRef}
         />
         {/* </div> */}
         <div className="grid grid-cols-2 gap-3 text-base text-right md:block md:text-xl text-white/50 md:space-x-4">
            <FontAwesomeIcon
               icon={faDownload}
               className="opacity-0 !hidden md:!inline-block"
            />
            <SocialShare url={audio} />
            <SongInfo songId={id} />
            <button
               className="inline-block"
               onClick={() => downloadFIle(audio, id, name)}
            >
               <FontAwesomeIcon icon={faDownload} />
            </button>
         </div>
         <audio ref={audioRef} src={audio} preload="auto" />
      </div>
   );
};

export default SimilarSong;
