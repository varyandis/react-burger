import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { fetchIngredients } from '@services/actions/ingredients-actions';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './ingredient-details-page.module.css';

type TIngredientDetailsPageProps = {
  isModal?: boolean;
};

export const IngredientDetailsPage = ({
  isModal = false,
}: TIngredientDetailsPageProps): React.JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { error, ingredients, isLoading } = useAppSelector((state) => state.ingredients);
  const ingredient = ingredients.find((item) => item._id === id);

  useEffect(() => {
    if (ingredients.length === 0) {
      void dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <main className={isModal ? styles.message : styles.page}>
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      </main>
    );
  }

  if (!ingredient) {
    return (
      <main className={isModal ? styles.message : styles.page}>
        <h1 className="text text_type_main-large">Ингредиент не найден</h1>
      </main>
    );
  }

  if (isModal) {
    return <IngredientDetails ingredient={ingredient} />;
  }

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};
