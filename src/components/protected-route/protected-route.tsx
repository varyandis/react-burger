import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { selectIsAuthenticated, selectIsAuthChecked } from '@services/slices/auth-slice';

import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  anonymousOnly?: boolean;
  children?: ReactNode;
};

export const ProtectedRoute = ({
  anonymousOnly = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (anonymousOnly && isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  if (!anonymousOnly && !isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children ? <>{children}</> : <Outlet />;
};
