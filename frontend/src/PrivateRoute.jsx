import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

const PrivateRoute = ({ roles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    // Redirect based on role mismatch
    return user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/worker" replace />;
  }
  return <Outlet />;
};

export default PrivateRoute;