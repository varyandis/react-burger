import { createAction } from '@reduxjs/toolkit';

import type {
  ActionCreatorWithOptionalPayload,
  PayloadActionCreator,
} from '@reduxjs/toolkit';
import type { TOrdersResponse } from '@utils/types';

export type TWsActions = {
  connect: PayloadActionCreator<string>;
  disconnect: ActionCreatorWithOptionalPayload<undefined>;
  connecting: ActionCreatorWithOptionalPayload<undefined>;
  open: ActionCreatorWithOptionalPayload<undefined>;
  close: ActionCreatorWithOptionalPayload<undefined>;
  error: PayloadActionCreator<string>;
  message: PayloadActionCreator<TOrdersResponse>;
};

const createWsActions = (prefix: string): TWsActions => ({
  connect: createAction<string>(`${prefix}/connect`),
  disconnect: createAction(`${prefix}/disconnect`),
  connecting: createAction(`${prefix}/connecting`),
  open: createAction(`${prefix}/open`),
  close: createAction(`${prefix}/close`),
  error: createAction<string>(`${prefix}/error`),
  message: createAction<TOrdersResponse>(`${prefix}/message`),
});

export const feedWsActions = createWsActions('feedWs');
export const profileWsActions = createWsActions('profileWs');
