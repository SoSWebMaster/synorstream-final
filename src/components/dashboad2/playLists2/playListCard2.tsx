// @ts-nocheck
import React, { useEffect, useState } from "react";
import imag1 from "/static/images/Rectangle 44866.png";
import imag2 from "/static/images/Rectangle 44866 (1).png";
import imag3 from "/static/images/Rectangle 44866 (2).png";
import imag4 from "/static/images/Rectangle 44866 (3).png";
import {
   updatePageNameId,
   updatePlayListFilter,
   updatePlayLists,
} from "../../../store/music-store";
import { useAppDispatch } from "../../../store";
import { toast } from "react-toastify";
import useAxios from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import { useAppSelector } from "../../../store";
import { PlayListTypes } from "../../../store/types"; // Import the type
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Tracks = [imag1, imag2, imag3, imag4];

interface PlayListCardProps {
   onSelect?: (playlist: PlayListTypes) => void;
   onClose?: () => void;
   openState?: boolean;
}

const PlayListCard2: React.FC<PlayListCardProps> = ({
   openState,
   onSelect,
   onClose,
}) => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const { search, playLists } = useAppSelector((state) => state.music);
   const axiosInstance = useAxios();
   const [isCircularLoading, setIsCircularLoading] = useState(false);
   const [records, setRecords] = useState<PlayListTypes[]>();
   useEffect(() => {
      fetchPlayList();
   }, [search, openState]);

   const fetchPlayList = async () => {
      setIsCircularLoading(true);
      try {
         const response = await axiosInstance.post(endPoints?.fetch_playlist2, {
            search: search,
         });
         if (response?.data) {
            dispatch(updatePlayLists(response?.data));
            setRecords(response?.data);
            setIsCircularLoading(false);
         }
      } catch (err) {
         toast.error("Something wrong");
      }
   };

   console.log("playlists in redux", playLists);

   return (
      <div className="flex flex-wrap mx-5 gap-x-5 gap-y-5 bg-[url('/static/images/Website-Background.png')] !h-full">
         {isCircularLoading ? (
            <CircularProgress size={40} className="!text-[#FB8A2E]" />
         ) : records?.length > 0 ? (
            records?.map((item, index) => (
               <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                     dispatch(updatePlayListFilter(item?.name));
                     dispatch(updatePageNameId(item?.id));
                     navigate(`/playlist/${item?.id}`);
                     if (onSelect) {
                        onSelect(item); // Pass the item with all needed properties
                     }
                     if (onClose) {
                        onClose(); // Close the modal
                     }
                  }}
               >
                  <div className="flex justify-center items-center">
                     <div className=" border-2 flex items-center justify-center border-gray-300 rounded-lg  text-gray-300 w-[100px] h-[100px] ">
                        <p className="text-center">{item?.name}</p>
                     </div>
                  </div>

                  {/* <img src={Tracks[index % Tracks?.length]} /> */}
                  <div className="p-3">
                     <p className="text-[20px] text-center font-semibold">
                        {item?.name}
                     </p>
                     <p className="text-[#9898A6] text-center text-[12px]">
                        {item?.tcount} Track
                     </p>
                  </div>
               </div>
            ))
         ) : (
            <div>No Playlist Found...</div>
         )}
      </div>
   );
};

export default PlayListCard2;
