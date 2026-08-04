import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { feedWsActions } from '@services/ws-actions';

import styles from './feed-page.module.css';

const FEED_URL = 'wss://new-stellarburgers.education-services.ru/orders/all';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday, isConnecting, error } = useAppSelector(
    (state) => state.feed
  );

  useEffect(() => {
    dispatch(feedWsActions.connect(FEED_URL));
    return (): void => {
      dispatch(feedWsActions.disconnect());
    };
  }, [dispatch]);

  const doneOrders = orders.filter((order) => order.status === 'done').slice(0, 20);
  const pendingOrders = orders
    .filter((order) => order.status === 'pending')
    .slice(0, 20);

  return (
    <main className={`${styles.page} mt-10`}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      {isConnecting && orders.length === 0 && <Preloader />}
      {error && orders.length === 0 && (
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      )}
      <div className={styles.layout}>
        <section className={`${styles.orders} custom-scroll`} aria-label="Заказы">
          {orders.map((order) => (
            <OrderCard order={order} key={order._id} />
          ))}
        </section>
        <section className={styles.stats}>
          <div className={styles.statuses}>
            <OrderNumbers
              title="Готовы:"
              orders={doneOrders.map((order) => order.number)}
              done
            />
            <OrderNumbers
              title="В работе:"
              orders={pendingOrders.map((order) => order.number)}
            />
          </div>
          <Counter title="Выполнено за все время:" value={total} />
          <Counter title="Выполнено за сегодня:" value={totalToday} />
        </section>
      </div>
    </main>
  );
};

const OrderNumbers = ({
  title,
  orders,
  done = false,
}: {
  title: string;
  orders: number[];
  done?: boolean;
}): React.JSX.Element => (
  <div className={styles.statusColumn}>
    <h2 className="text text_type_main-medium mb-6">{title}</h2>
    <div className={`${styles.numberGrid} ${done ? styles.done : ''}`}>
      {orders.map((number) => (
        <span className="text text_type_digits-default" key={number}>
          {number}
        </span>
      ))}
    </div>
  </div>
);

const Counter = ({
  title,
  value,
}: {
  title: string;
  value: number;
}): React.JSX.Element => (
  <div>
    <h2 className="text text_type_main-medium">{title}</h2>
    <p className={`${styles.counter} text text_type_digits-large`}>{value}</p>
  </div>
);
