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
                        Enter your account and video links here so we can be
                        sure to clear any copyright issues on your videos. If
                        you experience any claims, contact us and we’ll get it
                        sorted for you as soon as possible.
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
