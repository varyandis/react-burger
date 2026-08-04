import type { TIngredient, TOrder, TOrdersResponse } from './types';

const statuses = new Set(['created', 'pending', 'done']);

export const isOrder = (value: unknown): value is TOrder => {
  if (!value || typeof value !== 'object') return false;
  const order = value as Partial<TOrder>;

  return (
    typeof order._id === 'string' &&
    Array.isArray(order.ingredients) &&
    order.ingredients.every((id) => typeof id === 'string') &&
    typeof order.status === 'string' &&
    statuses.has(order.status) &&
    typeof order.name === 'string' &&
    typeof order.number === 'number' &&
    typeof order.createdAt === 'string' &&
    typeof order.updatedAt === 'string'
  );
};

export const parseOrdersResponse = (value: unknown): TOrdersResponse | null => {
  if (!value || typeof value !== 'object') return null;
  const response = value as Partial<TOrdersResponse>;

  if (
    response.success === true &&
    Array.isArray(response.orders) &&
    typeof response.total === 'number' &&
    typeof response.totalToday === 'number'
  ) {
    return {
      success: true,
      orders: response.orders.filter(isOrder),
      total: response.total,
      totalToday: response.totalToday,
    };
  }

  return null;
};

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  const byId = new Map(ingredients.map((ingredient) => [ingredient._id, ingredient]));
  return order.ingredients.flatMap((id) => {
    const ingredient = byId.get(id);
    return ingredient ? [ingredient] : [];
  });
};

export const getOrderPrice = (order: TOrder, ingredients: TIngredient[]): number =>
  getOrderIngredients(order, ingredients).reduce((sum, item) => sum + item.price, 0);

export const getStatusText = (status: TOrder['status']): string =>
  ({ created: 'Создан', pending: 'Готовится', done: 'Выполнен' })[status];
