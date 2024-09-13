import {BrowserRouter,Routes, Route} from 'react-router-dom'
import LoginPage from "./pages/login";
// import ProfilePage from "./pages/profilePage";
import SignUpPage from "./pages/signup";
import PricingPage from "./pages/pricing";
import { useAppSelector } from "./store/index";
import { Navigate } from "react-router-dom";
import Home from "./pages/home";
import { Stripe } from './components/dashboad/checkout/stripe';
import TermsConditionPage from './pages/terms-conditions';
import PrivacyPolicyPage from './pages/privacy-policy';
import FaqPage from './pages/faq';
import ContactUsPage from './pages/contacts';
import SubmitMusicPage from './pages/submit-music';
import BrowseIndex from './components/dashboad2/browse2/browseIndex';
import FavoritesComponent2 from './components/dashboad2/favorites2/index2';
import PlayListComponent2 from './components/dashboad2/playLists2/index2';
import CopyrightComponent2 from './components/dashboad2/copyright2/index2';
import DownloadHistoryComponent from './components/dashboad2/downloadHistory2/index2';
import SinglePlayList2 from './components/dashboad2/playLists2/singlePlayLIst2';
import NotFoundPage from './pages/notFoundPage';
import EditProfile from './components/editProfileSection/editProfile';
import BillingDetail2 from './components/dashboad2/menus2/billingDetail/billingDetail';
import MyPlan2 from './components/dashboad2/menus2/myPlan/myPlan';
import UpdatePlan2 from './components/dashboad2/menus2/updatePlan/updatePlan';
function App() {
   const {redirect,link} = useAppSelector((state) => state.auth); 



   return (
      <>
         <BrowserRouter >
            <Routes>
               <Route path="/" element={redirect ? <Navigate to='/browse'/>:<Home/>} />
               <Route path="/login" element={ redirect ? <Navigate to='/browse'/>: <LoginPage/>} />
               <Route path="/signup" element={redirect ? <Navigate to='/browse'/>:<SignUpPage/>} />
               <Route path="/pricing" element={!redirect ? <PricingPage/>: <Navigate to='/browse'/>} /> 
               {/* <Route path='/browse' element={redirect ? <browsePage /> : <Navigate to="/login" />} /> */}
               {/* <Route path="/profile" element={<ProfilePage />} /> */}
               {/* <Route path="/checkout" element={!redirect && link==="/checkout" ? <Stripe />: <Navigate to='/login'/>}/> */}
               <Route path="/checkout" element={ <Stripe />}/>


               <Route path="/terms-conditions" element={<TermsConditionPage/>} /> 
               <Route path="/privacy-policy" element={<PrivacyPolicyPage/>} /> 
               <Route path="/faq" element={<FaqPage/>} /> 
               <Route path="/contact" element={<ContactUsPage/>} /> 
               <Route path="/submit_music" element={<SubmitMusicPage/>} /> 
               <Route path='/browse' element={<BrowseIndex /> } />
               {/* <Route path='/browse' element={ redirect ? <BrowseIndex /> : <Navigate to='/pricing'/> } /> */}
               <Route path='/copyright' element={ redirect ?  <CopyrightComponent2 /> : <Navigate to='/login'/> } />
               <Route path='/downlaod-history' element={ redirect ? <DownloadHistoryComponent /> : <Navigate to='/login'/> } />
               <Route path='/favourites' element={ redirect ?  <FavoritesComponent2 /> : <Navigate to='/login'/> } />
               <Route path='/playlist' element={ redirect ? <PlayListComponent2 /> : <Navigate to='/login'/>} />
               <Route path='/playlist/:id' element={ redirect ? <SinglePlayList2 /> : <Navigate to='/login'/> } />
               <Route path='/profile' element={ redirect ? <EditProfile /> : <Navigate to='/login'/> } />
               <Route path='/billing' element={ redirect ? <BillingDetail2 /> : <Navigate to='/login'/> } />
               <Route path='/my-plan' element={ redirect ?  <MyPlan2 /> :<Navigate to='/login'/> } />
               <Route path='/update-plan/:plain_Id' element={ redirect ? <UpdatePlan2 /> : <Navigate to='/login'/>} />
               <Route path='/contact-us' element={<ContactUsPage /> } />
               <Route path="*" element={<NotFoundPage />} />
            

            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
