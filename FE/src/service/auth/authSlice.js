import { createSlice } from '@reduxjs/toolkit';
import { getAuthFromStorage } from "./storage";

const stored = getAuthFromStorage();

const initialState = {
  user: stored.user,
  access_token: stored.access_token,
  isAuthenticated: Boolean(stored.access_token && stored.user),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;