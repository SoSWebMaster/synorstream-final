// @ts-nocheck
import { useEffect, useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { Button, TextField } from '@mui/material';
import useAxios from "../services/axiosConfig/axiosConfig"
import { endPoints } from '../services/constants/endPoint';
import DashboardComponent from '../components/dashboad';
import EditProfile from '../components/editProfileSection/editProfile';

import './profilePage.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profileInfo, setProfileInfo] = useState('');
    const [avatar, setAvatar] = useState('');
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get(endPoints.profile);
                // Adjust this endpoint to match your API
                setUserData(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setProfileInfo(response.data.profile_info);
                setAvatar(response.data.avatar || '/default-avatar.png');
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    const handleSave = async () => {
        try {
            const result =  await axiosInstance.post(endPoints.update_profile, { name, email, profile_info: profileInfo });

            setUserData({ ...userData, name, email, profile_info: profileInfo });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
      <DashboardComponent>
        <EditProfile/>
      </DashboardComponent>
        
    );
};

export default ProfilePage;
