// @ts-nocheck
import Box from "@mui/material/Box";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useRef, useState } from "react";
import axiosInstance from "../../services/axiosConfig/axiosConfigSimple";
import { endPoints } from "../../services/constants/endPoint";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { contactSchema } from "./yupSchema";
// const axiosInstance = useAxios();
// @ts-nocheck
interface ContactProp {
   name?: string,
   email?: string,
   subject?: string,
   comments?: string,
   phone?: string,
}
const ContactUsComponent = () => {


   const recaptcha = useRef();
   const [isLoading, setisLoading] = useState(false);
   const defaultValues = {
      name: "",
      email: "",
      subject: "",
      comments: "",
      phone: "",
   };
   const { control, formState, handleSubmit, reset } = useForm({
      mode: "onChange",
      defaultValues: defaultValues,
      resolver: yupResolver(contactSchema),
   });

   const { errors } = formState;

   console.log(errors, "errors")

   const onSubmitData = async (data: ContactProp) => {
      setisLoading(true);
      // @ts-ignore
      const captchaValue = recaptcha?.current.getValue();
      if (!captchaValue) {
         toast.error("Please verify the reCAPTCHA!");
         setisLoading(false);
      } else {
         try {
            const response = await axiosInstance.post(
               endPoints?.contact_submit, {
               details: data
            }
            );

            if (response.status === 200) {
               setisLoading(false);
               toast.success(`${response.data.message}`);
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
            <p className="text-[28px]">Contact Us</p>
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
                     name="phone"
                     rules={{
                        required: "Phone number is required",
                        pattern: {
                           value: /^[0-9\b]+$/,
                           message: "Phone number is not valid",
                        },
                        minLength: {
                           value: 10,
                           message: "Phone number must be at least 10 digits",
                        },
                     }}
                     render={({ field }) => (
                        <TextField
                           {...field}
                           name="phone"
                           variant="outlined"
                           fullWidth
                           error={!!errors.phone}
                           helperText={errors?.phone?.message}
                           className="!mt-6"
                           placeholder="Phone No"
                           inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }} // Restrict input to numbers
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
                     name="subject"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           name="subject"
                           variant="outlined"
                           className="!mt-6"
                           error={!!errors.subject}
                           helperText={errors?.subject?.message}
                           fullWidth
                           placeholder="Subject"
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
                     name="comments"
                     render={({ field }) => (
                        <TextField
                           {...field}
                           variant="outlined"
                           fullWidth
                           placeholder="Comments"
                           className="!mt-6"
                           error={!!errors.comments}
                           helperText={errors?.comments?.message}
                           multiline
                           rows={5}
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

export default ContactUsComponent;
