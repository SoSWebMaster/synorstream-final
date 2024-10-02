// @ts-nocheck
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "@mui/material";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { endPoints } from "../../../../services/constants/endPoint";
import { useAppSelector } from "../../../../store";
import useAxios from "../../../../services/axiosConfig/axiosConfig";
import { toast } from "react-toastify";

const ChangeBillingDetail2 = ({ handleClose }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "#2D2D2D",
    border: "1px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const axiosInstance = useAxios();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useAppSelector((state) => state.auth);

  const handleClose1 = () => {
    if (handleClose) {
      handleClose();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      toast.error(`Error: ${error.message}`);  // Show error message to user
      setIsLoading(false);
    } else if (setupIntent && setupIntent.status === "succeeded") {
      const newObj = { payment_method: setupIntent.payment_method };
      try {
        await axiosInstance.post(endPoints?.add_new_payment_method, newObj);
        toast.success("Payment method updated successfully!");
        setMessage("Payment method updated successfully!");
        setIsLoading(false);
        handleClose1();  // Close modal on success
      } catch (err) {
        setIsLoading(false);
        toast.error("Failed to update payment method.");
        console.error("API Error:", err);
      }
    } else {
      setMessage("Unexpected error occurred");
      toast.error("Unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Box sx={style}>
      <button
        className="flex items-center justify-end w-full text-white"
        onClick={handleClose1}
      >
        <FontAwesomeIcon icon={faXmark} className="text-[25px]" />
      </button>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Button
          disabled={!stripe || isLoading}
          className="!bg-[#FB8A2E] !text-white !mt-5 !font-medium"
          type="submit"
        >
          {isLoading ? "Processing..." : "Update Payment Method"}
        </Button>
        {message && <div>{message}</div>}
      </form>
    </Box>
  );
};

export default ChangeBillingDetail2;