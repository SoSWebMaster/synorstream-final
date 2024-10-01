import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import WaveSurfer from 'wavesurfer.js';
import { playSong, pauseSong, updateCurrentDuration, updateTotalDuration, updateAudioRef, updateCurrentSong } from '../store/updated-music-store';

const useAudioPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentSong, isPlaying, currentVolume, currentSongRef } = useAppSelector((state) => state.updatedMusicStore);

  useEffect(() => {
    if (currentSong) {
      // Create a new WaveSurfer instance
      const waveSurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        barWidth: 2,
        height: 80,
        backend: 'MediaElement',
        // volume: currentVolume,
      });

      updateAudioRef(waveSurfer)

      // Load the current song audio
      waveSurfer.load(currentSong.audio);

      // Handle playback state
      waveSurfer.on('ready', () => {
        if (isPlaying) {
          waveSurfer.play();
        }
      });

      // Update Redux state on audio process
      waveSurfer.on('audioprocess', () => {
        dispatch(updateCurrentDuration(waveSurfer.getCurrentTime()));
        dispatch(updateTotalDuration(waveSurfer.getDuration()));
      });

      // Handle finish event
      waveSurfer.on('finish', () => {
        dispatch(pauseSong()); // Update state to indicate song finished
      });

      // Cleanup WaveSurfer on unmount or when song changes
      return () => {
        waveSurfer.destroy();
      };
    }
  }, [currentSong, isPlaying, currentVolume]);

  console.log('currentSOng in custom hook', currentSong)

  // Function to play the song
  const play = (song: any) => {

    updateCurrentSong(song)
    console.log('click')
    if (currentSongRef) {
      currentSongRef.play();
      // dispatch(playSong(currentSong)); // Update state to reflect the playing song
    }
  };

  // Function to pause the song
  const pause = () => {
    if (currentSongRef) {
      currentSongRef.pause();
      // dispatch(pauseSong()); // Update state to reflect the paused state
    }
  };

  return { play, pause };
};

export default useAudioPlayer;
