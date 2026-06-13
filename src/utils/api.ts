import type { TIngredient, TIngredientsResponse, TOrderResponse } from './types';

export const BURGER_API_URL = 'https://new-stellarburgers.education-services.ru/api';

const checkResponse = <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    return Promise.reject(new Error(`Request failed with status ${res.status}`));
  }

  return res.json() as Promise<T>;
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
