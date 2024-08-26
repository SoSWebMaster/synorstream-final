// @ts-nocheck
import {
   Box,
   FormControl,
   InputLabel,
   MenuItem,
   Select,
} from "@mui/material";
import Songs from "../../song/Songs";
import { useAppSelector } from "../../../store";
import { useAppDispatch } from "../../../store";
import { updatePlayListFilter } from "../../../store/music-store";
const SinglePlayList = () => {
   const { playLists } = useAppSelector((state) => state.music);
//    const [active, isActive] = useState(playListFilter);
   const dispatch = useAppDispatch();
   const handleClick = (item: any) => {
    //   isActive(item?.name);
      dispatch(updatePlayListFilter(item?.name));
   };
   return (
      <>
         <div className="">
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
            <Box sx={{width:"100%"}} className=" !flex !justify-end !mb-10">
               <FormControl className="!w-1/2 !flex !justify-end">
                  <InputLabel
                   sx={{
                    color: "white",
                    "&.Mui-focused": {
                        color: "white",  // Change label color to white when focused
                      },
                 }}>Playlists</InputLabel>
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
                        '& .MuiSvgIcon-root': {
                            color: 'white',  // Change chevron color to white
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
               <Songs />
            </div>
         </div>
      </>
   );
};

export default SinglePlayList;
