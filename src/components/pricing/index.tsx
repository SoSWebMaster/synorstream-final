import PricingCards from "./cards";

const text1 = "PICK A PLAN THAT MEETS YOUR NEEDS";
const text2 =
   "There's more than one type of creative. Whether you need to sync your audio to picture, or stream it live, we've got you covered.";
const Pricing = () => {
   return (
      <>
         <div className="relative">
            <div className="bg-[url('/static/images/Vector.png')] h-[460px] w-full bg-cover bg-center rounded-lg my-5 flex flex-col items-center justify-center">
               <h1 className="text-[48px] font-normal">{text1}</h1>
               <p className="2xl:w-[55%] xl:w-[60%] lg:w-[65%] text-center mt-5 text-[22px]">{text2}</p>
            </div>
            <div >
               <PricingCards />
            </div>
         </div>
      </>
   );
};

export default Pricing;
