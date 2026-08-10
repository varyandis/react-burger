import { feedWsActions } from '@services/ws-actions';

import { feedSlice, initialState } from './feed-slice';
import { orderFixture } from './test-fixtures';

const feedReducer = feedSlice.reducer;

describe('feedReducer', () => {
  it('returns the initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles websocket connection actions', () => {
    const connectingState = feedReducer(undefined, feedWsActions.connecting());
    expect(connectingState).toEqual(
      expect.objectContaining({ isConnecting: true, hasReceived: false, error: null })
    );
    const openState = feedReducer(connectingState, feedWsActions.open());
    expect(openState).toEqual(
      expect.objectContaining({ isConnecting: false, isConnected: true })
    );
    const closeState = feedReducer(openState, feedWsActions.close());
    expect(closeState).toEqual(
      expect.objectContaining({
        isConnecting: false,
        isConnected: false,
        hasReceived: false,
      })
    );
  });

  it('handles websocket errors and messages', () => {
    expect(feedReducer(undefined, feedWsActions.error('Ошибка')).error).toBe('Ошибка');
    expect(
      feedReducer(undefined, {
        type: feedWsActions.message.type,
        payload: {
          success: true,
          orders: [orderFixture],
          total: 100,
          totalToday: 10,
        },
      })
    ).toEqual({
      orders: [orderFixture],
      total: 100,
      totalToday: 10,
      isConnecting: false,
      isConnected: false,
      hasReceived: true,
      error: null,
    });
  });
});
