import { useCallback } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Modal } from '@components/modal/modal';
import { FeedPage } from '@pages/feed-page/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page/forgot-password-page';
import { Home } from '@pages/home/home';
import { IngredientDetailsPage } from '@pages/ingredient-details-page/ingredient-details-page';
import { LoginPage } from '@pages/login-page/login-page';
import { NotFoundPage } from '@pages/not-found-page/not-found-page';
import { ProfileOrderPage } from '@pages/profile-order-page/profile-order-page';
import {
  ProfileContent,
  ProfilePage,
} from '@pages/profile-page/profile-page';
import { RegisterPage } from '@pages/register-page/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page/reset-password-page';

import styles from './app.module.css';

type TLocationState = {
  backgroundLocation?: ReturnType<typeof useLocation>;
};

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { backgroundLocation } = (location.state as TLocationState | null) ?? {};

  const handleIngredientModalClose = useCallback((): void => {
    void navigate('/');
  }, [navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<Home />} />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route index element={<ProfileContent />} />
          <Route path="orders" element={<ProfileOrderPage />} />
        </Route>
        <Route path="/feed" element={<FeedPage />} />
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
        </Routes>
      )}
    </div>
  );
};

export default App;
