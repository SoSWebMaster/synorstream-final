// @ts-nocheck
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authSlicetype } from './types';
import { getAPIConstants } from '../services/constants/getApiContants';
import { login } from '../services/loginService';
import { endPoints } from '../services/constants/endPoint';
import { inputType } from '../services/loginTypes';

// Create the async thunk for user login
export const userLogin = createAsyncThunk(
  endPoints?.login,
  async (data: inputType, thunkAPI) => {
    try {
      return await login(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.errors);
    }
  }
);

// Initial state of the slice
const initialState: authSlicetype = {
  user: {
    id: '',
    name: '',
    email: '',
  },
  redirect: false,
  result: false,
  link: '',
  error: null,
  success: false,
  loading: getAPIConstants.IDLE,
  token: '',
};

// Create the slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = getAPIConstants.PENDING;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      const { id, name, email, token, link, redirect, result } = action.payload.data;

      // Update the state directly
      state.user = {
        id,
        name,
        email,
      };
      state.link = link;
      state.redirect = redirect;
      state.result = result;
      state.success = true;
      state.error = null;
      state.loading = getAPIConstants.FULLFILLED;
      state.token = token;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.error = action.payload;
      state.success = false;
      state.loading = getAPIConstants.REJECTED;
    });
    builder.addCase('LOGOUT', () => initialState);
  },
});

// Selectors
export const authToken = (state: authSlicetype) => state.token;
export const loggedUser = (state: authSlicetype) => state.user;

export type authSlicetypes = typeof authSlice;

export default authSlice.reducer;
