// @ts-nocheck
import * as React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import { SxProps, Theme } from '@mui/material/styles';
import useAxios from '../../services/axiosConfig/axiosConfig';
// import React, { useState } from 'react';

import { endPoints } from '../../services/constants/endPoint';

// import './styles.css'; // Import your CSS file here

// Define styles
const modalStyle: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'black', // Set background color to black
  color: 'white', // Ensure text is white for contrast
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: '1rem', // Equivalent to rounded-xl
};

const footerStyle: SxProps<Theme> = {
  marginTop: 'auto',
  display: 'flex',
  justifyContent: 'flex-end',
};

interface ModalComponentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ open, setOpen }) => {
  const [playlistName, setPlaylistName] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const axiosInstance=useAxios();


  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!playlistName.trim()) {
      // Optionally handle validation for empty input
      alert('Playlist name is required');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(endPoints.add_playlist, { val: playlistName });

      handleClose();
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error adding playlist:', error);
      alert('Failed to add playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle} className="text-black">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Enter Playlist Name.
            </Typography>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '& input': { color: 'white' },
                },
              }}
            />
            <Box sx={footerStyle}>
              <Button
                variant="contained"
                className="text-white bg-primary-blue rounded-xl"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default ModalComponent;
