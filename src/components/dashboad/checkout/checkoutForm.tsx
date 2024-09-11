// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import {
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";
import PlanDetails from "./planDetails";
import { CircularProgress,  TextField } from "@mui/material";
import useAxios from "../../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../../services/constants/endPoint";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updatePlainAnnualPrice, updatePlainId, updatePlainMonthlyPrice } from "../../../store/music-store";
import { useAppDispatch } from "../../../store";
import './stripe.scss';
// import { useAppSelector } from "../../../store";


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

export const CheckoutForm = ({ message, setMessage,   clientSecret }: Props): JSX.Element => {
   const stripe = useStripe();
   const elements = useElements();
   const axiosInstance=useAxios();
   const navigate = useNavigate();
   const [isPlanDetails, setPLanDetails] = useState<PlanDetailsProps[]>();
   const [isParsedFeature, setisParsedFeature] = useState();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [circularLoader, setCircularLoader] = useState<boolean>(true);
   // const [switcher, setSwitcher] = useState<string>("btn1");
   const [cardHolderName,setCardHolderName]=useState('');
   const [amount, setAmount] = useState(null)
   const [additionalInfo,setAdditionalInfo] = useState({
      company:null,
      vat:null,
      billing:null
   })
   
   const dispatch=useAppDispatch()
   useEffect(() => {
      setCircularLoader(true);
    fetchData();
   },[clientSecret]);
// @ts-nocheck

   const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
         event.preventDefault();
         if (!stripe || !elements) {
            return;
         }
         setIsLoading(true);

         const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
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
            const response = await axiosInstance.post(endPoints.submit_payment, {
               paymentMethod: paymentIntent.payment_method,
               cardHolderName:cardHolderName,
               add_info: additionalInfo
            })
            if (response.status === 200) {
               // Handle successful signup
               setIsLoading(false);
               toast.success("Transaction Succeeded")
               dispatch(updatePlainAnnualPrice(null))
               dispatch(updatePlainMonthlyPrice(null))
               dispatch(updatePlainId(null))
               navigate('/login');
            }
            else
            {
              toast.success('Something went wrong.');
            }
         } catch (error) {
            setIsLoading(false);
            // Handle error
            console.error('Error during signup:', error);
            // setError('Signup failed, please try again.');
            setMessage('Signup failed, please try again.');
         }
  
        } else {
          setMessage('unexpectedErrorMessage');
        }
      },
      [stripe, elements, setMessage]
   );
   // const handleSwitch = (type: string,monthly_price:number | null=null, annual_price:number | null=null) => {
   //    setSwitcher(type);
   //    if(monthly_price){
   //      dispatch(updatePlainMonthlyPrice(monthly_price))
   //      dispatch(updatePlainAnnualPrice(null))
   //    }
   //    if(annual_price){
   //      dispatch(updatePlainAnnualPrice(annual_price))
   //      dispatch(updatePlainMonthlyPrice(null))
   //    }
   // };

   // const {plain_MonthlyPrice,plain_AnnualPrice}= useAppSelector(state=>state.music);


   const fetchData = async () => {
  
    try {
      const response = await axiosInstance.get(endPoints.current_plan);
      if(response?.data){
       setPLanDetails(response?.data?.data[0]);
       setAmount(response?.data?.data[0].month_price)
       setisParsedFeature(JSON.parse(response?.data?.data[0]?.features))
       setCircularLoader(false)
      //  dispatch(updatePlainAnnualPrice(null))
      //  dispatch(updatePlainMonthlyPrice(null))
       dispatch(updatePlainId(null))
      }
    } catch (error) {
      toast.error(`${error}`)
      setCircularLoader(false)
    }
   }
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAdditionalInfo((prevDetails: any) => ({
          ...prevDetails,
          [name]: value,
      }));
  };
  // @ts-ignore
  const handleCardName=(e)=>{
   setCardHolderName(e.target.value)
  }
  

   return (
      <form onSubmit={handleSubmit}>
        {circularLoader ? (
         <div className="!text-center">
            <CircularProgress size={100} className="!text-[#FB8A2E]"/>
         </div>
        ): (
         <div className={` ${circularLoader ? '!hidden' :'!block' } `}>

        
         <h3 className="text-center text-[38px] font-semibold ">
         {/*  @ts-ignore */}
            Your {isPlanDetails?.plan_name} Plan
         </h3>
         <div className="flex justify-between mt-20">
            <div className="w-[50%] mr-2">
               
               <PlanDetails features = {isParsedFeature } plan_name = {isPlanDetails?.plan_name}/>
            </div>

            <div className="w-[50%]  !border-l-[1px] !border-[#FB8A2E] p-8">
               {/* <p className="font-semibold text-[22px] mb-10">
                  Choose MONTHLY OR ANNUAL
               </p> */}
               {/* <ButtonGroup className="!h-16 w-full  ">
                  <Button
                     onClick={() => handleSwitch("btn1",isPlanDetails?.month_price,null )}
                     sx={{
                        backgroundColor:
                           switcher === "btn1" ? "#FB8A2E" : "black !important",
                        border: "1px solid #FB8A2E !important",
                     }}
                     className={`hover: ${
                        switcher === "btn1" ? "!bg-[#FB8A2E]" : "!bg-none"
                     }`}
                  >
                     ${isPlanDetails?.month_price}/Month
                  </Button>
                  <Button
                     onClick={() => handleSwitch("btn2",null,isPlanDetails?.year_price)}
                     sx={{
                        backgroundColor:
                           switcher === "btn2" ? "#FB8A2E" : "black !important",
                        border: "1px solid #FB8A2E !important",
                     }}
                     className={`hover: ${
                        switcher === "btn2" ? "!bg-[#FB8A2E]" : "!bg-none"
                     }`}
                  >
                     ${isPlanDetails?.year_price}/Yearly(1 Month Free)
                  </Button>
               </ButtonGroup> */}
               {/* <Divider className="!my-5  !bg-[#FB8A2E]" /> */}

               <p className="font-semibold text-[22px] mb-4">Payment Method</p>
               <TextField
                  placeholder="Card Holder Name"
                  className="!w-full !mb-6"
                  onChange={(e)=>handleCardName(e)}
                  value={cardHolderName}
                  sx={{
                     "& .MuiInputBase-input": {
                        color: "white", // Input text color
                        "&::placeholder": {
                           color: "white", // Placeholder color
                        },
                     },
                     "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                           borderColor: "#FB8A2E", // Set your desired border color
                           color: "white",
                        },
                        "&:hover fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
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
                  value={additionalInfo?.company}
                  name="company"
                  onChange={handleChange}
                  sx={{
                     "& .MuiInputBase-input": {
                        color: "white", // Input text color
                        "&::placeholder": {
                           color: "white", // Placeholder color
                        },
                     },
                     "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                           borderColor: "#FB8A2E", // Set your desired border color
                           color: "white",
                        },
                        "&:hover fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                     },
                  }}
               />
               <TextField
                  placeholder="VAT Number (Optional)"
                  className="!w-full !mb-6"
                  value={additionalInfo?.vat}
                  name="vat"
                  onChange={handleChange}
                  sx={{
                     "& .MuiInputBase-input": {
                        color: "white", // Input text color
                        "&::placeholder": {
                           color: "white", // Placeholder color
                        },
                     },
                     "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                           borderColor: "#FB8A2E", // Set your desired border color
                           color: "white",
                        },
                        "&:hover fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                     },
                  }}
               />

               <TextField
                  placeholder="Billing Address (Optional)"
                  className="!w-full !mb-6"
                  value={additionalInfo?.billing}
                  name="billing"
                  onChange={handleChange}
                  sx={{
                     "& .MuiInputBase-input": {
                        color: "white", // Input text color
                        "&::placeholder": {
                           color: "white", // Placeholder color
                        },
                     },
                     "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                           borderColor: "#FB8A2E", // Set your desired border color
                           color: "white",
                        },
                        "&:hover fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                        "&.Mui-focused fieldset": {
                           borderColor: "#FB8A2E", // Border color when the field is focused
                           color: "white",
                        },
                     },
                  }}
               />

               
               <div className="flex justify-between">
                  <p className="font-semibold !text-[18px]">Total billed now:</p>
                  <p className="font-semibold !text-[18px]">${amount}</p>
               </div>
               <p className="font-semibold !text-[18px] my-6"> Credit Card will be charged after 7 day free trial period ends.</p>
              
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
