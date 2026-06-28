import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '@services/actions/auth-actions';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectAuthLoading } from '@services/slices/auth-slice';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

type TLocationState = {
  from?: {
    hash: string;
    pathname: string;
    search: string;
  };
};

const getSubmitErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Не удалось войти';
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitError('');

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const { from } = (location.state as TLocationState | null) ?? {};
        const redirectTo = from
          ? `${from.pathname}${from.search}${from.hash}`
          : '/';

        void navigate(redirectTo, { replace: true });
      })
      .catch((error: unknown) => {
        setSubmitError(getSubmitErrorMessage(error));
      });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <div className={styles.fields}>
          <EmailInput
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
          />
          <PasswordInput
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {submitError && (
          <p className={`${styles.error} text text_type_main-default`}>
            {submitError}
          </p>
        )}
        <div className={`${styles.actions} mt-6 mb-20`}>
          <Button disabled={isLoading} htmlType="submit" type="primary" size="medium">
            Войти
          </Button>
        </div>
        <ul className={styles.links}>
          <li className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?{' '}
            <Link className={styles.link} to="/register">
              Зарегистрироваться
            </Link>
          </li>
          <li className="text text_type_main-default text_color_inactive">
            Забыли пароль?{' '}
            <Link className={styles.link} to="/forgot-password">
              Восстановить пароль
            </Link>
          </li>
        </ul>
      </form>
    </main>
  );
};
