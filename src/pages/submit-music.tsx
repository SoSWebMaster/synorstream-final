import FooterComponent from "../components/footer/footer";
import Header from "../components/header/Header";
import SubmitMusicComponent from "../components/submit-music/submit-music";
import bgImage from "/static/images/Website-Background.png";

const SubmitMusicPage = () => {
   return (
      <>
         <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
            <div
               className="w-full"
               style={{ backgroundImage: `url(${bgImage})` }}
            >
               <div className=" 2xl:px-40 xl:px-36 lg:px-28">
                  <Header />
               </div>
               <div className="m-20 px-60">
                  <SubmitMusicComponent />
               </div>
            </div>

            <div>
               <FooterComponent />
            </div>
         </div>
      </>
   );
};

export default SubmitMusicPage;
