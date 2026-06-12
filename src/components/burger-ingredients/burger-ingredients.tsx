import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import { DND_ITEM_TYPES } from '@utils/dnd';

import type { TIngredient } from '@utils/types';
import type { DragSourceMonitor } from 'react-dnd';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

type TIngredientGroup = {
  id: TIngredient['type'];
  title: string;
  items: TIngredient[];
};

type TIngredientCardProps = {
  count: number;
  ingredient: TIngredient;
  onIngredientClick: (ingredient: TIngredient) => void;
};

type TDragCollectedProps = {
  isDragging: boolean;
};

const getIngredientCount = (type: TIngredient['type'], index: number): number => {
  if (index > 0) {
    return 0;
  }

  return type === 'bun' ? 2 : 1;
};

const IngredientCard = ({
  count,
  ingredient,
  onIngredientClick,
}: TIngredientCardProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_ITEM_TYPES.ingredient,
      item: ingredient,
      collect: (monitor: DragSourceMonitor): TDragCollectedProps => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );
  const setDragRef = useCallback(
    (node: HTMLElement | null): void => {
      dragRef(node);
    },
    [dragRef]
  );

  return (
    <article
      ref={setDragRef}
      className={styles.card}
      role="button"
      tabIndex={0}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onIngredientClick(ingredient)}
      onKeyDown={(event) => {
        if (event.key === ' ') {
          event.preventDefault();
          onIngredientClick(ingredient);
        }

        if (event.key === 'Enter') {
          onIngredientClick(ingredient);
        }
      }}
    >
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" />
        </div>
      )}
      <img
        className={`${styles.image} mb-1`}
        src={ingredient.image}
        alt={ingredient.name}
      />
      <div className={`${styles.price} mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <h3 className={`${styles.name} text text_type_main-default`}>{ingredient.name}</h3>
    </article>
  );
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<TIngredient['type']>('bun');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<TIngredient['type'], HTMLElement | null>>({
    bun: null,
    sauce: null,
    main: null,
  });

  const buns = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );
  const sauces = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    [ingredients]
  );
  const mains = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type === 'main'),
    [ingredients]
  );

  const ingredientGroups = useMemo<TIngredientGroup[]>(
    () => [
      {
        id: 'bun',
        title: 'Булки',
        items: buns,
      },
      {
        id: 'sauce',
        title: 'Соусы',
        items: sauces,
      },
      {
        id: 'main',
        title: 'Начинки',
        items: mains,
      },
    ],
    [buns, mains, sauces]
  );

  const handleScroll = useCallback((): void => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return;
    }

    const containerTop = contentElement.getBoundingClientRect().top;
    const closestGroup = ingredientGroups.reduce<{
      id: TIngredient['type'];
      distance: number;
    } | null>((closest, group) => {
      const sectionElement = sectionRefs.current[group.id];

      if (!sectionElement) {
        return closest;
      }

      const distance = Math.abs(
        sectionElement.getBoundingClientRect().top - containerTop
      );

      if (!closest || distance < closest.distance) {
        return {
          id: group.id,
          distance,
        };
      }

      return closest;
    }, null);

    if (closestGroup && closestGroup.id !== currentTab) {
      setCurrentTab(closestGroup.id);
    }
  }, [currentTab, ingredientGroups]);

  const handleTabClick = (tab: string): void => {
    if (tab !== 'bun' && tab !== 'sauce' && tab !== 'main') {
      return;
    }

    setCurrentTab(tab);
    sectionRefs.current[tab]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      className={styles.burger_ingredients}
      aria-label={`Ингредиенты: ${ingredients.length}`}
    >
      <nav>
        <div className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </div>
      </nav>
      <div
        ref={contentRef}
        className={`${styles.content} custom-scroll`}
        onScroll={handleScroll}
      >
        {ingredientGroups.map((group) => (
          <section
            key={group.id}
            ref={(element) => {
              sectionRefs.current[group.id] = element;
            }}
            className="mb-10"
          >
            <h2 className="text text_type_main-medium mb-6">{group.title}</h2>
            <ul className={`${styles.list} pl-4 pr-4`}>
              {group.items.map((ingredient, index) => {
                const count = getIngredientCount(ingredient.type, index);

                return (
                  <li key={ingredient._id} className={styles.item}>
                    <IngredientCard
                      count={count}
                      ingredient={ingredient}
                      onIngredientClick={onIngredientClick}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
