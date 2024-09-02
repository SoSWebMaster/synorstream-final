import * as React from 'react';
import PlayListCard from "./playListCards";
import ModalComponent from "../../dashboad2/modalComponent";

const PlayListContent=()=>{
    const [openModal, setOpenModal] = React.useState(Boolean);
    return (
        <>
        <ModalComponent open={openModal} setOpen={setOpenModal}/>
            <div className="flex items-center justify-between mb-10">
                <p className="text-[24px] font-semibold">Your PlayLists</p>
                <button className="w-[232px] h-[54px] text-white bg-primary-blue rounded-xl" onClick={()=>{setOpenModal(!openModal)}}>Add New</button>
            </div>
            <PlayListCard openState={openModal}/>
        </>
    )
}

export default PlayListContent;
