import { fetchIngredients } from '@services/actions/ingredients-actions';

import { ingredientsReducer } from './ingredients-slice';
import { ingredientFixture } from './test-fixtures';

describe('ingredientsReducer', () => {
  it('returns the initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual({
      ingredients: [],
      isLoading: true,
      error: '',
    });
  });

  it('handles loading, success and failure', () => {
    expect(
      ingredientsReducer(undefined, { type: fetchIngredients.pending.type })
    ).toEqual({
      ingredients: [],
      isLoading: true,
      error: '',
    });
    expect(
      ingredientsReducer(undefined, {
        type: fetchIngredients.fulfilled.type,
        payload: [ingredientFixture],
      })
    ).toEqual({ ingredients: [ingredientFixture], isLoading: false, error: '' });
    expect(
      ingredientsReducer(undefined, {
        type: fetchIngredients.rejected.type,
        payload: 'Ошибка загрузки',
      })
    ).toEqual({ ingredients: [], isLoading: false, error: 'Ошибка загрузки' });
  });
});
