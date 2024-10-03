import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import WaveSurfer from "wavesurfer.js";
import {
   updateCurrentSong,
   updateIsPlaying,
} from "../store/updated-music-store";

const useAudioPlayer = () => {
   const dispatch = useAppDispatch();
   const { currentSong, isPlaying, currentVolume } = useAppSelector(
      (state) => state.updatedMusicStore
   );
   const waveSurferRef = useRef<WaveSurfer | null>(null);

   // Cleanup previous WaveSurfer instance
   // const cleanUpWaveSurfer = () => {
   //    if (waveSurferRef.current) {
   //       waveSurferRef.current.destroy();
   //       waveSurferRef.current = null;
   //    }
   // };

   useEffect(() => {
      // if (currentSong) {
      //    // Cleanup any existing WaveSurfer instance before creating a new one
      //    cleanUpWaveSurfer();

      //    // Create a new WaveSurfer instance for the current song
      //    const waveSurfer = WaveSurfer.create({
      //       container: `#waveform-${currentSong.id}`,
      //       waveColor: "violet",
      //       progressColor: "purple",
      //       barWidth: 2,
      //       height: 80,
      //       backend: "MediaElement",
      //       // volume: currentVolume,
      //    });

      //    // Load the current song into the WaveSurfer instance
      //    waveSurfer.load(currentSong.audio);
      //    waveSurferRef.current = waveSurfer;

      //    // When the song is ready, play it if isPlaying is true
      //    waveSurfer.on("ready", () => {
      //       if (isPlaying) {
      //          waveSurfer.play();
      //       }
      //       dispatch(updateTotalDuration(waveSurfer.getDuration()));
      //    });

      //    // Update the current duration as the song progresses
      //    waveSurfer.on("audioprocess", () => {
      //       dispatch(updateCurrentDuration(waveSurfer.getCurrentTime()));
      //    });

      //    // Handle the end of the song
      //    waveSurfer.on("finish", () => {
      //       dispatch(updateIsPlaying(false));
      //    });

      //    // Cleanup when the component unmounts or the song changes
      //    return () => {
      //       cleanUpWaveSurfer();
      //    };
      // }
   }, [currentSong, isPlaying, currentVolume, dispatch]);

   // Play function: set the current song and start playback
   const play = (song: any) => {
      dispatch(updateCurrentSong(song));
      dispatch(updateIsPlaying(true));
   };

   // Pause function: just update the playing state
   const pause = () => {
      if (waveSurferRef.current) {
         waveSurferRef.current.pause();
      }
      dispatch(updateIsPlaying(false));
   };

   return { play, pause };
};

export default useAudioPlayer;
