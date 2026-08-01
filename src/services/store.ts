import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { createSocketMiddleware } from '@services/middleware/socket-middleware';
import { authSlice } from '@services/slices/auth-slice';
import { constructorSlice } from '@services/slices/constructor-slice';
import { feedSlice } from '@services/slices/feed-slice';
import { ingredientDetailsSlice } from '@services/slices/ingredient-details-slice';
import { ingredientsSlice } from '@services/slices/ingredients-slice';
import { orderSlice } from '@services/slices/order-slice';
import { profileOrdersSlice } from '@services/slices/profile-orders-slice';
import { feedWsActions, profileWsActions } from '@services/ws-actions';

export const rootReducer = combineSlices(
  authSlice,
  constructorSlice,
  ingredientDetailsSlice,
  ingredientsSlice,
  orderSlice,
  feedSlice,
  profileOrdersSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      createSocketMiddleware(feedWsActions),
      createSocketMiddleware(profileWsActions, { withToken: true })
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
