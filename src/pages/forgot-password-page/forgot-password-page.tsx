import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@utils/api';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

const PASSWORD_RESET_ALLOWED_KEY = 'passwordResetAllowed';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    void forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem(PASSWORD_RESET_ALLOWED_KEY, 'true');
        void navigate('/reset-password');
      })
      .catch((submitError: unknown) => {
        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Не удалось отправить запрос'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <div className={styles.fields}>
          <EmailInput
            name="email"
            placeholder="Укажите e-mail"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        {error && (
          <p className={`${styles.error} text text_type_main-default`}>{error}</p>
        )}
        <div className={`${styles.actions} mt-6 mb-20`}>
          <Button disabled={isLoading} htmlType="submit" type="primary" size="medium">
            Восстановить
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
