import React, {
   createContext,
   useContext,
   useRef,
   useEffect,
   useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
   updateCurrentDuration,
   updateTotalDuration,
   updateCurrentSong,
   updateIsPlaying,
   updateIsLoading,
   updateCurrentSongId,
   updateCurrentVolume,
} from "../store/updated-music-store";
import WaveSurfer from "wavesurfer.js";

interface AudioContextProps {
   playSong: (song: any) => void;
   pauseSong: () => void;
   resumeSong: () => void;
   stopSong: () => void;
   setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const waveSurferRef = useRef<WaveSurfer | null>(null);
   const dispatch = useAppDispatch();
   const { currentSong } = useAppSelector((state) => state.updatedMusicStore);
   const [isFirstRender, setIsFirstRender] = useState(true); // Track the initial render

   const playSong = (song: any) => {
      if (waveSurferRef.current) {
         waveSurferRef.current.destroy();
      }

      const waveSurfer = WaveSurfer.create({
         container: "#waveform",
         barWidth: 2,
         backend: "MediaElement",
         height: 40,
         progressColor: "rgb(8, 22, 191)",
         waveColor: "rgba(255, 255, 255, 1)",
      });

      waveSurfer.load(song.audio);
      waveSurferRef.current = waveSurfer;
      dispatch(updateCurrentSong(song));
      dispatch(updateCurrentSongId(song?.id));

      waveSurfer.on("ready", () => {
         dispatch(updateIsLoading(false));
         // Only play the song if it's not the first render or explicitly triggered
         // if (!isFirstRender) {
         waveSurfer.play();
         dispatch(updateIsPlaying(true));
         // }
      });

      waveSurfer.on("audioprocess", () => {
         dispatch(updateCurrentDuration(waveSurfer.getCurrentTime()));
         dispatch(updateTotalDuration(waveSurfer.getDuration()));
      });

      waveSurfer.on("loading", (progress) => {
         console.log(`Loading progress: ${progress}%`);
         dispatch(updateIsLoading(true));
         dispatch(updateCurrentDuration(0));
         dispatch(updateTotalDuration(0));
      });

      waveSurfer.on("finish", () => {
         dispatch(updateIsPlaying(false));
      });
   };

   const pauseSong = () => {
      if (waveSurferRef.current) {
         waveSurferRef.current.pause();
         dispatch(updateIsPlaying(false));
      }
   };

   const resumeSong = () => {
      if (waveSurferRef.current) {
         waveSurferRef.current.play();
         dispatch(updateIsPlaying(true));
      }
   };

   const stopSong = () => {
      if (waveSurferRef.current) {
         waveSurferRef.current.stop();
         dispatch(updateIsPlaying(false));
         dispatch(updateCurrentDuration(0));
      }
   };

   const handleSetVolume = (newVolume: number) => {
      dispatch(updateCurrentVolume(newVolume)); // Dispatch the volume change to the Redux store
      if (waveSurferRef.current) {
         waveSurferRef.current.setVolume(newVolume); // Update the volume in WaveSurfer
      }
   };

   // useEffect to react to song changes (next/previous)
   // useEffect(() => {
   //    if (currentSong) {
   //       playSong(currentSong);
   //       if (isFirstRender) {
   //          setIsFirstRender(false);  // Disable the first-render flag after initial render
   //       }
   //    }
   // }, [currentSong]);  // When currentSong changes, the effect runs

   return (
      <AudioContext.Provider
         value={{
            playSong,
            pauseSong,
            resumeSong,
            stopSong,
            setVolume: handleSetVolume,
         }}
      >
         {children}{" "}
      </AudioContext.Provider>
   );
};

export const useAudio = (): AudioContextProps => {
   const context = useContext(AudioContext);
   if (!context) {
      throw new Error("useAudio must be used within an AudioProvider");
   }
   return context;
};
