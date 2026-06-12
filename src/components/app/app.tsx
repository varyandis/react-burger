import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  clearSelectedIngredient,
  setSelectedIngredient,
} from '@services/slices/ingredient-details-slice';
import { fetchIngredients } from '@services/slices/ingredients-slice';
import { clearOrder, createOrder } from '@services/slices/order-slice';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { error, ingredients, isLoading } = useAppSelector((state) => state.ingredients);
  const { selectedIngredient } = useAppSelector((state) => state.ingredientDetails);
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state) => state.burgerConstructor
  );

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(setSelectedIngredient(ingredient));
    },
    [dispatch]
  );

  const handleOrderClick = useCallback((): void => {
    if (!bun) {
      return;
    }

    const ingredientIds = [
      bun._id,
      ...constructorIngredients.map((ingredient) => ingredient._id),
      bun._id,
    ];

    setIsOrderModalOpen(true);
    void dispatch(createOrder(ingredientIds));
  }, [bun, constructorIngredients, dispatch]);

  const handleModalClose = useCallback((): void => {
    dispatch(clearSelectedIngredient());
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading && <Preloader />}
      {!isLoading && error && (
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      )}
      {!isLoading && !error && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            ingredients={ingredients}
            onIngredientClick={handleIngredientClick}
          />
          <BurgerConstructor ingredients={ingredients} onOrderClick={handleOrderClick} />
        </main>
      )}
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleModalClose}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal ariaLabel="Детали заказа" onClose={handleModalClose}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
