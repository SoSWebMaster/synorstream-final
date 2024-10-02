//@ts-nocheck
import {
   Button,
   ToggleButton,
   ToggleButtonGroup,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   CircularProgress,
} from "@mui/material";
import { endPoints } from "../../../../services/constants/endPoint";
import useAxios from "../../../../services/axiosConfig/axiosConfig";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardComponent2 from "../..";

const UpdatePlan2 = () => {
   const { plain_Id } = useParams();
   const [pricingData, setPricingData] = useState<any>([]);
   const [currentPlan, setCurrentPlan] = useState<any>();
   const [viewMode, setViewMode] = useState<number>(0); // 0 for monthly, 1 for yearly
   const [open, setOpen] = useState<boolean>(false); // Modal open state
   const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null); // Selected plan ID for confirmation
   const [message, setMessage] = useState<any>();
   const [loading, setLoading] = useState<boolean>(false); // Loading state
   const navigate = useNavigate();
   const axiosInstance = useAxios();

   useEffect(() => {
      fetchPricingData();
   }, []);

   const fetchPricingData = async () => {
      try {
         setLoading(true); // Start loading
         const response = await axiosInstance.get(endPoints.selected_plan);
         if (response?.data) {
            const data = response?.data;
            setPricingData(data.other_plans);
            setCurrentPlan(data.selected_plan);
         }
      } catch (error) {
         toast.error(`${error}`);
      } finally {
         setLoading(false); // Stop loading after data is fetched
      }
   };

   const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      newViewMode: number
   ) => {
      if (newViewMode !== null) {
         setViewMode(newViewMode);
      }
   };

   const handleCloseModal = () => {
      setOpen(false);
      setSelectedPlanId(null);
   };

   const showConfirmModal = async (plan_id: number) => {
      try {
         setSelectedPlanId(plan_id);
         setLoading(true); // Start loading
         const response = await axiosInstance.post(endPoints.cal_pro_rate_amt, {
            play_type: viewMode,
            sel_plan: plan_id,
         });
         if (response?.data) {
            const data = response?.data;
            setOpen(true);
            setMessage(data.msg);
         }
      } catch (error) {
         toast.error(`${error}`);
      } finally {
         setLoading(false); // Stop loading
      }
   };

   const handleConfirm = async () => {
      try {
         setLoading(true); // Start loading
         const response = await axiosInstance.post(endPoints.switch_plan, {
            req: selectedPlanId,
            play_type: viewMode,
            sel_plan: selectedPlanId,
         });
         if (response?.data) {
            const data = response?.data;
            setOpen(false);
            toast.success(data.msg);
            // Re-fetch updated plan data after successful update
            await fetchPricingData(); // Refetch the data to show new changes
         }
      } catch (error) {
         toast.error(`${error}`);
      } finally {
         setLoading(false); // Stop loading
      }
   };


   return (
      <>
         <DashboardComponent2>
            <div className="m-12">
               <p className="text-[28px]">My Plan</p>
               <p className="text-[24px] mt-6">Choose Plan</p>

               {loading ? (
                  <div className="flex justify-center">
                     <CircularProgress color="primary" />
                  </div>
               ) : (
                  <>
                     <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleToggleChange}
                        aria-label="View Mode"
                        sx={{
                           mb: 4,
                           border: "1px solid #FB8A2E",
                           borderRadius: "8px",
                           "& .Mui-selected": {
                              backgroundColor: "#FB8A2E",
                           },
                           "& .MuiToggleButton-root": {
                              border: "1px solid #FB8A2E",
                           },
                        }}
                     >
                        <ToggleButton
                           value={0}
                           aria-label="Monthly"
                           sx={{ color: "white" }}
                           disabled={loading} // Disable during loading
                        >
                           Monthly
                        </ToggleButton>
                        <ToggleButton
                           value={1}
                           aria-label="Yearly"
                           sx={{ color: "white" }}
                           disabled={loading} // Disable during loading
                        >
                           Yearly
                        </ToggleButton>
                     </ToggleButtonGroup>

                     {pricingData.length > 0 &&
                        pricingData?.map((item) => (
                           <div
                              key={item.id}
                              className="flex justify-between border gap-7 w-full border-[#FB8A2E] h-32 mt-8 rounded-3xl p-7 justify-between items-center"
                           >
                              <div className="flex justify-between w-full">
                                 <div>
                                    <p className="text-[28px] font-semibold">
                                       {item?.plan_name}
                                    </p>
                                    <p className="text-[18px] ">
                                       {item?.sub_heading}
                                    </p>
                                 </div>
                                 <div>
                                    {viewMode === 0 ? (
                                       <p className="text-[28px] font-semibold">
                                          {"$" + item?.month_price + "/ month"}
                                       </p>
                                    ) : (
                                       <p className="text-[28px] font-semibold">
                                          {"$" + item?.year_price + "/ year"}
                                       </p>
                                    )}
                                    {viewMode === 0 ? (
                                       <p className="text-[18px] text-[#BBBBBB]">{`or billed at $${item?.year_price}/yearly ( ${item?.free_months_text})`}</p>
                                    ) : (
                                       <p className="text-[18px] text-[#BBBBBB]">{`Includes ${item?.free_months_text}`}</p>
                                    )}
                                 </div>
                              </div>
                              <div>
                                 <Button
                                    className="!bg-[#FB8A2E] !text-white !w-48 !h-12 !rounded-3xl"
                                    onClick={() => showConfirmModal(item?.id)}
                                    disabled={loading} // Disable during loading
                                 >
                                    {loading ? (
                                       <CircularProgress
                                          color="inherit"
                                          size={24}
                                       />
                                    ) : (
                                       "Select"
                                    )}
                                 </Button>
                              </div>
                           </div>
                        ))}

                     <div className="flex justify-between border gap-7 w-full border-[#FB8A2E] h-32 mt-8 rounded-3xl p-7 justify-between items-center">
                        <div className="flex justify-between w-full">
                           <div>
                              <p className="text-[28px] font-semibold">
                                 {currentPlan?.plan_name}
                              </p>
                              <p className="text-[18px] ">
                                 {currentPlan?.sub_heading}
                              </p>
                           </div>
                           <div>
                              <p className="text-[28px] font-semibold">
                                 {"$" +
                                    currentPlan?.current_plan_selected_price +
                                    "/" +
                                    currentPlan?.period}
                              </p>
                           </div>
                        </div>
                        <div>
                           <p className="border !border-[#FB8A2E] !text-white !w-48 !h-12 rounded-lg text-center flex justify-center items-center ">
                              Activated
                           </p>
                        </div>
                     </div>
                  </>
               )}
            </div>

            {/* Confirmation Modal */}
            <Dialog open={open} onClose={handleCloseModal}>
               <DialogTitle
                  sx={{
                     bgcolor: "#2D2D2D",
                     borderTop: "1px solid #000",
                     color: "#fff",
                  }}
               >
                  Confirm Selection
               </DialogTitle>
               <DialogContent sx={{ bgcolor: "#2D2D2D", color: "#fff" }}>
                  <p>{message}</p>
               </DialogContent>
               <DialogActions
                  sx={{
                     bgcolor: "#2D2D2D",
                     borderBottom: "1px solid #000",
                     color: "#fff",
                  }}
               >
                  <Button onClick={handleCloseModal} className="!text-white">
                     Cancel
                  </Button>
                  <Button
                     onClick={handleConfirm}
                     className="!bg-[#FB8A2E] !text-white !p-2 !px-4 !rounded-3xl"
                     disabled={loading} // Disable during loading
                  >
                     {loading ? (
                        <CircularProgress color="inherit" size={24} />
                     ) : (
                        "Confirm"
                     )}
                  </Button>
               </DialogActions>
            </Dialog>
         </DashboardComponent2>
      </>
   );
};

export default UpdatePlan2;
