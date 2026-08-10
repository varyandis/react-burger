import type { TIngredient, TOrder, TUser } from '@utils/types';

export const ingredientFixture: TIngredient = {
  _id: 'ingredient-1',
  name: 'Космический ингредиент',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  __v: 0,
};

export const bunFixture: TIngredient = {
  ...ingredientFixture,
  _id: 'bun-1',
  name: 'Космическая булка',
  type: 'bun',
  price: 200,
};

export const orderFixture: TOrder = {
  _id: 'order-1',
  ingredients: [bunFixture._id, ingredientFixture._id, bunFixture._id],
  status: 'done',
  name: 'Космический бургер',
  number: 42,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const userFixture: TUser = {
  email: 'cosmonaut@example.com',
  name: 'Космонавт',
};
