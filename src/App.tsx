import {BrowserRouter,Routes, Route} from 'react-router-dom'
import LoginPage from "./pages/login";
// import ProfilePage from "./pages/profilePage";
import SignUpPage from "./pages/signup";
import PricingPage from "./pages/pricing";
import DashboardPage from "./pages/dashboad";
import { useAppSelector } from "./store/index";
import { Navigate } from "react-router-dom";
import Home from "./pages/home";
import { Stripe } from './components/dashboad/checkout/stripe';
import TermsConditionPage from './pages/terms-conditions';
import PrivacyPolicyPage from './pages/privacy-policy';
import FaqPage from './pages/faq';
import ContactUsPage from './pages/contacts';
import SubmitMusicPage from './pages/submit-music';
function App() {
   const {redirect,link} = useAppSelector((state) => state.auth); 
   return (
      <>
         <BrowserRouter >
            <Routes>
               <Route path="/" element={redirect ? <Navigate to='/dashboard'/>:<Home/>} />
               <Route path="/login" element={ redirect ? <Navigate to='/dashboard'/>: <LoginPage/>} />
               <Route path="/signup" element={redirect ? <Navigate to='/dashboard'/>:<SignUpPage/>} />
               <Route path="/pricing" element={!redirect ? <PricingPage/>: <Navigate to='/dashboard'/>} /> 
               <Route path='/dashboard' element={redirect ? <DashboardPage /> : <Navigate to="/login" />} />
               {/* <Route path="/profile" element={<ProfilePage />} /> */}
               <Route path="/checkout" element={!redirect && link==="/checkout" ? <Stripe />: <Navigate to='/login'/>}/>

               <Route path="/terms-conditions" element={<TermsConditionPage/>} /> 
               <Route path="/privacy-policy" element={<PrivacyPolicyPage/>} /> 
               <Route path="/faq" element={<FaqPage/>} /> 
               <Route path="/contact" element={<ContactUsPage/>} /> 
               <Route path="/submit_music" element={<SubmitMusicPage/>} /> 
            </Routes>
         </BrowserRouter>
      </>
   );
}

export default App;
