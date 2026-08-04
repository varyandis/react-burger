import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { profileWsActions } from '@services/ws-actions';

import styles from './profile-order-page.module.css';

const PROFILE_ORDERS_URL = 'wss://new-stellarburgers.education-services.ru/orders';

export const ProfileOrderPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, isConnecting, error } = useAppSelector((state) => state.profileOrders);

  useEffect(() => {
    dispatch(profileWsActions.connect(PROFILE_ORDERS_URL));
    return (): void => {
      dispatch(profileWsActions.disconnect());
    };
  }, [dispatch]);

  if (isConnecting && orders.length === 0) return <Preloader />;

  return (
    <section className={`${styles.orders} custom-scroll`} aria-label="История заказов">
      {error && orders.length === 0 && (
        <p className="text text_type_main-default text_color_inactive">{error}</p>
      )}
      {orders.map((order) => (
        <OrderCard order={order} profile key={order._id} />
      ))}
    </section>
  );
};
