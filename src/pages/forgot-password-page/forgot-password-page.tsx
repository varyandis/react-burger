import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
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
        <div className={`${styles.actions} mt-6 mb-20`}>
          <Button htmlType="submit" type="primary" size="medium">
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
