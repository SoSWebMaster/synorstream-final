import { ReactNode } from "react";
import DashboadHeader2 from "./dashboadHeader2";
import SideBarComponent2 from "./sideBarComponent2";
import FooterComponent from "../footer/footer";
type DashboardProps = {
    children: ReactNode;
  };

const DashboardComponent2: React.FC<DashboardProps>=({children})=>{

    return (
        <>
          <div className="w-full h-[120px] bg-[#2D2D2D] mt-5">
                <DashboadHeader2/>
            </div>
            <div className="flex flex-col mt-5 md:flex-row">
                <div className="sticky top-0 bg-[#171717] w-1/4 h-auto">
                    <SideBarComponent2/>
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

export default DashboardComponent2;