//@ts-nocheck
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WaveSurfer from 'wavesurfer.js';

interface MusicState {
  currentSongId: number | null;
  currentSong: any | null;
  isPlaying: boolean;
  currentVolume: number;
  currentSongRef: WaveSurfer | null;
  currentDuration: number;
  totalDuration: number;
  allSongs: Record<number, any>;
  filterCategories: string,
  search: string,
}

const initialState: MusicState = {
  currentSongId: null,
  currentSong: null,
  isPlaying: false,
  currentVolume: 1,
  currentSongRef: null,
  currentDuration: 0,
  totalDuration: 0,
  allSongs: {},
  filterCategories: '',
  search: '',
};

export const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    updateCurrentSongId: (state, action: PayloadAction<number | null>) => {
      state.currentSongId = action.payload;
    },
    updateCurrentSong: (state, action: PayloadAction<any | null>) => {
      state.currentSong = action.payload;
    },
    updateIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    updateAudioRef: (state, action: PayloadAction<WaveSurfer | null>) => {
      state.currentSongRef = action.payload;
    },
    updateCurrentVolume: (state, action: PayloadAction<number>) => {
      state.currentVolume = action.payload;
      if (state.currentSongRef) {
        state.currentSongRef.volume = action.payload;
      }
    },
    updateFilterCategories: (state, action: PayloadAction<MusicState['filterCategories']>) => {
        state.filterCategories = action.payload;
     },
    updateCurrentDuration: (state, action: PayloadAction<number>) => {
      state.currentDuration = action.payload;
    },
    updateTotalDuration: (state, action: PayloadAction<number>) => {
      state.totalDuration = action.payload;
    },
    stopCurrentSong: (state) => {
      if (state.currentSongRef) {
        state.currentSongRef.pause();
        state.isPlaying = false;
        state.currentDuration = 0;
      }
    },
    playSong: (state, action: PayloadAction<any>) => {
      const song = action.payload;
    
      if (state.currentSongRef) {
        state.currentSongRef.destroy(); // Properly destroy the previous WaveSurfer instance
      }
    
      // Create a new WaveSurfer instance with options
      const waveSurfer = WaveSurfer.create({
        container: '#waveform', // Specify the container for the waveform visualization
        waveColor: 'violet',
        progressColor: 'purple',
        barWidth: 2,
        height: 80,
        responsive: true,
        backend: 'MediaElement', // Use HTML5 Audio for better compatibility
        volume: state.currentVolume,
      });
    
      // Set the current song reference
      state.currentSongRef = waveSurfer;
      state.currentSongId = song.id;
      state.currentSong = song;
      state.isPlaying = false; // Set to false initially, until buffering starts
    
      // Load the song's audio file
      waveSurfer.load(song.audio);
    
      // Play the song when it is ready (progressive buffering)
      waveSurfer.on('ready', () => {
        waveSurfer.play();
console.log('in wavesurfer func')
        state.isPlaying = true; 
      });
    
      // Error handling
      waveSurfer.on('error', (error) => {
        console.error("Error loading audio file:", error);
        state.isPlaying = false;
        // Optionally show error notification to the user
      });
    
      // Optionally, you can monitor the progress of the audio
      waveSurfer.on('audioprocess', () => {
        state.currentDuration = waveSurfer.getCurrentTime();
        state.totalDuration = waveSurfer.getDuration();
        // console.log(`Playing: ${currentTime} / ${duration}`);
      });
    
      // Handle pause/play state
      waveSurfer.on('finish', () => {
        state.isPlaying = false; // Reset state when playback finishes
      });
    },
    
    pauseSong: (state) => {
      if (state.currentSongRef) {
        state.currentSongRef.pause();
        state.isPlaying = false;
      }
    },
    nextSong: (state) => {
      if (!state.currentSongId) return;

      const songKeys = Object.keys(state.allSongs).map(Number);
      const currentIndex = songKeys.indexOf(state.currentSongId);
      const nextIndex = currentIndex + 1 >= songKeys.length ? 0 : currentIndex + 1;
      const nextSongId = songKeys[nextIndex];

      if (state.currentSongRef) {
        state.currentSongRef.pause();
      }

      state.currentSongId = nextSongId;
      state.currentSong = state.allSongs[nextSongId];
      const audioElement = new Audio(state.allSongs[nextSongId].audio);
      audioElement.volume = state.currentVolume;
      state.currentSongRef = audioElement;

      audioElement.play();
      state.isPlaying = true;
    },
    prevSong: (state) => {
      if (!state.currentSongId) return;

      const songKeys = Object.keys(state.allSongs).map(Number);
      const currentIndex = songKeys.indexOf(state.currentSongId);
      const prevIndex = currentIndex - 1 < 0 ? songKeys.length - 1 : currentIndex - 1;
      const prevSongId = songKeys[prevIndex];

      if (state.currentSongRef) {
        state.currentSongRef.pause();
      }

      state.currentSongId = prevSongId;
      state.currentSong = state.allSongs[prevSongId];
      const audioElement = new Audio(state.allSongs[prevSongId].audio);
      audioElement.volume = state.currentVolume;
      state.currentSongRef = audioElement;

      audioElement.play();
      state.isPlaying = true;
    },
    updateAllSongs: (state, action: PayloadAction<Record<number, any>>) => {
      state.allSongs = action.payload;
    },
    updateSearch: (state, action: PayloadAction<MusicState['search']>) => {
      state.search = action.payload;
   },
  },
});

export const {
  updateCurrentSongId,
  updateCurrentSong,
  updateIsPlaying,
  updateAudioRef,
  updateCurrentVolume,
  updateCurrentDuration,
  updateTotalDuration,
  stopCurrentSong,
  playSong,
  pauseSong,
  nextSong,
  prevSong,
  updateAllSongs,
  updateFilterCategories,
  updateSearch
} = musicSlice.actions;

export default musicSlice.reducer;
