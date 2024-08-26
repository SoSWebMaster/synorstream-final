import { Button } from "@mui/material";
import Google from "/static/images/google 1.png";
import Facebook from "/static/images/facebook 1.png";
import SignUpTextFieldsComponent from "./textFields";
import { endPoints } from "../../services/constants/endPoint";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
// import TextFieldsComponent from "./textFields";

const SignUpContent = () => {
   const selectProvider = async (provider:any) => {
      try {
         const response = await axiosInstance.get(`${endPoints.oauth_provider}/${provider}`);
         if (response.status === 200) {
            const url = response.data.redirectUrl; 
            if (url) {
               window.open(url, '_blank');
             } else {
               throw new Error('URL not found in response');
             }
         }
      } catch (error) {
         console.error('Error selecting plan:', error);
      }
   };
   return (
      <>
         <div className="mt-5 ">
            <h1 className=" text-[26px] font-bold flex justify-center">Get Started With MAKER</h1>
            <p className=" text-[18px] text-[#7E7E7E] font-normal flex justify-center">Getting started is easy</p>

            <div className="flex justify-center mt-10">
               <Button className="w-[126px] !bg-white !text-black text-[12px] !mr-4 h-[43px]"
               onClick={() => selectProvider('google')} // Add onClick handler to call selectPlan with plan_id
               >
                  <span className="pr-1">
                     <img src={Google} />
                  </span>
                  Google
               </Button>
               <Button className="w-[126px] !bg-white !text-black text-[12px] h-[43px]"
               onClick={() => selectProvider('facebook')} // Add onClick handler to call selectPlan with plan_id
               >
                  <span className="pr-1">
                     <img src={Facebook} />
                  </span>
                  Facebook
               </Button>
            </div>
            <div className="flex justify-center mt-5">
               <div className="flex ">
                  <p className="relative text-white border-white bottom-2 right-2">
                  
                     ________________
                  </p>
                  <p>Or continue with</p>
                  <p className="relative text-white border-white bottom-2 left-2">
                 
                     ________________
                  </p>
               </div>
            </div>
            <div className="items-center ">
                <SignUpTextFieldsComponent />
            </div>
              
         </div>
      </>
   );
};

export default SignUpContent;
