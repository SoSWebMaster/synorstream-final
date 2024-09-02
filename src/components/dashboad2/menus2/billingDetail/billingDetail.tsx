// @ts-nocheck
import { Button, CircularProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from 'react';
import useAxios from "../../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../../services/constants/endPoint";
import UpdatePaymentForm from "../../checkout/updatePaymentForm";
import { useNavigate } from "react-router-dom";
import ChangeBillingDetail2 from "./changeBillingDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import axiosInstance from "../../../../services/axiosConfig/axiosConfigSimple";
import { toast } from "react-toastify";
import DashboardComponent2 from "../..";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "");

const appearance: Appearance = {
    theme: "stripe",
};

const BillingDetail2 = () => {
  const [billingData, setBillingData] = useState<any>(null);
  const [isCircular, setIsCircular] = useState(false);
  const [isOpen,setIsOpen]= useState(false);
  const [clientSecret, setClientSecret] = useState();
  const axiosInstance=useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBillingData();
  }, [isOpen]);

  const handleOpenUpdatePayment = () => {
    fetchSecret();
};
const handleCloseModal=()=>{
  setIsCircular(false);
  setIsOpen(prev=>!prev);
}
const fetchSecret=async()=>{
  setIsCircular(true)
  try{
    const response=await axiosInstance.get(endPoints?.update_payment);
    if(response?.data){
      setClientSecret(response?.data?.clientSecret);
      setIsCircular(false);
      setIsOpen(prev=>!prev);
    }
  }catch(err){
    toast.success(`${err}`)
  }

}

  const fetchBillingData = async () => {
    try {
      const response = await axiosInstance.get(endPoints.billing);
      if(response?.data){
       const data = response?.data.paymentMethods[0];
       setBillingData(data);
      }
    } catch (error) {
      console.log(error)
      toast.error(`${error}`)
    }
  };

  // if (!billingData) {
  //   return <div>Loading...</div>;
  // }
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
};
   return (
      <>
      <DashboardComponent2>
         <div className="m-12 bg-[url('/static/images/Website-Background.png')] !h-full">
            <p className="text-[38px] mb-2">My BIlling</p>
            <p className="text-[18px] mb-6">Payment Methods</p>
            <div className=" border border-[#FB8A2E] border-b-[30px] w-[60%] !z-50 rounded-xl h-96">
              <div className="bg-black h-[360px] !z-0 rounded-xl p-12">
                  <div>
                      <p className="text-[#BBBBBB] text-[22px]">Card Ending in {billingData?.card.last4}</p>
                      <p className=" text-[14px] mt-1">Expires: { billingData?.card ? billingData?.card.exp_month+'/'+billingData?.card.exp_year : ''}</p>
                  </div>
                  <div className="mt-8">
                      <p className="text-[#BBBBBB] text-[22px]">Name on card</p>
                      <p className=" text-[14px] mt-1">{billingData?.billing_details.name}</p>
                  </div>
                  <div className="mt-8">
                      <p className="text-[#BBBBBB] text-[22px]">Billing Address</p>
                      <p className=" text-[14px]">{  billingData?.billing_details.address.postal_code}</p>
                  </div>
                   
              </div>
            </div>

            <Button className="!bg-[#FB8A2E] !text-white !h-[52px] !mt-8 !rounded-md"
            onClick={handleOpenUpdatePayment}
            >
              Add New Payment Method {isCircular && <CircularProgress size={20} className="!ml-2" />}</Button>

             
         </div>
         {isOpen && (
                  <Modal
                  open={isOpen}
                  onClose={handleCloseModal}
              >
                         <Elements stripe={stripePromise} options={options} key={clientSecret}>
                            <ChangeBillingDetail2 handleClose={handleCloseModal}/>
                          </Elements>
              </Modal>
              )}
        </DashboardComponent2>
      </>
   );
};

export default BillingDetail2;
