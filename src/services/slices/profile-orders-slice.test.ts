import { profileWsActions } from '@services/ws-actions';

import { profileOrdersSlice } from './profile-orders-slice';
import { orderFixture } from './test-fixtures';

const profileOrdersReducer = profileOrdersSlice.reducer;

describe('profileOrdersReducer', () => {
  it('returns the initial state', () => {
    expect(profileOrdersReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      isConnecting: false,
      isConnected: false,
      hasReceived: false,
      error: null,
    });
  });

  it('handles websocket connection actions', () => {
    const connectingState = profileOrdersReducer(
      undefined,
      profileWsActions.connecting()
    );
    expect(connectingState).toEqual(
      expect.objectContaining({ isConnecting: true, hasReceived: false, error: null })
    );
    const openState = profileOrdersReducer(connectingState, profileWsActions.open());
    expect(openState).toEqual(
      expect.objectContaining({ isConnecting: false, isConnected: true })
    );
    expect(profileOrdersReducer(openState, profileWsActions.close())).toEqual(
      expect.objectContaining({
        isConnecting: false,
        isConnected: false,
        hasReceived: false,
      })
    );
  });

  it('handles websocket errors and messages', () => {
    expect(profileOrdersReducer(undefined, profileWsActions.error('Ошибка')).error).toBe(
      'Ошибка'
    );
    expect(
      profileOrdersReducer(undefined, {
        type: profileWsActions.message.type,
        payload: {
          success: true,
          orders: [orderFixture],
          total: 100,
          totalToday: 10,
        },
      })
    ).toEqual({
      orders: [orderFixture],
      isConnecting: false,
      isConnected: false,
      hasReceived: true,
      error: null,
    });
  });
});
