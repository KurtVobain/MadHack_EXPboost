
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '../stores/AuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // if (!isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;