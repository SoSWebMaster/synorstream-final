import Search from "../../filter/Search";
import PlayListContent from "./playlistContent";
const text1='Playlists'
import { useAppSelector } from "../../../store";
import SinglePlayList from "./singlePlayList";
const PlaylistComponent=()=>{
    const {playListFilter}=useAppSelector(state=>state.music)
    return (
        <>
            <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
                <div className="px-16 py-12 text-white">
                    <h1 className="text-[48px] font-medium">{text1}</h1>
                    <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                        <p className="text-[20px] text-justify">
                        Create the right playlist to set your mood.
                 
                        </p>
                    </div>
                </div>

                {playListFilter==='' ? (
                    <>
                    <Search className="border  !border-custom-gradient-start my-10"/>

                    <PlayListContent/>
                    </>
                ):<div className="mt-12"> <SinglePlayList/></div>}
                
            
            </div>
        </>
    )
}

export default PlaylistComponent;