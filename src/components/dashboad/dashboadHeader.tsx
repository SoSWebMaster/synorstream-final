// @ts-nocheck
import Logo from '/static/images/SoS_Logo.png';
import User from '/static/images/ei_user.png';
import { useAppSelector, useAppDispatch } from '../../store';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import { updateMusicType, updatePlainAnnualPrice, updatePlainId, updatePlainMonthlyPrice, updateSearch, updateSinglePage, updateSongType } from '../../store/music-store';
import ContactUs from './menus/contact/contact';
import { updateSideBar } from '../../store/music-store';
import { useNavigate } from 'react-router-dom';

const DashboadHeader = () => {
    const currentUrl = window.location.href;
    const navigate=useNavigate();
    const [openModal, setOpenModal] = React.useState(false);
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch(); 
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const urlSegments = currentUrl.split('/');
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (name:string='') => {
        setAnchorEl(null);
        dispatch(updateSideBar(name));
    };
    const setCloseModalState=()=>{
        setAnchorEl(null);
        setOpenModal(prev=>!prev);
     }

    const Logout = () => {
        setAnchorEl(null);
        dispatch(updateSinglePage(''));
        dispatch(updateSideBar(''));
        dispatch(updatePlainAnnualPrice(null))
        dispatch(updatePlainMonthlyPrice(null))
        dispatch(updateMusicType(''))
        dispatch(updatePlainId(null));
        dispatch(updateSearch(''));
        dispatch(updateSongType(0));
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <>
            <div className='flex !items-center !justify-between 2xl:px-52 xl:px-36 lg:px-28 py-10'>
                <img src={Logo} alt="logo" className='w-[290px] h-[42px] cursor-pointer' onClick={()=>navigate('/dashboard')}/>
                <div className='flex justify-end w-full'>
                    <p className='flex items-center justify-center cursor-pointer' onClick={()=>navigate('/dashboard')}>
                        <span><img src={User} alt="user avatar" /></span> Welcome {user?.name}
                    </p>
                    {/* @ts-ignore  */}
                    {urlSegments[3]==='dashboard' && (
                        <>
                           <ExpandMoreIcon onClick={handleClick} className='mt-3 ml-2 cursor-pointer' />
                           <Menu
                               id="fade-menu"
                               MenuListProps={{
                                   'aria-labelledby': 'fade-button',
                               }}
                               anchorEl={anchorEl}
                               open={open}
                               onClose={()=>handleClose()}
                               TransitionComponent={Fade}
                           >
                               <MenuItem onClick={()=>handleClose('profile')}>Profile</MenuItem>
                               <MenuItem onClick={()=>handleClose('billing')}>Billing</MenuItem>
                               <MenuItem onClick={()=>handleClose('myplan')}>My Plan</MenuItem>
                               <MenuItem onClick={setCloseModalState}>Contact Us</MenuItem>
                               <MenuItem onClick={Logout}>Logout</MenuItem>
                           </Menu>
                           </>
                    )}
             
                </div>
            </div>
            {openModal && <ContactUs  open={openModal} setCloseModalState={setCloseModalState} />}   
        </>
    );
};

export default DashboadHeader;
