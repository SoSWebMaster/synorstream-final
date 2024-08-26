 // @ts-nocheck
import { inputType } from './loginTypes';
import { endPoints } from './constants/endPoint';
import { toast } from 'react-toastify';
import axiosInstance from './axiosConfig/axiosConfigSimple';

export const login = async (data: inputType) => {
  try {
    const response = await axiosInstance.post(endPoints.login, data);
    return response;
  } catch (error) {
    if(error?.response?.data?.errors){
        toast.error(error?.response?.data?.errors?.email[0]);
    }
    else{
        toast.error(error?.response?.data?.message);
    }
  }
};
