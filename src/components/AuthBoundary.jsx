import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const AuthBoundary = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export default AuthBoundary;

