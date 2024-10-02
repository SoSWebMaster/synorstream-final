// @ts-nocheck
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { updatePlainId, updateSideBar } from "../../../../store/music-store";
import { endPoints } from "../../../../services/constants/endPoint";
import useAxios from "../../../../services/axiosConfig/axiosConfig";
import DashboardComponent2 from "../..";
import { useNavigate } from "react-router-dom";

const MyPlan2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [planData, setPlanData] = useState<any>(null);
  const [Dte, setDates] = useState();
  const axiosInstance = useAxios();

  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  const fetchPlanData = async () => {
    try {
      const response = await axiosInstance.get(endPoints.current_plan);

      if (response?.data) {
        const data = response.data.data;

        if (typeof data.features === 'string') {
          try {
            data.features = JSON.parse(data.features);
          } catch (error) {
            console.error('Error parsing features JSON:', error);
            data.features = [];
          }
        }
        setDates(formatDate(response?.data?.trial_end));
        setPlanData(data);
      } else {
        console.error("No data returned from the API.");
      }
    } catch (error) {
      console.error("Error fetching plan data:", error);
    }
  };

  const stripHtmlTags = (htmlString: string) => {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || '';
  };

  if (!planData) {
    return <div>Loading...</div>;
  }

  const features = Array.isArray(planData?.features) ? planData.features : [];

  const handleUpdatePlan = (planData: any) => {
    navigate(`/update-plan/${planData?.id}`);
    dispatch(updateSideBar('update-plan'));
    dispatch(updatePlainId(planData?.id));
  };

  return (
    <>
      <DashboardComponent2>
        <div className="m-12 bg-[url('/static/images/Website-Background.png')] h-full">
          <p className="text-[28px]">My Plan</p>
          <p className="text-[24px] mt-8">{planData.plan_name}</p>

          {features.length > 0 ? (
            features.map((item, index) => (
              <div key={index} className="flex items-center mt-5">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="cursor-pointer text-[#FB8A2E] w-3"
                />
                <p className="ml-2 !text-[#BBBBBB]" dangerouslySetInnerHTML={{ __html: stripHtmlTags(item) }}></p>
              </div>
            ))
          ) : (
            <p>No features available.</p>
          )}
          <div>

          </div>

          <Button className="!bg-[#FB8A2E] !text-white !rounded-md !mt-5 !w-60 !h-11 !font-bold" onClick={() => handleUpdatePlan(planData)}>Update Plan</Button>
        </div>
      </DashboardComponent2>
    </>
  );
};

export default MyPlan2;
