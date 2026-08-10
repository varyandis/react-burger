import {
  addIngredient,
  chooseBun,
  clearConstructor,
  constructorReducer,
  initialState,
  moveIngredient,
  removeIngredient,
} from './constructor-slice';
import { bunFixture, ingredientFixture } from './test-fixtures';

describe('constructorReducer', () => {
  it('returns the initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('chooses and replaces a bun', () => {
    expect(constructorReducer(undefined, chooseBun(bunFixture)).bun).toEqual(bunFixture);
    expect(constructorReducer(undefined, addIngredient(bunFixture)).bun).toEqual(
      expect.objectContaining(bunFixture)
    );
  });

  it('adds an ingredient with a unique constructor id', () => {
    const state = constructorReducer(undefined, addIngredient(ingredientFixture));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...ingredientFixture,
      constructorId: state.ingredients[0]?.constructorId,
    });
    expect(typeof state.ingredients[0]?.constructorId).toBe('string');
  });

  it('removes an ingredient by constructor id', () => {
    const addedState = constructorReducer(undefined, addIngredient(ingredientFixture));
    const constructorId = addedState.ingredients[0]?.constructorId ?? '';
    expect(
      constructorReducer(addedState, removeIngredient(constructorId)).ingredients
    ).toEqual([]);
  });

  it('moves an ingredient and ignores an invalid source index', () => {
    const firstState = constructorReducer(undefined, addIngredient(ingredientFixture));
    const secondState = constructorReducer(
      firstState,
      addIngredient({ ...ingredientFixture, _id: 'ingredient-2' })
    );
    const movedState = constructorReducer(
      secondState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(movedState.ingredients.map(({ _id }) => _id)).toEqual([
      'ingredient-2',
      'ingredient-1',
    ]);
    expect(
      constructorReducer(movedState, moveIngredient({ fromIndex: 5, toIndex: 0 }))
    ).toEqual(movedState);
  });

  it('clears the constructor', () => {
    const filledState = constructorReducer(undefined, chooseBun(bunFixture));
    expect(constructorReducer(filledState, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
