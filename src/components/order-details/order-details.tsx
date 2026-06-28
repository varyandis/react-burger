import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const { error, isLoading, orderNumber } = useAppSelector((state) => state.order);

  if (isLoading) {
    return (
      <section className={styles.details}>
        <Preloader />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.details}>
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      </section>
    );
  }

  return (
    <section className={styles.details}>
      <p className={`${styles.number} text text_type_digits-large mb-8`}>
        {orderNumber}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={`${styles.icon} mb-15`} aria-hidden="true">
        <CheckMarkIcon type="success" />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </section>
  );
};
