import { createSlice } from '@reduxjs/toolkit';

import { feedWsActions } from '@services/ws-actions';

import type { TOrder } from '@utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnecting: false,
  isConnected: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedWsActions.connecting, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(feedWsActions.open, (state) => {
        state.isConnecting = false;
        state.isConnected = true;
      })
      .addCase(feedWsActions.close, (state) => {
        state.isConnecting = false;
        state.isConnected = false;
      })
      .addCase(feedWsActions.error, (state, action) => {
        state.error = action.payload;
      })
      .addCase(feedWsActions.message, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      });
  },
});
