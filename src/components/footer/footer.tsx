// @ts-nocheck
import CircleLogo from "/static/images/Circle_Button_NB.png";
import { Divider } from "@mui/material";
import { musicSFXLinks, productLinks, socialLinks, footerContent } from './footerContent'
import { useNavigate } from "react-router-dom";
// import ContactUs from "../dashboad/menus/contact/contact";
import { useState } from "react";

const FooterComponent = () => {
   const [openModal, setOpenModal] = useState(false);
   const navigate = useNavigate();
   const setCloseModalState = () => {
      setOpenModal(prev => !prev);
   }
   return (
      <>
         <footer>
            <div className=" h-[499px] flex items-center  bg-[url('/static/images/Website-Background.png')]">
               <div className="flex justify-between !w-full 2xl:px-60 xl:px-32 lg:px-10">
                  <div>
                     <img src={CircleLogo} className="w-[480px] h-[280px]" />
                  </div>
                  <div>
                     <h1 className="text-[18px] font-bold mb-5">MUSIC/SFX</h1>
                     {musicSFXLinks.map((item, index) => (
                        <p
                           key={index}
                           className="text-[16px] text-[#7A7A7A] mb-5 !cursor-pointer hover:text-[#FB8A2E] transition-transform duration-500"
                           onClick={() => navigate(item?.links)}
                        >
                           {item?.name}
                        </p>
                     ))}
                  </div>
                  <div>
                     <h1 className="text-[18px] font-bold mb-5">COMPANY</h1>
                     {productLinks.map((item, index) => (
                        <p
                           key={index}
                           className="text-[16px] text-[#7A7A7A] mb-5 !cursor-pointer hover:text-[#FB8A2E] transition-transform duration-500"
                           onClick={() => navigate(item?.links)}
                        >
                           {item?.name}
                        </p>
                     ))}
                  </div>
                  <div>
                     <h1 className="text-[18px] font-bold mb-5">GET SOCIAL</h1>
                     <p className="text-[16px] text-[#7A7A7A] mb-5" dangerouslySetInnerHTML={{ __html: footerContent }}>
                     </p>
                     <div className="flex ">
                        {socialLinks.map((link, index) => (
                           <a href={link?.url} key={index} target="_blank">
                              <img
                                 key={index}
                                 src={link.src}
                                 alt={link.alt}
                                 className="pr-3 cursor-pointer"

                              />
                           </a>

                        ))}
                     </div>
                  </div>
               </div>
            </div>
            <div className="!mx-[380px]">
               <Divider className=" bg-[#7A7A7A]  opacity-30" />
               <div className="relative flex justify-between top-14">
                  <p className=" text-[#7A7A7A] ">
                     Copyright @2023 Aspire. All Rights Reserved.
                  </p>
                  <p className=" text-[#7A7A7A] ">
                     Terms & Conditions ~ Privacy Policy
                  </p>
               </div>
            </div>
         </footer>
      </>
   );
};

export default FooterComponent;



