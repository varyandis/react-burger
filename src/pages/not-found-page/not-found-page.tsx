import { Link } from 'react-router-dom';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className="mt-20">
      <h1 className="text text_type_main-large">Страница не найдена</h1>
      <p className="text text_type_main-default text_color_inactive mt-6 mb-6">
        Проверьте адрес или вернитесь на главную страницу.
      </p>
      <Link
        className="text text_type_main-default"
        style={{ color: 'var(--colors-interface-accent, #4c4cff)' }}
        to="/"
      >
        На главную
      </Link>
    </main>
  );
};
