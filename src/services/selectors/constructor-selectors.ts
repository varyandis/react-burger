import { createSelector } from '@reduxjs/toolkit';

import type { TConstructorIngredient } from '@services/slices/constructor-slice';
import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

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
