import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import useAxios from "../../services/axiosConfig/axiosConfig";
import { endPoints } from "../../services/constants/endPoint";
import "./profilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import DashboardComponent2 from "../dashboad2";

const EditProfile = () => {
    const [contactDetails, setContactDetails] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        company: "",
        vat: "",
        billing: "",
    });
    const [userData, setUserData] = useState<any>(null);
    const [parsedData, setParsedData] = useState<any>(null); // State for parsed JSON data
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
                setUserData(response?.data);

                // Parse JSON data
                const profileInfo = response?.data?.user?.profile_info || "{}";
                const parsedProfileInfo = JSON.parse(profileInfo);
                setParsedData(parsedProfileInfo);

                setContactDetails((prevDetails) => ({
                    ...prevDetails,
                    id: response?.data?.user?.id || null,
                    name: response?.data?.user?.name || "",
                    email: response?.data?.user?.email || "",
                    password: "",
                    company: parsedProfileInfo?.company || "",
                    vat: parsedProfileInfo?.vat || "",
                    billing: parsedProfileInfo?.billing_address || "",
                }));
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [isEditing]);

    const openModal = () => {
        setIsEditing((prev) => !prev);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const onSubmitData = async () => {
        try {
            const result = await axiosInstance.post(endPoints.update_profile, contactDetails);
            if (result?.data) {
                setIsEditing((prev) => !prev);
                setContactDetails({
                    id: null,
                    name: "",
                    email: "",
                    password: "",
                    company: "",
                    vat: "",
                    billing: "",
                });
                toast.success(result?.data?.msg);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile.");
        }
    };

    return (
        <DashboardComponent2>
            <div className="p-10 bg-[url('/static/images/Website-Background.png')] !h-full">
                <h1 className="text-[28px] font-bold">My Profile</h1>
                <div className="w-full">
                    <div className="w-[500px] p-6">
                        <div className="flex justify-between mb-6">
                            <p className="text-[22px] font-semibold">Full Name</p>
                            <h2 className="text-[18px] font-medium">{userData?.user?.name}</h2>
                        </div>
                        <div className="flex justify-between mb-6">
                            <p className="text-[22px] font-semibold">Email</p>
                            <p className="text-[18px] font-medium">{userData?.user?.email}</p>
                        </div>
                        <div className="flex justify-between mb-6">
                            <p className="text-[22px] font-semibold">Password</p>
                            <p className="text-[18px] font-medium">**************</p>
                        </div>
                        <div className="flex justify-between mb-6">
                            <p className="text-[22px] font-semibold">Company</p>
                            <p className="text-[18px] font-medium">{parsedData?.company || "N/A"}</p>
                        </div>
                        <div className="flex justify-between mb-6">
                            <p className="text-[22px] font-semibold">VAT Number</p>
                            <p className="text-[18px] font-medium">{parsedData?.vat || "N/A"}</p>
                        </div>
                        <div className="flex justify-between mb-6">
                            <p className="text-[22px] font-semibold">Billing Address</p>
                            <p className="text-[18px] font-medium">{parsedData?.billing_address || "N/A"}</p>
                        </div>
                        <Button className="!bg-[#FB8A2E] !text-white !h-10" onClick={openModal}>
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
                                    sx={{ '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'white' } }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FB8A2E' }, '&:hover fieldset': { borderColor: '#FB8A2E' }, '&.Mui-focused fieldset': { borderColor: '#FB8A2E' } } }}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Email"
                                    className="!mt-6"
                                    value={contactDetails?.email}
                                    name="email"
                                    onChange={handleChange}
                                    sx={{ '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'white' } }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FB8A2E' }, '&:hover fieldset': { borderColor: '#FB8A2E' }, '&.Mui-focused fieldset': { borderColor: '#FB8A2E' } } }}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Company (Optional)"
                                    className="!mt-6"
                                    value={contactDetails?.company}
                                    name="company"
                                    onChange={handleChange}
                                    sx={{ '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'white' } }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FB8A2E' }, '&:hover fieldset': { borderColor: '#FB8A2E' }, '&.Mui-focused fieldset': { borderColor: '#FB8A2E' } } }}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="VAT Number (Optional)"
                                    className="!mt-6"
                                    value={contactDetails?.vat}
                                    name="vat"
                                    onChange={handleChange}
                                    sx={{ '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'white' } }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FB8A2E' }, '&:hover fieldset': { borderColor: '#FB8A2E' }, '&.Mui-focused fieldset': { borderColor: '#FB8A2E' } } }}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Billing Address (Optional)"
                                    className="!mt-6"
                                    value={contactDetails?.billing}
                                    name="billing"
                                    onChange={handleChange}
                                    sx={{ '& .MuiInputBase-input': { color: 'white', '&::placeholder': { color: 'white' } }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FB8A2E' }, '&:hover fieldset': { borderColor: '#FB8A2E' }, '&.Mui-focused fieldset': { borderColor: '#FB8A2E' } } }}
                                />
                                <Button className="!bg-[#FB8A2E] !text-white !h-12 mt-6 w-full" onClick={onSubmitData}>
                                    Update Profile
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                )}
            </div>
        </DashboardComponent2>
    );
};

export default EditProfile;
