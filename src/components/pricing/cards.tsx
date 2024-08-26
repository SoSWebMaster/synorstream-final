// @ts-nocheck
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SuitCase from '/static/images/suitcase.png'
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple"; 
import { endPoints } from "../../services/constants/endPoint";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { updatePlainAnnualPrice, updatePlainId, updatePlainMonthlyPrice } from "../../store/music-store";
import { Box, Button, ButtonGroup, Modal } from "@mui/material";

interface PlanDetailsProps {
   id: number;
   plan_name: string;
   mailchimp_tag: string;
   sub_heading: string;
   feature_heading: string;
   features: [];
   stripe_pid: string;
   month_price: number;
   month_price_skey: string;
   year_price: number;
   year_price_skey: string;
   free_months: number;
   free_months_text: string;
   trial_period: number;
   sort_order: number;
   is_active: number;
 }
const PricingCards = () => {
   
const style = {
   position: "absolute" as "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 800,
   bgcolor: "#2D2D2D",
   border: "1px solid #000",
   boxShadow: 24,
   borderRadius: 4,
   pt: 2,
   px: 4,
   pb: 3,
};
   const [pricingData, setPricingData] = useState<PlanDetailsProps[]>();
   const [m_price,setM_Price]=useState()
   const [y_price,setY_Price]=useState()
   const [switcher, setSwitcher] = useState<string>("btn1");
   const [isOpen,setIsOpen]=useState(false)
   const navigate = useNavigate();
   const dispatch=useAppDispatch();
   useEffect(() => {
      // Function to fetch pricing data from the API
      fetchPricingData();
    }, []);

   const List = {
      streamer: [
         "Unlimited streaming",
         "Create playlists & favorite tracks",
         "Qualified for promotions and giveaways",
         "10% off custom music requests",
      ],
      Creator:['Unlock SFX library','Unlimited downloads of music and SFX','Personal-Use license for unlimited personal projects','20% off custom music requests'],
      Freelancer:['MP3 and WAV downloads','Ability to download stems','Commercial-Use license for client work and broadcast','25% off custom music requests'],
      Business:['Dedicated customer service representative and contact information','Access to exclusive, unreleased tracks','Playlists tailored to your requests/briefs','Custom music requests and custom SFX/foley/sound design services']
   };

   const fetchPricingData = async () => {
      try {
        const response = await axiosInstance.get(endPoints.pricing);
        if(response?.data){
         const data = response?.data.data;
         setPricingData(data);
        }
      } catch (error) {

      }
    };

    const selectPlan = async (planId:number,m_price:number,y_price:number) => {
      console.log(planId,"planId")
      dispatch(updatePlainId(planId));
      dispatch(updatePlainMonthlyPrice(m_price))
      dispatch(updatePlainAnnualPrice(null))
      setM_Price(m_price);
      setY_Price(y_price);
      setIsOpen(true);
      // navigate('/signup')
      // try {
      //    const response = await axiosInstance.post(endPoints.select_plan, { plan_id: planId });
      //    if (response.status === 200) {
      //       navigate('/checkout');
      //    }
      // } catch (error) {
      //    console.error('Error selecting plan:', error);
      // }
   };

    const stripHtmlTags = (htmlString: string) => {
      const div = document.createElement('div');
      div.innerHTML = htmlString;
      return div.textContent || div.innerText || '';
    };
  

    if (!pricingData) {
      return <div>Loading...</div>;
    }
    const handleClose=()=>{
      setIsOpen(false);
    }
    const handleSwitch = (type: string,monthly_price:number | null=null, annual_price:number | null=null) => {
      setSwitcher(type);
      if(monthly_price){
        dispatch(updatePlainMonthlyPrice(monthly_price))
        dispatch(updatePlainAnnualPrice(null))
      }
      else{
         dispatch(updatePlainAnnualPrice(annual_price))
         dispatch(updatePlainMonthlyPrice(null))
      }
   };

   return (
      <>
         <div className="relative flex justify-between bottom-32">

         { pricingData.length > 0 &&
         pricingData?.map((item, index) => (
            <div className=" group w-[340px] h-auto bg-black py-8 px-6 rounded-2xl hover:!bg-background-gradient hover:!scale-110 transition-transform duration-500 mr-3" key={`${index}+ ${item}`}>
               <p className="text-[20px] font-medium">{item?.plan_name}</p>
               <p className="text-[36px] font-bold flex items-center">
                  {"$"+item?.month_price}
                  <span className="text-[16px] text-[#848199] ml-1">
                     / month
                  </span>
               </p>
               <p className="text-[#848199] text-[12px] pt-1 !h-10">
                  {item?.sub_heading}
               </p>
               <div className="flex justify-center mt-3">
                  <p className="relative bottom-1">__________</p>
                  <p className="mx-3 text-center text-[#848199]">or</p>
                  <p className="relative bottom-1">__________</p>
               </div>
               <p className="text-[12px] font-semibold text-center mt-1">
                  {"$"+item?.year_price + "/year (one free month)"}
               </p>
               <div className="flex justify-center ">
                  <p className="relative bottom-1">__________</p>
                  <p className="mx-3 text-center text-[#848199]">or</p>
                  <p className="relative bottom-1">__________</p>
               </div>
               <p className="text-[16px] font-normal  mt-10">
                  This Plan Includes
               </p>
               {item?.features?.map((item, index) => (
                  <div
                     className="flex items-center "
                     key={`${index} + ${item}`}
                  >
                     <div className="w-5 h-5 bg-[#282828] group-hover:!bg-[#4E3D32] rounded-full flex items-center justify-center p-2 mt-3">
                        <FontAwesomeIcon
                           icon={faCheck}
                           className="cursor-pointer text-[#FB8A2E] w-3 "
                        />
                     </div>
                     <p className="text-[#A8A8A8] text-[10px] ml-5 mt-3">
                        {stripHtmlTags(item)}
                     </p>
                  </div>
               ))}
               <button className="w-full h-[54px] !bg-[#0714BD] group-hover:!bg-[#FB8A2E]   text-white rounded-lg mt-5"
               onClick={() => selectPlan(item.id,item?.month_price,item?.year_price)} // Add onClick handler to call selectPlan with plan_id
               >
                  {item?.mailchimp_tag}
               </button>
            </div>
         ))}
            {/* Fourth Card */}

            <div className=" group w-[340px] h-auto bg-black py-8 px-6 rounded-2xl hover:!bg-background-gradient hover:!scale-110 transition-transform duration-500">
               <p className="text-[20px] font-medium">Business/Enterprise</p>
               <p className="text-[36px] font-bold flex items-center">
                  <img src={SuitCase} className="my-5"/>
               </p>
               <p className="text-[#848199] text-[12px]">
               Your business needs the best audio for ads, television, branding, and more. Let us do the work.
               </p>
          
               <p className="text-[16px] font-normal  mt-12">
                  This Plan Includes
               </p>
               {List?.Business?.map((item, index) => (
                  <div
                     className="flex items-center "
                     key={`${index} + ${item}`}
                  >
                     <div className="w-5 h-5 bg-[#282828] group-hover:!bg-[#4E3D32] rounded-full flex items-center justify-center p-2 mt-3">
                        <FontAwesomeIcon
                           icon={faCheck}
                           className="cursor-pointer text-[#FB8A2E] w-3 "
                        />
                     </div>
                     <p className="text-[#A8A8A8] text-[10px] ml-5 mt-3">
                        {item}
                     </p>
                  </div>
               ))}
               <button className="w-full h-[54px] !bg-[#0714BD] group-hover:!bg-[#FB8A2E]   text-white rounded-lg mt-5">
                  Free Trial
               </button>
            </div>
            {isOpen && (
               <Modal
               open={isOpen}
               onClose={handleClose}
           >
               <Box sx={style}>
                   <button
                       className="flex items-center justify-end w-full text-white"
                       onClick={handleClose}
                   >
                       <FontAwesomeIcon icon={faXmark} className="text-[25px]" />
                   </button>

                   <ButtonGroup className="!h-16 w-full  ">
                  <Button
                     onClick={() => handleSwitch("btn1",m_price,null)}
                     sx={{
                        backgroundColor:
                           switcher === "btn1" ? "!#FB8A2E !important"  : "black !important",
                        border: "1px solid #FB8A2E !important",
                     }}
                     className={`hover: ${
                        switcher === "btn1" ? "!bg-[#FB8A2E] !text-white " : "!bg-none !text-white " 
                     }`}
                  >
                     ${m_price}/Month
                  </Button>
                  <Button
                     onClick={() => handleSwitch("btn2",null,y_price)}
                     sx={{
                        backgroundColor:
                           switcher === "btn2" ? "#FB8A2E" : "black !important ",
                        border: "1px solid #FB8A2E !important",
                     }}
                     className={`hover: ${
                        switcher === "btn2" ? "!bg-[#FB8A2E] !text-white " : "!bg-none !text-white "
                     }`}
                  >
                     ${y_price}/Yearly(1 Month Free)
                  </Button>
               </ButtonGroup>
               <Button
                     onClick={() => navigate('/signup')}
                     className="!bg-[#FB8A2E] !text-white !mt-10"
                  >
                     Continue
                  </Button>
               </Box>
           </Modal>
            )}
         </div>
      </>
   );
};

export default PricingCards;
