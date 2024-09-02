// @ts-nocheck
import { useEffect, useState } from "react"
import useAxios from "../../../services/axiosConfig/axiosConfig"
import { endPoints } from "../../../services/constants/endPoint"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload } from "@fortawesome/free-solid-svg-icons"
import useDownloader from "react-use-downloader";
  import { Box, Button, LinearProgress } from "@mui/material"
  import ProgressToast from "../../../util/ProgressToast"
interface DownloadHistory {
    id?:number,
    name?:string,
    created_at?:string,
    file_path?:string
}

const TableComponent2 = ()=>{
    const [Records,setRecords]=useState<DownloadHistory[]>();
    // let songId:number | null=null;
    const [songId,setSOngId]=useState(null);
    const axiosInstance=useAxios();
    const {
        percentage,
        download,
      } = useDownloader();
    useEffect(()=>{
        RecordsFetch();
    },[])
    useEffect(()=>{
        if(percentage==100){
            updateDate();
        }
    })
    const RecordsFetch=async()=>{
        try{
            const response= await axiosInstance.get(endPoints?.download_records_With_Out_UserId);
            if(response?.data){
                setRecords(response?.data)
            }else{
                toast.error('Data Not Found!');
            }
        }catch(err){
            toast.error(`${err}`);
        }
      
    }
    
    const [currentPage, setCurrentPage] =useState(1);
    const recordPerPage=9;
    const lastIndex=currentPage * recordPerPage;
    const firstIndex=lastIndex - recordPerPage;
    const records=Records?.slice(firstIndex,lastIndex);
    let nPage:number=-1;
    if(Records){
        nPage=Math.ceil(Records.length/recordPerPage);
    }
  
    const numbers=[...Array(nPage +1).keys()].slice(1);

    const prevPage=()=>{
        if(currentPage !==1){
            setCurrentPage(currentPage - 1);
        }
    }
    const nextPage=()=>{
        if(currentPage !==nPage){
            setCurrentPage(currentPage +1)
        }
    }
    const downloadFIle = (url:string, id:number ) => {
        setSOngId(id);
        const fileName=url?.split('/')?.pop();
        if (!fileName) {
            toast.error('File could not be determined.');
            console.error('File name could not be determined.');
            return;
        }
        download(url, fileName)
        toast.info('Downloading Started...');
      };
      const updateDate=async () => {
            try{
                const response=await axiosInstance.put(`${endPoints?.update_Date_in_download_history}/${songId}`);
                if(response?.data?.success){
                    toast.success(`${response?.data?.message}`);
                    RecordsFetch();
                }
            }catch (e) {
                console.error(e);
            
            }
      }
   
    return (

        <>
            <LinearProgress variant="determinate" value={percentage} />
            <Box sx={{ mt: 1, textAlign: 'center' }}>{`${percentage >0 ? 'Downlaoding' : percentage==100 ? 'completed' :''}   ${percentage}%`}</Box>
            <table className="w-full">
                <thead className="h-[51px]">
                    <tr className=" bg-[#171717]">
                        <th >Song Name</th>
                        <th >Date</th>
                        <th >Action</th>
                        
                    </tr>
                </thead>
                <tbody >
                    
                    { records?.length >0 ? ( records?.map((item,index)=>(
                        <tr className={` ${index%2 ===0 ? ' bg-[#232323] ': 'bg-[#313131]'}   h-[51px]`} key={`${index} + ${item.name}`}>
                            <td className="text-center ">{item?.name}</td>
                            <td className="text-center">{item?.created_at}</td>
                            <td className="text-center" ><Button disabled={percentage>0 && percentage<100} className="!text-white"  onClick={()=>downloadFIle(item?.file_path ,item?.id)}>  <FontAwesomeIcon icon={faDownload} className="cursor-pointer" /></Button> </td>
                        </tr>
                    ))) : <div>Songs History Not Found..</div>}
                 
                </tbody>
            </table>
            <div className="flex justify-center mt-10">
                    <button className="text-[#9E9E9E] mr-2" onClick={prevPage}>Prev</button>
                    {numbers.map(number=>(
                        <button className={` ${currentPage === number ?' bg-primary-blue text-white  ':'bg-white text-black'}  rounded-lg mx-2 w-[31px] h-[31px] `} key={number} onClick={()=>setCurrentPage(number)}>
                            {number}
                        </button>
                    ))}
                    <button className="text-[#9E9E9E] ml-2" onClick={nextPage}>Next</button>
            </div>
        </>
    )
}

export default TableComponent2