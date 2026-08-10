import {
  checkAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '@services/actions/auth-actions';

import { authReducer } from './auth-slice';
import { userFixture } from './test-fixtures';

describe('authReducer', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthenticated: false,
      isAuthChecked: false,
      isLoading: false,
      error: null,
    });
  });

  it.each([registerUser, loginUser, logoutUser, checkAuth, updateUser])(
    'handles the pending action for $typePrefix',
    (thunk) => {
      expect(authReducer(undefined, { type: thunk.pending.type })).toEqual(
        expect.objectContaining({ isLoading: true, error: null })
      );
    }
  );

  it.each([registerUser, loginUser, updateUser])(
    'handles the fulfilled action for $typePrefix',
    (thunk) => {
      expect(
        authReducer(undefined, { type: thunk.fulfilled.type, payload: userFixture })
      ).toEqual(
        expect.objectContaining({
          user: userFixture,
          isAuthenticated: true,
          isLoading: false,
        })
      );
    }
  );

  it('handles successful logout', () => {
    expect(authReducer(undefined, { type: logoutUser.fulfilled.type })).toEqual({
      user: null,
      isAuthenticated: false,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });
  });

  it('handles successful auth check with and without a user', () => {
    expect(
      authReducer(undefined, { type: checkAuth.fulfilled.type, payload: userFixture })
    ).toEqual(
      expect.objectContaining({
        user: userFixture,
        isAuthenticated: true,
        isAuthChecked: true,
      })
    );
    expect(
      authReducer(undefined, { type: checkAuth.fulfilled.type, payload: null })
    ).toEqual(
      expect.objectContaining({
        user: null,
        isAuthenticated: false,
        isAuthChecked: true,
      })
    );
  });

  it.each([registerUser, loginUser, logoutUser, checkAuth, updateUser])(
    'handles the rejected action for $typePrefix',
    (thunk) => {
      const state = authReducer(undefined, {
        type: thunk.rejected.type,
        payload: 'Ошибка авторизации',
      });
      expect(state).toEqual(
        expect.objectContaining({ isLoading: false, error: 'Ошибка авторизации' })
      );
      if (thunk === checkAuth) {
        expect(state).toEqual(
          expect.objectContaining({
            user: null,
            isAuthenticated: false,
            isAuthChecked: true,
          })
        );
      }
    }
  );
});
