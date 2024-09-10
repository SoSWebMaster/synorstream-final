import { SongInterface } from './../components/song/songTypes';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PlayListTypes {
   id?: number,
   user_id?: number,
   name?: string,
   tcount?: number
}
interface MusicState {
   currentSongId: null | number | string,
   currentSongIdForPagination: null | number | string,
   currentSong: SongInterface | null,
   firstSongId: number | null,
   isPlaying: boolean,
   currentDuration: null | number,
   currentDurationSeek: number | null,
   allSongs: {
      [key: number]: SongInterface
   },
   currentVolume: number,
   songType: number,
   filterCategories: string,
   search: string,
   musicType: string,
   isLoading: boolean,
   sideBar: string,
   playListFilter: string,
   playLists?: PlayListTypes[],
   single_page?: string,
   plain_Id?: null | number,
   plain_MonthlyPrice?: null | number,
   plain_AnnualPrice?: null | number,
   pageNameId?: null | number,
   userId?: null | number;
}

const initialState: MusicState = {
   currentSongId: null,
   currentSongIdForPagination: null,
   currentSong: null,
   firstSongId: null,
   isPlaying: false,
   currentDuration: null,
   currentDurationSeek: 0,
   allSongs: {},
   currentVolume: 1,
   songType: 0,
   filterCategories: '',
   search: '',
   musicType: 'music',
   isLoading: false,
   sideBar: '/browse',
   playListFilter: '',
   playLists: [],
   single_page: '',
   plain_Id: null,
   plain_MonthlyPrice: null,
   plain_AnnualPrice: null,
   pageNameId: null,
   userId: null
}

export const musicSlice = createSlice({
   name: 'music',
   initialState,
   reducers: {
      updateCurrentSongId: (state, action: PayloadAction<MusicState['currentSongId']>) => {
         state.currentSongId = action.payload;
      },
      updateCurrentSongIdForPagination: (state, action: PayloadAction<MusicState['currentSongIdForPagination']>) => {
         state.currentSongIdForPagination = action.payload;
      },
      updateCurrentSong: (state, action: PayloadAction<MusicState['currentSong']>) => {
         state.currentSong = action.payload;
      },
      updateFirstSongId: (state, action: PayloadAction<MusicState['firstSongId']>) => {
         state.firstSongId = action.payload;
      },
      updateIsPlaying: (state, action: PayloadAction<MusicState['isPlaying']>) => {
         state.isPlaying = action.payload;
      },
      updateMusicType: (state, action: PayloadAction<MusicState['musicType']>) => {
         state.musicType = action.payload;
      },
      updateCurrentDuration: (state, action: PayloadAction<MusicState['currentDuration']>) => {
         state.currentDuration = action.payload;
      },
      updateCurrentDurationSeek: (state, action: PayloadAction<MusicState['currentDurationSeek']>) => {
         state.currentDurationSeek = action.payload;
      },
      updateAllSongs: (state, action: PayloadAction<MusicState['allSongs']>) => {
         state.allSongs = action.payload;
      },
      updateIsLoading: (state, action: PayloadAction<MusicState['isLoading']>) => {
         state.isLoading = action.payload;
      },
      nextSong: state => {
         if (!state.currentSongId) return
         let globalPosition = state.currentSongId;

         if (typeof globalPosition === "string") globalPosition = globalPosition.split('_')[0];

         // doing reverse because the way we saving all songs
         const keys = Object.keys(state.allSongs).reverse();
         const currentPosition = +keys.indexOf(globalPosition + '');
         const nextPosition: string | undefined = keys[currentPosition + 1];

         if (!nextPosition) return

         const nextSongId = +nextPosition;

         state.currentSongId = nextSongId;

         // console.log( nextSongId, state.currentSongId, keys );
      },
      prevSong: state => {
         if (!state.currentSongId) return
         // doing reverse because the way we saving all songs
         const keys = Object.keys(state.allSongs).reverse();
         const currentPosition = +keys.indexOf(state.currentSongId + '');
         const prevPosition: string | undefined = keys[currentPosition - 1];

         if (!prevPosition) return

         const prevSongId = +prevPosition;

         state.currentSongId = prevSongId;
      },
      updateCurrentVolume: (state, action: PayloadAction<MusicState['currentVolume']>) => {
         state.currentVolume = action.payload;
      },
      updateSongType: (state, action: PayloadAction<MusicState['songType']>) => {
         state.songType = action.payload;
      },
      updateFilterCategories: (state, action: PayloadAction<MusicState['filterCategories']>) => {
         state.filterCategories = action.payload;
      },
      updateSearch: (state, action: PayloadAction<MusicState['search']>) => {
         state.search = action.payload;
      },
      updateSideBar: (state, action: PayloadAction<MusicState['sideBar']>) => {
         state.sideBar = action.payload;
      },
      updatePlayListFilter: (state, action: PayloadAction<MusicState['playListFilter']>) => {
         state.playListFilter = action.payload;
      },
      updatePlayLists: (state, action: PayloadAction<MusicState['playLists']>) => {
         state.playLists = action.payload;
      },
      updateSinglePage: (state, action: PayloadAction<MusicState['single_page']>) => {
         state.single_page = action.payload;
      },
      updatePlainId: (state, action: PayloadAction<MusicState['plain_Id']>) => {
         state.plain_Id = action.payload;
      },
      updatePlainMonthlyPrice: (state, action: PayloadAction<MusicState['plain_MonthlyPrice']>) => {
         state.plain_MonthlyPrice = action.payload;
      },
      updatePlainAnnualPrice: (state, action: PayloadAction<MusicState['plain_AnnualPrice']>) => {
         state.plain_AnnualPrice = action.payload;
      },
      updatePageNameId: (state, action: PayloadAction<MusicState['pageNameId']>) => {
         state.pageNameId = action.payload;
      },

      updateUserId: (state, action: PayloadAction<MusicState['userId']>) => {
         state.userId = action.payload;
      },
   }

});

export const {
   updateCurrentSongId, updateCurrentSongIdForPagination, updateCurrentSong, updateFirstSongId, updateIsPlaying, updateCurrentDuration, updateCurrentDurationSeek, updateAllSongs,
   nextSong, prevSong, updateIsLoading, updateCurrentVolume, updateSongType, updateFilterCategories, updateSearch, updateMusicType, updateSideBar, updatePlayListFilter,
   updatePlayLists, updateSinglePage, updatePlainId, updatePlainMonthlyPrice, updatePlainAnnualPrice, updatePageNameId, updateUserId
} = musicSlice.actions;


export default musicSlice.reducer;

