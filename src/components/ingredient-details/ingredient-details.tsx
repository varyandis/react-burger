import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

const nutritionItems = [
  ['calories', 'Калории, ккал'],
  ['proteins', 'Белки, г'],
  ['fat', 'Жиры, г'],
  ['carbohydrates', 'Углеводы, г'],
] as const;

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => (
  <article className={styles.details}>
    <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
    <h3 className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>
      {ingredient.name}
    </h3>
    <ul className={styles.nutrition}>
      {nutritionItems.map(([key, label]) => (
        <li key={key} className={styles.nutrition_item}>
          <span className="text text_type_main-default text_color_inactive mb-2">
            {label}
          </span>
          <span className="text text_type_digits-default text_color_inactive">
            {ingredient[key]}
          </span>
        </li>
      ))}
    </ul>
  </article>
);
