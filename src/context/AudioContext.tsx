//@ts-nocheck
import React, { createContext, useContext, useRef } from "react";
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
   nextSong: () => void;
   prevSong: () => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const waveSurferRef = useRef<WaveSurfer | null>(null);
   const dispatch = useAppDispatch();
   const { currentSongId, allSongs } = useAppSelector((state) => state.updatedMusicStore);

   const playSong = (song: any) => {
      dispatch(updateIsLoading(true));
      if (waveSurferRef.current) {
         waveSurferRef.current.stop(); // Stop the current song
         waveSurferRef.current.destroy(); // Destroy the WaveSurfer instance
      }
   

      const waveSurfer = WaveSurfer.create({
         container: "#waveform",
         barWidth: 2,
         backend: "MediaElement",
         height: 40,
         progressColor: "rgb(8, 22, 191)",
         waveColor: "rgba(255, 255, 255, 1)",
         partialRender: true,
      });

      // Load only the audio metadata first
      waveSurfer.load(song.audio);
      waveSurferRef.current = waveSurfer;

      dispatch(updateCurrentSong(song));
      dispatch(updateCurrentSongId(song?.id));

      waveSurfer.on("ready", () => {
         dispatch(updateIsLoading(false));
         waveSurfer.play();
         dispatch(updateIsPlaying(true));
      });

      waveSurfer.on("audioprocess", () => {
         dispatch(updateCurrentDuration(waveSurfer.getCurrentTime()));
         dispatch(updateTotalDuration(waveSurfer.getDuration()));
      });

      waveSurfer.on("loading", (progress) => {
         dispatch(updateIsLoading(true));
         dispatch(updateCurrentDuration(0));
         dispatch(updateTotalDuration(0));
      });

      waveSurfer.on("finish", () => {
         dispatch(updateIsPlaying(false));
         nextSong();
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

   const nextSong = () => {
      if (!currentSongId) return;

      const songKeys = Object.keys(allSongs).map(Number);
      const currentIndex = songKeys.indexOf(currentSongId);
      const nextIndex = (currentIndex + 1) % songKeys.length;
      const nextSongId = songKeys[nextIndex];

      playSong(allSongs[nextSongId]);
   };

   const prevSong = () => {
      if (!currentSongId) return;

      const songKeys = Object.keys(allSongs).map(Number);
      const currentIndex = songKeys.indexOf(currentSongId);
      const prevIndex =
         currentIndex - 1 < 0 ? songKeys.length - 1 : currentIndex - 1;
      const prevSongId = songKeys[prevIndex];

      playSong(allSongs[prevSongId]);
   };

   const handleSetVolume = (newVolume: number) => {
      dispatch(updateCurrentVolume(newVolume));
      if (waveSurferRef.current) {
         waveSurferRef.current.setVolume(newVolume);
      }
   };

   return (
      <AudioContext.Provider
         value={{
            playSong,
            pauseSong,
            resumeSong,
            stopSong,
            setVolume: handleSetVolume,
            nextSong,
            prevSong,
         }}
      >
         {children}
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