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

const Tracks = [imag1, imag2, imag3, imag4];

interface PlayListCardProps {
   onSelect?: (playlist: PlayListTypes) => void;
   onClose?: () => void;
   openState?: boolean;
}

const PlayListCard: React.FC<PlayListCardProps> = ({
   openState,
   onSelect,
   onClose,
}) => {
   const dispatch = useAppDispatch();
   const { search } = useAppSelector((state) => state.music);
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

   return (
      <div className={`flex flex-wrap  mt-5 mb-6  gap-x-5 gap-y-5  ${isCircularLoading ? '' :'max-h-80 overflow-y-auto'} `}>
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
                     if (onSelect) {
                        onSelect(item); // Pass the item with all needed properties
                     }
                     if (onClose) {
                        onClose(); // Close the modal
                     }
                  }}
               >
                  {/* <img src={Tracks[index % Tracks?.length]} /> */}
                  <div className=" border-2 flex items-center justify-center border-gray-300 rounded-lg  text-gray-300 w-[100px] h-[100px] ">
                     <p className="text-center" >{item?.name}</p>
                  </div>

                  <div className="p-3">
                     <p className="text-[20px] font-semibold text-center">{item?.name}</p>
                     <p className="text-[#9898A6] text-[12px] text-center">
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

export default PlayListCard;
