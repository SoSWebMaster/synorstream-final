import { ReactNode } from "react";
import DashboadHeader from "./dashboadHeader";
import SideBarComponent from "./sideBarComponent";
import FooterComponent from "../footer/footer";
type DashboardProps = {
    children: ReactNode;
  };

const DashboardComponent: React.FC<DashboardProps>=({children})=>{

    return (
        <>
          <div className="w-full h-[120px] bg-[#2D2D2D] mt-5">
                <DashboadHeader/>
            </div>
            <div className="flex flex-col mt-5 md:flex-row">
                <div className="sticky top-0 bg-[#171717] w-1/4 h-auto">
                    <SideBarComponent/>
                </div>
                <div className="w-full h-screen mx-5 mb-10 overflow-y-auto "
                style={{ scrollbarWidth: 'none'}}>
                    {children}
                </div>
                
            </div>
            <FooterComponent/>   
               
        </>
    )

    
}

export default DashboardComponent;