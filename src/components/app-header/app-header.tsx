import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const isConstructorActive = pathname === '/' || pathname.startsWith('/ingredients/');
  const isFeedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const isProfileActive = pathname === '/profile' || pathname.startsWith('/profile/');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
            to="/"
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            className={`${styles.link} ${isFeedActive ? styles.link_active : ''} ml-10`}
            to="/feed"
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <NavLink
          className={`${styles.link} ${styles.link_position_last} ${
            isProfileActive ? styles.link_active : ''
          }`}
          to="/profile"
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};
