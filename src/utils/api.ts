import type {
  TAuthRequest,
  TAuthResponse,
  TForgotPasswordRequest,
  TIngredient,
  TIngredientsResponse,
  TOrderResponse,
  TRegisterUserRequest,
  TResetPasswordRequest,
  TSuccessResponse,
  TTokenResponse,
  TUpdateUserRequest,
  TUser,
  TUserResponse,
} from './types';

export const BURGER_API_URL = 'https://new-stellarburgers.education-services.ru/api';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type TApiError = Error & {
  status?: number;
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = ({
  accessToken,
  refreshToken,
}: Pick<TTokenResponse, 'accessToken' | 'refreshToken'>): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const removeTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const createApiError = (message: string, status?: number): TApiError => {
  const error = new Error(message) as TApiError;
  error.status = status;

  return error;
};

const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = (await res.json()) as T & { message?: string };

  if (!res.ok) {
    throw createApiError(
      data.message ?? `Request failed with status ${res.status}`,
      res.status
    );
  }

  return data;
};

const checkSuccess = <T extends { success: boolean }>(res: T): T => {
  if (!res.success) {
    throw new Error('Response success is false');
  }

  return res;
};

const request = <T extends { success: boolean }>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  return fetch(`${BURGER_API_URL}${endpoint}`, options)
    .then(checkResponse<T>)
    .then(checkSuccess);
};

const isAccessTokenExpiredError = (error: unknown): boolean => {
  return error instanceof Error && error.message.toLowerCase().includes('jwt expired');
};

const addAuthorizationHeader = (
  headers: HeadersInit | undefined,
  accessToken: string
): Headers => {
  const nextHeaders = new Headers(headers);
  nextHeaders.set('authorization', accessToken);

  return nextHeaders;
};

export const fetchWithRefresh = async <T extends { success: boolean }>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (error) {
    if (!isAccessTokenExpiredError(error)) {
      throw error;
    }

    try {
      const tokens = await refreshTokenApi();
      setTokens(tokens);

      return await request<T>(endpoint, {
        ...options,
        headers: addAuthorizationHeader(options.headers, tokens.accessToken),
      });
    } catch (refreshError) {
      removeTokens();
      throw refreshError;
    }
  }
};

export const getIngredients = (): Promise<TIngredient[]> => {
  return request<TIngredientsResponse>('/ingredients').then((res) => res.data);
};

export const createOrder = (ingredients: string[]): Promise<number> => {
  return request<TOrderResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  }).then((res) => res.order.number);
};

export const registerUserApi = ({
  email,
  name,
  password,
}: TRegisterUserRequest): Promise<TAuthResponse> => {
  return request<TAuthResponse>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, password }),
  });
};

export const loginUserApi = ({
  email,
  password,
}: TAuthRequest): Promise<TAuthResponse> => {
  return request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const logoutUserApi = (): Promise<TSuccessResponse> => {
  return request<TSuccessResponse>('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
};

export const refreshTokenApi = (): Promise<TTokenResponse> => {
  return request<TTokenResponse>('/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
};

export const getUserApi = (): Promise<TUser> => {
  return fetchWithRefresh<TUserResponse>('/auth/user', {
    headers: {
      authorization: getAccessToken() ?? '',
    },
  }).then((res) => res.user);
};

export const updateUserApi = ({
  email,
  name,
  password,
}: TUpdateUserRequest): Promise<TUser> => {
  return fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken() ?? '',
    },
    body: JSON.stringify({ email, name, password }),
  }).then((res) => res.user);
};

export const forgotPasswordApi = ({
  email,
}: TForgotPasswordRequest): Promise<TSuccessResponse> => {
  return request<TSuccessResponse>('/password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
};

export const resetPasswordApi = ({
  password,
  token,
}: TResetPasswordRequest): Promise<TSuccessResponse> => {
  return request<TSuccessResponse>('/password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, token }),
  });
};
