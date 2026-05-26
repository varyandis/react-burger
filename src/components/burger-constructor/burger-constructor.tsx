import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  return (
    <section
      className={styles.burger_constructor}
      aria-label={`Конструктор бургера: ${ingredients.length}`}
    ></section>
  );
};
