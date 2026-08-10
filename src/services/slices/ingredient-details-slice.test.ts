import {
  clearSelectedIngredient,
  ingredientDetailsReducer,
  initialState,
  setSelectedIngredient,
} from './ingredient-details-slice';
import { ingredientFixture } from './test-fixtures';

describe('ingredientDetailsReducer', () => {
  it('returns the initial state', () => {
    expect(ingredientDetailsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('sets and clears the selected ingredient', () => {
    const selectedState = ingredientDetailsReducer(
      undefined,
      setSelectedIngredient(ingredientFixture)
    );
    expect(selectedState.selectedIngredient).toEqual(ingredientFixture);
    expect(ingredientDetailsReducer(selectedState, clearSelectedIngredient())).toEqual({
      selectedIngredient: null,
    });
  });
});
