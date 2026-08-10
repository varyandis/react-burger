import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    chooseBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          constructorId: nanoid(),
        },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;
      const [ingredient] = state.ingredients.splice(fromIndex, 1);

      if (!ingredient) {
        return;
      }

      state.ingredients.splice(toIndex, 0, ingredient);
    },
    clearConstructor: () => initialState,
  },
});

export const {
  addIngredient,
  chooseBun,
  clearConstructor,
  moveIngredient,
  removeIngredient,
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;

export const selectConstructorBun = (state: RootState): TIngredient | null =>
  state.burgerConstructor.bun;

export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectIngredientCounters = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): Record<string, number> => {
    const counters: Record<string, number> = {};

    if (bun) {
      counters[bun._id] = 2;
    }

    ingredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });

    return counters;
  }
);

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): number => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }
);
