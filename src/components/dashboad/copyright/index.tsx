import AccordionComponent from "./accordionComponent";
const CopyrightComponent=()=>{
    return (
        <>
              <div className="bg-[url('/static/images/Vector.png')] h-[280px] w-full bg-cover bg-center rounded-lg  ">
            <div className="px-16 py-12 text-white">
               <h1 className="text-[48px] font-medium ">Copyright Clearance</h1>
               <p className="text-[20px] mt-2">
               Unlock the beats you love with peace of mind! Get your copyright clearance right here <br/> and keep the music flowing. Navigate with ease and ensure your tracks are protected.<br/> Join the harmony of hassle-free music licensing today!
               </p>
            </div>

            <AccordionComponent/>
         </div>
        </>
    )
}

export default CopyrightComponent;