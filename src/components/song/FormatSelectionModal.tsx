import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { IoMusicalNotes } from "react-icons/io5";
import { GiSoundWaves } from "react-icons/gi";

interface FormatSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (format: string) => void;
}

const FormatSelectionModal: React.FC<FormatSelectionModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{
        bgcolor: "#2D2D2D",
        borderTop: "1px solid #000",
        color: "#fff",
      }} >Select Format</DialogTitle>
      <DialogContent sx={{ bgcolor: "#2D2D2D", color: "#fff" }}  >
        <p>Please select the format you want to download:</p>
        <div className="flex items-center justify-center mt-5 gap-5" >
          <Button onClick={() => onConfirm("mp3")} className="!bg-[#FB8A2E] !text-white !p-2 !px-4 !rounded-3xl"  >
            <IoMusicalNotes size={22} style={{ marginRight: '5px' }} />
            MP3
          </Button>
          <Button onClick={() => onConfirm("wav")} className="!bg-[#FB8A2E] !text-white !p-2 !px-4 !rounded-3xl">
            <GiSoundWaves size={22} style={{ marginRight: '5px' }} />
            WAV
          </Button>
        </div>
      </DialogContent>
      <DialogActions sx={{
        bgcolor: "#2D2D2D",
        borderBottom: "1px solid #000",
        color: "#fff",
      }}  >

        <Button onClick={onClose} className="!text-white">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormatSelectionModal;
