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
                    <h1 className="text-[48px] font-medium ">{text1}</h1>
                    <p className="text-[20px] mt-2">Discover your next favorite jam with our curated playlists! Dive into handpicked tracks<br/> that suit every mood and moment. Explore, save, and share your personalized playlists <br/> effortlessly. Let the music journey begin and elevate your vibe! </p>
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