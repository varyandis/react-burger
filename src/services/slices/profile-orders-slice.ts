import { createSlice } from '@reduxjs/toolkit';

import { profileWsActions } from '@services/ws-actions';

import type { TOrder } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  isConnecting: boolean;
  isConnected: boolean;
  hasReceived: boolean;
  error: string | null;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  isConnecting: false,
  isConnected: false,
  hasReceived: false,
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
        state.hasReceived = false;
        state.error = null;
      })
      .addCase(profileWsActions.open, (state) => {
        state.isConnecting = false;
        state.isConnected = true;
      })
      .addCase(profileWsActions.close, (state) => {
        state.isConnecting = false;
        state.isConnected = false;
        state.hasReceived = false;
      })
      .addCase(profileWsActions.error, (state, action) => {
        state.error = action.payload;
      })
      .addCase(profileWsActions.message, (state, action) => {
        state.hasReceived = true;
        state.orders = action.payload.orders;
        state.error = null;
      });
  },
});
