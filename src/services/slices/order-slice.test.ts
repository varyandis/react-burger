import { createOrder } from '@services/actions/order-actions';

import { clearOrder, initialState, orderReducer } from './order-slice';

describe('orderReducer', () => {
  it('returns the initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles order creation lifecycle', () => {
    expect(orderReducer(undefined, { type: createOrder.pending.type })).toEqual({
      orderNumber: null,
      isLoading: true,
      error: null,
    });
    expect(
      orderReducer(undefined, { type: createOrder.fulfilled.type, payload: 42 })
    ).toEqual({ orderNumber: 42, isLoading: false, error: null });
    expect(
      orderReducer(undefined, {
        type: createOrder.rejected.type,
        payload: 'Ошибка заказа',
      })
    ).toEqual({ orderNumber: null, isLoading: false, error: 'Ошибка заказа' });
  });

  it('clears an order', () => {
    const state = orderReducer(undefined, {
      type: createOrder.fulfilled.type,
      payload: 42,
    });
    expect(orderReducer(state, clearOrder())).toEqual({
      orderNumber: null,
      isLoading: false,
      error: null,
    });
  });
});
