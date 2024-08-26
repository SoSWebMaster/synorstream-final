import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import useAxios from "../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../services/constants/endPoint";

import "./profilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const EditProfile = () => {
    const [contactDetails, setContactDetails] = useState({
        id:null,
        name: "",
        email: "",
        password: "",
        company: "",
        vat: "",
        billing: "",
    });
   const [userData, setUserData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isEditing, setIsEditing] = useState(false);
   const axiosInstance = useAxios();
   const style = {
    position: "absolute" as "absolute",
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

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const response = await axiosInstance.get(endPoints.profile);
            console.log(response?.data,"response")
            setContactDetails((prevDetails: any) => ({
                ...prevDetails, 
                id: userData?.user?.id || null,
                name: userData?.user?.name || "",
                email: userData?.user?.email || "",
                password: "",
                company: "",
                vat: "",
                billing: ""
            }));
         
            setUserData(response?.data)
         } catch (error) {
            console.error("Error fetching user data:", error);
            setError("Failed to load profile data.");
         } finally {
            setLoading(false);
         }
      };

      fetchUserData();
   }, [isEditing]);

   const openModal=()=>{
    setContactDetails((prevDetails: any) => ({
        ...prevDetails,
        ['id']: userData?.user?.id,
    }));
    setIsEditing(prev=>!prev)
   }

   if (loading) {
      return <p>Loading...</p>;
   }

   if (error) {
      return <p>{error}</p>;
   }


   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactDetails((prevDetails: any) => ({
        ...prevDetails,
        [name]: value,
    }));
};

const onSubmitData= async ()=>{
    console.log(contactDetails, "contactDetails");
    try {
        const result = await axiosInstance.post(endPoints.update_profile,contactDetails);
        if(result?.data){
            setIsEditing(prev=>!prev);
            setContactDetails({
                id:null,
                name: "",
                email: "",
                password: "",
                company: "",
                vat: "",
                billing: "",
            });
            toast.success(result?.data?.msg)
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        setError("Failed to update profile.");
     }
    return;
   }

   return (
      <div className="p-10">
         <h1 className="text-[28px] font-bold">My Profile</h1>
            <div className=" w-full ">
                <div className=" w-[500px] p-6">
                <div className="flex justify-between  mb-6">
                    <p className="text-[22px] font-semibold">Full Name</p>
                    <h2 className="text-[18px] font-medium">{userData?.user?.name}</h2>
                </div>
                <div className="flex justify-between  mb-6">
                    <p className="text-[22px] font-semibold">Email</p>
                    <p className="text-[18px] font-medium">{userData?.user?.email}</p>
                </div>
                <div className="flex justify-between  mb-6">
                    <p className="text-[22px] font-semibold">Password</p>
                    <p className="text-[18px] font-medium">**************</p>
                </div>
                <div className="flex justify-between  mb-6">
                    <p className="text-[22px] font-semibold">Company </p>
                    <p className="text-[18px] font-medium">Company (Optional)</p>
                </div>
                <div className="flex justify-between  mb-6">
                    <p className="text-[22px] font-semibold">VAT Number</p>
                    <p className="text-[18px] font-medium">VAT Number (Optional)</p>
                </div>
                <div className="flex justify-between  mb-6">
                    <p className="text-[22px] font-semibold">Billing Address</p>
                    <p className="text-[18px] font-medium">Billing Address (Optional)</p>
                </div>
               <Button
                  className="!bg-[#FB8A2E] !text-white !h-10"
                  onClick={openModal}
               >
                  Edit Profile
               </Button>
                </div>
               
            </div>

            {isEditing && (
                   <Modal open={isEditing} onClose={openModal}>
                   <Box sx={style}>
                       <button className="flex items-center justify-end w-full text-white" onClick={openModal}>
                           <FontAwesomeIcon icon={faXmark} className="text-[25px]" />
                       </button>
                       <p className="text-[28px]">Edit Profile</p>
                       <Box sx={{ marginTop: 2 }}>
                           <TextField
                               variant="outlined"
                               fullWidth
                               placeholder="Name"
                               value={contactDetails?.name}
                               name="name"
                               onChange={handleChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white',
                                       '&::placeholder': {
                                           color: 'white',
                                       },
                                   },
                                   '& .MuiOutlinedInput-root': {
                                       '& fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                   },
                               }}
                           />
                           <TextField
                               variant="outlined"
                               fullWidth
                               placeholder="Email"
                               className="!mt-6"
                               value={contactDetails?.email}
                               name="email"
                               onChange={handleChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white',
                                       '&::placeholder': {
                                           color: 'white',
                                       },
                                   },
                                   '& .MuiOutlinedInput-root': {
                                       '& fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                   },
                               }}
                           />
                           <TextField
                               variant="outlined"
                               fullWidth
                               placeholder="Password"
                               className="!mt-6"
                               value={contactDetails?.password}
                               name="password"
                               onChange={handleChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white',
                                       '&::placeholder': {
                                           color: 'white',
                                       },
                                   },
                                   '& .MuiOutlinedInput-root': {
                                       '& fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                   },
                               }}
                           />
                           <TextField
                               variant="outlined"
                               fullWidth
                               placeholder="Company (Optional)"
                               className="!mt-6"
                               value={contactDetails?.company}
                               name="company"
                               onChange={handleChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white',
                                       '&::placeholder': {
                                           color: 'white',
                                       },
                                   },
                                   '& .MuiOutlinedInput-root': {
                                       '& fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                   },
                               }}
                           />
                           <TextField
                               variant="outlined"
                               fullWidth
                               placeholder="VAT Number (Optional)"
                               className="!mt-6"
                               value={contactDetails?.vat}
                               name="vat"
                               onChange={handleChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white',
                                       '&::placeholder': {
                                           color: 'white',
                                       },
                                   },
                                   '& .MuiOutlinedInput-root': {
                                       '& fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                   },
                               }}
                           />

                            <TextField
                               variant="outlined"
                               fullWidth
                               placeholder="Billing Address (Optional)"
                               className="!mt-6"
                               value={contactDetails?.billing}
                               name="billing"
                               onChange={handleChange}
                               sx={{
                                   '& .MuiInputBase-input': {
                                       color: 'white',
                                       '&::placeholder': {
                                           color: 'white',
                                       },
                                   },
                                   '& .MuiOutlinedInput-root': {
                                       '& fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&:hover fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                       '&.Mui-focused fieldset': {
                                           borderColor: '#FB8A2E',
                                           color: 'white',
                                       },
                                   },
                               }}
                           />
                           <div className="flex justify-center w-full mt-6">
                               <Button className="!bg-[#FB8A2E] !text-white !font-bold !w-40 !h-12" onClick={onSubmitData}>
                                   Submit
                               </Button>
                           </div>
                       </Box>
                   </Box>
               </Modal>
            )}
      </div>
   );
}


export default EditProfile
