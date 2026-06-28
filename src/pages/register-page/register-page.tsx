import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { ChangeEvent, FormEvent } from 'react';

import styles from '../auth-form.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <div className={styles.fields}>
          <Input
            name="name"
            placeholder="Имя"
            value={name}
            onChange={handleNameChange}
          />
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
        <div className={`${styles.actions} mt-6 mb-20`}>
          <Button htmlType="submit" type="primary" size="medium">
            Зарегистрироваться
          </Button>
        </div>
        <ul className={styles.links}>
          <li className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?{' '}
            <Link className={styles.link} to="/login">
              Войти
            </Link>
          </li>
        </ul>
      </form>
    </main>
  );
};
