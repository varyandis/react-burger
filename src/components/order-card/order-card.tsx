import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { getOrderIngredients, getOrderPrice, getStatusText } from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  profile?: boolean;
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const OrderCard = ({
  order,
  profile = false,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const orderIngredients = getOrderIngredients(order, ingredients);
  const visibleIngredients = orderIngredients.slice(0, 6);
  const hiddenCount = Math.max(orderIngredients.length - visibleIngredients.length, 0);

  const handleClick = (): void => {
    const path = profile ? `/profile/orders/${order.number}` : `/feed/${order.number}`;
    void navigate(path, { state: { backgroundLocation: location } });
  };

  return (
    <button className={styles.card} type="button" onClick={handleClick}>
      <span className={styles.meta}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <time
          className="text text_type_main-default text_color_inactive"
          dateTime={order.createdAt}
        >
          {formatDate(order.createdAt)}
        </time>
      </span>
      <span className={`${styles.name} text text_type_main-medium`}>{order.name}</span>
      {profile && (
        <span
          className={`${order.status === 'done' ? styles.done : ''} text text_type_main-default`}
        >
          {getStatusText(order.status)}
        </span>
      )}
      <span className={styles.footer}>
        <span className={styles.images}>
          {visibleIngredients.map((ingredient, index) => {
            const isLast = index === visibleIngredients.length - 1 && hiddenCount > 0;
            return (
              <span
                className={styles.imageWrap}
                key={`${ingredient._id}-${index}`}
                style={{ zIndex: 10 - index }}
              >
                <img
                  className={styles.image}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {isLast && (
                  <span className={`${styles.more} text text_type_main-default`}>
                    +{hiddenCount}
                  </span>
                )}
              </span>
            );
          })}
        </span>
        <span className={styles.price}>
          <span className="text text_type_digits-default">
            {getOrderPrice(order, ingredients)}
          </span>
          <CurrencyIcon type="primary" />
        </span>
      </span>
    </button>
  );
};
