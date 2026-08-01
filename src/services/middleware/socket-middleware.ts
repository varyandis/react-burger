import { getAccessToken, refreshTokenApi, setTokens } from '@utils/api';
import { parseOrdersResponse } from '@utils/orders';

import type { Middleware } from '@reduxjs/toolkit';
import type { TWsActions } from '@services/ws-actions';

type TSocketOptions = {
  withToken?: boolean;
};

const getToken = (): string => (getAccessToken() ?? '').replace('Bearer ', '');

export const createSocketMiddleware = (
  actions: TWsActions,
  { withToken = false }: TSocketOptions = {}
): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;
    let baseUrl = '';
    let closedByUser = false;

    const openSocket = (url: string): void => {
      socket?.close();
      closedByUser = false;
      baseUrl = url;
      store.dispatch(actions.connecting());
      const socketUrl = withToken ? `${url}?token=${getToken()}` : url;
      socket = new WebSocket(socketUrl);

      socket.onopen = (): void => {
        store.dispatch(actions.open());
      };

      socket.onerror = (): void => {
        store.dispatch(actions.error('Ошибка соединения с сервером'));
      };

      socket.onclose = (): void => {
        store.dispatch(actions.close());
        socket = null;
      };

      socket.onmessage = (event): void => {
        let data: unknown;

        try {
          data = JSON.parse(String(event.data));
        } catch {
          store.dispatch(actions.error('Сервер прислал некорректные данные'));
          return;
        }

        if (
          withToken &&
          typeof data === 'object' &&
          data !== null &&
          'message' in data &&
          data.message === 'Invalid or missing token'
        ) {
          socket?.close();
          void refreshTokenApi()
            .then((tokens) => {
              setTokens(tokens);
              if (!closedByUser) {
                openSocket(baseUrl);
              }
            })
            .catch(() => store.dispatch(actions.error('Не удалось обновить токен')));
          return;
        }

        const response = parseOrdersResponse(data);
        if (response) {
          store.dispatch(actions.message(response));
        } else {
          store.dispatch(actions.error('В ленте получены некорректные заказы'));
        }
      };
    };

    return (next) => (action) => {
      if (actions.connect.match(action)) {
        openSocket(action.payload);
      } else if (actions.disconnect.match(action)) {
        closedByUser = true;
        socket?.close();
        socket = null;
      }

      return next(action);
    };
  };
};
