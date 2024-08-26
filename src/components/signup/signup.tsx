import { Link } from "react-router-dom";
import SideImage from "/static/images/signup-sideImage.png";
import Logo from "/static/images/SoS_Logo.png";
import microscope from "/static/images/microscope.png";
import Light from "/static/images/Group.svg";
import SignUpContent from "./signupContent";
import bgImage from '/static/images/Website-Background.png'
const SignUpComponent = () => {
   return (
      <>
         <div className="flex justify-end  !h-[100vh]" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="absolute left-0 top-0 2xl:w-[32%] xl:w-[45%] lg:w-[45%] !h-[100vh] ">
               <img src={SideImage} alt="sideImage" className=" !h-[100vh]" />
               <div className="absolute pt-1 pl-8 top-7 left-5 rounded-3xl">
                  <img src={Logo} className="w-[300px] h-[50px]" />
               </div>

               <div className="bg-[#5A5A5A] p-2 flex items-center rounded-full   absolute bottom-80 right-[-100px] w-[246px]">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50">
                     <img src={Light} />
                  </div>
                  <p className="ml-2">Free Trial.</p>
               </div>

               <div className="bg-[#0714BD] p-2 flex items-center rounded-full   absolute bottom-64 right-[-100px] w-[246px]">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50">
                     <img src={Light} />
                  </div>
                  <p className="ml-2">Royal  Music.</p>
               </div>

               <div className="bg-black/70 rounded-2xl  absolute bottom-20 right-[-100px] w-[246px]  p-5">
                  <div className="bg-black w-[50px] h-[50px] rounded-2xl p-3">
                     <img src={microscope} className="" />
                  </div>
                  <p className="w-40 mt-4">
                     Best Music from across the internet.
                  </p>
               </div>
            </div>
            <div className="absolute w-[60%] ">
                
               <div className="flex items-center justify-end px-20 py-8 text-center">
                  <p className="text-[14px] mt-5">
                     Don’t have an account?
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
