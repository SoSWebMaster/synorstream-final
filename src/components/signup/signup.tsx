import { Link } from "react-router-dom";
import SideImage from "/static/images/signup-sideImage.png";
import Logo from "/static/images/SoS_Logo.png";
import SignUpContent from "./signupContent";
import bgImage from '/static/images/Website-Background.png'
const SignUpComponent = () => {
   return (
      <>
         <div className="flex    !h-[100vh]" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className=" flex-1 !h-[100vh] ">
               <img src={SideImage} alt="sideImage" className=" !h-[100vh]" />
               <div className="absolute pt-1 pl-8 top-7 left-5 rounded-3xl">
                  <img src={Logo} className="w-[350px] h-[50px]" />
               </div>

            </div>
            <div className="flex-1">
                
               <div className="flex items-center justify-end px-20 py-8 text-center">
                  <p className="text-[14px] mt-5">
                     Have an account?
                     <span className="text-[14px] font-bold !pl-1">
                        <Link to="/login"> Sign In!</Link>
                     </span>
                  </p>
               </div>
               <div className="">
                  <SignUpContent />
               </div>
            </div>
         </div>
      </>
   );
};

export default SignUpComponent;
