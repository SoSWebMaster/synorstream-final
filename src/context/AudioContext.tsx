//@ts-nocheck
import React, { createContext, useContext, useRef, useEffect } from "react";
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
import { Howl } from "howler"; // Import Howler.js

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
   const soundRef = useRef<Howl | null>(null); // Use Howl for streaming
   const audioContextRef = useRef<AudioContext | null>(null); // Web Audio API reference for audio analysis
   const analyserRef = useRef<AnalyserNode | null>(null); // Reference to AnalyserNode
   const dispatch = useAppDispatch();
   const { currentSongId, allSongs } = useAppSelector(
      (state) => state.updatedMusicStore
   );

   useEffect(() => {
      audioContextRef.current = new (window.AudioContext ||
         window.webkitAudioContext)();
   }, []);

   const playSong = (song: any) => {
      dispatch(updateIsLoading(true));

      // Destroy WaveSurfer if it exists
      if (waveSurferRef.current) {
         waveSurferRef.current.destroy();
      }

      // Initialize WaveSurfer for visualization
      const waveSurfer = WaveSurfer.create({
         container: "#waveform",
         barWidth: 2,
         backend: "WebAudio",
         height: 40,
         progressColor: "rgb(8, 22, 191)",
         waveColor: "rgba(255, 255, 255, 1)",
      });
      waveSurferRef.current = waveSurfer;

      // Load the metadata for the waveform
      waveSurfer.load(song.audio);

      // Destroy previous Howler instance if exists
      if (soundRef.current) {
         soundRef.current.unload();
      }

      // Create Howler instance for streaming audio
      soundRef.current = new Howl({
         src: [song.audio],
         html5: true, // Enable streaming
         volume: 1.0,
         onload: () => {
            dispatch(updateIsLoading(false));
         },
         onplay: () => {
            dispatch(updateIsPlaying(true));
            dispatch(updateCurrentSong(song));
            dispatch(updateCurrentSongId(song?.id));
         },
         onend: () => {
            dispatch(updateIsPlaying(false));
            nextSong(); // Play the next song automatically
         },
      });

      soundRef.current.play();

      // Analyze the audio data with Web Audio API for visualization
      const source = audioContextRef.current!.createMediaElementSource(
         soundRef.current._sounds[0]._node
      );

      analyserRef.current = audioContextRef.current!.createAnalyser();
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current!.destination);
      analyserRef.current.fftSize = 2048;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawWaveform = () => {
         try {
            requestAnimationFrame(drawWaveform);

            // Get waveform data
            analyserRef.current.getByteTimeDomainData(dataArray);

            // Clear the canvas and draw waveform
            const canvas = document.getElementById(
               "waveform"
            ) as HTMLCanvasElement;
            console.log('canvas',canvas)
            const canvasContext = canvas.getContext("2d");
            if (!canvasContext) return;
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = "rgb(0, 0, 255)";
            canvasContext.beginPath();

            const sliceWidth = (canvas.width * 1.0) / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
               const v = dataArray[i] / 128.0;
               const y = (v * canvas.height) / 2;

               if (i === 0) {
                  canvasContext.moveTo(x, y);
               } else {
                  canvasContext.lineTo(x, y);
               }

               x += sliceWidth;
            }

            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();
         } catch (error) {
            console.log(error);
         }
      };

      drawWaveform();
   };

   const pauseSong = () => {
      if (soundRef.current) {
         soundRef.current.pause();
         dispatch(updateIsPlaying(false));
      }
   };

   const resumeSong = () => {
      if (soundRef.current) {
         soundRef.current.play();
         dispatch(updateIsPlaying(true));
      }
   };

   const stopSong = () => {
      if (soundRef.current) {
         soundRef.current.stop();
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
      if (soundRef.current) {
         soundRef.current.volume(newVolume);
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
