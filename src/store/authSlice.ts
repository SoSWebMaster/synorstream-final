// @ts-nocheck
import {createSlice} from '@reduxjs/toolkit';
import {authSlicetype} from './types';
import {getAPIConstants} from '../services/constants/getApiContants';
import {login} from '../services/loginService';
import {endPoints} from '../services/constants/endPoint';
import { inputType } from '../services/loginTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
export const userLogin = createAsyncThunk(
  endPoints?.login,
  async (data: inputType, thunkAPI) => {
    try {
      return await login(data);

      // eslint-disable-next-line
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.errors);
    }
  }
);


// initial states of slice
const initialState: authSlicetype = {
   user: {
    id: '',
    name:'',
    email: '',
  },
  redirect:false,
  result:false,
  link:'',
  error: null,
  success: false,
  loading: getAPIConstants.IDLE,
  token:'',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = getAPIConstants.PENDING;
    });
    builder.addCase(userLogin.fulfilled, (state, actions) => {

        const { id, name, email } = actions?.payload?.data?.user;
      return {
        user:{
            id:id,
            name:name,
            email:email,
        },
        link:actions?.payload?.data?.link,
        redirect:actions?.payload?.data?.redirect,
        result:actions?.payload?.data?.result,
        success: true,
        error: null,
        loading: getAPIConstants.FULLFILLED,
        token:actions?.payload?.data?.token,
      };
    });
    builder.addCase(userLogin.rejected, (state, actions) => {
      return {
        ...state,
        error: actions.payload,
        success: false,
        loading: getAPIConstants.REJECTED,
      };
    });
    builder.addCase('LOGOUT', () => initialState)
  },
});

export const authToken = (state:authSlicetype) => state.user.access_token;


export const loggedUser = (state:authSlicetype) => state.user;

export type authSlicetypes = typeof authSlice;

export default authSlice.reducer;