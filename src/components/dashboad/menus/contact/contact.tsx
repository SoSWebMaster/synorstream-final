import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { endPoints } from "../../../../services/constants/endPoint";
import useAxios from "../../../../services/axiosConfig/axiosConfig";
import { toast } from "react-toastify";

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

const axiosInstance = useAxios();

const ContactUs = ({ open, setCloseModalState }: any) => {
    const [contactDetails, setContactDetails] = useState({
        name: "",
        email: "",
        subject: "",
        comments: "",
        phone: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setisLoading] = useState(false);

    const handleClose = () => {
        setSuccessMessage("");
        setCloseModalState();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const onSubmitData = async () => {
        setisLoading(true)
        try {
            const response = await axiosInstance.post(endPoints?.contact_submit, {
                details: contactDetails
            });

            if (response.status === 200) {
                setisLoading(false)
              toast.success(`${response.data.message}`);
                setSuccessMessage("Details submitted");
                setTimeout(handleClose);
            } else {
                console.error("Failed to submit the form");
            }
        } catch (error) {
            setisLoading(false)
            toast.error(`${error}`)
            console.error("Error submitting the form", error);
        }
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <button className="flex items-center justify-end w-full text-white" onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} className="text-[25px]" />
                    </button>
                    <p className="text-[28px]">Contact Us</p>
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
                            placeholder="Phone No."
                            className="!mt-6"
                            value={contactDetails?.phone}
                            name="phone"
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
                            placeholder="Subject"
                            className="!mt-6"
                            value={contactDetails?.subject}
                            name="subject"
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
                            placeholder="Comments"
                            className="!mt-6"
                            value={contactDetails?.comments}
                            name="comments"
                            onChange={handleChange}
                            rows={5}
                            multiline
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
                                Submit {isLoading &&   <CircularProgress color="info" size={20}  className="ml-4" />}
                            </Button>
                        </div>
                        {successMessage && (
                            <Typography sx={{ color: '#FB8A2E', marginTop: 2, textAlign: 'center' }}>
                                {successMessage}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ContactUs;
