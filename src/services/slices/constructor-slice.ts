import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const createConstructorIngredient = (
  ingredient: TIngredient
): TConstructorIngredient => ({
  ...ingredient,
  constructorId: nanoid(),
});

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    initializeConstructor: (state, action: PayloadAction<TIngredient[]>) => {
      state.bun = action.payload.find((ingredient) => ingredient.type === 'bun') ?? null;
      state.ingredients = action.payload
        .filter((ingredient) => ingredient.type !== 'bun')
        .slice(0, 5)
        .map(createConstructorIngredient);
    },
    chooseBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
        return;
      }

      state.ingredients.push(createConstructorIngredient(action.payload));
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },
    clearConstructor: () => initialState,
  },
});

export const {
  addIngredient,
  chooseBun,
  clearConstructor,
  initializeConstructor,
  removeIngredient,
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
