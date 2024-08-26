import DashboadHeader from "../components/dashboad/dashboadHeader";
import FooterComponent from "../components/footer/footer";
import Header from "../components/header/Header";
import { useAppSelector } from "../store";
import ContactUsComponent from "../components/ContactUs/ContactUs";
import bgImage from '/static/images/Website-Background.png'

const ContactUsPage=()=>{
    const {redirect}=useAppSelector(state=>state.auth);
    return (
        <>
              <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="w-full" style={{ backgroundImage: `url(${bgImage})` }}>
               <div className=" 2xl:px-40 xl:px-36 lg:px-28">
               {redirect ? <DashboadHeader/>:  <Header />}
               </div>
               <div className="m-20 px-60">
                    <ContactUsComponent/>
               </div>   
            </div>

            <div>
               <FooterComponent />
            </div>
         </div>
        </>
    )
}


export default ContactUsPage;