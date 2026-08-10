import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from '@services/actions/ingredients-actions';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: '',
};

export const ingredientsSlice = createSlice({
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
