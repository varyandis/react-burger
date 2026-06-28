import { NavLink, Outlet } from 'react-router-dom';

import styles from './profile-page.module.css';

const getProfileLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link} ${
    isActive ? styles.link_active : styles.link_inactive
  } text text_type_main-medium mb-6`;

export const ProfileContent = (): React.JSX.Element => {
  return (
    <section>
      <h1 className="text text_type_main-large">Профиль</h1>
      <p className="text text_type_main-default text_color_inactive mt-6">
        Данные профиля будут добавлены позже.
      </p>
    </section>
  );
};

export const ProfilePage = (): React.JSX.Element => {
  return (
    <main className={`${styles.profile} mt-20 ml-10 mr-10`}>
      <div className={styles.layout}>
        <nav className={styles.menu}>
          <NavLink className={getProfileLinkClassName} end to="/profile">
            Профиль
          </NavLink>
          <NavLink className={getProfileLinkClassName} to="/profile/orders">
            История заказов
          </NavLink>
          <button
            className={`${styles.exit} text text_type_main-medium text_color_inactive`}
            type="button"
          >
            Выход
          </button>
        </nav>
        <Outlet />
      </div>
    </main>
  );
};
