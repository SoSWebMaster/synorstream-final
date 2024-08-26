// import { useAppSelector } from "../store/music-store";
import Songs from "../components/song/Songs";
// import Player from "../components/player/Player";
import Filter from "../components/filter/Filter";
import FooterComponent from "../components/footer/footer";
import LicenseSection from "../components/licenseSection/licenseSection";
import MusicSection from "../components/musicSection/musicSection";
import MusicSection2 from "../components/musicSection/musicSection2";
import Header from "../components/header/Header";
import HeroSection from "../components/hereSection/heroSection";
import RoyalitySection from "../components/royalitySection/royalitySection";
import bgImage from '../../public/static/images/Website-Background.png'
import { useAppSelector } from "../store/index";
import Player from "../components/player/Player";
const  Home=()=> {

   const {musicType} = useAppSelector((state) => state.music);

   return (
      <>
         <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="w-full" style={{ backgroundImage: `url(${bgImage})` }}>
               <div className=" 2xl:px-40 xl:px-36 lg:px-28">
                  <Header />
                  <HeroSection />
               </div>
               <div className="mt-40">
                  <RoyalitySection />
               </div>
            </div>
            <div className="2xl:px-60 xl:px-32 lg:px-10">
               <MusicSection />
            </div>
              
            <div className="2xl:px-60 xl:px-32 lg:px-10">
               <MusicSection2 />
            </div>
           
            <div className="flex flex-col min-h-screen gap-6 mb-20 text-white bg-black/70 md:p-5 md:flex-row md:items-start">
               <Filter className=" md:w-1/6 md:sticky md:top-0" />
               <Songs className="md:w-5/6" />
            </div>
             
            <div className="!w-full">
               <LicenseSection />
            </div>
            <div>
               <FooterComponent />
            </div>
            {musicType === 'music' && <Player/>}
         </div>
      </>
   );
}

export default Home;
