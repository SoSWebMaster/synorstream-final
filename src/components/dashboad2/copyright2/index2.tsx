import AccordionComponent2 from "./accordianComponent2";
import DashboardComponent2 from "..";
const CopyrightComponent2 = () => {
   return (
      <>
         <DashboardComponent2>
            <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
               <div className="px-16 py-12 text-white">
                  <h1 className="text-[48px] font-medium ">
                     Copyright Clearance
                  </h1>
                  <div className="w-3/4 px-4 py-2 mt-2 rounded-lg bg-black/50">
                  <p className="text-[20px] mt-2">
                     Unlock the beats you love with peace of mind! Get your
                     copyright clearance right here <br /> and keep the music
                     flowing. Navigate with ease and ensure your tracks are
                     protected.
                     <br /> Join the harmony of hassle-free music licensing
                     today!
                  </p>
                  </div>
               </div>

               <AccordionComponent2 />
            </div>
         </DashboardComponent2>
      </>
   );
};

export default CopyrightComponent2;
