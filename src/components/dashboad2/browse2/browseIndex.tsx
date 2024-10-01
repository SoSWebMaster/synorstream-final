import DashboardComponent2 from "..";
import Player from "../../player/Player";
import BrowserComponent2 from "./browseComponent2";


const BrowseIndex =()=>{
    return (
        <>
            <DashboardComponent2>
                <div className="bg-[url('/static/images/Website-Background.png')] !h-full">
                <BrowserComponent2/>
                </div>
                <Player />
            </DashboardComponent2>
        </>
    )
}

export default BrowseIndex;