import { useState, useEffect, useCallback } from 'react';
import SongItem from './SongItem';
import { updateAllSongs, updateFirstSongId, updateCurrentSongId, updateIsPlaying, updateCurrentDuration, updateCurrentSong } from '../../store/music-store';
import { callStack } from '../../util/util';
import { useAppDispatch,useAppSelector } from '../../store';
import {SongInterface} from './songTypes'
import axiosInstance from '../../services/axiosConfig/axiosConfigSimple';
import { endPoints } from '../../services/constants/endPoint';
import { CircularProgress } from '@mui/material';
import useAxios from '../../services/axiosConfig/axiosConfig';
const perPage = 8;

interface SongsProps {
   className?: string,
}

export default function Songs({ className }: SongsProps ) {
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState( false );
   const [isLoading2, setIsLoading2] = useState( false );
   const [hasError, setHasError] = useState( false );
   const [currentPage, setCurrentPage] = useState( 1 );
   const [currentCount, setCurrentCount] = useState( 0 );
   const { songType, filterCategories, search,single_page,playLists,playListFilter } = useAppSelector( state => state.music );
   const { success,user } = useAppSelector( state => state.auth );
   const dispatch = useAppDispatch();
   const axiosInstanceAuth=useAxios();

   const fetchSongs = useCallback( async () => {
      setHasError( false );
      setIsLoading( true );
      try{
         let response;
         if(success && user?.id && single_page==='playlist' ){
           const pageName= playLists?.find((item)=>item?.name==playListFilter)
             response = await axiosInstanceAuth.post( endPoints?.fetch_data2, {
               post: songType,
               page: currentPage,
               single_page: single_page ,
               categories: filterCategories,
               per_page: perPage,
               user:  user?.id,
               search,
               page_name:pageName?.id
            });
         }
         else if(single_page==='favorites'){
            response = await axiosInstanceAuth.post( endPoints?.fetch_data_favorites, {
               post: songType,
               page: currentPage,
               single_page: single_page ,
               categories: filterCategories,
               per_page: perPage,
               user:  user?.id,
               search,
               page_name:single_page
            });
         }
         else{
            response = await axiosInstance.post( endPoints?.fetch_music_json, {
               post: songType,
               page: currentPage,
               single_page: "staging2.syncorstream.com",
               categories: filterCategories,
               per_page: perPage,
               user:155,
               search,
               source:'react'
            });
         }
            const result = response;
            const records = result?.data?.records;
        
            if( typeof result.data.count === "number" ) setCurrentCount( result.data.count );
   
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
   }, [setSongs, setIsLoading, currentPage, songType, filterCategories, search,playListFilter]);

   const loadMoreSongs = useCallback( async () => {
      setIsLoading2(true)
      try{
         const response = await axiosInstance.post( endPoints?.fetch_music_json, {
            post: songType,
            page: currentPage + 1,
            single_page: "staging2.syncorstream.com",
            categories: filterCategories.toString(),
            per_page: perPage,
            user: 155,
            source:'react'
         });

         const result = response;
         const records = result?.data?.records;

         if( typeof result.data.count === "number" ) setCurrentCount( result.data.count );

         if( records )  {
            setIsLoading2(false)
            // console.log( records )
            setSongs( state => [...state, ...records] );
            setCurrentPage( state => ++state )
         }
         setIsLoading2(false)

      } catch( e )  {
         setIsLoading2(false)
         console.error( "unable to fetch new songs!!!" );
      }

   }, [currentPage, songType, filterCategories, search]);

   useEffect(() => {
      callStack.empty();
      fetchSongs();


      
   }, [songType, filterCategories, search,success,single_page,playListFilter]);

   useEffect(() => {
      setCurrentPage( 1 );
      // console.log( filterCategories.toString() );
   }, [songType, filterCategories]);

   let allSongs = {};
   let firstSongId: number | string | null = null;

   const items = songs.map(( song, i ) => {
      // console.log(song,"songsong")
      // saving first song ID because the way we saving all songs in a object with number as a key
      // because of that it will automatically reorderd song object and we get all songs in sequence
      // but we don't want that, what we want is the first song ID.
      if( i === 0 )  firstSongId = song.id;

      allSongs = {...allSongs, [song.id]: song };
      return <SongItem key={song.id} {...song} />
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
            {(!isLoading && !hasError && items.length > 0 && ( perPage * currentPage ) < currentCount ) &&
               <div className="text-center">
                  <button
                     className="bg-[#0816bf] px-4 py-1 rounded-full font-semibold text-base mt-4"
                     onClick={() => loadMoreSongs()}
                  >
                     LOAD MORE {isLoading2 &&   <CircularProgress color="primary" size={20}   />}
                  </button>
               </div>
            }
            {isLoading &&   
            
  <CircularProgress color="warning" size={40}   />

            
            }
            {( !isLoading && hasError ) && <p>Something went wrong please try again.</p>}
         </div>
      </div>
   );
}

