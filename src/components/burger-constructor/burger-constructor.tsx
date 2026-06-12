import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  addIngredient,
  chooseBun,
  moveIngredient,
  removeIngredient,
  selectConstructorTotalPrice,
} from '@services/slices/constructor-slice';
import { DND_ITEM_TYPES } from '@utils/dnd';

import type { TConstructorIngredient } from '@services/slices/constructor-slice';
import type { TIngredient } from '@utils/types';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderClick: () => void;
};

type TDropCollectedProps = {
  isOver: boolean;
};

type TConstructorIngredientItemProps = {
  index: number;
  ingredient: TConstructorIngredient;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (constructorId: string) => void;
};

type TConstructorIngredientDragItem = {
  constructorId: string;
  index: number;
};

type TDragCollectedProps = {
  isDragging: boolean;
};

const ConstructorIngredientItem = ({
  index,
  ingredient,
  onMove,
  onRemove,
}: TConstructorIngredientItemProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_ITEM_TYPES.constructorIngredient,
      item: {
        constructorId: ingredient.constructorId,
        index,
      },
      collect: (monitor: DragSourceMonitor): TDragCollectedProps => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, ingredient.constructorId]
  );
  const [, dropRef] = useDrop(
    () => ({
      accept: DND_ITEM_TYPES.constructorIngredient,
      hover: (dragItem: TConstructorIngredientDragItem): void => {
        if (dragItem.constructorId === ingredient.constructorId) {
          return;
        }

        onMove(dragItem.index, index);
        dragItem.index = index;
      },
    }),
    [index, ingredient.constructorId, onMove]
  );
  const setItemRef = useCallback(
    (node: HTMLLIElement | null): void => {
      dragRef(node);
      dropRef(node);
    },
    [dragRef, dropRef]
  );

  return (
    <li
      ref={setItemRef}
      className={styles.item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={() => onRemove(ingredient.constructorId)}
      />
    </li>
  );
};

export const BurgerConstructor = ({
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const totalPrice = useAppSelector(selectConstructorTotalPrice);
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
  const handleMoveIngredient = useCallback(
    (fromIndex: number, toIndex: number): void => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    },
    [dispatch]
  );
  const handleRemoveIngredient = useCallback(
    (constructorId: string): void => {
      dispatch(removeIngredient(constructorId));
    },
    [dispatch]
  );

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
          ingredients.map((ingredient, index) => (
            <ConstructorIngredientItem
              key={ingredient.constructorId}
              index={index}
              ingredient={ingredient}
              onMove={handleMoveIngredient}
              onRemove={handleRemoveIngredient}
            />
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
