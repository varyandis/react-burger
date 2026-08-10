import { createSlice } from '@reduxjs/toolkit';

import {
  checkAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '@services/actions/auth-actions';

import type { RootState } from '@services/store';
import type { TUser } from '@utils/types';

type TAuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TAuthState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to register user';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to login';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to logout';
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to check auth';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to update user';
      });
  },
});

export const selectUser = (state: RootState): TUser | null => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.auth.isAuthChecked;
export const selectAuthLoading = (state: RootState): boolean => state.auth.isLoading;
export const selectAuthError = (state: RootState): string | null => state.auth.error;

export const authReducer = authSlice.reducer;
