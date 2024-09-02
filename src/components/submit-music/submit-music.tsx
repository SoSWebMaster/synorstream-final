// @ts-nocheck
import Box from "@mui/material/Box";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { musicSchema } from "./musicSchema";
// const axiosInstance = useAxios();

interface ContactProp{
    name?: string,
    email?: string,
    subject?: string,
    comments?: string,
    phone?: string,
}
const SubmitMusicComponent = () => {
   const recaptcha = useRef();
   const [isLoading, setisLoading] = useState(false);
   const defaultValues = {
    name: "",
    email: "",
    music_link: "",
    bio: ""
   };
   const { control, formState, handleSubmit,reset } = useForm({
      mode: "onChange",
      defaultValues: defaultValues,
      resolver: yupResolver(musicSchema),
   });

   const { errors } = formState;

   const onSubmitData = async (data:ContactProp) => {
      setisLoading(true);
      const captchaValue = recaptcha?.current.getValue();
      if (!captchaValue) {
         toast.error("Please verify the reCAPTCHA!");
         setisLoading(false);
      } else {
         try {
            const response = await axiosInstance.post(
               endPoints?.submit_music_api,data
            );
            if (response.status === 200) {
               setisLoading(false);
               toast.success(`${response.data.response}`);
               reset();
               recaptcha.current?.reset()
            } else {
               toast.error("Failed to submit the form");
            }
         } catch (error) {
            setisLoading(false);
            toast.error(`${error}`);
            console.error("Error submitting the form", error);
         }
      }
   };

   return (
      <div>
         <div>
            <p className="text-[28px]">INTERESTED IN SUBMITTING MUSIC TO BE A PART OF OUR CATALOG? SUBMIT MUSIC BELOW!</p>
            <form onSubmit={handleSubmit(onSubmitData)}>
               <Box sx={{ marginTop: 2 }}>
                  <Controller
                     control={control}
                     name="name"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           error={!!errors.name}
                           helperText={errors?.name?.message}
                           variant="outlined"
                           fullWidth
                           placeholder="Name"
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
                     )}
                  />

                  <Controller
                     control={control}
                     name="email"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           error={!!errors.email}
                           helperText={errors?.email?.message}
                           variant="outlined"
                           fullWidth
                           className="!mt-6"
                           placeholder="Email"
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
                     )}
                  />

                    <Controller
                     control={control}
                     name="music_link"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           name="phone"
                           variant="outlined"
                           fullWidth
                           error={!!errors.music_link}
                           helperText={errors?.music_link?.message}
                           className="!mt-6"
                           placeholder="Link To Music"
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
                     )}
                  />
                   <Controller
                     control={control}
                     name="bio"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           variant="outlined"
                           className="!mt-6"
                           error={!!errors.bio}
                           helperText={errors?.bio?.message}
                           fullWidth
                           placeholder="Brief Bio"
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
                     )}
                  />

                  <div className="flex justify-center w-full mt-8">
                     <ReCAPTCHA
                        ref={recaptcha}
                        sitekey={import.meta.env.VITE_SITE_KEY}
                     />
                  </div>
                  <div className="flex justify-center w-full mt-6">
                     <Button
                        className="!bg-[#FB8A2E] !text-white !font-bold !w-40 !h-12"
                        type="submit"
                     >
                        Submit{" "}
                        {isLoading && (
                           <CircularProgress
                              color="info"
                              size={20}
                              className="ml-4"
                           />
                        )}
                     </Button>
                  </div>
               </Box>
            </form>
         </div>
      </div>
   );
};

export default SubmitMusicComponent;
