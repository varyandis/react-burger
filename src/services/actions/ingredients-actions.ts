import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredients();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load ingredients'
    );
  }
});
