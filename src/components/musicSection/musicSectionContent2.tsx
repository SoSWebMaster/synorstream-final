// @ts-nocheck
import React, { useEffect, useState } from "react";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./HorizontalScroll.css";
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import useSound from "use-sound";
import { updateCurrentSongIdForPagination } from "../../store/music-store";
import { useAppDispatch,useAppSelector } from "../../store";
import useAxios from "../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../services/constants/endPoint";
import { toast } from "react-toastify";
interface MusicSectionContentProps {
    thumb: any;
    artist_name:string;
    name:string;
    index: number;
    id:number | string,
    audio?:any
  }
const MusicSectionContent2: React.FC<MusicSectionContentProps> =({thumb,artist_name, name,audio,id,index})=>{
   const { currentSongIdForPagination,single_page } = useAppSelector((state) => state.music);
   const [isActive, setIsActive] = useState(false);
   const [status, setStatus] = useState('');
   const [play , {stop}]=useSound(audio);
   const axiosInstanceAuth=useAxios();
   const dispatch=useAppDispatch(); 
    useEffect(()=>{
         if(currentSongIdForPagination===id){
            setIsActive(true)
            play()
         }
         else if(currentSongIdForPagination!==id){
            setIsActive(false)
            stop();
         }
   },[currentSongIdForPagination])
   const [isLiked, setIsLiked] = useState(false);
 
   const handleLike = async(id:number) => {
      try{
         const response= await axiosInstanceAuth?.post(endPoints?.add_to_fav2, {
            id: id,
            type: 'favor',
         });
         if(response?.data?.res){
            setStatus(response?.data?.message)
            toast.success(`${response?.data?.message}`);
         }
      }catch(e){
         toast.error('Something went wrong');
      }

   };
    return (
        <>

               <div key={`${index} + ${id}`} className="flex justify-between ">
                  <div
                     className={`w-[255px] h-[365px] bg-black bg-contain bg-no-repeat     rounded-xl mr-5 relative`}
                 
                  >
                     <div className="p-3">
                        <img src={thumb}/>
                     </div>
                   
                    <div className="!absolute  right-3  bottom-20 z-50">
                        <div className="!flex !items-center !justify-center h-12 rounded-full w-12 bg-white ">
                           { !isActive && (
                              <PlayIcon
                                 className="text-black cursor-pointer w-7 h-7"
                                 onClick={() => {
                                    dispatch(updateCurrentSongIdForPagination(+id))
                                    setIsActive(true);
                                    play()
                                    
                                 }}
                              />
                           )}
                           {isActive && (
                              <PauseIcon
                                 className="text-black cursor-pointer w-7 h-7"
                                 onClick={() => {
                                    stop();
                                    setIsActive(false);
                                 }}
                              />
                           )}
                        </div>
                      
                    </div>
                     <div className="w-full px-5 mt-6">
                        <p className="text-[#FB8A2E] text-[10px]">
                           New Track for you
                        </p>
                        <p className="font-bold text-[20px]">{artist_name?.replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')}</p>
                        <p className="text-[12px] text-[#9898A6] font-semibold">
                           {name}
                           
                        </p>
                     </div>
                     {single_page==='newrelease' && (
                         <button onClick={()=>handleLike(+id)} className="flex justify-end w-full pr-4">
                         {status==="Added" ? '❤️' : '🤍 '}
                       </button>
                     )}
                  </div>
               </div>
        </>
    )
}




export default MusicSectionContent2;