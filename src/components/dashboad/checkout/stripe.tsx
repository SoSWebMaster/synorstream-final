   // @ts-nocheck
   import { useEffect, useMemo, useState } from "react";
   import { Elements } from "@stripe/react-stripe-js";
   import { Appearance, loadStripe, StripeElementsOptions,} from "@stripe/stripe-js";
   import { CheckoutForm } from "./checkoutForm";
   import './stripe.scss';
   import Header from "../../header/Header";
   import FooterComponent from "../../footer/footer";
   import bgImage from '../../../../public/static/images/Website-Background.png'
   import { useAppSelector } from "../../../store";
import { CircularProgress } from "@mui/material";
   const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || "");

   const appearance: Appearance = {
      theme: "stripe",
   };

   const backendUrl = import.meta.env.VITE_STRIPE_PK_AIRCODE_URL;

   export const Stripe = (): JSX.Element | null => {
      const [clientSecret, setClientSecret] = useState<string>();
      const [message, setMessage] = useState<string | undefined>();
      const [circularLoader, setCircularLoader] = useState<boolean>(true);
      const {plain_MonthlyPrice,plain_AnnualPrice}= useAppSelector(state=>state.music);
      useEffect(() => {
            fetch(backendUrl, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  currency: "usd",
                  country: "US",
                  amount:plain_AnnualPrice ? plain_AnnualPrice : plain_MonthlyPrice,
                  paymentMethodType: "card",
               }),
            })
               .then((res) => res.json())
               .then(({ output }) => {
               setCircularLoader(false);
               setClientSecret(output.clientSecret);
               })
               .catch((err) => {
                  console.log(err);
               });
         
            
      }, [plain_AnnualPrice,plain_MonthlyPrice]);

   


      // const options: StripeElementsOptions = { clientSecret, appearance };
      const options: StripeElementsOptions=useMemo(
         ()=>({clientSecret,appearance}),
         [clientSecret]
      )
      if (!clientSecret) {
         return null;
      }
       console.log(clientSecret,"clientSecretv")

      return (
         
         <div style={{ backgroundImage: `url(${bgImage})` }}>
      {/* //       <div className=" 2xl:px-40 xl:px-36 lg:px-28">  <Header/></div>
      //       {circularLoader ? (
      //    <div className="!text-center">
      //       <CircularProgress size={100}/>
      //    </div>
      //   ): ( */}
         { clientSecret && (
            <>
               <div className="w-[65%] m-auto mt-36 PaymentFormComponent__stripe-form">
                  <Elements options={{clientSecret,appearance}} stripe={stripePromise} >
                     <CheckoutForm
                        message={message}
                        setMessage={setMessage}
                        clientSecret={clientSecret}
                     />
                  </Elements>
               </div>
            </>
         )}
      {/* //   )} */}
         
          
         <FooterComponent/>
         </div>
      
      );
   };
