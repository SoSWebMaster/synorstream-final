import FooterComponent from "../components/footer/footer";
import Header from "../components/header/Header";
import bgImage from '/static/images/Website-Background.png'
import PrivacyPolicyComponent from "../components/privacy-policy/privacy-policy";
import DashboadHeader from "../components/dashboad/dashboadHeader";
import { useAppSelector } from "../store";
const PrivacyPolicyPage=()=>{
    const {redirect}=useAppSelector(state=>state.auth);
    return (
        <>
                 <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="w-full" style={{ backgroundImage: `url(${bgImage})` }}>
               <div className=" 2xl:px-40 xl:px-36 lg:px-28">
                {redirect ? <DashboadHeader/>:  <Header />}
               </div>
               <div className="p-20">
                 <PrivacyPolicyComponent />
               </div>
            </div>

            <div>
               <FooterComponent />
            </div>
         </div>
        </>
    )
}

export default PrivacyPolicyPage;