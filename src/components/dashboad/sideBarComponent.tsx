import { Divider } from "@mui/material";
import { updatePlayListFilter, updateSinglePage} from "../../store/music-store";
import { useAppDispatch,useAppSelector } from "../../store";
import { updateSideBar } from "../../store/music-store";
import Menu from '/static/images/Menu.png'
import Menu1 from '/static/images/Menu (1).png'
import Menu2 from '/static/images/Menu (2).png'
import Menu3 from '/static/images/Menu (3).png'
import downloadHistory from '/static/images/ph_download-fill.png'
const Content = [
   {
      name: "Browse",
      search:'browse',
      icon:Menu
   },
   // {
   //    name: "New Releases",
   //    search:'newrelease',
   //    icon:Menu2
   // },
   {
      name: "Playlist",
      search:'playlist',
      icon:Menu2
   },
   {
      name: "Favorites",
      search:'favorites',
      icon:Menu1
   },
   {
      name: "Copyright Clearence",
      search:'copyright',
      icon:Menu3
   },
   {
    name: "Download History",
    search:'download',
    icon:downloadHistory
 },



];
const SideBarComponent = () => {
   const dispatch = useAppDispatch();
   const { sideBar } = useAppSelector( state => state.music );
   return (
      <>
         <div className="px-5 py-10">
            <p className="text-[24px] font-semibold">Menu</p>
            <Divider className="bg-[#555555] !my-5" />
            <div className="">
                {Content?.map((content,index)=>(
                      <button
                      className={`mb-3 cursor-pointer w-full h-[54px] ${sideBar===content?.search ? 'bg-custom-gradient transition ease-in-out  duration-700 ':'bg-none'}  bg-custom-gradient rounded-xl flex items-center px-5`}
                      onClick={() => {dispatch(updateSideBar(content?.search))
                        dispatch(updatePlayListFilter(''))
                        if(content?.search==='playlist'){ 
                           dispatch(updateSinglePage(content?.search))
                        }
                        else if(content?.search==='favorites'){
                           dispatch(updateSinglePage(content?.search))
                        }
                        else if(content?.search==='newrelease'){
                           dispatch(updateSinglePage(content?.search))
                        }
                        else{
                           dispatch(updateSinglePage(''))
                        }
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

export default SideBarComponent;
