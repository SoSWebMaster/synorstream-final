// @ts-nocheck
// import { useEffect } from "react";
// import useAxios from "../../../services/axiosConfig/axiosConfig";
// import { endPoints } from "../../../services/constants/endPoint";
import Filter from "../../filter/Filter";
import Songs from "../../song/Songs";
const BrowserComponent=()=>{
    // const axiosInstance2=useAxios();
    // const fetchData=async () =>{
    //     try{
    //     const response= await axiosInstance2.get(endPoints?.browse2);
    //         console.log(response?.data,"responseresponse");
 
    //       //   if(musicType==='music'){
    //       //    setSongs(response?.data?.)
    //       //   }
    //     }catch(err){
    //         console.log(err);
    //     }
     
 
 
    // }

    return (
        <>
            <div className="flex flex-col min-h-screen gap-6 mb-20 text-white bg-black/70 md:p-5 md:flex-row md:items-start">
               {/* <Filter className=" md:w-1/6 md:sticky md:top-0" /> */}
               <Songs className="md:w-full" />
            </div>
        </>
    )
}

export default BrowserComponent;