import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logoutUser, updateUser } from '@services/actions/auth-actions';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectAuthLoading, selectUser } from '@services/slices/auth-slice';

import type { ChangeEvent, FormEvent } from 'react';

import styles from './profile-page.module.css';

const getProfileLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.link} ${
    isActive ? styles.link_active : styles.link_inactive
  } text text_type_main-medium mb-6`;

const getSubmitErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Не удалось обновить профиль';
};

export const ProfileContent = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const initialName = user?.name ?? '';
  const initialEmail = user?.email ?? '';
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
    setPassword('');
  }, [initialEmail, initialName]);

  const isFormChanged = useMemo(
    () => name !== initialName || email !== initialEmail || password.length > 0,
    [email, initialEmail, initialName, name, password]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitError('');

    void dispatch(updateUser({ email, name, password }))
      .unwrap()
      .then(() => {
        setPassword('');
      })
      .catch((error: unknown) => {
        setSubmitError(getSubmitErrorMessage(error));
      });
  };

  const handleCancel = (): void => {
    setName(initialName);
    setEmail(initialEmail);
    setPassword('');
    setSubmitError('');
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
      {submitError && (
        <p className={`${styles.error} text text_type_main-default`}>{submitError}</p>
      )}
      {isFormChanged && (
        <div className={styles.actions}>
          <Button
            disabled={isLoading}
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button disabled={isLoading} htmlType="submit" type="primary" size="medium">
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

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
              onClick={handleLogout}
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
