import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrder as createOrderApi } from '@utils/api';

export const createOrder = createAsyncThunk<number, string[], { rejectValue: string }>(
  'order/createOrder',
  async (ingredients, { rejectWithValue }) => {
    try {
      return await createOrderApi(ingredients);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create order'
      );
    }
  }
);
