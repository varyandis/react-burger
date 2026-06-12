import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { initializeConstructor } from '@services/slices/constructor-slice';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { bun, ingredients: selectedIngredients } = useAppSelector(
    (state) => state.burgerConstructor
  );

  useEffect(() => {
    dispatch(initializeConstructor(ingredients));
  }, [dispatch, ingredients]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = selectedIngredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [bun, selectedIngredients]);

  if (!bun) {
    return (
      <section className={styles.burger_constructor} aria-label="Конструктор бургера" />
    );
  }

  return (
    <section
      className={`${styles.burger_constructor} pt-25 pl-4`}
      aria-label="Конструктор бургера"
    >
      <div className="pl-8 mb-4">
        <ConstructorElement
          type="top"
          isLocked
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      </div>
      <ul className={`${styles.list} custom-scroll`}>
        {selectedIngredients.map((ingredient) => (
          <li key={ingredient.constructorId} className={styles.item}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>
      <div className="pl-8 mt-4">
        <ConstructorElement
          type="bottom"
          isLocked
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      </div>
      <div className={`${styles.summary} mt-10`}>
        <div className={styles.price}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
