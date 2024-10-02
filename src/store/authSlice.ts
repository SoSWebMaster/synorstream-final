//@ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authSlicetype } from "./types";
import { getAPIConstants } from "../services/constants/getApiContants";
import { login } from "../services/loginService";
import { endPoints } from "../services/constants/endPoint";
import { inputType } from "../services/loginTypes";

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
      id: "",
      name: "",
      email: "",
   },
   redirect: false,
   result: false,
   link: "",
   error: null,
   success: false,
   loading: getAPIConstants.IDLE,
   token: "",
};

// Create the slice
export const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setUserId: (state, action) => {
         state.user.id = action.payload;
      },
      setUserName: (state, action) => {
         state.user.name = action.payload;
      },
      setUserEmail: (state, action) => {
         state.user.email = action.payload;
      },
      setUserToken: (state, action) => {
         state.token = action.payload;
      },
      setUserRedirect: (state, action) => {
         state.redirect = action.payload;
      },
      setUserLink: (state, action) => {
         state.link = action.payload;
      },
      setUserSuccess: (state, action) => {
         state.success = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(userLogin.pending, (state) => {
         state.loading = getAPIConstants.PENDING;
      });
      builder.addCase(userLogin.fulfilled, (state, action) => {
         const { user, token, link, redirect, result, plan_amount } =
            action.payload.data;

         state.user = {
            id: user?.id,
            name: user?.name,
            email: user?.email,
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
      builder.addCase("LOGOUT", () => initialState);
   },
});

// Export individual actions
export const {
   setUserId,
   setUserName,
   setUserEmail,
   setUserToken,
   setUserLink,
   setUserRedirect,
   setUserSuccess,
} = authSlice.actions;

export default authSlice.reducer;
