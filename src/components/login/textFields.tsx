import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, CircularProgress, FormHelperText } from "@mui/material";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
import { AppDispatch } from "../../store"; // Import your AppDispatch type
import { updatePlainMonthlyPrice } from "../../store/music-store";

const LoginTextFieldsComponent = () => {
   const dispatch = useDispatch<AppDispatch>(); // Type the dispatch function
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const [loginDetail, setLoginDetail] = React.useState({
      email: "",
      password: "",
   });
   const [errors, setErrors] = React.useState({
      email: "",
      password: "",
   });

   const inputValues = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginDetail((prevState) => ({
         ...prevState,
         [name]: value,
      }));
      setErrors((prevErrors) => ({
         ...prevErrors,
         [name]: "", // Clear error when user starts typing
      }));
   };

   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const validateInputs = () => {
      let valid = true;
      let newErrors = { email: "", password: "" };

      if (!loginDetail.email) {
         newErrors.email = "Email is required.";
         valid = false;
      } else if (!/\S+@\S+\.\S+/.test(loginDetail.email)) {
         newErrors.email = "Email is invalid.";
         valid = false;
      }

      if (!loginDetail.password) {
         newErrors.password = "Password is required.";
         valid = false;
      }

      setErrors(newErrors);
      return valid;
   };

   const loginButton = async () => {
      if (!validateInputs()) return; // Validate inputs before proceeding

      setIsLoading(true);
      try {
         const resultAction = await dispatch(userLogin(loginDetail));
         const result = resultAction as { payload?: any };

         const link = result.payload?.data?.link;
         localStorage.setItem("currentPlan", result.payload?.data?.current_plan);
         dispatch(updatePlainMonthlyPrice(result.payload?.data?.plan_amount));

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
         toast.error("Login failed. Please try again."); // Optional: Notify user of failure
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col items-center mt-10">
         <form className="w-full max-w-md">
            <OutlinedInput
               placeholder="Email"
               className="!bg-white !rounded-lg !w-full mb-2"
               sx={{ height: 60 }}
               value={loginDetail.email}
               onChange={inputValues}
               name="email"
               error={!!errors.email} // Indicate error state
            />
            <FormHelperText error>{errors.email}</FormHelperText> {/* Display email error */}

            <OutlinedInput
               className="!bg-white !rounded-lg !w-full mb-2"
               type={showPassword ? "text" : "password"}
               placeholder="Password"
               endAdornment={
                  <InputAdornment position="end">
                     <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                     </IconButton>
                  </InputAdornment>
               }
               value={loginDetail.password}
               name="password"
               onChange={inputValues}
               error={!!errors.password} // Indicate error state
            />
            <FormHelperText error>{errors.password}</FormHelperText> {/* Display password error */}

            <Button
               className="!border !text-white !font-bold !rounded-lg !w-full h-[55px]"
               style={{ backgroundColor: "#FB8A2E", borderColor: "#FB8A2E" }}
               variant="outlined"
               onClick={loginButton}
               disabled={isLoading}
            >
               {isLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
         </form>
      </div>
   );
};

export default LoginTextFieldsComponent;
