// @ts-nocheck
import { Button } from "@mui/material";
import { endPoints } from "../../../../services/constants/endPoint";
import axiosInstance from "../../../../services/axiosConfig/axiosConfigSimple";
import  { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store";
import DashboardComponent2 from "../..";
import { useParams } from "react-router-dom";
const UpdatePlan2 = () => {
    const {plain_Id}=useParams();
    const [pricingData, setPricingData] = useState<any>([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchPricingData();
      }, []);
      const fetchPricingData = async () => {
        try {
          const response = await axiosInstance.get(endPoints.pricing);
          if(response?.data){
           const data = response?.data.data;
           setPricingData(data);
          }
        } catch (error) {
            toast.error(`${error}`);
        }
      };

   return (
      <>
      <DashboardComponent2>
         <div className="m-12">
            <p className="text-[28px]">My Plan</p>
            <p className="text-[24px] mt-6">Choose Plan</p>
            {pricingData.length > 0 &&
                    pricingData?.map((item, index) => (
            <div className="flex justify-between border gap-7 w-full border-[#FB8A2E] h-32 mt-8 rounded-3xl p-7 justify-between items-center">
                <div className="flex justify-between w-full">
                    <div>
                        <p className="text-[28px] font-semibold">{item?.plan_name}</p>
                        <p className="text-[18px] ">{item?.sub_heading}</p>
                    </div>
                    <div>
                        <p className="text-[28px] font-semibold">{"$"+item?.month_price+"/ month"}</p>
                        <p className="text-[18px] text-[#BBBBBB]">{`or billed at $${item?.year_price}/yearly ( ${item?.free_months_text})`}</p>
                    </div>
                    </div>
                <div>
                  {+plain_Id===item?.id ?  (<p className="border !border-[#FB8A2E] !text-white !w-48 !h-12 rounded-lg text-center flex justify-center items-center ">Activated</p>):
                  ( <Button className="!bg-[#FB8A2E] !text-white !w-48 !h-12 !rounded-3xl">Select</Button>)}
                       
                </div>
                </div>
                    ))}
           
         </div>
         </DashboardComponent2>
      </>
   );
};

export default UpdatePlan2;