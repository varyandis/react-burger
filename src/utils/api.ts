import type { TIngredient, TIngredientsResponse } from './types';

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
