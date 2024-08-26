import { useState, useEffect, useCallback } from 'react';
import { updateAllSongs, updateFirstSongId,  updateCurrentSongId, updateIsPlaying, updateCurrentDuration, updateCurrentSong } from '../../store/music-store';
import { callStack } from '../../util/util';
import { useAppDispatch,useAppSelector } from '../../store';
import SongItem2 from './songItem2';
import axiosInstance from '../../services/axiosConfig/axiosConfigSimple';
import { endPoints } from '../../services/constants/endPoint';
import { SongInterface2 } from '../song/songTypes';

const perPage = 8;

interface SongsProps {
   className?: string,
}

export default function SongsLists({ className }: SongsProps ) {
   const [songs, setSongs] = useState<SongInterface2[]>([]);
   const [isLoading, setIsLoading] = useState( false );
   const [hasError, setHasError] = useState( false );
   const [currentPage, setCurrentPage] = useState( 1 );
   // const [currentCount, setCurrentCount] = useState( 0 );
   const { songType, filterCategories, search } = useAppSelector( (state :any) => state.music );
   const dispatch = useAppDispatch();

   const fetchSongs = useCallback( async () => {
      setHasError( false );
      setIsLoading( true );

      try{
         const response = await axiosInstance.post( endPoints?.fetch_music_json, {
            post: songType,
            page: currentPage,
            single_page: "staging2.syncorstream.com",
            categories: filterCategories,
            per_page: perPage,
            user: 155,
            search,
            source:'react'
         });

         const result = response;
         const records = result?.data?.records;

         // if( typeof result.data.count === "number" ) setCurrentCount( result.data.count );

         if( Array.isArray( records ) )  {
            if( currentPage === 1 )  {
               setSongs( records );
            } else if( currentPage > 1 )  {
               setSongs( state => [...state, ...records] );
            }
         } else {
            setSongs([]);
         }

         setIsLoading( false );
         // console.log( records );
      } catch( e )  {
         console.error( "unable to fetch songs!!!" );
         setHasError( true );
         setIsLoading( false );
      }
   }, [setSongs, setIsLoading, currentPage, songType, filterCategories, search]);

 

   useEffect(() => {
      fetchSongs();

      callStack.empty();
   }, [songType, filterCategories, search]);

   useEffect(() => {
      setCurrentPage( 1 );
      // console.log( filterCategories.toString() );
   }, [songType, filterCategories]);

   let allSongs = {};
   let firstSongId: number | string | null | any = null;

   const items = songs.map(( song, i ) => {
      // saving first song ID because the way we saving all songs in a object with number as a key
      // because of that it will automatically reorderd song object and we get all songs in sequence
      // but we don't want that, what we want is the first song ID.
      if( i === 0 )  firstSongId = song.id;
      // @ts-ignore
      allSongs = {...allSongs, [song.id]: song };
      return <SongItem2 key={song.id} {...song} />
   });

   useEffect(() => {
      // console.log( allSongs );
      dispatch( updateAllSongs( allSongs ) );

      // first song to be active by default because it need by the bottom music player
      if( typeof firstSongId === 'number' )  dispatch( updateFirstSongId( firstSongId ) );
   }, [songs]);

   // reset
   useEffect(() => {
      setCurrentPage( 1 );

      dispatch( updateCurrentSongId( null ) );
      dispatch( updateFirstSongId( null ) );
      dispatch( updateCurrentSong( null ) );
      dispatch( updateCurrentDuration( null ) );
      dispatch( updateIsPlaying( false ) );
   }, [filterCategories, search, songType]);

   return(
      <div className={`${className ? className + ' ' : ''}`}>
         <div>
            {(!isLoading && !hasError ) && items}
            {(!isLoading && !hasError && items.length === 0 ) && <p>Song not found</p>}
         </div>
      </div>
   );
}
