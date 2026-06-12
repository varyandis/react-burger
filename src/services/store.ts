import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { constructorSlice } from '@services/slices/constructor-slice';
import { ingredientDetailsSlice } from '@services/slices/ingredient-details-slice';
import { ingredientsSlice } from '@services/slices/ingredients-slice';
import { orderSlice } from '@services/slices/order-slice';

const rootReducer = combineSlices(
  constructorSlice,
  ingredientDetailsSlice,
  ingredientsSlice,
  orderSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
