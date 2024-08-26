import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./HorizontalScroll.css";
import { Button } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
interface ScrollMenuComponentTypes{
    children?: React.ReactNode | any;  
}

const ScrollMenuComponent:React.FC<ScrollMenuComponentTypes> = ({children}) => {

   return (
      <div className=" scroll-container">
         <Button className="!ml-16 !text-white">New Collection</Button>
         <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
            {children}
         </ScrollMenu>
      </div>
   );
};
const LeftArrow = () => {
  const visibility = React.useContext(VisibilityContext);
  return (
     <Button
        onClick={() => visibility.scrollPrev()}
        className="relative !bg-[#1F1F22] rounded-full !w-[5px] !h-[40px] top-44"
        disableRipple={true}
     >
        <KeyboardDoubleArrowLeftIcon className="!text-white " />
     </Button>
  );
};
const RightArrow = () => {
  const visibility = React.useContext(VisibilityContext);
  return (
     <Button
        onClick={() => visibility.scrollNext()}
        className="relative !bg-[#1F1F22] rounded-full !w-[10px] !h-[40px] top-44 "
        disableRipple={true}
     >
        <KeyboardDoubleArrowRightIcon className="!text-white " />
     </Button>
  );
};


export default ScrollMenuComponent;
