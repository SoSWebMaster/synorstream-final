import TableComponent2 from "./tableComponent2";
import DashboardComponent2 from "..";
const DownloadHistoryComponent = () => {
   return (
      <>
         <DashboardComponent2>
            <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
               <div className="px-16 py-12 text-white">
                  <h1 className="text-[48px] font-medium ">Download History</h1>
                  <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                     <p className="text-[20px] mt-2">
                        Explore your music download history, a curated
                        collection of your favorite tunes and memorable
                        discoveries. Each track tells a story, capturing moments
                        of joy, excitement, and reflection. Relive your
                        musical journey and let the rhythms and melodies take
                        you back.{" "}
                     </p>
                  </div>
               </div>

               <TableComponent2 />
            </div>
         </DashboardComponent2>
      </>
   );
};

export default DownloadHistoryComponent;
