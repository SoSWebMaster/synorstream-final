// @ts-nocheck
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tick from '/static/images/tick.png'
import MasterCard from '/static/images/mastercard.png'
import Amex from '/static/images/amex.png'
import Visa from '/static/images/visa.png'
import { Divider } from "@mui/material";

const PlanDetails = ({features, plan_name}) => {


  // console.log(parsedData?.length,"features")
  const stripHtmlTags = (htmlString: string) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString
    return div.textContent || div.innerText || '' 
  };
  
   return (
      <>
         <div className="m-12 ">
            <p className="text-[22px] mb-6">
               For the creative that lives to go live.
            </p>
            <div className=" border border-[#FB8A2E] border-b-[30px] w-full !z-50 rounded-xl h-80">
               <div className=" h-[300px] !z-0 rounded-xl p-6">
                  <p className="text-[24px]  font-semibold">{plan_name} Details</p>
                  {features?.map((item:any, index:any) => (
                  <div className="flex items-center mt-3" key={`${index}+${item}`}>
                     <FontAwesomeIcon
                        icon={faCheck}
                        className="cursor-pointer text-[#FB8A2E]  h-8 "
                     />
                     <p className="ml-2 !text-[#BBBBBB]"> {stripHtmlTags(item)}</p>
                  </div>
                  ))}
               </div>
            </div>
            <div>
               <div className="flex mt-10 ">
                  <img src={Tick} />
                  <div  className="ml-6">
                     <p className="font-bold">Acceptance Payment Method</p>
                     <div className="flex items-center mt-3">
                        <img src={MasterCard}/> 
                        <img src={Amex} className="h-6 ml-3"/>
                        <img src={Visa} className="h-6 ml-3"/>
                     </div>
                  </div>
              
               </div>
               <Divider className="!mt-4  !bg-[#FB8A2E]"/>

               <div className="flex mt-6 ">
                  <img src={Tick} />
                  <div  className="ml-6">
                     <p className="font-bold">7 day free trial</p>
                     <div className="flex items-center mt-3">
                     <p className="font-bold text-[#BBBBBB]">Try Sync or Stream Risk Free</p>
                     </div>
                  </div>
              
               </div>
               <Divider className="!mt-4  !bg-[#FB8A2E]"/>

               <div className="flex mt-6 ">
                  <img src={Tick} />
                  <div  className="ml-6">
                     <p className="font-bold">Secure payment</p>
                     <div className="flex items-center mt-3">
                     <p className="font-bold text-[#BBBBBB]">Transactions are encrypted and secured</p>
                     </div>
                  </div>
              
               </div>
            </div>
         </div>
      </>

   );
};

export default PlanDetails;
