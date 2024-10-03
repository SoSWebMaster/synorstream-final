import { ReactNode } from "react";
import DashboadHeader2 from "./dashboadHeader2";
import SideBarComponent2 from "./sideBarComponent2";
import FooterComponent from "../footer/footer";

type DashboardProps = {
    children: ReactNode;
};

const DashboardComponent2: React.FC<DashboardProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen"> {/* Add min-h-screen to the outer container */}
            <div className="w-full h-[120px] bg-[#2D2D2D] mt-5">
                <DashboadHeader2 />
            </div>
            <div className="flex flex-col flex-grow mt-5 md:flex-row"> {/* Change mt-60 to mt-5 and use flex-grow */}
                <div className="sticky top-0 bg-[#171717] w-1/4 h-auto">
                    <SideBarComponent2 />
                </div>
                <div className="w-full mx-5 mb-10">
                    {children}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default DashboardComponent2;
