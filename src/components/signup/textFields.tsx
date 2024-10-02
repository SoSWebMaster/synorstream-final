// @ts-nocheck
import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
import axios from "axios"; // Make sure axios is installed
import { endPoints } from "../../services/constants/endPoint";
import useAxios from "../../services/axiosConfig/axiosConfig";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAppSelector, useAppDispatch } from "../../store";
import { updatePlainId, updateUserId } from "../../store/music-store";
import { toast } from "react-toastify";
import { store } from "../../store";
import { userLogin } from "../../store/authSlice";

const SignUpTextFieldsComponent = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showPassword2, setShowPassword2] = useState(false);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const axiosInstance = useAxios();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { plain_Id, plain_MonthlyPrice, plain_AnnualPrice } = useAppSelector(
      (state) => state.music
   );
   const handleClickShowPassword = () => setShowPassword((show) => !show);
   const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
   const { auth } = store.getState();
   const p_type = plain_MonthlyPrice ? 0 : 1;
   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (password !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      try {
         const response = await axiosInstance.post(endPoints.signup, {
            name,
            email,
            password,
            plan_id: plain_Id,
            plan_type: p_type,
            add_info: [],
         });
         if (response.status === 200) {
            if (!response.data.result) {
               toast.warning(`${response.data.msg}`);
            } else {
               const details = {
                  email: email,
                  password: password,
               };
               toast.success("Successfully Sign Up");
               try {
                  const resultAction = await dispatch(userLogin(details));
                  const result = resultAction as { payload?: any }; // Explicitly type the resultAction

                  const link = result.payload?.data?.link;
                  // localStorage.setItem(
                  //    "currentPlan",
                  //    result.payload?.data?.current_plan
                  // );

                  if (link) {
                     if (link === "/dashboard") {
                        toast.success("Welcome to dashboard");
                        navigate("/browse");
                     } else {
                        navigate(link);
                     }
                  }
               } catch (error) {
                  console.error("Login failed:", error);
               } finally {
                  // setIsLoading(false);
               }
               // navigate('/checkout');
            }
            // Handle successful signup
            // dispatch(updateUserId())
         }
      } catch (error) {
         // Handle error
         toast.error(`${error}`);
         console.error("Error during signup:", error);
         setError("Signup failed, please try again.");
      }
   };

   return (
      <div className="mt-10 text-center">
         <form onSubmit={handleSubmit}>
            <OutlinedInput
               placeholder="Name"
               className="!bg-white !rounded-lg 2xl:!w-[35%] xl:w-[48%] lg:w-[52%]"
               sx={{ height: 70 }}
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
            <br />
            <OutlinedInput
               placeholder="Enter Email"
               className="!bg-white mt-5 !rounded-lg 2xl:!w-[35%] xl:w-[48%] lg:w-[52%]"
               sx={{ height: 70 }}
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <OutlinedInput
               className="!bg-white !rounded-lg 2xl:!w-[35%] xl:w-[48%] lg:w-[52%] mt-5 h-[70px]"
               type={showPassword ? "text" : "password"}
               placeholder="Password"
               endAdornment={
                  <InputAdornment position="end">
                     <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                     </IconButton>
                  </InputAdornment>
               }
               label="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <OutlinedInput
               className="!bg-white !rounded-lg 2xl:!w-[35%] xl:w-[48%] lg:w-[52%] mt-5 h-[70px]"
               type={showPassword2 ? "text" : "password"}
               placeholder="Confirm Password"
               endAdornment={
                  <InputAdornment position="end">
                     <IconButton onClick={handleClickShowPassword2} edge="end">
                        {showPassword2 ? <Visibility /> : <VisibilityOff />}
                     </IconButton>
                  </InputAdornment>
               }
               label="Confirm Password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
            <Button
               className="!bg-[#0714BD] !text-white !rounded-lg 2xl:!w-[35%] xl:w-[48%] lg:w-[52%] !mt-5 h-[55px]"
               variant="outlined"
               type="submit"
            >
               Create Account
            </Button>
         </form>
         <p className="mt-3">
            By continuing you indicate that you read and agreed to the<span className="underline cursor-pointer" onClick={() => navigate('/terms-conditions')} > Terms of
            Use.</span>
         </p>
      </div>
   );
};

export default SignUpTextFieldsComponent;
