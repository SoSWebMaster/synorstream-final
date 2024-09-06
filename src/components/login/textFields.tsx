import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/authSlice";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import React from "react";
import { AppDispatch } from "../../store"; // Import your AppDispatch type

const LoginTextFieldsComponent = () => {
   const dispatch = useDispatch<AppDispatch>(); // Type the dispatch function
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const [loginDetail, setLoginDetail] = React.useState({
      email: '',
      password: ''
   });

   const inputValues = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginDetail(prevState => ({
         ...prevState,
         [name]: value
      }));
   };

   const handleClickShowPassword = () => setShowPassword(show => !show);

   const loginButton = async () => {
      setIsLoading(true);
      try {
         const resultAction = await dispatch(userLogin(loginDetail));
         const result = resultAction as { payload?: any }; // Explicitly type the resultAction

         const link = result.payload?.data?.link;
         if (link) {
            if (link === "/dashboard") {
               toast.success("Welcome to dashboard");
               navigate('/browse');
            } else {
               navigate(link);
            }
         }
      } catch (error) {
         console.error("Login failed:", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col items-center mt-10">
         <form className="w-full max-w-md">
            <OutlinedInput
               placeholder="Email"
               className="!bg-white !rounded-lg !w-full mb-5"
               sx={{ height: 70 }}
               value={loginDetail.email}
               onChange={inputValues}
               name='email'
            />
            <OutlinedInput
               className="!bg-white !rounded-lg !w-full mb-5"
               type={showPassword ? "text" : "password"}
               placeholder="Password"
               endAdornment={
                  <InputAdornment position="end">
                     <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                     >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                     </IconButton>
                  </InputAdornment>
               }
               value={loginDetail.password}
               name='password'
               onChange={inputValues}
            />
            <Button
               className="!border !text-white !font-bold !rounded-lg !w-full h-[55px]"
               style={{ backgroundColor: '#FB8A2E', borderColor: '#FB8A2E' }}
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
