import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { feedWsActions, profileWsActions } from '@services/ws-actions';
import { getOrder } from '@utils/api';
import { getOrderIngredients, getOrderPrice, getStatusText } from '@utils/orders';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-info.module.css';

const FEED_URL = 'wss://new-stellarburgers.education-services.ru/orders/all';
const PROFILE_ORDERS_URL = 'wss://new-stellarburgers.education-services.ru/orders';

type TOrderInfoProps = {
  isModal?: boolean;
};

export const OrderInfo = ({ isModal = false }: TOrderInfoProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const number = Number(id);
  const isProfileOrder = pathname.startsWith('/profile/orders/');
  const feedOrders = useAppSelector((state) => state.feed.orders);
  const profileOrders = useAppSelector((state) => state.profileOrders.orders);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const hasReceived = useAppSelector((state) =>
    isProfileOrder ? state.profileOrders.hasReceived : state.feed.hasReceived
  );
  const socketOrders = isProfileOrder ? profileOrders : feedOrders;
  const socketOrder = socketOrders.find((item) => item.number === number);
  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isModal) return;

    const actions = isProfileOrder ? profileWsActions : feedWsActions;
    const url = isProfileOrder ? PROFILE_ORDERS_URL : FEED_URL;
    dispatch(actions.connect(url));

    return (): void => {
      dispatch(actions.disconnect());
    };
  }, [dispatch, isModal, isProfileOrder]);

  useEffect(() => {
    if (socketOrder || !Number.isFinite(number) || (!isModal && !hasReceived)) return;

    void getOrder(number)
      .then((response) => {
        setFetchedOrder(response.orders[0] ?? null);
        if (!response.orders[0]) setError('Заказ не найден');
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Не удалось загрузить заказ'
        );
      });
  }, [hasReceived, isModal, number, socketOrder]);

  const order = socketOrder ?? fetchedOrder;
  const groupedIngredients = useMemo(() => {
    if (!order) return [];
    const map = new Map<string, { ingredient: TIngredient; count: number }>();
    getOrderIngredients(order, ingredients).forEach((ingredient) => {
      const current = map.get(ingredient._id);
      map.set(ingredient._id, { ingredient, count: (current?.count ?? 0) + 1 });
    });
    return [...map.values()];
  }, [ingredients, order]);

  if (error)
    return <p className="text text_type_main-medium text_color_inactive">{error}</p>;
  if (!order || ingredients.length === 0) return <Preloader />;

  return (
    <article className={`${styles.info} ${isModal ? styles.modal : ''}`}>
      <p className={`${styles.number} text text_type_digits-default`}>#{order.number}</p>
      <h1 className="text text_type_main-medium mt-10 mb-3">{order.name}</h1>
      <p className={`${styles.status} text text_type_main-default`}>
        {getStatusText(order.status)}
      </p>
      <h2 className="text text_type_main-medium mt-15 mb-6">Состав:</h2>
      <ul className={`${styles.ingredients} custom-scroll`}>
        {groupedIngredients.map(({ ingredient, count }) => (
          <li className={styles.ingredient} key={ingredient._id}>
            <span className={styles.ingredientImageWrap}>
              <img
                className={styles.ingredientImage}
                src={ingredient.image_mobile}
                alt={ingredient.name}
              />
            </span>
            <span className={`${styles.ingredientName} text text_type_main-default`}>
              {ingredient.name}
            </span>
            <span className={`${styles.ingredientPrice} text text_type_digits-default`}>
              {count} x {ingredient.price} <CurrencyIcon type="primary" />
            </span>
          </li>
        ))}
      </ul>
      <footer className={styles.footer}>
        <time
          className="text text_type_main-default text_color_inactive"
          dateTime={order.createdAt}
        >
          {new Intl.DateTimeFormat('ru-RU', {
            dateStyle: 'long',
            timeStyle: 'short',
          }).format(new Date(order.createdAt))}
        </time>
        <span className={`${styles.total} text text_type_digits-default`}>
          {getOrderPrice(order, ingredients)} <CurrencyIcon type="primary" />
        </span>
      </footer>
    </article>
  );
};
