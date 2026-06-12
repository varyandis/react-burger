import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: '',
};

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

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to load ingredients';
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
