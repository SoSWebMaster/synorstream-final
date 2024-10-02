import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./HorizontalScroll.css";
import { Button } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { useAppSelector } from "../../store";
import { SongInterface } from "../song/songTypes";
import MusicSectionContent from "./musicSectionContent";
import CircularProgress from "@mui/material/CircularProgress";

const MusicSection = () => {
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const { songType, filterCategories, search } = useAppSelector(
      (state: any) => state.music
   );
   useEffect(() => {
      fetchSongs();
   }, []);
   const fetchSongs = async () => {
      try {
         const response = await axiosInstance.post(
            endPoints?.fetch_unique_music_json,
            {
               post: songType,
               page: 1,
               single_page: "staging2.syncorstream.com",
               categories: filterCategories,
               per_page: 20,
               user: 155,
               search,
            }
         );

         const result = response;
         const records = result?.data?.records;
         if (records) {
            setSongs(records);
         }
      } catch (e) {
         console.error("unable to fetch songs!!!");
      }
   };

   return (
      <div className=" scroll-container">
         <Button className="!ml-16 !text-white">New Collection</Button>
         <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {songs?.length > 0 ? (
               songs?.map((song, id) => (
                  <MusicSectionContent
                     key={id}
                     thumb={song?.thumb}
                     artist_name={song?.artis_name}
                     audio={song?.audio}
                     name={song?.name}
                     id={song?.id}
                     index={id}
                  />
               ))
            ) : (
               <div className="text-center">
                  {" "}
                  <CircularProgress color="warning" size={40} />
               </div>
            )}
         </ScrollMenu>
      </div>
   );
};
const LeftArrow = () => {
   const visibility = React.useContext(VisibilityContext);
   return (
      <Button
         onClick={() => visibility.scrollPrev()}
         className="relative !bg-[#1F1F22] rounded-full !w-[5px] !h-[40px] top-44"
         disableRipple={true}
      >
         <KeyboardDoubleArrowLeftIcon className="!text-white " />
      </Button>
   );
};
const RightArrow = () => {
   const visibility = React.useContext(VisibilityContext);
   return (
      <Button
         onClick={() => visibility.scrollNext()}
         className="relative !bg-[#1F1F22] rounded-full !w-[10px] !h-[40px] top-44 "
         disableRipple={true}
      >
         <KeyboardDoubleArrowRightIcon className="!text-white " />
      </Button>
   );
};

export default MusicSection;
