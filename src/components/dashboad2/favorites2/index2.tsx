//@ts-nocheck
import { useEffect, useState } from "react";
import DashboardComponent2 from "..";
import Filter from "../../filter/Filter";
import axiosInstance from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import { SongInterface } from "../../song/songTypes";
import { useAppSelector } from "../../../store";
import SongItem from "../../song/SongItem";
import { CircularProgress } from "@mui/material";
const perPage = 8;
const FavoritesComponent2 = () => {
   const axiosInstanceAuth = axiosInstance();
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [hasError, setHasError] = useState(false);
   const { songType, filterCategories, search, single_page } = useAppSelector(
      (state) => state.music
   );
   const { user } = useAppSelector((state) => state.auth);
   useEffect(() => {
      fetchSongs();
   }, []);
   const fetchSongs = async () => {
      // setHasError( false );
      setIsLoading(true);
      try {
         const response = await axiosInstanceAuth.post(
            endPoints?.fetch_data_favorites,
            {
               post: songType,
               page: currentPage,
               single_page: "favorites",
               categories: filterCategories,
               per_page: perPage,
               user: user?.id,
               search,
               page_name: single_page,
            }
         );
         const records = response?.data?.records;
         setSongs(records);
         //   if( typeof result.data.count === "number" ) setCurrentCount( result.data.count );

         //   if( Array.isArray( records ) )  {
         //      if( currentPage === 1 )  {

         //         setSongs( records );
         //      } else if( currentPage > 1 )  {
         //         setSongs( state => [...state, ...records] );
         //      }
         //   } else {
         //      setSongs([]);
         //   }

         setIsLoading(false);
         // console.log( records );
      } catch (e) {
         console.error("unable to fetch songs!!!");
         setHasError(true);
         setIsLoading(false);
      }
   };
   return (
      <>
         <DashboardComponent2>
            {isLoading ? (
               <CircularProgress color="warning" size={40} />
            ) : songs?.length > 0 ? (
               <div className="flex min-h-screen gap-6 mb-20 text-white bg-black/50 md:p-5 !bg-[url('/static/images/Website-Background.png')] !h-full">
                  <Filter className=" md:w-1/6 md:sticky md:top-0" />
                  <div className="md:w-5/6">
                     <SongItem key={songs.id} {...songs} />
                  </div>
               </div>
            ) : (
               <div>Songs Not Found</div>
            )}
         </DashboardComponent2>
      </>
   );
};

export default FavoritesComponent2;
