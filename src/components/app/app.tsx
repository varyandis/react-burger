import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed-page/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { Home } from '@pages/home/home';
import { IngredientDetailsPage } from '@pages/ingredient-details-page/ingredient-details-page';
import { LoginPage } from '@pages/login-page/login-page';
import { NotFoundPage } from '@pages/not-found-page/not-found-page';
import { OrderInfoPage } from '@pages/order-info-page/order-info-page';
import { ProfileOrderPage } from '@pages/profile-order-page/profile-order-page';
import { ProfileContent, ProfilePage } from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';
import { checkAuth } from '@services/actions/auth-actions';
import { fetchIngredients } from '@services/actions/ingredients-actions';
import { useAppDispatch } from '@services/hooks';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: ReturnType<typeof useLocation>;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { backgroundLocation } = (location.state as TLocationState | null) ?? {};

  useEffect(() => {
    void dispatch(checkAuth());
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientModalClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route element={<ProtectedRoute anonymousOnly />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />}>
            <Route index element={<ProfileContent />} />
            <Route path="orders" element={<ProfileOrderPage />} />
          </Route>
        </Route>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<OrderInfoPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile/orders/:id" element={<OrderInfoPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleIngredientModalClose}>
                <IngredientDetailsPage isModal />
              </Modal>
            }
          />
          <Route
            path="/feed/:id"
            element={
              <Modal
                ariaLabel="Информация о заказе"
                onClose={handleIngredientModalClose}
              >
                <OrderInfo isModal />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <Modal
                  ariaLabel="Информация о заказе"
                  onClose={handleIngredientModalClose}
                >
                  <OrderInfo isModal />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
