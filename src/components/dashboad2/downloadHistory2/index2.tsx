import TableComponent2 from "./tableComponent2";
import DashboardComponent2 from "..";
const DownloadHistoryComponent = () => {
   return (
      <>
      <DashboardComponent2>
      <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
            <div className="px-16 py-12 text-white">
               <h1 className="text-[48px] font-medium ">Download History</h1>
               <p className="text-[20px] mt-2">
                  Explore your music download history, a curated collection of
                  your favorite tunes and <br /> memorable discoveries. Each
                  track tells a story, capturing moments of joy, excitement,{" "}
                  <br /> and reflection. Relive your musical journey and let the
                  rhythms and melodies take you <br /> back.{" "}
               </p>
            </div>

            <TableComponent2 />
         </div>
      </DashboardComponent2>

      </>
   );
};

export default DownloadHistoryComponent;
