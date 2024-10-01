//@ts-nocheck
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WaveSurfer from "wavesurfer.js";

interface MusicState {
   currentSongId: number | null;
   currentSong: any | null;
   isPlaying: boolean;
   isLoading: boolean;
   currentVolume: number;
   currentSongRef: WaveSurfer | null;
   currentDuration: number;
   totalDuration: number;
   allSongs: Record<number, any>;
   filterCategories: string;
   search: string;
}

const initialState: MusicState = {
   currentSongId: null,
   currentSong: null,
   isPlaying: false,
   isLoading: false,
   currentVolume: 1,
   currentSongRef: null,
   currentDuration: 0,
   totalDuration: 0,
   allSongs: {},
   filterCategories: "",
   search: "",
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
      updateIsLoading: (state, action: PayloadAction<boolean>) => {
         state.isLoading = action.payload;
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
      updateFilterCategories: (
         state,
         action: PayloadAction<MusicState["filterCategories"]>
      ) => {
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
      playSong: (state, action: PayloadAction<any>) => {},

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
         const nextIndex =
            currentIndex + 1 >= songKeys.length ? 0 : currentIndex + 1;
         const nextSongId = songKeys[nextIndex];

         state.currentSongId = nextSongId;
         state.currentSong = state.allSongs[nextSongId];

      },
      prevSong: (state) => {
         if (!state.currentSongId) return;

         const songKeys = Object.keys(state.allSongs).map(Number);
         const currentIndex = songKeys.indexOf(state.currentSongId);
         const prevIndex =
            currentIndex - 1 < 0 ? songKeys.length - 1 : currentIndex - 1;
         const prevSongId = songKeys[prevIndex];

         if (state.currentSongRef) {
            state.currentSongRef.pause();
         }

         state.currentSongId = prevSongId;
         state.currentSong = state.allSongs[prevSongId];
      },
      updateAllSongs: (state, action: PayloadAction<Record<number, any>>) => {
         state.allSongs = action.payload;
      },
      updateSearch: (state, action: PayloadAction<MusicState["search"]>) => {
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
   updateSearch,
   updateIsLoading,
} = musicSlice.actions;

export default musicSlice.reducer;
