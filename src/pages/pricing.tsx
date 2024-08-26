import Pricing from "../components/pricing"
import Header from "../components/header/Header"
import FooterComponent from "../components/footer/footer"
import DashboadHeader from "../components/dashboad/dashboadHeader"
import { useAppSelector } from "../store"
const PricingPage=()=>{
    const {redirect}=useAppSelector(state=>state.auth);
    return(
        <>
            <div className=" 2xl:px-60 xl:px-36 lg:px-10 bg-[url('/static/images/Website-Background.png')] ">
            {redirect ? <DashboadHeader/>:  <Header />}
                <Pricing/>
            </div>
                <FooterComponent/>
        </>
    )
}


export default PricingPage