import type { TIngredient, TIngredientsResponse, TOrderResponse } from './types';

export const BURGER_API_URL = 'https://new-stellarburgers.education-services.ru/api';

const checkResponse = <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    return Promise.reject(new Error(`Request failed with status ${res.status}`));
  }

  return res.json() as Promise<T>;
};

export const getIngredients = (): Promise<TIngredient[]> => {
  return fetch(`${BURGER_API_URL}/ingredients`)
    .then(checkResponse<TIngredientsResponse>)
    .then((res) => {
      if (!res.success) {
        return Promise.reject(new Error('Failed to load ingredients'));
      }

      return res.data;
    });
};

export const createOrder = (ingredients: string[]): Promise<number> => {
  return fetch(`${BURGER_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  })
    .then(checkResponse<TOrderResponse>)
    .then((res) => {
      if (!res.success) {
        return Promise.reject(new Error('Failed to create order'));
      }

      return res.order.number;
    });
};
