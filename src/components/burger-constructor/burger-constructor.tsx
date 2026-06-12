import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { addIngredient, chooseBun } from '@services/slices/constructor-slice';
import { DND_ITEM_TYPES } from '@utils/dnd';

import type { TIngredient } from '@utils/types';
import type { DropTargetMonitor } from 'react-dnd';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderClick: () => void;
};

type TDropCollectedProps = {
  isOver: boolean;
};

export const BurgerConstructor = ({
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: DND_ITEM_TYPES.ingredient,
      drop: (ingredient: TIngredient): void => {
        if (ingredient.type === 'bun') {
          dispatch(chooseBun(ingredient));
          return;
        }

        dispatch(addIngredient(ingredient));
      },
      collect: (monitor: DropTargetMonitor): TDropCollectedProps => ({
        isOver: monitor.isOver(),
      }),
    }),
    [dispatch]
  );
  const setDropRef = useCallback(
    (node: HTMLElement | null): void => {
      dropRef(node);
    },
    [dropRef]
  );

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);
  const isOrderDisabled = !bun || ingredients.length === 0;

  return (
    <section
      ref={setDropRef}
      className={`${styles.burger_constructor} ${isOver ? styles.burger_constructor_hover : ''} pt-25 pl-4`}
      aria-label="Конструктор бургера"
    >
      <div className="pl-8 mb-4">
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div
            className={`${styles.placeholder} ${styles.placeholder_top} text text_type_main-default text_color_inactive`}
          >
            Выберите булки
          </div>
        )}
      </div>
      <ul className={`${styles.list} custom-scroll`}>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <li key={ingredient.constructorId} className={styles.item}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
              />
            </li>
          ))
        ) : (
          <li className={`${styles.item} ${styles.empty_item}`}>
            <div
              className={`${styles.placeholder} text text_type_main-default text_color_inactive`}
            >
              Выберите начинку
            </div>
          </li>
        )}
      </ul>
      <div className="pl-8 mt-4">
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <div
            className={`${styles.placeholder} ${styles.placeholder_bottom} text text_type_main-default text_color_inactive`}
          >
            Выберите булки
          </div>
        )}
      </div>
      <div className={`${styles.summary} mt-10`}>
        <div className={styles.price}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          disabled={isOrderDisabled}
          onClick={onOrderClick}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
