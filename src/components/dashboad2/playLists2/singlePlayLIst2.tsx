// @ts-nocheck
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Songs from "../../song/Songs";
import { useAppSelector } from "../../../store";
import { useAppDispatch } from "../../../store";
import { updatePlayListFilter } from "../../../store/music-store";
import useAxios from "../../../services/axiosConfig/axiosConfig";
import { useEffect, useState } from "react";
import { SongInterface } from "../../song/songTypes";
import SongItem from "../../song/SongItem";
import axiosInstance from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import DashboardComponent2 from "..";
import { useParams } from "react-router-dom";
import Player from "../../player/Player";
const perPage=8;
const SinglePlayList2 = () => {
    const {id}=useParams();
   const { user } = useAppSelector((state) => state.auth);
   const { songType, filterCategories, search, single_page,playLists } = useAppSelector(
    (state) => state.music
 );


   //    const [active, isActive] = useState(playListFilter);
   const dispatch = useAppDispatch();
   const handleClick = (item: any) => {
      //   isActive(item?.name);
      dispatch(updatePlayListFilter(item?.name));
   };
   const axiosInstanceAuth = axiosInstance();
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [hasError, setHasError] = useState(false);
   const [fetchingSong, setFetchingSong]=useState(false);

   useEffect(() => {
      fetchSongs();
   }, []);
   const fetchSongs = async () => {
      // setHasError( false );
      setIsLoading(true);
      setFetchingSong(true)
      try {
         const response = await axiosInstanceAuth.post(endPoints?.fetch_data2, {
            post: songType,
            page: currentPage,
            single_page: "playlist",
            categories: filterCategories,
            per_page: perPage,
            user: user?.id,
            search,
            page_name: id,
         });
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
         setFetchingSong(false)
      } catch (e) {
         console.error("unable to fetch songs!!!",e);
         setHasError(true);
         setIsLoading(false);
         setFetchingSong(false)
      }
   };
   return (
      <>
         <DashboardComponent2>
         <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
               <div className="px-16 py-12 text-white">
                  <h1 className="text-[48px] font-medium">Playlists</h1>
                  <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                     <p className="text-[20px] text-justify">
                        Discover your next favorite jam with our curated
                        playlists! Dive into handpicked tracks
                        <br /> that suit every mood and moment. Explore, save,
                        and share your personalized playlists
                        <br /> effortlessly. Let the music journey begin and
                        elevate your vibe!
                     </p>
                  </div>
               </div>
               {/* <div className="w-1/6 mx-5 ">
                     <p className="font-medium">Currently On</p>
                     <Divider className="!bg-[#555555] !mt-5 "/>
                     <div className="flex flex-col items-center mt-8">
                         {playLists?.length>0 && (
                             playLists?.map((item,index)=>(
                                 <p className={`w-full h-[40px] ${active===item?.name ?'bg-[#FB8A2E]': 'bg-none' } cursor-pointer rounded-lg  mb-3 flex items-center justify-center`} key={`${index} + ${item?.name}`}  onClick={()=>handleClick(item) }>{item?.name}</p>
                             ))
                         )}
                     </div>
                 </div> */}
               <Box
                  sx={{ width: "100%" }}
                  className=" !flex !justify-end !my-10"
               >
                  <FormControl className="!w-1/2 !flex !justify-end">
                     <InputLabel
                        sx={{
                           color: "white",
                           "&.Mui-focused": {
                              color: "white", // Change label color to white when focused
                           },
                        }}
                     >
                        Playlists
                     </InputLabel>
                     <Select
                        sx={{
                           color: "white",
                           "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FB8A2E",
                           },
                           "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FB8A2E",
                           },
                           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#FB8A2E",
                           },
                           "& .MuiSvgIcon-root": {
                              color: "white", // Change chevron color to white
                           },
                        }}
                        label="PlayLists"
                     >
                        {playLists?.length > 0 &&
                           playLists?.map((item, index) => (
                              // <p className={`w-full h-[40px] ${active===item?.name ?'bg-[#FB8A2E]': 'bg-none' } cursor-pointer rounded-lg  mb-3 flex items-center justify-center`} key={`${index} + ${item?.name}`}  onClick={()=>handleClick(item) }>{item?.name}</p>
                              <MenuItem
                                 onClick={() => handleClick(item)}
                                 key={`${index} + ${item?.name}`}
                              >
                                 {item?.name}
                              </MenuItem>
                           ))}
                     </Select>
                  </FormControl>
               </Box>
               <div className="w-6/6">
                  {fetchingSong ? (
                               <CircularProgress
                               color="warning"
                               size={40}
                               className="ml-4"
                            />
                  ) : (
                     songs?.length > 0 ?  (
                        songs.map((song, index) => (
                           <SongItem key={song.id} {...song} />
                        ))
                     ): <div>No Songs Found..</div>
                  )}
            
               </div>
            </div>
            <Player/>
         </DashboardComponent2>
      </>
   );
};

export default SinglePlayList2;
