//@ts-nocheck
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MusicState {
  currentSongId: number | null;
  currentSong: any | null;
  isPlaying: boolean;
  currentVolume: number;
  currentSongRef: HTMLAudioElement | null;
  currentDuration: number;
  totalDuration: number;
  allSongs: Record<number, any>;
  filterCategories: string,
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
    updateAudioRef: (state, action: PayloadAction<HTMLAudioElement | null>) => {
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
        state.currentSongRef.pause();
      }

      const audioElement = new Audio(song.audio);
      audioElement.volume = state.currentVolume;

      state.currentSongRef = audioElement;
      state.currentSongId = song.id;
      state.currentSong = song;
      state.isPlaying = true;

   

      audioElement.play();
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
  updateFilterCategories
} = musicSlice.actions;

export default musicSlice.reducer;
