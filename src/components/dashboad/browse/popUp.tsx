// @ts-nocheck
import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PlayListCard from "../playlist/playListCards";
import ScrollMenuComponent from "../../musicSection";
import useAxios from '../../../services/axiosConfig/axiosConfig';
import { endPoints } from '../../../services/constants/endPoint';
import { toast } from 'react-toastify';
import { PlayListTypes } from '../../../store/types'; // Import the type

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

interface PlaylistPopUpProps {
    open: boolean;
    setOpenModalState?: () => void;
    setCloseModalState?: () => void;
    songId?: number; // Add songId prop
}

const PlaylistPopUp: React.FC<PlaylistPopUpProps> = ({ open, setOpenModalState, setCloseModalState, songId }) => {
    const axiosInstance = useAxios();

    const handleSelect = async (playlist: PlayListTypes) => {
        if (!playlist.id || !songId) {
            toast.error("Missing playlist or song information");
            return;
        }

        try {
            const response = await axiosInstance.post(endPoints?.add_to_fav2, {
                playlist_id: playlist.id,
                id: songId,
                type: 'playl'
            });
            if (response?.data) {
                toast.success("Song added to playlist successfully");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }

        // Close the modal after selecting the playlist
        handleClose();
    };

    // const handleOpen = () => {
    //     if (setOpenModalState) {
    //         setOpenModalState();
    //     }
    // };

    const handleClose = () => {
        if (setCloseModalState) {
            setCloseModalState();
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <button
                        className="flex items-center justify-end w-full text-white"
                        onClick={handleClose}
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-[25px]" />
                    </button>

                    <ScrollMenuComponent>
                        <PlayListCard onSelect={handleSelect} onClose={handleClose} />
                    </ScrollMenuComponent>
                </Box>
            </Modal>
        </div>
    );
};

export default PlaylistPopUp;
