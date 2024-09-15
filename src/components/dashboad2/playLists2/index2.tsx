import Search from "../../filter/Search";
import PlayListContent2 from "./playListContent2";
const text1 = "Playlists";
import DashboardComponent2 from "..";
const PlayListComponent2 = () => {
   return (
      <>
         <DashboardComponent2>
            <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
               <div className="px-16 py-12 text-white">
                  <h1 className="text-[48px] font-medium">{text1}</h1>
                  <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                     <p className="text-[20px] text-justify">
                     Create the right playlist to set your mood.
                     </p>
                  </div>
               </div>
                  <>
                     <Search className="border  !border-custom-gradient-start my-10" />
                     <PlayListContent2 />
                  </>
            </div>
         </DashboardComponent2>
      </>
   );
};

export default PlayListComponent2;
