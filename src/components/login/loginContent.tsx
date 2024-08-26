import { Button } from "@mui/material";
import Google from "/static/images/google 1.png";
import Facebook from "/static/images/facebook 1.png";
import LoginTextFieldsComponent from "./textFields";
const LoginContent = () => {
   return (
      <>
         <div className="mt-5">
            <h1 className=" text-[38px] font-bold">Welcome Back</h1>
            <p className=" text-[18px] font-normal">Login into your account</p>

            <div className="mt-10">
               <Button className="w-[126px] !bg-white !text-black text-[12px] !mr-4 h-[43px]">
                  {" "}
                  <span className="pr-1">
                     <img src={Google} />
                  </span>{" "}
                  Google
               </Button>
               <Button className="w-[126px] !bg-white !text-black text-[12px] h-[43px]">
                  {" "}
                  <span className="pr-1">
                     <img src={Facebook} />
                  </span>{" "}
                  Facebook
               </Button>
            </div>
            <div className="flex justify-center mt-10">
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
            <div>
                <LoginTextFieldsComponent />
            </div>
              
         </div>
      </>
   );
};

export default LoginContent;
