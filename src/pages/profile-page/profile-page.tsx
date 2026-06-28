import { Link, Outlet } from 'react-router-dom';

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
    <main className="mt-20 ml-10 mr-10">
      <div style={{ display: 'flex', gap: 60 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', minWidth: 320 }}>
          <Link className="text text_type_main-medium mb-6" to="/profile">
            Профиль
          </Link>
          <Link className="text text_type_main-medium mb-6" to="/profile/orders">
            История заказов
          </Link>
          <Link className="text text_type_main-medium text_color_inactive" to="/login">
            Выход
          </Link>
        </nav>
        <Outlet />
      </div>
    </main>
  );
};
