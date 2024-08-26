import DashboardComponent from "../components/dashboad";
import { useAppSelector } from "../store/index";
import bgImage from '/static/images/Website-Background.png'
import BrowserComponent from "../components/dashboad/browse";
import CopyrightComponent from "../components/dashboad/copyright";
import PlaylistComponent from "../components/dashboad/playlist";
import FavoritesComponent from "../components/dashboad/favorites";
import DownloadHistoryComponent from "../components/dashboad/downloadHistory";
// import NewReleases from "../components/dashboad/newReleases";
import BillingDetail from "../components/dashboad/menus/billingDetail/billingDetail";
import MyPlan from "../components/dashboad/menus/myPlan/myPlan";
import UpdatePlan from "../components/dashboad/menus/updatePlan/updatePlan";
import EditProfile from "../components/editProfileSection/editProfile";

const DashboardPage=()=>{
    const { sideBar } = useAppSelector( state => state.music);

    return (
        <>
        
        <div style={{ backgroundImage: `url(${bgImage})` }}>
            <DashboardComponent>
               {sideBar==='browse' ? 
                <BrowserComponent/> : sideBar==='download' ? 
                <DownloadHistoryComponent/> : sideBar==='favorites' ? 
                <FavoritesComponent/> :sideBar==='playlist' ? 
                <PlaylistComponent/>:sideBar==='copyright' ? 
                <CopyrightComponent/>:  
                sideBar==='billing'? <BillingDetail/> : 
                sideBar==='myplan'? <MyPlan/> :
                sideBar==='update-plan'? <UpdatePlan/>:
                sideBar==='profile'? <EditProfile/>:
                <BrowserComponent/>}
                {/* sideBar==='newrelease' ?<NewReleases/> : */}
            </DashboardComponent>
        </div>
           
          
        </>
    )
}

export default DashboardPage;
