// @ts-nocheck
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Switch from '@mui/material/Switch';
import { useAppSelector } from "../../store/index";
import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { userLogin } from "../../store/authSlice";
import { useNavigate } from 'react-router-dom';
import { updatePlainMonthlyPrice } from "../../store/music-store";
import { toast } from "react-toastify";

const LoginTextFieldsComponent = () => {
   const dispatch=useDispatch();
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = React.useState(false);
   const [isLoading,setIsLoading] = React.useState(false);
   const [loginDetail,setLoginDetial]=React.useState({
      email:'',
      password:''
   })
   const inputValues=(e: React.ChangeEvent<HTMLInputElement>)=>{
      const {name,value}=e.target;
      setLoginDetial(prevState=>({
         ...prevState,
         [name]:value
      }))
   }
   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const loginButton=async ()=>{
      setIsLoading(true)
      //ts-ignore
      dispatch(userLogin(loginDetail)).then((result:any) => {
         const link = result?.payload?.data?.link;
         if (result?.payload?.data?.link) {
            if(result?.payload?.data?.link==="/dashboard"){
               setIsLoading(false)
               toast.success("Welcome to dashboard");
               navigate('/browse'); 
            }
            else{
               setIsLoading(false)
               // dispatch(updatePlainMonthlyPrice(result?.payload?.data?.plan_amount))
               navigate(link); 
            }
         
         }
     });
   }
   return (
      <>
         <div className="mt-10">
            <form>
               <OutlinedInput
                  placeholder="Email"
                  className="!bg-white !rounded-lg 2xl:!w-[35%] xl:!w-[48%] lg:!w-[54%] "
                  sx={{ height: 70 }}
                  value={loginDetail?.email}
                  onChange={inputValues}
                  name='email'
               />
               <br />
               <OutlinedInput
                  className="!bg-white !rounded-lg 2xl:!w-[35%] xl:!w-[48%] lg:!w-[54%]  mt-10 h-[70px]"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  endAdornment={
                     <InputAdornment position="end">
                        <IconButton
                           onClick={handleClickShowPassword}
                           edge="end"
                        >
                           {showPassword ?  <Visibility /> :<VisibilityOff />}
                        </IconButton>
                     </InputAdornment>
                  }
                  label="Password"
                  value={loginDetail?.password}
                  name='password'
                  onChange={inputValues}
               />
               <br/>
               <br/>
               {/* <div className="flex items-center justify-center mt-3 ">
                  <p className="2xl:mr-[180px] xl:mr-[120px] lg:mr-[100px]"> <Switch defaultChecked className="" style={{ color: 'white' }}   /> Remember me</p>
                  <p className="">Recover Password</p>
               </div> */}
               <Button className="!border !border-white !text-white !rounded-lg 2xl:!w-[35%] xl:!w-[48%] lg:!w-[54%]  !mt-5 h-[55px]" variant="outlined" onClick={loginButton}>Login </Button>
            </form>
         </div>
      </>
   );
};

export default LoginTextFieldsComponent;
