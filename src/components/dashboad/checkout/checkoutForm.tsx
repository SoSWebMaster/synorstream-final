// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import {
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";
import DashboadHeader from "../components/dashboad/dashboadHeader";
import Header from "../components/header/Header";
import PlanDetails from "./planDetails";
import { CircularProgress, TextField } from "@mui/material";
import useAxios from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
   updatePlainAnnualPrice,
   updatePlainId,
   updatePlainMonthlyPrice,
} from "../../../store/music-store";
import { useAppDispatch } from "../../../store";
import "./stripe.scss";
import { useAppSelector } from "../../../store";
import {
   setUserId,
   setUserEmail,
   setUserLink,
   setUserName,
   setUserRedirect,
   setUserSuccess,
   setUserToken,
} from "../../../store/authSlice";

enum PaymentStatus {
   SUCCEEDED = "succeeded",
   CANCELLED = "canceled",
}

interface Props {
   message: string | undefined;
   setMessage: (message: string | undefined) => void;
   clientSecret: string;
}

interface PlanDetailsProps {
   id: number;
   plan_name: string;
   mailchimp_tag: string;
   sub_heading: string;
   feature_heading: string;
   features: string;
   stripe_pid: string;
   month_price: number;
   month_price_skey: string;
   year_price: number;
   year_price_skey: string;
   free_months: number;
   free_months_text: string;
   trial_period: number;
   sort_order: number;
   is_active: number;
}

export const CheckoutForm = ({
   message,
   setMessage,
   clientSecret,
}: Props): JSX.Element => {
   const stripe = useStripe();
   const elements = useElements();
   const axiosInstance = useAxios();
   const navigate = useNavigate();
   const [isPlanDetails, setPLanDetails] = useState<PlanDetailsProps[]>();
   const [isParsedFeature, setisParsedFeature] = useState();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [circularLoader, setCircularLoader] = useState<boolean>(true);
   const [cardHolderName, setCardHolderName] = useState("");
   const [amount, setAmount] = useState(null);
   const [company, setCompany] = useState("");
   const [vat, setVat] = useState("");
   const [billing, setBilling] = useState("");

   const { plain_MonthlyPrice, plain_AnnualPrice } = useAppSelector(
      (state) => state.music
   );

   const dispatch = useAppDispatch();
   useEffect(() => {
      setCircularLoader(true);
      fetchData();
   }, [clientSecret]);

   const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
         event.preventDefault();
         if (!stripe || !elements) {
            return;
         }
         setIsLoading(true);
         const userInfo = {
            company: company,
            vat: vat,
            billing: billing,
         };

         const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
            confirmParams: {
               payment_method_data: {
                  billing_details: {
                     name: cardHolderName,
                  },
               },
            },
         });

         if (error) {
            setIsLoading(false);
            setMessage(error.message);
            return;
         }

         if (!paymentIntent) {
            setMessage("Missing");
            setIsLoading(false);
            return;
         }

         if (paymentIntent.status === PaymentStatus.SUCCEEDED) {
            try {
               const response = await axiosInstance.post(
                  endPoints.submit_payment,
                  {
                     paymentMethod: paymentIntent.payment_method,
                     cardHolderName: cardHolderName,
                     add_info: userInfo,
                  }
               );
               if (response.status === 200) {
                  // Handle successful signup
                  setIsLoading(false);
                  toast.success("Transaction Succeeded");
                  dispatch(updatePlainAnnualPrice(null));
                  dispatch(updatePlainMonthlyPrice(null));
                  dispatch(updatePlainId(null));
                  dispatch(setUserId(response.data.id));
                  dispatch(setUserEmail(response.data.email));
                  dispatch(setUserName(response.data.name));
                  dispatch(setUserToken(response.data.token));
                  dispatch(setUserLink("browse"));
                  dispatch(setUserSuccess(true));
                  dispatch(setUserRedirect(true));
                  navigate("/browse");
               } else {
                  toast.success("Something went wrong.");
               }
            } catch (error) {
               setIsLoading(false);
               // Handle error
               console.error("Error during signup:", error);
               setMessage("Signup failed, please try again.");
            }
         } else {
            setMessage("unexpectedErrorMessage");
         }
      },
      [stripe, elements, setMessage, company, vat, billing, cardHolderName]
   );

   const fetchData = async () => {
      try {
         const response = await axiosInstance.get(endPoints.current_plan);
         if (response?.data) {
            setPLanDetails(response?.data?.data);
            console.log(response?.data?.data);
            setAmount(
               response?.data?.data?.trial_period < 1
                  ? response.data.data.plan_price
                  : 0
            );
            setisParsedFeature(JSON.parse(response?.data?.data?.features));
            setCircularLoader(false);
            //  dispatch(updatePlainAnnualPrice(null))
            //  dispatch(updatePlainMonthlyPrice(null))
            localStorage.setItem(
               "currentPlan",
               response?.data?.data?.id
            );

            dispatch(updatePlainId(null));
         }
      } catch (error) {
         toast.error(`${error}`);
         setCircularLoader(false);
      }
   };
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAdditionalInfo((prevDetails: any) => ({
         ...prevDetails,
         [name]: value,
      }));
   };
   // @ts-ignore
   const handleCardName = (e) => {
      setCardHolderName(e.target.value);
   };

   return (
      <form onSubmit={handleSubmit}>
         {circularLoader ? (
            <div className="!text-center">
               <CircularProgress size={100} className="!text-[#FB8A2E]" />
            </div>
         ) : (
            <div className={` ${circularLoader ? "!hidden" : "!block"} `}>
               <h3 className="text-center text-[38px] font-semibold ">
                  Your {isPlanDetails?.plan_name} Plan
               </h3>
               <div className="flex justify-between mt-20">
                  <div className="w-[50%] mr-2">
                     <PlanDetails
                        features={isParsedFeature}
                        plan_name={isPlanDetails?.plan_name}
                     />
                  </div>

                  <div className="w-[50%]  !border-l-[1px] !border-[#FB8A2E] p-8">
                     <p className="font-semibold text-[22px] mb-4">
                        Payment Method
                     </p>
                     <TextField
                        placeholder="Card Holder Name"
                        className="!w-full !mb-6"
                        onChange={(event) =>
                           setCardHolderName(event.target.value)
                        }
                        value={cardHolderName}
                        sx={{
                           "& .MuiInputBase-input": {
                              color: "white",
                              "&::placeholder": {
                                 color: "white",
                              },
                           },
                           "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&:hover fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&.Mui-focused fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                           },
                        }}
                     />
                     <PaymentElement className="payment-element" />
                     <p className="font-semibold text-[22px] text-[#BBBBBB] mb-4">
                        Add Invoice Info
                     </p>
                     <TextField
                        placeholder="Company (Optional)"
                        className="!w-full !mb-6"
                        name="company"
                        value={company}
                        onChange={(event) => setCompany(event.target.value)}
                        sx={{
                           "& .MuiInputBase-input": {
                              color: "white",
                              "&::placeholder": {
                                 color: "white",
                              },
                           },
                           "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&:hover fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&.Mui-focused fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                           },
                        }}
                     />
                     <TextField
                        placeholder="VAT Number (Optional)"
                        className="!w-full !mb-6"
                        name="vat"
                        value={vat}
                        onChange={(event) => setVat(event?.target.value)}
                        sx={{
                           "& .MuiInputBase-input": {
                              color: "white",
                              "&::placeholder": {
                                 color: "white",
                              },
                           },
                           "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&:hover fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&.Mui-focused fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                           },
                        }}
                     />

                     <TextField
                        placeholder="Billing Address (Optional)"
                        className="!w-full !mb-6"
                        name="billing"
                        value={billing}
                        onChange={(event) => setBilling(event?.target.value)}
                        sx={{
                           "& .MuiInputBase-input": {
                              color: "white",
                              "&::placeholder": {
                                 color: "white",
                              },
                           },
                           "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&:hover fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                              "&.Mui-focused fieldset": {
                                 borderColor: "#FB8A2E",
                                 color: "white",
                              },
                           },
                        }}
                     />

                     <div className="flex justify-between">
                        <p className="font-semibold !text-[18px]">
                           Total billed now:
                        </p>
                        <p className="font-semibold !text-[18px]">${amount}</p>
                     </div>
                     <p className="font-semibold !text-[18px] my-6">
                        {" "}
                        Credit Card will be charged after 7 day free trial
                        period ends.
                     </p>

                     <button
                        type="submit"
                        disabled={isLoading || !stripe || !elements}
                     >
                        {isLoading ? <div className="spinner" /> : "Pay now"}
                     </button>
                     {message ? (
                        <div className="payment-message" role="alert">
                           {message}
                        </div>
                     ) : null}
                  </div>
               </div>
            </div>
         )}
      </form>
   );
};
