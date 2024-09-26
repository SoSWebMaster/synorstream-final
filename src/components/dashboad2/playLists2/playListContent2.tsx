import * as React from "react";
import PlayListCard2 from "./playListCard2";
import ModalComponent2 from "../modalComponent2";

interface PlayListContent2 {
   searchQuery: string
}

const PlayListContent2: React.FC<PlayListContent2> = ({ searchQuery }) => {
   const [openModal, setOpenModal] = React.useState(Boolean);
   return (
      <>
         <ModalComponent2 open={openModal} setOpen={setOpenModal} />
         <div className="flex items-center justify-between mb-10 ">
            <p className="text-[24px] font-semibold">Your PlayLists</p>
            <button
               className="w-[232px] h-[54px] text-white bg-primary-blue rounded-xl"
               onClick={() => {
                  setOpenModal(!openModal);
               }}
            >
               Add New
            </button>
         </div>
         <PlayListCard2 searchQuery={searchQuery} openState={openModal} />
      </>
   );
};

export default PlayListContent2;
