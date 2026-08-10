import { expect, test } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

const dragIngredient = async (
  page: Page,
  ingredient: Locator,
  constructor: Locator
): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());

  await ingredient.dispatchEvent('dragstart', { dataTransfer });
  await constructor.dispatchEvent('dragenter', { dataTransfer });
  await constructor.dispatchEvent('dragover', { dataTransfer });
  await constructor.dispatchEvent('drop', { dataTransfer });
  await ingredient.dispatchEvent('dragend', { dataTransfer });
  await dataTransfer.dispose();
};

test.describe('Страница конструктора', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('e2e/mocks/api.har', {
      notFound: 'abort',
      url: '**/api/**',
      update: false,
    });
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer e2e-access-token');
      localStorage.setItem('refreshToken', 'e2e-refresh-token');
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });

  test('собирает бургер и показывает данные ингредиента и заказа', async ({ page }) => {
    const bun = page.getByTestId('ingredient-bun-1');
    const filling = page.getByTestId('ingredient-main-1');
    const constructor = page.getByTestId('burger-constructor');

    await bun.click();
    const ingredientDialog = page.getByRole('dialog', {
      name: 'Детали ингредиента',
    });
    await expect(ingredientDialog).toBeVisible();
    await expect(ingredientDialog.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(ingredientDialog.getByText('420')).toBeVisible();
    await ingredientDialog.getByRole('button', { name: 'Закрыть' }).click();
    await expect(ingredientDialog).not.toBeVisible();

    await dragIngredient(page, bun, constructor);
    await dragIngredient(page, filling, constructor);
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    const orderDialog = page.getByRole('dialog', { name: 'Детали заказа' });
    await expect(orderDialog).toBeVisible();
    await expect(orderDialog.getByText('4242')).toBeVisible();
    await orderDialog.getByRole('button', { name: 'Закрыть' }).click();
    await expect(orderDialog).not.toBeVisible();
  });
});
