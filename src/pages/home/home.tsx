import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { createOrder } from '@services/actions/order-actions';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIsAuthenticated } from '@services/slices/auth-slice';
import { clearOrder } from '@services/slices/order-slice';

import type { TIngredient } from '@utils/types';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { error, isLoading } = useAppSelector((state) => state.ingredients);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state) => state.burgerConstructor
  );

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient): void => {
      void navigate(`/ingredients/${ingredient._id}`, {
        state: { backgroundLocation: location },
      });
    },
    [location, navigate]
  );

  const handleOrderClick = useCallback((): void => {
    if (!bun) {
      return;
    }

    if (!isAuthenticated) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      bun._id,
      ...constructorIngredients.map((ingredient) => ingredient._id),
      bun._id,
    ];

    setIsOrderModalOpen(true);
    void dispatch(createOrder(ingredientIds));
  }, [bun, constructorIngredients, dispatch, isAuthenticated, location, navigate]);

  const handleModalClose = useCallback((): void => {
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  }, [dispatch]);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      {isLoading && <Preloader />}
      {!isLoading && error && (
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      )}
      {!isLoading && !error && (
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients onIngredientClick={handleIngredientClick} />
          <BurgerConstructor onOrderClick={handleOrderClick} />
        </main>
      )}
      {isOrderModalOpen && (
        <Modal ariaLabel="Детали заказа" onClose={handleModalClose}>
          <OrderDetails />
        </Modal>
      )}
    </DndProvider>
  );
};
