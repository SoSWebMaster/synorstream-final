import { Divider } from "@mui/material";
import { useAppDispatch } from "../../store";
import { updateSideBar } from "../../store/music-store";
import Menu from '/static/images/Menu.png'
import Menu1 from '/static/images/Menu (1).png'
import Menu2 from '/static/images/Menu (2).png'
import Menu3 from '/static/images/Menu (3).png'
import downloadHistory from '/static/images/ph_download-fill.png'
import { useLocation, useNavigate } from "react-router-dom";
const Content = [
   {
      name: "Browse",
      search:'/browse',
      icon:Menu
   },
   // {
   //    name: "New Releases",
   //    search:'newrelease',
   //    icon:Menu2
   // },
   {
      name: "Playlist",
      search:'/playlist',
      icon:Menu2
   },
   {
      name: "Favorites",
      search:'/favourites',
      icon:Menu1
   },
   {
      name: "Copyright Clearence",
      search:'/copyright',
      icon:Menu3
   },
   {
    name: "Download History",
    search:'/downlaod-history',
    icon:downloadHistory
 },



];
const SideBarComponent2 = () => {
   const location = useLocation();
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const currentPath = location.pathname;
   return (
      <>
         <div className="px-5 py-10">
            <p className="text-[24px] font-semibold">Menu</p>
            <Divider className="bg-[#555555] !my-5" />
            <div className="">
                {Content?.map((content,index)=>(
                      <button
                      className={`mb-3 cursor-pointer w-full h-[54px] ${currentPath ===content?.search ? 'bg-custom-gradient transition ease-in-out  duration-700 ':'bg-none'}  bg-custom-gradient rounded-xl flex items-center px-5`}
                      onClick={() => {
                        dispatch(updateSideBar(content?.search))
                        navigate(content?.search)
                      }}
                      key={`${index} + ${content?.name}`}
                   >
                    <span className="mr-2"><img src={content?.icon}/></span>   {content?.name}
                   </button>
                ))}
             
           
            </div>
         </div>
      </>
   );
};

export default SideBarComponent2;
