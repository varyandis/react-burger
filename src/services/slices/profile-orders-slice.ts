import { createSlice } from '@reduxjs/toolkit';

import { profileWsActions } from '@services/ws-actions';

import type { TOrder } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isConnecting: false,
  isConnected: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileWsActions.connecting, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(profileWsActions.open, (state) => {
        state.isConnecting = false;
        state.isConnected = true;
      })
      .addCase(profileWsActions.close, (state) => {
        state.isConnecting = false;
        state.isConnected = false;
      })
      .addCase(profileWsActions.error, (state, action) => {
        state.error = action.payload;
      })
      .addCase(profileWsActions.message, (state, action) => {
        state.orders = action.payload.orders;
        state.error = null;
      });
  },
});
