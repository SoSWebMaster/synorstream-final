import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./HorizontalScroll.css";
import { Button, CircularProgress } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { SongInterface3 } from "../song/songTypes";
import MusicSectionContent2 from "./musicSectionContent2";
const MusicSection2 = () => {
   const [songs, setSongs] = useState<SongInterface3[]>([]);
   useEffect(() => {
      fetchSongs();
   }, []);
   const fetchSongs = async () => {
      try {
         const response = await axiosInstance.get(endPoints?.fetch_latest_songs);

         const records = response?.data;
         if (records) {
            setSongs(records);
         }
      } catch (e) {
         console.error(e,"unable to fetch songs!!!");
      }
   };

   return (
      <div className="my-10 scroll-container">
         <Button className="!ml-16 !mb-3  !text-white">New Releases</Button>
         <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {songs?.length>0 ?  songs?.map((song, id) => (
               <MusicSectionContent2 thumb={song?.thu} artist_name={song?.artis_name} audio={song?.audio_mp3} name={song?.name} id={song?.id} index={id}/>
            )) : <CircularProgress color="warning" size={40}   />}
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
        className="relative !bg-[#1F1F22]   !w-[10px] !h-[40px] top-44 "
        disableRipple={true}
     >
        <KeyboardDoubleArrowRightIcon className="!text-white " />
     </Button>
  );
};


export default MusicSection2;
