import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import type { ChangeEvent, FormEvent } from 'react';

import styles from './profile-page.module.css';

const getProfileLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link} ${
    isActive ? styles.link_active : styles.link_inactive
  } text text_type_main-medium mb-6`;

export const ProfileContent = (): React.JSX.Element => {
  const [name, setName] = useState('Марк');
  const [email, setEmail] = useState('mail@stellar.burgers');
  const [password, setPassword] = useState('******');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        name="name"
        placeholder="Имя"
        icon="EditIcon"
        value={name}
        onChange={handleNameChange}
      />
      <Input
        name="email"
        placeholder="Логин"
        icon="EditIcon"
        value={email}
        onChange={handleEmailChange}
      />
      <PasswordInput
        name="password"
        placeholder="Пароль"
        icon="EditIcon"
        value={password}
        onChange={handlePasswordChange}
      />
    </form>
  );
};

export const ProfilePage = (): React.JSX.Element => {
  return (
    <main className={`${styles.profile} mt-20 ml-10 mr-10`}>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
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
          <p
            className={`${styles.help} text text_type_main-default text_color_inactive`}
          >
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </div>
        <Outlet />
      </div>
    </main>
  );
};
