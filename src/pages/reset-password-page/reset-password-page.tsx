import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@utils/api';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

const PASSWORD_RESET_ALLOWED_KEY = 'passwordResetAllowed';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(PASSWORD_RESET_ALLOWED_KEY)) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    void resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem(PASSWORD_RESET_ALLOWED_KEY);
        void navigate('/login', { replace: true });
      })
      .catch((submitError: unknown) => {
        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Не удалось сохранить новый пароль'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setToken(event.target.value);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <div className={styles.fields}>
          <PasswordInput
            name="password"
            placeholder="Введите новый пароль"
            value={password}
            onChange={handlePasswordChange}
          />
          <Input
            name="token"
            placeholder="Введите код из письма"
            value={token}
            onChange={handleTokenChange}
          />
        </div>
        {error && <p className={`${styles.error} text text_type_main-default`}>{error}</p>}
        <div className={`${styles.actions} mt-6 mb-20`}>
          <Button disabled={isLoading} htmlType="submit" type="primary" size="medium">
            Сохранить
          </Button>
        </div>
        <ul className={styles.links}>
          <li className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?{' '}
            <Link className={styles.link} to="/login">
              Войти
            </Link>
          </li>
        </ul>
      </form>
    </main>
  );
};
