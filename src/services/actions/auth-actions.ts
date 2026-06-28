import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getAccessToken,
  getRefreshToken,
  getUserApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  removeTokens,
  setTokens,
  updateUserApi,
} from '@utils/api';

import type {
  TAuthRequest,
  TRegisterUserRequest,
  TUpdateUserRequest,
  TUser,
} from '@utils/types';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterUserRequest,
  { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(userData);
    setTokens(response);

    return response.user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to register user'
    );
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TAuthRequest,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(credentials);
    setTokens(response);

    return response.user;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to login');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUserApi();
      removeTokens();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to logout'
      );
    }
  }
);

export const checkAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    return await getUserApi();
  } catch (error) {
    removeTokens();

    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to check auth'
    );
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  TUpdateUserRequest,
  { rejectValue: string }
>('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    return await updateUserApi(userData);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to update user'
    );
  }
});
